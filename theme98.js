// ---- theme98: единый слой дизайна Windows 98 (токены, компоненты, анимации, обои, пиксельные значки) ----
(function(){'use strict';
const $=id=>document.getElementById(id);
const u=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const g=(w,h,body)=>u(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>`);
const r=(x,y,w,h,c='#000')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
// глифы кнопок заголовка (как шрифт Marlett)
const GL={
 min:g(8,7,r(0,5,6,2)),
 max:g(9,9,r(0,0,9,2)+r(0,0,1,9)+r(8,0,1,9)+r(0,8,9,1)),
 rest:g(9,9,r(2,0,7,2)+r(2,0,1,3)+r(8,0,1,6)+r(6,5,3,1)+r(0,3,7,2)+r(0,3,1,6)+r(6,3,1,6)+r(0,8,7,1)),
 close:g(8,7,[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]].map(([x,y])=>r(x,y,2,1)+r(6-x,y,2,1)).join('')),
 help:g(6,9,r(1,0,4,1)+r(0,1,2,2)+r(4,1,2,2)+r(3,3,2,1)+r(2,4,2,2)+r(2,7,2,2)),
 up:g(7,4,r(3,0,1,1)+r(2,1,3,1)+r(1,2,5,1)+r(0,3,7,1)),
 dn:g(7,4,r(0,0,7,1)+r(1,1,5,1)+r(2,2,3,1)+r(3,3,1,1)),
 lf:g(4,7,r(0,3,1,1)+r(1,2,1,3)+r(2,1,1,5)+r(3,0,1,7)),
 rt:g(4,7,r(0,0,1,7)+r(1,1,1,5)+r(2,2,1,3)+r(3,3,1,1)),
 chk:g(7,7,r(6,0,1,3)+r(5,1,1,3)+r(4,2,1,3)+r(3,3,1,3)+r(2,2,1,3)+r(1,1,1,3)+r(0,0,1,3)),
 dot:g(4,4,r(1,0,2,4)+r(0,1,4,2)),
 grip:g(12,12,[0,4,8].map(o=>[0,1,2,3,4,5,6,7,8,9,10,11].filter(i=>i>=o).map(i=>'').join('')).join('')+[[10,0],[6,4],[2,8]].map(([x,y])=>[...Array(12-y-x>0?1:0)].join('')).join('')),
 chkr:g(2,2,r(0,0,1,1,'#fff')+r(1,1,1,1,'#fff')+r(1,0,1,1,'#c0c0c0')+r(0,1,1,1,'#c0c0c0')),
};
// diagonal grip lines for resize corner
GL.grip=g(12,12,[0,4,8].map(o=>{let s='';for(let i=0;i<12-o;i++){s+=r(o+i,11-i,1,1,'#fff')+r(o+i+1,11-i,1,1,'#808080')+r(o+i+2,11-i,1,1,'#808080');}return s;}).join(''));
const css=`
:root{--w98-face:#c0c0c0;--w98-hi:#fff;--w98-lt:#dfdfdf;--w98-sh:#808080;--w98-dk:#000;--w98-sel:#000080;--w98-tip:#ffffe1;
 --w98-title:linear-gradient(90deg,#000080,#1084d0);--w98-title-off:linear-gradient(90deg,#808080,#b5b5b5);
 --w98-font:Tahoma,"MS Sans Serif","Microsoft Sans Serif",Verdana,Arial,sans-serif;--w98-fs:12px;--w98-fs-s:11px;
 --w98-raised:inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf;
 --w98-btn:inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf;
 --w98-pressed:inset -1px -1px #fff,inset 1px 1px #000,inset -2px -2px #dfdfdf,inset 2px 2px #808080;
 --w98-sunken:inset -1px -1px #fff,inset 1px 1px #808080,inset -2px -2px #dfdfdf,inset 2px 2px #000;
 --w98-field:inset -1px -1px #fff,inset 1px 1px #808080;}
/* плавнее «ЭЛТ»: лёгкие строки, без виньетки */
body::after{background:repeating-linear-gradient(0deg,rgba(0,0,0,.045) 0 1px,transparent 1px 3px)!important}
body{text-rendering:optimizeSpeed}
/* ОКНО */
.win{border:0!important;padding:3px!important;box-shadow:var(--w98-raised)!important;font-size:var(--w98-fs);background:var(--w98-face)}
.win .tb{height:18px!important;padding:0 2px 0 3px!important;background:var(--w98-title)!important;font:bold 12px/18px var(--w98-font)!important;letter-spacing:0;gap:4px}
.win .tb .tt{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:3px;min-width:0}
.win .tb .tt svg.px{margin-right:0!important;vertical-align:0!important}
.win.inactive .tb{background:var(--w98-title-off)!important;color:#d4d0c8}
.win .tb>span:last-child{display:flex;align-items:center;flex:none}
.tbb{width:16px!important;height:14px!important;margin-left:0!important;border:0!important;box-shadow:var(--w98-btn)!important;font-size:0!important;color:transparent!important;background:#c0c0c0 no-repeat center/auto!important;padding:0!important}
.tbb:active{box-shadow:var(--w98-pressed)!important;background-position:calc(50% + 1px) calc(50% + 1px)!important}
.tbb.g-min{background-image:${GL.min}!important;background-position:4px 8px!important}.tbb.g-min:active{background-position:5px 9px!important}
.tbb.g-max{background-image:${GL.max}!important}.tbb.g-rest{background-image:${GL.rest}!important}.tbb.g-help{background-image:${GL.help}!important}
.tbb.g-close{background-image:${GL.close}!important;margin-left:2px!important}
.tbb.g-min+.tbb{margin-left:0!important}
.win .wb{padding:8px 8px 6px!important;line-height:1.3}
.win .grip{background:${GL.grip} no-repeat right bottom!important}
/* КНОПКИ */
button,.btn{border:0!important;box-shadow:var(--w98-btn)!important;padding:4px 12px;min-height:23px;font-family:var(--w98-font);font-size:var(--w98-fs);background-color:#c0c0c0;line-height:1.15;border-radius:0!important}
button:active:not(:disabled),button.act,#tasks button.act,button.pressed{box-shadow:var(--w98-pressed)!important}
button:active:not(:disabled)>*{position:relative;top:1px;left:1px}
button:focus-visible,button:focus{outline:1px dotted #000!important;outline-offset:-4px!important}
button:disabled{color:#808080!important;text-shadow:1px 1px 0 #fff!important}
button:disabled svg.px{filter:grayscale(1) contrast(.4) brightness(1.3);opacity:.8}
button.default,.btns button.default{box-shadow:inset 0 0 0 1px #000,inset -2px -2px #000,inset 2px 2px #fff,inset -3px -3px #808080,inset 3px 3px #dfdfdf!important}
.tbb:focus{outline:0!important}
button svg.px{vertical-align:-3px}
.btns{gap:6px!important;margin-top:10px!important}
/* ПОЛЯ ВВОДА */
input:not([type=radio]):not([type=checkbox]):not([type=range]),select,textarea{border:0!important;box-shadow:var(--w98-sunken)!important;background:#fff;border-radius:0;font-family:var(--w98-font);padding:3px 5px;outline:0}
input:disabled,select:disabled,textarea:disabled{background:#c0c0c0!important;color:#808080}
select{appearance:none;-webkit-appearance:none;padding-right:20px!important;background:#fff ${GL.dn} no-repeat right 5px center!important;min-height:21px;font-size:var(--w98-fs)}
input[type=checkbox]{appearance:none;-webkit-appearance:none;width:13px!important;height:13px!important;margin:0 4px 0 1px;vertical-align:-2px;background:#fff;box-shadow:var(--w98-sunken)!important;border:0;cursor:pointer}
input[type=checkbox]:checked{background:#fff ${GL.chk} no-repeat center}
input[type=radio]{appearance:none;-webkit-appearance:none;width:12px!important;height:12px!important;margin:0 4px 0 1px;vertical-align:-2px;border-radius:50%;background:#fff;border:0;cursor:pointer;
 box-shadow:inset 1px 1px #808080,inset -1px -1px #fff,inset 2px 2px #000,inset -2px -2px #dfdfdf!important}
input[type=radio]:checked{background:#fff ${GL.dot} no-repeat center}
input[type=checkbox]:disabled,input[type=radio]:disabled{background-color:#c0c0c0}
input[type=range]{accent-color:#000080}
label{cursor:default}
/* ГРУППЫ, ПАНЕЛИ */
fieldset{padding:10px 8px 8px!important;margin:8px 0!important;position:relative}
fieldset{box-shadow:none!important;border:1px solid #808080!important;outline:1px solid #fff;outline-offset:-2px}
legend{padding:0 3px!important;background:#c0c0c0;font-size:var(--w98-fs)}
.inset{border:0!important;box-shadow:var(--w98-sunken)!important;padding:6px 8px!important}
.card{border:0!important;box-shadow:var(--w98-raised)!important;padding:6px 6px 8px!important}
.card .rb{margin:-6px -6px 6px!important;height:4px!important;box-shadow:inset 0 -1px rgba(0,0,0,.25)}
.card.sel{outline:1px dotted #000!important;outline-offset:-5px;background:#c0c0c0!important;box-shadow:var(--w98-sunken)!important}
.card.sel::after{content:"";position:absolute;inset:3px;border:2px solid #000080;pointer-events:none}
.card small{color:#000}
.grid{gap:6px!important}
.stat{color:#202020!important}
.hint{color:#000!important;font-size:var(--w98-fs-s)!important;line-height:1.35}
.grp98{font-size:var(--w98-fs)!important}
/* списки и таблицы */
table.t{box-shadow:var(--w98-sunken);border:2px solid transparent}
table.t th{background:#c0c0c0;box-shadow:var(--w98-btn);font-weight:normal;text-align:left;padding:3px 6px;border:0}
table.t td{border:0!important;border-bottom:1px solid #e4e4e4!important;padding:2px 6px!important}
table.t tr:hover td{background:#000080;color:#fff}
/* ВКЛАДКИ */
.tabs98{padding:0 2px!important}
.tabs98 .tab{border:0!important;box-shadow:inset 1px 1px #fff,inset -1px 0 #000,inset -2px 0 #808080,inset 2px 2px #dfdfdf!important;border-radius:2px 2px 0 0!important;padding:3px 10px 2px!important;font-size:var(--w98-fs)!important;margin-top:3px!important}
.tabs98 .tab.on{margin:0 -2px!important;padding:4px 12px 5px!important;font-weight:normal!important;position:relative;z-index:2;background:#c0c0c0}
.tabs98 .tab.on::after{content:"";position:absolute;left:1px;right:2px;bottom:-1px;height:3px;background:#c0c0c0}
.tabs98 .tab:focus{outline:1px dotted #000;outline-offset:-4px}
.tabpane{border:0!important;box-shadow:var(--w98-raised)!important;padding:10px!important}
/* ПРОГРЕСС */
.prog{border:0!important;box-shadow:var(--w98-field)!important;background:#fff!important;padding:2px!important;height:18px!important}
.prog i{background:repeating-linear-gradient(90deg,#000080 0 8px,transparent 8px 10px)!important}
/* ПОЛОСЫ ПРОКРУТКИ */
*{scrollbar-width:auto}
::-webkit-scrollbar{width:16px;height:16px}
::-webkit-scrollbar-track{background:${GL.chkr}}
::-webkit-scrollbar-thumb{background:#c0c0c0;box-shadow:var(--w98-btn)}
::-webkit-scrollbar-corner{background:#c0c0c0}
::-webkit-scrollbar-button{display:block;background:#c0c0c0 no-repeat center;box-shadow:var(--w98-btn);width:16px;height:16px}
::-webkit-scrollbar-button:active{box-shadow:var(--w98-pressed)}
::-webkit-scrollbar-button:vertical:decrement{background-image:${GL.up}}::-webkit-scrollbar-button:vertical:increment{background-image:${GL.dn}}
::-webkit-scrollbar-button:horizontal:decrement{background-image:${GL.lf}}::-webkit-scrollbar-button:horizontal:increment{background-image:${GL.rt}}
::-webkit-scrollbar-button:vertical:start:increment,::-webkit-scrollbar-button:vertical:end:decrement,::-webkit-scrollbar-button:horizontal:start:increment,::-webkit-scrollbar-button:horizontal:end:decrement{display:none}
/* МЕНЮ */
#startmenu,#ctx,.ctxm,#startmenu .sub{border:0!important;box-shadow:var(--w98-raised)!important;padding:3px!important}
#startmenu{padding:3px 3px 3px 3px!important}
#startmenu .side{width:24px!important;font:bold 17px/1 var(--w98-font)!important;padding:8px 2px!important;letter-spacing:.5px;background:linear-gradient(0deg,#000080,#1084d0)!important}
#startmenu .it,#ctx .it,.ctxm .it{padding:4px 10px 4px 4px!important;gap:6px!important;font-size:var(--w98-fs);min-height:26px}
#startmenu .it:hover,#ctx .it:hover,.ctxm .it:hover{background:#000080!important;color:#fff!important}
#startmenu .it:hover small{color:#fff!important}
#startmenu hr,#ctx hr,.ctxm hr{border:0!important;border-top:1px solid #808080!important;border-bottom:1px solid #fff!important;margin:3px 2px!important}
/* ПАНЕЛЬ ЗАДАЧ */
#taskbar{border-top:0!important;box-shadow:inset 0 1px #dfdfdf,inset 0 2px #fff;padding:4px 2px 2px!important;gap:3px!important}
#startbtn{height:22px!important;min-width:58px!important;flex:none;justify-content:center;padding:0 6px 0 3px!important;font:bold 12px var(--w98-font)!important;gap:2px!important}
#tasks button{height:22px!important;font-size:var(--w98-fs)!important;padding:0 6px!important;display:flex;align-items:center;gap:3px}
#tasks button.act{background:${GL.chkr}!important;font-weight:bold}
#tasks button svg.px{margin-right:0!important}
#tray{border:0!important;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff!important;height:22px!important;gap:8px!important;padding:0 8px 0 6px!important;font-size:var(--w98-fs-s)}
#tray>span{display:inline-flex!important;align-items:center;gap:2px}
#tray svg.px{margin-right:1px!important;vertical-align:0!important}
/* ПОДСКАЗКИ, ТОСТЫ, СООБЩЕНИЯ */
#tip,.tip98,.tooltip,[role=tooltip]{background:var(--w98-tip)!important;color:#000!important;border:1px solid #000!important;border-radius:0!important;box-shadow:none!important;font:var(--w98-fs-s) var(--w98-font)!important;padding:2px 4px!important}
.toast{background:var(--w98-tip)!important;border:1px solid #000!important;box-shadow:1px 1px 0 #000!important;font:var(--w98-fs-s)/1.35 var(--w98-font)!important;padding:5px 8px 6px!important;border-radius:0!important;animation:w98toast .18s steps(3)}
.toast b{margin-bottom:1px}
@keyframes w98toast{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}
.help98{font-size:var(--w98-fs-s)!important;padding:4px 6px!important}
.dlg .ico svg.px{width:32px;height:32px}
.stbar98{margin-top:6px!important}.stbar98>div{border:0!important;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff;padding:2px 5px!important;display:flex;align-items:center;gap:3px}
/* ЗНАЧКИ РАБОЧЕГО СТОЛА */
.icon{width:76px!important;padding:2px!important}
.icon span{font-size:11px!important;line-height:13px;padding:0 2px!important;max-width:74px;word-wrap:break-word}
.icon.sel span{border:1px dotted #ffff7f!important}
#logo{right:110px!important;bottom:26px!important;color:rgba(255,255,255,.16)!important;text-shadow:1px 1px rgba(0,0,0,.12)}
/* эмодзи → пиксели */
.px98e{display:inline-flex;vertical-align:-3px;line-height:0}
.px98e svg.px{width:1.25em;height:1.25em;min-width:14px;min-height:14px;max-width:32px;max-height:32px}
.crate .px98e svg.px,.dlg .ico .px98e svg.px{width:32px;height:32px}
.pdot{display:inline-block;width:10px;height:10px;box-shadow:inset -1px -1px #000,inset 1px 1px #fff;vertical-align:-1px;margin:0 1px}
/* анимация открытия/сворачивания — каркас окна, как в Win98 */
.zoom98{position:fixed;z-index:99990;pointer-events:none;border:2px solid #808080;outline:1px solid #fff;mix-blend-mode:difference}
/* загрузочный экран */
#boot{background:#000!important;font-family:var(--w98-font)!important}
#boot .flag98{display:grid;grid-template-columns:repeat(2,40px);gap:6px;transform:perspective(220px) rotateY(-18deg) skewY(-6deg);margin-bottom:14px;filter:drop-shadow(4px 4px 0 rgba(255,255,255,.08))}
#boot .flag98 i{display:block;height:34px}
#boot .bar{border:0!important;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff!important;background:#000;padding:2px;height:16px!important}
#boot .bar i{background:repeating-linear-gradient(90deg,#000080 0 8px,transparent 8px 10px)!important;width:0!important;animation:w98boot 2s steps(24) forwards!important}
@keyframes w98boot{to{width:100%}}
/* обои */
body.wp-win2k{background:#3a6ea5}
body.wp-plum{background:#5a4a6a}
body.wp-tiles{background:#008080 ${u('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" shape-rendering="crispEdges"><rect width="32" height="32" fill="#008080"/><rect x="0" y="0" width="16" height="16" fill="#007070"/><rect x="16" y="16" width="16" height="16" fill="#007070"/><circle cx="8" cy="8" r="3" fill="#0a8f8f"/><circle cx="24" cy="24" r="3" fill="#0a8f8f"/></svg>')}}
body.wp-weave{background:#808000 ${u('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="8" height="8" fill="#6f6f2a"/><rect x="0" y="0" width="4" height="2" fill="#8a8a3a"/><rect x="4" y="4" width="4" height="2" fill="#8a8a3a"/><rect x="2" y="2" width="2" height="4" fill="#5a5a20"/><rect x="6" y="6" width="2" height="2" fill="#5a5a20"/></svg>')}}
body.wp-setup{background:linear-gradient(180deg,#000080 0%,#000040 70%,#000 100%)}
/* мобильная раскладка */
@media (max-width:600px){.win .wb{padding:6px!important}.icon{width:70px!important}button{padding:4px 8px}#tray{gap:5px!important;padding:0 4px!important}}
@media (prefers-reduced-motion:reduce){.zoom98{display:none}}
`;
const st=document.createElement('style');st.id='theme98';st.textContent=css;document.head.appendChild(st);

// --- кнопки заголовка: классы глифов ---
function glyphs(root){(root||document).querySelectorAll('.tbb:not([data-g])').forEach(b=>{const t=(b.title||'')+'|'+b.textContent.trim();let k='';
 if(/Свер|^\|_$|\|_/.test(t))k='min';else if(/Разв|□|▭/.test(t))k='max';else if(/Закр|✕|×|X$/.test(t))k='close';else if(/Справ|\?/.test(t))k='help';
 if(!k)return;b.dataset.g=k;b.classList.add('g-'+k);if(!b.title)b.title={min:'Свернуть',max:'Развернуть',close:'Закрыть',help:'Справка'}[k];
 if(k==='help'){const n=b.nextElementSibling;if(n)n.style.marginLeft='2px';}});
 document.querySelectorAll('.win').forEach(w=>{const m=w.querySelector('.tbb.g-max,.tbb.g-rest');if(!m)return;const z=w.classList.contains('max')||w.classList.contains('maxed')||w.dataset.max==='1';m.classList.toggle('g-rest',z);m.classList.toggle('g-max',!z);});}

// --- эмодзи в окнах → пиксельные значки ---
const DOT={'🟢':'#00c000','🔴':'#e00000','🔵':'#0040ff','🟡':'#ffd800','🟩':'#00a000','🟦':'#0050c0','🟥':'#c00000','🟨':'#e0c000','⬜':'#ffffff','🟪':'#8000a0','🟧':'#ff8000','🟫':'#804000','⚫':'#000','⚪':'#fff'};
const RX=/(?:\p{Extended_Pictographic}|[\u{1F7E0}-\u{1F7EB}])\uFE0F?(?:\u200D(?:\p{Extended_Pictographic})\uFE0F?)*/gu;
const KEEP=/^[★☆♥♦♣♠♚♛♜♝♞♟♔♕♖♗♘♙▶◀▲▼◘●⊕❄◊≡#☣ϟ✕∞✱⚄¥═Ω↣✿◇§◉☠✔©®™↔↕⬆⬅➡⬇☺♨☁]\uFE0F?$/u;
const SKIP='script,style,textarea,input,select,canvas,svg,#boot,.nopx,#w_chess,#w_mines,.ms,.lcd,code,pre';
function px(e){if(!window.PX)return null;const k=e.replace(/\uFE0F/g,'');if(DOT[k])return `<span class="pdot" style="background:${DOT[k]}"></span>`;
 const n=PX.EMO[e]||PX.EMO[k]||PX.EMO[k+'\uFE0F'];if(!n)return null;return `<span class="px98e" aria-label="${e}">${PX.svg(n,16)}</span>`;}
function sweep(root){if(!window.PX||!root||!root.querySelectorAll)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){if(!n.nodeValue||!RX.test(n.nodeValue)){RX.lastIndex=0;return 2;}RX.lastIndex=0;const p=n.parentElement;if(!p||p.closest(SKIP)||p.isContentEditable)return 2;return 1;}});
 const L=[];while(tw.nextNode())L.push(tw.currentNode);
 L.forEach(n=>{const s=n.nodeValue;let out='',last=0,hit=false;s.replace(RX,(m,i)=>{if(KEEP.test(m))return m;const h=px(m);if(!h)return m;hit=true;out+=esc(s.slice(last,i))+h;last=i+m.length;return m;});
  if(!hit)return;out+=esc(s.slice(last));const t=document.createElement('template');t.innerHTML=out;n.replaceWith(t.content);});}
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let q=new Set(),qr=0;
function flush(){qr=0;const a=[...q];q.clear();a.forEach(n=>{if(n.isConnected){sweep(n);glyphs(n);}});}
const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList'){const t=m.target;if(t.closest&&t.closest('#gamewin .gb'))continue;q.add(t.nodeType===1?t:t.parentElement);}else if(m.type==='characterData'&&m.target.parentElement)q.add(m.target.parentElement);
  else if(m.type==='attributes'){zoomCheck(m.target,m.oldValue);if(m.target.classList&&m.target.classList.contains('win'))q.add(m.target);}}
 if(q.size&&!qr)qr=requestAnimationFrame(flush);});

// --- анимация каркаса окна ---
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function taskRect(w){const ws=[...document.querySelectorAll('.win:not(.hide):not(.mini)')];const bs=[...document.querySelectorAll('#tasks button')];const i=ws.indexOf(w);const b=bs[i]||$('startbtn');return b?b.getBoundingClientRect():{left:0,top:innerHeight-30,width:60,height:22};}
let lastTask=null;
function zoom(a,b){if(reduce||document.hidden)return;const z=document.createElement('div');z.className='zoom98';document.body.appendChild(z);const N=6;let i=0;
 const step=()=>{const t=i/N;z.style.left=(a.left+(b.left-a.left)*t)+'px';z.style.top=(a.top+(b.top-a.top)*t)+'px';z.style.width=Math.max(8,a.width+(b.width-a.width)*t)+'px';z.style.height=Math.max(6,a.height+(b.height-a.height)*t)+'px';
  if(i++<N)setTimeout(step,22);else z.remove();};step();}
function zoomCheck(w,old){if(!w.classList||!w.classList.contains('win')||w.id==='gamewin')return;const was=/\b(hide|mini)\b/.test(old||''),is=w.classList.contains('hide')||w.classList.contains('mini');
 if(was&&!is){const R=w.getBoundingClientRect();if(!R.width)return;const s=lastTask||{left:R.left+R.width/2-20,top:R.top+R.height/2-10,width:40,height:20};lastTask=null;zoom(s,R);}

 if(!is){const R=w.getBoundingClientRect();w.dataset.r98=JSON.stringify({left:R.left,top:R.top,width:R.width,height:R.height});}}
document.addEventListener('mousedown',e=>{const b=e.target.closest&&e.target.closest('#tasks button');if(b)lastTask=b.getBoundingClientRect();},true);
// запоминать рамку перед сворачиванием
if(typeof window.minWin==='function'){const _m=window.minWin;window.minWin=minWin=function(id){const w=$('w_'+id);if(w){const R=w.getBoundingClientRect();_m.apply(this,arguments);if(w.classList.contains('mini')||w.classList.contains('hide'))zoom(R,taskRect(w));return;}return _m.apply(this,arguments);};}

// --- обои: доп. варианты ---
const WPX=[['win2k','Синий (Windows 2000)','#3a6ea5'],['tiles','Узор «Плитка»','#007878'],['weave','Узор «Плетёнка»','#6f6f2a'],['plum','Сливовый','#5a4a6a'],['setup','Установка Windows','linear-gradient(#000080,#000)']];
if(typeof window.applyWp==='function'){const _a=window.applyWp;window.applyWp=applyWp=function(){WPX.forEach(([k])=>document.body.classList.remove('wp-'+k));_a();};applyWp();}
if(typeof Desk!=='undefined'&&Desk.props){const _p=Desk.props.bind(Desk);Desk.props=function(){_p();const w=$('w_props');if(!w)return;const fs=w.querySelector('input[name=wp]');const box=fs&&fs.closest('fieldset');
  if(box&&!box.querySelector('[data-x98]')){WPX.forEach(([k,n])=>{const l=document.createElement('label');l.dataset.x98=1;l.style.cssText='display:block;padding:2px';l.innerHTML=`<input type="radio" name="wp" value="${k}" ${SYS.wp===k?'checked':''}> ${n}`;
   l.querySelector('input').onchange=()=>{SYS.wp=k;applyWp();sysSave();Desk.prev();};box.appendChild(l);});}
  Desk.prev();};
 const _pv=Desk.prev.bind(Desk);Desk.prev=function(){_pv();const p=$('wpprev');const x=WPX.find(a=>a[0]===SYS.wp);if(p&&x)p.style.background=x[2];if(p){p.style.borderRadius='0';p.style.borderColor='#c0c0c0';p.style.boxShadow='inset 1px 1px #000,1px 1px #000,-1px -1px #fff';}};}

// --- загрузочный экран: пиксельный флаг вместо кружков ---
if(typeof Boot!=='undefined'&&Boot.run){const _b=Boot.run.bind(Boot);Boot.run=function(){_b();const b=$('boot');if(!b)return;const f=b.firstElementChild;if(f&&/🔴|🟡|🟢|🔵/u.test(f.textContent)){f.className='flag98';f.style.fontSize='0';f.innerHTML=['#ff2020','#20c020','#2050ff','#ffd000'].map(c=>`<i style="background:${c}"></i>`).join('');}};
 const b=$('boot');if(b){const f=b.firstElementChild;if(f&&/🔴/u.test(f.textContent)){f.className='flag98';f.style.fontSize='0';f.innerHTML=['#ff2020','#20c020','#2050ff','#ffd000'].map(c=>`<i style="background:${c}"></i>`).join('');}}}

// --- значок способности всегда виден поверх скина: тёмная подложка-ореол ---
if(window.LOGO&&LOGO.draw){const _d=LOGO.draw;LOGO.draw=function(g,id,x,y,R,a){if(R>6&&LOGO.has(id)){g.save();if(a!=null)g.globalAlpha*=a;const gr=g.createRadialGradient(x,y,0,x,y,R*.72);gr.addColorStop(0,'rgba(0,0,0,.38)');gr.addColorStop(.7,'rgba(0,0,0,.18)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,R*.72,0,7);g.fill();g.restore();}return _d.apply(this,arguments);};}

function boot(){glyphs();sweep(document.body);mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class'],attributeOldValue:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else setTimeout(boot,0);
window.Theme98={sweep,glyphs,zoom};
})();
