'use strict';
// ===== ui98.js — понятный интерфейс: Центр игры, группы меню Пуск, папки, подсказки, значки «готово», справка окон =====
(function(){
const $=id=>document.getElementById(id);const ico=(k,s)=>{try{if(PX.BYK[k])return PX.ico(k,s);const a=APPS.find(x=>x.k===k);if(a&&/<svg/.test(a.ico))return a.ico.replace(/<svg /,`<svg width="${s}" height="${s}" `);return PX.emo(a?a.ico:'',s);}catch(e){return '';}};
PX.BYK['Центр игры']='game';PX.BYK['Мини-игры']='folder';PX.BYK['Программы']='folder';
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

// ---------- описания ----------
const D={'Центр игры':'Главное меню: играть, прогресс, друзья и программы в одном окне','Бой с ботом':'Кампания из 60 уровней, каждый 5-й — босс','Вдвоём':'Два игрока за одной клавиатурой','Онлайн-бой':'Бой с живым соперником по коду комнаты','Выживание':'Волны ботов — продержитесь как можно дольше','Турнир':'Сетка боёв с ботами','Режимы':'FFA, 2×2/3×3, Царь горы, футбол, выживание, рейд, испытание дня',
'Мастерская':'Улучшения шаров и мастерство','Боевой пропуск':'30 уровней наград за XP из матчей и заданий','Достижения':'Достижения дают кристаллы и титулы','Статистика':'Ваши матчи, победы и урон','Награды':'Ежедневная награда за вход подряд','Ящики':'Открыть ящики с шарами и картами','Магазин':'Купить ящики, шары и скины за монеты/кристаллы','Инвентарь':'Ваши шары, скины и выбор шара для боя','Скины':'Редактор собственных скинов',
'Кланы':'Вступите в клан или создайте свой (нужен аккаунт)','Онлайн-турнир':'Турниры с живыми игроками (нужен аккаунт)','Рейтинг':'Таблица лидеров ELO','Обмен':'Обмен шарами с другими игроками','Аська':'Чат с игроками онлайн','Аккаунт':'Вход и облачное сохранение','Internet Explorer':'Фан-сайты, форум и гостевая книга',
'Хэллоуин':'Ивент: собирайте конфеты, выполняйте задания, открывайте ивентовый ящик','Новый год':'Ивент: собирайте снежинки и открывайте ивентовый ящик','Справка':'Управление и правила игры','Мини-игры':'Сапёр, Шахматы, Косынка, Пинбол, Змейка, Блоки…','Программы':'Блокнот, Paint, Калькулятор, Командная строка и др.','Мой компьютер':'Диски, файлы и сведения о системе','Корзина':'Удалённые значки — можно восстановить','Повтор матча':'Просмотр записи последнего боя','Скрепыш':'Помощник: подсказки и советы'};
const EVN=window.EVENTS&&EVENTS.active?EVENTS.active.name:null;
const has=k=>APPS.some(a=>a.k===k);
const GRP=[['Игра',['Бой с ботом','Режимы','Онлайн-бой','Вдвоём','Выживание','Турнир']],
 ['Прогресс',['Мастерская','Боевой пропуск','Достижения','Награды','Статистика','Ящики','Магазин','Инвентарь','Скины',EVN]],
 ['Социальное',['Аккаунт','Кланы','Онлайн-турнир','Рейтинг','Обмен','Аська','Internet Explorer']]];
const GAMES=APPS.filter(a=>a.cat==='game'||a.k==='Сапёр'||a.k==='Шахматы').map(a=>a.k);
const PROGS=['Блокнот','Paint','Калькулятор','Проигрыватель','Командная строка','Мой компьютер','Свойства экрана','Повтор матча','Скрепыш'].filter(has);

// ---------- «готово к получению» ----------
const today_=()=>{try{return today();}catch(e){return new Date().toDateString();}};
const B={daily:()=>save.daily&&save.daily.last!==today_()?1:0,
 bp:()=>{try{const t=Math.min(30,Math.floor((save.bp?save.bp.xp:0)/500));let n=0;for(let i=1;i<=t;i++)if(!(save.bp.cl||{})[i])n++;return n;}catch(e){return 0;}},
 ev:()=>{try{const E=EVENTS.active;const s=save.ev&&save.ev[E.id];return s&&s.c>=E.price?1:0;}catch(e){return 0;}}};
const badgeOf=k=>k==='Награды'?B.daily():k==='Боевой пропуск'?B.bp():k===EVN?B.ev():0;
const totalB=()=>B.daily()+B.bp()+B.ev();
const bdg=n=>n?`<span class="bdg" title="Готово к получению">${n>9?'9+':n}</span>`:'';
const LOCK={'Рейд на босса':6};

// ---------- Центр игры ----------
let tab=localStorage.getItem('bf_hubtab')||'Игра';
const card=k=>{if(!k||!has(k))return '';const lock=k==='Онлайн-турнир'||k==='Кланы'?0:0;return `<button class="hubbtn" data-run="${k}" data-hint="${(D[k]||k).replace(/"/g,'')}">${ico(k,24)}<span><b>${k}</b><small>${D[k]||''}</small></span>${bdg(badgeOf(k))}</button>`;};
const UIHub={open(t){if(t)tab=t;localStorage.setItem('bf_hubtab',tab);const tabs=[...GRP.map(g=>g[0]),'Программы'];
 const g=GRP.find(x=>x[0]===tab);let body='';
 if(tab==='Игра'){const lv=(save.unlocked|0);body=`<button class="hubplay" data-run="Бой с ботом" data-hint="Продолжить кампанию с текущего уровня">${ico('Бой с ботом',32)} ИГРАТЬ<span style="font-size:12px;font-weight:normal">&nbsp;(уровень ${Math.min(60,lv+1)} из 60)</span></button>
  <div class="hubgrid">${g[1].slice(1).map(card).join('')}</div>
  <div class="grp98" style="margin-top:10px">Режимы и что открывается</div><div style="font-size:11px">Каждый 5-й уровень кампании — <b>БОСС</b>. ${lv>=6?'Рейд на босса открыт в «Режимах».':'<span class="lockt">Рейд на босса — откроется на ур. 6 кампании.</span>'} Испытание дня обновляется каждые сутки.</div>`;}
 else if(tab==='Программы')body=`<div class="grp98">Мини-игры</div><div class="hubgrid">${GAMES.map(k=>card(k)).join('')}</div><div class="grp98" style="margin-top:10px">Стандартные</div><div class="hubgrid">${PROGS.map(card).join('')}</div>`;
 else body=`<div class="hubgrid">${g[1].map(card).join('')}</div>${tab==='Социальное'&&!(window.Cloud&&Cloud.auth)?'<div class="help98" style="margin-top:8px">'+PX.emo('ℹ️',16)+'<span>Для кланов, онлайн-турниров, рейтинга и обмена войдите в <b>Аккаунт</b> — прогресс сохранится в облаке.</span></div>':''}`;
 const tb=tabs.map(t=>{const n=t==='Прогресс'?totalB():0;return `<div class="tab${t===tab?' on':''}" data-tab="${t}" style="position:relative">${t}${n?' ('+n+')':''}</div>`;}).join('');
 const cur=`${PX.ico?PX.emo('🪙',14):''} ${save.coins} монет · ${PX.emo('💎',14)} ${save.gems} крист.${EVN?' · '+evCur():''}`;
 openWin('hub','Центр игры',`<div class="tabs98">${tb}</div><div class="tabpane">${body}</div><div class="stbar98"><div id="hubst">Наведите на кнопку — здесь появится описание.</div><div>${cur}</div></div>`,{w:600,icon:'🎮'});
 const w=$('w_hub');w.querySelectorAll('[data-tab]').forEach(e=>e.onclick=()=>{Sfx.click();UIHub.open(e.dataset.tab);});
 w.querySelectorAll('[data-run]').forEach(e=>{e.onclick=()=>{if(e.dataset.run!=='Бой с ботом'||!e.classList.contains('hubplay'))return Desk.run(e.dataset.run);Desk.run('Бой с ботом');};e.onmouseenter=()=>{const s=$('hubst');if(s)s.textContent=e.dataset.hint;};});}};
const CANDY=s=>`<svg class="px" width="${s}" height="${s}" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#000" d="M5 5h6v6H5z"/><path fill="#ff7518" d="M6 6h4v4H6z"/><path fill="#fff" d="M6 6h2v1H6z"/><path fill="#c04000" d="M1 4h2v1h1v1h1v4H4v1H3v1H1v-2h1V6H1zM15 4h-2v1h-1v1h-1v4h1v1h1v1h2v-2h-1V6h1z"/></svg>`;
const evCur=()=>{try{const E=EVENTS.active;return (E.id==='halloween'?CANDY(14):PX.emo(E.cur,14))+' '+((save.ev&&save.ev[E.id]||{}).c|0)+' '+E.curN.toLowerCase();}catch(e){return '';}};
window.UIHub=UIHub;

// ---------- папки ----------
const folder=(name,list)=>{openWin('fold_'+(name==='Мини-игры'?'g':'p'),name,`<div class="fold98">${list.map(k=>`<div class="fi" tabindex="0" data-run="${k}" title="${D[k]||k}">${ico(k,32)}<span>${k}</span></div>`).join('')}</div><div class="stbar98"><div>Объектов: ${list.length}</div><div>Двойной щелчок — открыть</div></div>`,{w:440,icon:'📁'});
 document.querySelectorAll('#w_fold_g .fi,#w_fold_p .fi').forEach(e=>{e.ondblclick=()=>Desk.run(e.dataset.run);e.onkeydown=ev=>{if(ev.key==='Enter')Desk.run(e.dataset.run);};if(matchMedia('(pointer:coarse)').matches)e.onclick=e.ondblclick;});};
window.Folder98={games:()=>folder('Мини-игры',GAMES),progs:()=>folder('Программы',PROGS)};

// ---------- рабочий стол: меньше значков, по группам ----------
APPS.unshift({k:'Центр игры',ico:PX.ico('Центр игры'),run:'UIHub.open()'});
const binI=APPS.findIndex(a=>a.fixed);APPS.splice(binI,0,{k:'Мини-игры',ico:PX.ico('Мини-игры'),run:'Folder98.games()'},{k:'Программы',ico:PX.ico('Программы'),run:'Folder98.progs()'});
const DESK=['Центр игры','Бой с ботом','Режимы','Онлайн-бой','Мастерская','Боевой пропуск','Магазин','Инвентарь','Достижения','Награды',EVN,'Кланы','Аська','Internet Explorer','Аккаунт','Справка','Мой компьютер','Мини-игры','Программы','Корзина'].filter(k=>k&&has(k));
APPS.forEach(a=>{if(!DESK.includes(a.k))a.nodesk=1;});
APPS.sort((a,b)=>{const x=DESK.indexOf(a.k),y=DESK.indexOf(b.k);return (x<0?999:x)-(y<0?999:y);});
const _rd=Desk.render.bind(Desk);Desk.render=function(){_rd();document.querySelectorAll('#icons .icon').forEach(i=>{const k=i.dataset.k;i.dataset.tip=k+(D[k]?' — '+D[k]:'')+'. Двойной щелчок — открыть.';i.removeAttribute('title');const n=badgeOf(k);if(n)i.insertAdjacentHTML('beforeend',bdg(n));});};
if(localStorage.getItem('bf_ui2')!=='1'){localStorage.setItem('bf_ui2','1');Desk.arrange();}else Desk.render();

// ---------- меню Пуск по группам ----------
const it=(k,label)=>has(k)?`<div class="it" onclick="event.stopPropagation();toggleStart();Sfx.click();Desk.run('${k}')" data-tip="${D[k]||''}"><span style="display:inline-flex;width:24px;justify-content:center">${ico(k,20)}</span>${label||k}${bdg(badgeOf(k))}</div>`:'';
const fn=(ic,t,run,id)=>`<div class="it"${id?' id="'+id+'"':''} onclick="event.stopPropagation();toggleStart();Sfx.click();${run}"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo(ic,20)}</span>${t}</div>`;
const sub=(ic,t,inner,n)=>`<div class="it"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo(ic,20)}</span>${t}${bdg(n||0)}<span class="arr">▸</span><div class="sub">${inner}</div></div>`;
function buildMenu(){const mus=$('smmus');const mt=mus?mus.textContent:'Музыка: вкл';
 $('smitems').innerHTML=`<div class="it" style="font-weight:bold" onclick="event.stopPropagation();toggleStart();Sfx.click();UIHub.open('Игра')"><span style="display:inline-flex;width:24px;justify-content:center">${ico('Центр игры',20)}</span>Центр игры</div><hr>`+
  sub('🎮','Игра',GRP[0][1].map(k=>it(k)).join(''))+sub('⭐','Прогресс',GRP[1][1].map(k=>it(k)).join(''),totalB())+sub('👥','Социальное',GRP[2][1].map(k=>it(k)).join(''))+
  sub('📁','Программы',sub('🎲','Мини-игры',GAMES.map(k=>it(k)).join(''))+sub('🗂️','Стандартные',PROGS.map(k=>it(k)).join('')))+
  sub('⚙️','Настройки',fn('🖥️','Свойства экрана','Desk.props()')+`<div class="it" id="smmus" onclick="event.stopPropagation();toggleStart();Music.toggle()"><span style="display:inline-flex;width:24px;justify-content:center">${PX.emo('🎵',20)}</span>${mt}</div>`+fn('🗂️','Упорядочить значки','Desk.arrange()'))+
  it('Справка')+it('Корзина')+'<hr>'+fn('⏻','Выключить компьютер...','UI.shutdown()');try{Music.ui();}catch(e){}}
buildMenu();const _ts=window.toggleStart;if(_ts)window.toggleStart=toggleStart=function(e){const sm=$('startmenu');if(sm&&sm.classList.contains('hide'))buildMenu();return _ts.apply(this,arguments);};

// ---------- трей и значки ----------
const tip=(id,t)=>{const e=$(id);if(e){e.dataset.tip=t;e.removeAttribute('title');}};
tip('trc','Монеты — за победы и задания. Тратятся в Магазине и Мастерской');tip('trg','Кристаллы — за достижения, боссов и Боевой пропуск. Редкая валюта');tip('trl','Уровень игрока — растёт с опытом из матчей');
if(EVN){const v=document.createElement('span');v.id='trv';v.style.cursor='pointer';v.onclick=()=>Desk.run(EVN);$('tray').insertBefore(v,$('tra'));tip('trv',EVENTS.active.curN+' — ивентовая валюта «'+EVN+'». Щёлкните, чтобы открыть ивент');}
const nt=document.createElement('span');nt.id='trn';nt.style.cssText='cursor:pointer;display:none';nt.onclick=()=>UIHub.open('Прогресс');$('tray').insertBefore(nt,$('tra'));
let last='';function tick(){const n=totalB();const v=$('trv');if(v)v.innerHTML=evCur().replace(/ [^ ]+$/,'');
 nt.style.display=n?'':'none';nt.innerHTML=PX.emo('⭐',16)+'<b style="color:#c00000">'+n+'</b>';nt.dataset.tip='Готово к получению: '+[B.daily()?'ежедневная награда':'',B.bp()?B.bp()+' ур. Боевого пропуска':'',B.ev()?'ивентовый ящик':''].filter(Boolean).join(', ')+'. Щёлкните, чтобы открыть';
 const sb=$('startbtn');if(sb){const o=sb.querySelector('.bdg');if(o)o.remove();if(n)sb.insertAdjacentHTML('beforeend',bdg(n));}
 const key=[B.daily(),B.bp(),B.ev()].join();if(key!==last){last=key;Desk.render();}}
setInterval(tick,1500);tick();

// ---------- справка при первом открытии + кнопка «?» ----------
const HELP={'Центр игры':'Все разделы игры по вкладкам. Красный значок с цифрой — есть награда, которую можно забрать.','Мастерская':'Играйте мячом — он получает опыт и уровни мастерства. Каждый уровень даёт очко: потратьте его и монеты на улучшение урона, здоровья, скорости или перезарядки. Нажмите «?» в окне, чтобы пройти обучение.','Боевой пропуск':'Играйте матчи и выполняйте задания — получайте XP. Каждые 500 XP открывается уровень награды; нажмите на него, чтобы забрать.','Кланы':'Клан даёт общий рейтинг и тег у ника. Нужен вход в аккаунт.','Онлайн-турнир':'Турниры с реальными игроками по расписанию. Нужен вход в аккаунт.','Достижения':'Выполняйте условия — получайте кристаллы. Некоторые дают титул для ника.','Режимы':'Выберите режим боя. Некоторые открываются по мере прохождения кампании.','Магазин':'Цены указаны в монетах или кристаллах. Купленное попадает в Инвентарь.','Инвентарь':'Выберите шар и скин для боя.','Обмен':'Предложите свой шар в обмен на шар другого игрока.','Кампания — 60 уровней':'Щёлкните открытый уровень, чтобы начать. Победа открывает следующий, каждый 5-й — босс.'};
if(EVN)HELP[EVN]='Конфеты выпадают в боях и за задания (не более 20 в день из доп. источников). Копите их на ивентовый ящик.';
const seen=(()=>{try{return JSON.parse(localStorage.getItem('bf_help_seen'))||{};}catch(e){return {};}})();
const _ow=window.openWin;window.openWin=openWin=function(id,title,html,o){const w=_ow.apply(this,arguments);try{if(w&&innerWidth<600&&!(o&&o.modal)){w.style.left=Math.max(0,(innerWidth-w.offsetWidth)/2)+'px';}const h=HELP[title];if(h&&w){const tb=w.querySelector('.tb>span:last-child');if(tb&&!tb.querySelector('.hq')){const b=document.createElement('button');b.className='tbb hq';b.textContent='?';b.dataset.tip='Справка по этому окну';b.onclick=e=>{e.stopPropagation();UI.msg(title+' — справка',h,[['OK','']],'❓');};tb.prepend(b);}
 if(!seen[title]){const wb=w.querySelector('.wb');wb.insertAdjacentHTML('afterbegin',`<div class="help98">${PX.emo('ℹ️',16)}<span><b>Подсказка</b>${h}</span><button>Понятно</button></div>`);wb.querySelector('.help98 button').onclick=e=>{seen[title]=1;localStorage.setItem('bf_help_seen',JSON.stringify(seen));e.target.closest('.help98').remove();};}}}catch(e){}return w;};
// ---------- первое знакомство ----------
setTimeout(()=>{if(!localStorage.getItem('bf_hub_seen')){localStorage.setItem('bf_hub_seen','1');UIHub.open('Игра');}},2600);
})();
