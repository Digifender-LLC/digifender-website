const cards=[...document.querySelectorAll('.concept-card')];
let saved=new Set(['06','08','04','05']);
try {const raw=JSON.parse(localStorage.getItem('digifender-concepts-shortlist-r3')||'["06","08","04","05"]');if(Array.isArray(raw))saved=new Set(raw.filter(id=>cards.some(c=>c.dataset.id===id)));} catch {}
let currentFilter='all', savedOnly=false;
const selected=new Set();
const status=document.getElementById('selection-status');
const shortlist=document.getElementById('show-shortlist');
function render(){
  let visible=0;
  for(const card of cards){
    card.hidden=(currentFilter!=='all'&&card.dataset.tone!==currentFilter&&card.dataset.status!==currentFilter)||(savedOnly&&!saved.has(card.dataset.id));
    if(!card.hidden)visible++;
    const b=card.querySelector('.save');b.setAttribute('aria-pressed',String(saved.has(card.dataset.id)));b.textContent=saved.has(card.dataset.id)?'♥':'♡';
  }
  document.querySelectorAll('[data-group-label]').forEach(label=>{label.hidden=!cards.some(c=>!c.hidden&&c.dataset.status===label.dataset.groupLabel);});
  document.getElementById('shortlist-count').textContent=saved.size;
  document.querySelector('.empty-state').hidden=visible>0;
  document.querySelector('.empty-state').textContent=savedOnly?'No saved concepts in this view. Try All directions, or add a concept with its heart button.':'No concepts in this view.';
}
document.querySelectorAll('[data-save]').forEach(b=>b.addEventListener('click',()=>{
  const id=b.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);
  try{localStorage.setItem('digifender-concepts-shortlist-r3',JSON.stringify([...saved]));}catch{}
  status.textContent=`${saved.size} concepts shortlisted.`;render();
}));
shortlist.addEventListener('click',()=>{savedOnly=!savedOnly;shortlist.setAttribute('aria-pressed',String(savedOnly));render();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  currentFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});render();
}));
document.querySelectorAll('[data-compare]').forEach(input=>input.addEventListener('change',()=>{
  if(input.checked&&selected.size===2){input.checked=false;status.textContent='Choose up to two concepts. Uncheck one to change your comparison.';return;}
  if(input.checked)selected.add(input.value);else selected.delete(input.value);
  document.getElementById('compare-count').textContent=`${selected.size} / 2`;
  document.getElementById('compare').disabled=selected.size!==2;
  document.querySelectorAll('[data-compare]').forEach(el=>{el.disabled=selected.size===2&&!el.checked;});
  status.textContent=`${selected.size} of 2 concepts selected for comparison.`;
}));
const dialog=document.getElementById('comparison');
document.getElementById('compare').addEventListener('click',()=>{
  const target=document.getElementById('comparison-frames');target.replaceChildren();
  for(const id of selected){
    const name=cards.find(c=>c.dataset.id===id).querySelector('h2').textContent;
    const section=document.createElement('section');const heading=document.createElement('h3');heading.textContent=`${id} / ${name}`;
    const link=document.createElement('a');link.href=`${id}.html`;link.textContent='Open full size ↗';
    const frame=document.createElement('iframe');frame.src=`${id}.html?embed=1`;frame.title=`${name} comparison`;
    section.append(heading,link,frame);target.append(section);
  }
  dialog.showModal();document.body.style.overflow='hidden';
});
function closeComparison(){dialog.close();document.body.style.overflow='';}
document.getElementById('close-comparison').addEventListener('click',closeComparison);
dialog.addEventListener('close',()=>{document.body.style.overflow='';document.getElementById('comparison-frames').replaceChildren();});
render();
