const origin=process.env.UIVEX_QA_ORIGIN??'http://127.0.0.1:4173'
const cdp=process.env.UIVEX_CDP??'http://127.0.0.1:9223'
const sizes=[[320,568],[360,800],[375,812],[390,844],[430,932],[667,375],[844,390],[768,1024],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440]]
const core=['/','/explore','/playground/command-button','/workspace']
const supporting=['/guide','/about','/changelog','/components/css-clamp-generator','/icons']
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))

async function tab(){const response=await fetch(`${cdp}/json/new?${encodeURIComponent(origin)}`,{method:'PUT'});if(!response.ok)throw new Error(`CDP tab: ${response.status}`);return response.json()}
async function session(url){const socket=new WebSocket(url);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});let id=0;const pending=new Map();socket.onmessage=event=>{const value=JSON.parse(event.data);if(value.id&&pending.has(value.id)){const {resolve,reject}=pending.get(value.id);pending.delete(value.id);value.error?reject(new Error(value.error.message)):resolve(value.result)}};return{call(method,params={}){return new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket.send(JSON.stringify({id:next,method,params}))})},close(){socket.close()}}}
const expression=`(()=>{const root=document.documentElement,body=document.body;const viewport=innerWidth;const selectors=['main','.site-header','.container','.studio-grid','.creative-grid','.workspace-card-grid','.guide-layout','.detail-grid','.icon-workbench'];const clipped=[];for(const selector of selectors){for(const node of document.querySelectorAll(selector)){const r=node.getBoundingClientRect();if(r.width>0&&(r.left < -1||r.right>viewport+1))clipped.push({selector,left:Math.round(r.left),right:Math.round(r.right),viewport})}}return{path:location.pathname,title:document.title,width:viewport,scrollWidth:Math.max(root.scrollWidth,body?.scrollWidth??0),clipped}})()`
const target=await tab(),client=await session(target.webSocketDebuggerUrl),failures=[]
try{
 await client.call('Page.enable')
 for(const [width,height] of sizes){
  const routes=[...core,...([320,768,1440].includes(width)?supporting:[])]
  for(const path of routes){
   await client.call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700,screenWidth:width,screenHeight:height})
   await client.call('Page.navigate',{url:origin+path});await wait(280)
   const {result}=await client.call('Runtime.evaluate',{expression,returnByValue:true});const value=result.value
   if(value.scrollWidth>width+1||value.clipped.length)failures.push({width,height,path,...value})
  }
 }
 for(const width of [320,768,1440]){await client.call('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:900,deviceScaleFactor:1,mobile:width<700});await client.call('Page.navigate',{url:origin+'/explore'});await wait(220);await client.call('Runtime.evaluate',{expression:`document.documentElement.classList.add('light')`});await wait(80);const {result}=await client.call('Runtime.evaluate',{expression,returnByValue:true});const value=result.value;if(value.scrollWidth>width+1||value.clipped.length)failures.push({theme:'light',width,path:'/explore',...value})}
}finally{client.close();await fetch(`${cdp}/json/close/${target.id}`).catch(()=>{})}
console.log(JSON.stringify({checks:sizes.length*core.length+3*supporting.length+3,failures},null,2))
if(failures.length)process.exitCode=1
