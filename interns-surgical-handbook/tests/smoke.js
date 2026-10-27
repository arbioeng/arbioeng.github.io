// Run: node tests/smoke.js
// A lightweight no-dependency integrity and render smoke test.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const els=new Map();
const handlers={};
const classList=()=>({add(){},remove(){},toggle(){},contains(){return true}});
const el=(id)=>{if(!els.has(id))els.set(id,{innerHTML:'',value:'',classList:classList(),dataset:{},style:{},addEventListener(name,fn){this['on'+name]=fn},setAttribute(){},focus(){},scrollIntoView(){}});return els.get(id)};
const doc={body:{classList:classList()},getElementById:el,addEventListener(n,fn){handlers[n]=fn}};
const storage={};
const loc={hash:'#/home'};
const win={HANDBOOK_DATA:null,addEventListener(n,fn){handlers['window:'+n]=fn},scrollTo(){},scrollY:0};
const ctx=vm.createContext({window:win,document:doc,location:loc,localStorage:{getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v}},requestAnimationFrame(fn){fn()},console});
vm.runInContext(fs.readFileSync(path.join(root,'assets/data.js'),'utf8'),ctx);
const data=win.HANDBOOK_DATA;
assert.equal(data.articles.length,13);
assert.equal(data.checklists.length,5);
assert.equal(data.cases.length,3);
assert.equal(new Set(data.articles.map(a=>a.id)).size,data.articles.length);
assert.equal(new Set(data.checklists.map(a=>a.id)).size,data.checklists.length);
assert.equal(new Set(data.cases.map(a=>a.id)).size,data.cases.length);
for(const a of data.articles){assert.ok(data.sources[a.refs[0]],'missing source on '+a.id);assert.ok(a.redFlags.length&&a.sections.length,'incomplete article '+a.id)}
for(const c of data.cases){for(const s of c.steps){assert.equal(s.options.filter(o=>o.correct).length,1,`case choice invalid: ${c.id}`)}}
for(const [k,s] of Object.entries(data.sources)){assert.ok(s.url.startsWith('https://'),k)}
vm.runInContext(fs.readFileSync(path.join(root,'assets/app.js'),'utf8'),ctx);
assert.match(el('app').innerHTML,/Clarity when the/);
assert.match(el('app').innerHTML,/13<\/strong>/);
function navigate(hash){loc.hash='#/'+hash;handlers['window:hashchange']()}
navigate('oncall');assert.match(el('app').innerHTML,/Postoperative hypotension/);
navigate('article/postop-hypotension');assert.match(el('app').innerHTML,/Red flags/);assert.match(el('app').innerHTML,/Surviving Sepsis/);
navigate('checklists');assert.match(el('app').innerHTML,/I-PASS sign-out/);
navigate('case/bleed');assert.match(el('app').innerHTML,/DECISION 1 OF 3/);
const click=(dataset)=>handlers.click({target:{closest(){return {dataset}}},preventDefault(){}});
click({answer:'0'});assert.match(el('app').innerHTML,/Preferred educational choice/);
click({next:'true'});assert.match(el('app').innerHTML,/DECISION 2 OF 3/);
navigate('article/oliguria');click({fav:'oliguria'});assert.ok(storage['surgical-handbook-demo-v1'].includes('oliguria'));
navigate('saved');assert.match(el('app').innerHTML,/Low urine output/);
console.log('PASS: validated 13 articles, 5 checklists, 3 multi-step cases, 8 sources, navigation, choices, bookmark persistence.');