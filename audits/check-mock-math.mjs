/**
 * SAT Math mock integrity audit.
 *
 * Run from the repository root:
 *   node audits/check-mock-math.mjs
 *
 * Verifies structural invariants and guards against known content regressions.
 * This is NOT a symbolic proof of every mathematical solution: new mathematical
 * questions still need human review before inclusion.
 */
import {readFileSync} from "node:fs";

const failures=[];
const seen=new Map();
const report=[];
const issues=(message)=>failures.push(message);
const count=(value,re)=>((value||"").match(re)||[]).length;
const displayMathWord=/\\\[\s*(?:At|First|Since|Then|Substitute|so|and|Use|For|Now|Cancel|Match|Because|Thus|To|The|Therefore)\s/i;
const mathFields=q=>[
  ["question",q.question],["passage",q.passage],["explanation",q.explanation],
  ...Object.entries(q.choices||{}).map(([key,value])=>["choice "+key,value]),
  ...Object.entries(q.choiceExplanations||{}).map(([key,value])=>["choice explanation "+key,value]),
];

for(let testNumber=1;testNumber<=8;testNumber++){
  const path=`mock-test-${testNumber}.json`;
  const manifest=JSON.parse(readFileSync(path,"utf8"));
  const math=manifest?.sections?.math;
  if(!math){issues(path+": missing Math section");continue;}
  const unique=new Set();
  for(const moduleName of ["module1","module2Low","module2High"]){
    const entries=math[moduleName];
    if(!Array.isArray(entries)||entries.length!==22){
      issues(`${path}/${moduleName}: expected 22 Math questions`);
      continue;
    }
    for(const entry of entries){
      const q=entry?.question;
      if(!q?.id||!q.question||!q.explanation){
        issues(`${path}/${moduleName}: missing ID, stem or explanation`);
        continue;
      }
      unique.add(q.id);
      const original=seen.get(q.id);
      if(original && JSON.stringify(original)!==JSON.stringify(q)){
        issues(`${q.id}: inconsistent question copies across modules/tests`);
      }else if(!original){seen.set(q.id,q);}
      if(q.answerType==="student-response"){
        if(!Array.isArray(q.acceptedAnswers)||q.acceptedAnswers.length===0)
          issues(`${q.id}: no accepted numerical responses`);
      }else{
        const keys=Object.keys(q.choices||{});
        if(keys.length!==4||!["A","B","C","D"].every(key=>keys.includes(key)))
          issues(`${q.id}: expected four multiple-choice options`);
        if(!keys.includes(q.correctAnswer))
          issues(`${q.id}: invalid correct-answer key`);
      }
      if(q.choiceExplanations?.[q.correctAnswer]!==undefined &&
        q.choiceExplanations[q.correctAnswer]!==q.explanation)
        issues(`${q.id}: correct-choice explanation disagrees with main explanation`);
      for(const [field,value] of mathFields(q)){
        if(typeof value!=="string") continue;
        if(count(value,/\\\[/g)!==count(value,/\\\]/g)||
           count(value,/\\\(/g)!==count(value,/\\\)/g))
          issues(`${q.id}/${field}: unmatched LaTeX math delimiters`);
        if(displayMathWord.test(value))
          issues(`${q.id}/${field}: prose incorrectly placed in display-math block`);
        if(field==="question" && /\?\\\]/.test(value))
          issues(`${q.id}: question mark inside display math`);
      }
      if(q.graph?.type==="xy"){
        const bounds=q.graph;
        if(!Number.isFinite(bounds.xMin)||!Number.isFinite(bounds.xMax)||
           bounds.xMin>=bounds.xMax||!Number.isFinite(bounds.yMin)||
           !Number.isFinite(bounds.yMax)||bounds.yMin>=bounds.yMax)
          issues(`${q.id}: invalid XY graph bounds`);
        for (const series of bounds.series || []) {
          for (const point of series.points || []) {
            if (!Array.isArray(point) || point.length < 2 ||
                !point.every(Number.isFinite) ||
                point[0] < bounds.xMin || point[0] > bounds.xMax ||
                point[1] < bounds.yMin || point[1] > bounds.yMax)
              issues(`${q.id}: graph point lies outside visible bounds`);
          }
        }
      }else if(q.graph?.type==="vertical-bar" || q.graph?.type==="horizontal-bar"){
        const n=q.graph.categories?.length||0;
        if(!n||!q.graph.series?.every(series=>series.values?.length===n))
          issues(`${q.id}: invalid bar-chart data`);
      }
    }
  }
  if(unique.size!==54) issues(`${path}: expected 54 distinct Math questions, got ${unique.size}`);
  report.push({test:testNumber,entries:66,unique:unique.size});
}
if(seen.size!==432) issues(`Expected 432 distinct Math questions, got ${seen.size}`);

const mandatory={
 "math-20261006-batch465-q150":q=>q.correctAnswer==="C"&&/14/.test(q.choices.C),
 "math-20261006-batch465-q385":q=>/x>0/.test(q.question),
 "math-20261006-batch465-q224":q=>/\\frac12g/.test(q.question),
 "math-20261006-batch465-q391":q=>/b\^\{t\/3\}/.test(q.question),
 "math-20261006-batch465-q427":q=>/\^\{t-2\}/.test(q.question),
 "math-20261006-new409-q373":q=>/3\^x/.test(q.choices.C),
 "math-20261008-huge798-q629":q=>q.acceptedAnswers.includes("19"),
 "math-20261006-new409-q198":q=>q.acceptedAnswers.includes("12") &&
   ["A","B","C","D","E"].every(label=>q.diagram?.points?.some(point=>point.label===label)),
 "math-20261006-batch465-q463":q=>q.explanation.includes("\\frac{4c}{a}"),
 "math-20261008-huge798-q539":q=>q.diagram?.points?.some(point=>point.label==="D"),
 "math-20261008-huge798-q526":q=>
   ["A","B","C","D","E"].every(label=>q.diagram?.points?.some(point=>point.label===label)),
};
for(const [id,check] of Object.entries(mandatory)){
  const q=seen.get(id);
  if(!q||!check(q))issues(`${id}: known-answer regression`);
}

console.log("SAT Math mock audit:",JSON.stringify(report));
console.log("Distinct Math questions:",seen.size);
if(failures.length){
  for(const failure of failures)console.error("FAIL:",failure);
  process.exitCode=1;
}else console.log("PASS: structural, answer-key, LaTeX and known-regression checks.");
