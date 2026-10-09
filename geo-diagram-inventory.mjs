import {readFileSync} from 'node:fs';
const bank=JSON.parse(readFileSync("math-question-bank.json","utf8"));
const q=bank.questions.filter(x=>/Geometry\s*(?:&|and)\s*Trigonometry/i.test(x.domain||""));
const typ={};let withD=0,withG=0,noV=0;
for(const x of q){typ[x.skill||x.subtopic]=(typ[x.skill||x.subtopic]||0)+1;if(x.diagram)withD++;else if(x.graph)withG++;else noV++;}
console.log("GEOMETRY_SUMMARY "+JSON.stringify({total:q.length,types:typ,diagrams:withD,graphs:withG,noVisual:noV}));
const start=Math.max(0,+(process.env.START||0));const end=Math.min(q.length,+(process.env.END||q.length));
for(let i=start;i<end;i++){
 const x=q[i],d=x.diagram,g=x.graph;
 console.log("GEO "+JSON.stringify({i,id:x.id,skill:x.skill,question:((x.passage||"")+" | "+(x.question||"")).slice(0,750),answer:x.correctAnswer,diagram:d||null,graph:g?{type:g.type,series:g.series,points:g.points}:null}));
}