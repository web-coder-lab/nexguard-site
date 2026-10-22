const tabs=[...document.querySelectorAll('[role="tab"]')];
if(tabs.length){
 const panels=[...document.querySelectorAll('[data-tab-panel]')];
 const show=id=>{tabs.forEach(t=>t.setAttribute('aria-selected',String(t.dataset.tab===id)));panels.forEach(p=>p.hidden=p.dataset.tabPanel!==id)};
 tabs.forEach(t=>t.onclick=()=>{show(t.dataset.tab);history.replaceState(null,'','#'+t.dataset.tab)});
 const hash=location.hash.slice(1);show(tabs.some(t=>t.dataset.tab===hash)?hash:tabs[0].dataset.tab);
}
