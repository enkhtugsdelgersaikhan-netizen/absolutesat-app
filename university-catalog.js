(() => {
  const commons = (file) =>
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
    encodeURIComponent(file) +
    "?width=1400";

  const logo = (domain) =>
    "https://www.google.com/s2/favicons?sz=128&domain_url=https://" + domain;

  const universities = [
    {
      id:"mit", name:"Massachusetts Institute of Technology", short:"MIT", location:"Cambridge, MA",
      domain:"mit.edu", year:"2025–26",
      sat:{ composite:[1520,1550,1570], reading:[740,760,780], math:[780,790,800] },
      image:commons("Great dome of MIT, Feb 2021 (2) (cropped).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Great_dome_of_MIT,_Feb_2021_(2)_(cropped).jpg",
      source:"https://ir.mit.edu/projects/2025-26-common-data-set/"
    },
    {
      id:"stanford", name:"Stanford University", short:"Stanford", location:"Stanford, CA",
      domain:"stanford.edu", year:"2025–26",
      sat:{ composite:[1520,1550,1570], reading:[750,760,780], math:[770,790,800] },
      image:commons("Stanford University Main Quad (cropped).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Stanford_University_Main_Quad_(cropped).jpg",
      source:"https://www.collegedata.fyi/schools/stanford/2025-26"
    },
    {
      id:"princeton", name:"Princeton University", short:"Princeton", location:"Princeton, NJ",
      domain:"princeton.edu", year:"2025–26",
      sat:{ composite:[1490,1530,1560], reading:[740,760,780], math:[760,790,800] },
      image:commons("Nassau Hall - Princeton University (55144981395).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Nassau_Hall_-_Princeton_University_(55144981395).jpg",
      source:"https://www.collegedata.fyi/schools/princeton/2025-26"
    },
    {
      id:"yale", name:"Yale University", short:"Yale", location:"New Haven, CT",
      domain:"yale.edu", year:"2025–26",
      sat:{ composite:[1470,1530,1560], reading:[730,760,780], math:[740,780,790] },
      image:commons("Yale University Old Campus.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Yale_University_Old_Campus.JPG",
      source:"https://oir.yale.edu/sites/default/files/yale_cds_2025-26_md_20260410_0.pdf"
    },
    {
      id:"duke", name:"Duke University", short:"Duke", location:"Durham, NC",
      domain:"duke.edu", year:"2025–26",
      sat:{ composite:[1510,1550,1570], reading:[740,760,780], math:[770,790,790] },
      image:commons("Duke University Chapel side in July 2025.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Duke_University_Chapel_side_in_July_2025.jpg",
      source:"https://www.collegedata.fyi/schools/duke/2025-26"
    },
    {
      id:"cornell", name:"Cornell University", short:"Cornell", location:"Ithaca, NY",
      domain:"cornell.edu", year:"2025–26",
      sat:{ composite:[1490,1530,1550], reading:[730,750,770], math:[770,790,800] },
      image:commons("Cornell University from McGraw Tower.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Cornell_University_from_McGraw_Tower.JPG",
      source:"https://www.collegedata.fyi/schools/cornell/2025-26"
    },
    {
      id:"brown", name:"Brown University", short:"Brown", location:"Providence, RI",
      domain:"brown.edu", year:"2025–26",
      sat:{ composite:[1470,1520,1550], reading:[730,750,770], math:[730,770,790] },
      image:commons("Brown University.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Brown_University.jpg",
      source:"https://www.collegedata.fyi/schools/brown/2025-26"
    },
    {
      id:"rice", name:"Rice University", short:"Rice", location:"Houston, TX",
      domain:"rice.edu", year:"2025–26",
      sat:{ composite:[1510,1540,1560], reading:[740,760,770], math:[760,790,800] },
      image:commons("Rice University - Rice statue with Lovett Hall.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Rice_University_-_Rice_statue_with_Lovett_Hall.JPG",
      source:"https://www.collegedata.fyi/schools/rice/2025-26"
    },
    {
      id:"vanderbilt", name:"Vanderbilt University", short:"Vanderbilt", location:"Nashville, TN",
      domain:"vanderbilt.edu", year:"2025–26",
      sat:{ composite:[1510,1530,1560], reading:[740,750,770], math:[770,780,790] },
      image:commons("Kirkland Hall at Vanderbilt University.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Kirkland_Hall_at_Vanderbilt_University.jpg",
      source:"https://www.collegedata.fyi/schools/vanderbilt/2025-26"
    },
    {
      id:"uchicago", name:"University of Chicago", short:"UChicago", location:"Chicago, IL",
      domain:"uchicago.edu", year:"2025–26",
      sat:{ composite:[1500,1540,1560], reading:[740,760,770], math:[760,780,790] },
      image:commons("University of Chicago main quadrangles.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:University_of_Chicago_main_quadrangles.jpg",
      source:"https://www.collegedata.fyi/schools/uchicago"
    },
    {
      id:"tufts", name:"Tufts University", short:"Tufts", location:"Medford, MA",
      domain:"tufts.edu", year:"2025–26",
      sat:{ composite:[1460,1500,1520], reading:[720,740,760], math:[730,760,780] },
      image:commons("Ballou Hall at Tufts University at Medford Massachusetts USA built in 1852 by Gridley JF Bryant.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Ballou_Hall_at_Tufts_University_at_Medford_Massachusetts_USA_built_in_1852_by_Gridley_JF_Bryant.jpg",
      source:"https://www.collegedata.fyi/schools/tufts/2025-26"
    },
    {
      id:"pomona", name:"Pomona College", short:"Pomona", location:"Claremont, CA",
      domain:"pomona.edu", year:"2025–26",
      sat:{ composite:[1490,1520,1550], reading:[740,755,770], math:[730,770,790] },
      image:commons("Pomona College - Claremont Colleges.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Pomona_College_-_Claremont_Colleges.jpg",
      source:"https://www.collegedata.fyi/schools/pomona-college/2025-26"
    },
    {
      id:"haverford", name:"Haverford College", short:"Haverford", location:"Haverford, PA",
      domain:"haverford.edu", year:"2025–26",
      sat:{ composite:[1460,1490,1530], reading:[720,750,760], math:[720,750,780] },
      image:commons("Haverfordfounders.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Haverfordfounders.jpg",
      source:"https://www.collegedata.fyi/schools/haverford-college/2025-26"
    },
    {
      id:"williams", name:"Williams College", short:"Williams", location:"Williamstown, MA",
      domain:"williams.edu", year:"2025–26",
      sat:{ composite:[1490,1520,1550], reading:[740,750,770], math:[740,770,790] },
      image:commons("Williams College - Thompson Memorial Chapel exterior view.JPG"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Williams_College_-_Thompson_Memorial_Chapel_exterior_view.JPG",
      source:"https://www.collegedata.fyi/schools/williams-college/2025-26"
    },
    {
      id:"bowdoin", name:"Bowdoin College", short:"Bowdoin", location:"Brunswick, ME",
      domain:"bowdoin.edu", year:"2025–26",
      sat:{ composite:[1470,1510,1540], reading:[730,750,770], math:[730,760,780] },
      image:commons("Hubbard Hall (2026).jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Hubbard_Hall_(2026).jpg",
      source:"https://www.collegedata.fyi/schools/bowdoin/2025-26"
    },
    {
      id:"columbia", name:"Columbia University", short:"Columbia", location:"New York, NY",
      domain:"columbia.edu", year:"2024–25",
      sat:{ composite:[1510,1540,1560], reading:[740,760,780], math:[770,790,800] },
      image:commons("Columbia University - Low Library.jpg"),
      photoSource:"https://commons.wikimedia.org/wiki/File:Columbia_University_-_Low_Library.jpg",
      source:"https://www.collegedata.fyi/schools/columbia/2024-25",
      note:"Columbia College & Columbia Engineering"
    }
  ].map((u) => ({ ...u, logo: logo(u.domain) }));

  const input = document.getElementById("university-search");
  const results = document.getElementById("university-search-results");
  const featured = document.getElementById("university-featured");
  const grid = document.getElementById("university-catalog-grid");
  const count = document.getElementById("university-catalog-count");

  if (!input || !results || !featured || !grid) return;

  let userProfile = null;
  let selectedUniversity = universities[0];

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[ch]));

  const validSectionScore = (value) =>
    Number.isInteger(value) &&
    value >= 200 &&
    value <= 800 &&
    value % 10 === 0;

  async function loadUserProfile() {
    try {
      if (typeof absolutePrepSupabase === "undefined") return null;

      const { data } = await absolutePrepSupabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) return null;

      const metadataReading = Number(user.user_metadata?.sat_reading_writing);
      const metadataMath = Number(user.user_metadata?.sat_math);

      if (validSectionScore(metadataReading) && validSectionScore(metadataMath)) {
        const profile = { readingWriting: metadataReading, math: metadataMath };
        localStorage.setItem(
          "lexlogica_sat_profile:" + user.id,
          JSON.stringify(profile)
        );
        return profile;
      }

      try {
        const raw = localStorage.getItem("lexlogica_sat_profile:" + user.id);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const reading = Number(parsed?.readingWriting);
        const math = Number(parsed?.math);
        if (validSectionScore(reading) && validSectionScore(math)) {
          return { readingWriting: reading, math };
        }
      } catch {
        return null;
      }
    } catch (error) {
      console.warn("Could not load SAT profile:", error);
    }

    return null;
  }

  function logoImg(u, cls) {
    const initials = u.short.slice(0, 3).toUpperCase();
    return '<img class="' + cls + '" src="' + escapeHtml(u.logo) +
      '" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;' +
      cls + ' university-logo-fallback&quot;>' +
      escapeHtml(initials) + '</span>\'">';
  }

  function railScale(values, type, userScore) {
    const [lower, median, upper] = values;
    const hardMin = type === "composite" ? 400 : 200;
    const hardMax = type === "composite" ? 1600 : 800;
    const step = type === "composite" ? 20 : 10;
    const spread = Math.max(upper - lower, type === "composite" ? 80 : 40);
    const padding = Math.max(spread * 0.65, type === "composite" ? 60 : 30);
    const observedMin = Number.isFinite(userScore) ? Math.min(lower, userScore) : lower;
    const observedMax = Number.isFinite(userScore) ? Math.max(upper, userScore) : upper;
    let min = Math.max(hardMin, Math.floor((observedMin - padding) / step) * step);
    let max = Math.min(hardMax, Math.ceil((observedMax + padding) / step) * step);
    if (max <= min) max = Math.min(hardMax, min + step * 10);
    const position = (score) => ((score - min) / (max - min)) * 100;
    return { min, max, position };
  }

  function scoreRelationship(score, [lower, median, upper]) {
    if (score < lower) return "Below the lower quartile";
    if (score === lower) return "At the lower quartile";
    if (score < median) return "Between the lower quartile and median";
    if (score === median) return "At the median";
    if (score < upper) return "Between the median and upper quartile";
    if (score === upper) return "At the upper quartile";
    return "Above the upper quartile";
  }

  function relationshipClass(score, [lower, median, upper]) {
    if (score < lower) return "below-lower";
    if (score === lower) return "at-lower";
    if (score < median) return "lower-to-median";
    if (score === median) return "at-median";
    if (score < upper) return "median-to-upper";
    if (score === upper) return "at-upper";
    return "above-upper";
  }

  function renderBand(label, values, type, userScore) {
    const [lower, median, upper] = values;
    const hasUser = Number.isFinite(userScore);
    const relation = hasUser ? scoreRelationship(userScore, values) : "";

    return '<section class="university-score-band">' +
      '<div class="university-score-band-header">' +
        '<h4>' + escapeHtml(label) + '</h4>' +
        (hasUser
          ? '<span class="university-position-label ' +
              relationshipClass(userScore, values) + '">' +
              escapeHtml(relation) +
              ' · ' + userScore +
            '</span>'
          : '') +
      '</div>' +
      '<div class="university-score-band-values">' +
        '<div><span>Lower quartile</span><strong>' + lower + '</strong></div>' +
        '<div><span>Median</span><strong>' + median + '</strong></div>' +
        '<div><span>Upper quartile</span><strong>' + upper + '</strong></div>' +
      '</div>' +
    '</section>';
  }

  function renderFeatured(u) {
    selectedUniversity = u;

    const totalScore = userProfile
      ? userProfile.readingWriting + userProfile.math
      : null;

    featured.innerHTML =
      '<div class="university-featured-media">' +
        '<img src="' + escapeHtml(u.image) + '" alt="' +
          escapeHtml(u.name) + ' campus" loading="eager">' +
        '<span class="university-photo-credit">Photo: <a href="' +
          escapeHtml(u.photoSource) +
          '" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>' +
      '</div>' +
      '<div class="university-featured-content">' +
        '<div class="university-featured-school">' +
          logoImg(u, "university-featured-logo") +
          '<div><h3>' + escapeHtml(u.name) + '</h3><p>' +
            escapeHtml(u.location) + '</p></div>' +
        '</div>' +
        '<div class="university-score-context">' +
          '<p>Quartiles among enrolled first-year students who submitted SAT scores.</p>' +
          (userProfile
            ? '<div class="university-your-summary"><span>Your SAT</span><strong>' +
                totalScore + '</strong><small>' +
                userProfile.readingWriting + ' Reading &amp; Writing · ' +
                userProfile.math + ' Math</small></div>'
            : '<a class="university-add-score-link" href="/dashboard">Add your SAT scores in Dashboard to see where you sit →</a>') +
        '</div>' +
        '<div class="university-score-band-stack">' +
          renderBand("Composite", u.sat.composite, "composite", totalScore) +
          renderBand("Reading & Writing", u.sat.reading, "section", userProfile?.readingWriting) +
          renderBand("Math", u.sat.math, "section", userProfile?.math) +
        '</div>' +
        '<div class="university-featured-meta">' +
          '<span>Reporting year: <strong>' + escapeHtml(u.year) + '</strong></span>' +
          (u.note ? '<span>' + escapeHtml(u.note) + '</span>' : '') +
          '<a href="' + escapeHtml(u.source) +
            '" target="_blank" rel="noopener noreferrer">View data source ↗</a>' +
        '</div>' +
      '</div>';
  }

  function card(u) {
    const [lower, median, upper] = u.sat.composite;

    return '<article class="university-card" tabindex="0" role="button" data-id="' +
      escapeHtml(u.id) + '" aria-label="Show ' + escapeHtml(u.name) + ' SAT data">' +
      '<div class="university-card-image"><img src="' + escapeHtml(u.image) +
        '" alt="' + escapeHtml(u.name) + ' campus" loading="lazy"></div>' +
      '<div class="university-card-body">' +
        '<div class="university-card-top">' +
          logoImg(u, "university-card-logo") +
          '<div><h4>' + escapeHtml(u.name) + '</h4><p class="university-card-place">' +
            escapeHtml(u.location) + '</p></div>' +
        '</div>' +
        '<div class="university-card-scores">' +
          '<div><span>Lower quartile</span><strong>' + lower + '</strong></div>' +
          '<div><span>Median</span><strong>' + median + '</strong></div>' +
          '<div><span>Upper quartile</span><strong>' + upper + '</strong></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function bindCards() {
    grid.querySelectorAll(".university-card").forEach((el) => {
      const activate = () => {
        const u = universities.find((x) => x.id === el.dataset.id);
        if (!u) return;
        renderFeatured(u);
        featured.scrollIntoView({ behavior:"smooth", block:"center" });
      };

      el.addEventListener("click", activate);
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });
  }

  function renderGrid(list) {
    grid.innerHTML = list.map(card).join("");
    count.textContent =
      list.length + " " + (list.length === 1 ? "university" : "universities");
    bindCards();
  }

  function renderSuggestions(list) {
    if (!list.length) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }

    results.innerHTML = list.slice(0, 6).map((u) =>
      '<button class="university-search-option" type="button" data-id="' +
        escapeHtml(u.id) + '" role="option">' +
        '<img src="' + escapeHtml(u.logo) +
          '" alt="" onerror="this.style.visibility=\'hidden\'">' +
        '<span><strong>' + escapeHtml(u.name) + '</strong><span>' +
          escapeHtml(u.location) + ' · Composite ' +
          u.sat.composite[0] + '–' + u.sat.composite[2] +
        '</span></span>' +
      '</button>'
    ).join("");

    results.hidden = false;

    results.querySelectorAll(".university-search-option").forEach((button) => {
      button.addEventListener("click", () => {
        const u = universities.find((x) => x.id === button.dataset.id);
        if (!u) return;
        input.value = u.name;
        results.hidden = true;
        renderGrid([u]);
        renderFeatured(u);
      });
    });
  }

  function filter() {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      renderGrid(universities);
      results.hidden = true;
      return;
    }

    const matches = universities.filter((u) =>
      [u.name, u.short, u.location].some((value) =>
        value.toLowerCase().includes(query)
      )
    );

    renderGrid(matches);
    renderSuggestions(matches);
  }

  input.addEventListener("input", filter);
  input.addEventListener("focus", () => {
    if (input.value.trim()) filter();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".university-search-shell")) {
      results.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") results.hidden = true;
  });

  renderFeatured(selectedUniversity);
  renderGrid(universities);

  loadUserProfile().then((profile) => {
    userProfile = profile;
    renderFeatured(selectedUniversity);
  });
})();