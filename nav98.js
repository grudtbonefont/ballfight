// nav98.js — объединение окон в разделы с вкладками (один раздел = одно окно)
(function(){
const $=id=>document.getElementById(id);
const EV=window.EVENTS&&EVENTS.active?EVENTS.active.name:null;
// [вкладка, ключ приложения, id окна]
const SEC={
 'Играть':[['Кампания','Бой с ботом','levels'],['Режимы','Режимы','modes'],['Выживание','Выживание','surv'],['Турнир','Турнир','tour']],
 'Прогресс':[['Пропуск','Боевой пропуск','bpass'],['Награды','Награды','daily'],['Достижения','Достижения','ach'],['Капсулы','Капсулы 98','caps'],['Коллекция','Коллекция','album'],['Статистика','Статистика','stats']].concat(EV?[[EV,EV,'event']]:[]),
 'Мои шары':[['Мастерская','Мастерская','workshop'],['Магазин','Магазин','shop'],['Ящики','Ящики','crates'],['Инвентарь','Инвентарь','inv'],['Скины','Скины','skined']],
 'Сообщество':[['Онлайн-бой','Онлайн-бой','online'],['Рейтинг','Рейтинг','top'],['Кланы','Кланы','clan'],['Онлайн-турнир','Онлайн-турнир','clan'],['Обмен','Обмен','account'],['Аккаунт','Аккаунт','account']],
 'Настройки':[['Управление','Управление','ctl'],['Экран','Свойства экрана','props'],['Справка','Справка','help']]};
const ICO={'Играть':'⚔️','Прогресс':'⭐','Мои шары':'🎒','Сообщество':'👥','Настройки':'⚙️'};
const W={'Играть':640,'Прогресс':660,'Мои шары':660,'Сообщество':620,'Настройки':560};
const ID2={};for(const s in SEC)SEC[s].forEach(t=>{(ID2[t[2]]=ID2[t[2]]||[]).push([s,t]);});
let lastKey=null;const LS='bf_navlast';
const last=()=>{try{return JSON.parse(localStorage.getItem(LS))||{};}catch(e){return {};}};
const geo={};
const Nav={SEC,
 open(s,k){const L=last();k=k||L[s];const t=SEC[s].find(x=>x[1]===k)||SEC[s][0];Desk.run(t[1]);},
 sec(k){for(const s in SEC)if(SEC[s].some(t=>t[1]===k))return s;return null;}};
window.Nav=Nav;
const _run=Desk.run.bind(Desk);
Desk.run=function(k){if(SEC[k])return Nav.open(k);lastKey=k;try{return _run(k);}finally{setTimeout(()=>{lastKey=null;},0);}};
const bdgN=k=>{try{return k==='Капсулы 98'?QOL.caps():k==='Награды'?(save.daily&&save.daily.last!==today()?1:0):k==='Боевой пропуск'?(()=>{const t=Math.min(30,Math.floor((save.bp?save.bp.xp:0)/500));let n=0;for(let i=1;i<=t;i++)if(!(save.bp.cl||{})[i])n++;return n;})():0;}catch(e){return 0;}};
function strip(w,s,cur){let n=w.querySelector(':scope>.navtabs');if(!n){n=document.createElement('div');n.className='tabs98 navtabs';w.insertBefore(n,w.querySelector('.wb'));}
 n.innerHTML=SEC[s].map(t=>{const b=bdgN(t[1]);return `<div class="tab${t[1]===cur?' on':''}" tabindex="0" data-nk="${t[1]}">${t[0]}${b?' ('+b+')':''}</div>`;}).join('');
 n.querySelectorAll('[data-nk]').forEach(e=>{const go=ev=>{ev.stopPropagation();if(e.classList.contains('on'))return;Desk.run(e.dataset.nk);};e.onclick=go;e.onkeydown=ev=>{if(ev.key==='Enter')go(ev);};});
 const on=n.querySelector('.on');if(on&&on.scrollIntoView&&n.scrollWidth>n.clientWidth)n.scrollLeft=on.offsetLeft-20;}
const _ow=window.openWin;
window.openWin=openWin=function(id,title,html,o){o=o||{};const m=ID2[id];if(!m||o.modal)return _ow.apply(this,arguments);
 // какой раздел/вкладка
 let pick=m.find(x=>x[1][1]===lastKey);const w0=$('w_'+id);
 if(!pick&&w0&&w0.dataset.nk&&!w0.classList.contains('hide'))pick=m.find(x=>x[1][1]===w0.dataset.nk);
 if(!pick)pick=m[0];const s=pick[0],t=pick[1];
 // где стоит открытое окно раздела
 let pos=null;SEC[s].forEach(x=>{const ow=$('w_'+x[2]);if(ow&&ow.id!=='w_'+id&&!ow.classList.contains('hide')&&ow.dataset.nsec===s){pos={l:ow.style.left,t:ow.style.top,max:ow.classList.contains('max')};ow.classList.add('hide');}});
 if(!pos&&geo[s])pos=geo[s];
 const w=_ow.call(this,id,s,html,Object.assign({},o,{w:Math.max(o.w||0,W[s]),icon:ICO[s]}));
 w.dataset.nsec=s;w.dataset.nk=t[1];w.querySelector('.tt').textContent=ICO[s]+' '+s+' — '+t[0];w.dataset.title=s;w.classList.add('navwin');
 if(pos&&!(window.MOB&&MOB.phone)){w.style.left=pos.l;w.style.top=pos.t;w.classList.toggle('max',!!pos.max);}
 geo[s]={l:w.style.left,t:w.style.top,max:w.classList.contains('max')};
 strip(w,s,t[1]);const L=last();L[s]=t[1];localStorage.setItem(LS,JSON.stringify(L));
 if(typeof updTasks==='function')updTasks();return w;};
// запоминаем перетаскивание
addEventListener('mouseup',()=>{document.querySelectorAll('.navwin:not(.hide)').forEach(w=>{geo[w.dataset.nsec]={l:w.style.left,t:w.style.top,max:w.classList.contains('max')};});});
const css=document.createElement('style');css.textContent=`
.navtabs{display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;margin:4px 4px 0;padding:2px 2px 0!important;border-bottom:1px solid #fff;box-shadow:0 1px 0 #808080;scrollbar-width:thin;flex:none}
.navtabs .tab{white-space:nowrap;cursor:pointer;flex:none;user-select:none}
.navwin>.wb{max-height:calc(100vh - 110px);overflow:auto}
.navwin.max>.wb{max-height:none}
body.phone .navtabs .tab{padding:8px 12px 7px!important;font-size:14px!important}
body.phone .navtabs{margin:2px 0 0}
body.phone .navwin>.wb{max-height:calc(100vh - 120px)}
`;document.head.appendChild(css);
})();
