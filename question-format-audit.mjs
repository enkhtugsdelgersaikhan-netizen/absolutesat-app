// Run: node question-format-audit.mjs [--fix] [--strict] [--json]
// Audits every staged-bank question and every populated mock-test question.
// Only mechanically unambiguous formatting artifacts are auto-fixed.
// Poetry, paired passages, answer content, diagrams, and logical markup
// are never rewritten by heuristic prose reflow.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const files = ["question-bank.json", "math-question-bank.json",
  ...Array.from({ length: 8 }, (_, i) => "mock-test-" + (i + 1) + ".json")];
const fix = process.argv.includes("--fix");
const strict = process.argv.includes("--strict");
const asJson = process.argv.includes("--json");
const textFields = ["passage", "question", "question_text", "explanation",
  "choices", "choiceExplanations", "choice_explanations",
  "table", "graph", "diagram", "choiceTables", "choice_tables",
  "choiceGraphs", "choice_graphs", "acceptedAnswers"];
const ignoredObjectKeys = new Set(["id", "type", "kind", "status", "source",
  "sourceBatch", "url", "href", "dataUrl", "imageUrl", "mimeType"]);
const report = { scanned: 0, uniqueQuestionIds: 0, textFields: 0,
  safeFixes: {}, warnings: {}, files: {}, examples: [] };
const unique = new Set();
const count = (target, name) => { target[name] = (target[name] || 0) + 1; };

const countMatches = (s, re) => (s.match(re) || []).length;
function check(value, location) {
  if (typeof value !== "string") return value;
  report.textFields++;
  let s = value;
  const original = s;
  const fixes = [
    ["windows-line-endings", /\r\n?/g, "\n"],
    ["zero-width-or-soft-hyphen", /[\u200B-\u200D\uFEFF\u00AD]/g, ""],
    ["nonbreaking-space", /\u00A0/g, " "],
    ["invalid-tex-text-environment",
      /\\begin\s*\{\s*text\s*\}([\s\S]*?)\\end\s*\{\s*text\s*\}/gi,
      (_whole, body) => "\\text{" + body + "}"]
  ];
  for (const [name, re, replacement] of fixes) {
    const next = s.replace(re, replacement);
    if (next !== s) { count(report.safeFixes, name); s = next; }
  }
  const warnings = [];
  // Inside TeX, \\[2mm] (and similar lengths) is an ordinary
  // row break, not a second math delimiter. Keep the actual content.
  const delimitersOnly = s.replace(
    /\\\\\[\s*\d+(?:\.\d+)?\s*(?:mm|em|ex|pt|cm|px)\s*\]/gi, "");
  if (countMatches(delimitersOnly, /\\\(/g) !== countMatches(delimitersOnly, /\\\)/g))
    warnings.push("unbalanced-inline-math-delimiters");
  if (countMatches(delimitersOnly, /\\\[/g) !== countMatches(delimitersOnly, /\\\]/g))
    warnings.push("unbalanced-display-math-delimiters");
  if (/\\\\[()[\]]/.test(delimitersOnly))
    warnings.push("doubled-math-escape-review");
  for (const tag of ["i", "em", "u", "strong", "sup", "sub"]) {
    const opening = countMatches(s, new RegExp("<" + tag + "(?:\\s[^>]*)?>", "gi"));
    const closing = countMatches(s, new RegExp("</" + tag + "\\s*>", "gi"));
    if (opening !== closing) warnings.push("unbalanced-html-" + tag);
  }
  if (/\\(?:begin|end)\s*\{\s*text\s*\}/i.test(s))
    warnings.push("unpaired-invalid-tex-text-environment");
  if (/<(?:br|p|div|span)(?:\s[^<>]*?)?\/?>/i.test(s))
    warnings.push("raw-html-layout-review");
  // Explicit line breaks are retained: they can distinguish prose,
  // poetry, paired texts, and tables. Report only, don't reflow.
  // Look only for a lowercase sentence continuing across a hard
  // break. Ordinary paragraphs, explanations, headings, and paired
  // text breaks are not formatting defects.
  if (!/\/ math-/.test(location) &&
      /[\p{Ll},;:]\n[\p{Ll}]/u.test(s) &&
      !/\b(?:poem|poetry|verse|stanza)\b/i.test(s) &&
      !/^(?:Text\s+[12]|Student\s+notes?:|[-•])/im.test(s))
    warnings.push("possible-soft-wrap-manual-review");
  for (const name of warnings) {
    count(report.warnings, name);
    if (name !== "possible-soft-wrap-manual-review") {
      // Detailed diagnostics for the few structural problems; no question
      // content is altered until its exact meaning is reviewed.
      console.error("FORMAT TARGET " + location + " [" + name + "]: " +
        s.slice(0, 1200).replace(/\n/g, "\\n"));
    }
    if (report.examples.length < 120 && name !== "possible-soft-wrap-manual-review")
      report.examples.push({ location, issue: name,
        excerpt: s.slice(0, 150).replace(/\n/g, "\\n") });
  }
  // --fix controls persistence, but the whole report includes what can
  // safely be repaired, even during read-only CI audit mode.
  return fix ? s : original;
}

function inspectTextNode(value, location, parent, key) {
  if (typeof value === "string") {
    const next = check(value, location);
    if (parent && fix && next !== value) parent[key] = next;
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => inspectTextNode(item, location + "[" + i + "]", value, i));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (ignoredObjectKeys.has(k)) continue;
      inspectTextNode(v, location + "." + k, value, k);
    }
  }
}

function questionRecords(data) {
  if (Array.isArray(data.questions)) return data.questions;
  const entries = [];
  for (const section of Object.values(data.sections || {})) {
    for (const moduleQuestions of Object.values(section || {})) {
      if (!Array.isArray(moduleQuestions)) continue;
      for (const entry of moduleQuestions) {
        if (entry && typeof entry === "object") {
          const question = entry.question && typeof entry.question === "object"
            ? entry.question : entry;
          entries.push(question);
        }
      }
    }
  }
  return entries;
}


/*
 * Hand-verified corrections from the 2026-10-09 full-bank inspection.
 * Keep these keyed by question ID so a Math wording fix never touches
 * an unrelated question with a superficially similar formula.
 * Both source banks and reused mock-test copies are repaired together.
 */
function repairKnownQuestionFormats(q) {
  const id = String(q.id || "");
  let changed = false;
  const set = (target, field, value) => {
    if (target && typeof target[field] === "string" && target[field] !== value) {
      target[field] = value;
      changed = true;
    }
  };
  const explanation = (oldFragment, replacement) => {
    const targets = [q];
    for (const name of ["choiceExplanations", "choice_explanations"]) {
      if (q[name] && typeof q[name] === "object") targets.push(q[name]);
    }
    for (const target of targets) {
      for (const [key, value] of Object.entries(target)) {
        if (typeof value === "string" && value.includes(oldFragment))
          set(target, key, replacement);
      }
    }
  };
  if (id === "rw-20261005-new104-q059" && q.table &&
      q.passage?.startsWith("Selected Geothermal Power Stations\nStation\n")) {
    set(q, "passage", "");
  }
  if (id === "rw-20261005-new89-q086" && q.table &&
      q.passage?.startsWith("Leena Patel and colleagues\nbur oak\n")) {
    set(q, "passage", q.passage.slice(q.passage.indexOf("\n\n") + 2));
  }
  if (id === "math-20261006-batch465-q082") {
    explanation("8y\nis the",
      "The expression \\(8y\\) represents the \\(\\boxed{\\text{total number of liters in the large containers}}\\), since there are \\(y\\) large containers holding 8 liters each.");
  }
  if (id === "math-20261006-batch465-q128") {
    explanation("profit=revenue-fixedcost",
      "Because profit equals revenue minus fixed cost, \\(P=24n-6{,}800\\). Adding the fixed cost to both sides gives \\[P+6{,}800=24n.\\] Thus \\(24n\\) is the monthly sales revenue.");
  }
  if (id === "math-20261006-batch465-q216") {
    explanation("\\[64=32.\\]",
      "The first line has slope \\(\\frac{6}{4}=\\frac{3}{2}\\). Choice C has slope \\(\\frac{5}{4}\\), which is different. Two nonparallel lines intersect exactly once, so the system has exactly one solution.");
  }
  if (id === "math-20261006-batch465-q297" &&
      q.choiceExplanations?.A?.includes("7378")) {
    set(q.choiceExplanations, "A", q.explanation);
  }
  if (id === "math-20261006-new409-q048") {
    explanation("The pump transfers\n\nrm",
      "The pump transfers \\(\\frac{r}{m}\\) liters per minute. Since one day has \\(24(60)=1440\\) minutes, \\(d\\) days have \\(1440d\\) minutes. Therefore, \\[\\frac{r}{m}(1440d)=\\frac{1440rd}{m}.\\]");
  }
  if (id === "math-20261006-new409-q334") {
    if (q.passage?.endsWith("Approximately") && /^how far/.test(q.question || "")) {
      set(q, "passage", q.passage.replace(/\s*Approximately$/, ""));
      set(q, "question", "Approximately " + q.question);
    }
    explanation("35seconds",
      "The actual travel-time delay is \\(42-7=35\\) seconds. The signal travels 2 kilometers in 7 seconds, so the distance is \\[35\\left(\\frac{2}{7}\\right)=\\boxed{10}\\text{ km}.\\]");
  }
  if (id === "math-20261006-new409-q356") {
    const convert = value => value
      .replace("\\[1446=24\\]", "\\[\\frac{144}{6}=24\\]")
      .replace("\\[14+21+31+x4=24\\]", "\\[\\frac{14+21+31+x}{4}=24\\]");
    if (typeof q.explanation === "string") set(q, "explanation", convert(q.explanation));
    for (const container of [q.choiceExplanations, q.choice_explanations]) {
      if (!container) continue;
      for (const [key, v] of Object.entries(container)) {
        if (typeof v === "string") set(container, key, convert(v));
      }
    }
  }
  if (id === "math-20261008-huge798-q077") {
    explanation("4-84-0=-1",
      "The slope is \\(\\frac{4-8}{4-0}=-1\\). Since the line passes through \\((0,8)\\), \\(f(x)=-x+8\\). At the x-intercept, \\(0=-x+8\\), so \\(x=8\\). Thus the intercept is \\((8,0)\\).");
  }
  if (changed) count(report.safeFixes, "reviewed-record-" + id);
}

for (const file of files) {
  const path = join(directory, file);
  const raw = readFileSync(path, "utf8");
  const data = JSON.parse(raw);
  const records = questionRecords(data);
  const start = report.scanned;
  for (let i = 0; i < records.length; i++) {
    const question = records[i];
    if (!question || typeof question !== "object") continue;
    report.scanned++;
    const id = String(question.id || file + ":" + i);
    unique.add(id);
    if (fix) repairKnownQuestionFormats(question);
    for (const field of textFields) {
      if (!(field in question)) continue;
      inspectTextNode(question[field], file + " / " + id + " / " + field, question, field);
    }
  }
  report.files[file] = report.scanned - start;
  const next = JSON.stringify(data, null, 2) + "\n";
  if (fix && next !== raw) writeFileSync(path, next);
}
report.uniqueQuestionIds = unique.size;
if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  console.log("Audited " + report.scanned + " question placements (" +
    report.uniqueQuestionIds + " unique IDs), " + report.textFields + " text fields.");
  console.log("By file: " + JSON.stringify(report.files));
  console.log("Safe normalizations found: " + JSON.stringify(report.safeFixes));
  console.log("Potential formatting issues: " + JSON.stringify(report.warnings));
  for (const item of report.examples.slice(0, 35))
    console.log("REVIEW " + item.location + " [" + item.issue + "]: " + item.excerpt);
}
const critical = Object.entries(report.warnings)
  .filter(([name]) => /^(?:unbalanced-(?:inline|display)-math|unbalanced-html|unpaired-invalid-tex)/.test(name));
if (strict && critical.length) {
  console.error("Unresolved structurally suspicious markup remains: " +
    JSON.stringify(Object.fromEntries(critical)));
  process.exitCode = 1;
}
