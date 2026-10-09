// Screenshot every SAT Geometry diagram in real Chromium using the production renderer and CSS.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";
import { chromium } from "playwright";
const read = filename=>readFileSync(filename,"utf8");
const questions=JSON.parse(read("math-question-bank.json")).questions.filter(q=>/geometry\s*(?:&|and)\s*trigonometry/i.test(q.domain||""));
const js=read("question.js"),start=js.indexOf("function renderQuestionDiagram("),end=js.indexOf("function renderQuestionPassage(",start);
if(start<0||end<0)throw Error("Renderer boundaries not found");
const escapeHtml=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const context=vm.createContext({escapeHtml,renderInlineFormatting:v=>escapeHtml(v)});
vm.runInContext(js.slice(start,end)+"\nthis.render = renderQuestionDiagram;",context);
const render=context.render,css=read("style.css")+"\n"+read("question.css");
const dest="geometry-visual-audit";mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1480,height:1170},deviceScaleFactor:1});
const auditCss=[
"body{background:#fafafa;color:#26343a;font-family:Arial,sans-serif;margin:8px}",
"*{box-sizing:border-box}",
".grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;align-items:start}",
".audit-card{position:relative;background:#fff;border:1px solid #e1e4e6;border-radius:6px;overflow:hidden;padding:7px}",
".audit-head{font-size:11px;font-weight:700;display:flex;justify-content:space-between;gap:7px}",
".audit-prompt{height:38px;overflow:hidden;font-size:11px;color:#5d6770;line-height:1.25}",
".question-diagram-wrap{width:100%!important;margin:0 auto!important}",
".question-diagram{width:100%!important;height:235px!important;max-height:235px!important;overflow:visible}",
".question-diagram-caption{font-size:9px}"
].join("\n");
await page.setContent("<html><head><meta charset='UTF-8'><style>"+css+"</style><style>"+auditCss+
"</style></head><body><div class='grid' id='root'></div></body></html>");
const diagrams=questions.filter(q=>q.diagram),all=[],rows=[],batchSize=12;
for(let index=0;index<diagrams.length;index+=batchSize){
 const set=diagrams.slice(index,index+batchSize);
 const cards=set.map(q=>{
  const short=String((q.passage||"")+" "+(q.question||"")).replace(/\s+/g," ").slice(0,220);
  return '<div class="audit-card" data-id="'+escapeHtml(q.id)+'"><div class="audit-head"><span>'+
   escapeHtml(q.id)+'</span><span>'+escapeHtml(q.skill||"")+'</span></div>'+
   '<div class="audit-prompt">'+escapeHtml(short)+'</div>'+render(q.diagram)+'</div>';
 });
 await page.locator("#root").evaluate((e,html)=>e.innerHTML=html,cards.join(""));
 await page.waitForTimeout(60);
 const checks=await page.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
  const clash=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>4 && Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>4;
  return [...document.querySelectorAll(".audit-card")].map(card=>{
   const svg=card.querySelector("svg"),r=box(svg),warnings=[];
   if(r.w<10||r.h<10)warnings.push({kind:"empty-svg"});
   const labels=[...svg.querySelectorAll("text")].map(e=>({text:e.textContent.trim(),box:box(e)}));
   for(let i=0;i<labels.length;i++){
    const a=labels[i];
    if(a.box.x<r.x-1||a.box.x+a.box.w>r.x+r.w+1||a.box.y<r.y-1||a.box.y+a.box.h>r.y+r.h+1)
      warnings.push({kind:"out-of-svg",text:a.text});
    for(let j=i+1;j<labels.length;j++)if(clash(a.box,labels[j].box))
      warnings.push({kind:"text-overlap",text:a.text+" / "+labels[j].text});
   }
   const c=box(card);
   if(r.x<c.x-4||r.x+r.w>c.x+c.w+4)warnings.push({kind:"svg-card-overflow"});
   return {id:card.dataset.id,warnings,svg:{width:r.w,height:r.h},texts:labels.map(x=>x.text)};
  });
 });
 for(const item of checks){item.skill=set.find(v=>v.id===item.id)?.skill;all.push(item)}
 const name=dest+"/contact-"+String(index/batchSize+1).padStart(2,"0")+".png";
 await page.screenshot({path:name,fullPage:true,animations:"disabled"});
 rows.push(name);
 for(const item of checks.filter(x=>x.warnings.length))console.log("VISUAL_WARNING "+JSON.stringify(item));
 console.log("VISUAL_BATCH "+JSON.stringify({batch:index/batchSize+1,count:set.length,file:name,warnings:checks.reduce((n,x)=>n+x.warnings.length,0)}));
}
const summary={scanned:questions.length,diagrams:diagrams.length,graphs:questions.filter(q=>q.graph).length,
 noVisual:questions.filter(q=>!q.graph&&!q.diagram).length,withWarnings:all.filter(x=>x.warnings.length).length,
 warningCounts:Object.fromEntries([...new Set(all.flatMap(x=>x.warnings.map(w=>w.kind)))].map(k=>[k,all.flatMap(x=>x.warnings).filter(w=>w.kind===k).length])),
 contactSheets:rows,items:all};
writeFileSync(dest+"/report.json",JSON.stringify(summary,null,2)+"\n");
console.log("VISUAL_AUDIT_SUMMARY "+JSON.stringify({...summary,items:undefined}));
if(process.argv.includes("--strict")&&summary.withWarnings){
 console.error("VISUAL_AUDIT_FAILED: "+summary.withWarnings+" diagrams have a visible text collision or clipping.");
 process.exitCode=1;
}
await browser.close();
