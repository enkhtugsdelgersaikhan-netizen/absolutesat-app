const WIKI_API = "https://en.wikipedia.org/w/api.php";

const titleOverrides = {
  "University of Michigan, Ann Arbor": "University of Michigan",
  "University of Washington, Seattle": "University of Washington",
  "California Polytechnic State University, San Luis Obispo": "California Polytechnic State University",
  "North Carolina State University, Raleigh": "North Carolina State University",
  "Texas A&M University, College Station": "Texas A&M University",
  "Binghamton University, SUNY": "Binghamton University",
  "Stony Brook University, SUNY": "Stony Brook University",
  "CUNY, Baruch College": "Baruch College",
  "University of Oklahoma, Norman": "University of Oklahoma",
  "University of Minnesota, Twin Cities": "University of Minnesota Twin Cities"
};

const badMedia = /(commons-logo|wikimedia|wikidata|wikipedia|icon|map|location|blank|question|checkmark|flag|football|basketball|athletics|sports|mascot|conference|wordmark.*athletic)/i;
const symbolTerms = /(logo|seal|crest|shield|coat of arms|wordmark|emblem|brand mark|monogram)/i;
const campusTerms = /(campus|hall|library|chapel|quad|quadrangle|building|tower|center|centre|college|university|aerial|administration|main building|academic)/i;

const normFile = (title) => String(title || "").replace(/^File:/i, "");

function symbolScore(title) {
  const t = normFile(title);
  if (badMedia.test(t)) return -100;
  let score = 0;
  if (/\.svg$/i.test(t)) score += 9;
  if (/logo/i.test(t)) score += 12;
  if (/seal/i.test(t)) score += 11;
  if (/crest/i.test(t)) score += 10;
  if (/shield/i.test(t)) score += 9;
  if (/coat of arms/i.test(t)) score += 8;
  if (/wordmark/i.test(t)) score += 7;
  if (/emblem/i.test(t)) score += 7;
  if (/monogram/i.test(t)) score += 6;
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

function pickFile(images, scorer) {
  const ranked = (images || [])
    .map((item) => ({ title: item.title, score: scorer(item.title) }))
    .filter((item) => item.score > 0)
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
  const response = await fetch(url, {
    headers: {
      "User-Agent": "LexLogica/1.0 (educational SAT context catalog)",
      Accept: "application/json"
    }
  });
  if (!response.ok) throw new Error("Wikipedia request failed: " + response.status);
  return response.json();
}

function chunks(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function fetchPages(schools) {
  const results = [];
  for (const group of chunks(schools, 20)) {
    const titles = group.map((school) => titleOverrides[school.name] || school.name);
    const payload = await wikiQuery({
      redirects: "1",
      prop: "pageimages|images",
      piprop: "thumbnail|original|name",
      pithumbsize: "1600",
      imlimit: "100",
      titles: titles.join("|")
    });

    const pages = payload?.query?.pages || [];
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
      if (page) results.push({ school, page });
    });
  }
  return results;
}

async function resolveFiles(fileTitles) {
  const map = new Map();
  for (const group of chunks([...new Set(fileTitles.filter(Boolean))], 40)) {
    const payload = await wikiQuery({
      prop: "imageinfo",
      iiprop: "url|canonicaltitle",
      iiurlwidth: "1600",
      titles: group.join("|")
    });
    for (const page of payload?.query?.pages || []) {
      const info = page?.imageinfo?.[0];
      if (!info) continue;
      map.set(page.title, {
        url: info.thumburl || info.url || null,
        original: info.url || null,
        source: info.descriptionurl || ("https://en.wikipedia.org/wiki/" + encodeURIComponent(page.title.replace(/ /g, "_")))
      });
    }
  }
  return map;
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

async function buildAssets(schools) {
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
    const pageImageLooksLikeSymbol = pageImageName ? symbolTerms.test(pageImageName) : false;

    const symbolTitle = pickFile(images, symbolScore);
    let campusTitle = pickFile(images, campusScore);

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

  const fileMap = await resolveFiles(
    picks.flatMap((pick) => [pick.symbolTitle, pick.campusTitle])
  );

  const results = {};
  for (const pick of picks) {
    const symbol = pick.symbolTitle ? fileMap.get(pick.symbolTitle) : null;
    const campus = pick.campusTitle ? fileMap.get(pick.campusTitle) : null;
    const campusUrl = campus?.url || (!pick.pageImageLooksLikeSymbol ? pick.pageThumb : null) || null;

    results[pick.school.id] = {
      wiki_title: pick.page.title || null,
      mark_url: symbol?.original || symbol?.url || null,
      mark_source: symbol?.source || null,
      campus_url: campusUrl,
      campus_source: campus?.source || ("https://en.wikipedia.org/wiki/" + encodeURIComponent(String(pick.page.title || "").replace(/ /g, "_")))
    };
  }

  return results;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const sample = await buildAssets([
        { id: "mit", name: "Massachusetts Institute of Technology" }
      ]);
      return res.status(200).json({
        ok: true,
        sample: sample.mit || null
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
      })).filter((school) => school.id && school.name)
    );

    res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate=2592000");
    return res.status(200).json({ results });
  } catch (error) {
    console.error("school-assets error", error);
    return res.status(502).json({ error: "wikimedia_unavailable" });
  }
};
