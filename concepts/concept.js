if (new URLSearchParams(location.search).has('embed')) document.documentElement.classList.add('embedded');
const tabs = [...document.querySelectorAll('[data-product-switcher] [data-brand]')];
function selectBrand(tab) {
  tabs.forEach(t=> { const selected=t===tab; t.setAttribute('aria-selected',String(selected)); t.tabIndex=selected?0:-1; document.getElementById(t.getAttribute('aria-controls')).hidden=!selected; });
}
tabs.forEach((tab,i)=> {
  tab.addEventListener('click',()=>selectBrand(tab));
  tab.addEventListener('keydown',e=> {
    let next;
    if (e.key==='ArrowRight') next=tabs[(i+1)%tabs.length];
    if (e.key==='ArrowLeft') next=tabs[(i+tabs.length-1)%tabs.length];
    if (e.key==='Home') next=tabs[0];
    if (e.key==='End') next=tabs.at(-1);
    if(next) {e.preventDefault();selectBrand(next);next.focus();}
  });
});
document.querySelectorAll('[data-open-brand]').forEach(link=>{
  link.addEventListener('click',()=>{
    const tab=tabs.find(t=>t.dataset.brand===link.dataset.openBrand);
    if(tab)selectBrand(tab);
  });
});
