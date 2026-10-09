// Independent semantic checks for SAT Geometry & Trigonometry drawings.
// Read only; use --strict to fail on contradictions, not absent decorative diagrams.
import {readFileSync} from "node:fs";
const bank=JSON.parse(readFileSync("math-question-bank.json","utf8")).questions;
const mocks=Array.from({length:8},(_,i)=>JSON.parse(readFileSync("mock-test-"+(i+1)+".json","utf8")));
const issues=[];const counts={};let checked=0,withDiagram=0,withGraph=0,omitted=0;
const record=(q,kind,msg)=>{counts[kind]=(counts[kind]||0)+1;issues.push({id:q.id,kind,message:msg})};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(a,b,c,eps=.11)=>Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))<=eps*dist(a,b)*Math.max(dist(a,c),1);
function isRight(a,b,c){
 const ax=a.x-b.x,ay=a.y-b.y,cx=c.x-b.x,cy=c.y-b.y;
 return Math.abs(ax*cx+ay*cy)<=.065*Math.hypot(ax,ay)*Math.hypot(cx,cy);
}
function namedRightVertices(t,names){
 const found=[];
 for(const x of t.matchAll(/(?:right at|right angle at)\s+([A-Z])\b/gi))found.push(x[1]);
 for(const x of t.matchAll(/\bangle\s+([A-Z])\s+is\s+(?:a\s+)?right angle\b/gi))found.push(x[1]);
 for(const x of t.matchAll(/\b([A-Z])\s*=\s*90(?:\^|\s|°)/gi))found.push(x[1]);
 for(const x of t.matchAll(/\b([A-Z])\s+and\s+([A-Z])\s+(?:are\s+)?right angles\b/g))found.push(x[1],x[2]);
 for(const x of t.matchAll(/\b(?:hypotenuse|hyp\.)\s+([A-Z])([A-Z])\b/gi))
  found.push(...names.filter(k=>k!==x[1]&&k!==x[2]));
 return [...new Set(found)].filter(v=>names.includes(v));
}
function check(q){
 checked++;
 const d=q.diagram;
 if(q.graph)withGraph++;
 if(!d){if(!q.graph)omitted++;return}
 withDiagram++;
 const t=(q.passage||"")+" "+(q.question||"");
 const points=d.points||[],pointMap=new Map(points.filter(p=>/^[A-Z]$/.test(p.label||"")).map(p=>[p.label,p]));
 const labels=points.filter(p=>/^[A-Z]$/.test(p.label||"")).map(p=>p.label);
 const dup=labels.filter((l,i)=>labels.indexOf(l)!==i);
 if(dup.length)record(q,"duplicate-vertex-label","Repeated point labels: "+dup.join(","));
 const w=+d.width||420,h=+d.height||300;
 for(const p of [...points,...(d.labels||[])])if(!Number.isFinite(+p.x)||!Number.isFinite(+p.y)||p.x<8||p.x>w-8||p.y<8||p.y>h-8)
  record(q,"label-bounds",String(p.label||p.text||"")+" @ "+p.x+","+p.y);
 for(const match of t.matchAll(/\btriangles?\s+([A-Z]{3})\b/g)){
   const names=[...match[1]],present=names.filter(p=>pointMap.has(p));
   if(present.length>0 && present.length<3)record(q,"incomplete-triangle-labels",match[1]+" missing "+names.filter(n=>!pointMap.has(n)).join(","));
   if(present.length===3){
     for(const vertex of namedRightVertices(t,names)){
       const neighbors=names.filter(n=>n!==vertex);
       const p=pointMap.get(vertex),a=pointMap.get(neighbors[0]),b=pointMap.get(neighbors[1]);
       if(!isRight(a,p,b))record(q,"right-angle-wrong",match[1]+" angle "+vertex+" is not right in diagram");
     }
     if(/\bequilateral\b/i.test(t)){
       const lengths=[dist(pointMap.get(names[0]),pointMap.get(names[1])),dist(pointMap.get(names[0]),pointMap.get(names[2])),dist(pointMap.get(names[1]),pointMap.get(names[2]))];
       if(Math.max(...lengths)/Math.min(...lengths)>1.08)record(q,"equilateral-not-equal",lengths.map(x=>x.toFixed(1)).join("/"));
     }
     const equal=t.match(new RegExp("\\b("+names.join("|")+")("+names.join("|")+")\\s*=\\s*("+names.join("|")+")("+names.join("|")+")"));
     if(equal && pointMap.has(equal[1])&&pointMap.has(equal[2])&&pointMap.has(equal[3])&&pointMap.has(equal[4])){
      const v1=dist(pointMap.get(equal[1]),pointMap.get(equal[2]));
      const v2=dist(pointMap.get(equal[3]),pointMap.get(equal[4]));
      if(Math.abs(v1-v2)>0.07*Math.max(v1,v2))record(q,"equal-sides-unequal",equal[0]+" with lengths "+v1.toFixed(1)+" and "+v2.toFixed(1));
     }
   }
 }
 for(const m of t.matchAll(/\bpoint\s+([A-Z])\s+lies\s+on\s+([A-Z])([A-Z])\b/gi)){
  if([m[1],m[2],m[3]].every(k=>pointMap.has(k))&&!near(pointMap.get(m[2]),pointMap.get(m[3]),pointMap.get(m[1]),.065))
   record(q,"misplaced-point",m[1]+" is not on "+m[2]+m[3]);
 }
 const ring=(d.circles||[])[0]||(d.ellipses||[])[0];
 if(ring&&/\bcircle\b/i.test(t)&&!/\bcylinder|cone|sphere|hemisphere\b/i.test(t)){
   const cx=ring.cx,cy=ring.cy,rx=ring.r||ring.rx,ry=ring.r||ring.ry;
   for(const pair of [...t.matchAll(/\bpoints?\s+([A-Z])\s+and\s+([A-Z])\s+(?:lie|are)\s+on\b/g)]){
    for(const n of [pair[1],pair[2]]){const p=pointMap.get(n);if(!p)continue;
     const radius=Math.hypot((p.x-cx)/rx,(p.y-cy)/ry);
     if(Math.abs(radius-1)>.08)record(q,"point-off-circle",n+" radius norm="+radius.toFixed(2));
    }
   }
 }
 if(/(?:in the figure|diagram (?:shows|below)|shown in the figure)/i.test(t)&&!d&&!q.graph)
  record(q,"missing-required-figure","Explicit figure reference with no visual");
}
const geo=bank.filter(q=>/geometry\s*(?:&|and)\s*trigonometry/i.test(q.domain||""));
for(const q of geo)check(q);
const idMap=new Map(geo.map(q=>[q.id,q]));
let mockMatches=0,mockMismatches=0;
for(const m of mocks)for(const section of Object.values(m.sections||{}))
 for(const arr of Object.values(section||{})){if(!Array.isArray(arr))continue;for(const entry of arr){
  const q=entry?.question;if(!q||!idMap.has(q.id))continue;mockMatches++;
  if(JSON.stringify(q.diagram||null)!==JSON.stringify(idMap.get(q.id).diagram||null)){
   mockMismatches++;record(q,"mock-diagram-out-of-sync","Mock copy differs from main bank");
  }
 }}
console.log("GEOMETRY_SEMANTIC_SUMMARY "+JSON.stringify({checked,withDiagram,withGraph,omitted,mockMatches,mockMismatches,counts}));
for(const item of issues)console.log("GEOMETRY_SEMANTIC_ISSUE "+JSON.stringify(item));
if(process.argv.includes("--strict")&&issues.length)process.exitCode=1;
