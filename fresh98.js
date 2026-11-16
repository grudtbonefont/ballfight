// ===== fresh98.js — "Ball Brawl 98" refresh: crisp pixel font, cleaner spacing, fresher palette + wallpaper. Still 100% Windows 98. =====
(function(){
const u=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const DITHER=u('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" shape-rendering="crispEdges"><rect x="0" y="0" width="1" height="1" fill="rgba(255,255,255,.035)"/><rect x="2" y="2" width="1" height="1" fill="rgba(255,255,255,.035)"/><rect x="2" y="0" width="1" height="1" fill="rgba(0,0,0,.05)"/><rect x="0" y="2" width="1" height="1" fill="rgba(0,0,0,.05)"/></svg>');
const css=`
@font-face{font-family:"BB Sans";src:url(fonts/ms_sans_serif.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"BB Sans";src:url(fonts/ms_sans_serif_bold.woff2) format("woff2");font-weight:700;font-display:swap}
:root{--w98-font:"BB Sans",Tahoma,"MS Sans Serif",Verdana,Arial,sans-serif;--w98-fs:11px;--w98-fs-s:11px;
 --w98-title:linear-gradient(90deg,#0a1a8a 0%,#1d4fc4 55%,#3c8fe6 100%);--w98-title-off:linear-gradient(90deg,#7b7b7b,#b9b9b9);
 --bb-accent:#ffb21e;--bb-sel:#0a2aa8}
body{-webkit-font-smoothing:none;font-smooth:never}
body,button,input,select,textarea,.win{font-family:var(--w98-font)}
/* windows: slightly roomier, crisp drop shadow */
.win{filter:drop-shadow(2px 2px 0 rgba(0,0,0,.28))}
.win .tb{height:20px!important;font:bold 11px/20px var(--w98-font)!important;padding:0 3px 0 4px!important;text-shadow:none}
.win .tb .tt{gap:5px}
.win .wb{padding:10px 10px 8px!important;line-height:1.4}
/* buttons: subtle hover light-up (keeps the bevel) */
button:not(:disabled):not(.tbb):hover{background-color:#cbcbcb}
button.hubplay{background:linear-gradient(180deg,#d6d6d6,#c0c0c0)!important;font:bold 22px/1 var(--w98-font)!important;letter-spacing:1px;height:62px!important;position:relative}
button.hubplay::before{content:"";position:absolute;left:4px;right:4px;top:4px;height:3px;background:linear-gradient(90deg,var(--bb-accent),#ff6a1e)}
button.hubplay:hover{background:linear-gradient(180deg,#e2e2e2,#cbcbcb)!important}
.hubbtn{font-size:11px!important;padding:7px 8px!important;gap:8px!important}
.hubbtn b{font-size:11px}
.hubgrid{gap:8px!important}
/* tabs: active tab gets a thin accent strip on top */
.tabs98 .tab{padding:4px 11px 3px!important}
.tabs98 .tab.on{box-shadow:inset 0 2px var(--bb-accent),inset 1px 1px #fff,inset -1px 0 #000,inset -2px 0 #808080!important}
.tabpane{padding:12px!important}
/* menus + selection colour */
#startmenu .it:hover,#ctx .it:hover,.ctxm .it:hover,table.t tr:hover td{background:var(--bb-sel)!important}
#startmenu .side{background:linear-gradient(0deg,#0a1a8a,#3c8fe6)!important;font:bold 16px/1 var(--w98-font)!important;letter-spacing:2px}
#startmenu .it,#ctx .it,.ctxm .it{min-height:28px}
/* taskbar */
#taskbar{height:32px!important}
#desk{bottom:32px!important}
#startbtn{height:24px!important;font:bold 11px var(--w98-font)!important;padding:0 8px 0 4px!important}
#tasks button{height:24px!important;font-size:11px!important;max-width:170px}
#tray{height:24px!important;font-size:11px!important}
/* desktop icons: crisp label with a pixel shadow */
.icon span{font-size:11px!important;line-height:13px!important;color:#fff;text-shadow:1px 1px 0 rgba(0,0,0,.55)}
.icon.sel span{background:var(--bb-sel)!important;text-shadow:none}
/* fresh default wallpaper */
body.wp-fresh{background:${DITHER},radial-gradient(ellipse at 62% 38%,#1fb0a8 0%,#0c8a8f 38%,#06606e 78%,#043f4d 100%) fixed!important;background-color:#0c8a8f!important}
#logo{font:bold 46px/1 var(--w98-font)!important;letter-spacing:4px;color:rgba(255,255,255,.14)!important;text-shadow:3px 3px 0 rgba(0,0,0,.12)!important}
#logo span{font:bold 14px/1.6 var(--w98-font)!important;letter-spacing:6px;text-transform:uppercase}
/* notices: brief, fade out, never block clicks */
#toasts{pointer-events:none}
.toast{animation:bbToastIn .14s steps(3),bbToastOut .5s ease-in 3s forwards!important;font:11px/1.4 var(--w98-font)!important;box-shadow:2px 2px 0 rgba(0,0,0,.35)!important;max-width:260px}
@keyframes bbToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes bbToastOut{to{opacity:0;transform:translateY(4px)}}
body.bb-ingame #clip,body.bb-ingame #tip,body.bb-ingame .tip98{display:none!important}
body.ingame #toasts,body.bb-ingame #toasts{bottom:auto!important;top:8px;right:8px;transform:scale(.9);transform-origin:top right}
/* progress bars: chunky blue blocks */
.prog i{background:repeating-linear-gradient(90deg,#0a2aa8 0 9px,transparent 9px 11px)!important}
/* phones: pixel font gets blurry when scaled — use a clean sans at a readable size */
body.phone{--w98-font:Tahoma,"Segoe UI",Roboto,Verdana,Arial,sans-serif;--w98-fs:13px;--w98-fs-s:12px;-webkit-font-smoothing:auto}
body.phone .win .tb{font-size:13px!important;height:26px!important;line-height:26px!important}
body.phone .hubbtn,body.phone .hubbtn b{font-size:13px!important}
body.phone .icon span{font-size:12px!important}
body.phone #logo{font-size:30px!important}
`;
const st=document.createElement('style');st.id='fresh98';st.textContent=css;document.head.appendChild(st);
// one-time switch to the new default wallpaper (players can still pick any other one in Display Properties)
try{if(typeof SYS!=='undefined'&&!localStorage.getItem('bf_look2')){localStorage.setItem('bf_look2','1');if(!SYS.wp||SYS.wp==='teal'){SYS.wp='fresh';if(typeof sysSave==='function')sysSave();}}
 if(typeof applyWp==='function'){const _a=applyWp;window.applyWp=applyWp=function(){document.body.classList.remove('wp-fresh');_a();};applyWp();}}catch(e){}
// wallpaper option in Display Properties
if(typeof Desk!=='undefined'&&Desk.props){const _p=Desk.props;Desk.props=function(){_p.apply(this,arguments);const w=document.getElementById('w_props');if(!w)return;const fs=w.querySelector('input[name=wp]');const box=fs&&fs.closest('fieldset');
 if(box&&!box.querySelector('[data-fresh]')){const l=document.createElement('label');l.dataset.fresh=1;l.style.cssText='display:block;padding:2px';l.innerHTML=`<input type="radio" name="wp" value="fresh" ${SYS.wp==='fresh'?'checked':''}> Ball Brawl (default)`;
  l.querySelector('input').onchange=()=>{SYS.wp='fresh';applyWp();if(typeof sysSave==='function')sysSave();Desk.prev&&Desk.prev();};box.insertBefore(l,box.querySelector('label'));}
 const p=document.getElementById('wpprev');if(p&&SYS.wp==='fresh')p.style.background='radial-gradient(ellipse at 62% 38%,#1fb0a8,#06606e)';};}
// when a match starts, tuck other windows into the taskbar so nothing covers the arena; hide Clippo + stray tooltips mid-fight
let wasIn=false;setInterval(()=>{const gw=document.getElementById('gamewin');const ing=typeof mode!=='undefined'&&mode==='game'&&typeof G!=='undefined'&&!!G&&!!gw&&!gw.classList.contains('hide')&&!gw.classList.contains('mini');
 document.body.classList.toggle('bb-ingame',ing);
 if(ing&&!wasIn){let n=0;document.querySelectorAll('.win[id^="w_"]:not(.hide):not(.mini)').forEach(w=>{w.classList.add('mini');n++;});if(n&&typeof updTasks==='function')updTasks();}
 wasIn=ing;},300);
})();
