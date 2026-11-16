'use strict';
// ===== ui98.js — clear UI: Game Hub, Start menu groups, folders, tooltips, “ready” badges, window help =====
(function(){
const $=id=>document.getElementById(id);const ico=(k,s)=>{try{if(PX.BYK[k])return PX.ico(k,s);const a=APPS.find(x=>x.k===k);if(a&&/<svg/.test(a.ico))return a.ico.replace(/<svg /,`<svg width="${s}" height="${s}" `);return PX.emo(a?a.ico:'',s);}catch(e){return '';}};
PX.BYK['Game Hub']='game';PX.BYK['Mini-games']='folder';PX.BYK['Programs']='folder';
const st=document.createElement('style');st.textContent=`
.tabs98{display:flex;gap:0;padding:0 4px;position:relative;z-index:1;margin-bottom:-2px;flex-wrap:wrap}
.tabs98 .tab{background:#c0c0c0;border:2px solid;border-color:#fff #000 transparent #fff;box-shadow:inset -1px 0 #808080;border-radius:3px 3px 0 0;padding:3px 10px;margin-top:2px;cursor:pointer;font-size:12px;user-select:none}
.tabs98 .tab.on{margin-top:0;padding:5px 12px 5px;border-bottom:2px solid #c0c0c0;font-weight:bold}
.tabpane{border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080;padding:8px;min-height:210px}
.hubgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.hubbtn{display:flex!important;align-items:center;gap:6px;text-align:left!important;height:auto!important;max-width:none!important;padding:5px 6px!important;white-space:normal!important;position:relative;font-size:12px!important;line-height:1.2}
.hubbtn small{display:block;font-weight:normal;color:#404040;font-size:11px}.hubbtn[disabled]{color:#808080;text-shadow:1px 1px #fff}.hubbtn[disabled] small{color:#808080}
.hubplay{display:flex!important;align-items:center;justify-content:center;gap:10px;width:100%;max-width:none!important;height:58px!important;font:bold 20px Tahoma,'MS Sans Serif',sans-serif!important;text-align:center!important;margin-bottom:8px}
.bdg{position:absolute;top:-5px;right:-5px;min-width:15px;height:15px;padding:0 3px;background:#c00000;color:#fff;border:1px solid #fff;outline:1px solid #800000;font:bold 10px/15px Tahoma,sans-serif;text-align:center;z-index:2}
.icon .bdg{right:22px;top:-2px}
.stbar98{display:flex;gap:2px;margin-top:6px}.stbar98>div{flex:1;border:1px solid;border-color:#808080 #fff #fff #808080;padding:1px 4px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.stbar98>div:last-child{flex:0 0 auto}
.help98{display:flex;gap:6px;align-items:flex-start;background:#ffffe1;border:1px solid #000;padding:4px 6px;margin-bottom:8px;font-size:12px}.help98 b{display:block}.help98 button{margin-left:auto;flex:none!important;min-width:0;height:20px!important;padding:0 6px!important}
.tbb.hq{font-weight:bold}
.grp98{font-weight:bold;margin:2px 0 6px;border-bottom:1px solid #808080;box-shadow:0 1px #fff;padding-bottom:2px;font-size:12px}
.fold98{display:grid;grid-template-columns:repeat(auto-fill,82px);gap:8px;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:8px;min-height:160px}
.fold98 .fi{text-align:center;cursor:pointer;font-size:11px;padding:3px}.fold98 .fi:hover span,.fold98 .fi:focus span{background:#000080;color:#fff}.fold98 .fi svg{display:block;margin:0 auto 3px}
#tray>span{position:relative;padding:0 2px}#trv{display:inline-flex;align-items:center}
#startbtn{position:relative}#startbtn .bdg{top:-6px;right:-6px}
#startmenu .it .bdg{position:static;margin-left:6px;display:inline-block}
input[type=radio],input[type=checkbox]{width:auto!important;min-width:0!important;flex:none!important;height:auto!important;box-shadow:none!important}
.lockt{color:#606060}
@media (max-width:600px){#trl,#trv,#tra{display:none!important}#tasks button{max-width:90px}.hubgrid{grid-template-columns:1fr 1fr}.tabs98 .tab{padding:3px 6px;font-size:11px}.hubplay{font-size:17px!important}}
`;document.head.appendChild(st);

// ---------- descriptions ----------
const D={'Loot Pods':'Cosmetics: ball trails, victory poses, frames','Collection':'Album: how many balls, rewards and cosmetics you’ve collected','Controls':'Phone joystick, lefty mode, tutorial','Game Hub':'Main menu: play, progress, friends and apps in one window','vs Bot':'60-level campaign, a boss every 5th level','Couch 1v1':'Two players, one keyboard','Online Match':'Fight a real rival with a room code','Survival':'Bot waves — last as long as you can','Tournament':'Bot tournament bracket','Modes':'FFA, 2v2/3v3, King of the Hill, soccer, survival, raid, daily challenge',
'Forge':'Ball upgrades and mastery','Battle Pass':'30 reward tiers from match and quest XP','Achievements':'Achievements give crystals and titles','Stats':'Your matches, wins and damage','Rewards':'Daily reward for logging in every day','Crates':'Open ball and card crates','Shop':'Buy crates, balls and skins with coins/crystals','Inventory':'Your balls, skins and ball pick for the fight','Skins':'Make your own skins',
'Clans':'Join a clan or start your own (account needed)','Online Tournament':'Tournaments with real players (account needed)','Leaderboard':'ELO leaderboard','Trade':'Trade balls with other players','Ping Chat':'Chat with players online','Account':'Sign in and cloud save','Internet Explorer':'Fan sites, forum and guestbook',
'Halloween':'Event: collect candy, do quests, open the event crate','New Year':'Event: collect snowflakes and open the event crate','Help':'Controls and rules','Mini-games':'Minesweeper, Chess, Solitaire, Pinball, Snake, Blocks…','Programs':'Notepad, Paint, Calculator, Command Prompt and more','My Computer':'Drives, files and system info','Recycle Bin':'Deleted icons — you can restore them','Replay':'Watch the last fight','Clippo':'Helper: hints and tips'};
const EVN=window.EVENTS&&EVENTS.active?EVENTS.active.name:null;
const has=k=>APPS.some(a=>a.k===k);
const GRP=[['Play',['vs Bot','Modes','Couch 1v1','Survival','Tournament','Online Match']],
 ['Progress',['Battle Pass','Rewards','Achievements','Loot Pods','Collection','Stats',EVN]],
 ['Locker',['Forge','Shop','Crates','Inventory','Skins']],
 ['Social',['Online Match','Leaderboard','Clans','Online Tournament','Trade','Account','Ping Chat','Internet Explorer']],
 ['Settings',['Controls','Display Properties','Help']]];
const GAMES=APPS.filter(a=>a.cat==='game'||a.k==='Minesweeper'||a.k==='Chess').map(a=>a.k);
const PROGS=['Notepad','Paint','Calculator','Media Player','Command Prompt','My Computer','Display Properties','Replay','Clippo'].filter(has);

// ---------- “ready to claim” ----------
const today_=()=>{try{return today();}catch(e){return new Date().toDateString();}};
const B={daily:()=>save.daily&&save.daily.last!==today_()?1:0,
 bp:()=>{try{const t=Math.min(30,Math.floor((save.bp?save.bp.xp:0)/500));let n=0;for(let i=1;i<=t;i++)if(!(save.bp.cl||{})[i])n++;return n;}catch(e){return 0;}},
 ev:()=>{try{const E=EVENTS.active;const s=save.ev&&save.ev[E.id];return s&&s.c>=E.price?1:0;}catch(e){return 0;}}};
const badgeOf=k=>k==='Progress'?totalB():k==='Loot Pods'?B.cap():k==='Rewards'?B.daily():k==='Battle Pass'?B.bp():k===EVN?B.ev():0;
B.cap=()=>{try{return QOL.caps();}catch(e){return 0;}};const totalB=()=>B.daily()+B.bp()+B.ev()+B.cap();
const bdg=n=>n?`<span class="bdg" title="Ready to claim">${n>9?'9+':n}</span>`:'';
const LOCK={'Boss Raid':6};

// ---------- Game Hub ----------
let tab=localStorage.getItem('bf_hubtab')||'Play';if(!['Play','Progress','Locker','Social','Settings','Programs'].includes(tab))tab='Play';
const card=k=>{if(!k||!has(k))return '';const lock=k==='Online Tournament'||k==='Clans'?0:0;return `<button class="hubbtn" data-run="${k}" data-hint="${(D[k]||k).replace(/"/g,'')}">${ico(k,24)}<span><b>${k}</b><small>${D[k]||''}</small></span>${bdg(badgeOf(k))}</button>`;};
const UIHub={open(t){if(t)tab=t;localStorage.setItem('bf_hubtab',tab);const tabs=[...GRP.map(g=>g[0]),'Programs'];
 const g=GRP.find(x=>x[0]===tab);let body='';
 if(tab==='Play'){const lv=(save.unlocked|0);body=`<button class="hubplay" data-run="vs Bot" data-hint="Continue the campaign from your current level">${ico('vs Bot',32)} PLAY<span style="font-size:12px;font-weight:normal">&nbsp;(level ${Math.min(60,lv+1)} of 60)</span></button>
  <div class="hubgrid">${g[1].slice(1).map(card).join('')}</div>
  <div class="grp98" style="margin-top:10px">Modes & unlocks</div><div style="font-size:11px">Every 5th campaign level is a <b>BOSS</b>. ${lv>=6?'Boss Raid is unlocked in “Modes”.':'<span class="lockt">Boss Raid — unlocks at campaign Lv. 6.</span>'} Daily Challenge refreshes every day.</div>`;}
 else if(tab==='Programs')body=`<div class="grp98">Mini-games</div><div class="hubgrid">${GAMES.map(k=>card(k)).join('')}</div><div class="grp98" style="margin-top:10px">Accessories</div><div class="hubgrid">${PROGS.map(card).join('')}</div>`;
 else body=`<div class="hubgrid">${g[1].map(card).join('')}</div>${tab==='Social'&&!(window.Cloud&&Cloud.auth)?'<div class="help98" style="margin-top:8px">'+PX.emo('ℹ️',16)+'<span>For clans, online tournaments, leaderboard and trading, sign in to <b>Account</b> — your progress gets saved to the cloud.</span></div>':''}`;
 const tb=tabs.map(t=>{const n=t==='Progress'?totalB():0;return `<div class="tab${t===tab?' on':''}" data-tab="${t}" style="position:relative">${t}${n?' ('+n+')':''}</div>`;}).join('');
 const cur=`${PX.ico?PX.emo('🪙',14):''} ${save.coins} coins · ${PX.emo('💎',14)} ${save.gems} crys.${EVN?' · '+evCur():''}`;
 openWin('hub','Game Hub',`<div class="tabs98">${tb}</div><div class="tabpane">${body}</div><div class="stbar98"><div id="hubst">Hover a button to see what it does.</div><div>${cur}</div></div>`,{w:600,icon:'🎮'});
 const w=$('w_hub');w.querySelectorAll('[data-tab]').forEach(e=>e.onclick=()=>{Sfx.click();UIHub.open(e.dataset.tab);});
 w.querySelectorAll('[data-run]').forEach(e=>{e.onclick=()=>{if(e.dataset.run!=='vs Bot'||!e.classList.contains('hubplay'))return Desk.run(e.dataset.run);Desk.run('vs Bot');};e.onmouseenter=()=>{const s=$('hubst');if(s)s.textContent=e.dataset.hint;};});}};
const CANDY=s=>`<svg class="px" width="${s}" height="${s}" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#000" d="M5 5h6v6H5z"/><path fill="#ff7518" d="M6 6h4v4H6z"/><path fill="#fff" d="M6 6h2v1H6z"/><path fill="#c04000" d="M1 4h2v1h1v1h1v4H4v1H3v1H1v-2h1V6H1zM15 4h-2v1h-1v1h-1v4h1v1h1v1h2v-2h-1V6h1z"/></svg>`;
const evCur=()=>{try{const E=EVENTS.active;return (E.id==='halloween'?CANDY(14):PX.emo(E.cur,14))+' '+((save.ev&&save.ev[E.id]||{}).c|0)+' '+E.curN.toLowerCase();}catch(e){return '';}};
window.UIHub=UIHub;

// ---------- folders ----------
const folder=(name,list)=>{openWin('fold_'+(name==='Mini-games'?'g':'p'),name,`<div class="fold98">${list.map(k=>`<div class="fi" tabindex="0" data-run="${k}" title="${D[k]||k}">${ico(k,32)}<span>${k}</span></div>`).join('')}</div><div class="stbar98"><div>Items: ${list.length}</div><div>Double-click to open</div></div>`,{w:440,icon:'📁'});
 document.querySelectorAll('#w_fold_g .fi,#w_fold_p .fi').forEach(e=>{e.ondblclick=()=>Desk.run(e.dataset.run);e.onkeydown=ev=>{if(ev.key==='Enter')Desk.run(e.dataset.run);};if(matchMedia('(pointer:coarse)').matches)e.onclick=e.ondblclick;});};
window.Folder98={games:()=>folder('Mini-games',GAMES),progs:()=>folder('Programs',PROGS)};

// ---------- desktop: fewer icons, grouped ----------
APPS.unshift({k:'Game Hub',ico:PX.ico('Game Hub'),run:'UIHub.open()'});
const binI=APPS.findIndex(a=>a.fixed);APPS.splice(binI,0,{k:'Mini-games',ico:PX.ico('Mini-games'),run:'Folder98.games()'},{k:'Programs',ico:PX.ico('Programs'),run:'Folder98.progs()'});
const SECI={'Play':'vs Bot','Progress':'Battle Pass','Locker':'Forge','Social':'Online Match','Settings':'Display Properties'};
Object.keys(SECI).forEach(k=>{APPS.splice(1,0,{k,ico:PX.ico(SECI[k]),run:`Nav.open('${k}')`});D[k]=D[k]||{'Play':'Campaign, modes, survival, tournament — all in one window','Progress':'Pass, rewards, achievements, pods, collection, stats','Locker':'Forge, shop, crates, inventory, skins','Social':'Online match, leaderboard, clans, tournaments, trading, account','Settings':'Controls, display, help'}[k];});
const DESK=['Game Hub','Play','Progress','Locker','Social','Settings',EVN,'Ping Chat','Internet Explorer','My Computer','Mini-games','Programs','Help','Recycle Bin'].filter(Boolean);
APPS.forEach(a=>{if(!DESK.includes(a.k))a.nodesk=1;});
APPS.sort((a,b)=>{const x=DESK.indexOf(a.k),y=DESK.indexOf(b.k);return (x<0?999:x)-(y<0?999:y);});
const _rd=Desk.render.bind(Desk);Desk.render=function(){_rd();document.querySelectorAll('#icons .icon').forEach(i=>{const k=i.dataset.k;i.dataset.tip=k+(D[k]?' — '+D[k]:'')+'. Double-click to open.';i.removeAttribute('title');const n=badgeOf(k);if(n)i.insertAdjacentHTML('beforeend',bdg(n));});};
if(localStorage.getItem('bf_ui3')!=='1'){localStorage.setItem('bf_ui3','1');Desk.arrange();}else Desk.render();

// ---------- Start menu groups ----------
const it=(k,label)=>has(k)?`<div class="it" onclick="event.stopPropagation();toggleStart();Sfx.click();Desk.run('${k}')" data-tip="${D[k]||''}"><span style="display:inline-flex;width:24px;justify-content:center">${ico(k,20)}</span>${label||k}${bdg(badgeOf(k))}</div>`:'';
const fn=(ic,t,run,id)=>`<div class="it"${id?' id="'+id+'"':''} onclick="event.stopPropagation();toggleStart();Sfx.click();${run}"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo(ic,20)}</span>${t}</div>`;
const sub=(ic,t,inner,n)=>`<div class="it"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo(ic,20)}</span>${t}${bdg(n||0)}<span class="arr">▸</span><div class="sub">${inner}</div></div>`;
function buildMenu(){const mus=$('smmus');const mt=mus?mus.textContent:'Music: on';
 $('smitems').innerHTML=`<div class="it" style="font-weight:bold" onclick="event.stopPropagation();toggleStart();Sfx.click();UIHub.open('Play')"><span style="display:inline-flex;width:24px;justify-content:center">${ico('Game Hub',20)}</span>Game Hub</div><hr>`+
  GRP.slice(0,4).map((g,i)=>sub(['🎮','⭐','🎒','👥'][i],g[0],`<div class="it" style="font-weight:bold" onclick="event.stopPropagation();toggleStart();Sfx.click();Nav.open('${g[0]}')"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo('📂',20)}</span>Open “${g[0]}»</div><hr>`+g[1].filter(k=>k&&!(i===3&&k==='Online Match'&&0)).map(k=>it(k)).join(''),i===1?totalB():0)).join('')+
  sub('📁','Programs',sub('🎲','Mini-games',GAMES.map(k=>it(k)).join(''))+sub('🗂️','Accessories',PROGS.map(k=>it(k)).join('')))+
  sub('⚙️','Settings',it('Controls')+fn('🖥️','Display Properties','Desk.props()')+`<div class="it" id="smmus" onclick="event.stopPropagation();toggleStart();Music.toggle()"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo('🎵',20)}</span>${mt}</div>`+fn('🗂️','Arrange icons','Desk.arrange()'))+
  it('Help')+it('Recycle Bin')+'<hr>'+fn('⏻','Shut Down...','UI.shutdown()');try{Music.ui();}catch(e){}}
buildMenu();const _ts=window.toggleStart;if(_ts)window.toggleStart=toggleStart=function(e){const sm=$('startmenu');if(sm&&sm.classList.contains('hide'))buildMenu();return _ts.apply(this,arguments);};

// ---------- tray and badges ----------
const tip=(id,t)=>{const e=$(id);if(e){e.dataset.tip=t;e.removeAttribute('title');}};
tip('trc','Coins — from wins and quests. Spend them in the Shop and Forge');tip('trg','Crystals — from achievements, bosses and the Battle Pass. Rare currency');tip('trl','Player level — goes up with match XP');
if(EVN){const v=document.createElement('span');v.id='trv';v.style.cursor='pointer';v.onclick=()=>Desk.run(EVN);$('tray').insertBefore(v,$('tra'));tip('trv',EVENTS.active.curN+' — event currency “'+EVN+'”. Click to open the event');}
const nt=document.createElement('span');nt.id='trn';nt.style.cssText='cursor:pointer;display:none';nt.onclick=()=>UIHub.open('Progress');$('tray').insertBefore(nt,$('tra'));
let last='';function tick(){const n=totalB();const v=$('trv');if(v)v.innerHTML=evCur().replace(/ [^ ]+$/,'');
 nt.style.display=n?'':'none';nt.innerHTML=PX.emo('⭐',16)+'<b style="color:#c00000">'+n+'</b>';nt.dataset.tip='Ready to claim: '+[B.daily()?'daily reward':'',B.bp()?B.bp()+' Battle Pass tier':'',B.ev()?'event crate':'',B.cap()?B.cap()+' Loot Pods':''].filter(Boolean).join(', ')+'. Click to open';
 const sb=$('startbtn');if(sb){const o=sb.querySelector('.bdg');if(o)o.remove();if(n)sb.insertAdjacentHTML('beforeend',bdg(n));}
 const key=[B.daily(),B.bp(),B.ev(),B.cap()].join();if(key!==last){last=key;Desk.render();}}
setInterval(tick,1500);tick();

// ---------- first-open help + “?” button ----------
const HELP={'Game Hub':'Every part of the game, in tabs. A red number badge means a reward is waiting.','Forge':'Play with a ball to earn it XP and mastery levels. Each level gives a point: spend it plus coins to boost damage, health, speed or cooldown. Hit “?” in the window for the tour.','Battle Pass':'Play matches and do quests to earn XP. Every 500 XP unlocks a reward tier; tap it to claim.','Clans':'A clan gives you a shared rating and a tag next to your nickname. Account needed.','Online Tournament':'Scheduled tournaments with real players. Account needed.','Achievements':'Hit the goals, earn crystals. Some give a title for your nickname.','Modes':'Pick a fight mode. Some unlock as you progress through the campaign.','Shop':'Prices are in coins or crystals. Purchases go to your Inventory.','Inventory':'Pick a ball and skin for the fight.','Trade':'Offer one of your balls for another player’s ball.','Campaign — 60 levels':'Click an unlocked level to start. A win unlocks the next one; every 5th is a boss.'};
HELP['Loot Pods']='A pod gives random cosmetics: a trail, a victory pose or a frame under your ball. Looks only. Buy pods with coins or earn them for all 3 daily quests and day 7 of your login streak.';HELP['Collection']='Everything you’ve collected: balls, achievements, titles, patterns, mutations and pod cosmetics.';
if(EVN)HELP[EVN]='Candy drops in fights and from quests (max 20/day from bonus sources). Save it up for the event crate.';
const seen=(()=>{try{return JSON.parse(localStorage.getItem('bf_help_seen'))||{};}catch(e){return {};}})();
const _ow=window.openWin;window.openWin=openWin=function(id,title,html,o){const w=_ow.apply(this,arguments);try{if(w&&innerWidth<600&&!(o&&o.modal)){w.style.left=Math.max(0,(innerWidth-w.offsetWidth)/2)+'px';}const h=HELP[title];if(h&&w){const tb=w.querySelector('.tb>span:last-child');if(tb&&!tb.querySelector('.hq')){const b=document.createElement('button');b.className='tbb hq';b.textContent='?';b.dataset.tip='Help for this window';b.onclick=e=>{e.stopPropagation();UI.msg(title+' — help',h,[['OK','']],'❓');};tb.prepend(b);}
 if(!seen[title]){const wb=w.querySelector('.wb');wb.insertAdjacentHTML('afterbegin',`<div class="help98">${PX.emo('ℹ️',16)}<span><b>Tip</b>${h}</span><button>Got it</button></div>`);wb.querySelector('.help98 button').onclick=e=>{seen[title]=1;localStorage.setItem('bf_help_seen',JSON.stringify(seen));e.target.closest('.help98').remove();};}}}catch(e){}return w;};
// ---------- first-time intro ----------
setTimeout(()=>{if(!localStorage.getItem('bf_hub_seen')){localStorage.setItem('bf_hub_seen','1');UIHub.open('Play');}},2600);
})();
