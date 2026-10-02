(() => {
  const commons = (file) => "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + encodeURIComponent(file) + "?width=1400";
  const logo = (domain) => "https://www.google.com/s2/favicons?sz=128&domain_url=https://" + domain;

  const universities = [
    {
      id:"mit", name:"Massachusetts Institute of Technology", short:"MIT", location:"Cambridge, MA",
      domain:"mit.edu", scores:[1520,1550,1570], year:"2025–26",
      image:commons("Great dome of MIT, Feb 2021 (2) (cropped).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Great_dome_of_MIT,_Feb_2021_(2)_(cropped).jpg",
      source:"https://ir.mit.edu/projects/2025-26-common-data-set/"
    },
    {
      id:"stanford", name:"Stanford University", short:"Stanford", location:"Stanford, CA",
      domain:"stanford.edu", scores:[1520,1550,1570], year:"2025–26",
      image:commons("Stanford University Main Quad (cropped).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Stanford_University_Main_Quad_(cropped).jpg",
      source:"https://irds.stanford.edu/data-findings/cds"
    },
    {
      id:"princeton", name:"Princeton University", short:"Princeton", location:"Princeton, NJ",
      domain:"princeton.edu", scores:[1490,1530,1560], year:"2025–26",
      image:commons("Nassau Hall - Princeton University (55144981395).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Nassau_Hall_-_Princeton_University_(55144981395).jpg",
      source:"https://ir.princeton.edu/sites/g/files/toruqf2041/files/documents/CDS_2526_Princeton_v2.pdf"
    },
    {
      id:"yale", name:"Yale University", short:"Yale", location:"New Haven, CT",
      domain:"yale.edu", scores:[1470,1530,1560], year:"2025–26",
      image:commons("Yale University Old Campus.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Yale_University_Old_Campus.JPG",
      source:"https://oir.yale.edu/sites/default/files/yale_cds_2025-26_md_20260410_0.pdf"
    },
    {
      id:"duke", name:"Duke University", short:"Duke", location:"Durham, NC",
      domain:"duke.edu", scores:[1510,1550,1570], year:"2025–26",
      image:commons("Duke University Chapel side in July 2025.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Duke_University_Chapel_side_in_July_2025.jpg",
      source:"https://www.collegedata.fyi/schools/duke/2025-26"
    },
    {
      id:"cornell", name:"Cornell University", short:"Cornell", location:"Ithaca, NY",
      domain:"cornell.edu", scores:[1490,1530,1550], year:"2025–26",
      image:commons("Cornell University from McGraw Tower.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Cornell_University_from_McGraw_Tower.JPG",
      source:"https://www.collegedata.fyi/schools/cornell/2025-26"
    },
    {
      id:"brown", name:"Brown University", short:"Brown", location:"Providence, RI",
      domain:"brown.edu", scores:[1470,1520,1550], year:"2025–26",
      image:commons("Brown University.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Brown_University.jpg",
      source:"https://www.collegedata.fyi/schools/brown/2025-26"
    },
    {
      id:"rice", name:"Rice University", short:"Rice", location:"Houston, TX",
      domain:"rice.edu", scores:[1510,1540,1560], year:"2025–26",
      image:commons("Rice University - Rice statue with Lovett Hall.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Rice_University_-_Rice_statue_with_Lovett_Hall.JPG",
      source:"https://www.collegedata.fyi/schools/rice/2025-26"
    },
    {
      id:"vanderbilt", name:"Vanderbilt University", short:"Vanderbilt", location:"Nashville, TN",
      domain:"vanderbilt.edu", scores:[1510,1530,1560], year:"2025–26",
      image:commons("Kirkland Hall at Vanderbilt University.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Kirkland_Hall_at_Vanderbilt_University.jpg",
      source:"https://www.collegedata.fyi/schools/vanderbilt/2025-26"
    },
    {
      id:"uchicago", name:"University of Chicago", short:"UChicago", location:"Chicago, IL",
      domain:"uchicago.edu", scores:[1500,1540,1560], year:"2025–26",
      image:commons("University of Chicago main quadrangles.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:University_of_Chicago_main_quadrangles.jpg",
      source:"https://www.collegedata.fyi/schools/uchicago/2025-26"
    },
    {
      id:"tufts", name:"Tufts University", short:"Tufts", location:"Medford, MA",
      domain:"tufts.edu", scores:[1460,1500,1520], year:"2025–26",
      image:commons("Ballou Hall at Tufts University at Medford Massachusetts USA built in 1852 by Gridley JF Bryant.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Ballou_Hall_at_Tufts_University_at_Medford_Massachusetts_USA_built_in_1852_by_Gridley_JF_Bryant.jpg",
      source:"https://www.collegedata.fyi/schools/tufts/2025-26"
    },
    {
      id:"pomona", name:"Pomona College", short:"Pomona", location:"Claremont, CA",
      domain:"pomona.edu", scores:[1490,1520,1550], year:"2025–26",
      image:commons("Pomona College - Claremont Colleges.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Pomona_College_-_Claremont_Colleges.jpg",
      source:"https://www.collegedata.fyi/schools/pomona-college/2025-26"
    },
    {
      id:"haverford", name:"Haverford College", short:"Haverford", location:"Haverford, PA",
      domain:"haverford.edu", scores:[1460,1490,1530], year:"2025–26",
      image:commons("Haverfordfounders.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Haverfordfounders.jpg",
      source:"https://www.collegedata.fyi/schools/haverford-college/2025-26"
    },
    {
      id:"williams", name:"Williams College", short:"Williams", location:"Williamstown, MA",
      domain:"williams.edu", scores:[1490,1520,1550], year:"2025–26",
      image:commons("Williams College - Thompson Memorial Chapel exterior view.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Williams_College_-_Thompson_Memorial_Chapel_exterior_view.JPG",
      source:"https://hub.williams.edu/institutional-research/files/2026/04/Williams-CDS-2025-2026-V2.pdf"
    },
    {
      id:"bowdoin", name:"Bowdoin College", short:"Bowdoin", location:"Brunswick, ME",
      domain:"bowdoin.edu", scores:[1470,1510,1540], year:"2025–26",
      image:commons("Hubbard Hall (2026).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Hubbard_Hall_(2026).jpg",
      source:"https://www.collegedata.fyi/schools/bowdoin/2025-26"
    },
    {
      id:"columbia", name:"Columbia University", short:"Columbia", location:"New York, NY",
      domain:"columbia.edu", scores:[1510,1540,1560], year:"2024–25",
      image:commons("Columbia University - Low Library.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Columbia_University_-_Low_Library.jpg",
      source:"https://opir.columbia.edu/sites/default/files/content/Common%20Data%20Set/2024-25_Columbia_College_and_Columbia_Engineering_CDS.pdf",
      note:"Columbia College & Columbia Engineering"
    }
  ].map(u => ({...u, logo:logo(u.domain)}));

  const input=document.getElementById("university-search");
  const results=document.getElementById("university-search-results");
  const featured=document.getElementById("university-featured");
  const grid=document.getElementById("university-catalog-grid");
  const count=document.getElementById("university-catalog-count");
  if(!input||!results||!featured||!grid) return;

  const escapeHtml=(value)=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const pos=(score)=>Math.max(2,Math.min(98,2+((score-1200)/400)*96));

  function logoImg(u,cls){
    const initials=u.short.slice(0,3).toUpperCase();
    return '<img class="'+cls+'" src="'+escapeHtml(u.logo)+'" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;'+cls+' university-logo-fallback&quot;>'+escapeHtml(initials)+'</span>\'">';
  }

  function renderFeatured(u){
    const [q1,median,q3]=u.scores;
    const p1=pos(q1), pm=pos(median), p3=pos(q3);
    featured.innerHTML=
      '<div class="university-featured-media">'+
        '<img src="'+escapeHtml(u.image)+'" alt="'+escapeHtml(u.name)+' campus" loading="eager">'+
        '<span class="university-photo-credit">Photo: <a href="'+escapeHtml(u.photoSource)+'" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>'+
      '</div>'+
      '<div class="university-featured-content">'+
        '<div class="university-featured-school">'+logoImg(u,"university-featured-logo")+
          '<div><h3>'+escapeHtml(u.name)+'</h3><p>'+escapeHtml(u.location)+'</p></div>'+
        '</div>'+
        '<p class="university-score-label">SAT composite percentiles among enrolled first-year students who submitted SAT scores.</p>'+
        '<div class="university-score-row">'+
          '<div class="university-score-stat"><span>25th percentile</span><strong>'+q1+'</strong></div>'+
          '<div class="university-score-stat"><span>Median</span><strong>'+median+'</strong></div>'+
          '<div class="university-score-stat"><span>75th percentile</span><strong>'+q3+'</strong></div>'+
        '</div>'+
        '<div class="university-range" aria-label="SAT range from '+q1+' to '+q3+', median '+median+'">'+
          '<div class="university-range-track"></div>'+
          '<div class="university-range-fill" style="left:'+p1+'%;width:'+(p3-p1)+'%"></div>'+
          '<span class="university-range-dot" style="left:'+p1+'%"></span>'+
          '<span class="university-range-dot median" style="left:'+pm+'%"></span>'+
          '<span class="university-range-dot" style="left:'+p3+'%"></span>'+
        '</div>'+
        '<div class="university-featured-meta">'+
          '<span>Reporting year: <strong>'+escapeHtml(u.year)+'</strong></span>'+
          (u.note?'<span>'+escapeHtml(u.note)+'</span>':'')+
          '<a href="'+escapeHtml(u.source)+'" target="_blank" rel="noopener noreferrer">View data source ↗</a>'+
        '</div>'+
      '</div>';
  }

  function card(u){
    return '<article class="university-card" tabindex="0" role="button" data-id="'+escapeHtml(u.id)+'" aria-label="Show '+escapeHtml(u.name)+' SAT data">'+
      '<div class="university-card-image"><img src="'+escapeHtml(u.image)+'" alt="'+escapeHtml(u.name)+' campus" loading="lazy"></div>'+
      '<div class="university-card-body">'+
        '<div class="university-card-top">'+logoImg(u,"university-card-logo")+
          '<div><h4>'+escapeHtml(u.name)+'</h4><p class="university-card-place">'+escapeHtml(u.location)+'</p></div>'+
        '</div>'+
        '<div class="university-card-scores">'+
          '<div><span>25th</span><strong>'+u.scores[0]+'</strong></div>'+
          '<div><span>Median</span><strong>'+u.scores[1]+'</strong></div>'+
          '<div><span>75th</span><strong>'+u.scores[2]+'</strong></div>'+
        '</div>'+
      '</div>'+
    '</article>';
  }

  function bindCards(){
    grid.querySelectorAll(".university-card").forEach(el=>{
      const activate=()=>{
        const u=universities.find(x=>x.id===el.dataset.id);
        if(!u) return;
        renderFeatured(u);
        featured.scrollIntoView({behavior:"smooth",block:"center"});
      };
      el.addEventListener("click",activate);
      el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});
    });
  }

  function renderGrid(list){
    grid.innerHTML=list.map(card).join("");
    count.textContent=list.length+" "+(list.length===1?"university":"universities");
    bindCards();
  }

  function renderSuggestions(list){
    if(!list.length){results.hidden=true;results.innerHTML="";return;}
    results.innerHTML=list.slice(0,6).map(u=>
      '<button class="university-search-option" type="button" data-id="'+escapeHtml(u.id)+'" role="option">'+
        '<img src="'+escapeHtml(u.logo)+'" alt="" onerror="this.style.visibility=\'hidden\'">'+
        '<span><strong>'+escapeHtml(u.name)+'</strong><span>'+escapeHtml(u.location)+' · '+u.scores[0]+'–'+u.scores[2]+'</span></span>'+
      '</button>'
    ).join("");
    results.hidden=false;
    results.querySelectorAll(".university-search-option").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const u=universities.find(x=>x.id===btn.dataset.id);
        if(!u)return;
        input.value=u.name;
        results.hidden=true;
        renderGrid([u]);
        renderFeatured(u);
      });
    });
  }

  function filter(){
    const q=input.value.trim().toLowerCase();
    if(!q){renderGrid(universities);results.hidden=true;return;}
    const matches=universities.filter(u=>
      [u.name,u.short,u.location].some(v=>v.toLowerCase().includes(q))
    );
    renderGrid(matches);
    renderSuggestions(matches);
  }

  input.addEventListener("input",filter);
  input.addEventListener("focus",()=>{if(input.value.trim()) filter();});
  document.addEventListener("click",e=>{if(!e.target.closest(".university-search-shell"))results.hidden=true;});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")results.hidden=true;});

  renderFeatured(universities[0]);
  renderGrid(universities);
})();