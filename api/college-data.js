const API_BASE = "https://api.collegedata.fyi/rest/v1";
const FRIENDLY_BASE = "https://www.collegedata.fyi/api";
const PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZHV3bXlndm1kb3pocHZ6YWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDk3NTksImV4cCI6MjA5MTY4NTc1OX0.fYZOIHyrOWzidgc-CVxWCY5Fe9pQk12-6YjDIS6y9qs";

const browserFields = [
  "school_id","school_name","canonical_year","archive_url","data_quality_flag",
  "sat_submit_rate","sat_composite_p25","sat_composite_p50","sat_composite_p75",
  "sat_ebrw_p25","sat_ebrw_p50","sat_ebrw_p75",
  "sat_math_p25","sat_math_p50","sat_math_p75"
];

const federalKeys = [
  "sat_submit_rate",
  "sat_ebrw_p25","sat_ebrw_p50","sat_ebrw_p75",
  "sat_math_p25","sat_math_p50","sat_math_p75"
];

const headers = {
  apikey: PUBLIC_KEY,
  Authorization: "Bearer " + PUBLIC_KEY,
  "X-CollegeData-Client": "LexLogica"
};

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const yearNumber = (value) => {
  const m = String(value || "").match(/(20\d{2})/);
  return m ? Number(m[1]) : 0;
};

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("CollegeData request failed: " + response.status);
  return response.json();
}

function chunks(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function browserRows(ids) {
  if (!ids.length) return [];
  const all = [];
  for (const group of chunks([...new Set(ids)], 35)) {
    const filter = "in.(" + group.join(",") + ")";
    const url = API_BASE + "/school_browser_rows?school_id=" + encodeURIComponent(filter) +
      "&select=" + encodeURIComponent(browserFields.join(",")) +
      "&order=canonical_year.desc";
    const rows = await fetchJson(url, { headers });
    all.push(...rows);
  }
  return all;
}

async function federalRows(ids) {
  if (!ids.length) return [];
  const all = [];
  for (const group of chunks([...new Set(ids)], 35)) {
    const schoolFilter = "in.(" + group.join(",") + ")";
    const fieldFilter = "in.(" + federalKeys.join(",") + ")";
    const url = API_BASE + "/school_facts_unified?school_id=" + encodeURIComponent(schoolFilter) +
      "&field_key=" + encodeURIComponent(fieldFilter) +
      "&select=" + encodeURIComponent("school_id,school_name,field_key,value_numeric,value_text,data_year,collection_year,release_type,quality_flag,source_title,source_table,source_variable");
    const rows = await fetchJson(url, { headers });
    all.push(...rows);
  }
  return all;
}

function hasNumericValue(value) {
  if (value === null || value === undefined || value === "") return false;
  return Number.isFinite(Number(value));
}

function chooseLatestSatRow(rows) {
  const sorted = [...rows].sort((a, b) => yearNumber(b.canonical_year) - yearNumber(a.canonical_year));
  const withScore = sorted.find((row) =>
    [row.sat_composite_p25,row.sat_composite_p50,row.sat_composite_p75,row.sat_ebrw_p25,row.sat_ebrw_p50,row.sat_ebrw_p75,row.sat_math_p25,row.sat_math_p50,row.sat_math_p75]
      .some(hasNumericValue)
  );
  return withScore || sorted[0] || null;
}

async function resolveSchool(school) {
  const query = encodeURIComponent(school.name);
  try {
    const payload = await fetchJson(FRIENDLY_BASE + "/schools/search?q=" + query + "&limit=8", {
      headers: { "X-CollegeData-Client": "LexLogica" }
    });
    const results = Array.isArray(payload?.results) ? payload.results : [];
    if (!results.length) return null;

    const wanted = normalize(school.name);
    const exact = results.find((item) => normalize(item.school_name) === wanted);
    const stateMatch = results.find((item) =>
      school.state && String(item.state || "").toUpperCase() === school.state.toUpperCase()
    );
    return (exact || stateMatch || results[0])?.school_id || null;
  } catch {
    return null;
  }
}

async function resolveMissing(schools, alreadyFound) {
  const missing = schools.filter((school) => !alreadyFound.has(school.cdId));
  const resolved = new Map();
  for (const group of chunks(missing, 8)) {
    const batch = await Promise.all(group.map(async (school) => [school.id, await resolveSchool(school)]));
    batch.forEach(([id, schoolId]) => { if (schoolId) resolved.set(id, schoolId); });
  }
  return resolved;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const requestedName = String(req.query?.name || "").trim();
      let requestedId = String(req.query?.id || "mit").trim();
      if (requestedName) {
        requestedId = await resolveSchool({ name: requestedName, state: String(req.query?.state || "").trim() }) || requestedId;
      }
      const rows = await browserRows([requestedId]);
      const latest = chooseLatestSatRow(rows);
      const federal = await federalRows([requestedId]);
      return res.status(200).json({
        ok: true,
        provider: "CollegeData.FYI",
        requested_id: requestedId,
        sample_school: latest?.school_name || requestedId,
        sample_year: latest?.canonical_year || null,
        browser: latest || null,
        federal
      });
    } catch (error) {
      console.error("college-data health error", error);
      return res.status(502).json({ ok: false, error: "college_data_unavailable" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const schools = Array.isArray(req.body?.schools) ? req.body.schools.slice(0, 100) : [];
  if (!schools.length) return res.status(400).json({ error: "missing_schools" });

  try {
    const guessedIds = schools.map((school) => school.cdId).filter(Boolean);
    let bRows = await browserRows(guessedIds);
    const directFound = new Set(bRows.map((row) => row.school_id));
    const resolvedMissing = await resolveMissing(schools, directFound);

    const resolvedIdByLocal = new Map();
    schools.forEach((school) => {
      resolvedIdByLocal.set(
        school.id,
        directFound.has(school.cdId) ? school.cdId : (resolvedMissing.get(school.id) || school.cdId)
      );
    });

    const extraIds = [...resolvedMissing.values()].filter((id) => !directFound.has(id));
    if (extraIds.length) bRows = bRows.concat(await browserRows(extraIds));

    const allResolvedIds = [...new Set([...resolvedIdByLocal.values()].filter(Boolean))];
    const fRows = await federalRows(allResolvedIds);

    const browserById = new Map();
    for (const id of allResolvedIds) {
      browserById.set(id, chooseLatestSatRow(bRows.filter((row) => row.school_id === id)));
    }

    const federalById = new Map();
    for (const row of fRows) {
      if (!federalById.has(row.school_id)) federalById.set(row.school_id, {});
      const bucket = federalById.get(row.school_id);
      const current = bucket[row.field_key];
      const rowYear = Number(row.data_year || row.collection_year || 0);
      const currentYear = Number(current?.data_year || current?.collection_year || 0);
      if (!current || rowYear >= currentYear) bucket[row.field_key] = row;
    }

    const results = {};
    schools.forEach((school) => {
      const schoolId = resolvedIdByLocal.get(school.id);
      results[school.id] = {
        school_id: schoolId,
        browser: browserById.get(schoolId) || null,
        federal: federalById.get(schoolId) || {},
        source_url: schoolId ? "https://www.collegedata.fyi/schools/" + schoolId : null
      };
    });

    res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
    return res.status(200).json({ results });
  } catch (error) {
    console.error("college-data proxy error", error);
    return res.status(502).json({ error: "college_data_unavailable" });
  }
};
