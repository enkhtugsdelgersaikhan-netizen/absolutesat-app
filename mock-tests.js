const MOCK_SUPABASE_URL="https://ikvvixdyztyqqxkveois.supabase.co";
const MOCK_SUPABASE_KEY="sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";
const mockSupabase=window.supabase.createClient(
    MOCK_SUPABASE_URL,
    MOCK_SUPABASE_KEY,
    {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
);

const loading=document.getElementById("mock-tests-loading");
const grid=document.getElementById("mock-tests-grid");
const errorState=document.getElementById("mock-tests-error");

function escapeHtml(value){
    return String(value??"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function formatMinutes(minutes){
    const hours=Math.floor(minutes/60);
    const rest=minutes%60;
    if(!hours)return minutes+" min";
    return hours+"h "+(rest?rest+"m":"");
}

function progressLabel(state){
    if(!state)return "Not started";
    if(state.completed)return "Completed";
    const labels={
        rw_m1:"Reading & Writing · Module 1",
        rw_m2:"Reading & Writing · Module 2",
        break:"Break",
        math_m1:"Math · Module 1",
        math_m2:"Math · Module 2"
    };
    return "Resume at "+(labels[state.currentStage]||"your last module");
}

function renderTest(test,userId){
    let state=null;
    try{
        state=JSON.parse(
            localStorage.getItem(
                "lexlogica-mock-state:"+userId+":"+test.id
            )||"null"
        );
    }catch{}

    const started=Boolean(state&&!state.completed);
    const completed=Boolean(state&&state.completed);
    const modules=(test.sections||[]).map((module,index)=>`
        <div class="mock-module">
            <strong>${escapeHtml(module.label)} · ${escapeHtml(module.module)}</strong>
            <span>${module.questions} questions · ${module.minutes} minutes</span>
        </div>
    `).join("");

    return `
        <article class="mock-card">
            <div class="mock-card-top">
                <div>
                    <div class="mock-card-kicker">
                        <span>LEXLOGICA PRACTICE</span>
                        <span class="mock-status">${completed?"COMPLETED":started?"IN PROGRESS":"READY"}</span>
                    </div>
                    <h3>${escapeHtml(test.title)}</h3>
                    <p class="mock-card-description">${escapeHtml(test.description)}</p>
                </div>
                <div class="mock-card-action">
                    <a class="mock-start" href="/question?mock=${encodeURIComponent(test.id)}${completed?"&restart=1":""}">
                        ${started?"Resume test":completed?"Retake test":"Start test"}
                        <span aria-hidden="true">→</span>
                    </a>
                    <span class="mock-progress-note">${escapeHtml(progressLabel(state))}</span>
                </div>
            </div>
            <div class="mock-module-strip">${modules}</div>
        </article>
    `;
}

async function initializeMockTests(){
    try{
        const {data:{session},error:sessionError}=await mockSupabase.auth.getSession();

        if(sessionError||!session){
            const current=window.location.pathname+window.location.search;
            window.location.replace("/login?redirect="+encodeURIComponent(current));
            return;
        }

        const response=await fetch("/mock-tests-catalog.json?v=1",{cache:"no-store"});
        if(!response.ok)throw new Error("Catalog returned "+response.status);

        const catalog=await response.json();
        const tests=Array.isArray(catalog.tests)?catalog.tests:[];

        grid.innerHTML=tests.map(test=>renderTest(test,session.user.id)).join("");
        loading.classList.add("hidden");
        grid.classList.remove("hidden");
    }catch(error){
        console.error("Could not load mock tests:",error);
        loading.classList.add("hidden");
        errorState.classList.remove("hidden");
    }
}

const menuButton=document.querySelector(".mobile-menu-button");
const navigation=document.querySelector(".navigation");
if(menuButton&&navigation){
    menuButton.addEventListener("click",()=>{
        const isOpen=navigation.classList.toggle("mobile-open");
        menuButton.setAttribute("aria-expanded",isOpen?"true":"false");
    });
}

initializeMockTests();
