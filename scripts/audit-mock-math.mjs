/**
 * SAT mock Math integrity checks.
 * Run: node scripts/audit-mock-math.mjs
 * These are structural and targeted mathematical regression tests.
 * They do not replace independent human verification of every solution.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const seenAcrossTests = new Set();
const locations = new Map();
const all = new Map();

for (let test = 1; test <= 8; test++) {
  const data = JSON.parse(readFileSync(new URL(`../mock-test-${test}.json`, import.meta.url), "utf8"));
  const math = data.sections?.math;
  assert(math, `Test ${test} missing Math section`);
  const first = math.module1, low = math.module2Low, high = math.module2High;
  for (const [name, entries] of Object.entries({first,low,high})) {
    assert.equal(entries?.length,22,`Test ${test}, ${name}: expected 22 Math questions`);
    assert.equal(new Set(entries.map(entry=>entry.question?.id)).size,22,`Test ${test}, ${name}: repeated question`);
    for (const entry of entries) {
      const q = entry.question;
      assert(q?.id && q.question && q.explanation,`Test ${test}, ${name}: incomplete question`);
      assert.equal((q.question.match(/\\\[/g)||[]).length,(q.question.match(/\\\]/g)||[]).length,`Bad display Math in ${q.id}`);
      assert.equal((q.question.match(/\\\(/g)||[]).length,(q.question.match(/\\\)/g)||[]).length,`Bad inline Math in ${q.id}`);
      if(q.answerType==="student-response") {
        assert(q.acceptedAnswers?.length,`Missing numeric answer for ${q.id}`);
      } else {
        assert(["A","B","C","D"].includes(q.correctAnswer),`Invalid correct answer for ${q.id}`);
        assert.deepEqual(Object.keys(q.choices||{}).sort(),["A","B","C","D"],`Invalid choices for ${q.id}`);
        assert.equal(new Set(Object.values(q.choices).map(x=>x.trim())).size,4,`Repeated choices for ${q.id}`);
      }
      const previous=all.get(q.id);
      if (previous) assert.equal(JSON.stringify(q),JSON.stringify(previous),`Shared question diverged: ${q.id}`);
      else all.set(q.id,q);
      locations.set(q.id,[...(locations.get(q.id)||[]),`test-${test}/${name}`]);
    }
  }
  const inTest=new Set([...first,...low,...high].map(entry=>entry.question.id));
  assert.equal(inTest.size,54,`Test ${test}: expected 54 unique Math questions across adaptive routes`);
  for(const id of inTest) {
    assert(!seenAcrossTests.has(id),`Math question reused across tests: ${id}`);
    seenAcrossTests.add(id);
  }
}

assert.equal(all.size,432,"Expected 432 distinct Math questions over eight tests");

// Regression checks for faults that previously made real mock questions invalid.
const q = id => {const value=all.get(id);assert(value,`Missing regression question: ${id}`);return value;};
assert(q("math-20261006-batch465-q150").choices.C.includes("14"),"Function-evaluation answer choice is incorrect");
assert.equal(q("math-20261006-batch465-q150").correctAnswer,"C");
assert(q("math-20261006-batch465-q224").question.includes("\\frac12g(x)"),"Y-intercept factor must be a half, not twelve");
assert(q("math-20261006-batch465-q183").question.includes("-\\frac35"),"Line slope lost its denominator");
assert(q("math-20261006-batch465-q391").question.includes("ab^{t/3}"),"Exponential growth formula lost its exponent");
assert(q("math-20261006-new409-q373").choices.C.includes("3^x"),"Exponential-versus-linear question lost its exponent");
assert(q("math-20261006-new409-q345").passage.includes("42 members and 36 nonmembers"),"Shipping question lost its table values");
assert(!q("math-20261006-batch465-q334").explanation.includes("34-16=912"),"Fraction calculation is corrupt");
assert(!q("math-20261006-batch465-q379").explanation.includes("S-35T"),"Formula rearrangement is corrupt");
assert(!q("math-20261006-new409-q384").explanation.includes("6085=1217"),"Conditional probability is corrupt");

console.log(`PASS: 8 mock tests, ${all.size} unique Math questions, ${locations.size} question IDs validated; targeted repairs preserved.`);
