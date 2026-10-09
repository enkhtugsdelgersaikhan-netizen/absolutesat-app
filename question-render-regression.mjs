// Regression checks for mixed italics, MathJax row breaks, and bank records.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./question.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./question.css", import.meta.url), "utf8");

function extract(startName, endName, globals, exportedName) {
  const start = source.indexOf("function " + startName + "(");
  const end = source.indexOf("function " + endName + "(");
  assert(start >= 0 && end > start, "Renderer function boundaries not found");
  const context = vm.createContext({ ...globals });
  vm.runInContext(source.slice(start, end) + "\nthis.__tested = " + exportedName + ";", context);
  return context.__tested;
}

const normalizeMath = extract("normalizeCompactFractionArguments",
  "normalizeMathLayoutText", {}, "normalizeMathEscapes");
const cases = "\\[\\begin{cases}x+y=3\\\\[2mm]2x-y=1\\end{cases}\\]";
assert(normalizeMath(cases).includes("\\\\[2mm]"),
  "TeX cases row break with spacing must not turn into display math");
assert.equal(normalizeMath("\\\\(x_2+1\\\\)"), "\\(x_2+1\\)",
  "Paired doubled inline delimiters should be repaired");
assert(normalizeMath("\\begin{text}x\\end{text}").includes("\\text{x}"),
  "Invalid text environments should be converted");

const escapeHtml = value => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const format = extract("renderInlineFormatting", "renderQuestionContent", {
  repairCommonMathNotation: value => String(value),
  normalizeMathLayoutText: value => String(value), escapeHtml
}, "renderInlineFormatting");
assert.equal(format("A <i>rare</i> finding", false),
  "A <em>rare</em> finding", "HTML italics should stay inline");
assert.equal(format("The *archive* survived", false),
  "The <em>archive</em> survived", "Markdown italics should stay intact");
assert.equal(format("2 * 3 * 4", true), "2 * 3 * 4",
  "Multiplication operators should not be removed");
assert.equal(format("x_1", true), "x_1",
  "Undelimited subscripts should not be removed");
assert(css.includes("#question-app .sat-answer-pane .choice-text{\n    display:block!important;"),
  "Choice prose must not use fragment-splitting flex layout");

const rw = JSON.parse(readFileSync(new URL("./question-bank.json", import.meta.url), "utf8"));
const math = JSON.parse(readFileSync(new URL("./math-question-bank.json", import.meta.url), "utf8"));
const find = (data, id) => {
  const q = data.questions.find(q => q.id === id);
  assert(q, "Missing question ID " + id);
  return q;
};
const thermal = find(rw, "rw-20261005-new104-q059");
assert(thermal.table?.rows.length === 4 && thermal.passage === "",
  "Geothermal table should not appear twice");
const woodland = find(rw, "rw-20261005-new89-q086");
assert(woodland.table?.rows.length === 4 &&
  woodland.passage.startsWith("Leena Patel and colleagues found"),
  "Evidence table should not be duplicated in prose");
assert(find(math, "math-20261006-batch465-q216").explanation.includes("\\frac{6}{4}"),
  "Slope fraction has incorrect display notation");
assert(find(math, "math-20261006-new409-q356").explanation.includes("\\frac{144}{6}"),
  "Mean fraction has incorrect display notation");
assert(find(math, "math-20261006-new409-q048").explanation.includes("\\frac{r}{m}"),
  "Rate fraction has incorrect display notation");
console.log("PASS: TeX row breaks, math multiplication, italics, choice layout, and corrected questions");
