// Geometry & Trigonometry visual repair pass.
// Usage: node geo-diagram-repair.mjs [--fix] [--strict] [--details]
// Diagrams are schematics, never evidence for an unstated numerical result.
// Keep mock-test copies of the same question in sync with the main bank.
import {readFileSync,writeFileSync} from "node:fs";
const read=name=>JSON.parse(readFileSync(name,"utf8"));
const write=(name,j)=>writeFileSync(name,JSON.stringify(j,null,2)+"\n");
const bankName="math-question-bank.json";
const mockNames=Array.from({length:8},(_,i)=>"mock-test-"+(i+1)+".json");
const isGeo=q=>/geometry\s*(?:&|and)\s*trigonometry/i.test(q?.domain||"");
const fix=process.argv.includes("--fix");
const strict=process.argv.includes("--strict");
const details=process.argv.includes("--details");
const clamp=(v,l,h)=>Math.min(h,Math.max(l,v));
const round=x=>Math.round(x*100)/100;
const line=(a,b,dashed=false)=>({x1:a[0],y1:a[1],x2:b[0],y2:b[1],dashed});
const label=(x,y,text,anchor="middle")=>({x,y,text:String(text),anchor});
const point=(x,y,name,dx=9,dy=-9)=>({x,y,label:name,dx,dy});
const poly=points=>({points});
const notes={total:0,existing:0,added:0,replaced:0,repaired:0,unchanged:0,
  graphs:0,withoutVisual:0,mockCopies:0,issues:[],invalid:[],bySkill:{}};
const note=(id,kind,detail)=>{if(notes.issues.length<250)notes.issues.push({id,kind,detail})};
// Strip presentation-only MathJax delimiters before matching vertex names.
// SAT content often writes names as \\(ABC\\), not plain ABC.
const geometryPlain=t=>String(t||"").replace(/\\\(/g,"").replace(/\\\)/g,"").replace(/\\\[/g,"").replace(/\\\]/g,"").replace(/\\parallel/g,"parallel");
const base=(alt="Geometry schematic",caption="Schematic; not to scale.")=>({
 width:420,height:300,alt,caption,lines:[],polygons:[],ellipses:[],
 circles:[],points:[],labels:[],rightAngles:[],ticks:[]
});
function pointOnCircle(cx,cy,r,degrees){
 const rad=degrees*Math.PI/180;
 return [round(cx+r*Math.cos(rad)),round(cy-r*Math.sin(rad))];
}
function newCircle(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Circle geometry diagram");
 const center=[205,152],r=104;
 d.circles.push({cx:center[0],cy:center[1],r});
 const centerName=(t.match(/(?:center|cent(?:ered|re))\s+(?:at\s+)?([A-Z])\b/)||[])[1]||"O";
 const named=/\b(?:[Pp]oints?|[Aa]rc|[Cc]hord|[Dd]iameter|[Ss]egment)\s+([A-Z])\s+and\s+([A-Z])\b/.exec(t);
 const pair=named?[named[1],named[2]]:(t.match(/(?:arc|chord|diameter|triangle)\s+([A-Z])([A-Z])\b/)||[]).slice(1,3);
 const names=pair.length===2?pair:[];
 const isDiameter=new RegExp("(?:diameter|diameters).{0,30}(?:"+names.join("")+"|"+names.slice().reverse().join("")+")").test(t);
 const first=pointOnCircle(...center,r,145),second=pointOnCircle(...center,r,isDiameter?325:25);
 if(names.length===2)d.points.push(point(...first,names[0],-12,-11),point(...second,names[1],10,15));
 if(/\b(?:center|cent(?:ered|re))\s+(?:at\s+)?[A-Z]\b/.test(t)||/\bcentral angle\b|triangle O[A-Z]{2}/i.test(t)){
   d.points.push(point(...center,centerName,-14,16));
   d.lines.push(line(center,first),line(center,second));
 }
 if(/\bchord\b|\binscribed\b|\btriangle\s+[A-Z]{3}\b/.test(t))d.lines.push(line(first,second));
 if(/\bdiameter\b/.test(t))d.lines.push(line(first,second));
 return d;
}
function triangleNames(t){
 t=geometryPlain(t);
 const match=/\btriangles?\s+(?:\\\()?([A-Z]{3})\b/.exec(t);
 if(match)return match[1].toUpperCase().split("");
 return ["A","B","C"];
}
function rightVertex(t,names){
 t=geometryPlain(t);
 for(const m of t.matchAll(/(?:is\s+right\s+at|right\s+at|right\s+angle\s+at)\s+([A-Z])\b/gi)){
   if(names.includes(m[1]))return m[1];
 }
 for(const m of t.matchAll(/\b([A-Z])\s+and\s+([A-Z])\s+(?:are\s+)?right angles\b/g)){
   if(names.includes(m[1]))return m[1];
   if(names.includes(m[2]))return m[2];
 }
 const joined=names.join("");
 const patterns=[
 new RegExp("(?:right (?:at|angle at)|\\b"+joined+"\\b is right at)\\s*\\\\?\\(?"+names[0]+"\\b","i"),
 /angle\s+([A-Z])\s+is a right angle/i,
 /angle\s+([A-Z])\s+is right/i,
 /([A-Z])\s*=\s*90\\s*(?:\^?\\{?\\circ|°)/i,
 /\bat\s+([A-Z])\s*(?:is\s+)?(?:a\s+)?right angle/i,
 /\b([A-Z])\s+is\s+the\s+right\s+angle\b/i
 ];
 for(const p of patterns){const m=p.exec(t);if(m){const c=m[1]||names[0];if(names.includes(c))return c}}
 const m=/\bright\s+triangle\s+[A-Z]{3}\s*,?\s*(?:angle\s+)?([A-Z])\s+(?:is\s+)?(?:a\s+)?right/i.exec(t);
 if(m&&names.includes(m[1]))return m[1];
 const h=t.match(/(?:hypotenuse|hyp\.?)\s+([A-Z])([A-Z])/i);
 if(h){return names.find(n=>!h[0].includes(n))||null}
 return null;
}
function newTriangle(q,forcedNames=null){
 const t=(q.passage||"")+" "+(q.question||"");
 const names=forcedNames||triangleNames(t);
 const d=base("Triangle "+names.join("")+" schematic");
 const right=rightVertex(t,names);
 let coords;
 if(right===names[0])coords=[[92,246],[330,246],[92,70]];
 else if(right===names[1])coords=[[92,246],[330,246],[330,70]];
 else if(right===names[2])coords=[[108,65],[325,242],[108,242]];
 else if(new RegExp(names[0]+names[1]+"\\s*=\\s*"+names[0]+names[2]).test(t)||
   /isosceles|equilateral/.test(t.toLowerCase()))
   coords=[[205,60],[91,243],[319,243]];
 else coords=[[105,248],[322,248],[184,69]];
 d.polygons.push(poly(coords));
 const offsets=coords.map(([x,y])=>[x<115?-12:x>310?10:0,y<95?-12:18]);
 const namedTriangle=/\\btriangles?\\s+[A-Z]{3}\\b/.test(t);
 if(namedTriangle)for(let i=0;i<3;i++)d.points.push(point(...coords[i],names[i],...offsets[i]));
 if(right){
   const i=names.indexOf(right),v=coords[i],a=coords[(i+1)%3],b=coords[(i+2)%3];
   const ua=[a[0]-v[0],a[1]-v[1]], ub=[b[0]-v[0],b[1]-v[1]];
   const na=Math.hypot(...ua),nb=Math.hypot(...ub);
   if(Math.abs(ua[0]*ub[0]+ua[1]*ub[1])<.005*na*nb){
     const m=[round(v[0]+ua[0]/na*14),round(v[1]+ua[1]/na*14)];
     const n=[round(v[0]+ub[0]/nb*14),round(v[1]+ub[1]/nb*14)];
     const corner=[round(m[0]+ub[0]/nb*14),round(m[1]+ub[1]/nb*14)];
     d.lines.push({...line(m,corner),rightMark:true},{...line(corner,n),rightMark:true});
   }
 }
 if(/equilateral|isosceles|two congruent sides|two equal sides/i.test(t)){
   if(!right)d.ticks.push({x:round((coords[0][0]+coords[1][0])/2),y:round((coords[0][1]+coords[1][1])/2),angle:32,size:10},
     {x:round((coords[0][0]+coords[2][0])/2),y:round((coords[0][1]+coords[2][1])/2),angle:-32,size:10});
 }
 // Only display lengths explicitly given in the question, never solved values.
 const pat=/\b([A-Z]{2})\s*=\s*(\\\([^\)]{1,28}\\\)|\\frac\{[^}]+\}\{[^}]+\}|\d+(?:\.\d+)?(?:\\sqrt\{?\d+\}?)?)/g;
 let match;let drawn=0;
 while((match=pat.exec(t))&&drawn<4){
   const [u,v]=match[1].split("");let i=names.indexOf(u),j=names.indexOf(v);
   if(i<0||j<0||i===j)continue;
   const mid=[(coords[i][0]+coords[j][0])/2,(coords[i][1]+coords[j][1])/2];
   let dy=mid[1]<130?-12:mid[1]>215?23:-7;
   d.labels.push(label(clamp(mid[0]+(mid[0]<200?-12:12),38,380),clamp(mid[1]+dy,24,275),match[1]+" = "+match[2]));
   drawn++;
 }
 const between= new RegExp("point\\s+([A-Z])\\s+lies\\s+on\\s+"+names[0]+names[1],"i").exec(t);
 if(between){ const [x,y]=coords[0].map((v,i)=>round(v*.55+coords[1][i]*.45));d.points.push(point(x,y,between[1],-14,-12));}
 return d;
}
function newRectangle(q,kind="rectangle"){
 const d=base(kind==="square"?"Square schematic":"Rectangle schematic");
 const vertices=kind==="square"?[[137,80],[283,80],[283,226],[137,226]]:
    [[95,88],[325,88],[325,235],[95,235]];
 d.polygons.push(poly(vertices));
 return d;
}
function newCylinder(q){
 const d=base("Right circular cylinder schematic");
 d.ellipses.push({cx:205,cy:90,rx:104,ry:32},{cx:205,cy:226,rx:104,ry:32});
 d.lines.push(line([101,90],[101,226]),line([309,90],[309,226]));
 return d;
}
function newCone(q){
 const d=base("Right circular cone schematic");
 d.ellipses.push({cx:210,cy:238,rx:100,ry:30});
 d.lines.push(line([210,52],[110,238]),line([210,52],[310,238]));
 return d;
}
function newPrism(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const cube=/\bcubes?\b/i.test(t);
 const d=base(cube?"Cube schematic":"Rectangular prism schematic");
 const a=cube?[118,104]:[92,123],b=cube?[260,104]:[269,123],
   c=cube?[260,246]:[269,247],e=cube?[118,246]:[92,247],
   off=cube?[55,-49]:[48,-40];
 const move=p=>[p[0]+off[0],p[1]+off[1]];
 const front=[a,b,c,e];
 for(let i=0;i<4;i++){d.lines.push(line(front[i],front[(i+1)%4]));d.lines.push(line(front[i],move(front[i])))}
 const back=front.map(move);
 for(let i=0;i<4;i++)d.lines.push(line(back[i],back[(i+1)%4]));
 return d;
}
function newPyramid(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Right rectangular pyramid with a perpendicular height");
 const p=[[91,221],[264,221],[328,266],[153,266]],apex=[209,49];
 d.polygons.push(poly(p));
 d.lines.push(...p.map(v=>line(apex,v)));
 const center=[209,244];
 d.lines.push(line(apex,center,true));
 d.labels.push(label(233,143,"height"));
 return d;
}
function newTransversal(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Two lines intersected by a transversal schematic");
 const pair=(t.match(/lines?\s+\\?\(?([a-zℓ])\\?\)?\s+and\s+\\?\(?([a-zℓ])\b/i)||[]).slice(1,3);
 const names=pair.length===2?pair:["m","n"];
 const unproved=/(?:prove|sufficient|which additional information|would establish)/i.test(t);
 d.lines.push(line([52,92],[363,92]),
   unproved?line([52,223],[363,210]):line([52,216],[363,216]),
   line([112,35],[298,273]));
 d.labels.push(label(41,86,names[0]),label(41,211,names[1]));
 if(/\\btransversal\\s+t\\b/i.test(t))d.labels.push(label(312,273,"t"));
 const expressions=[...t.matchAll(/\b\d+\s*x\s*[+-]\s*\d+\b/g)]
    .map(m=>m[0].replace(/\s+/g,""));
 if(expressions.length>=2){
  const kind=/alternate interior/i.test(t)?"alternate":
    /same-side interior/i.test(t)?"same-side":"corresponding";
  const yUpper=kind==="corresponding"?75:122;
  const posLower=kind==="alternate"?[223,193]:[284,195];
  d.labels.push(label(186,yUpper,expressions[0]+"°"),
    label(...posLower,expressions[1]+"°"));
 }
 if(/parallel/i.test(t)&&!/(?:prove|sufficient|which additional information|would establish)/i.test(t))
   d.alt="Parallel lines "+names.join(" and ")+" with a transversal";
 return d;
}
function newTwinTriangles(q){
 const t=geometryPlain((q.passage||"")+" "+(q.question||""));
 let m=/\btriangles\s+([A-Z]{3})\s+and\s+([A-Z]{3})/.exec(t)||
    /\btriangle\s+([A-Z]{3}).{0,100}\btriangle\s+([A-Z]{3})/.exec(t);
 if(!m||m[1]===m[2]){
  const names=[...new Set([...t.matchAll(/\\btriangles?\\s+([A-Z]{3})\\b/g)].map(x=>x[1]))];
  if(names.length<2)return null;
  m=[null,names[0],names[1]];
 }
 const a=m[1].split(""),b=m[2].split("");
 const d=base("Two triangles "+m[1]+" and "+m[2]+" schematic");
 const coords=[[[64,244],[174,244],[108,89]],[[238,244],[367,244],[283,63]]];
 for(let k=0;k<2;k++){
   const names=k?b:a, p=coords[k];
   const right=rightVertex(t,names);
   if(right===names[0])p[2]=[p[0][0],p[2][1]];
   if(right===names[1])p[2]=[p[1][0],p[2][1]];
   if(right===names[2]){p[0]=[p[0][0],p[2][1]];p[2]=[p[1][0],p[2][1]];}
   d.polygons.push(poly(p));
   for(let i=0;i<3;i++)d.points.push(point(...p[i],names[i],i===1?9:-11,i===2?-13:17));
   if(right)d.labels.push(label(k?292:119,281,"Right angle at "+right));
 }
 return d;
}
function newParallelTriangle(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const names=triangleNames(t);const d=newTriangle(q,names);
 if(names.join("")!=="ABC")return d;
 const [a,b,c]=[[205,65],[92,246],[318,246]];
 d.polygons=[poly([a,b,c])];d.points=[point(...a,"A",0,-12),point(...b,"B",-12,17),point(...c,"C",11,17)];
 const D=[160,138],E=[251,138];
 d.lines.push(line(D,E));
 d.points.push(point(...D,"D",-14,-9),point(...E,"E",8,-8));
 d.alt="Triangle ABC with D on AB, E on AC, and DE parallel to BC";
 return d;
}
function newCircleTangent(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const match=/from an external point\s+([A-Z]),?\s+segments?\s+([A-Z])([A-Z])\s+and\s+([A-Z])([A-Z])\s+are tangent/i.exec(t);
 if(!match)return null;
 const ext=match[1],p=match[3],s=match[5],cen=(t.match(/center\s+([A-Z])/)||[])[1]||"O";
 const d=base("Two tangents from point "+ext+" to a circle");
 const C=[171,155],H=[356,155],r=78,angle=Math.acos(r/185);
 const pts=[C[0]+r*Math.cos(angle),C[1]-r*Math.sin(angle)];
 const pts2=[C[0]+r*Math.cos(angle),C[1]+r*Math.sin(angle)];
 d.circles.push({cx:C[0],cy:C[1],r});
 d.lines.push(line(H,pts),line(H,pts2),line(C,pts),line(C,pts2),line(C,H,true));
 d.points.push(point(...C,cen,-12,18),point(...H,ext,9,-7),point(...pts,p,0,-12),point(...pts2,s,0,19));
 return d;
}

function newEqualCircleSquare(q){
 const d=base("Circle and square with equal areas");
 d.circles.push({cx:120,cy:154,r:66});
 d.polygons.push(poly([[262,96],[379,96],[379,213],[262,213]]));
 d.labels.push(label(120,258,"Circle"),label(320,258,"Square"),label(210,37,"Equal areas"));
 return d;
}
function newInscribedRectangle(q){
 const d=base("Rectangle inscribed in a circle; diagonal is a diameter");
 const r=110,cx=209,cy=155,x=r*.8,y=r*.6;
 d.circles.push({cx,cy,r});
 const p=[[cx-x,cy-y],[cx+x,cy-y],[cx+x,cy+y],[cx-x,cy+y]];
 d.polygons.push(poly(p));
 d.lines.push(line(p[0],p[2]));
 return d;
}
function newShadowComparison(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Two vertical objects casting shadows at the same sun angle");
 d.lines.push(line([45,249],[379,249]));
 const left=[[83,249],[83,104],[192,249]];
 const right=[[251,249],[251,80],[379,249]];
 d.lines.push(line(left[0],left[1]),line(left[1],left[2]),line(right[0],right[1]),line(right[1],right[2]));
 d.labels.push(label(78,179,"Object 1","end"),label(253,178,"Object 2","start"),label(141,267,"Shadow 1"),label(317,267,"Shadow 2"));
 return d;
}
function newCircleArcRays(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Circle with radii and marked central angles");
 const C=[210,156],r=108;
 d.circles.push({cx:C[0],cy:C[1],r});
 const isSemicircle=/semicircle|endpoints of a diameter/i.test(t);
 const angs=isSemicircle?[180,150,45,0]:[0,45,135];
 const names=isSemicircle?["A","C","D","B"]:["A","B","C"];
 d.points.push(point(...C,"O",-13,17));
 for(let i=0;i<angs.length;i++){
  const p=pointOnCircle(...C,r,angs[i]);
  d.lines.push(line(C,p));
  d.points.push(point(...p,names[i],p[0]<C[0]?-15:11,p[1]<C[1]?-12:19));
 }
 if(isSemicircle){d.labels.push(label(120,118,"π/6"),label(297,123,"45°"))}
 else{d.labels.push(label(259,120,"45°"),label(170,101,"135°"))}
 return d;
}
function newAltitudeAndParallel(q){
 const d=base("Triangle ABC with altitude AD and EF parallel to BC");
 const A=[205,53],B=[84,254],C=[326,254],D=[205,254],E=[164.7,120],F=[245.3,120];
 d.polygons.push(poly([A,B,C]));
 d.lines.push(line(A,D),line(E,F));
 for(const [name,v,dx,dy] of [["A",A,0,-12],["B",B,-12,15],["C",C,12,15],
   ["D",D,0,18],["E",E,-13,-6],["F",F,13,-6]])d.points.push(point(...v,name,dx,dy));
 d.rightAngles.push({x:D[0],y:D[1],size:13,rotation:0});
 d.labels.push(label(205,103,"EF ∥ BC"),label(220,190,"AD ⟂ BC"));
 return d;
}
function newParallelSixPoint(q){
 const d=base("Triangle ABC with DE parallel BC and DF parallel AC");
 const A=[205,52],B=[78,253],C=[332,253],t=0.4;
 const D=A.map((v,i)=>round(v*(1-t)+B[i]*t));
 const E=A.map((v,i)=>round(v*(1-t)+C[i]*t));
 const F=B.map((v,i)=>round(v*t+C[i]*(1-t)));
 d.polygons.push(poly([A,B,C]));d.lines.push(line(D,E),line(D,F));
 for(const [name,v,dx,dy] of [["A",A,0,-12],["B",B,-12,17],["C",C,12,17],
    ["D",D,-13,-5],["E",E,13,-5],["F",F,0,18]])d.points.push(point(...v,name,dx,dy));
 d.labels.push(label(119,112,"AD = 8"),label(92,204,"DB = 12"),
    label(214,277,"BC = 25"));
 return d;
}
function newExtendedIsosceles(q){
 const d=base("Isosceles right triangle ABC with BC extended to D");
 const A=[145,95],B=[145,225],C=[275,95],D=[342,28];
 d.polygons.push(poly([A,B,C]));
 d.lines.push(line(C,D));
 for(const [n,p,dx,dy] of [["A",A,-12,-10],["B",B,-12,16],
    ["C",C,10,16],["D",D,10,14]])d.points.push(point(...p,n,dx,dy));
 d.rightAngles.push({x:A[0],y:A[1],size:14,rotation:90});
 return d;
}


function newRightAltitudeToHypotenuse(q){
 const d=base("Right triangle ABC, right at B, with altitude BD to hypotenuse AC");
 const A=[105,105],B=[105,240],C=[285,240],D=[169.8,153.6];
 d.polygons.push(poly([A,B,C]));d.lines.push(line(B,D));
 for(const [n,p,dx,dy] of [["A",A,-14,-9],["B",B,-12,18],
  ["C",C,12,18],["D",D,8,-12]])d.points.push(point(...p,n,dx,dy));
 d.rightAngles.push({x:B[0],y:B[1],size:13,rotation:0});
 d.labels.push(label(155,200,"BD = 12"),label(238,142,"AC = 25"));
 return d;
}
function newCrossedIsosceles(q){
 const d=base("Intersecting lines and two isosceles triangles with exterior ray CF");
 const A=[138,89],E=[210,149],B=[300,224],D=[291,107],C=[103,204],F=[39,237];
 d.lines.push(line(A,B),line(C,D),line(B,D),line(A,C),line(C,F));
 for(const [name,p,dx,dy] of [["A",A,-13,-9],["E",E,10,-13],
  ["B",B,10,18],["C",C,0,19],["D",D,12,-10],["F",F,-10,19]])
    d.points.push(point(...p,name,dx,dy));
 // Mark equal sides BD=BE and AC=CE with distinct tick styles.
 d.ticks.push({x:295.5,y:165.5,angle:5,size:10},
  {x:255,y:186.5,angle:35,size:10},
  {x:120.5,y:146.5,angle:17,size:15},
  {x:156.5,y:176.5,angle:-27,size:15});
 d.labels.push(label(313,209,"46°"));
 return d;
}


function newLadder(q){
 const d=base("Ladder against a vertical wall; ground and wall are perpendicular");
 const corner=[119,251],top=[119,58],foot=[330,251];
 d.lines.push(line(corner,top),line(corner,foot),line(top,foot));
 d.rightAngles.push({x:corner[0],y:corner[1],size:15,rotation:0});
 d.labels.push(label(87,153,"h"),label(222,273,"7 ft"),
    label(244,125,"h + 1"));
 return d;
}
function newIntersectingAngles(q){
 const t=(q.passage||"")+" "+(q.question||"");
 const d=base("Two intersecting lines form equal vertical and supplementary adjacent angles");
 const O=[210,156],a=[80,72],b=[340,240],c=[331,62],e=[89,250];
 d.lines.push(line(a,b),line(c,e));
 const exp=[...t.matchAll(/\d+\s*[a-z]\s*[+-]\s*\d+/gi)].map(m=>m[0].replace(/\s+/g,""));
 if(exp.length>=2)d.labels.push(label(151,129,exp[0]+"°"),label(264,179,exp[1]+"°"));
 return d;
}
function newThreeLineAngles(q){
 const d=base("Three lines meeting at P with adjacent angles 2z, 60, and z");
 const P=[210,174],ang=[180,100,40,0,280,220];
 for(const deg of ang){
  const end=pointOnCircle(...P,124,deg);
  d.lines.push(line(P,end));
 }
 d.points.push(point(...P,"P",9,18));
 d.labels.push(label(146,130,"2z°"),label(232,97,"60°"),label(295,144,"z°"));
 return d;
}
function newSimilarQuads(q){
 const t=geometryPlain((q.passage||"")+" "+(q.question||""));
 const matches=[...t.matchAll(/\bquadrilateral\s+([A-Z]{4})\b/g)].map(m=>m[1]);
 const similar=t.match(/\bsimilar\s+to\s+(?:quadrilateral\s+)?([A-Z]{4})\b/);
 if(similar&&!matches.includes(similar[1]))matches.push(similar[1]);
 if(matches.length<2)return null;
 const d=base("Two similar quadrilaterals, "+matches[0]+" and "+matches[1]);
 const v=[[80,96],[179,87],[193,197],[108,222]];
 const scaled=v.map(([x,y])=>[round(272+(x-80)*.83),round(118+(y-96)*.83)]);
 for(const [k,p] of [[0,v],[1,scaled]]){
  d.polygons.push(poly(p));
  for(let i=0;i<4;i++){
   const labelName=matches[k][i],xy=p[i];
   d.points.push(point(...xy,labelName,i%2?10:-14,i<2?-10:17));
  }
 }
 return d;
}
function newDiameterCoordinate(q){
 const d=base("Circle with diameter endpoints at (−7, 4) and (5, −2)");
 const cx=192,cy=171,scale=11;
 const map=(x,y)=>[cx+x*scale,cy-y*scale];
 const A=map(-7,4),B=map(5,-2),C=map(-1,1);
 const R=Math.hypot(A[0]-B[0],A[1]-B[1])/2;
 d.lines.push(line([36,cy],[389,cy]),line([cx,22],[cx,278]));
 d.circles.push({cx:C[0],cy:C[1],r:round(R)});
 d.lines.push(line(A,B));
 d.points.push(point(...A,"",0,0),point(...B,"",0,0));
 d.labels.push(label(A[0]-5,A[1]-14,"(−7, 4)"),
  label(B[0]+10,B[1]+20,"(5, −2)"));
 return d;
}

function geometryDiagram(q){
 const t=(q.passage||"")+" "+(q.question||"");
 if(["math-20261006-new409-q194","math-20261008-huge798-q128"].includes(q.id))return newSimilarQuads(q);
 if(q.id==="math-20261006-new409-q098")return newLadder(q);
 if(q.id==="math-20261006-new409-q208")return newThreeLineAngles(q);
 if(["math-20261006-new409-q190","math-20261008-huge798-q130"].includes(q.id))return newIntersectingAngles(q);
 if(["math-20261006-new409-q194","math-20261008-huge798-q128"].includes(q.id))return newSimilarQuads(q);
 if(q.id==="math-20261006-new409-q321")return newDiameterCoordinate(q);
 if(q.id==="math-20261006-new409-q319")return newRightAltitudeToHypotenuse(q);
 if(q.id==="math-20261008-huge798-q090")return newCrossedIsosceles(q);
 if(q.id==="math-20261006-new409-q019")return newEqualCircleSquare(q);
 if(q.id==="math-20261008-huge798-q136")return newInscribedRectangle(q);
 if(q.id==="math-20261006-new409-q102"||q.id==="math-20261006-new409-q039")return newCircleArcRays(q);
 if(q.id==="math-20261006-new409-q133")return newAltitudeAndParallel(q);
 if(q.id==="math-20261006-new409-q096")return newParallelSixPoint(q);
 if(q.id==="math-20261006-new409-q109")return newExtendedIsosceles(q);
 if(/(?:mast|tower).+shadow/i.test(t)&&/(?:tree|sculpture)/i.test(t))return newShadowComparison(q);
 if(q.id==="math-20261008-huge798-q156")return newCircleTangent(q);
 const lower=t.toLowerCase();
 const skill=(q.skill||"").toLowerCase();
 if(q.graph||q.table)return null;
 if(/^(?:what is|which expression).*?(?:sin|cos|tan|radians)/i.test(t.trim())&&!/\btriangle\b|circle\b/.test(lower))return null;
 if(/\b(?:arc|circle|radius|diameter|chord|tangent|semicircle)\b/i.test(t)){
   if(/\b(?:cylinder|cone|hemisphere)\b/i.test(t)){}
   else if(/(?:^|\s)(?:equation|system)\b.*\b(?:circle|x\^2|y\^2)/is.test(t)&&
     !/\btangent\b|diameter endpoints|arc|sector|inscribed/i.test(t))return null;
   else if(/\b(?:tangent|tangents)\b/i.test(t)){return newCircleTangent(q)||newCircle(q)}
   else if(/\binscribed\s+(?:in\s+a\s+circle|rectangle|triangle)\b/i.test(t))return newCircle(q);
   else if(/\bcircle\b|\barc\b/.test(t))return newCircle(q);
 }
 if(/\b(?:two parallel lines|transversal)\b/i.test(t))return newTransversal(q);
 if(/\b(?:right circular )?cylinder\b/i.test(t))return newCylinder(q);
 if(/\bcone\b/i.test(t))return newCone(q);
 if(/\b(?:right rectangular )?pyramid\b/i.test(t))return newPyramid(q);
 if(/\b(?:cube|prism)\b/i.test(t))return newPrism(q);
 if(/\b(?:rectangle|rectangular|rectangles)\b/i.test(t))return newRectangle(q);
 if(/\bsquare\b|\bsquares\b/i.test(t))return newRectangle(q,"square");
 if(/\btriangle\b|\btriangles\b/i.test(t)){
   const twins=newTwinTriangles(q);if(twins)return twins;
   if(/points?\s+D\s+lies\s+on\s+(?:\\\()?AB/i.test(t)&&
      /points?\s+E\s+lies\s+on\s+(?:\\\()?AC/i.test(t)&&/DE.*parallel|DE\\parallel/i.test(t))return newParallelTriangle(q);
   return newTriangle(q);
 }
 if(/\b(?:quadrilateral|pentagon|polygon)\b/i.test(t))return null; // do not invent sides or angles
 if(/\b(?:mast|tree|tower).{0,100}\bshadow\b/i.test(t))return newTriangle(q,["A","B","C"]);
 return null;
}
function isDrawingValid(d,q){
 if(!d||typeof d!=="object")return false;
 const w=Number(d.width)||420,h=Number(d.height)||300;
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<240||w>2000||h<180||h>1400)return false;
 let count=0;
 const coord=(v)=>Number.isFinite(+v)&&+v>=-5&&+v<=Math.max(w,h)+5;
 for(const x of d.lines||[]){count++;if(![x.x1,x.y1,x.x2,x.y2].every(coord))return false}
 for(const x of d.circles||[]){count++;if(![x.cx,x.cy,x.r].every(coord)||x.r<=0||x.cx-x.r<0||x.cx+x.r>w||x.cy-x.r<0||x.cy+x.r>h)return false}
 for(const x of d.ellipses||[]){count++;if(![x.cx,x.cy,x.rx,x.ry].every(coord)||x.rx<=0||x.ry<=0||x.cx-x.rx<0||x.cx+x.rx>w||x.cy-x.ry<0||x.cy+x.ry>h)return false}
 for(const x of d.polygons||[]){count++;if(!Array.isArray(x.points)||x.points.length<3||x.points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(coord)))return false}
 for(const x of [...(d.points||[]),...(d.labels||[])])if(!coord(x.x)||!coord(x.y))return false;
 return count>0;
}
function hasMisnamedTriangle(d,q){
 const t=geometryPlain((q.passage||"")+" "+(q.question||""));
 const m=/\btriangles?\s+([A-Z]{3})\b/.exec(t);
 if(!m||!d.points?.length)return false;
 const set=new Set(d.points.filter(p=>p.label&&/^[A-Z]$/.test(p.label)).map(p=>p.label));
 return m[1].split("").some(n=>!set.has(n)) && set.size>=3;
}
function hasWrongCircleGeometry(d,q){
 const t=(q.passage||"")+" "+(q.question||"");
 if(!/\bdiameters?\b/i.test(t)||!d.points||(!d.circles?.length&&!d.ellipses?.length))return false;
 const names=[...(t.matchAll(/\b([A-Z]{2})\s+(?:are|is)\s+diameters?\b/g))].flatMap(m=>m[1].split(""));
 const m=/segments?\s+([A-Z]{2})\s+and\s+([A-Z]{2})\s+are diameters/i.exec(t);
 const pairs=m?[[...m[1]],[...m[2]]]:[];
 if(!pairs.length)return false;
 const ring=(d.circles||[])[0]||(d.ellipses||[])[0];
 const cx=ring.cx,cy=ring.cy;
 for(const [a,b] of pairs){
  const p=d.points.find(p=>p.label===a),v=d.points.find(p=>p.label===b);
  if(!p||!v||Math.hypot((p.x+v.x)/2-cx,(p.y+v.y)/2-cy)>5)return true;
 }
 return false;
}
function cleanDiagram(original){
 const d=structuredClone(original);const w=Number(d.width)||420,h=Number(d.height)||300;
 // Keep existing user-facing measurements. Move offscreen annotations into view.
 for(const obj of [...(d.labels||[]),...(d.points||[])]){
  if(typeof obj.x==="number")obj.x=clamp(obj.x,16,w-16);
  if(typeof obj.y==="number")obj.y=clamp(obj.y,16,h-16);
  if(typeof obj.dx==="number")obj.dx=clamp(obj.dx,-24,24);
  if(typeof obj.dy==="number")obj.dy=clamp(obj.dy,-24,24);
 }
 d.alt=d.alt||"Geometry schematic";
 d.caption=d.caption||"Schematic; not to scale.";
 return d;
}
function annotateGenericDimensions(d,q){
 const t=((q.passage||"")+" "+(q.question||"")).toLowerCase();
 if(d.alt==="Rectangle schematic"){
   d.labels.push(label(210,70,"length"),label(74,166,"width"));
 }
 if(d.alt==="Square schematic")d.labels.push(label(208,66,"side"));
 if(d.alt==="Right circular cylinder schematic"){
   d.lines.push(line([205,90],[309,90]));
   d.labels.push(label(260,80,"radius"),label(331,162,"height"));
 }
 if(d.alt==="Right circular cone schematic"){
   d.lines.push(line([210,52],[210,238],true),line([210,238],[310,238]));
   d.labels.push(label(229,145,"height"),label(264,253,"radius"));
 }
 if(d.alt==="Rectangular prism schematic"||d.alt==="Cube schematic"){
   d.labels.push(label(183,271,"length"),label(83,176,"height"));
 }
 if(d.alt.startsWith("Triangle ")&&/area\b/i.test(t)&&!/right\s+triangle/i.test(t)){
   const p=(d.polygons||[])[0]?.points;
   if(p?.length===3&&Math.abs(p[0][1]-p[1][1])<1){
    d.lines.push(line([p[2][0],p[2][1]],[p[2][0],p[0][1]],true));
    d.labels.push(label((p[0][0]+p[1][0])/2,277,"base"),
      label(p[2][0]+18,(p[2][1]+p[0][1])/2,"height"));
   }
 }
 return d;
}

function isAutoGenerated(d){
 if(!d||typeof d.alt!=="string")return false;
 return /^(?:Circle geometry diagram|Triangle [A-Z]{3} schematic|Two triangles [A-Z]{3} and [A-Z]{3} schematic|Right circular cylinder schematic|Right circular cone schematic|Right rectangular pyramid with a perpendicular height|Ladder against a vertical wall; ground and wall are perpendicular|Three lines meeting at P with adjacent angles 2z, 60, and z|Two intersecting lines form equal vertical and supplementary adjacent angles|Two similar quadrilaterals, [A-Z]{4} and [A-Z]{4}|Circle with diameter endpoints at \(−7, 4\) and \(5, −2\)|Cube schematic|Rectangular prism schematic|Rectangle schematic|Square schematic|Two lines intersected by a transversal schematic|Parallel lines .+ with a transversal)$/.test(d.alt);
}
function repair(q){
 const id=q.id;
 let d=q.diagram;
 if(q.graph){notes.graphs++;return}
 if(d)notes.existing++;
 let replacement=null,reason="";
 if(d){
  if(isAutoGenerated(d)){replacement=geometryDiagram(q);reason="refresh automatically generated geometry"}
  else if(!isDrawingValid(d,q)){replacement=geometryDiagram(q);reason="out-of-range or empty geometry"}
  else if(/\bcircle\b/i.test((q.passage||"")+" "+(q.question||""))&&
     !/\b(?:cylinder|cone|hemisphere|sphere)\b/i.test((q.passage||"")+" "+(q.question||""))&&
     !(d.circles?.length||d.ellipses?.length)){
     replacement=geometryDiagram(q);reason="circle named but none drawn";
  }
  else if(hasMisnamedTriangle(d,q)){replacement=geometryDiagram(q);reason="wrong triangle vertex labels"}
  else if(hasWrongCircleGeometry(d,q)){replacement=geometryDiagram(q);reason="diameter endpoints not opposite"}
  else if(/math-20261006-new409-q(019|023|039|096|102|105|109|130|133|152|156|165|319)$/.test(id) ||
     /math-20261008-huge798-q(090|136|156|164)$/.test(id)){
    replacement=geometryDiagram(q);reason="verified wrong labels or misleading geometry"}
  if(replacement&&isDrawingValid(replacement,q)){
   q.diagram=cleanDiagram(annotateGenericDimensions(replacement,q));notes.replaced++;note(id,"replaced",reason);return;
  }
  const cleaned=cleanDiagram(d);
  if(JSON.stringify(cleaned)!==JSON.stringify(d)){q.diagram=cleaned;notes.repaired++;return}
  notes.unchanged++;return;
 }
 const generated=geometryDiagram(q);
 if(generated&&isDrawingValid(generated,q)){q.diagram=cleanDiagram(annotateGenericDimensions(generated,q));notes.added++;note(id,"added",q.skill);return}
 notes.withoutVisual++;
}
const data=read(bankName);
const ids=new Map();
for(const q of data.questions){
 if(!isGeo(q))continue;
 notes.total++;
 const k=q.skill||"Unclassified";notes.bySkill[k]=(notes.bySkill[k]||0)+1;
 repair(q);
 ids.set(q.id,q.diagram||null);
 if(q.diagram&&!isDrawingValid(q.diagram,q))notes.invalid.push(q.id);
}
if(fix)write(bankName,data);
for(const file of mockNames){
 const mock=read(file);let changed=0;
 for(const section of Object.values(mock.sections||{})){
  for(const entries of Object.values(section||{})){
   if(!Array.isArray(entries))continue;
   for(const entry of entries){
    const q=entry?.question;if(!q||!ids.has(q.id))continue;
    const diagram=ids.get(q.id);
    if(JSON.stringify(q.diagram||null)!==JSON.stringify(diagram)){
     if(diagram)q.diagram=structuredClone(diagram);else delete q.diagram;
     changed++;notes.mockCopies++;
    }
   }
  }
 }
 if(changed&&fix)write(file,mock);
}
const count=Object.fromEntries(Object.entries(notes).filter(([k])=>k!=="issues"&&k!=="invalid"));
console.log("GEOMETRY_REPAIR_SUMMARY "+JSON.stringify(count));
console.log("GEOMETRY_REPAIR_INVALID "+JSON.stringify(notes.invalid));
if(details)for(const issue of notes.issues)console.log("GEOMETRY_REPAIR_DETAIL "+JSON.stringify(issue));
if(strict&&(notes.invalid.length||notes.total!==311)){console.error("Geometry diagram validation failed");process.exitCode=1}
