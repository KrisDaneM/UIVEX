import { writeFile } from 'node:fs/promises'

const topics = [
  ['magnetic button','Buttons'],['hold to confirm button','Buttons'],['animated border button','Buttons'],['copy to clipboard button','Buttons'],['download progress button','Buttons'],
  ['floating label input','Forms'],['OTP input','Forms'],['password strength field','Forms'],['autocomplete input','Forms'],['tag input','Forms'],['searchable multi select','Forms'],['date range selector','Forms'],['file upload queue','Forms'],['range slider','Forms'],['rating input','Forms'],
  ['animated tabs','Navigation'],['collapsible sidebar','Navigation'],['breadcrumb navigation','Navigation'],['responsive mega menu','Navigation'],['command palette','Navigation'],['mobile bottom navigation','Navigation'],['tree navigation','Navigation'],
  ['interactive profile card','Cards'],['perspective product card','Cards'],['flip information card','Cards'],['comparison card','Cards'],['timeline card','Cards'],['interactive media card','Cards'],
  ['toast notification','Feedback'],['undo snackbar','Feedback'],['notification drawer','Feedback'],['confirmation modal','Overlays'],['contextual popover','Overlays'],['accessible tooltip','Overlays'],
  ['waveform loader','Loaders'],['skeleton loader','Loaders'],['progress ring','Loaders'],['liquid progress bar','Loaders'],
  ['sparkline chart','Data'],['radial gauge','Data'],['animated bar chart','Data'],['calendar heatmap','Data'],['donut chart','Data'],['sortable data table','Data'],
  ['image carousel','Media'],['image cropper','Media'],['audio waveform player','Media'],['responsive bento grid','Layouts'],['drag and drop kanban board','Layouts'],['animated accordion','Layouts'],
]

const groups = [
  { name:'Core React component discovery', intent:'Commercial investigation', priority:'Primary', target:'/explore', usage:'Category introductions and Explore headings', phrase:(topic)=>`React ${topic} component` },
  { name:'Accessible implementation patterns', intent:'Accessibility-focused implementation', priority:'Primary', target:'/guide', usage:'Accessibility guidance and component notes', phrase:(topic)=>`accessible ${topic} for React` },
  { name:'TypeScript animation examples', intent:'Technical implementation', priority:'Secondary', target:'/components/:slug', usage:'Relevant component descriptions and detail-page source context', phrase:(topic)=>`animated ${topic} TypeScript example` },
  { name:'Live customization intent', intent:'Product evaluation', priority:'Primary', target:'/playground', usage:'Playground explanations and internal links', phrase:(topic)=>`customizable ${topic} live preview` },
  { name:'Tailwind CSS implementation', intent:'Technical implementation', priority:'Primary', target:'/components/:slug', usage:'Dependency notes and component documentation', phrase:(topic)=>`${topic} with Tailwind CSS` },
  { name:'Responsive UI patterns', intent:'Responsive design research', priority:'Secondary', target:'/explore', usage:'Category copy and responsive behavior notes', phrase:(topic)=>`responsive ${topic} UI pattern` },
  { name:'Reusable source code', intent:'Code acquisition', priority:'Primary', target:'/components/:slug', usage:'Source panels, titles, and copy/download labels', phrase:(topic)=>`${topic} source code` },
  { name:'Frontend design inspiration', intent:'Visual inspiration', priority:'Secondary', target:'/explore', usage:'Curated component summaries without keyword repetition', phrase:(topic)=>`modern ${topic} design inspiration` },
  { name:'Microinteraction research', intent:'Interaction design research', priority:'Secondary', target:'/components/:slug', usage:'Behavior notes and animation descriptions', phrase:(topic)=>`interactive ${topic} microinteraction` },
  { name:'How-to learning queries', intent:'Informational learning', priority:'Secondary', target:'/guide', usage:'Future substantive guide examples and internal links', phrase:(topic)=>`how to build a ${topic} in React` },
]

let output = `# UIVEX SEO Keyword Strategy\n\nThis research set contains **${topics.length * groups.length} unique keyword and search-phrase ideas** grounded in components and workflows that UIVEX actually provides. It is a content-planning resource—not a meta-keywords list. Use phrases naturally where they answer user intent; do not paste them into hidden blocks or create thin doorway pages. No search-volume or difficulty figures are claimed.\n\n## Usage principles\n\n- Give each public page one primary topic and a small number of closely related secondary phrases.\n- Keep titles, descriptions, headings, and body copy useful to people first.\n- Consolidate overlapping intent into strong category, component detail, Playground, and Guide content.\n- Map \`/components/:slug\` suggestions only to a matching registered component; never generate a page for a nonexistent pattern.\n- Reassess wording as the registry grows and as real search-performance data becomes available.\n\n`
let number = 1
for (const group of groups) {
  output += `## ${group.name}\n\n| Field | Recommendation |\n|---|---|\n| Search intent | ${group.intent} |\n| Related categories | Buttons, Forms, Navigation, Cards, Feedback, Overlays, Loaders, Data, Media, and Layouts as applicable |\n| Suggested target | \`${group.target}\` |\n| Priority | ${group.priority} |\n| Natural usage | ${group.usage} |\n\n`
  for (const [topic, category] of topics) output += `${number++}. **${group.phrase(topic)}** — Category: ${category}; target: \`${group.target}\`; ${group.priority.toLowerCase()} priority.\n`
  output += '\n'
}

await writeFile(new URL('../docs/UIVEX_SEO_KEYWORDS.md', import.meta.url), output)
console.log(`Wrote ${number - 1} keyword ideas.`)
