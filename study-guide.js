(function () {
  "use strict";
  const BASELINE_PREFIX = "lexlogica-study-baseline:v1:";
  const GOAL_PREFIX = "lexlogica-study-goal:v1:";
  const CHECK_PREFIX = "lexlogica-study-checks:v1:";
  const mockPrefix = "lexlogica-mock-state:";
  const $ = id => document.getElementById(id);
  let userId = "";
  let baseline = null;
  let priorities = {readingWriting:[],math:[]};
  let scores = [];
  let goal = null;

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const escapeHtml = s => String(s == null ? "" : s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const scoreValid = (n, min, max) =>
    Number.isFinite(Number(n)) && Number(n)>=min && Number(n)<=max && Number(n)%10===0;
  function getScores(state) {
    if (!state || !state.completed) return null;
    const saved = state.satScores || {};
    if (scoreValid(saved.composite,400,1600) &&
      scoreValid(saved.readingWriting,200,800) &&
      scoreValid(saved.math,200,800)) {
      return {composite:Number(saved.composite),readingWriting:Number(saved.readingWriting),math:Number(saved.math)};
    }
    const m=state.completedModules||{};
    if (!(m.rw_m1&&m.rw_m2&&m.math_m1&&m.math_m2)) return null;
    const rw=Math.max(0,Math.min(54,Number(m.rw_m1.correct||0)+Number(m.rw_m2.correct||0)));
    const math=Math.max(0,Math.min(44,Number(m.math_m1.correct||0)+Number(m.math_m2.correct||0)));
    const round=x=>10*Math.round(x/10);
    return {composite:round(400+600*(rw/54+math/44)),
      readingWriting:round(200+600*rw/54),math:round(200+600*math/44)};
  }
  function savedMock(n) {
    return read(mockPrefix+userId+":mock-test-"+n,null);
  }
  function displayScores() {
    const starting=getScores(baseline);
    const withScores=scores.filter(row=>row.scores).sort((a,b)=>a.time-b.time||a.n-b.n);
    const newest=withScores.length?withScores[withScores.length-1]:null;
    const current=newest?newest.scores:starting;
    $("sg-start-score").textContent=starting.composite;
    $("sg-start-sections").textContent="R&W "+starting.readingWriting+" · Math "+starting.math;
    $("sg-current-score").textContent=current.composite;
    $("sg-current-note").textContent=newest&&newest.n!==1?"Mock Test "+newest.n+" · R&W "+current.readingWriting+" · Math "+current.math:"From Mock Test 1";
    if (goal===null) {
      $("sg-progress-wrap").hidden=true;
      $("sg-goal-message").textContent="Set a goal score to unlock a personalized study routine.";
      return;
    }
    if (starting.composite===1600) {
      $("sg-goal-message").textContent="Your starting mock is already at the scale maximum. Focus on consistency and careful review.";
      $("sg-progress-wrap").hidden=true;
      return;
    }
    const gain=goal-starting.composite;
    const achieved=current.composite>=goal;
    const pct=Math.max(0,Math.min(100,Math.round(100*(current.composite-starting.composite)/gain)));
    $("sg-goal-message").textContent=achieved?"You have reached or passed this practice-score goal. Keep refining your weakest skills.":"Your target is "+gain+" points above your starting score. This is a target, not a predicted gain.";
    $("sg-progress-wrap").hidden=false;
    $("sg-progress-description").textContent=achieved?"Goal reached on your most recent mock":"Progress from your baseline";
    $("sg-gap").textContent=achieved?String(current.composite-goal)+" points above goal":String(Math.max(0,goal-current.composite))+" points to go";
    $("sg-progress-fill").style.width=pct+"%";
    $("sg-progress-track").setAttribute("aria-valuenow",String(pct));
  }
  function numeric(value) {
    const s=String(value??"").trim().replace(/,/g,"");
    if(!s)return null;
    const f=s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
    if(f){const d=Number(f[2]);return d?Number(f[1])/d:null;}
    const n=Number(s);return Number.isFinite(n)?n:null;
  }
  function correctAnswer(entry,selected,section) {
    const q=entry.question||{};
    if(selected===undefined||selected===null||String(selected).trim()==="")return false;
    if(q.answerType==="student-response"||q.answer_type==="student-response") {
      const n=numeric(selected);
      return n!==null&&(q.acceptedAnswers||q.accepted_answers||[]).some(a=>{
        const value=numeric(a);return value!==null&&Math.abs(n-value)<=1e-9;
      });
    }
    const original=String(q.correctAnswer||q.correct_answer||"").toUpperCase();
    const order=baseline.choiceOrders?.[section+":"+q.id];
    const expected=Array.isArray(order)&&order.indexOf(original)>=0
      ?"ABCD".charAt(order.indexOf(original)):original;
    return String(selected).trim().toUpperCase()===expected;
  }
  async function getDiagnostic() {
    const response=await fetch("/mock-test-1.json?v=study-guide-1",{cache:"no-store"});
    if(!response.ok)throw new Error("Couldn't load first mock's question metadata");
    const manifest=await response.json();
    const result={readingWriting:[],math:[]};
    for (const section of ["readingWriting","math"]) {
      const blocks=manifest.sections?.[section]||{};
      const low=baseline.routes?.[section]==="low";
      const chosen=[...(blocks.module1||[]),...(low?blocks.module2Low||[]:blocks.module2High||[])];
      const grouped=new Map();
      for(const entry of chosen) {
        const q=entry.question||{};
        const skill=entry.targetSubtopic||q.subtopic||q.skill||"Unclassified";
        let row=grouped.get(skill);
        if(!row){row={skill,total:0,missed:0,correct:0};grouped.set(skill,row);}
        row.total+=1;
        const ans=baseline.answers?.[q.id];
        if(correctAnswer(entry,ans,section))row.correct+=1;
        else row.missed+=1;
      }
      result[section]=[...grouped.values()].sort((a,b)=>
        b.missed-a.missed||
        (b.missed/b.total)-(a.missed/a.total)||
        a.skill.localeCompare(b.skill)
      );
    }
    return result;
  }
  function skillUrl(section,skill) {
    return (section==="math"?"/math-question-bank":"/reading-question-bank")+
      "?skill="+encodeURIComponent(skill);
  }
  function renderPriorities(section,id) {
    const items=priorities[section].filter(x=>x.missed>0).slice(0,4);
    if(!items.length) {
      $(id).innerHTML='<p class="sg-priority-empty">No missed items in this section on your first mock. Use new practice sets to confirm the strengths and maintain accuracy.</p>';
      return;
    }
    $(id).innerHTML=items.map(row=>
      '<div class="sg-priority-item"><div><span class="sg-priority-name">'+escapeHtml(row.skill)+
      '</span><span class="sg-priority-meta">'+row.missed+' missed of '+row.total+' on Mock 1</span></div>'+
      '<a class="sg-priority-link" href="'+escapeHtml(skillUrl(section,row.skill))+'">Practice →</a></div>'
    ).join("");
  }
  function nextTest() {
    const n=[2,3,4,5,6,7,8].find(i=>!scores.some(x=>x.n===i&&x.scores));
    const link=$("sg-next-test-link");
    link.href=n?"/question?mock=mock-test-"+n:"/mock-tests";
    link.textContent=n?"Take Mock Test "+n+" →":"Explore mock tests →";
  }
  function renderWeekly() {
    const starting=getScores(baseline);
    const gap=goal-starting.composite;
    const rw=priorities.readingWriting.find(x=>x.missed>0);
    const ma=priorities.math.find(x=>x.missed>0);
    const rwLabel=rw?rw.skill:"a Reading & Writing skill";
    const maLabel=ma?ma.skill:"a Math skill";
    const work=gap>200?"four":"three";
    const tasks=[
      {title:"Review your first mock",text:"Revisit the missed and unanswered questions. Write down whether each error came from understanding, method, or pacing.",link:"/question?mock=mock-test-1",label:"Review Mock 1 →"},
      {title:"Target Reading & Writing",text:"Complete around 15–20 questions focused on "+rwLabel+". Review the explanations and repeat weak skills before moving on.",link:rw?skillUrl("readingWriting",rw.skill):"/reading-question-bank",label:"Open R&W practice →"},
      {title:"Target Math",text:"Complete around 15–20 questions focused on "+maLabel+". Start with clarity and accuracy, then work toward harder examples.",link:ma?skillUrl("math",ma.skill):"/math-question-bank",label:"Open Math practice →"},
      {title:"Verify and retest",text:"Spread focused practice over "+work+" study sessions this week. Once the skill feels reliable across new questions, schedule another full mock.",link:"/mock-tests",label:"View mock tests →"}
    ];
    const storage=CHECK_PREFIX+userId;
    const checks=read(storage,{});
    $("sg-weekly-plan").innerHTML=tasks.map((task,i)=>
      '<div class="sg-check-card'+(checks[i]?" is-done":"")+'">'+
      '<input type="checkbox" data-guide-check="'+i+'" aria-label="Complete: '+escapeHtml(task.title)+'" '+(checks[i]?"checked":"")+'>'+
      '<div><h3>'+(i+1)+'. '+escapeHtml(task.title)+'</h3><p>'+escapeHtml(task.text)+'</p>'+
      '<a href="'+escapeHtml(task.link)+'">'+escapeHtml(task.label)+'</a></div></div>'
    ).join("");
  }
  function showPlan() {
    const show=goal!==null;
    $("sg-plan-content").hidden=!show;
    if(!show)return;
    renderPriorities("readingWriting","sg-rw-priorities");
    renderPriorities("math","sg-math-priorities");
    renderWeekly();
    nextTest();
  }
  function captureOriginal(state) {
    if(!getScores(state))return null;
    const snapshot={
      testId:"mock-test-1",completed:true,completedAt:state.completedAt,
      satScores:state.satScores,completedModules:state.completedModules,
      routes:state.routes||{},answers:state.answers||{},
      choiceOrders:state.choiceOrders||{}
    };
    write(BASELINE_PREFIX+userId,snapshot);
    return snapshot;
  }
  async function init() {
    try {
      if(!window.absolutePrepSupabase)throw new Error("Authentication unavailable");
      const {data,error}=await absolutePrepSupabase.auth.getSession();
      if(error||!data?.session){
        location.replace("/login?redirect="+encodeURIComponent("/study-guide"));
        return;
      }
      userId=data.session.user.id;
      baseline=read(BASELINE_PREFIX+userId,null);
      if(!getScores(baseline))baseline=captureOriginal(savedMock(1));
      $("study-guide-loading").hidden=true;
      if(!baseline){
        $("study-guide-empty").hidden=false;
        return;
      }
      scores=[];
      for(let n=1;n<=8;n++){
        const state=savedMock(n),sc=getScores(state);
        if(sc)scores.push({n,scores:sc,time:Date.parse(state.completedAt||state.startedAt||"")||n});
      }
      if(!scores.some(x=>x.n===1))scores.push({n:1,scores:getScores(baseline),time:Date.parse(baseline.completedAt||"")||0});
      goal=read(GOAL_PREFIX+userId,null);
      const start=getScores(baseline).composite;
      if(!scoreValid(goal,400,1600)||Number(goal)<=start)goal=null;
      else goal=Number(goal);
      $("sg-goal-input").value=goal===null?"":goal;
      if(start===1600){$("sg-goal-input").disabled=true;$("sg-goal-form").querySelector("button").disabled=true;}
      $("study-guide-results").hidden=false;
      displayScores();
      try{priorities=await getDiagnostic();}
      catch(err){
        console.warn("Unable to generate skill analysis:",err);
        $("sg-goal-message").textContent="Score data is available, but skill-level diagnosis couldn't load. Try refreshing the page.";
      }
      showPlan();
      $("sg-goal-form").addEventListener("submit",event=>{
        event.preventDefault();
        const input=Number($("sg-goal-input").value);
        if(!scoreValid(input,400,1600)||input<=start){
          $("sg-goal-message").classList.add("is-error");
          $("sg-goal-message").textContent="Choose a goal above "+start+" in 10-point increments, up to 1600.";
          return;
        }
        $("sg-goal-message").classList.remove("is-error");
        goal=input;
        write(GOAL_PREFIX+userId,goal);
        displayScores();showPlan();
      });
      $("sg-weekly-plan").addEventListener("change",event=>{
        const input=event.target.closest("[data-guide-check]");
        if(!input)return;
        const index=input.dataset.guideCheck;
        const data=read(CHECK_PREFIX+userId,{});
        data[index]=input.checked;
        write(CHECK_PREFIX+userId,data);
        input.closest(".sg-check-card").classList.toggle("is-done",input.checked);
      });
      $("sg-reset-checklist").addEventListener("click",()=>{
        write(CHECK_PREFIX+userId,{});
        renderWeekly();
      });
    }catch(error){
      console.error("Study guide error:",error);
      $("study-guide-loading").textContent="The study guide couldn't be loaded. Please refresh and try again.";
    }
  }
  document.addEventListener("DOMContentLoaded",init);
})();
