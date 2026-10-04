const WIKI_API = "https://en.wikipedia.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

const titleOverrides = {
  "William & Mary": "College of William & Mary",
  "University of Michigan, Ann Arbor": "University of Michigan",
  "University of Washington, Seattle": "University of Washington",
  "California Polytechnic State University, San Luis Obispo": "California Polytechnic State University",
  "North Carolina State University, Raleigh": "North Carolina State University",
  "Texas A&M University, College Station": "Texas A&M University",
  "Binghamton University, SUNY": "Binghamton University",
  "Stony Brook University, SUNY": "Stony Brook University",
  "CUNY, Baruch College": "Baruch College",
  "University of Oklahoma, Norman": "University of Oklahoma",
  "University of Minnesota, Twin Cities": "University of Minnesota Twin Cities",
  "University of Tennessee, Knoxville": "University of Tennessee",
  "University at Buffalo, SUNY": "University at Buffalo",
  "University at Albany, SUNY": "University at Albany, SUNY",
  "University of Massachusetts Amherst": "University of Massachusetts Amherst",
  "The Cooper Union": "Cooper Union",
  "Franklin W. Olin College of Engineering": "Olin College",
  "Pennsylvania State University": "Pennsylvania State University",
  "University of Nebraska–Lincoln": "University of Nebraska–Lincoln"
};

const badMedia = /(commons-logo|wikimedia|wikidata|wikipedia|wikisource|wiktionary|wikibooks|wikinews|wikiquote|wikiversity|mediawiki|icon|map|location|blank|question|checkmark|flag|football|basketball|athletics|sports|mascot|conference|medicine|medical|hospital|health system|healthcare|wordmark.*athletic)/i;
const symbolTerms = /(logo|seal|crest|shield|coat of arms|wordmark|emblem|brand mark|monogram)/i;
const campusTerms = /(campus|hall|library|chapel|quad|quadrangle|building|tower|center|centre|college|university|aerial|administration|main building|academic)/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, label = "request") {
  let lastResponse = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, options);
    lastResponse = response;
    if (response.ok) return response;
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === 3) break;
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 500 * Math.pow(2, attempt);
    await sleep(waitMs);
  }
  return lastResponse;
}

const normFile = (title) => String(title || "").replace(/^File:/i, "");

function symbolScore(title) {
  const t = normFile(title);
  if (badMedia.test(t)) return -100;
  let score = 0;
  if (/\.svg$/i.test(t)) score += 9;
  if (/seal/i.test(t)) score += 16;
  if (/crest/i.test(t)) score += 15;
  if (/shield/i.test(t)) score += 14;
  if (/coat of arms/i.test(t)) score += 14;
  if (/emblem/i.test(t)) score += 13;
  if (/logo/i.test(t)) score += 10;
  if (/monogram/i.test(t)) score += 10;
  if (/wordmark|textlogo|horizontal/i.test(t)) score -= 3;
  if (/transparent/i.test(t)) score += 2;
  if (campusTerms.test(t)) score -= 8;
  return score;
}

function campusScore(title) {
  const t = normFile(title);
  if (badMedia.test(t) || symbolTerms.test(t)) return -100;
  let score = 0;
  if (/campus/i.test(t)) score += 14;
  if (/quad|quadrangle/i.test(t)) score += 12;
  if (/hall|library|chapel|tower/i.test(t)) score += 10;
  if (/building|main building|administration/i.test(t)) score += 8;
  if (/aerial/i.test(t)) score += 7;
  if (/university|college/i.test(t)) score += 4;
  if (/\.jpe?g$/i.test(t)) score += 4;
  if (/\.png$/i.test(t)) score += 1;
  if (/\.svg$/i.test(t)) score -= 5;
  return score;
}

function pickFile(images, scorer, schoolName = "") {
  const ranked = (images || [])
    .map((item) => {
      const relevance = schoolName ? schoolTokenScore(item.title, schoolName) : 0;
      return { title: item.title, score: scorer(item.title) + relevance, relevance };
    })
    .filter((item) => item.score > 0 && (!schoolName || item.relevance > 0 || /seal|crest|coat of arms/i.test(item.title)))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.title || null;
}

async function wikiQuery(params) {
  const url = new URL(WIKI_API);
  Object.entries({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    ...params
  }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetchWithRetry(url, {
    headers: {
      "User-Agent": "LexLogica/1.0 (educational SAT context catalog)",
      Accept: "application/json"
    }
  }, "Wikipedia");
  if (!response.ok) throw new Error("Wikipedia request failed: " + response.status);
  return response.json();
}

async function commonsQuery(params) {
  const url = new URL(COMMONS_API);
  Object.entries({
    action: "query",
    format: "json",
    formatversion: "2",
    origin: "*",
    ...params
  }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetchWithRetry(url, {
    headers: {
      "User-Agent": "LexLogica/1.0 (educational SAT context catalog)",
      Accept: "application/json"
    }
  }, "Wikimedia Commons");
  if (!response.ok) throw new Error("Wikimedia Commons request failed: " + response.status);
  return response.json();
}


async function wikidataQuery(params) {
  const url = new URL(WIKIDATA_API);
  Object.entries({
    format: "json",
    origin: "*",
    ...params
  }).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetchWithRetry(url, {
    headers: {
      "User-Agent": "LexLogica/1.0 (educational SAT context catalog)",
      Accept: "application/json"
    }
  }, "Wikidata");
  if (!response.ok) throw new Error("Wikidata request failed: " + response.status);
  return response.json();
}

function claimFile(entity, property) {
  const claim = entity?.claims?.[property]?.find((item) => item?.mainsnak?.datavalue?.value);
  const value = claim?.mainsnak?.datavalue?.value;
  return typeof value === "string" && value ? "File:" + value : null;
}

async function fetchWikidataFileTitles(picks) {
  const byId = new Map();
  const qidToSchoolIds = new Map();

  for (const pick of picks) {
    const qid = pick.page?.pageprops?.wikibase_item;
    if (!qid) continue;
    if (!qidToSchoolIds.has(qid)) qidToSchoolIds.set(qid, []);
    qidToSchoolIds.get(qid).push(pick.school.id);
  }

  const qids = [...qidToSchoolIds.keys()];
  for (const group of chunks(qids, 50)) {
    const payload = await wikidataQuery({
      action: "wbgetentities",
      ids: group.join("|"),
      props: "claims"
    });
    for (const [qid, entity] of Object.entries(payload?.entities || {})) {
      const symbolTitle = claimFile(entity, "P94") || claimFile(entity, "P154");
      const campusTitle = claimFile(entity, "P18");
      for (const schoolId of qidToSchoolIds.get(qid) || []) {
        byId.set(schoolId, { qid, symbolTitle, campusTitle });
      }
    }
  }
  return byId;
}

function chunks(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function fetchPages(schools) {
  const batches = await Promise.all(chunks(schools, 20).map(async (group) => {
    const titles = group.map((school) => titleOverrides[school.name] || school.name);
    const payload = await wikiQuery({
      redirects: "1",
      prop: "pageimages|images|pageprops",
      ppprop: "wikibase_item",
      piprop: "thumbnail|original|name",
      pithumbsize: "1600",
      imlimit: "100",
      titles: titles.join("|")
    });

    const pages = payload?.query?.pages || [];
    const pairs = [];
    group.forEach((school, index) => {
      const wanted = titles[index].toLowerCase();
      let page = pages.find((p) => String(p.title || "").toLowerCase() === wanted);
      if (!page) {
        const schoolWords = school.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((x) => x.length > 3);
        page = pages.find((p) => {
          const pt = String(p.title || "").toLowerCase();
          return schoolWords.some((word) => pt.includes(word));
        });
      }
      if (page) pairs.push({ school, page });
    });
    return pairs;
  }));
  return batches.flat();
}

async function resolveFiles(fileTitles) {
  const map = new Map();
  const groups = chunks([...new Set(fileTitles.filter(Boolean))], 40);
  const payloads = await Promise.all(groups.map((group) => wikiQuery({
    prop: "imageinfo",
    iiprop: "url|canonicaltitle|size|mime|mediatype",
    iiurlwidth: "1600",
    titles: group.join("|")
  })));
  for (const payload of payloads) {
    for (const page of payload?.query?.pages || []) {
      const info = page?.imageinfo?.[0];
      if (!info) continue;
      map.set(page.title, {
        title: page.title,
        url: info.thumburl || info.url || null,
        original: info.url || null,
        source: info.descriptionurl || ("https://commons.wikimedia.org/wiki/" + encodeURIComponent(page.title.replace(/ /g, "_"))),
        width: Number(info.width) || null,
        height: Number(info.height) || null,
        mime: info.mime || null,
        mediatype: info.mediatype || null
      });
    }
  }
  return map;
}


function isVectorAsset(asset) {
  return asset?.mime === "image/svg+xml" || /\.svg(?:$|\?)/i.test(String(asset?.original || asset?.url || ""));
}

function isCrispSymbol(asset) {
  if (!asset) return false;
  if (isVectorAsset(asset)) return true;
  return Math.max(Number(asset.width) || 0, Number(asset.height) || 0) >= 256;
}

function isGoodSymbolAsset(asset) {
  if (!isCrispSymbol(asset)) return false;
  const title = String(asset.title || "");
  if (badMedia.test(title)) return false;
  const width = Number(asset.width) || 0;
  const height = Number(asset.height) || 0;
  const ratio = width && height ? Math.max(width / height, height / width) : 1;
  // Very wide text-only marks become tiny and fuzzy in the square symbol slot.
  if (ratio > 3) return false;
  return true;
}

function isGoodCampusAsset(asset) {
  if (!asset || isVectorAsset(asset)) return false;
  const title = String(asset.title || "");
  if (badMedia.test(title) || symbolTerms.test(title)) return false;
  const width = Number(asset.width) || 0;
  const height = Number(asset.height) || 0;
  return Math.max(width, height) >= 700;
}

function schoolTokenScore(title, schoolName) {
  const hay = String(title || "").toLowerCase();
  const tokens = String(schoolName || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !["university","college","institute","technology","state"].includes(token));
  return tokens.reduce((score, token) => score + (hay.includes(token) ? 3 : 0), 0);
}

function commonsAsset(page) {
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  return {
    title: page.title || null,
    url: info.thumburl || info.url || null,
    original: info.url || null,
    source: info.descriptionurl || ("https://commons.wikimedia.org/wiki/" + encodeURIComponent(String(page.title || "").replace(/ /g, "_"))),
    width: Number(info.width) || null,
    height: Number(info.height) || null,
    mime: info.mime || null,
    mediatype: info.mediatype || null
  };
}

async function searchCommonsSymbol(school) {
  const searches = [school.name + " seal", school.name + " crest", school.name + " logo"];
  const candidates = [];
  for (const query of searches) {
    const payload = await commonsQuery({
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "10",
      prop: "imageinfo",
      iiprop: "url|size|mime|mediatype",
      iiurlwidth: "640"
    });
    for (const page of payload?.query?.pages || []) {
      const asset = commonsAsset(page);
      if (!asset || !isGoodSymbolAsset(asset)) continue;
      const width = Number(asset.width) || 1;
      const height = Number(asset.height) || 1;
      const ratio = Math.max(width / height, height / width);
      candidates.push({
        asset,
        score: symbolScore(page.title) + schoolTokenScore(page.title, school.name) - Math.max(0, ratio - 1) * 2
      });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.asset || null;
}

async function searchCommonsCampus(school) {
  const searches = [school.name + " campus", school.name + " hall"];
  for (const query of searches) {
    const payload = await commonsQuery({
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "16",
      prop: "imageinfo",
      iiprop: "url|size|mime|mediatype",
      iiurlwidth: "1600"
    });
    const ranked = (payload?.query?.pages || [])
      .map((page) => {
        const asset = commonsAsset(page);
        return {
          asset,
          score: campusScore(page.title) + schoolTokenScore(page.title, school.name)
        };
      })
      .filter((item) => {
        if (!item.asset || item.score <= 0 || isVectorAsset(item.asset)) return false;
        return Math.max(Number(item.asset.width) || 0, Number(item.asset.height) || 0) >= 900;
      })
      .sort((a, b) => b.score - a.score);
    if (ranked.length) return ranked.slice(0, 2).map((item) => item.asset);
  }
  return [];
}

async function resolveCommonsFallbacks(picks, fileMap, wikidataById) {
  const out = new Map();
  const work = picks.filter((pick) => {
    const wd = wikidataById?.get(pick.school.id) || {};
    const wikidataSymbol = wd.symbolTitle ? fileMap.get(wd.symbolTitle) : null;
    const pageSymbol = pick.symbolTitle ? fileMap.get(pick.symbolTitle) : null;
    const currentSymbol = isGoodSymbolAsset(wikidataSymbol) ? wikidataSymbol : pageSymbol;
    const wikidataCampus = wd.campusTitle ? fileMap.get(wd.campusTitle) : null;
    const currentCampus = wikidataCampus || (pick.campusTitle ? fileMap.get(pick.campusTitle) : null);
    const pageCampus = !pick.pageImageLooksLikeSymbol && pick.pageThumb;
    return !isGoodSymbolAsset(currentSymbol) || (!isGoodCampusAsset(currentCampus) && !pageCampus);
  });

  for (const group of chunks(work, 10)) {
    const rows = await Promise.all(group.map(async (pick) => {
      const wd = wikidataById?.get(pick.school.id) || {};
      const wikidataSymbol = wd.symbolTitle ? fileMap.get(wd.symbolTitle) : null;
      const pageSymbol = pick.symbolTitle ? fileMap.get(pick.symbolTitle) : null;
      const currentSymbol = isGoodSymbolAsset(wikidataSymbol) ? wikidataSymbol : pageSymbol;
      const wikidataCampus = wd.campusTitle ? fileMap.get(wd.campusTitle) : null;
      const currentCampus = wikidataCampus || (pick.campusTitle ? fileMap.get(pick.campusTitle) : null);
      const pageCampus = !pick.pageImageLooksLikeSymbol && pick.pageThumb;
      const needSymbol = !isGoodSymbolAsset(currentSymbol);
      const needCampus = !isGoodCampusAsset(currentCampus) && !pageCampus;
      const [symbol, campuses] = await Promise.all([
        needSymbol ? searchCommonsSymbol(pick.school).catch(() => null) : Promise.resolve(null),
        needCampus ? searchCommonsCampus(pick.school).catch(() => []) : Promise.resolve([])
      ]);
      return [pick.school.id, { symbol, campuses }];
    }));
    rows.forEach(([id, assets]) => out.set(id, assets));
  }
  return out;
}

async function searchPageForSchool(school) {
  const payload = await wikiQuery({
    generator: "search",
    gsrsearch: school.name,
    gsrnamespace: "0",
    gsrlimit: "3",
    prop: "pageimages|images",
    piprop: "thumbnail|original|name",
    pithumbsize: "1600",
    imlimit: "100"
  });
  const pages = payload?.query?.pages || [];
  const best = pages[0];
  return best ? { school, page: best } : null;
}

async function buildAssets(schools, options = {}) {
  let pagePairs = await fetchPages(schools);
  const found = new Set(pagePairs.map((pair) => pair.school.id));
  const missing = schools.filter((school) => !found.has(school.id));

  for (const group of chunks(missing, 6)) {
    const searched = await Promise.all(group.map(searchPageForSchool));
    pagePairs.push(...searched.filter(Boolean));
  }

  const picks = pagePairs.map(({ school, page }) => {
    const images = page.images || [];
    const pageImageName = page.pageimage ? "File:" + page.pageimage : null;
    const pageImageLooksLikeSymbol = pageImageName ? (symbolTerms.test(pageImageName) || /\.svg$/i.test(pageImageName) || campusScore(pageImageName) <= 0) : false;

    const symbolTitle = pickFile(images, symbolScore, school.name);
    let campusTitle = pickFile(images, campusScore, school.name);

    if (!campusTitle && pageImageName && !pageImageLooksLikeSymbol) {
      campusTitle = pageImageName;
    }

    return {
      school,
      page,
      symbolTitle,
      campusTitle,
      pageImageLooksLikeSymbol,
      pageThumb: page.thumbnail?.source || page.original?.source || null,
      pageOriginal: page.original?.source || null
    };
  });

  const wikidataById = await fetchWikidataFileTitles(picks).catch(() => new Map());

  const fileMap = await resolveFiles(
    picks.flatMap((pick) => {
      const wd = wikidataById.get(pick.school.id) || {};
      return [pick.symbolTitle, pick.campusTitle, wd.symbolTitle, wd.campusTitle];
    })
  );

  const commonsFallbacks = options.commonsFallbacks === false
    ? new Map()
    : await resolveCommonsFallbacks(picks, fileMap, wikidataById);

  const results = {};
  for (const pick of picks) {
    const wd = wikidataById.get(pick.school.id) || {};
    const wikidataSymbol = wd.symbolTitle ? fileMap.get(wd.symbolTitle) : null;
    const pageSymbol = pick.symbolTitle ? fileMap.get(pick.symbolTitle) : null;
    const extra = commonsFallbacks.get(pick.school.id) || {};
    const symbol = isGoodSymbolAsset(wikidataSymbol)
      ? wikidataSymbol
      : isGoodSymbolAsset(pageSymbol)
        ? pageSymbol
        : (isGoodSymbolAsset(extra.symbol) ? extra.symbol : null);

    const wikidataCampus = wd.campusTitle ? fileMap.get(wd.campusTitle) : null;
    const pageCampus = pick.campusTitle ? fileMap.get(pick.campusTitle) : null;
    const validWikidataCampus = isGoodCampusAsset(wikidataCampus) ? wikidataCampus : null;
    const validPageCampus = isGoodCampusAsset(pageCampus) ? pageCampus : null;
    const pageThumbUrl = !pick.pageImageLooksLikeSymbol ? pick.pageThumb : null;
    const pageCampusUrl = validPageCampus?.url || pageThumbUrl || null;
    const searchedCampuses = Array.isArray(extra.campuses) ? extra.campuses.filter(isGoodCampusAsset) : [];
    const searchedPrimary = searchedCampuses[0] || null;
    const searchedSecondary = searchedCampuses[1] || null;
    const campusUrl = validWikidataCampus?.url || pageCampusUrl || searchedPrimary?.url || null;
    const campusFallbackUrl = validWikidataCampus?.url
      ? (pageCampusUrl || searchedPrimary?.url || null)
      : pageCampusUrl
        ? (searchedPrimary?.url || null)
        : (searchedSecondary?.url || null);

    results[pick.school.id] = {
      wiki_title: pick.page.title || null,
      wikidata_id: wd.qid || null,
      mark_url: symbol?.original || symbol?.url || null,
      mark_source: symbol?.source || null,
      mark_width: symbol?.width || null,
      mark_height: symbol?.height || null,
      mark_is_vector: isVectorAsset(symbol),
      campus_url: campusUrl,
      campus_fallback_url: campusFallbackUrl,
      campus_source: validWikidataCampus?.source || validPageCampus?.source || searchedPrimary?.source || ("https://en.wikipedia.org/wiki/" + encodeURIComponent(String(pick.page.title || "").replace(/ /g, "_")))
    };
  }

  return results;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      if (String(req.query?.set || "") === "problem") {
        const group = [
          { id: "nc-state", name: "North Carolina State University" },
          { id: "gwu", name: "George Washington University" },
          { id: "binghamton", name: "Binghamton University" }
        ];
        const samples = await buildAssets(group);
        return res.status(200).json({ ok: true, samples });
      }
      const requestedId = String(req.query?.id || "mit").trim();
      const requestedName = String(req.query?.name || "Massachusetts Institute of Technology").trim();
      const sample = await buildAssets([
        { id: requestedId || "mit", name: requestedName || "Massachusetts Institute of Technology" }
      ]);
      return res.status(200).json({
        ok: true,
        sample: sample[requestedId || "mit"] || null
      });
    } catch (error) {
      console.error("school-assets health error", error);
      return res.status(502).json({ ok: false, error: "wikimedia_unavailable" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const schools = Array.isArray(req.body?.schools) ? req.body.schools.slice(0, 100) : [];
  if (!schools.length) return res.status(400).json({ error: "missing_schools" });

  try {
    const results = await buildAssets(
      schools.map((school) => ({
        id: String(school.id || ""),
        name: String(school.name || "")
      })).filter((school) => school.id && school.name),
      { commonsFallbacks: String(req.body?.mode || "full") !== "fast" }
    );

    res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate=2592000");
    return res.status(200).json({ results });
  } catch (error) {
    console.error("school-assets error", error);
    return res.status(502).json({ error: "wikimedia_unavailable" });
  }
};
