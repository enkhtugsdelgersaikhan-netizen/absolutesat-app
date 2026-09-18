const MOCK_SUPABASE_URL="https://ikvvixdyztyqqxkveois.supabase.co";
const MOCK_SUPABASE_KEY="sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";
const mockSupabase=window.supabase.createClient(MOCK_SUPABASE_URL,MOCK_SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

const loading=document.getElementById("mock-tests-loading");
const grid=document.getElementById("mock-tests-grid");
const empty=document.getElementById("mock-tests-empty");
const errorState=document.getElementById("mock-tests-error");

function showOnly(element){[loading,grid,empty,errorState].forEach(el=>el.classList.add("hidden"));element.classList.remove("hidden");}

function escapeHtml(value){return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}

async function initializeMockTests(){
    const {data:{session},error:sessionError}=await mockSupabase.auth.getSession();
    if(sessionError||!session){
        const current=window.location.pathname+window.location.search;
        window.location.replace("/login?redirect="+encodeURIComponent(current));
        return;
    }

    const {data:sets,error}=await mockSupabase.from("question_sets").select("*").order("id",{ascending:true});
    if(error){console.error("Could not load mock tests:",error);showOnly(errorState);return;}

    const mockSets=(sets||[]).filter(set=>{
        const text=((set.name||"")+" "+(set.slug||"")+" "+(set.description||"")).toLowerCase();
        return text.includes("mock")||text.includes("full test")||text.includes("practice test");
    });

    if(mockSets.length===0){showOnly(empty);return;}

    grid.innerHTML=mockSets.map(set=>{
        const description=set.description||"Complete this timed SAT practice test and review your results afterward.";
        const slug=encodeURIComponent(set.slug||"");
        return `<article class="mock-test-card">
            <h2>${escapeHtml(set.name||"SAT Mock Test")}</h2>
            <p>${escapeHtml(description)}</p>
            <div class="mock-test-meta"><span>Timed</span><span>Full Practice</span></div>
            <a class="mock-test-start" href="/question?set=${slug}">Start Test →</a>
        </article>`;
    }).join("");
    showOnly(grid);
}

const menuButton=document.querySelector(".mobile-menu-button");
const navigation=document.querySelector(".navigation");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("mobile-open");menuButton.setAttribute("aria-expanded",isOpen?"true":"false");});}

initializeMockTests();