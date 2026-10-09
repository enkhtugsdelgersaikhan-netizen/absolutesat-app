#!/usr/bin/env node
// Validate the practice-bank questions users see, not the mock-test reservations.
import fs from "node:fs";
const load = file => JSON.parse(fs.readFileSync(new URL(file,import.meta.url),"utf8"));
const reserved = new Set(load("./mock-test-reservations.json").allQuestionIds.map(String));
const sources = [
 ["Math",[...load("./math-question-bank.json").questions,...load("./math-question-bank-20261010-reviewed.json").questions]],
 ["Reading & Writing",load("./question-bank.json").questions]
];
const allIds=new Set();
let failed=0;
for(const [section,questions] of sources){
 const groups=new Map();
 for(const q of questions){
  if(allIds.has(q.id)){console.error("Duplicate ID:",q.id);failed++}
  allIds.add(q.id);
  if(q.status!=="staged"||reserved.has(String(q.id)))continue;
  const key=q.domain+" / "+(q.subtopic||q.skill);
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(q);
 }
 console.log(section+": "+groups.size+" subtopics");
 for(const [key,qs] of groups){
  const n=qs.length,e=Math.round(.3*n),m=n-2*e;
  const levels=Object.fromEntries(["Easy","Medium","Hard"].map(k=>[k,qs.filter(q=>q.difficulty===k).length]));
  const ok=levels.Easy===e&&levels.Medium===m&&levels.Hard===e;
  if(!ok)failed++;
  console.log((ok?"PASS ":"FAIL ")+key+" "+levels.Easy+"/"+levels.Medium+"/"+levels.Hard+" (target "+e+"/"+m+"/"+e+")");
 }
}
if(failed){console.error("Difficulty-mix violations:",failed);process.exitCode=1}
else console.log("All visible subtopics match whole-question 30/40/30.");
