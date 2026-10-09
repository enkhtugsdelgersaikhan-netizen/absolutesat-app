(function () {
  "use strict";

  const BASELINE_PREFIX = "lexlogica-study-baseline:v1:";
  const GOAL_PREFIX = "lexlogica-study-goal:v1:";
  const COMPLETIONS_PREFIX = "lexlogica-study-domain-completions:v2:";
  const GUIDED_PREFIX = "lexlogica-study-guided-session:v1:";
  const MOCK_PREFIX = "lexlogica-mock-state:";
  const BANK_NAV_KEY = "absoluteprep-question-bank-navigation";
  const $ = id => document.getElementById(id);

  const DOMAINS = {
    readingWriting: [
      {name:"Information & Ideas",weight:.26},
      {name:"Craft & Structure",weight:.28},
      {name:"Expression of Ideas",weight:.20},
      {name:"Standard English Conventions",weight:.26}
    ],
    math: [
      {name:"Algebra",weight:.35},
      {name:"Advanced Math",weight:.35},
      {name:"Problem-Solving & Data Analysis",weight:.15},
      {name:"Geometry & Trigonometry",weight:.15}
    ]
  };
  const ALIASES = new Map([
    ["information and ideas","Information & Ideas"],
    ["craft and structure","Craft & Structure"],
    ["expression of ideas","Expression of Ideas"],
    ["standard english conventions","Standard English Conventions"],
    ["problem solving and data analysis","Problem-Solving & Data Analysis"],
    ["geometry and trigonometry","Geometry & Trigonometry"],
    ["algebra","Algebra"],
    ["advanced math","Advanced Math"]
  ]);
  const domainName = value => ALIASES.get(
    String(value || "").toLowerCase().replace(/&/g," and ").replace(/[\W_]+/g," ").trim()
  ) || null;
  const read = (key,fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  };
  const write = (key,value) => {
    try { localStorage.setItem(key,JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const escapeHtml = value => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const scoreValid = (value,min,max) => {
    if (value === null || value === undefined || String(value).trim() === "") return false;
    const n=Number(value);
    return Number.isFinite(n)&&n>=min&&n<=max&&n%10===0;
  };

  let userId="";
  let latest=null;
  let scores=[];
  let goal=null;
  let priorities={readingWriting:[],math:[]};
  let reservationsCache=null;
  const bankCache={};

  function getScores(state) {
    if (!state?.completed) return null;
    const saved=state.satScores||{};
    if (scoreValid(saved.composite,400,1600)&&
        scoreValid(saved.readingWriting,200,800)&&scoreValid(saved.math,200,800)) {
      return {composite:+saved.composite,readingWriting:+saved.readingWriting,math:+saved.math};
    }
    const modules=state.completedModules||{};
    if (!(modules.rw_m1&&modules.rw_m2&&modules.math_m1&&modules.math_m2)) return null;
    const rw=Math.max(0,Math.min(54,Number(modules.rw_m1.correct||0)+Number(modules.rw_m2.correct||0)));
    const math=Math.max(0,Math.min(44,Number(modules.math_m1.correct||0)+Number(modules.math_m2.correct||0)));
    const round=n=>Math.round(n/10)*10;
    return {composite:round(400+600*(rw/54+math/44)),
      readingWriting:round(200+600*rw/54),math:round(200+600*math/44)};
  }
  const mockState = n => read(MOCK_PREFIX+userId+":mock-test-"+n,null);
  function preserveOriginal(state) {
    if (!getScores(state)) return null;
    const copy={
      testId:"mock-test-1",completed:true,completedAt:state.completedAt,
      satScores:state.satScores,completedModules:state.completedModules,
      routes:state.routes||{},answers:state.answers||{},choiceOrders:state.choiceOrders||{}
    };
    write(BASELINE_PREFIX+userId,copy);
    return copy;
  }
  function getLatestMock() {
    let savedBaseline=read(BASELINE_PREFIX+userId,null);
    if (!getScores(savedBaseline)) savedBaseline=preserveOriginal(mockState(1));
    const rows=[];
    for (let n=1;n<=8;n++) {
      const state=mockState(n);
      const sat=getScores(state);
      if (sat) rows.push({n,state,scores:sat,time:Date.parse(state.completedAt||"")||0});
    }
    // If Mock 1 is restarted, retain its original completed diagnostic until a
    // newer completed mock exists. Never count an in-progress attempt as a result.
    if (getScores(savedBaseline)&&!rows.some(row=>row.n===1)) {
      rows.push({n:1,state:savedBaseline,scores:getScores(savedBaseline),
        time:Date.parse(savedBaseline.completedAt||"")||0});
    }
    rows.sort((a,b)=>a.time-b.time||a.n-b.n);
    scores=rows;
    return rows[rows.length-1]||null;
  }
  function displayScores() {
    const sat=latest.scores;
    $("sg-start-score").textContent=sat.composite;
    $("sg-start-sections").textContent="R&W "+sat.readingWriting+" · Math "+sat.math;
    $("sg-score-source").textContent="From Mock Test "+latest.n;
    $("sg-progress-wrap").hidden=true;
    if (goal===null) {
      $("sg-current-score").textContent="—";
      $("sg-current-note").textContent="Set your goal to compare";
      $("sg-goal-message").textContent="Choose a goal score; your domain priorities already reflect Mock Test "+latest.n+".";
      return;
    }
    const gap=goal-sat.composite;
    $("sg-current-score").textContent=Math.abs(gap);
    $("sg-current-note").textContent=gap>0?"points to reach your goal":gap<0?"points above your goal":"goal reached";
    $("sg-goal-message").textContent=gap<=0
      ?"Your latest mock meets your practice goal. Keep verifying your strengths with new questions."
      :"Your latest mock is "+gap+" points below your goal. This is a target, not a predicted gain.";
  }
  function numberValue(value) {
    const source=String(value??"").trim().replace(/,/g,"");
    if (!source) return null;
    const fraction=source.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
    if (fraction) return Number(fraction[2])===0?null:Number(fraction[1])/Number(fraction[2]);
    const n=Number(source);
    return Number.isFinite(n)?n:null;
  }
  function isCorrect(entry,selected,section,state) {
    const q=entry.question||{};
    if (selected===undefined||selected===null||String(selected).trim()==="") return false;
    if (q.answerType==="student-response"||q.answer_type==="student-response") {
      const n=numberValue(selected);
      return n!==null&&(q.acceptedAnswers||q.accepted_answers||[]).some(v=>{
        const a=numberValue(v);
        return a!==null&&Math.abs(a-n)<=1e-9;
      });
    }
    const original=String(q.correctAnswer||q.correct_answer||"").trim().toUpperCase();
    const order=state.choiceOrders?.[section+":"+q.id];
    const answer=Array.isArray(order)&&order.includes(original)
      ?"ABCD".charAt(order.indexOf(original)):original;
    return String(selected).trim().toUpperCase()===answer;
  }
  async function getDiagnostic() {
    const response=await fetch("/mock-test-"+latest.n+".json?v=domain-diagnostic-1",{cache:"no-store"});
    if (!response.ok) throw new Error("Unable to load the latest mock's domain metadata.");
    const manifest=await response.json();
    const rows=[];
    for (const section of ["readingWriting","math"]) {
      const blocks=manifest.sections?.[section]||{};
      const low=latest.state.routes?.[section]==="low";
      const chosen=[...(blocks.module1||[]),...(low?blocks.module2Low||[]:blocks.module2High||[])];
      const grouped=new Map(DOMAINS[section].map(x=>[x.name,{
        section,domain:x.name,weight:x.weight,total:0,correct:0,missed:0
      }]));
      for (const entry of chosen) {
        const domain=domainName(entry.targetDomain||entry.question?.domain);
        if (!domain||!grouped.has(domain)) continue;
        const row=grouped.get(domain);
        row.total++;
        const answer=latest.state.answers?.[entry.question?.id];
        if (isCorrect(entry,answer,section,latest.state)) row.correct++;
        else row.missed++;
      }
      rows.push(...grouped.values());
    }
    for (const row of rows) {
      row.accuracy=row.total?row.correct/row.total:0;
      // Exam weighting breaks ties between domains with the same error rate.
      // Empty domains are shown as unassessed, not incorrectly as 0% mastery.
      row.urgency=row.total?row.weight*(.1+row.missed/row.total):-1;
    }
    const ranked=[...rows].sort((a,b)=>b.urgency-a.urgency||
      b.missed-a.missed||a.domain.localeCompare(b.domain));
    ranked.forEach((row,i)=>{row.rank=i+1;});
    priorities={
      readingWriting:ranked.filter(x=>x.section==="readingWriting"),
      math:ranked.filter(x=>x.section==="math")
    };
  }

  function completionKey() {
    return COMPLETIONS_PREFIX+userId+":mock-test-"+latest.n+":"+
      (latest.state.completedAt||"legacy");
  }
  function completedDomains() { return read(completionKey(),{}); }
  function mixForAccuracy(row) {
    // Smooth, monotonic endpoints: 0% -> 10/0/0; 100% -> 0/0/10.
    // Easy decreases, hard increases, and medium fills the remaining
    // slots. Rounding each endpoint independently prevents a higher
    // accuracy from accidentally receiving fewer hard questions.
    if (!row.total) return [3,4,3];
    const accuracy=Math.max(0,Math.min(1,Number(row.accuracy)||0));
    const easy=Math.round(10*(1-accuracy)*(1-accuracy));
    const hard=Math.round(10*accuracy*accuracy);
    return [easy,10-easy-hard,hard];
  }
  function domainSeverity(row) {
    if (!row.total) return "unassessed";
    const missedShare = row.missed / row.total;
    if (missedShare >= .75) return "critical";
    if (missedShare >= .55) return "high";
    if (missedShare >= .35) return "moderate";
    if (missedShare >= .15) return "mild";
    return "strong";
  }
  function renderPriorityRow(row,done,showSection=false) {
    const key=row.section+"::"+row.domain;
    const rate=row.total?Math.round(100*row.accuracy)+"% correct":"Not assessed";
    const count=row.total
      ?row.missed+" missed of "+row.total+" · "+rate
      :"No questions in this mock";
    const section=showSection?(row.section==="math"?"Math · ":"R&W · "):"";
    return '<div class="sg-priority-item sg-severity-'+domainSeverity(row)+(done?' is-complete':'')+'">'+
      '<span class="sg-domain-check" aria-hidden="true">'+(done?'✓':row.rank)+'</span>'+
      '<div class="sg-domain-copy"><span class="sg-priority-name">'+escapeHtml(row.domain)+'</span>'+
      '<span class="sg-priority-meta">'+section+count+'</span></div>'+
      '<span class="sg-domain-status">'+(done?'Completed':'')+'</span>'+
      '<button type="button" class="sg-priority-link" data-domain-practice="'+
      escapeHtml(key)+'" aria-label="Get 10 automatically selected questions for '+escapeHtml(row.domain)+'">Get tailored drill</button></div>';
  }
  function renderPriorities(section,id) {
    const finished=completedDomains();
    $(id).innerHTML=priorities[section].map(row=>
      renderPriorityRow(row,Boolean(finished[row.section+"::"+row.domain]?.completedAt))
    ).join("");
  }
  function renderTopPriorities() {
    const finished=completedDomains();
    const ranked=[...priorities.readingWriting,...priorities.math]
      .sort((a,b)=>a.rank-b.rank);
    const remaining=ranked.filter(row=>
      !finished[row.section+"::"+row.domain]?.completedAt
    );
    const selected=(remaining.length?remaining:ranked).slice(0,3);
    $("sg-top-priorities").innerHTML=selected.map(row=>
      renderPriorityRow(row,Boolean(finished[row.section+"::"+row.domain]?.completedAt),true)
    ).join("");
    if (!remaining.length) {
      $("sg-diagnostic-note").textContent=
        "All 8 tailored domain drills are complete for this mock. You can get another drill or retest to refresh your priorities.";
    }
  }
  function nextMock() {
    // Recommend the numbered successor even if that test has an existing
    // completion: never jump over Mock 2 just because its result was saved
    // before a more recent retake of Mock 1. Opening an existing test preserves
    // its result; it does not silently reset the student's attempt.
    const n=latest.n<8?latest.n+1:null;
    $("sg-review-test-link").href="/question?mock=mock-test-"+latest.n;
    $("sg-review-test-link").textContent="Review Mock "+latest.n+" →";
    $("sg-next-test-link").href=n?"/question?mock=mock-test-"+n:"/mock-tests";
    $("sg-next-test-link").textContent=n?"Mock Test "+n+" →":"Explore mock tests →";
  }
  function showPlan() {
    $("sg-plan-content").hidden=false;
    renderPriorities("readingWriting","sg-rw-priorities");
    renderPriorities("math","sg-math-priorities");
    $("sg-diagnostic-note").textContent="Latest: Mock Test "+latest.n+
      ". Ranked by urgency. LexLogica automatically selects 10 unanswered questions from your chosen domain and adjusts their difficulty based on your latest mock.";
    renderTopPriorities();
    nextMock();
  }

  async function loadBank(section) {
    if (bankCache[section]) return bankCache[section];
    const main=section==="math"?"/math-question-bank.json?v=5":"/question-bank.json?v=19";
    const response=await fetch(main,{cache:"no-store"});
    if (!response.ok) throw new Error("Question bank is unavailable right now.");
    const payload=await response.json();
    let questions=payload.questions||[];
    if (section==="math") {
      const supplement=await fetch("/math-question-bank-20261010-reviewed.json?v=1",{cache:"no-store"});
      if (supplement.ok) {
        const extra=await supplement.json();
        questions=questions.concat(extra.questions||[]);
      }
    }
    const reviewed=await fetch("/question-batch-20261010-reviewed.json?v=1",{cache:"no-store"});
    if (reviewed.ok) {
      const supplement=await reviewed.json();
      const desiredSection=section==="math"?"Math":"Reading & Writing";
      questions=questions.concat((supplement.questions||[]).filter(q=>q.section===desiredSection));
    }
    if (section==="readingWriting") {
      try {
        const repairResponse=await fetch("/rw-answer-length-repairs-20261010.json?v=1",{cache:"no-store"});
        if (repairResponse.ok) {
          const fixes=(await repairResponse.json()).choices||{};
          questions.forEach(q=>{
            if (fixes[q.id]&&q.choices?.[q.correctAnswer]) q.choices[q.correctAnswer]=fixes[q.id];
          });
        }
      } catch (error) {
        console.warn("Could not load answer-length revisions:",error);
      }
    }
    bankCache[section]=questions;
    return questions;
  }
  async function mockReservations() {
    if (reservationsCache) return reservationsCache;
    const response=await fetch("/mock-test-reservations.json?v=6",{cache:"no-store"});
    if (!response.ok) throw new Error("Cannot verify mock-test reservations.");
    const payload=await response.json();
    if (!Array.isArray(payload.allQuestionIds)) throw new Error("Invalid mock reservation manifest.");
    reservationsCache=new Set(payload.allQuestionIds.map(String));
    return reservationsCache;
  }
  async function attemptedIds() {
    const ids=new Set(Object.keys(read("absoluteprep-question-status:"+userId,{})));
    const resetTime=Date.parse(localStorage.getItem("absoluteprep-practice-reset:"+userId)||"")||0;
    let from=0;
    for (let page=0;page<100;page++) {
      const {data,error}=await absolutePrepSupabase.from("question_attempts")
        .select("question_id,created_at")
        .eq("user_id",userId)
        .order("created_at",{ascending:true})
        .range(from,from+999);
      if (error) throw new Error("Could not verify your previously solved questions. Please retry.");
      for (const attempt of data||[]) {
        if (!resetTime||(Date.parse(attempt.created_at||"")||0)>resetTime)
          ids.add(String(attempt.question_id));
      }
      if (!data||data.length<1000) return ids;
      from+=1000;
    }
    throw new Error("Your practice history is too large to verify safely right now.");
  }
  const shuffled = values => {
    const out=[...values];
    for(let i=out.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [out[i],out[j]]=[out[j],out[i]];
    }
    return out;
  };
  function chooseTen(candidates,mix) {
    const sets={
      Easy:shuffled(candidates.filter(x=>String(x.difficulty).toLowerCase()==="easy")),
      Medium:shuffled(candidates.filter(x=>String(x.difficulty).toLowerCase()==="medium")),
      Hard:shuffled(candidates.filter(x=>String(x.difficulty).toLowerCase()==="hard"))
    };
    const selected=[];
    const kinds=["Easy","Medium","Hard"];
    kinds.forEach((kind,i)=>{
      selected.push(...sets[kind].splice(0,Math.min(sets[kind].length,mix[i])));
    });
    let remaining=10-selected.length;
    // If a particular difficulty runs out, fill the missing slots from
    // other difficulty levels, never repeat an ID or expose reserved mocks.
    for (const kind of ["Medium","Easy","Hard"]) {
      if (!remaining) break;
      const added=sets[kind].splice(0,remaining);
      selected.push(...added);
      remaining-=added.length;
    }
    return shuffled(selected);
  }
  async function startDomainPractice(row,button) {
    const oldLabel=button.textContent;
    button.disabled=true;
    button.textContent="Preparing…";
    try {
      const [bank,reserved,attempted]=await Promise.all([
        loadBank(row.section),mockReservations(),attemptedIds()
      ]);
      const seen=new Set();
      const candidates=bank.filter(q=>{
        if (q.status!=="staged"||!q.id||reserved.has(String(q.id))||
            attempted.has(String(q.id))||domainName(q.domain)!==row.domain||
            seen.has(String(q.id))) return false;
        seen.add(String(q.id));
        return true;
      });
      if (candidates.length<10) {
        throw new Error("Only "+candidates.length+" unused questions are available in this domain. We need 10 to start a complete assignment.");
      }
      const selected=chooseTen(candidates,mixForAccuracy(row));
      if (selected.length!==10) throw new Error("Unable to assemble 10 new questions.");
      const questionIds=selected.map(q=>String(q.id));
      const actualCounts=selected.reduce((counts,q)=>{
        const level=String(q.difficulty||"Medium").toLowerCase();
        if (level==="easy") counts[0]++;
        else if (level==="hard") counts[2]++;
        else counts[1]++;
        return counts;
      },[0,0,0]);
      const session={
        version:1,userId,section:row.section,domain:row.domain,
        mockId:"mock-test-"+latest.n,
        mockCompletedAt:latest.state.completedAt||"legacy",
        completionKey:completionKey(),
        difficultyTarget:mixForAccuracy(row),
        difficultyActual:actualCounts,
        questionIds,answeredIds:[],createdAt:new Date().toISOString()
      };
      if (!write(GUIDED_PREFIX+userId,session)) {
        throw new Error("Browser storage is unavailable, so the guided assignment cannot be saved.");
      }
      sessionStorage.setItem(BANK_NAV_KEY,JSON.stringify({
        userId,questionIds,currentQuestionId:questionIds[0]
      }));
      window.location.assign("/question?id="+encodeURIComponent(questionIds[0])+"&guide=1");
    } catch (err) {
      button.disabled=false;
      button.textContent=oldLabel;
      $("sg-practice-message").textContent=err.message||"The assignment could not be prepared.";
    }
  }

  function showGuestGuide() {
    // Public preview contains taxonomy only, never a previous user's
    // stored goals, mock results, rankings, or answer history.
    $("study-guide-loading").hidden=true;
    $("study-guide-empty").hidden=true;
    $("study-guide-results").hidden=false;
    $("sg-plan-content").hidden=false;
    // Clearly labeled example values give visitors a useful preview,
    // never a previous student's actual account or locally stored data.
    const exampleLabel=$("sg-example-label");
    if (exampleLabel) exampleLabel.hidden=false;
    $("sg-start-score").textContent="1200";
    $("sg-start-sections").textContent="Example: R&W 590 · Math 610";
    $("sg-current-score").textContent="300";
    $("sg-current-note").textContent="example points to a 1500 goal";
    $("sg-score-source").textContent="Illustrative example — not your score";
    $("sg-progress-wrap").hidden=true;
    $("sg-goal-message").textContent=
      "Illustrative 1200 → 1500 plan. Sign in and complete a mock for your own score and priorities.";
    const input=$("sg-goal-input");
    input.value="1500";
    input.disabled=true;
    const goalButton=$("sg-goal-form").querySelector("button");
    if (goalButton) {
      goalButton.disabled=true;
      goalButton.textContent="Sign in first";
    }
    $("sg-diagnostic-note").textContent=
      "Example priorities. After your diagnostic, LexLogica automatically picks 10 unanswered questions per drill and tailors their difficulty to your latest mock.";
    const signIn="/login?redirect="+encodeURIComponent("/#study-guide");
    for (const section of ["readingWriting","math"]) {
      const id=section==="math"?"sg-math-priorities":"sg-rw-priorities";
      $(id).innerHTML=DOMAINS[section].map(row=>
        '<div class="sg-priority-item sg-severity-unassessed">'+
        '<span class="sg-domain-check" aria-hidden="true">—</span>'+
        '<div class="sg-domain-copy"><span class="sg-priority-name">'+escapeHtml(row.name)+
        '</span><span class="sg-priority-meta">Not assessed · complete a mock for tailored drills</span></div>'+
        '<span class="sg-domain-status"></span>'+
        '<a class="sg-priority-link" href="'+escapeHtml(signIn)+'" aria-label="Sign in for an automatically selected 10-question drill">Get tailored drill</a></div>'
      ).join("");
    }
    const examples=[
      {name:"Advanced Math",section:"math",missed:8,total:10,accuracy:.2,rank:1,severity:"critical"},
      {name:"Algebra",section:"math",missed:6,total:10,accuracy:.4,rank:2,severity:"moderate"},
      {name:"Craft & Structure",section:"readingWriting",missed:5,total:10,accuracy:.5,rank:3,severity:"moderate"}
    ];
    $("sg-top-priorities").innerHTML=examples.map(example=>{
      return '<div class="sg-priority-item sg-severity-'+domainSeverity(example)+'">'+
        '<span class="sg-domain-check" aria-hidden="true">'+example.rank+'</span>'+
        '<div class="sg-domain-copy"><span class="sg-priority-name">'+escapeHtml(example.name)+'</span>'+
        '<span class="sg-priority-meta">Example · '+(example.section==="math"?"Math":"R&W")+
        ' · '+example.missed+' of '+example.total+
        ' missed · '+Math.round(example.accuracy*100)+'% correct</span></div>'+
        '<a class="sg-priority-link" href="'+escapeHtml(signIn)+'" aria-label="Sign in for an automatically selected 10-question drill">Get tailored drill</a></div>';
    }).join("");
    $("sg-practice-message").textContent=
      "Sign in to unlock diagnostic-based practice and saved progress.";
    $("sg-review-test-link").href="/mock-tests";
    $("sg-review-test-link").textContent="Explore mock tests →";
    $("sg-next-test-link").href=signIn;
    $("sg-next-test-link").textContent="Get started →";
  }

  async function init() {
    if (!$("study-guide-loading")) return;
    try {
      if (typeof absolutePrepSupabase==="undefined") { showGuestGuide(); return; }
      const {data,error}=await absolutePrepSupabase.auth.getSession();
      // Guests see every homepage section but never another student's data.
      if (error||!data?.session||
          (typeof isAbsolutePrepGoogleSession==="function"&&
           !isAbsolutePrepGoogleSession(data.session))) {
        showGuestGuide();
        return;
      }
      userId=data.session.user.id;
      latest=getLatestMock();
      $("study-guide-loading").hidden=true;
      if (!latest) {
        $("study-guide-empty").hidden=false;
        return;
      }
      goal=read(GOAL_PREFIX+userId,null);
      if (!scoreValid(goal,400,1600)) goal=null;
      else goal=Number(goal);
      $("sg-goal-input").value=goal===null?"":goal;
      $("study-guide-results").hidden=false;
      displayScores();
      try {
        await getDiagnostic();
        showPlan();
      } catch (error) {
        console.error("Study guide diagnostic error:",error);
        $("sg-practice-message").textContent="The latest mock's domain analysis couldn't load. Refresh to try again.";
      }
      $("sg-goal-form").addEventListener("submit",event=>{
        event.preventDefault();
        const value=$("sg-goal-input").value;
        if (!scoreValid(value,400,1600)) {
          $("sg-goal-message").classList.add("is-error");
          $("sg-goal-message").textContent="Enter a SAT goal from 400 to 1600 in 10-point increments.";
          return;
        }
        $("sg-goal-message").classList.remove("is-error");
        goal=Number(value);
        write(GOAL_PREFIX+userId,goal);
        displayScores();
      });
      $("sg-plan-content").addEventListener("click",event=>{
        const button=event.target.closest("[data-domain-practice]");
        if (!button||button.disabled) return;
        const key=button.dataset.domainPractice;
        const row=[...priorities.readingWriting,...priorities.math]
          .find(x=>x.section+"::"+x.domain===key);
        if (!row) return;
        $("sg-practice-message").textContent="";
        startDomainPractice(row,button);
      });
      window.addEventListener("pageshow",event=>{
        if (event.persisted) window.location.reload();
      });
      if (window.location.hash==="#study-guide") {
        requestAnimationFrame(()=>requestAnimationFrame(()=>
          $("study-guide")?.scrollIntoView({block:"start"})
        ));
      }
    } catch (error) {
      console.warn("Study guide initialization unavailable:",error);
      showGuestGuide();
    }
  }
  document.addEventListener("DOMContentLoaded",init);
})();
