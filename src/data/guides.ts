export const guides = [
  { id:'quick-start', title:'Quick start', body:'Choose a component in Explore, inspect its supported states, then open it in Playground. Adjust only the controls that component supports and copy the generated React + Tailwind source.' },
  { id:'install', title:'Install dependencies', body:'Add the dependencies shown beside the exported component. The UIVEX app uses React, Tailwind CSS, Motion, GSAP, and Lucide; an individual export lists only what it imports.' },
  { id:'react-tailwind', title:'React + Tailwind usage', body:'Paste the component into your source tree, install listed packages, and ensure Tailwind scans the new file. Generated inline values preserve the selected accent, spacing, and radius.' },
  { id:'copy-export', title:'Copy and export', body:'Copy places the current generated source on the clipboard. Download saves the same source as a .tsx file. If clipboard access is blocked, select the visible code manually.' },
  { id:'editing', title:'Editing components', body:'The inspector validates each value before updating the trusted preview. UIVEX never executes pasted JavaScript and does not use eval.' },
  { id:'variants', title:'Variants and states', body:'Variants change maintained visual structures. State simulation demonstrates supported disabled, loading, focus, pressed, error, or success behavior without inventing unsupported props.' },
  { id:'responsive', title:'Responsive checks', body:'Use width presets from 320 to 1440 pixels. The canvas width represents the component container—not your physical device—and may scroll inside the studio.' },
  { id:'accessibility', title:'Accessibility principles', body:'Exports use semantic controls, accessible labels, visible focus, and reduced-motion handling where relevant. These checks are useful heuristics, not a claim of WCAG certification.' },
  { id:'storage', title:'Local storage & privacy', body:'Favorites, presets, theme, and recent items remain in this browser. Nothing is uploaded. Export workspace JSON to move valid settings manually.' },
  { id:'troubleshooting', title:'Troubleshooting', body:'If copy fails, use the visible source. If storage is blocked, work continues for the current session. An invalid import is rejected without replacing existing data.' },
]
