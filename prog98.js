// ===== Progress 98: mastery, battle pass, clans, online tournament, titles, mutations =====
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=864e5,BASE=Date.UTC(2026,9,1),SLEN=30,TIER=500,TIERS=30;
const dayKey=()=>new Date().toISOString().slice(0,10);
const weekKey=()=>{const d=Math.floor((Date.now()-Date.UTC(2026,0,5))/DAY);return 'w'+Math.floor(d/7);};
const seasonNo=()=>Math.floor((Date.now()-BASE)/(SLEN*DAY))+1;
const seasonEnd=()=>BASE+seasonNo()*SLEN*DAY;
const XPW=30,XPL=12,need=L=>50+30*L,COST=[150,300,500];
const PSK={zebra:'Stripes',stars:'Stars',check:'Checkers',flame:'Flames'};
// ---------- save ----------
function ensure(){if(typeof save==='undefined'||!save)return;const s=save;s.bx=s.bx&&typeof s.bx==='object'?s.bx:{};
 for(const k in s.bx){const p=s.bx[k];if(!BY[k]||!p||typeof p!=='object'){delete s.bx[k];continue;}p.xp=Math.max(0,p.xp|0);p.lv=Math.min(MASTER_MAX,Math.max(1,p.lv|0));p.up=p.up&&typeof p.up==='object'?p.up:{};
  for(const u in p.up){if(!UPG[u])delete p.up[u];else p.up[u]=Math.min(UPG_RANK,Math.max(0,p.up[u]|0));}
  if(p.v&&(!VARS[p.v]||p.lv<VAR_LVL))p.v='';p.ms=Array.isArray(p.ms)?p.ms.filter(m=>MUT[m]):[];if(p.m&&!p.ms.includes(p.m))p.m='';}
 const sn=seasonNo();if(!s.bp||typeof s.bp!=='object'||s.bp.s!==sn)s.bp={s:sn,xp:0,cl:{},q:{}};s.bp.cl=s.bp.cl||{};s.bp.q=s.bp.q||{};
 s.pskins=s.pskins&&typeof s.pskins==='object'?s.pskins:{};s.psel=s.psel&&typeof s.psel==='object'?s.psel:{};
 for(const k in s.psel)if(!PSK[s.psel[k]]||!s.pskins[s.psel[k]])delete s.psel[k];
 if(s.title&&!(TITLES[s.title]&&titleOk(s.title)))s.title='';s.title=s.title||'';
 const st=s.stats;['bup','mutN','tourN','otourN','clanQ','dch','bpMax','varSet'].forEach(k=>st[k]=st[k]|0);st.mutK=st.mutK&&typeof st.mutK==='object'?st.mutK:{};
 s.otc=s.otc&&typeof s.otc==='object'?s.otc:{};}
// ---------- titles ----------
const TITLES={boec:{n:'Brawler',a:'w10'},veteran:{n:'Veteran',a:'w50'},gladiator:{n:'Gladiator',a:'w100'},champion:{n:'Champion',a:'t1'},collector:{n:'Collector',a:'o20'},
 legend:{n:'Legend',a:'leg'},bosshunter:{n:'Bossbreaker',a:'boss10'},grandmaster:{n:'Grandmaster',a:'bx10'},mutant:{n:'Mutant',a:'mut1'},star:{n:'Starborn',a:'bp30'},
 clanner:{n:'Clanmate',a:'clan'},survivor:{n:'Unkillable',a:'s15'},netrunner:{n:'Net Veteran',a:'on10'},finalist:{n:'Finalist',a:'tf'},marathon:{n:'Marathoner',a:'m100'},
 smasher:{n:'Crusher',a:'dmg100k'},engineer:{n:'Engineer',a:'bup10'},tester:{n:'Challenger',a:'dch5'}};
function titleOk(t){const T=TITLES[t];return !!(T&&save.ach&&save.ach[T.a]);}
// ---------- achievements (+) ----------
const maxLv=()=>Math.max(1,...Object.values(save.bx||{}).map(p=>p.lv|0));
const bpTier=()=>Math.min(TIERS,Math.floor((save.bp?save.bp.xp:0)/TIER));
[{id:'m100',n:'Marathoner',d:'Play 100 matches',g:10,f:s=>s.stats.matches>=100},{id:'w100',n:'Gladiator',d:'100 wins',g:20,f:s=>s.stats.wins>=100},
 {id:'ab500',n:'Ability Master',d:'Use abilities 500 times',g:10,f:s=>s.stats.abil>=500},{id:'dmg100k',n:'Crusher',d:'Deal 100,000 damage',g:20,f:s=>s.stats.dmg>=100000},
 {id:'bx5',n:'Apprentice',d:'Ball mastery 5',g:5,f:s=>maxLv()>=5},{id:'bx10',n:'Grandmaster',d:'Ball mastery 10',g:20,f:s=>maxLv()>=10},
 {id:'bup10',n:'Engineer',d:'10 upgrades in the Forge',g:5,f:s=>s.stats.bup>=10},{id:'var',n:'Alt Build',d:'Pick an ability variant',g:5,f:s=>s.stats.varSet>=1},
 {id:'mut1',n:'Mutant',d:'Get your first mutation',g:10,f:s=>s.stats.mutN>=1},{id:'mut3',n:'Mutation Rainbow',d:'Collect all 3 mutation types',g:20,f:s=>Object.keys(s.stats.mutK||{}).length>=3},
 {id:'bp10',n:'Season Grinder',d:'Battle Pass tier 10',g:5,f:s=>s.stats.bpMax>=10},{id:'bp30',n:'Season Conqueror',d:'Battle Pass tier 30',g:20,f:s=>s.stats.bpMax>=30},
 {id:'clan',n:'Squad Up',d:'Join a clan',g:5,f:s=>!!s.clanTag},{id:'cq',n:'Clan Power',d:'Finish a weekly clan goal',g:10,f:s=>s.stats.clanQ>=1},
 {id:'tour3',n:'Tourney Fighter',d:'Play 3 tournaments',g:5,f:s=>s.stats.tourN>=3},{id:'tf',n:'Finalist',d:'Reach a tournament final',g:5,f:s=>s.stats.tourBest>=1&&s.stats.tourBest<=2},
 {id:'otour',n:'Net Tourney',d:'Finish an online tournament',g:10,f:s=>s.stats.otourN>=1},{id:'ttl',n:'Drip',d:'Pick a title',g:2,f:s=>!!s.title},
 {id:'dch5',n:'Challenger',d:'Win 5 tournament matches',g:10,f:s=>s.stats.dch>=5},{id:'boss10',n:'Bossbreaker',d:'Defeat 10 bosses',g:10,f:s=>s.stats.bosses>=10},
 {id:'pl25',n:'Master',d:'Reach player Lv.25',g:15,f:s=>s.plvl>=25},{id:'on10',n:'Net Veteran',d:'10 online wins',g:15,f:s=>s.stats.onlineWins>=10},
 {id:'s25',n:'Immortal',d:'Survive 25 waves',g:30,f:s=>s.stats.survBest>=25},{id:'c100',n:'Shopaholic',d:'Open 100 crates',g:20,f:s=>s.stats.crates>=100},
 {id:'pat',n:'Stylist',d:'Equip a Battle Pass pattern',g:3,f:s=>Object.keys(s.psel||{}).length>=1}
].forEach(a=>{if(!ACH.some(x=>x.id===a.id))ACH.push(a);});
UI.ach=function(){ensure();const got=ACH.filter(a=>save.ach[a.id]).length;
 const opts=Object.keys(TITLES).map(t=>`<option value="${t}" ${save.title===t?'selected':''} ${titleOk(t)?'':'disabled'}>${TITLES[t].n}${titleOk(t)?'':' (locked)'}</option>`).join('');
 openWin('ach','Achievements',`<div class="grp"><b>Earned: ${got}/${ACH.length}</b><br>Title (shown on the leaderboard, in chat and matches): <select id="pg_ttl"><option value="">— no title —</option>${opts}</select></div>
 <div style="max-height:420px;overflow:auto"><table class="t">${ACH.map(a=>{const T=Object.values(TITLES).find(x=>x.a===a.id);return `<tr><td>${save.ach[a.id]?'✅':'⬜'}</td><td><b>${a.n}</b><br><span class="stat">${a.d}${T?' · title “'+T.n+'»':''}</span></td><td>💎${a.g}</td></tr>`;}).join('')}</table></div>`,{w:520,icon:'🎖️'});
 const sel=$('pg_ttl');if(sel)sel.onchange=()=>{save.title=titleOk(sel.value)?sel.value:'';persist();checkAch();try{Cloud.push&&Cloud.push();}catch(e){}};};
// ---------- mastery ----------
function addBX(id,xp){const p=bxOf(id);if(p.lv>=MASTER_MAX)return;p.xp+=xp;let up=false;while(p.lv<MASTER_MAX&&p.xp>=need(p.lv)){p.xp-=need(p.lv);p.lv++;up=true;}
 if(p.lv>=MASTER_MAX)p.xp=0;if(up)toast('★ Mastery: '+BY[id].name+' — '+p.lv,p.lv===VAR_LVL?'Ability variant unlocked!':'+1 upgrade point in the Forge');}
const spent=p=>Object.values(p.up||{}).reduce((a,b)=>a+(b|0),0);
const pts=p=>Math.max(0,p.lv-1-spent(p));
function giveMut(id,m){const p=bxOf(id);if(p.ms.includes(m))return false;p.ms.push(m);if(!p.m)p.m=m;save.stats.mutN++;save.stats.mutK[m]=1;toast('🧬 Mutation: '+MUT[m].n,BY[id].name+' — '+MUT[m].d);return true;}
function randMut(){const ids=ownedIds().filter(i=>bxOf(i).ms.length<3);if(!ids.length){save.coins+=300;toast('🧬 Mutagen','All mutations collected: +300 coins');return;}
 const id=ids[Math.random()*ids.length|0],ms=Object.keys(MUT).filter(m=>!bxOf(id).ms.includes(m));giveMut(id,ms[Math.random()*ms.length|0]);}
let curB='',wsTab='up';
const WS_ICO={dmg:'swords',hp:'medal',spd:'bolt',cd:'clock',guard:'clan',leech:'gift',echo:'music',gold:'coin',shadow:'skull',rainbow:'gem'};
const wsIco=(n,s)=>{try{if(window.ISO&&ISO.has(n))return ISO.render(ISO.A[n],s||32,'3d').replace(/width="\d+" height="\d+"/,`width="${s||32}" height="${s||32}"`);}catch(e){}return '';};
const UPG_TXT={dmg:'How much damage the ball deals on hit',hp:'Health pool — lasts longer in a fight',spd:'How fast the ball moves around the arena',cd:'How often you can use the ability (lower is better)'};
const VAR_PM={guard:[['For 1.5s after the ability you take 15% less damage'],['Damage −4%']],leech:[['Every ability use heals 0.8% HP'],['Cooldown 12% longer']],echo:[['Every 4th ability recharges twice as fast'],['Health −4%']]};
const MUT_PM={gold:[['Damage +4%'],['Health −2.5%']],shadow:[['Speed +4%'],['Health −1%']],rainbow:[['Cooldown −7%'],['Damage −3%']]};
const pc=x=>{const v=Math.round(x*1000)/10;return (v>0?'+':v<0?'−':'')+String(Math.abs(v)).replace('.',',')+'%';};
(function(){const c=document.createElement('style');c.textContent=`
.ws98{font:12px Tahoma,Verdana,sans-serif;text-align:left}.ws98 .card .tx,.ws98 .vc{text-align:left}.ws98 .dlg,.ws98 .dlg .dt,.ws98 .dlg .db{display:block;text-align:left}.ws98 .wsintro{background:#ffffe1;border:1px solid #000;padding:6px 8px;margin-bottom:6px;display:flex;gap:8px;align-items:center}
.ws98 .wsintro span{flex:1}.ws98 .wsmain{display:flex;gap:8px}.ws98 .wslist{width:170px;flex:none;background:#fff;border:2px inset #fff;max-height:470px;overflow:auto}
.ws98 .wsb{display:flex;gap:6px;align-items:center;padding:4px;cursor:pointer;border-bottom:1px dotted #aaa;position:relative}.ws98 .wsb.on{background:#000080;color:#fff}
.ws98 .wsb .ballico{width:30px!important;height:30px!important;font-size:14px;flex:none}.ws98 .wsb .nm{flex:1;min-width:0}.ws98 .wsb .nm b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws98 .mini{height:5px;background:#fff;border:1px inset #888;margin-top:2px}.ws98 .mini i{display:block;height:100%;background:#000080}.ws98 .wsb.on .mini i{background:#ffd23f}
.ws98 .pt{position:absolute;right:3px;top:3px;background:#e00;color:#fff;font-weight:bold;font-size:10px;border-radius:8px;padding:0 5px;border:1px solid #fff}
.ws98 .wsr{flex:1;min-width:0}.ws98 .wshead{display:flex;gap:10px;align-items:center;margin-bottom:6px}.ws98 .wshead .ballico{width:72px!important;height:72px!important;font-size:34px;flex:none}
.ws98 .wshead .info{flex:1}.ws98 .big{font-size:15px;font-weight:bold}.ws98 .pbar{margin:3px 0}
.ws98 .tabs{display:flex;gap:2px;margin-top:4px}.ws98 .tabs button{flex:1;min-height:28px;font-weight:bold;border-bottom:none}.ws98 .tabs button.on{background:#dcdcdc;position:relative;top:1px}
.ws98 .pane{border:2px outset #fff;padding:6px;background:#d4d0c8;min-height:260px}
.ws98 .card{display:flex;gap:8px;align-items:center;background:#c0c0c0;border:2px outset #fff;padding:6px;margin-bottom:6px}.ws98 .card .ic{flex:none;width:40px;text-align:center}
.ws98 .card .tx{flex:1;min-width:0}.ws98 .card .ba{color:#004000;font-weight:bold}.ws98 .card .why{color:#800000;font-size:11px}
.ws98 .ubtn{min-width:104px;min-height:40px;font-weight:bold;font-size:13px}.ws98 .rk{letter-spacing:1px;color:#000080}
.ws98 .vg{display:flex;gap:6px;flex-wrap:wrap}.ws98 .vc{flex:1 1 140px;background:#c0c0c0;border:2px outset #fff;padding:6px;cursor:pointer;text-align:left;font:12px Tahoma,sans-serif}
.ws98 .vc.on{outline:2px solid #000080;background:#e8e8ff}.ws98 .vc[disabled]{opacity:.75;cursor:default;color:#333}.ws98 .p{color:#006000}.ws98 .m{color:#a00000}
.ws98 .note{font-size:11px;color:#333;margin-top:4px}.ws98 .foot{display:flex;gap:6px;align-items:center;justify-content:space-between;margin-top:6px;flex-wrap:wrap}
.ws98 .cfm,.ws98 .tour{position:absolute;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:20}
.ws98 .dlg{background:#c0c0c0;border:2px outset #fff;width:min(340px,92%);box-shadow:2px 2px 0 #000}.ws98 .dlg .dt{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:bold;padding:3px 6px}
.ws98 .dlg .db{padding:10px}.ws98 .dlg .bb{display:flex;gap:6px;justify-content:flex-end;margin-top:10px}.ws98 .dlg button{min-width:80px;min-height:30px}
.ws98 .hl{outline:3px dashed #e00;outline-offset:2px;position:relative;z-index:6;background:#ffffe1}
@media (max-width:640px){.ws98 .wsmain{flex-direction:column}.ws98 .wslist{width:auto;display:flex;max-height:none;overflow-x:auto}.ws98 .wsb{flex:none;width:130px;border-bottom:none;border-right:1px dotted #aaa}
.ws98 .card{flex-wrap:wrap}.ws98 .card .ubtn{width:100%;min-height:46px}.ws98 .tabs button{min-height:40px;font-size:13px}.ws98 .vc{flex-basis:100%;min-height:44px}.ws98 button{min-height:36px}}`;document.head.appendChild(c);})();
function wsConfirm(w,title,html,ok){const box=w.querySelector('.ws98');const d=document.createElement('div');d.className='cfm';d.innerHTML=`<div class="dlg"><div class="dt">${title}</div><div class="db">${html}<div class="bb"><button class="y">Yes</button><button class="n">Cancel</button></div></div></div>`;box.appendChild(d);
 d.querySelector('.n').onclick=()=>d.remove();d.querySelector('.y').onclick=()=>{d.remove();ok();};}
const TOUR=[['.wslist','<b>Step 1 of 3.</b> Your balls are on the left. Play any of them: a win gives +30 XP, a loss +12. A red dot means you have free points.'],
 ['.wshead','<b>Step 2 of 3.</b> The bar is XP to the next level. Every new mastery level (max 10) gives 1 upgrade point.'],
 ['.pane','<b>Step 3 of 3.</b> Spend 1 point + coins on an upgrade. From level 8 you can pick an ability variant, and mutations drop rarely on their own.']];
function wsTour(w,i){const box=w.querySelector('.ws98');box.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));box.querySelectorAll('.tour').forEach(e=>e.remove());if(i>=TOUR.length){localStorage.setItem('bf_ws_tour','1');return;}
 const t=box.querySelector(TOUR[i][0]);if(t)t.classList.add('hl');const d=document.createElement('div');d.className='tour';d.style.background='transparent';d.style.pointerEvents='none';
 d.innerHTML=`<div class="dlg" style="pointer-events:auto;align-self:flex-end;margin-bottom:10px"><div class="dt">❓ How it works</div><div class="db">${TOUR[i][1]}<div class="bb"><button id="ws_tour_skip">Skip</button><button id="ws_tour_next">${i<2?'Next ›':'Got it'}</button></div></div></div>`;box.appendChild(d);
 d.querySelector('#ws_tour_next').onclick=()=>wsTour(w,i+1);d.querySelector('#ws_tour_skip').onclick=()=>wsTour(w,99);}
UI.workshop=function(id){ensure();const ids=ownedIds();if(!ids.length)return;curB=id&&save.owned[id]?id:(curB&&save.owned[curB]?curB:(save.sel&&save.owned[save.sel]?save.sel:ids[0]));
 const p=bxOf(curB),d=BY[curB],mx=p.lv>=MASTER_MAX,pp=pts(p);
 const list=ids.map(i=>{const q=bxOf(i),n=pts(q),m=q.lv>=MASTER_MAX;return `<div class="wsb ${i===curB?'on':''}" data-b="${i}">${ballIco(BY[i],30)}<div class="nm"><b>${esc(BY[i].name)}</b>Lv. ${q.lv}${m?' (max)':''}<div class="mini"><i style="width:${m?100:Math.round(q.xp/need(q.lv)*100)}%"></i></div></div>${n?`<span class="pt" title="Free points">${n}</span>`:''}</div>`;}).join('');
 const upCards=Object.keys(UPG).map(k=>{const U=UPG[k],r=p.up[k]|0,c=COST[r],ok=r<UPG_RANK;
  const why=!ok?'':pp<1?(mx?'All points spent':`Need a point — reach Lv. ${p.lv+1}`):save.coins<c?`Not enough coins (need ${c-save.coins})`:'';
  return `<div class="card"><div class="ic">${wsIco(WS_ICO[k],40)}</div><div class="tx"><b>${U.n}</b> <span class="rk">${'■'.repeat(r)}${'□'.repeat(UPG_RANK-r)}</span> <span class="stat">rank ${r}/${UPG_RANK}</span><br>${UPG_TXT[k]}.<br>
  ${ok?`<span class="ba">${pc(U.per*r)} → ${pc(U.per*(r+1))}</span>`:`<span class="ba">${pc(U.per*r)} — maxed</span>`}${why?`<div class="why">⛔ ${why}</div>`:''}</div>
  ${ok?`<button class="ubtn" data-up="${k}" ${why?'disabled':''}>Upgrade<br><small>1 point + ${c} 🪙</small></button>`:'<b>MAX</b>'}</div>`;}).join('');
 const lock=p.lv<VAR_LVL;
 const vc=(v,n,pm,dis)=>`<button class="vc ${p.v===v?'on':''}" data-v="${v}" ${dis?'disabled':''}>${v?wsIco(WS_ICO[v],28):''} <b>${n}</b> ${p.v===v?'✔ selected':''}<br>${pm[0].map(x=>`<div class="p">＋ ${x}</div>`).join('')}${pm[1].map(x=>`<div class="m">－ ${x}</div>`).join('')}</button>`;
 const varPane=`<p>A variant changes how the ability “<b>${esc(d.ab)}</b>” works. Each has an upside and a downside. ${lock?`<b class="m">🔒 Unlocks at mastery level ${VAR_LVL}(now ${p.lv}).</b>`:''}</p>
  <div class="vg">${vc('','Common',[['The ability works as usual'],[]],lock)}${Object.keys(VARS).map(v=>vc(v,VARS[v].n,VAR_PM[v],lock)).join('')}</div>
  <div class="note">🤖 Variants only work <b>in bot fights</b>. Online it’s always “Standard”.</div>`;
 const mutPane=`<p><b>Mutation</b> — a rare special look for a ball: changes its color and gives a small bonus with a drawback. Can’t be bought: a <b>1.5% chance after every win</b>, plus a mutagen in the Battle Pass. Mutations you have can be equipped and removed for free.</p>
  <div class="vg"><button class="vc ${p.m?'':'on'}" data-m=""><b>No mutation</b> ${p.m?'':'✔'}<br>Standard ball look</button>${Object.keys(MUT).map(m=>{const has=p.ms.includes(m);return `<button class="vc ${p.m===m?'on':''}" data-m="${m}" ${has?'':'disabled'}>${wsIco(WS_ICO[m],28)} <b style="color:${MUT[m].c};text-shadow:1px 1px #000">${MUT[m].n}</b> ${p.m===m?'✔':''}${has?'':' 🔒 not dropped yet'}<br>${MUT_PM[m][0].map(x=>`<div class="p">＋ ${x}</div>`).join('')}${MUT_PM[m][1].map(x=>`<div class="m">－ ${x}</div>`).join('')}</button>`;}).join('')}</div>`;
 const upPane=`<div class="stat" style="margin-bottom:4px">Each upgrade costs <b>1 point</b> and coins (150 → 300 → 500). Total points across all levels: ${MASTER_MAX-1}, and ranks ${Object.keys(UPG).length*UPG_RANK} — pick what matters most.</div>${upCards}
  <div class="note">🌐 Online, upgrades work at <b>25%</b> strength (to keep it fair). That’s the ★ on the ball.</div>
  <div class="foot"><span class="stat">Changed your mind? A reset refunds points, not coins.</span><button id="ws_rs" ${spent(p)?'':'disabled'}>↺ Reset points (200 🪙)</button></div>`;
 const html=`<div class="ws98" style="position:relative"><div class="wsintro">${wsIco('anvil',32)}<span>This is where you power up your balls. Play with a ball — it earns XP and levels up; each level gives a point, and points plus coins buy upgrades.</span><button id="ws_help" title="How it works" style="min-width:30px;font-weight:bold">?</button></div>
 <div class="wsmain"><div class="wslist">${list}</div><div class="wsr">
 <div class="wshead">${ballIco(d,72)}<div class="info"><div class="big">${esc(d.name)} — level ${p.lv}/${MASTER_MAX}</div>
 <div class="pbar"><i style="width:${mx?100:Math.round(p.xp/need(p.lv)*100)}%"></i></div>${mx?'Max level!':`${p.xp} / ${need(p.lv)} XP to level ${p.lv+1}`} <span class="stat">(win +${XPW}, loss +${XPL})</span><br>
 Free points: <b style="font-size:14px;color:${pp?'#c00':'#000'}">${pp}</b> · Coins: <b>${save.coins} 🪙</b></div></div>
 <div class="tabs"><button data-tab="up" class="${wsTab==='up'?'on':''}">⚒ Upgrades</button><button data-tab="var" class="${wsTab==='var'?'on':''}">✨ Ability</button><button data-tab="mut" class="${wsTab==='mut'?'on':''}">🧬 Mutations</button></div>
 <div class="pane">${wsTab==='var'?varPane:wsTab==='mut'?mutPane:upPane}</div></div></div></div>`;
 openWin('workshop','Forge',html,{w:720,icon:'🔨'});
 const w=$('w_workshop');if(!w)return;w.querySelectorAll('.help98').forEach(e=>e.remove());
 w.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>UI.workshop(e.dataset.b));
 w.querySelectorAll('[data-tab]').forEach(e=>e.onclick=()=>{wsTab=e.dataset.tab;UI.workshop(curB);});
 w.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=b.dataset.up,r=p.up[k]|0,c=COST[r];if(r>=UPG_RANK||pts(p)<1||save.coins<c)return;save.coins-=c;p.up[k]=r+1;save.stats.bup++;persist();checkAch();try{updTray();}catch(e){}UI.workshop(curB);});
 const rs=$('ws_rs');if(rs)rs.onclick=()=>wsConfirm(w,'Reset upgrades?',`All points for “${esc(d.name)}” come back and ranks reset.<br><b>Price: 200 🪙.</b> Coins you spent don’t come back.`,()=>{if(save.coins<200)return toast('Forge','Need 200 coins');save.coins-=200;p.up={};persist();try{updTray();}catch(e){}UI.workshop(curB);});
 w.querySelectorAll('[data-v]').forEach(r=>r.onclick=()=>{const v=r.dataset.v;if(v&&p.lv<VAR_LVL)return;p.v=v;if(v)save.stats.varSet++;persist();checkAch();UI.workshop(curB);});
 w.querySelectorAll('[data-m]').forEach(r=>r.onclick=()=>{const m=r.dataset.m;if(m&&!p.ms.includes(m))return;p.m=m;persist();UI.workshop(curB);});
 $('ws_help').onclick=()=>wsTour(w,0);
 if(!localStorage.getItem('bf_ws_tour'))wsTour(w,0);};
// ---------- battle pass ----------
const RW=[null,{c:100},{cards:5},{c:150},{g:3},{crate:'common'},{c:150},{cards:5},{g:5},{c:200},{pat:'zebra'},{c:200},{cards:8},{g:5},{c:250},{mut:1},{c:250},{cards:8},{g:8},{c:300},{pat:'stars'},{c:300},{crate:'rare'},{g:8},{c:350},{mut:1},{pat:'check'},{c:400},{g:10},{pat:'flame'},{ball:'comet'}];
const rwTxt=r=>r.c?r.c+' coins':r.g?r.g+' 💎':r.cards?r.cards+' cards':r.crate?CRATES[r.crate].n:r.pat?'Pattern “'+PSK[r.pat]+'»':r.mut?'Mutagen':r.ball?'Ball “'+BY[r.ball].name+'»':'';
function giveRw(r){if(r.c)save.coins+=r.c;if(r.g)save.gems+=r.g;if(r.cards){const ids=ownedIds(),id=save.sel&&save.owned[save.sel]?save.sel:ids[Math.random()*ids.length|0];save.owned[id].cards=(save.owned[id].cards|0)+r.cards;toast('Pass','+'+r.cards+' cards: '+BY[id].name);}
 if(r.crate)openCrate(r.crate,true);if(r.pat)save.pskins[r.pat]=1;if(r.mut)randMut();
 if(r.ball){if(save.owned[r.ball]){save.coins+=500;save.gems+=10;toast('Pass','Already have this ball: +500 coins, +10 💎');}else{save.owned[r.ball]={lvl:1,cards:0};toast('🌟 Season exclusive',BY[r.ball].name+' is yours!');}}}
const QD=[{k:'m',n:'Play 5 matches',t:5,xp:200,f:s=>s.matches},{k:'w',n:'Win 3 times',t:3,xp:250,f:s=>s.wins},{k:'a',n:'Use your ability 20 times',t:20,xp:150,f:s=>s.abil}];
const QW=[{k:'W',n:'Win 15 times',t:15,xp:800,f:s=>s.wins},{k:'M',n:'Play 30 matches',t:30,xp:700,f:s=>s.matches},{k:'T',n:'Play a tournament',t:1,xp:500,f:s=>s.tourN},{k:'B',n:'Defeat 3 bosses',t:3,xp:500,f:s=>s.bosses}];
function qsnap(){const q=save.bp.q,s=save.stats,dk=dayKey(),wk=weekKey();
 if(q.d!==dk){q.d=dk;q.ds={};QD.forEach(x=>q.ds[x.k]=x.f(s)|0);q.dc={};}
 if(q.w!==wk){q.w=wk;q.ws={};QW.forEach(x=>q.ws[x.k]=x.f(s)|0);q.wc={};}}
const qprog=(x,base)=>Math.min(x.t,(x.f(save.stats)|0)-(base[x.k]|0));
function bpXP(n){const t0=bpTier();save.bp.xp=Math.min(TIER*TIERS,save.bp.xp+n);const t1=bpTier();save.stats.bpMax=Math.max(save.stats.bpMax,t1);if(t1>t0)toast('🎫 Battle Pass: tier '+t1,'Claim your reward in the Pass window');}
UI.bpass=function(){ensure();qsnap();const t=bpTier(),q=save.bp.q,left=Math.max(0,Math.ceil((seasonEnd()-Date.now())/DAY));
 const cells=[];for(let i=1;i<=TIERS;i++){const ok=i<=t,cl=save.bp.cl[i];cells.push(`<div class="grp" style="display:inline-block;width:92px;height:74px;vertical-align:top;margin:2px;font-size:11px;${i===30?'background:#fff6c0':''}"><b>Tier ${i}</b><br>${rwTxt(RW[i])}<br>${cl?'✔ claimed':ok?`<button data-t="${i}">Claim</button>`:'🔒'}</div>`);}
 const qrow=(x,base,done,typ)=>{const p=qprog(x,base);return `<tr><td>${x.n}</td><td>${p}/${x.t}</td><td>+${x.xp} XP</td><td>${done[x.k]?'✔':p>=x.t?`<button data-q="${typ}${x.k}">Claim</button>`:''}</td></tr>`;};
 openWin('bpass','Battle Pass',`<div class="grp"><b>Season ${seasonNo()}</b> — ${left} days left. The pass is free. Tier <b>${t}/${TIERS}</b> · XP ${save.bp.xp}/${TIER*TIERS}
 <div class="pbar"><i style="width:${t>=TIERS?100:Math.round(save.bp.xp%TIER/TIER*100)}%"></i></div>Match XP: win +60, loss +25. Tier 30 unlocks the exclusive ball “${BY.comet?BY.comet.name:'Comet'}».</div>
 <div style="display:flex;gap:6px"><div style="flex:1"><b>Daily</b><table class="t">${QD.map(x=>qrow(x,q.ds,q.dc,'d')).join('')}</table></div><div style="flex:1"><b>Weekly</b><table class="t">${QW.map(x=>qrow(x,q.ws,q.wc,'w')).join('')}</table></div></div>
 <div style="max-height:300px;overflow:auto">${cells.join('')}</div>
 <fieldset><legend>Ball patterns (drawn under the logo)</legend>${Object.keys(PSK).map(k=>save.pskins[k]?`<button data-p="${k}">${PSK[k]}</button>`:`<button disabled>${PSK[k]} 🔒</button>`).join(' ')} <button data-p="">Remove</button> <span class="stat">for ball: ${esc(BY[save.sel]?BY[save.sel].name:'—')}</span></fieldset>`,{w:640,icon:'🎫'});
 const w=$('w_bpass');if(!w)return;
 w.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const i=+b.dataset.t;if(save.bp.cl[i]||i>bpTier())return;save.bp.cl[i]=1;giveRw(RW[i]);persist();checkAch();UI.bpass();});
 w.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const typ=b.dataset.q[0],k=b.dataset.q.slice(1),L=typ==='d'?QD:QW,x=L.find(y=>y.k===k),done=typ==='d'?q.dc:q.wc,base=typ==='d'?q.ds:q.ws;if(!x||done[k]||qprog(x,base)<x.t)return;done[k]=1;bpXP(x.xp);persist();if(typ==='d'&&QD.every(y=>q.dc[y.k])&&window.QOL)QOL.allDaily();UI.bpass();});
 w.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const id=save.sel;if(!id||!save.owned[id])return;if(b.dataset.p&&save.pskins[b.dataset.p])save.psel[id]=b.dataset.p;else delete save.psel[id];persist();checkAch();toast('Pattern',b.dataset.p?PSK[b.dataset.p]:'removed');});};
// ---------- patterns ----------
function drawPat(ctx,k,s,t){ctx.save();ctx.beginPath();ctx.arc(s.x,s.y,s.R,0,7);ctx.clip();const R=s.R;ctx.globalAlpha=.42;
 if(k==='zebra'){ctx.fillStyle='#111';for(let i=-4;i<=4;i++){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(.6);ctx.fillRect(i*R*.4-R*.1,-R*1.5,R*.2,R*3);ctx.restore();}}
 else if(k==='check'){ctx.fillStyle='#fff';const c=R/2.5;for(let x=-3;x<3;x++)for(let y=-3;y<3;y++)if((x+y)&1)ctx.fillRect(s.x+x*c,s.y+y*c,c,c);}
 else if(k==='stars'){ctx.fillStyle='#fff8b0';for(let i=0;i<7;i++){const a=i*2.4+t*.3,r=R*(.25+.6*((i*37)%10)/10);const x=s.x+Math.cos(a)*r,y=s.y+Math.sin(a)*r,z=R*.13;ctx.beginPath();for(let j=0;j<10;j++){const q=j*Math.PI/5,rr=j&1?z*.45:z;ctx.lineTo(x+Math.cos(q)*rr,y+Math.sin(q)*rr);}ctx.fill();}}
 else if(k==='flame'){const g=ctx.createLinearGradient(0,s.y+R,0,s.y-R);g.addColorStop(0,'#ff3d00');g.addColorStop(.6,'rgba(255,200,0,.6)');g.addColorStop(1,'rgba(255,255,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(s.x-R,s.y+R);for(let i=0;i<=8;i++){const x=s.x-R+i*R/4;ctx.lineTo(x,s.y+R*(.1-.5*Math.abs(Math.sin(i*1.7+t*6))));}ctx.lineTo(s.x+R,s.y+R);ctx.fill();}
 ctx.restore();}
if(window.SKIN){const op=SKIN.paint.bind(SKIN);SKIN.paint=function(ctx,b,i,s){op(ctx,b,i,s);try{const k=(typeof G!=='undefined'&&G)&&G.kind==='online'?(PROG.pats&&PROG.pats[i]):(save.psel&&save.psel[b.id]);if(k&&PSK[k])drawPat(ctx,k,s,performance.now()/1000);}catch(e){}};}
// ---------- comet logo ----------
if(window.LOGO&&LOGO.L&&!LOGO.L.comet){LOGO.L.comet=LOGO.L.laser||null;}
// ---------- match: XP, pass, mutations, clan ----------
const orm=window.recordMatch;
window.recordMatch=function(won,xp){ensure();let id=null;try{const b=G&&G.balls&&G.balls[G.me];id=b&&save.owned[b.id]?b.id:null;}catch(e){}
 if(G&&G.kind==='tour'&&won)save.stats.dch++;
 if(id){addBX(id,won?XPW:XPL);if(won&&Math.random()<.015)giveMut(id,Object.keys(MUT)[Math.random()*3|0]);}
 bpXP(won?60:25);
 if(won&&(typeof Cloud!=='undefined')&&Cloud.auth&&PROG.clan)Cloud.req('/api/clan/contrib','POST',{},15000).then(r=>{if(r&&r.pts!=null&&PROG.clan)PROG.clan.wk_pts=r.pts;}).catch(()=>{});
 return orm.apply(this,arguments);};
// ---------- online: data exchange ----------
const PROG=window.PROG={clan:null,tags:{},pats:[null,null],their:null,
 tline(){const t=save&&save.title&&TITLES[save.title]?' «'+TITLES[save.title].n+'»':'';return t;},
 nick(n,tag,title){return (tag?`<b style="color:#800080">[${esc(tag)}]</b> `:'')+esc(n)+(title&&TITLES[title]?` <i class="stat">«${TITLES[title].n}»</i>`:'');},
 ensure,TITLES,PSK,addBX,giveMut,bpXP,bpTier,RW,seasonNo};
const lim=(v,lo,hi)=>Math.min(hi,Math.max(lo,+v||1));
function myExt(id){const u=upgMods(id,true);return {up:{hp:u.hp,dmg:u.dmg,spd:u.spd,cdMul:u.cdMul,ml:u.ml},mut:u.mut||'',pat:(save.psel&&save.psel[id])||'',ttl:save.title||'',tag:save.clanTag||''};}
const osend=Net.send.bind(Net);
Net.send=function(m){try{if(m&&m.t==='pick'&&m.id)m.x=myExt(m.id);}catch(e){}return osend(m);};
const ond=Net.onData.bind(Net);
Net.onData=function(d){try{if(d&&d.t==='pick'&&d.x&&typeof d.x==='object'){const x=d.x,u=x.up||{};
 PROG.their={up:{hp:lim(u.hp,.9,1.05),dmg:lim(u.dmg,.9,1.075),spd:lim(u.spd,.9,1.065),cdMul:lim(u.cdMul,.88,1.1),ml:Math.min(MASTER_MAX,Math.max(1,u.ml|0))},mut:MUT[x.mut]?x.mut:'',pat:PSK[x.pat]?x.pat:'',
  ttl:TITLES[x.ttl]?x.ttl:'',tag:typeof x.tag==='string'&&/^[A-ZА-ЯЁ0-9]{2,5}$/.test(x.tag)?x.tag:''};}}catch(e){}return ond(d);};
const onm=window.newMatch;
window.newMatch=function(kind,ids,opts){opts=opts||{};if(kind==='online'){try{const me=opts.me|0,op=1-me,mid=ids[me],th=PROG.their||{up:{hp:1,dmg:1,spd:1,cdMul:1,ml:1}};const mx=myExt(mid);
  const key=me?'mods1':'mods0',ok=me?'mods0':'mods1';opts[key]=applyUp(opts[key]||{},Object.assign({},mx.up,{mut:mx.mut,var:''}));opts[ok]=applyUp(opts[ok]||{},Object.assign({},th.up,{mut:th.mut||'',var:''}));
  PROG.pats=[];PROG.pats[me]=mx.pat;PROG.pats[op]=th.pat||'';
  const nm=(th.tag?'['+th.tag+'] ':'')+(Net.oppNick||'Rival')+(th.ttl?' «'+TITLES[th.ttl].n+'»':'');opts.names=me?[nm,'You']:['You',nm];}catch(e){}}
 return onm.call(this,kind,ids,opts);};
// ---------- clans ----------
const need_login=()=>{if((typeof Cloud!=='undefined')&&Cloud.auth)return false;openWin('clan','Clans','<div class="grp">Clans run on your cloud account.<br><br><button id="pg_lg">Sign in / sign up…</button></div>',{w:360,icon:'🛡️'});const b=$('pg_lg');if(b)b.onclick=()=>{try{UI.account();}catch(e){}};return true;};
let ctab='main',chatT=0,lastId=0;
async function loadClan(){try{const r=await Cloud.req('/api/clan','GET',null,20000);PROG.clan=r.clan||null;save.clanTag=PROG.clan?PROG.clan.tag:'';PROG.members=r.clan&&r.clan.members||[];persist();checkAch();return r;}catch(e){return null;}}
UI.clan=async function(tab){if(need_login())return;ensure();ctab=tab||ctab;openWin('clan','Clans','<div class="grp">Loading…</div>',{w:560,icon:'🛡️'});
 const r=await loadClan();if(!$('w_clan'))return;const c=PROG.clan;let top=[];try{top=(await Cloud.req('/api/clans/top','GET',null,20000)).clans||[];}catch(e){}
 const topH=`<table class="t"><tr><th>#</th><th>Tag</th><th>Clan</th><th>Members</th><th>Points</th></tr>${top.map((k,i)=>`<tr><td>${i+1}</td><td><b>[${esc(k.tag)}]</b></td><td>${esc(k.name)}</td><td>${k.members}</td><td>${k.pts}</td></tr>`).join('')||'<tr><td colspan=5>No clans yet</td></tr>'}</table>`;
 let h;if(!r)h='<div class="grp">Server unavailable. Try again later.</div>';
 else if(!c)h=`<fieldset><legend>Create a clan (500 coins)</legend>Tag (2–5 letters/digits): <input id="pg_ct" maxlength=5 size=6> Name: <input id="pg_cn" maxlength=24 size=18> <button id="pg_cc">Create</button></fieldset>
  <fieldset><legend>Join</legend>Clan tag: <input id="pg_jt" maxlength=5 size=6> <button id="pg_cj">Join</button></fieldset><b>Top Clans</b>${topH}`;
 else{const tg=c.target||1,p=Math.min(c.wk_pts|0,tg);
  h=`<div class="grp"><b>[${esc(c.tag)}] ${esc(c.name)}</b> — members: ${PROG.members.length}/20 · clan points: ${c.pts|0}
  <br>Weekly goal: member wins ${p}/${tg}<div class="pbar"><i style="width:${Math.round(p/tg*100)}%"></i></div>
  ${c.claimed?'✔ This week’s reward claimed':p>=tg?'<button id="pg_cq">Claim: 250 coins + 5 💎</button>':'Every win you get = +1 clan point'} &nbsp; <button id="pg_cl">Leave clan</button></div>
  <div style="display:flex;gap:6px"><div style="flex:1"><b>Clan chat</b><div id="pg_chat" class="grp" style="height:200px;overflow:auto;background:#fff"></div><input id="pg_cm" maxlength=200 style="width:75%"> <button id="pg_cs">Send</button></div>
  <div style="width:190px"><b>Players</b><div class="grp" style="height:224px;overflow:auto">${PROG.members.map(m=>`${m.role==='leader'?'<b>★</b> ':''}${PROG.nick(m.nick,'',m.title)} <span class="stat">${m.pts|0}</span><br>`).join('')}</div></div></div><b>Top Clans</b>${topH}`;}
 openWin('clan','Clans',h,{w:560,icon:'🛡️'});const w=$('w_clan');if(!w)return;
 const act=async(path,body,msg)=>{try{const x=await Cloud.req(path,'POST',body,20000);if(msg)toast('Clans',msg);return x;}catch(e){toast('Clans',esc(e.message));return null;}};
 if($('pg_cc'))$('pg_cc').onclick=async()=>{if(save.coins<500)return toast('Clans','Need 500 coins');const x=await act('/api/clan/create',{tag:$('pg_ct').value.trim().toUpperCase(),name:$('pg_cn').value.trim()},'Clan created');if(x){save.coins-=500;persist();UI.clan();}};
 if($('pg_cj'))$('pg_cj').onclick=async()=>{const x=await act('/api/clan/join',{tag:$('pg_jt').value.trim().toUpperCase()},'You joined the clan');if(x)UI.clan();};
 if($('pg_cl'))$('pg_cl').onclick=async()=>{if(!confirm('Leave the clan?'))return;const x=await act('/api/clan/leave',{},'You left the clan');if(x){PROG.clan=null;save.clanTag='';persist();UI.clan();}};
 if($('pg_cq'))$('pg_cq').onclick=async()=>{const x=await act('/api/clan/claim',{},'Clan reward claimed');if(x&&x.ok){save.coins+=250;save.gems+=5;save.stats.clanQ++;persist();checkAch();UI.clan();}};
 if(c){lastId=0;const box=$('pg_chat');const poll=async()=>{if(!$('pg_chat')){clearInterval(chatT);return;}try{const x=await Cloud.req('/api/clan/chat?since='+lastId,'GET',null,15000);(x.msgs||[]).forEach(m=>{lastId=Math.max(lastId,m.id);const d=document.createElement('div');d.innerHTML=`<b>${esc(m.nick)}:</b> ${esc(m.text)}`;box.appendChild(d);});if((x.msgs||[]).length)box.scrollTop=1e9;}catch(e){}};
  clearInterval(chatT);poll();chatT=setInterval(poll,4000);
  const send=async()=>{const t=$('pg_cm').value.trim();if(!t)return;$('pg_cm').value='';try{await Cloud.req('/api/clan/chat','POST',{text:t},15000);poll();}catch(e){toast('Chat',esc(e.message));}};
  $('pg_cs').onclick=send;$('pg_cm').onkeydown=e=>{if(e.key==='Enter')send();};}};
// ---------- online tournament ----------
const OT=window.OTour={id:0,st:null,t:0,cur:null,
 open(){if(need_login())return;this.render();},
 async join(){const ball=save.sel&&save.owned[save.sel]?save.sel:ownedIds()[0];try{const r=await Cloud.req('/api/otour/join','POST',{ball},20000);this.id=r.id;this.poll();}catch(e){toast('Online Tournament',esc(e.message));}},
 async leave(){try{await Cloud.req('/api/otour/leave','POST',{id:this.id},15000);}catch(e){}this.id=0;this.st=null;this.cur=null;clearTimeout(this.t);this.render();},
 async poll(){clearTimeout(this.t);if(!this.id)return;try{this.st=await Cloud.req('/api/otour/state?id='+this.id,'GET',null,15000);}catch(e){}
  const s=this.view();if(s&&s.status==='done'){this.finish();}else this.t=setTimeout(()=>this.poll(),3000);if($('w_otour'))this.render();},
 view(){const j=this.st;if(!j)return null;const S=j.state,me=j.me;const v={id:j.id,players:(j.players||[]).map(n=>({nick:n})),left:(new Date(j.start_at)-new Date(j.now))/1000};
  if(!S){v.status='lobby';return v;}v.status=S.done?'done':'run';v.round=Math.min(2,S.r);const nm=i=>i==null?'':S.P[i].nm;
  v.rounds=[0,1,2].map(r=>{const a=S.R[r]||[],out=[];for(let k=0;k<4>>r;k++){const x=a[2*k],y=a[2*k+1],w=(S.R[r+1]||[])[k];out.push({a:nm(x),b:nm(y),w:w==null||x==null?null:(w===x?0:1)});}return out;});
  const mi=S.P.findIndex(p=>p.uid===me);v.mi=mi;
  if(mi>=0){let pl=0;for(let r=0;r<3;r++){const a=S.R[r]||[],pos=a.indexOf(mi);if(pos<0)break;const w=(S.R[r+1]||[])[pos>>1];if(w!=null&&w!==mi){pl=[5,3,2][r];break;}if(r===2&&w===mi)pl=1;}
   if(pl)v.place=pl;
   if(!S.done){const a=S.R[S.r]||[],pos=a.indexOf(mi);if(pos>=0&&(S.R[S.r+1]||[])[pos>>1]==null){const oi=a[pos^1],O=S.P[oi];v.myMatch={k:pos>>1,opp:O.nm,bot:!!O.bot,ball:O.ball,d:O.d,host:mi<oi,played:!!this.rep[S.r+':'+(pos>>1)]};}}}
  return v;},
 rep:{},
 myMatch(){const v=this.view();return v&&v.status==='run'?v.myMatch||null:null;},
 render(){const s=this.view(),me=Cloud.auth&&Cloud.auth.nick;let h;
  if(!this.id||!s)h=`<div class="grp"><b>8-player Online Tournament</b><br>The lobby fills for up to 60 seconds; bots take empty slots. Matches vs real players run over P2P (like “Online”), bot matches run on your screen.<br>Prizes: 1st — 700 coins + 15 💎 + Rare Crate, 2nd — 300 + 5 💎, semifinal — 120, quarterfinal — 30.<br><br><button id="pg_oj">Join queue</button> <button id="pg_off">Offline tournament with bots</button></div>`;
  else if(s.status==='lobby')h=`<div class="grp">Lobby #${s.id}: players ${s.players.length}/8 · starts in ${Math.max(0,s.left|0)} s<br>${s.players.map(p=>esc(p.nick)).join(', ')}<br><br><button id="pg_ol">Exit</button></div>`;
  else{const R=s.rounds||[];const col=(arr,ri)=>`<div style="display:flex;flex-direction:column;justify-content:space-around;min-width:130px">${arr.map(m=>`<div class="grp" style="font-size:11px;margin:2px">${[m.a,m.b].map((p,j)=>`<div style="${m.w===j?'font-weight:bold':''}${p===me?';color:#000080':''}">${esc(p||'—')}${m.w===j?' ✔':''}</div>`).join('')}</div>`).join('')}</div>`;
   const mm=this.myMatch();h=`<div class="grp">Tournament #${s.id} — ${s.status==='done'?'finished':'round '+(s.round+1)+'/3'}${s.place?' · your place: '+(s.place===5?'5–8':s.place===3?'3–4':s.place):''}</div><div style="display:flex">${R.map(col).join('')}</div>
   <div class="grp">${mm?(mm.played?'Waiting for rival/result…':`Your match: vs <b>${esc(mm.opp)}</b>${mm.bot?' (bot)':''} <button id="pg_op">Play</button>`):s.status==='done'?'<button id="pg_ox">Close</button>':'You’re out or waiting for the next round.'}</div>`;}
  openWin('otour','Online Tournament',h,{w:600,icon:'🏆'});
  const b=(i,f)=>{const e=$(i);if(e)e.onclick=f;};b('pg_oj',()=>this.join());b('pg_ol',()=>this.leave());b('pg_off',()=>{try{UI.tour();}catch(e){}});b('pg_op',()=>this.play());b('pg_ox',()=>{this.id=0;this.st=null;this.render();});},
 play(){const mm=this.myMatch(),V=this.view();if(!mm||mm.played)return;this.cur={r:V.round,k:mm.k,id:this.id};const RR=V.round;const ball=save.sel&&save.owned[save.sel]?save.sel:ownedIds()[0];
  if(mm.bot){const pool=BALLS.filter(x=>x.id!==ball);const opp=(BY[mm.ball]&&mm.ball!==ball?mm.ball:pool[Math.random()*pool.length|0].id);Tour.on=true;Tour.online=true;
   const bd=Math.max([.3,.55,.8][RR],(mm.d||.5)*.9);Bot.t=0;newMatch('tour',[ball,opp],{d:bd,sk:botSkill(bd),arena:Math.random()*ARENAS.length|0,names:['You',mm.opp],mods0:myMods(ball),mods1:botMods(bd,false)});}
  else{const code=('T'+this.id+'R'+RR+'M'+mm.k).toUpperCase();this.cur.net=true;toast('Online Tournament','Connecting to '+esc(mm.opp)+'…');
   try{if(mm.host)Net.host(code);else{let n=0;const tj=()=>{n++;try{Net.join(code);}catch(e){}};setTimeout(tj,2500);}}catch(e){toast('Online Tournament','P2P unavailable — report the result later');}}},
 async result(won){const c=this.cur;this.cur=null;if(c)this.rep[c.r+':'+c.k]=1;Tour.on=false;Tour.online=false;if(!c)return;try{await Cloud.req('/api/otour/report','POST',{id:c.id,win:!!won},15000);}catch(e){}
  toast('Online Tournament',won?'Win! Wait for the next round':'Defeat');setTimeout(()=>this.open(),1200);this.poll();},
 finish(){const s=this.view();if(!s||!s.place||save.otc[s.id])return;save.otc[s.id]=1;const P={1:[700,15,'rare'],2:[300,5],3:[120,0]}[s.place]||[30,0];
  save.coins+=P[0];save.gems+=P[1];if(P[2])openCrate(P[2],true);save.stats.otourN++;save.stats.tourN++;if(s.place===1)save.stats.tourWins++;save.stats.tourBest=save.stats.tourBest?Math.min(save.stats.tourBest,s.place):s.place;
  persist();checkAch();toast('🏆 Online tournament finished','Place: '+(s.place===5?'5–8':s.place===3?'3–4':s.place)+' · +'+P[0]+' coins'+(P[1]?' +'+P[1]+' 💎':''));}};
// tournament net match: outcome via Net.over / UI.msg
const omsg=UI.msg&&UI.msg.bind(UI);
if(window.G!==undefined){}
const oOver=window.onMatchOver;
if(typeof oOver==='function')window.onMatchOver=function(){const r=oOver.apply(this,arguments);try{if(OT.cur&&OT.cur.net&&G&&G.kind==='online'){const won=G.winner===G.me;setTimeout(()=>OT.result(won),300);}}catch(e){}return r;};
// tournament stats (offline)
const oST=window.startTour;if(typeof oST==='function')window.startTour=function(){const r=oST.apply(this,arguments);try{if(Tour.on){ensure();save.stats.tourN++;persist();}}catch(e){}return r;};
// ---------- shortcuts ----------
window.EXTRA=window.EXTRA||[];
const PI=window.ICO&&ICO.pc||'';
EXTRA.push({k:'Forge',ico:PI,run:'UI.workshop()',cat:'std'},{k:'Battle Pass',ico:PI,run:'UI.bpass()',cat:'std'},{k:'Clans',ico:PI,run:'UI.clan()',cat:'std'},{k:'Online Tournament',ico:PI,run:'OTour.open()',cat:'std'});
// init
function boot(){if(window.PX&&PX.BYK)Object.assign(PX.BYK,{'Forge':'anvil','Battle Pass':'bpass','Clans':'clan','Online Tournament':'tcup'});ensure();try{persist();}catch(e){}if((typeof Cloud!=='undefined')&&Cloud.auth)setTimeout(loadClan,4000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else setTimeout(boot,0);
const oad=(typeof Cloud!=='undefined')&&Cloud.adopt;if(oad)Cloud.adopt=function(){const r=oad.apply(this,arguments);try{ensure();}catch(e){}return r;};
})();
