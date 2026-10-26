/* Step III Field Guide · Dependency-free GitHub Pages app. */
(() => {
'use strict';
const D=window.STEP3_DATA;
const $=id=>document.getElementById(id);
const KEY='step3-field-guide-v1';
const params=new URLSearchParams(location.search);
const DEMO=params.has('demo');
const TODAY=new Date();
const dateKey=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const today=dateKey();
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=(a,b)=>b?Math.min(100,Math.round(100*a/b)):0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(n))?Number(n):0));
const labelDay=s=>{const d=new Date(s+'T12:00:00');return Number.isNaN(d.getTime())?'Not set':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const baseState=()=>({done:{},daily:{},uworld:{done:0,total:2000,correct:0},cases:{},assessments:{},targetDate:'2027-02-03'});
let state=baseState();try{const stored=JSON.parse(localStorage.getItem(KEY)||'null');if(stored && typeof stored==='object') state={...state,...stored,uworld:{...state.uworld,...stored.uworld}}}catch(e){console.warn('Could not read saved state',e)}
if(DEMO){
 state=baseState();
 const ids=D.phases.flatMap(x=>x.sections.flatMap(s=>s.tasks)).map(t=>t.id);
 [...ids.slice(0,6),...ids.slice(10,18),...ids.slice(23,27)].forEach(x=>state.done[x]=true);
 D.weeks.slice(0,3).forEach(w=>w.tasks.slice(0,2).forEach(t=>state.done[t.id]=true));
 state.uworld={done:560,total:2050,correct:395};
 for(let i=1;i<=22;i++)state.cases[i]={first:true,repeat:i<=8,score:i<15?70+(i*3)%24:60+i%20,note:i===7?'Review management timing':''};
 state.daily[today]={0:true,1:true,2:true};
}
let view='dashboard',filter='',hideDone=false,tagFilter='all',caseFilter='',caseShown=20,expanded=new Set(['launch','foundation']);
const allPhaseTasks=D.phases.flatMap(p=>p.sections.flatMap(s=>s.tasks));
const allWeeklyTasks=D.weeks.flatMap(w=>w.tasks);
const allTasks=[...allPhaseTasks,...allWeeklyTasks];
const isDone=id=>!!state.done[id];
const taskTotal=()=>allTasks.length;
const taskCount=()=>allTasks.filter(t=>isDone(t.id)).length;
const phaseCount=p=>p.sections.flatMap(s=>s.tasks).filter(t=>isDone(t.id)).length;
const phaseTotal=p=>p.sections.reduce((n,s)=>n+s.tasks.length,0);
const casesStarted=()=>Object.values(state.cases||{}).filter(v=>v?.first).length;
const casesRepeated=()=>Object.values(state.cases||{}).filter(v=>v?.repeat).length;
const daysUntil=()=>{const target=new Date((state.targetDate||'2027-02-03')+'T12:00:00');return Math.ceil((target-TODAY)/86400000)};
const persist=()=>{if(DEMO)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast('Unable to save — use Export backup')}};
let toastTimer;
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2900)}
function weekCurrent(){let w=D.weeks.findLast(x=>x.start<=today);return w||D.weeks[0]}
const bar=(n,d)=>`<div class="bar"><div class="bar-fill" style="width:${pct(n,d)}%"></div></div>`;
const check=(type,id,checked)=>`<input class="custom-check" type="checkbox" aria-label="Mark complete" data-${type}="${safe(id)}" ${checked?'checked':''}>`;
function taskRow(task,{withDetails=true}={}){
 const done=isDone(task.id),tag=task.tag&&task.tag!=='core'?`<span class="tag ${safe(task.tag)}">${safe(task.tag)}</span>`:'';
 return `<div class="task-row">${check('task',task.id,done)}<div><div class="task-text ${done?'completed':''}">${safe(task.title)}${tag}</div>${withDetails&&task.detail?`<div class="task-details">${safe(task.detail)} ${task.link?`<a href="${safe(task.link)}" target="_blank" rel="noopener noreferrer">Official / study link ↗</a>`:''}</div>`:''}</div></div>`;
}
const heroTitle=(eyebrow,title,description)=>`<section class="page-head"><div class="eyebrow">${safe(eyebrow)}</div><h1>${title}</h1><p class="intro">${description}</p></section>`;
function metrics(){const c=taskCount(),t=taskTotal();const u=state.uworld;return `<section class="metrics" aria-label="Study progress metrics">
 <div class="metric accent-gold"><div class="micro">CHECKLIST PROGRESS</div><div class="metric-value">${pct(c,t)}<span class="unit">%</span></div><div class="metric-footer">${c} of ${t} milestones complete</div><div class="mini-meter"><span style="width:${pct(c,t)}%"></span></div></div>
 <div class="metric"><div class="micro">UWORLD QUESTIONS</div><div class="metric-value">${Number(u.done||0).toLocaleString()} <span class="unit">/ ${Number(u.total||0).toLocaleString()}</span></div><div class="metric-footer">${pct(u.done,u.total)}% of your question target</div><div class="mini-meter"><span style="width:${pct(u.done,u.total)}%"></span></div></div>
 <div class="metric"><div class="micro">CCS CASES ATTEMPTED</div><div class="metric-value">${casesStarted()} <span class="unit">/ 100 goal</span></div><div class="metric-footer">${casesRepeated()} cases repeated</div><div class="mini-meter"><span style="width:${pct(casesStarted(),100)}%"></span></div></div>
 <div class="metric accent-gold"><div class="micro">TARGET EXAM DATE</div><div class="metric-value">${daysUntil()<0?'Past':daysUntil()} ${daysUntil()<0?'':`<span class="unit">days</span>`}</div><div class="metric-footer">${safe(labelDay(state.targetDate))} · tentative</div><div class="mini-meter"><span style="width:${Math.max(0,Math.min(100,100-daysUntil()/100*100))}%"></span></div></div>
 </section>`}
const dailyTasks=['Complete today’s UWorld question goal','Review incorrect and uncertain MCQs','Complete 1–2 CCS practice cases','Revisit cases flagged for repetition','Biostatistics, ethics, or weak-topic review','Record new knowledge gaps and decisions','Update your trackers and plan tomorrow'];
function dailyCheck(){const d=state.daily[today]||{};return dailyTasks.map((t,i)=>`<div class="today-task">${check('daily',i,!!d[i])}<div class="task-text ${d[i]?'completed':''}">${safe(t)}</div></div>`).join('')}
function phasePreview(p,i){const c=phaseCount(p),t=phaseTotal(p);return `<div class="phase-preview"><div class="chapter-no">0${i+1}</div><div class="phase-copy"><strong>${safe(p.title)}</strong><span>${safe(p.range)}</span><div class="bar" style="margin-top:9px">${`<div class="bar-fill" style="width:${pct(c,t)}%"></div>`}</div></div><div class="phase-count">${c}/${t}</div></div>`}
function dashboard(){const c=taskCount(),t=taskTotal(),w=weekCurrent();return `<div class="content">
 ${DEMO?`<div class="demo-banner">✦ DEMO MODE — Example progress only; your real site starts at zero. <a href="./">Exit demo ↗</a></div>`:''}
 <section class="hero"><div><div class="eyebrow">YOUR ROAD TO INDEPENDENT PRACTICE</div><h1>One step <em>closer.</em><br>Every single day.</h1><p class="intro">A calmer way to prepare for USMLE Step 3. Stay on track with a guided study plan, deliberate practice, and one checklist that remembers everything.</p><div class="btn-row" style="margin-top:25px"><button class="btn" data-goto="checklist">Continue your checklist →</button><button class="btn btn-ghost" data-goto="weeks">View study roadmap</button></div></div><div class="hero-art"><div class="progress-ring" style="--amount:${pct(c,t)}%"><div class="ring-center"><div class="ring-number">${pct(c,t)}<small>%</small></div><div class="micro">TOTAL PROGRESS</div></div></div><div class="ring-flourish">✦ ✧ ✦</div></div></section>
 ${metrics()}
 <section class="split"><div><div class="section-heading"><div><div class="micro">THE JOURNEY</div><h2>Study chapters</h2></div><button class="muted-link" data-goto="checklist">All milestones →</button></div><div class="card"><div class="card-body"><div class="phase-list">${D.phases.map(phasePreview).join('')}</div></div></div></div>
 <div><div class="section-heading"><div><div class="micro">STAY CONSISTENT</div><h2>Today's ritual</h2></div><span class="weekly-badge">● DAILY</span></div><div class="card"><div class="card-head"><h3>${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</h3><span class="micro">${Object.values(state.daily[today]||{}).filter(Boolean).length} / 7 DONE</span></div><div class="card-body">${dailyCheck()}</div></div></div></section>
 <section style="margin-top:26px"><div class="card"><div class="card-body"><div class="setting-row" style="padding-top:0"><div><div class="micro" style="color:var(--gold)">CURRENT ROADMAP CHAPTER · WEEK ${w.number}</div><h3 style="font:22px var(--serif);margin-top:7px">${safe(w.focus)}</h3><p>${safe(w.range)} · ${w.tasks.filter(t=>isDone(t.id)).length} of ${w.tasks.length} weekly goals done</p></div><button class="btn btn-secondary" data-goto="weeks">Open this week →</button></div><div class="notice" style="margin:14px 0 0"><strong>Important:</strong> Your February 2027 exam is a target, not a confirmed appointment. Graduation, ECFMG certification, a scheduling permit, and testing-center availability come first. Allow adequate time for score reporting.</div></div></div></section>
 </div>`}
function filteredTasks(tasks){return tasks.filter(x=>(!hideDone||!isDone(x.id))&&(tagFilter==='all'||(x.tag||'core')===tagFilter)&&(!filter||(x.title+' '+x.detail).toLowerCase().includes(filter.toLowerCase())))}
function checklist(){let active=0;const blocks=D.phases.map((p,i)=>{let secHTML='',totalShown=0;p.sections.forEach(s=>{const tasks=filteredTasks(s.tasks);if(!tasks.length)return;totalShown+=tasks.length;secHTML+=`<div class="task-group"><div class="task-group-title">${safe(s.title)}</div>${tasks.map(t=>taskRow(t)).join('')}</div>`});active+=totalShown;if(!totalShown && (filter||hideDone||tagFilter!=='all'))return '';const open=expanded.has(p.id);return `<section class="phase-block"><button class="phase-trigger" data-expand="${p.id}" aria-expanded="${open}"><div class="chapter-no">0${i+1}</div><div class="phase-copy"><strong>${safe(p.title)}</strong><span>${safe(p.range)}</span></div><div class="phase-perc"><strong>${pct(phaseCount(p),phaseTotal(p))}%</strong><span>${phaseCount(p)}/${phaseTotal(p)} tasks</span></div><span class="caret">${open?'▴':'▾'}</span></button>${open?`<div class="phase-inner"><p class="chapter-description">${safe(p.description)}</p>${secHTML||'<p class="empty">Nothing remaining in this chapter.</p>'}</div>`:''}</section>`}).join('');return `<div class="content">${heroTitle('01 / THE MASTER CHECKLIST','Your <em>study path.</em>','Work through preparation, clinical practice, self-assessments and exam readiness. Every task is saved automatically to your browser.')}
 <div class="toolbar"><input class="field field-grow" id="task-search" placeholder="⌕  Search tasks, subjects, resources…" value="${safe(filter)}" aria-label="Search tasks"><select class="select" id="task-tag" aria-label="Priority"><option value="all" ${tagFilter==='all'?'selected':''}>All priorities</option><option value="core" ${tagFilter==='core'?'selected':''}>Core</option><option value="recommended" ${tagFilter==='recommended'?'selected':''}>Recommended</option><option value="optional" ${tagFilter==='optional'?'selected':''}>Optional</option></select><button class="btn btn-ghost btn-small" data-action="hide-done">${hideDone?'Show completed':'Hide completed'}</button><span class="tiny muted mini-text">${taskCount()} / ${taskTotal()} checked</span></div>
 ${blocks||'<div class="card card-body">No tasks match these filters.</div>'}<p class="disclaimer">Tip: click a chapter title to expand or collapse. Optional activities are genuinely optional; completing a resource is not the same as proving readiness.</p></div>`}
function weeks(){const w=weekCurrent();return `<div class="content">${heroTitle('02 / YOUR TIME MAP','Fifteen weeks. <em>One goal.</em>','A realistic progression from clinical foundations to timed blocks, practice assessments, and the February exam window. Dates are planning anchors, not commitments.')}
 <div class="notice"><strong>This week:</strong> Week ${w.number} · ${safe(w.focus)}. Each weekly goal has its own checkbox independent of the master chapters.</div><div class="week-grid">${D.weeks.map(week=>{const c=week.tasks.filter(t=>isDone(t.id)).length;return `<article class="week-card ${week.number===w.number?'current':''}"><div class="week-top"><span class="week-number">${String(week.number).padStart(2,'0')}</span>${week.number===w.number?'<span class="tag recommended">THIS WEEK</span>':''}</div><div><div class="week-focus">${safe(week.focus)}</div><div class="week-date">${safe(week.range)}</div></div>${bar(c,week.tasks.length)}<div class="week-prog">${c} of ${week.tasks.length} completed</div><div>${week.tasks.map(t=>taskRow(t,{withDetails:false})).join('')}</div></article>`}).join('')}</div></div>`}
function ccs(){const started=casesStarted();const filtered=Array.from({length:173},(_,i)=>i+1).filter(i=>!caseFilter||String(i).includes(caseFilter)||String(state.cases[i]?.note||'').toLowerCase().includes(caseFilter.toLowerCase()));const rows=filtered.slice(0,caseShown).map(i=>{const c=state.cases[i]||{};return `<tr><td>Case ${String(i).padStart(3,'0')}</td><td>${check('case-first',i,!!c.first)}</td><td>${check('case-repeat',i,!!c.repeat)}</td><td><input class="field" aria-label="Case ${i} score" type="number" min="0" max="100" value="${c.score??''}" data-case-score="${i}" placeholder="—"></td><td><input class="field note-field" aria-label="Notes for case ${i}" value="${safe(c.note||'')}" data-case-note="${i}" placeholder="Missed intervention, timing…"></td></tr>`}).join('');return `<div class="content">${heroTitle('03 / CLINICAL SIMULATION','Practice the <em>decisions.</em>','Track your initial attempt, repeat attempts, performance, and case-specific reminders. The numbered slots are yours to map to your CCS provider’s case titles.')}
 <div class="split" style="margin-bottom:20px"><div class="card"><div class="card-head"><h3>CCS progress</h3><span class="micro">GOAL · 70–100 CASES</span></div><div class="card-body"><div class="case-counter"><div class="big-number">${started}<span class="unit" style="font:14px var(--sans);color:var(--muted)"> / 100</span></div><div class="progress-legend">${casesRepeated()} case repeats logged<br>${pct(started,100)}% toward your stretch goal</div></div><div style="margin-top:14px">${bar(started,100)}</div><p class="tiny muted" style="margin:14px 0 0">Quality and appropriate care matter more than indiscriminate orders. Reattempt weak cases.</p></div></div><div class="card"><div class="card-head"><h3>Practice priorities</h3></div><div class="card-body"><div class="today-task"><span class="circular-number">1</span><div class="task-text">Stabilize and address immediate threats.</div></div><div class="today-task"><span class="circular-number">2</span><div class="task-text">Order indicated diagnostics and treatment promptly.</div></div><div class="today-task"><span class="circular-number">3</span><div class="task-text">Reassess; plan disposition and follow-up.</div></div></div></div></div>
 <div class="card"><div class="card-head"><h3>Individual case log</h3><div class="micro">${started} ATTEMPTED</div></div><div class="card-body"><div class="toolbar"><input id="case-search" class="field field-grow" value="${safe(caseFilter)}" placeholder="⌕  Search case number or your notes…"><span class="tiny muted">${filtered.length} slots</span></div><div class="table-scroll"><table class="case-table"><thead><tr><th>Case</th><th>Done</th><th>Repeat</th><th>Score %</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></div>${filtered.length>caseShown?`<button class="btn btn-secondary" style="margin-top:17px" data-action="more-cases">Show 20 more cases</button>`:''}<p class="table-note">Case number is a personal slot, not a predefined clinical vignette. Save your simulator’s case name or key learning in Notes.</p></div></div></div>`}
const assessments=[{id:'nbme6',name:'NBME / CCMSA Form 6',label:'Use if currently available in MyNBME'},{id:'nbme7',name:'NBME / CCMSA Form 7',label:'Use if currently available in MyNBME'},{id:'nbme8',name:'NBME / CCMSA Form 8',label:'Use if currently available in MyNBME'},{id:'official',name:'Official sample questions',label:'2026-compatible USMLE interactive test experience'},{id:'ccsofficial',name:'Official CCS sample cases',label:'Complete all available official practice cases'}];
function assessmentView(){return `<div class="content">${heroTitle('04 / REALITY CHECK','Measure <em>readiness.</em>','Log each practice assessment and identify weaknesses. A checklist measures work completed; official assessment feedback helps inform readiness.')}
 <div class="card"><div class="card-head"><h3>Your assessment journal</h3><span class="micro">RESULTS STAY ON THIS DEVICE</span></div><div class="card-body"><div class="table-scroll"><table class="score-table"><thead><tr><th>Assessment</th><th>Completed</th><th>Date</th><th>Reported score / %</th></tr></thead><tbody>${assessments.map(a=>{const x=state.assessments[a.id]||{};return `<tr><td><strong>${safe(a.name)}</strong><div class="task-details">${safe(a.label)}</div></td><td>${check('assess-done',a.id,!!x.done)}</td><td><input class="field" type="date" aria-label="Date for ${safe(a.name)}" data-assess-date="${a.id}" value="${safe(x.date||'')}"></td><td><input class="field" aria-label="Score for ${safe(a.name)}" data-assess-score="${a.id}" value="${safe(x.score||'')}" placeholder="Enter result"></td></tr>`}).join('')}</tbody></table></div><div class="divider"></div><div class="input-group"><label for="assessment-notes">Weak areas & action plan</label><textarea id="assessment-notes" class="notes-field" placeholder="Example: revisit consent, PE algorithms, and study-design interpretation…">${safe(state.assessmentNotes||'')}</textarea></div><div style="margin-top:12px"><button class="btn btn-small" data-action="save-assessment-notes">Save notes</button></div></div></div>
 <div class="notice"><strong>Exam readiness:</strong> No single UWorld percentage or CCS provider score guarantees passing Step 3. Consider official assessment feedback, repeated weaknesses, test endurance, and ability to manage clinical simulations safely.</div></div>`}
function resources(){return `<div class="content">${heroTitle('05 / TOOLS & REFERENCES','Your study <em>library.</em>','A curated launchpad to the resources in your plan. These are links, not files mirrored by this site.')}
 ${D.resources.map(g=>`<section style="margin-bottom:26px"><div class="section-heading"><div><div class="micro">REFERENCE LIBRARY</div><h2>${safe(g.group)}</h2></div></div><div class="resource-grid">${g.items.map(x=>`<a class="card resource-card" href="${safe(x.url)}" target="_blank" rel="noopener noreferrer"><div><div class="resource-name">${safe(x.name)}</div><div class="resource-desc">${safe(x.label)}</div></div><div class="resource-arrow">↗</div></a>`).join('')}</div></section>`).join('')}
 <section><div class="section-heading"><div><div class="micro">YOUR PROGRESS</div><h2>Data & preferences</h2></div></div><div class="card"><div class="card-body"><div class="setting-row"><div><strong>Exam target</strong><p>Adjust the provisional exam date and countdown.</p></div><input type="date" class="field" id="target-date" value="${safe(state.targetDate)}"></div><div class="setting-row"><div><strong>Export a backup</strong><p>Save all milestones, scores, notes and cases as a JSON file.</p></div><button class="btn btn-secondary btn-small" data-action="export">Export JSON ↓</button></div><div class="setting-row"><div><strong>Restore from backup</strong><p>Import a previously exported JSON backup on another device.</p></div><button class="btn btn-secondary btn-small" data-action="import">Import JSON ↑</button></div><div class="setting-row"><div><strong>Reset your progress</strong><p>Remove locally stored data after confirmation.</p></div><button class="btn btn-ghost btn-small" data-action="reset">Reset</button></div></div></div></section>
 <p class="disclaimer">Last curated: ${D.lastReviewed}. Self-assessment availability and exam policies can change; verify directly with USMLE, NBME, ECFMG and FSMB.</p></div>`}
function dataPanel(){return `<div class="card"><div class="card-head"><h3>UWorld question tracker</h3><span class="micro">YOUR QUESTION BANK</span></div><div class="card-body"><div class="form-grid"><div class="input-group"><label>Completed</label><input id="uw-done" class="field" type="number" min="0" value="${safe(state.uworld.done)}"></div><div class="input-group"><label>Total target</label><input id="uw-total" class="field" type="number" min="1" value="${safe(state.uworld.total)}"></div><div class="input-group"><label>Correct answers</label><input id="uw-correct" class="field" type="number" min="0" value="${safe(state.uworld.correct)}"></div></div><div class="divider"></div><div class="case-counter"><div class="big-number">${pct(state.uworld.done,state.uworld.total)}<span style="font:14px var(--sans);color:var(--muted)">%</span></div><div class="progress-legend">Question bank completion<br>${state.uworld.done?pct(state.uworld.correct,state.uworld.done)+'% correct (overall)':'Accuracy appears once logged'}</div></div><div style="margin:12px 0">${bar(state.uworld.done,state.uworld.total)}</div><div class="btn-row"><button class="btn btn-small" data-action="add40">+ 40 questions</button><button class="btn btn-secondary btn-small" data-action="sub40">− 40 questions</button><button class="btn btn-ghost btn-small" data-action="save-uw">Save totals</button></div></div></div>`}
function dashboardWithUWorld(){return dashboard().replace('<section class="split">',`${''}<section class="split">`).replace('</section>\n <section style="margin-top:26px">',`</section>\n <section style="margin-top:26px">${dataPanel()}</section><section style="margin-top:26px">`)}
const views={dashboard:dashboardWithUWorld,checklist,weeks,ccs,assessments:assessmentView,resources};
const labels={dashboard:'OVERVIEW',checklist:'MASTER CHECKLIST',weeks:'WEEKLY ROADMAP',ccs:'CCS CASE LOG',assessments:'ASSESSMENTS',resources:'RESOURCES'};
function render(resetScroll=true){
 $('app-content').innerHTML=views[view]();$('breadcrumb').textContent=labels[view];$('target-label').textContent=labelDay(state.targetDate).toUpperCase();$('today').textContent=TODAY.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
 document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('is-active',x.dataset.nav===view));
 if(resetScroll)window.scrollTo({top:0,behavior:'instant'});
}
function goto(v){if(!(v in views))return;view=v;caseShown=20;render()}
function setCase(i,k,v){const c=state.cases[i]||{};c[k]=v;state.cases[i]=c;persist()}
function setAssess(i,k,v){const a=state.assessments[i]||{};a[k]=v;state.assessments[i]=a;persist()}
function saveU(){state.uworld.done=clamp($('uw-done').value,0,99999);state.uworld.total=clamp($('uw-total').value,1,99999);state.uworld.correct=clamp($('uw-correct').value,0,state.uworld.done);persist();toast('Question totals saved');render(false)}
function downloadBackup(){const data={version:1,exportedAt:new Date().toISOString(),data:state};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='step3-field-guide-backup.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('Progress backup exported')}
async function importBackup(file){try{const obj=JSON.parse(await file.text());const incoming=obj?.data||obj;if(!incoming || typeof incoming!=='object'|| !incoming.done || !incoming.uworld)throw Error('Not a compatible backup');if(!confirm('Import this backup and replace your current progress?'))return;state={...baseState(),...incoming,uworld:{...baseState().uworld,...incoming.uworld}};persist();render();toast('Backup restored')}catch(e){toast('Could not import: '+e.message)}}
function handleAction(a){
 if(a==='hide-done'){hideDone=!hideDone;render(false)}
 else if(a==='more-cases'){caseShown+=20;render(false)}
 else if(a==='add40'||a==='sub40'){state.uworld.done=clamp(state.uworld.done+(a==='add40'?40:-40),0,99999);if(state.uworld.correct>state.uworld.done)state.uworld.correct=state.uworld.done;persist();render(false)}
 else if(a==='save-uw')saveU();
 else if(a==='save-assessment-notes'){state.assessmentNotes=$('assessment-notes').value;persist();toast('Study notes saved')}
 else if(a==='export')downloadBackup();else if(a==='import')$('import-file').click();
 else if(a==='reset'&&confirm('Reset all checklists, CCS cases, question counts, and scores on this device?')){state=baseState();persist();render();toast('Local progress reset')}
}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-nav]');if(nav){goto(nav.dataset.nav);return}
 const jump=e.target.closest('[data-goto]');if(jump){goto(jump.dataset.goto);return}
 const x=e.target.closest('[data-expand]');if(x){const id=x.dataset.expand;expanded.has(id)?expanded.delete(id):expanded.add(id);render(false);return}
 const action=e.target.closest('[data-action]');if(action)handleAction(action.dataset.action);
});
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.dataset.task!==undefined){state.done[el.dataset.task]=el.checked;persist();render(false)}
 else if(el.dataset.daily!==undefined){state.daily[today]??={};state.daily[today][el.dataset.daily]=el.checked;persist();render(false)}
 else if(el.dataset.caseFirst!==undefined){setCase(el.dataset.caseFirst,'first',el.checked);render(false)}
 else if(el.dataset.caseRepeat!==undefined){setCase(el.dataset.caseRepeat,'repeat',el.checked);render(false)}
 else if(el.dataset.caseScore!==undefined){setCase(el.dataset.caseScore,'score',el.value===''?'':clamp(el.value,0,100));toast('Case score saved')}
 else if(el.dataset.caseNote!==undefined){setCase(el.dataset.caseNote,'note',el.value);toast('Case notes saved')}
 else if(el.dataset.assessDone!==undefined){setAssess(el.dataset.assessDone,'done',el.checked);render(false)}
 else if(el.dataset.assessDate!==undefined){setAssess(el.dataset.assessDate,'date',el.value);toast('Assessment date saved')}
 else if(el.dataset.assessScore!==undefined){setAssess(el.dataset.assessScore,'score',el.value);toast('Assessment score saved')}
 else if(el.id==='task-tag'){tagFilter=el.value;render(false)}
 else if(el.id==='target-date'){if(el.value){state.targetDate=el.value;persist();render(false);toast('Target date updated')}}
 else if(el.id==='uw-done'||el.id==='uw-total'||el.id==='uw-correct')saveU();
});
document.addEventListener('input',e=>{
 if(e.target.id==='task-search'||e.target.id==='case-search'){
  const id=e.target.id,sel=e.target.selectionStart;id==='task-search'?filter=e.target.value:caseFilter=e.target.value;
  if(id==='case-search')caseShown=20;
  render(false);
  const field=$(id);if(field){field.focus();field.setSelectionRange(sel,sel)}
 }
});
$('import-file').addEventListener('change',async e=>{const f=e.target.files?.[0];if(f)await importBackup(f);e.target.value=''})
render();
})();