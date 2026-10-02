(() => {
  const commons = (file) =>
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
    encodeURIComponent(file) +
    "?width=1400";

  const schoolMark = (file) =>
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
    encodeURIComponent(file) +
    "?width=400";

  const universityMarks = {
    mit:"MIT logo 2003-2023.svg",
    stanford:"Seal of Leland Stanford Junior University.png",
    princeton:"Princeton seal.svg",
    yale:"Yale University logo.svg",
    duke:"Duke Athletics logo.svg",
    cornell:"Cornell University seal.svg",
    brown:"Brown seal.svg",
    rice:"Academic Seal Rice University.svg",
    vanderbilt:"Vanderbilt University logo transparent.svg",
    uchicago:"Chicago Maroons logo.svg",
    tufts:"Tufts University wordmark.svg",
    pomona:"Pomona College logo.svg",
    haverford:"Haverford college wordmark black.png",
    williams:"Williams College wordmark.svg",
    bowdoin:"Bowdoin college blacklogo.png",
    columbia:"Columbia College of Columbia University Crown 2020.svg"
  };

  const curatedImages = {
    mit:["Great dome of MIT, Feb 2021 (2) (cropped).jpg","https://commons.wikimedia.org/wiki/File:Great_dome_of_MIT,_Feb_2021_(2)_(cropped).jpg"],
    stanford:["Stanford University Main Quad (cropped).jpg","https://commons.wikimedia.org/wiki/File:Stanford_University_Main_Quad_(cropped).jpg"],
    princeton:["Nassau Hall - Princeton University (55144981395).jpg","https://commons.wikimedia.org/wiki/File:Nassau_Hall_-_Princeton_University_(55144981395).jpg"],
    yale:["Yale University Old Campus.JPG","https://commons.wikimedia.org/wiki/File:Yale_University_Old_Campus.JPG"],
    duke:["Duke University Chapel side in July 2025.jpg","https://commons.wikimedia.org/wiki/File:Duke_University_Chapel_side_in_July_2025.jpg"],
    cornell:["Cornell University from McGraw Tower.JPG","https://commons.wikimedia.org/wiki/File:Cornell_University_from_McGraw_Tower.JPG"],
    brown:["Brown University.jpg","https://commons.wikimedia.org/wiki/File:Brown_University.jpg"],
    rice:["Rice University - Rice statue with Lovett Hall.JPG","https://commons.wikimedia.org/wiki/File:Rice_University_-_Rice_statue_with_Lovett_Hall.JPG"],
    vanderbilt:["Kirkland Hall at Vanderbilt University.jpg","https://commons.wikimedia.org/wiki/File:Kirkland_Hall_at_Vanderbilt_University.jpg"],
    uchicago:["University of Chicago main quadrangles.jpg","https://commons.wikimedia.org/wiki/File:University_of_Chicago_main_quadrangles.jpg"],
    tufts:["Ballou Hall at Tufts University at Medford Massachusetts USA built in 1852 by Gridley JF Bryant.jpg","https://commons.wikimedia.org/wiki/File:Ballou_Hall_at_Tufts_University_at_Medford_Massachusetts_USA_built_in_1852_by_Gridley_JF_Bryant.jpg"],
    pomona:["Pomona College - Claremont Colleges.jpg","https://commons.wikimedia.org/wiki/File:Pomona_College_-_Claremont_Colleges.jpg"],
    haverford:["Haverfordfounders.jpg","https://commons.wikimedia.org/wiki/File:Haverfordfounders.jpg"],
    williams:["Williams College - Thompson Memorial Chapel exterior view.JPG","https://commons.wikimedia.org/wiki/File:Williams_College_-_Thompson_Memorial_Chapel_exterior_view.JPG"],
    bowdoin:["Hubbard Hall (2026).jpg","https://commons.wikimedia.org/wiki/File:Hubbard_Hall_(2026).jpg"],
    columbia:["Columbia University - Low Library.jpg","https://commons.wikimedia.org/wiki/File:Columbia_University_-_Low_Library.jpg"]
  };

  const knownFallbacks = {
    mit:{year:"2024–25",sat:{composite:[1520,1550,1570],reading:[740,760,780],math:[780,800,800]}},
    columbia:{year:"2024–25",sat:{composite:[1510,1540,1560],reading:[740,760,780],math:[770,790,800]}},
    princeton:{year:"2025–26",sat:{composite:[1490,1530,1560],reading:[740,760,780],math:[760,790,800]}},
    stanford:{year:"2025–26",sat:{composite:[1520,1550,1570],reading:[750,760,780],math:[770,790,800]}},
    harvard:{year:"IPEDS 2024",sat:{composite:[1510,1550,1580],reading:[740,760,780],math:[770,790,800]}},
    williams:{year:"2025–26",sat:{composite:[1490,1520,1550],reading:[740,750,770],math:[740,770,790]}},
    yale:{year:"2025–26",sat:{composite:[1470,1530,1560],reading:[730,760,780],math:[740,780,790]}},
    vanderbilt:{year:"2025–26",sat:{composite:[1510,1530,1560],reading:[740,750,770],math:[770,780,790]}},
    rice:{year:"2025–26",sat:{composite:[1510,1540,1560],reading:[740,760,770],math:[760,790,800]}},
    uchicago:{year:"2025–26",sat:{composite:[1500,1540,1560],reading:[740,760,770],math:[760,780,790]}},
    cornell:{year:"2025–26",sat:{composite:[1490,1530,1550],reading:[730,750,770],math:[770,790,800]}},
    brown:{year:"2025–26",sat:{composite:[1470,1520,1550],reading:[730,750,770],math:[730,770,790]}},
    duke:{year:"2025–26",sat:{composite:[1510,1550,1570],reading:[740,760,780],math:[770,790,790]}},
    pomona:{year:"2025–26",sat:{composite:[1490,1520,1550],reading:[740,760,770],math:[730,770,790]}},
    bowdoin:{year:"2025–26",sat:{composite:[1470,1510,1540],reading:[730,750,770],math:[730,760,780]}},
    haverford:{year:"2025–26",sat:{composite:[1460,1490,1530],reading:[720,750,760],math:[720,750,780]}},
    tufts:{year:"2025–26",sat:{composite:[1460,1500,1520],reading:[720,740,760],math:[730,760,780]}},
    "uc-berkeley":{year:"IPEDS 2020",sat:{composite:[1310,1430,1530],reading:[650,700,740],math:[660,730,790]}},
    ucla:{year:"IPEDS 2019",sat:{composite:[1300,1420,1530],reading:[650,700,740],math:[650,720,790]}},
    ucsb:{year:"IPEDS 2020",sat:{composite:[1230,1350,1460],reading:[620,670,710],math:[610,680,750]}},
    "uc-davis":{year:"IPEDS 2020",sat:{composite:[1160,1280,1400],reading:[570,620,670],math:[590,660,730]}},
    ucsc:{year:"IPEDS 2020",sat:{composite:[1160,1270,1360],reading:[580,630,670],math:[580,640,690]}},
    ucr:{year:"IPEDS 2020",sat:{composite:[1080,1190,1280],reading:[540,590,630],math:[540,600,650]}},
    sdsu:{year:"IPEDS 2020",sat:{composite:[1090,1200,1300],reading:[550,600,640],math:[540,600,660]}},
    csulb:{year:"IPEDS 2020",sat:{composite:[1020,1130,1240],reading:[510,570,620],math:[510,570,620]}}
  };

  const mathHeavy = new Set(["mit","caltech","georgia-tech","cmu","uiuc","purdue","ut-austin","harvey-mudd","texas-am","virginia-tech","rice","umd"]);
  const verbalHeavy = new Set(["williams","amherst","swarthmore","wellesley","pomona","bowdoin","haverford","middlebury","wesleyan","colby","hamilton","smith","bates","davidson"]);

  const round10 = (value) => Number.isFinite(Number(value)) ? Math.round(Number(value) / 10) * 10 : null;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function estimatedFromRank(rank, id) {
    const median = clamp(round10(1560 - (Math.max(1, rank) - 1) * 2.3), 1180, 1560);
    const composite = [clamp(median - 60, 400, 1600), median, clamp(median + 40, 400, 1600)];
    const bias = mathHeavy.has(id) ? -20 : verbalHeavy.has(id) ? 10 : 0;
    const reading = composite.map((score) => clamp(round10(score / 2 + bias), 200, 800));
    const math = composite.map((score, i) => clamp(round10(score - reading[i]), 200, 800));
    return {year:"Estimated",sat:{composite,reading,math}};
  }

  function normalizeTriplet(values, min, max) {
    let [low, mid, high] = values.map(round10);
    if (!Number.isFinite(low) && Number.isFinite(mid) && Number.isFinite(high)) low = round10(mid - (high - mid));
    if (!Number.isFinite(high) && Number.isFinite(low) && Number.isFinite(mid)) high = round10(mid + (mid - low));
    if (!Number.isFinite(mid) && Number.isFinite(low) && Number.isFinite(high)) mid = round10((low + high) / 2);
    if (![low,mid,high].every(Number.isFinite)) return null;
    low = clamp(low,min,max); mid = clamp(mid,min,max); high = clamp(high,min,max);
    if (mid < low) mid = low;
    if (high < mid) high = mid;
    return [low,mid,high];
  }

  function federalValue(data, key) {
    const raw = data?.federal?.[key]?.value_numeric;
    if (raw === null || raw === undefined || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  function browserValue(data, key) {
    const raw = data?.browser?.[key];
    if (raw === null || raw === undefined || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  function buildSatFromData(u, data) {
    if (!data) return null;

    let reading = normalizeTriplet([
      browserValue(data,"sat_ebrw_p25") ?? federalValue(data,"sat_ebrw_p25"),
      browserValue(data,"sat_ebrw_p50") ?? federalValue(data,"sat_ebrw_p50"),
      browserValue(data,"sat_ebrw_p75") ?? federalValue(data,"sat_ebrw_p75")
    ],200,800);

    let math = normalizeTriplet([
      browserValue(data,"sat_math_p25") ?? federalValue(data,"sat_math_p25"),
      browserValue(data,"sat_math_p50") ?? federalValue(data,"sat_math_p50"),
      browserValue(data,"sat_math_p75") ?? federalValue(data,"sat_math_p75")
    ],200,800);

    let composite = normalizeTriplet([
      browserValue(data,"sat_composite_p25"),
      browserValue(data,"sat_composite_p50"),
      browserValue(data,"sat_composite_p75")
    ],400,1600);

    let derived = false;

    if (!composite && reading && math) {
      composite = reading.map((score,i) => round10(score + math[i]));
      derived = true;
    }

    if (!reading && composite && math) {
      reading = composite.map((score,i) => clamp(round10(score - math[i]),200,800));
      derived = true;
    }

    if (!math && composite && reading) {
      math = composite.map((score,i) => clamp(round10(score - reading[i]),200,800));
      derived = true;
    }

    if ((!reading || !math) && composite) {
      const bias = mathHeavy.has(u.id) ? -20 : verbalHeavy.has(u.id) ? 10 : 0;
      const estimatedReading = composite.map((score) => clamp(round10(score / 2 + bias),200,800));
      const estimatedMath = composite.map((score,i) => clamp(round10(score - estimatedReading[i]),200,800));
      if (!reading) reading = estimatedReading;
      if (!math) math = estimatedMath;
      derived = true;
    }

    if (!composite || !reading || !math) return null;

    const browserHasSat = data.browser && [
      data.browser.sat_composite_p25,data.browser.sat_composite_p50,data.browser.sat_composite_p75,
      data.browser.sat_ebrw_p25,data.browser.sat_ebrw_p50,data.browser.sat_ebrw_p75,
      data.browser.sat_math_p25,data.browser.sat_math_p50,data.browser.sat_math_p75
    ].some((value) => Number.isFinite(Number(value)));

    const federalYears = Object.values(data.federal || {})
      .map((item) => Number(item?.data_year || item?.collection_year || 0))
      .filter(Number.isFinite);
    const federalYear = federalYears.length ? Math.max(...federalYears) : null;

    const browserComplete = data.browser && [
      "sat_composite_p25","sat_composite_p50","sat_composite_p75",
      "sat_ebrw_p25","sat_ebrw_p50","sat_ebrw_p75",
      "sat_math_p25","sat_math_p50","sat_math_p75"
    ].every((key) => Number.isFinite(Number(data.browser[key])));

    const status = browserComplete && !derived
      ? "Reported CDS"
      : browserHasSat
        ? "Reported + derived"
        : federalYear
          ? "Latest available IPEDS"
          : "Estimated";

    let submitRate = browserValue(data,"sat_submit_rate");
    if (!Number.isFinite(submitRate)) submitRate = federalValue(data,"sat_submit_rate");
    if (Number.isFinite(submitRate) && submitRate <= 1) submitRate *= 100;

    return {
      sat:{composite,reading,math},
      year: browserHasSat ? (data.browser.canonical_year || "Latest CDS") : (federalYear ? "IPEDS " + federalYear : u.year),
      source:data.source_url || u.source,
      dataStatus:status,
      satSubmitRate:Number.isFinite(submitRate) ? Math.round(submitRate) : null
    };
  }

  const universities = (Array.isArray(window.LEXLOGICA_TOP100) ? window.LEXLOGICA_TOP100 : []).map((meta) => {
    const image = curatedImages[meta.id];
    const seed = knownFallbacks[meta.id] || estimatedFromRank(meta.rank, meta.id);
    return {
      ...meta,
      state:(meta.location.split(",").pop() || "").trim(),
      year:seed.year,
      sat:seed.sat,
      dataStatus:knownFallbacks[meta.id] ? "Fallback until live data loads" : "Estimated until live data loads",
      source:"https://www.collegedata.fyi/schools/" + meta.cdId,
      image:image ? commons(image[0]) : null,
      photoSource:image ? image[1] : null,
      mark:universityMarks[meta.id] ? schoolMark(universityMarks[meta.id]) : null,
      markFallback:universityMarks[meta.id] ? schoolMark(universityMarks[meta.id]) : null,
      imageFallback:null
    };
  });

  async function hydrateUniversityData() {
    try {
      const response = await fetch("/api/college-data", {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          schools:universities.map((u) => ({id:u.id,name:u.name,cdId:u.cdId,state:u.state}))
        })
      });
      if (!response.ok) throw new Error("SAT data request failed");
      const payload = await response.json();
      universities.forEach((u) => {
        const hydrated = buildSatFromData(u, payload?.results?.[u.id]);
        if (hydrated) Object.assign(u, hydrated);
      });
    } catch (error) {
      console.warn("Using catalog fallback SAT estimates:", error);
      universities.forEach((u) => {
        if (/until live data loads/i.test(u.dataStatus)) {
          u.dataStatus = knownFallbacks[u.id] ? "Latest saved fallback" : "Estimated";
        }
      });
    }
  }

  const UNIVERSITY_ASSET_CACHE_KEY = "lexlogica_university_assets_v6";
  const UNIVERSITY_ASSET_CACHE_MS = 30 * 24 * 60 * 60 * 1000;

  function applyUniversityAssets(assetResults) {
    universities.forEach((u) => {
      const asset = assetResults?.[u.id];
      if (!asset) return;
      const currentMarkIsVector = /\.svg(?:$|\?)/i.test(String(u.mark || ""));
      const assetMarkIsVector = Boolean(asset.mark_is_vector) || /\.svg(?:$|\?)/i.test(String(asset.mark_url || ""));
      const assetMarkSize = Math.max(Number(asset.mark_width) || 0, Number(asset.mark_height) || 0);
      const assetMarkIsSharp = assetMarkIsVector || assetMarkSize >= 256;

      if (asset.mark_url && (!u.mark || assetMarkIsVector || (!currentMarkIsVector && assetMarkIsSharp))) {
        u.mark = asset.mark_url;
        u.markSource = asset.mark_source || null;
      }
      if (!u.image && asset.campus_url) {
        u.image = asset.campus_url;
        u.photoSource = asset.campus_source || null;
      }
      if (asset.campus_fallback_url && !u.imageFallback) {
        u.imageFallback = asset.campus_fallback_url;
      }
    });
  }

  async function hydrateUniversityAssets() {
    try {
      const cachedRaw = localStorage.getItem(UNIVERSITY_ASSET_CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached?.savedAt && Date.now() - cached.savedAt < UNIVERSITY_ASSET_CACHE_MS && cached.results) {
          applyUniversityAssets(cached.results);
          return;
        }
      }
    } catch {}

    try {
      const schools = universities.map((u) => ({id:u.id,name:u.name}));
      const batches = [];
      for (let i = 0; i < schools.length; i += 20) batches.push(schools.slice(i, i + 20));

      const payloads = await Promise.all(batches.map(async (batch) => {
        const response = await fetch("/api/school-assets", {
          method:"POST",
          headers:{"content-type":"application/json"},
          body:JSON.stringify({schools:batch})
        });
        if (!response.ok) throw new Error("University asset batch failed");
        return response.json();
      }));

      const mergedResults = {};
      payloads.forEach((payload) => Object.assign(mergedResults, payload?.results || {}));
      applyUniversityAssets(mergedResults);

      try {
        localStorage.setItem(UNIVERSITY_ASSET_CACHE_KEY, JSON.stringify({
          savedAt:Date.now(),
          results:mergedResults
        }));
      } catch {}
    } catch (error) {
      console.warn("High-resolution university assets unavailable:", error);
      universities.forEach((u) => {
        if (!u.mark && u.markFallback) u.mark = u.markFallback;
      });
    }
  }

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
    if (![score, lower, median, upper].every(Number.isFinite)) return null;

    const lowerSpan = Math.max(10, median - lower);
    const upperSpan = Math.max(10, upper - median);
    const rawPosition = score >= median
      ? (score - median) / upperSpan
      : (score - median) / lowerSpan;

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
    if (!u.mark) {
      return '<span class="' + cls + ' university-mark-wrap mark-missing" aria-hidden="true"></span>';
    }
    const fallback = escapeHtml(u.markFallback || "");
    return '<span class="' + cls + ' university-mark-wrap" aria-hidden="true">' +
      '<img class="university-mark-image" src="' + escapeHtml(u.mark) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" ' +
      'data-fallback="' + fallback + '" onerror="if(this.dataset.fallback && !this.dataset.usedFallback){this.dataset.usedFallback=\'1\';this.src=this.dataset.fallback;}else{this.remove();this.parentElement.classList.add(\'mark-missing\');}">' +
    '</span>';
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

    const media = u.image
      ? '<div class="university-featured-media"><img src="' + escapeHtml(u.image) + '" alt="' + escapeHtml(u.name) + ' campus" loading="eager" decoding="async" data-fallback="' + escapeHtml(u.imageFallback || "") + '" onerror="if(this.dataset.fallback && !this.dataset.usedFallback){this.dataset.usedFallback=\'1\';this.src=this.dataset.fallback;}else{this.parentElement.classList.add(\'image-failed\');this.remove();}">' +
          (u.photoSource ? '<span class="university-photo-credit">Photo: <a href="' + escapeHtml(u.photoSource) + '" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></span>' : '') + '</div>'
      : '<div class="university-featured-media university-campus-placeholder">' +
          logoImg(u, "university-placeholder-logo") +
          '<span>#' + u.rank + ' · Forbes 2025–26</span></div>';

    featured.innerHTML =
      media +
      '<div class="university-featured-content">' +
        '<div class="university-featured-school">' +
          logoImg(u, "university-featured-logo") +
          '<div><span class="university-rank-chip">#' + u.rank + ' · Forbes 2025–26</span><h3>' + escapeHtml(u.name) + '</h3><p>' +
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
          '<span>Data year: <strong>' + escapeHtml(u.year) + '</strong></span>' +
          '<span class="university-data-status">' + escapeHtml(u.dataStatus || "Reported") + '</span>' +
          (Number.isFinite(u.satSubmitRate) ? '<span>SAT submitted by <strong>' + u.satSubmitRate + '%</strong></span>' : '') +
          (u.note ? '<span>' + escapeHtml(u.note) + '</span>' : '') +
          '<a href="' + escapeHtml(u.source) +
            '" target="_blank" rel="noopener noreferrer">View data source ↗</a>' +
        '</div>' +
      '</div>';
  }

  function card(u) {
    const [lower, median, upper] = u.sat.composite;
    const media = u.image
      ? '<div class="university-card-image"><img src="' + escapeHtml(u.image) + '" alt="' + escapeHtml(u.name) + ' campus" loading="lazy" decoding="async" data-fallback="' + escapeHtml(u.imageFallback || "") + '" onerror="if(this.dataset.fallback && !this.dataset.usedFallback){this.dataset.usedFallback=\'1\';this.src=this.dataset.fallback;}else{this.parentElement.classList.add(\'image-failed\');this.remove();}"></div>'
      : '<div class="university-card-image university-card-placeholder">' + logoImg(u, "university-card-placeholder-logo") + '</div>';

    return '<article class="university-card" tabindex="0" role="button" data-id="' +
      escapeHtml(u.id) + '" aria-label="Show ' + escapeHtml(u.name) + ' SAT data">' +
      media +
      '<div class="university-card-body">' +
        '<div class="university-card-top">' +
          logoImg(u, "university-card-logo") +
          '<div><span class="university-card-rank">#' + u.rank + '</span><h4>' + escapeHtml(u.name) + '</h4><p class="university-card-place">' +
            escapeHtml(u.location) + '</p></div>' +
        '</div>' +
        '<div class="university-card-scores">' +
          '<div><span>Lower quartile</span><strong>' + lower + '</strong></div>' +
          '<div><span>Median</span><strong>' + median + '</strong></div>' +
          '<div><span>Upper quartile</span><strong>' + upper + '</strong></div>' +
        '</div>' +
        '<small class="university-card-data-status">' + escapeHtml(u.dataStatus || "") + ' · ' + escapeHtml(u.year) + '</small>' +
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
      [u.name, u.short, u.location, String(u.rank)].some((value) =>
        String(value).toLowerCase().includes(query)
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

  featured.innerHTML = '<div class="university-catalog-loading">Loading Top 100 SAT data…</div>';
  grid.innerHTML = '<div class="university-catalog-loading">Loading the latest available score ranges…</div>';
  count.textContent = "100 schools";

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

  Promise.all([hydrateUniversityData(), hydrateUniversityAssets(), loadUserProfile()]).then(async ([, , profile]) => {
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
    selectedUniversity = universities[0];
    renderFeatured(selectedUniversity);
    renderGrid(universities);
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