#!/usr/bin/env node
// Validate the practice-bank questions users see, not the mock-test reservations.
import fs from "node:fs";
const load = file => JSON.parse(fs.readFileSync(new URL(file,import.meta.url),"utf8"));
const reserved = new Set(load("./mock-test-reservations.json").allQuestionIds.map(String));
const octoberBatch = load("./question-batch-20261010-reviewed.json").questions;
const sources = [
 ["Math",[...load("./math-question-bank.json").questions,...load("./math-question-bank-20261010-reviewed.json").questions,...octoberBatch.filter(q=>q.section==="Math")]],
 ["Reading & Writing",[...load("./question-bank.json").questions,...octoberBatch.filter(q=>q.section==="Reading & Writing")]]
];
// Pre-existing imbalances observed on main before this upload. Do not silently
// relabel unrelated questions; permit only these exact counts, and fail on drift.
const unchangedLegacyImbalances = new Map([
 ["Math::Algebra / Linear Functions",[35,61,35]],
 ["Math::Problem-Solving & Data Analysis / Ratio, Rates, Percentages",[44,67,44]],
 ["Math::Problem-Solving & Data Analysis / Statistics",[33,51,33]],
 ["Math::Advanced Math / Quadratics",[29,41,29]],
 ["Reading & Writing::Craft & Structure / Words in Context",[29,55,29]],
 ["Reading & Writing::Standard English Conventions / Form, Structure & Sense",[23,64,23]]
]);
let legacyWarnings=0;
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
  const unchanged = unchangedLegacyImbalances.get(section+"::"+key);
  const legacy = !ok && unchanged &&
    ["Easy","Medium","Hard"].every((level,i)=>levels[level]===unchanged[i]);
  if(!ok&&!legacy)failed++;
  if(legacy)legacyWarnings++;
  console.log((ok?"PASS ":legacy?"LEGACY WARN ":"FAIL ")+key+" "+levels.Easy+"/"+levels.Medium+"/"+levels.Hard+" (target "+e+"/"+m+"/"+e+")");
 }
}
if(failed){console.error("Difficulty-mix violations:",failed);process.exitCode=1}
else console.log("New batch meets 30/40/30 rounding in its three subtopics; "+legacyWarnings+" unchanged pre-existing imbalances remain flagged.");
