/* Two compact homepage choices, with one content panel open at a time.
   Uses actual buttons/ARIA so both mouse and keyboard navigation work. */
(function () {
  "use strict";
  const names=["study-guide","home-progress"];
  function init(){
    const controls=Array.from(document.querySelectorAll("[data-home-panel]"));
    if (controls.length!==2) return;
    const panels=new Map(names.map(id=>[id,document.getElementById(id)]));
    if (names.some(id=>!panels.get(id))) return;
    function show(id,options={}){
      const next=names.includes(id)?id:null;
      for (const button of controls){
        const active=next===button.dataset.homePanel;
        button.classList.toggle("is-selected",active);
        button.setAttribute("aria-expanded",String(active));
        const action=button.querySelector(".home-hub-choice-action");
        if(action)action.firstChild.textContent=active?"Close ":"Open ";
      }
      for(const [name,panel] of panels){
        panel.hidden=next!==name;
      }
      if(options.url){
        const url=window.location.pathname+window.location.search+(next?"#"+next:"");
        window.history.replaceState(null,"",url);
      }
      if(next&&options.scroll){
        window.requestAnimationFrame(()=>{
          panels.get(next)?.scrollIntoView({
            behavior:options.instant?"instant":"smooth",
            block:"start"
          });
        });
      }
    }
    controls.forEach(button=>button.addEventListener("click",()=>{
      const id=button.dataset.homePanel;
      const next=button.getAttribute("aria-expanded")==="true"?null:id;
      show(next,{url:true,scroll:!!next});
    }));
    const fromHash=()=>window.location.hash.slice(1);
    if(names.includes(fromHash())) show(fromHash(),{scroll:true,instant:true});
    else show(null);
    window.addEventListener("hashchange",()=>{
      const id=fromHash();
      if(names.includes(id))show(id,{scroll:true});
    });
  }
  document.addEventListener("DOMContentLoaded",init);
})();
