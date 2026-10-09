/* Lightweight homepage fluency overview. No private data read for guests. */
(function () {
  "use strict";
  const MAX = {vocab:524,formula:104};
  const KEYS = {vocab:"absoluteprep_vocab_state",formula:"lexlogica_formula_fluency_state_v1"};
  const byId = id => document.getElementById(id);
  const read = key => {
    try { return JSON.parse(localStorage.getItem(key) || "null"); }
    catch { return null; }
  };
  function getStats(type) {
    const state=read(KEYS[type]) || {};
    const learned=new Set();
    const review=new Set();
    for (const [id,entry] of Object.entries(state)) {
      if (entry && typeof entry==="object") {
        if (entry.solved===true) learned.add(id);
        if (entry.review===true) review.add(id);
      }
    }
    // Vocab's legacy formats are still recognized by the vocabulary page.
    if (type==="vocab") {
      if (state.solved && typeof state.solved==="object") {
        for (const [id,flag] of Object.entries(state.solved))
          if (flag===true) learned.add(id);
      }
      if (state.review && typeof state.review==="object") {
        for (const [id,flag] of Object.entries(state.review))
          if (flag===true) review.add(id);
      }
      const legacy=read("absoluteprep_vocab_learned") || {};
      for (const [id,flag] of Object.entries(legacy))
        if (flag===true) learned.add(id);
    }
    const known=Math.min(MAX[type],learned.size);
    return {known,remaining:MAX[type]-known,review:Math.min(MAX[type],review.size)};
  }
  function paint(type,guest) {
    const prefix=type==="vocab"?"sg-vocab":"sg-formula";
    const status=byId(prefix+"-status");
    const detail=byId(prefix+"-detail");
    const action=byId(prefix+"-practice");
    if (!status||!detail||!action) return;
    if (guest) {
      status.textContent=type==="vocab"
        ?"Explore 524 SAT-relevant words"
        :"Explore 104 formula cards";
      detail.textContent="Preview a 10-card recall session";
      action.href="/login?redirect="+encodeURIComponent(
        type==="vocab"?"/vocab?study=10":"/math-fluency?study=10"
      );
      return;
    }
    const result=getStats(type);
    status.textContent=result.remaining+" to learn · "+result.known+" known";
    detail.textContent=result.review+" marked for review · up to 10 cards per session";
    action.href=type==="vocab"?"/vocab?study=10":"/math-fluency?study=10";
  }
  async function refresh() {
    if (!byId("sg-fluency-practice")&&!byId("sg-vocab-summary")) return;
    let authenticated=false;
    try {
      if (typeof absolutePrepSupabase!=="undefined") {
        const {data,error}=await absolutePrepSupabase.auth.getSession();
        authenticated=!error&&!!data?.session&&(
          typeof isAbsolutePrepGoogleSession!=="function"||
          isAbsolutePrepGoogleSession(data.session)
        );
      }
    } catch(error) { console.warn("Could not load fluency status:",error); }
    paint("vocab",!authenticated);
    paint("formula",!authenticated);
  }
  document.addEventListener("DOMContentLoaded",refresh);
  window.addEventListener("pageshow",refresh);
  window.addEventListener("storage",event=>{
    if (Object.values(KEYS).includes(event.key)||event.key==="absoluteprep_vocab_learned")
      refresh();
  });
})();
