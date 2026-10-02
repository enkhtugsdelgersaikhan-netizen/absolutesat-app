(() => {
  const commons = (file) =>
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
    encodeURIComponent(file) +
    "?width=1400";

  const logo = (domain) =>
    "https://www.google.com/s2/favicons?sz=256&domain_url=https://" + domain;

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

      const localKey = "lexlogica_sat_profile:" + user.id;
      let local = null;

      try {
        const raw = localStorage.getItem(localKey);
        if (raw) local = JSON.parse(raw);
      } catch {
        local = null;
      }

      const metadataReading = Number(user.user_metadata?.sat_reading_writing);
      const metadataMath = Number(user.user_metadata?.sat_math);
      const localReading = Number(local?.readingWriting);
      const localMath = Number(local?.math);

      const reading = validSectionScore(metadataReading)
        ? metadataReading
        : validSectionScore(localReading)
          ? localReading
          : null;
      const math = validSectionScore(metadataMath)
        ? metadataMath
        : validSectionScore(localMath)
          ? localMath
          : null;

      if (!validSectionScore(reading) || !validSectionScore(math)) return null;

      const profile = { readingWriting: reading, math };

      localStorage.setItem(localKey, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.warn("Could not load SAT profile:", error);
      return null;
    }
  }

  function satAdmissionImpact(score, [lower, median, upper]) {
    if (!Number.isFinite(score) || !(lower < median && median < upper)) return null;

    const rawPosition = score >= median
      ? (score - median) / (upper - median)
      : (score - median) / (median - lower);

    const quartilePosition = Math.max(-1, Math.min(1, rawPosition));
    const k = 0.15 * quartilePosition;

    return {
      k,
      kPercent: k * 100,
      multiplier: 1 + k,
      cappedLow: rawPosition < -1,
      cappedHigh: rawPosition > 1
    };
  }

  function signedPercent(value) {
    if (Math.abs(value) < 0.005) return "0.0%";
    return (value > 0 ? "+" : "−") + Math.abs(value).toFixed(1) + "%";
  }

  function impactTone(value) {
    if (value > 0.00005) return "positive";
    if (value < -0.00005) return "negative";
    return "neutral";
  }

  function renderImpactCard(label, score, u) {
    if (!Number.isFinite(score)) {
      return '<div class="university-impact-card is-empty">' +
        '<div class="university-impact-card-top">' +
          '<span class="university-impact-label">' + escapeHtml(label) + '</span>' +
          '<strong class="university-impact-score">—</strong>' +
        '</div>' +
        '<p>Set your SAT score above to personalize this estimate.</p>' +
      '</div>';
    }

    const impact = satAdmissionImpact(score, u.sat.composite);
    const school = escapeHtml(u.short || u.name);
    const magnitude = Math.abs(impact.kPercent).toFixed(1);

    const explanation = impact.kPercent > 0.005
      ? 'Your SAT score is making your modeled admission chance <strong>' + magnitude + '% higher</strong> than an otherwise identical applicant—same grades, course rigor, extracurriculars, honors, essays, recommendations, and other factors—whose SAT is at ' + school + '\'s median.'
      : impact.kPercent < -0.005
        ? 'Your SAT score is making your modeled admission chance <strong>' + magnitude + '% lower</strong> than an otherwise identical applicant—same grades, course rigor, extracurriculars, honors, essays, recommendations, and other factors—whose SAT is at ' + school + '\'s median.'
        : 'Your SAT is at ' + school + '\'s median, so this model gives you <strong>no SAT-based increase or decrease</strong> relative to an otherwise identical applicant at the median.';

    return '<div class="university-impact-card ' + impactTone(impact.k) + '">' +
      '<div class="university-impact-card-top">' +
        '<span class="university-impact-label">' + escapeHtml(label) + '</span>' +
        '<strong class="university-impact-score">' + score + '</strong>' +
      '</div>' +
      '<div class="university-impact-main">' +
        '<strong>' + signedPercent(impact.kPercent) + '</strong>' +
        '<span>relative admission chance</span>' +
      '</div>' +
      '<p>' + explanation + '</p>' +
    '</div>';
  }

  function renderAdmissionsImpact(u, currentScore) {
    if (!Number.isFinite(currentScore)) {
      return '<section class="university-impact-panel">' +
        '<div class="university-impact-panel-heading">' +
          '<div><span>SAT IMPACT</span><h4>How your SAT changes your admission chance compared with an otherwise identical applicant at this school\'s median SAT</h4><p class="university-impact-relative-help">This is a <strong>relative change</strong>, not points added to your acceptance rate. For example, if the baseline chance were 10%, a +10% relative change would make it 11%, not 20%.</p></div>' +
        '</div>' +
        '<p class="university-impact-empty">Set your SAT score above to see the estimate for this school.</p>' +
      '</section>';
    }

    return '<section class="university-impact-panel">' +
      '<div class="university-impact-panel-heading">' +
        '<div>' +
          '<span>SAT IMPACT</span>' +
          '<h4>How your SAT changes your admission chance compared with an otherwise identical applicant at this school\'s median SAT</h4><p class="university-impact-relative-help">This is a <strong>relative change</strong>, not points added to your acceptance rate. For example, if the baseline chance were 10%, a +10% relative change would make it 11%, not 20%.</p>' +
        '</div>' +
        '<span class="university-impact-median">Median: ' + u.sat.composite[1] + '</span>' +
      '</div>' +
      '<div class="university-impact-grid university-impact-grid-single">' +
        renderImpactCard("Your SAT", currentScore, u) +
      '</div>' +
    '</section>';
  }

  function logoImg(u, cls) {
    const initials = (u.short || u.name)
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return '<span class="' + cls + ' university-logo-fallback university-logo-monogram" aria-hidden="true">' +
      escapeHtml(initials) + '</span>';
  }

  function railScale(values, type, userScore) {
    const compared = values.filter(Number.isFinite);
    if (Number.isFinite(userScore)) compared.push(userScore);
    const min = Math.min(...compared);
    const max = Math.max(...compared);
    const position = (score) => {
      if (max === min) return 50;
      return 8 + 84 * ((score - min) / (max - min));
    };
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

  function positionDisplay(score, [lower, median, upper]) {
    if (score < lower) return { title: "Below lower quartile", detail: "Below " + lower };
    if (score === lower) return { title: "At lower quartile", detail: "Lower quartile · " + lower };
    if (score < median) return { title: "Lower quartile → Median", detail: lower + "–" + median };
    if (score === median) return { title: "At median", detail: "Median · " + median };
    if (score < upper) return { title: "Median → Upper quartile", detail: median + "–" + upper };
    if (score === upper) return { title: "At upper quartile", detail: "Upper quartile · " + upper };
    return { title: "Above upper quartile", detail: "Above " + upper };
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
    const relation = hasUser ? positionDisplay(userScore, values) : null;
    const scale = railScale(values, type, userScore);
    const pos = (v) => scale.position(v).toFixed(2);
    const marker = (kind, name, value) =>
      '<div class="sat-rail-marker ' + kind + '" style="left:' + pos(value) + '%">' +
        '<span class="sat-rail-dot" aria-hidden="true"></span>' +
        '<span class="sat-rail-marker-copy"><small>' + name + '</small><strong>' + value + '</strong></span>' +
      '</div>';

    return '<section class="university-score-band university-score-rail">' +
      '<div class="university-score-band-header">' +
        '<h4>' + escapeHtml(label) + '</h4>' +
        (hasUser
          ? '<span class="university-position-label ' + relationshipClass(userScore, values) + '">' +
              '<i class="university-position-dot" aria-hidden="true"></i>' +
              '<span class="university-position-copy"><strong>' + escapeHtml(relation.title) + '</strong>' +
              '<small>Your score: ' + userScore + '</small></span></span>'
          : '') +
      '</div>' +
      '<div class="sat-rail" role="img" aria-label="' + escapeHtml(label) + ': lower quartile ' + lower + ', median ' + median + ', upper quartile ' + upper + (hasUser ? ', your score ' + userScore : '') + '">' +
        '<div class="sat-rail-track"></div>' +
        '<div class="sat-rail-middle" style="left:' + pos(lower) + '%;width:' + (scale.position(upper)-scale.position(lower)).toFixed(2) + '%"></div>' +
        marker("lower","Lower",lower) +
        marker("median","Median",median) +
        marker("upper","Upper",upper) +
        (hasUser ? marker("you","You",userScore) : '') +
      '</div>' +
      '<div class="sat-rail-scale-note"><span>' + scale.min + '</span><span>Auto-zoomed comparison</span><span>' + scale.max + '</span></div>' +
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
            ? '<div class="university-your-summary">' +
                '<span>Your SAT</span><strong>' + totalScore + '</strong><small>' +
                  userProfile.readingWriting + ' R&amp;W · ' + userProfile.math + ' Math</small>' +
              '</div>'
            : '<span class="university-add-score-link">Set your SAT scores above to see where you sit.</span>') +
        '</div>' +
        renderAdmissionsImpact(u, totalScore) +
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
        logoImg(u, "university-search-logo") +
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

  const profileForm = document.getElementById("sat-profile-form");
  const readingInput = document.getElementById("sat-reading-writing");
  const mathInput = document.getElementById("sat-math");
  const totalPreview = document.getElementById("sat-total-preview");
  const profileSave = document.getElementById("sat-profile-save");
  const profileClear = document.getElementById("sat-profile-clear");
  const profileStatus = document.getElementById("sat-profile-status");
  let profileUser = null;

  const highlightGuideScore = (guide, score) => {
    const scale = document.querySelector('.sat-score-guide-scale[data-guide="' + guide + '"]');
    if (!scale) return;
    scale.querySelectorAll(".sat-score-scale-row").forEach((row) => {
      const min = row.dataset.min === undefined ? -Infinity : Number(row.dataset.min);
      const max = row.dataset.max === undefined ? Infinity : Number(row.dataset.max);
      row.classList.toggle("is-user-range", Number.isFinite(score) && score >= min && score <= max);
    });
  };

  const updateGuideHighlights = (reading, math) => {
    const validReading = validSectionScore(reading);
    const validMath = validSectionScore(math);
    highlightGuideScore("reading", validReading ? reading : NaN);
    highlightGuideScore("math", validMath ? math : NaN);
    highlightGuideScore("composite", validReading && validMath ? reading + math : NaN);
  };

  const updateProfilePreview = () => {
    const reading = Number(readingInput?.value);
    const math = Number(mathInput?.value);
    const composite = validSectionScore(reading) && validSectionScore(math) ? reading + math : null;
    if (totalPreview) totalPreview.textContent = Number.isFinite(composite) ? String(composite) : "—";
    updateGuideHighlights(reading, math);
  };

  loadUserProfile().then(async (profile) => {
    userProfile = profile;
    try {
      const { data } = await absolutePrepSupabase.auth.getSession();
      profileUser = data?.session?.user || null;
    } catch {}
    if (profile && readingInput && mathInput) {
      readingInput.value = profile.readingWriting;
      mathInput.value = profile.math;
    }
    updateProfilePreview();
    renderFeatured(selectedUniversity);
  });

  readingInput?.addEventListener("input", updateProfilePreview);
  mathInput?.addEventListener("input", updateProfilePreview);

  profileForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const reading = Number(readingInput.value);
    const math = Number(mathInput.value);
    if (!validSectionScore(reading) || !validSectionScore(math)) {
      profileStatus.textContent = "Enter both section scores from 200–800 in 10-point increments.";
      profileStatus.classList.add("error");
      return;
    }
    if (!profileUser) {
      profileStatus.innerHTML = 'Log in to save your SAT across devices. <a href="/login">Log in →</a>';
      profileStatus.classList.add("error");
      return;
    }
    const profile = { readingWriting: reading, math };
    const key = "lexlogica_sat_profile:" + profileUser.id;
    localStorage.setItem(key, JSON.stringify(profile));
    profileSave.disabled = true;
    profileSave.textContent = "Saving…";
    const { error } = await absolutePrepSupabase.auth.updateUser({data:{
      sat_reading_writing:reading, sat_math:math, sat_goal_reading_writing:null, sat_goal_math:null
    }});
    profileSave.disabled = false;
    profileSave.textContent = "Save SAT scores";
    if (error) {
      profileStatus.textContent = "Saved on this device. Account sync was unavailable.";
      profileStatus.classList.add("error");
    } else {
      profileStatus.textContent = "Saved — university comparisons updated.";
      profileStatus.classList.remove("error");
    }
    userProfile = profile;
    renderFeatured(selectedUniversity);
  });

  profileClear?.addEventListener("click", async () => {
    readingInput.value = "";
    mathInput.value = "";
    updateProfilePreview();
    userProfile = null;
    renderFeatured(selectedUniversity);
    if (!profileUser) {
      profileStatus.textContent = "";
      return;
    }
    localStorage.removeItem("lexlogica_sat_profile:" + profileUser.id);
    const { error } = await absolutePrepSupabase.auth.updateUser({data:{
      sat_reading_writing:null, sat_math:null, sat_goal_reading_writing:null, sat_goal_math:null
    }});
    profileStatus.textContent = error ? "Cleared on this device. Account sync was unavailable." : "Scores cleared.";
    profileStatus.classList.toggle("error", Boolean(error));
  });
})();