'use strict';
// ===== qol98.js — Loot Pods (cosmetics: trails, victory poses, frames), Collection, tutorial, control settings, extended stats =====
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// ---------- cosmetics catalog (looks only, no power) ----------
const RAR={c:{n:'Common',w:70,col:'#404040'},r:{n:'Rare',w:25,col:'#0000c0'},e:{n:'Epic',w:5,col:'#800080'}};
const CAT={t:'Trail',v:'Victory Pose',f:'Frame'};
const COS={
 t_dots:{t:'t',r:'c',n:'Dots',c:'#ffffff'},t_smoke:{t:'t',r:'c',n:'Haze',c:'#9e9e9e'},t_pix:{t:'t',r:'c',n:'Pixels',c:'#00a0a0'},
 t_spark:{t:'t',r:'r',n:'Sparks',c:'#ffd23f'},t_snow:{t:'t',r:'r',n:'Snowflakes',c:'#bfe9ff'},t_neon:{t:'t',r:'r',n:'Neon',c:'#ff40ff'},
 t_rainbow:{t:'t',r:'e',n:'Rainbow',c:'#ff0000'},t_matrix:{t:'t',r:'e',n:'Matrix 98',c:'#00ff40'},
 v_confetti:{t:'v',r:'c',n:'Confetti',c:'#ff5252'},v_stars:{t:'v',r:'c',n:'Starfall',c:'#ffeb3b'},
 v_fw:{t:'v',r:'r',n:'Fireworks',c:'#40c4ff'},v_pixrain:{t:'v',r:'r',n:'Pixel Rain',c:'#00c853'},
 v_flag:{t:'v',r:'e',n:'Flag 98',c:'#000080'},v_gold:{t:'v',r:'e',n:'Gold Rain',c:'#ffc400'},
 f_thin:{t:'f',r:'c',n:'Simple',c:'#ffffff'},f_dash:{t:'f',r:'c',n:'Dashed',c:'#c0c0c0'},
 f_dbl:{t:'f',r:'r',n:'Double',c:'#40c4ff'},f_teal:{t:'f',r:'r',n:'Teal 98',c:'#008080'},
 f_gold:{t:'f',r:'e',n:'Golden',c:'#ffd23f'},f_rainbow:{t:'f',r:'e',n:'Rainbow',c:'#ff00ff'}};
const PRICE=250,DUP=60;
// ---------- save (in the shared save → cloud/epoch reset works) ----------
function C(){const s=save;let c=s.cos;if(!c||typeof c!=='object')c=s.cos={caps:1,own:{},sel:{t:'',v:'',f:''},fav:{},ws:0,wsb:0,qd:''};
 c.caps=Math.max(0,c.caps|0);c.own=c.own&&typeof c.own==='object'?c.own:{};for(const k in c.own)if(!COS[k])delete c.own[k];
 c.sel=Object.assign({t:'',v:'',f:''},c.sel||{});for(const k in c.sel)if(c.sel[k]&&!c.own[c.sel[k]])c.sel[k]='';
 c.fav=c.fav&&typeof c.fav==='object'?c.fav:{};c.ws=c.ws|0;c.wsb=c.wsb|0;c.qd=c.qd||'';s.stats.capN=s.stats.capN|0;return c;}
// ---------- pods ----------
function roll(){let x=Math.random()*100,r='c';if(x<RAR.e.w)r='e';else if(x<RAR.e.w+RAR.r.w)r='r';const pool=Object.keys(COS).filter(k=>COS[k].r===r);return pool[Math.random()*pool.length|0];}
function give(n,why){const c=C();c.caps+=n;persist();try{toast('🎁 +'+n+' Loot Pod',why);}catch(e){}}
function buy(){if(save.coins<PRICE)return;save.coins-=PRICE;C().caps++;persist();try{updTray();}catch(e){}UI_.caps();}
function open(){const c=C();if(c.caps<1)return;c.caps--;const k=roll(),d=COS[k],dup=!!c.own[k];
 if(dup)save.coins+=DUP;else c.own[k]=1;save.stats.capN++;persist();try{checkAch();updTray();}catch(e){}
 const w=openWin('capopen','Pod unboxing',`<div class="dlg" style="flex-direction:column;align-items:stretch"><div id="capbar" class="q98p"><i></i></div><div id="capres" style="text-align:center;min-height:120px"><br>Unboxing a Loot Pod…</div></div>`,{w:320,icon:'🎁',modal:1});
 const bar=w.querySelector('#capbar i');let p=0;const iv=setInterval(()=>{p+=12;bar.style.width=Math.min(100,p)+'%';if(p>=100){clearInterval(iv);try{Sfx.win&&Sfx.win();}catch(e){}
  const r=w.querySelector('#capres');if(!r)return;r.innerHTML=`<div class="q98prev">${prev(k,64)}</div><b style="color:${RAR[d.r].col}">${RAR[d.r].n}</b> · ${CAT[d.t]}<br><b style="font-size:14px">«${esc(d.n)}»</b><br>${dup?`<span class="stat">Already owned — refund 🪙${DUP}</span>`:'<span style="color:#008000">New in your collection!</span>'}
  <div class="btns" style="margin-top:8px">${dup?'':`<button id="capeq">Equip</button>`}<button id="capok">OK</button></div>`;
  const ok=w.querySelector('#capok');ok.onclick=()=>{closeWin('capopen');UI_.caps();};const eq=w.querySelector('#capeq');if(eq)eq.onclick=()=>{C().sel[d.t]=k;persist();closeWin('capopen');UI_.caps();};}},90);}
// small cosmetics preview (svg, pixel style)
function prev(k,s){const d=COS[k];s=s||32;let g='';
 if(d.t==='t'){for(let i=0;i<5;i++){const x=4+i*4,a=.3+i*.15;g+=d.r==='e'&&k==='t_rainbow'?`<rect x="${x}" y="13" width="4" height="6" fill="hsl(${i*70},90%,55%)"/>`:`<rect x="${x}" y="${14-(i%2)}" width="3" height="${3+i%2}" fill="${d.c}" opacity="${a}"/>`;}g+=`<circle cx="26" cy="16" r="5" fill="#c0c0c0" stroke="#000"/>`;}
 else if(d.t==='v'){for(let i=0;i<9;i++){const x=(i*37)%28+2,y=(i*53)%26+3;g+=`<rect x="${x}" y="${y}" width="3" height="3" fill="${k==='v_confetti'?'hsl('+i*40+',90%,55%)':d.c}"/>`;}if(k==='v_flag')g+=`<rect x="6" y="6" width="2" height="22" fill="#000"/><rect x="8" y="6" width="9" height="6" fill="#ff0000"/><rect x="17" y="6" width="9" height="6" fill="#00a000"/><rect x="8" y="12" width="9" height="6" fill="#0000ff"/><rect x="17" y="12" width="9" height="6" fill="#ffd000"/>`;}
 else{g+=`<ellipse cx="16" cy="18" rx="13" ry="7" fill="none" stroke="${k==='f_rainbow'?'url(#rb)':d.c}" stroke-width="2" ${k==='f_dash'?'stroke-dasharray="3 2"':''}/>`+(k==='f_dbl'?`<ellipse cx="16" cy="18" rx="10" ry="5" fill="none" stroke="${d.c}"/>`:'')+`<circle cx="16" cy="14" r="6" fill="#c0c0c0" stroke="#000"/>`;}
 return `<svg class="px" width="${s}" height="${s}" viewBox="0 0 32 32" style="background:#000;border:1px solid;border-color:#808080 #fff #fff #808080"><defs><linearGradient id="rb"><stop offset="0" stop-color="#f00"/><stop offset=".5" stop-color="#0f0"/><stop offset="1" stop-color="#00f"/></linearGradient></defs>${g}</svg>`;}
// ---------- arena drawing (on the floor, BEFORE balls → ability logo always visible) ----------
let hist=[],hG=null,lastP=null;
function floor(st,me){try{const c=save.cos;if(!c)return;const b=st.balls&&st.balls[me];if(!b)return;if(hG!==st){hG=st;hist=[];}
 const tk=c.sel.t,fk=c.sel.f;const t=performance.now()/1000;
 if(tk&&!b.dead){const L=hist[hist.length-1];if(!L||Math.hypot(L.x-b.x,L.y-b.y)>6)hist.push({x:b.x,y:b.y,t});}
 while(hist.length&&(t-hist[0].t>.55||hist.length>28))hist.shift();
 if(tk&&hist.length>1){const n=hist.length;ctx.save();
  for(let i=0;i<n-1;i++){const h=hist[i],q=P(h.x,h.y),a=(i+1)/n,R=b.r*q.k*(.25+.45*a);ctx.globalAlpha=a*.55;
   if(tk==='t_rainbow')ctx.fillStyle=`hsl(${(i*25+t*200)%360},90%,55%)`;else if(tk==='t_neon')ctx.fillStyle=i%2?'#ff40ff':'#40ffff';else ctx.fillStyle=COS[tk].c;
   if(tk==='t_pix'||tk==='t_matrix'){const z=Math.max(3,R*.6);ctx.fillRect(q.x-z/2,q.y-z/2-2,z,z);if(tk==='t_matrix'&&i%3===0){ctx.font='bold 10px monospace';ctx.fillText(i%2?'1':'0',q.x+z,q.y-4);}}
   else if(tk==='t_spark'){ctx.fillRect(q.x-1+Math.sin(i*7)*R*.6,q.y-1+Math.cos(i*5)*R*.3,3,3);}
   else if(tk==='t_snow'){ctx.font=`${Math.round(6+R*.5)}px Tahoma`;ctx.textAlign='center';ctx.fillText('*',q.x,q.y+3);}
   else{ctx.beginPath();ctx.ellipse(q.x,q.y,R*(tk==='t_smoke'?1.2:.6),R*.45*(tk==='t_smoke'?1.2:.6),0,0,7);ctx.fill();}}
  ctx.restore();}
 if(fk&&!b.dead){const q=P(b.x,b.y),R=b.r*q.k*1.25;ctx.save();ctx.lineWidth=2;ctx.globalAlpha=.85;
  ctx.strokeStyle=fk==='f_rainbow'?`hsl(${t*120%360},90%,60%)`:COS[fk].c;if(fk==='f_dash'){ctx.setLineDash([6,5]);ctx.lineDashOffset=-t*20;}
  ctx.beginPath();ctx.ellipse(q.x,q.y,R,R*.45,0,0,7);ctx.stroke();if(fk==='f_dbl'||fk==='f_gold'){ctx.beginPath();ctx.ellipse(q.x,q.y,R*1.15,R*.52,0,0,7);ctx.stroke();}ctx.restore();}}catch(e){}}
// ---------- victory pose (above the arena but under windows, clicks pass through) ----------
function victory(k){k=k||(save.cos&&save.cos.sel.v);if(!k||!COS[k])return;const gw=$('gamewin');if(!gw)return;const o=document.createElement('div');o.className='q98v';
 let h='';const N=window.MOB&&MOB.phone?18:30;for(let i=0;i<N;i++){const x=Math.random()*100,dl=Math.random()*.6,du=1+Math.random()*.8;
  const col=k==='v_confetti'?`hsl(${Math.random()*360|0},90%,55%)`:COS[k].c;
  if(k==='v_stars')h+=`<b style="left:${x}%;color:${col};animation-delay:${dl}s;animation-duration:${du}s">★</b>`;
  else if(k==='v_fw'){const a=Math.random()*6.28,r=60+Math.random()*90;h+=`<i class="fw" style="left:50%;top:40%;background:hsl(${Math.random()*360|0},90%,60%);--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px;animation-delay:${dl*.3}s"></i>`;}
  else h+=`<i style="left:${x}%;background:${col};animation-delay:${dl}s;animation-duration:${du}s;${k==='v_pixrain'?'width:6px;height:6px':''}"></i>`;}
 if(k==='v_flag')h+=`<div class="flag">${PX.emo('🏁',48)}<span>VICTORY!</span></div>`;
 o.innerHTML=h;gw.appendChild(o);setTimeout(()=>o.remove(),2300);}
// ---------- newbie tutorial (first campaign levels) ----------
const TUT=[['Move','Desktop: <b>WASD</b> or arrows.<br>Mobile: <b>joystick</b> at the bottom.'],['Ability','Desktop: <b>Space</b>. Mobile: the <b>⚡ Hit</b>.<br>The icon on your ball is its ability.'],['Goal','Ram your rival, knock off HP. Win rounds — win the match!'],['Pickups','Grab icons in the arena: shield, fire, heal and more.']];
let tutT=null;
function tutor(i){i=i||0;const gw=$('gamewin');if(!gw)return;let b=$('q98tut');if(i>=TUT.length){if(b)b.remove();localStorage.setItem('bf_tut','1');return;}
 if(!b){b=document.createElement('div');b.id='q98tut';gw.appendChild(b);}
 b.innerHTML=`<div class="tt98">${PX.emo('ℹ️',14)} Tutorial ${i+1}/${TUT.length}: ${TUT[i][0]}</div><div class="tb98">${TUT[i][1]}</div><div class="bb98"><button data-n>${i<TUT.length-1?'Next ▶':'Done'}</button><button data-s>Skip</button></div>`;
 clearTimeout(tutT);tutT=setTimeout(()=>tutor(i+1),6500);
 b.querySelector('[data-n]').onclick=e=>{e.stopPropagation();tutor(i+1);};b.querySelector('[data-s]').onclick=e=>{e.stopPropagation();clearTimeout(tutT);tutor(99);};}
// ---------- control settings (stored on the device) ----------
const CTLD={sz:140,sens:100,dz:25,pos:0,left:false,op:100};
const ctl=()=>{try{return Object.assign({},CTLD,JSON.parse(localStorage.getItem('bf_ctl')||'{}'));}catch(e){return Object.assign({},CTLD);}};
window.CTL=ctl;
// ---------- windows ----------
const own=t=>Object.keys(COS).filter(k=>COS[k].t===t&&save.cos.own[k]).length,tot=t=>Object.keys(COS).filter(k=>COS[k].t===t).length;
let capTab='t';
const UI_={
 caps(){const c=C();const can=save.coins>=PRICE;
  const items=Object.keys(COS).filter(k=>COS[k].t===capTab).map(k=>{const d=COS[k],o=c.own[k],on=c.sel[d.t]===k;
   return `<button class="q98it${on?' on':''}" data-k="${k}" ${o?'':'disabled'} title="${esc(d.n)}">${o?prev(k,32):'<span class="q98lock">?</span>'}<span><b>${o?esc(d.n):'???'}</b><small style="color:${RAR[d.r].col}">${RAR[d.r].n}</small>${on?'<small>✔ equipped</small>':''}</span></button>`;}).join('');
  openWin('caps','Loot Pods',`<div class="q98top">${PX.emo('🎁',32)}<div><b>Pods: ${c.caps}</b><br><span class="stat">Inside: random cosmetics — a ball trail, a victory pose or a frame. Looks only, no effect on power.</span></div></div>
  <div class="btns" style="justify-content:flex-start;flex-wrap:wrap"><button id="capo" ${c.caps?'':'disabled'}>🎁 Open pod</button><button id="capb" ${can?'':'disabled'}>Buy for 🪙${PRICE}</button></div>
  <div class="stat" style="margin:4px 0">Odds: common 70% · rare 25% · epic 5%. Dupes — 🪙${DUP}. Free: 1 pod for all 3 daily Battle Pass quests and every 7th day of your login streak.</div>
  <div class="tabs98">${Object.keys(CAT).map(t=>`<div class="tab${t===capTab?' on':''}" data-ct="${t}">${CAT[t]} (${own(t)}/${tot(t)})</div>`).join('')}</div>
  <div class="tabpane"><div class="q98grid"><button class="q98it${c.sel[capTab]?'':' on'}" data-k="">${'<span class="q98lock">—</span>'}<span><b>No effect</b>${c.sel[capTab]?'':'<small>✔ selected</small>'}</span></button>${items}</div>
  ${capTab==='v'&&c.sel.v?'<div class="btns"><button id="capvp">▶ Preview</button></div>':''}</div>
  <div class="stat" style="margin-top:4px">Online, only you see your effects.</div>`,{w:520,icon:'🎁'});
  const w=$('w_caps');w.querySelector('#capo').onclick=open;w.querySelector('#capb').onclick=buy;
  w.querySelectorAll('[data-ct]').forEach(e=>e.onclick=()=>{capTab=e.dataset.ct;UI_.caps();});
  w.querySelectorAll('[data-k]').forEach(e=>e.onclick=()=>{const k=e.dataset.k;if(k&&!C().own[k])return;C().sel[capTab]=k;persist();UI_.caps();});
  const vp=w.querySelector('#capvp');if(vp)vp.onclick=()=>{const gw=$('gamewin');if(gw&&!gw.classList.contains('hide'))victory();else toast('Victory Pose','Plays in the arena after you win.');};},
 album(){const s=save,c=C();const ach=Object.keys(s.ach||{}).filter(k=>s.ach[k]).length;let ttl=0,ttlN=0;try{const T=PROG.TITLES;ttlN=Object.keys(T).length;ttl=Object.keys(T).filter(k=>T[k].a&&s.ach[T[k].a]).length;}catch(e){}
  let pat=0,patN=4;try{patN=Object.keys(PROG.PSK).length;pat=Object.keys(PROG.PSK).filter(k=>s.pskins&&s.pskins[k]).length;}catch(e){}
  const mutN=Object.keys(MUT).length,mut=Object.keys((s.stats.mutK)||{}).filter(k=>MUT[k]).length;
  const rows=[['🎒','Balls',ownedIds().length,BALLS.length,'UI.inv()'],['🎖️','Achievements',ach,ACH.length,'UI.ach()'],['🏅','Titles',ttl,ttlN,"UI.ach()"],['🎨','Patterns (Battle Pass)',pat,patN,"Desk.run('Battle Pass')"],['🧬','Mutations',mut,mutN,"Desk.run('Forge')"],
   ['🎁','Trails',own('t'),tot('t'),"QOL.capsTab('t')"],['🎁','Victory Poses',own('v'),tot('v'),"QOL.capsTab('v')"],['🎁','Frames',own('f'),tot('f'),"QOL.capsTab('f')"]];
  const A=rows.reduce((a,r)=>a+Math.min(r[2],r[3]),0),B=rows.reduce((a,r)=>a+r[3],0),pc=Math.round(A/Math.max(1,B)*100);
  openWin('album','Collection',`<div class="q98top">${PX.emo('🗂️',32)}<div><b>Total collected: ${A} of ${B} (${pc}%)</b><div class="q98p" style="margin-top:3px"><i style="width:${pc}%"></i></div></div></div>
  <table class="t">${rows.map(r=>{const p=Math.round(Math.min(r[2],r[3])/Math.max(1,r[3])*100);return `<tr><td>${PX.emo(r[0],16)}</td><td><b>${r[1]}</b><div class="q98p sm"><i style="width:${p}%"></i></div></td><td style="white-space:nowrap">${Math.min(r[2],r[3])} / ${r[3]}</td><td><button onclick="${r[4]}">Open</button></td></tr>`;}).join('')}</table>`,{w:460,icon:'🗂️'});},
 ctl(){const c=ctl();const r=(id,l,min,max,v,u)=>`<tr><td>${l}</td><td><input type="range" id="${id}" min="${min}" max="${max}" value="${v}" style="width:140px"> <span id="${id}v">${v}${u}</span></td></tr>`;
  openWin('ctl','Controls',`<fieldset><legend>Touch joystick (mobile)</legend><table class="t">
  <tr><td>Size</td><td>${[['110','Small'],['140','Medium'],['180','Large']].map(o=>`<label style="margin-right:8px"><input type="radio" name="csz" value="${o[0]}" ${+o[0]===c.sz?'checked':''}> ${o[1]}</label>`).join('')}</td></tr>
  ${r('csens','Sensitivity',50,150,c.sens,'%')}${r('cdz','Dead zone',5,45,c.dz,'%')}${r('cop','Opacity',30,100,c.op,'%')}
  <tr><td>Position</td><td><label style="margin-right:8px"><input type="radio" name="cpos" value="0" ${c.pos?'':'checked'}> Bottom</label><label><input type="radio" name="cpos" value="1" ${c.pos?'checked':''}> Higher</label></td></tr>
  <tr><td>Lefty mode</td><td><label><input type="checkbox" id="cleft" ${c.left?'checked':''}> Joystick on the right, “Hit” button on the left</label></td></tr></table></fieldset>
  <fieldset><legend>Keyboard (desktop)</legend><div class="stat">Move — WASD / arrows, ability — Space, pause — Esc.</div></fieldset>
  <fieldset><legend>Tutorial</legend><label><input type="checkbox" id="ctut" ${localStorage.getItem('bf_tut')==='1'?'':'checked'}> Show the tutorial in the next campaign fight</label></fieldset>
  <div class="btns"><button id="cdef">Reset to default</button><button id="cok">OK</button></div>`,{w:440,icon:'⚙️'});
  const w=$('w_ctl'),sv=()=>{const o={sz:+(w.querySelector('[name=csz]:checked')||{value:140}).value,sens:+w.querySelector('#csens').value,dz:+w.querySelector('#cdz').value,op:+w.querySelector('#cop').value,pos:+(w.querySelector('[name=cpos]:checked')||{value:0}).value,left:w.querySelector('#cleft').checked};
   localStorage.setItem('bf_ctl',JSON.stringify(o));if(w.querySelector('#ctut').checked)localStorage.removeItem('bf_tut');else localStorage.setItem('bf_tut','1');['csens','cdz','cop'].forEach(i=>w.querySelector('#'+i+'v').textContent=w.querySelector('#'+i).value+'%');if(window.MOB&&MOB.rebuild)MOB.rebuild();};
  w.querySelectorAll('input').forEach(e=>e.oninput=e.onchange=sv);
  w.querySelector('#cdef').onclick=()=>{localStorage.removeItem('bf_ctl');if(window.MOB&&MOB.rebuild)MOB.rebuild();UI_.ctl();};w.querySelector('#cok').onclick=()=>closeWin('ctl');}};
// ---------- integration ----------
window.QOL={COS,RAR,PRICE,C,give,open,buy,floor,victory,tutor,ctl,UI:UI_,capsTab(t){capTab=t;UI_.caps();},caps:()=>save.cos?save.cos.caps|0:0,
 allDaily(){const c=C(),d=today();if(c.qd===d)return;c.qd=d;give(1,'All daily quests done!');}};
window.EXTRA=(window.EXTRA||[]);EXTRA.push({k:'Loot Pods',ico:'🎁',run:'QOL.UI.caps()',nodesk:1},{k:'Collection',ico:'🗂️',run:'QOL.UI.album()',nodesk:1},{k:'Controls',ico:'⚙️',run:'QOL.UI.ctl()',nodesk:1});
try{ACH.push({id:'cap10',n:'Unboxer 98',d:'Open 10 Loot Pods',g:5,f:s=>(s.stats.capN|0)>=10});}catch(e){}
// match: win streak, favorite ball
const orm=window.recordMatch;window.recordMatch=function(won){try{const c=C();if(G&&G.kind!=='local'){const b=G.balls&&G.balls[G.me];if(b&&BY[b.id])c.fav[b.id]=(c.fav[b.id]|0)+1;if(won){c.ws++;c.wsb=Math.max(c.wsb,c.ws);}else c.ws=0;}}catch(e){}return orm.apply(this,arguments);};
const omo=window.onMatchOver;window.onMatchOver=function(){const r=omo.apply(this,arguments);try{if(G&&G.winner===G.me&&G.kind!=='local')victory();}catch(e){}return r;};
const obl=window.beginLevel;if(obl)window.beginLevel=function(l){const r=obl.apply(this,arguments);try{const tp=$('q98tut');if(tp)tp.remove();if(l<=2&&localStorage.getItem('bf_tut')!=='1'&&(save.stats.matches|0)<5)setTimeout(()=>tutor(0),700);}catch(e){}return r;};
const ocd=window.claimDaily;if(ocd)window.claimDaily=function(){const was=save.daily.last;const r=ocd.apply(this,arguments);try{if(was!==save.daily.last&&save.daily.streak%7===0)give(1,'7-day streak reward!');}catch(e){}return r;};
addEventListener('load',()=>{try{C();}catch(e){}
 const os=UI.stats;UI.stats=function(){const r=os.apply(this,arguments);try{const c=C(),s=save.stats,tb=$('w_stats').querySelector('table.t');const f=Object.keys(c.fav).sort((a,b)=>c.fav[b]-c.fav[a])[0];
  const pv=s.matches-s.local;const add=[['Favorite ball',f&&BY[f]?esc(BY[f].name)+' ('+c.fav[f]+' matches)':'—'],['Current win streak',c.ws],['Best win streak',c.wsb],['Login streak (days)',save.daily.streak],['Loot Pods opened',s.capN|0],['Online wins',s.online?Math.round(s.onlineWins/s.online*100)+'%':'—']];
  tb.insertAdjacentHTML('beforeend',add.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td></tr>`).join(''));}catch(e){}return r;};});
const css=document.createElement('style');css.textContent=`
.q98p{height:12px;border:1px solid;border-color:#808080 #fff #fff #808080;background:#fff;padding:1px}.q98p i{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,#000080 0 8px,transparent 8px 10px);transition:width .08s}.q98p.sm{height:8px;margin-top:2px}
.q98top{display:flex;gap:8px;align-items:center;margin-bottom:6px}.q98top>div{flex:1}
.q98grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}
.q98it{display:flex!important;align-items:center;gap:6px;text-align:left!important;height:auto!important;max-width:none!important;padding:4px!important;white-space:normal!important;font-size:12px!important}
.q98it small{display:block;font-size:10px}.q98it.on{outline:1px dotted #000;outline-offset:-4px;background:#d4d0c8}.q98lock{display:inline-flex;width:32px;height:32px;align-items:center;justify-content:center;background:#808080;color:#fff;font-weight:bold;border:1px solid;border-color:#404040 #fff #fff #404040}
.q98prev{margin:6px auto}
.q98v{position:absolute;inset:22px 0 0 0;pointer-events:none;overflow:hidden;z-index:5}
.q98v i,.q98v b{position:absolute;top:-10px;width:7px;height:10px;animation:q98fall 1.4s linear forwards;font-size:18px}
.q98v i.fw{width:5px;height:5px;animation:q98fw 1s ease-out forwards}
.q98v .flag{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px;background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;padding:4px 10px;font:bold 22px Tahoma,sans-serif;animation:q98pop 2.2s ease forwards}
@keyframes q98fall{to{transform:translateY(520px) rotate(360deg);opacity:0}}@keyframes q98fw{from{transform:none;opacity:1}to{transform:translate(var(--dx),var(--dy));opacity:0}}
@keyframes q98pop{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}15%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
#q98tut{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);width:min(320px,80%);background:#ffffe1;border:1px solid #000;box-shadow:2px 2px 0 rgba(0,0,0,.4);font:12px Tahoma,sans-serif;z-index:6;opacity:.95;animation:q98in .25s}
#q98tut .tt98{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:bold;padding:2px 4px}#q98tut .tb98{padding:5px 6px}#q98tut .bb98{display:flex;gap:4px;justify-content:flex-end;padding:0 5px 5px}#q98tut button{height:24px;min-width:70px;padding:0 6px}
@keyframes q98in{from{opacity:0}}
body.phone #q98tut{top:auto;bottom:10px;width:min(300px,52vw);font-size:12px}body.phone #q98tut button{height:30px}
body.phone .q98it{min-height:44px}
@media (max-width:600px){.q98grid{grid-template-columns:1fr 1fr}}`;document.head.appendChild(css);
})();
