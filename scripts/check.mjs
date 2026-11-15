import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dist/data.js','utf8'),ctx);const d=ctx.window.COURSE;
assert.equal(d.inventory.length,24);assert.equal(new Set(d.cases.map(c=>c.id)).size,d.cases.length);assert.equal(new Set(d.questions.map(q=>q.id)).size,d.questions.length);
for(const c of d.cases){assert.ok(d.topics.some(t=>t.id===c.topic),c.id+' topic');assert.ok(c.steps.length>=2,c.id+' solution');assert.ok(c.answer&&c.stem&&c.evidence,c.id+' complete');}
for(const q of d.questions){assert.ok(d.topics.some(t=>t.id===q.topic),q.id+' topic');assert.ok(q.steps?.length>=1,q.id+' steps');if(q.type!=='written'){assert.ok(q.options.length===4,q.id+' options');assert.ok(q.correct.length>0&&q.correct.every(i=>i>=0&&i<4),q.id+' key');assert.equal(q.type,q.correct.length>1?'multi':'choice',q.id+' multiselect');}if(q.group==='gaokao'){assert.match(q.url,/^https:\/\//);assert.match(q.liaoningEvidence,/eol.cn/);assert.ok(q.provenance.includes('原'),q.id+' provenance');}}
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
// Independent checks from original mathematical constraints, rather than copying an answer key.
const a=6,b=2*Math.sqrt(6),c=2;near((b*b+c*c-a*a)/(2*b*c),-Math.sqrt(6)/6);near((2*b*b+2*c*c-a*a)/4,5);
near(Math.sin(2*Math.acos(1/Math.sqrt(5))-Math.PI/4),7*Math.sqrt(2)/10);
near((1+4*(.5/2)+4*.5),4); // |a+2b|²: t=.5, a·b=t/2
for(let i=1;i<=80;i++){const av=i/10,t1=(-av-Math.sqrt(Math.max(0,av*av-4)))/2,t2=(-av+Math.sqrt(Math.max(0,av*av-4)))/2;if(av>2){assert.ok(t1<t2&&t2<0);near(Math.atan(t1)+Math.atan(t2),-Math.PI/2);}}
for(let k=1;k<=8;k++){let sum=0;for(let n=1;n<=k;n++)sum+=1/(1+n*(n-1)/2+2*n);near(sum,k/(k+2));}
for(let i=1;i<50;i++){const av=i/50,bv=1-av;assert.ok(1/av+4/bv>=9-1e-10);assert.ok(av*av+bv*bv-2*bv/3-1/9>=-1e-10);}
const f=x=>x<-1?Math.log(-x-1):3-(x-1)**2;
function rootsOf(y){const roots=[-1-Math.exp(y)];if(y<=3){const s=Math.sqrt(3-y);for(const x of [1-s,1+s])if(x>=-1&&!roots.some(r=>Math.abs(r-x)<1e-8))roots.push(x);}return roots;}
for(const [y,count]of [[-2,3],[-1,7],[0,8],[2.99,8],[3,5],[4,2]]){const roots=rootsOf(y).flatMap(rootsOf);assert.equal(roots.length,count);for(const x of roots)if(Math.abs(x+1)>1e-10)near(f(f(x)),y,1e-7);}
// Log-branch roots exponentially close to -1 may round to -1 in IEEE doubles;
// count those via the exact inverse branches rather than evaluating a rounded point.
const html=fs.readFileSync('dist/index.html','utf8');for(const p of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(p=>!p.startsWith('http')))assert.ok(fs.existsSync('dist/'+p),'asset '+p);
for(const p of ['dist/data.js','dist/app.js','dist/index.html']){const s=fs.readFileSync(p,'utf8');assert.ok(!/D:\\错题|微信图片_|ghp_|github_pat_/.test(s),'private content '+p);}
console.log(`PASS: ${d.cases.length} reviewed cases, ${d.questions.length} tasks, ${d.gaokaoCount} attributed exam questions; source/asset integrity and independent mathematical checks.`);
