// Dependency-free behaviour tests of app.js using a minimal DOM adapter.
// Real browser layout/AX checks are separate; this harness does not claim them.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function element(id) {return {id, hidden:false, disabled:false, checked:false, textContent:'', dataset:{}, attributes:{}, handlers:{}, setAttribute(k,v){this.attributes[k]=v}, removeAttribute(k){delete this.attributes[k]}, addEventListener(k,f){this.handlers[k]=f}, focus(){this.focused=true}};}
function boot() {
 const ids=['progress','view-toggle','print','step-nav','controls','back','next','end-actions','restart','copy','copy-status','prediction-summary','priority-summary','prediction-feedback','priority-feedback',...Array.from({length:6},(_,i)=>`heading-${i}`)];
 const els=Object.fromEntries(ids.map(id=>[id,element(id)]));
 const steps=Array.from({length:6},(_,i)=>element(`step-${i}`));
 const nav=steps.map((_,i)=>Object.assign(element(`go-${i}`),{dataset:{go:String(i)}}));
 const inputs=['prediction','priority'].flatMap(name=>['a','b','c','d'].map(value=>Object.assign(element(`${name}-${value}`),{name,value})));
 const window={handlers:{},location:{href:'https://example.test/'},addEventListener(k,f){this.handlers[k]=f},print(){this.printed=true}};
 const document={body:{classList:{toggle(){}}},getElementById:id=>els[id],querySelectorAll:q=>q==='.step'?steps:q==='[data-go]'?nav:q==='input[type="radio"]'?inputs:[]};
 vm.runInNewContext(fs.readFileSync(path.join(root,'dist/app.js'),'utf8'),{document,window,navigator:{clipboard:{writeText:async()=>{}}},URL});
 return {els,steps,nav,inputs,window,click:id=>els[id].handlers.click(),select:(name,value)=>inputs.find(x=>x.name===name&&x.value===value).handlers.change()};
}
const a=boot();
assert.deepEqual(a.steps.map(s=>s.hidden),[false,true,true,true,true,true]);assert.equal(a.els.back.disabled,true);
a.select('prediction','b');assert.equal(a.els['prediction-summary'].textContent,'Only under certain conditions');
a.click('next');assert.equal(a.steps[1].hidden,false);a.click('back');assert.equal(a.els['prediction-summary'].textContent,'Only under certain conditions');
a.select('prediction','c');assert.equal(a.els['prediction-summary'].textContent,'Usually no');
for(let i=0;i<5;i++)a.click('next'); // Skipping every optional selection must work.
assert.equal(a.steps[5].hidden,false);assert.equal(a.els.next.hidden,true);assert.equal(a.els['end-actions'].hidden,false);assert.equal(a.els['priority-summary'].textContent,'No choice selected.');
a.nav[4].handlers.click();a.select('priority','d');assert.equal(a.els['priority-summary'].textContent,'What China can do instead');
a.click('view-toggle');assert(a.steps.every(s=>!s.hidden));assert.equal(a.els.controls.hidden,true);
a.click('view-toggle');assert.equal(a.steps[4].hidden,false);assert.equal(a.els.controls.hidden,false);
a.click('print');assert.equal(a.window.printed,true);
a.click('restart');assert.equal(a.els['prediction-summary'].textContent,'No choice selected.');assert.equal(a.steps[0].hidden,false);
a.select('prediction','a');a.window.handlers.pageshow({persisted:true});assert.equal(a.els['prediction-summary'].textContent,'No choice selected.');
const b=boot();assert.equal(b.els['prediction-summary'].textContent,'No choice selected.');
const script=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
assert(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB)\b/.test(script));
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
assert(!/<form|<iframe|<script[^>]+https?:/i.test(html));assert(!/\saction\s*=/i.test(html));
assert.equal((html.match(/<section class="step"/g)||[]).length,6);
assert(!/<section class="step"[^>]*\bhidden\b/.test(html)); // No-JS reading fallback.
console.log('PASS: selection, change, skip, back, direct navigation, summary, all-content, print action, restart, reload/history reset.');
console.log('PASS: no answer-submission APIs, storage, form submission or third-party scripts; six no-JS-readable sections.');
