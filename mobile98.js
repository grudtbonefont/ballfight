// ---- Мобильный режим: выбор устройства при каждом запуске, сенсорное управление ----
(function(){
const $=id=>document.getElementById(id);
const auto=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
const MOB=window.MOB={phone:false,chosen:false,auto,tc:[{x:0,y:0,a:false},{x:0,y:0,a:false}]};
// пиксельный 3D-телефон (своя SVG, 16x16 с тенью)
function phoneSvg(s){const P=['....kkkkkkkk....','...kGGGGGGGGk...','...kGddddddGk...','...kGdbbbbbdGk..','...kGdbccbbdGk..','...kGdbbcbbdGk..','...kGdbbbbbdGk..','...kGdbbbbbdGk..','...kGdbbbbbdGk..','...kGddddddGkk..','...kGGGkkGGGkk..','...kGGkwwkGGkk..','...kGGGkkGGGkk..','...kkkkkkkkkkk..','....kkkkkkkkkk..','................'];
 const C={k:'#000',G:'#9aa4b8',d:'#40485a',b:'#1a6fd8',c:'#9fe0ff',w:'#fff'};let r='';P.forEach((row,y)=>[...row].forEach((ch,x)=>{if(C[ch]){let c=C[ch];if(ch==='G'&&x<=4)c='#dfe6f5';if(ch==='b'&&(x+y)%5===0)c='#3c8cf0';r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;}}));
 return `<svg class="px" width="${s}" height="${s}" viewBox="0 0 16 16" shape-rendering="crispEdges">${r}</svg>`;}
const pcIco=s=>{try{return PX.svg('pc',s);}catch(e){return '🖥️';}};
const css=document.createElement('style');css.textContent=`
#devpick{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35)}
#devpick .dw{background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080,inset 1px 1px #dfdfdf;width:min(440px,94vw);font:13px Tahoma,Verdana,sans-serif}
#devpick .dt{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:bold;padding:4px 6px}
#devpick .db{padding:14px;text-align:center}#devpick .bb{display:flex;gap:12px;justify-content:center;margin-top:12px}
#devpick button{flex:1;min-height:130px;font:bold 16px Tahoma,Verdana,sans-serif;background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;touch-action:manipulation}
#devpick button.auto{outline:2px dotted #000;outline-offset:-7px;background:#d4d0c8}#devpick button:active{border-color:#000 #fff #fff #000}
#devpick svg{width:64px;height:64px}#devpick .hint{font-size:11px;color:#333;margin-top:10px}
body.phone{overscroll-behavior:none;touch-action:manipulation;-webkit-text-size-adjust:100%;-webkit-user-select:none;user-select:none}
html:has(body.phone){overscroll-behavior:none}
body.phone input,body.phone textarea,body.phone select{font-size:16px!important;-webkit-user-select:text;user-select:text}
body.phone #taskbar{height:44px!important}body.phone #startbtn{height:36px!important;font-size:15px!important}
body.phone #tasks button{height:34px!important}
body.phone .tbb{width:30px!important;height:26px!important;background-size:14px!important}
body.phone .win .tb{min-height:30px;touch-action:none}
body.phone .win{max-width:100vw}body.phone .win:not(#gamewin) .wb{max-height:calc(100dvh - 90px);overflow:auto;-webkit-overflow-scrolling:touch}
body.phone .ctxm .ci,body.phone #startmenu .it,body.phone .sub .it{min-height:36px;display:flex;align-items:center}
body.phone canvas{touch-action:none}
body.phone #gamewin:not(.hide){left:0!important;top:0!important;width:100vw!important;height:calc(100dvh - 44px)!important}
body.phone #gamewin .gb{height:calc(100% - 22px)!important}
#tc{position:fixed;inset:0 0 44px 0;z-index:4999;pointer-events:none;display:none}
body.phone.ingame #tc{display:block}
#tc .joy{position:absolute;width:140px;height:140px;border-radius:50%;background:rgba(192,192,192,.28);border:3px solid rgba(255,255,255,.55);box-shadow:inset -3px -3px rgba(0,0,0,.35);pointer-events:auto;touch-action:none}
#tc .joy i{position:absolute;left:43px;top:43px;width:54px;height:54px;background:rgba(192,192,192,.75);border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -2px -2px #808080}
#tc .ab,#tc .pz{position:absolute;pointer-events:auto;touch-action:none;background:rgba(192,192,192,.6);border:3px solid;border-color:rgba(255,255,255,.9) rgba(0,0,0,.8) rgba(0,0,0,.8) rgba(255,255,255,.9);font:bold 15px Tahoma,Verdana,sans-serif;color:#000;display:flex;align-items:center;justify-content:center}
#tc .ab{width:96px;height:96px;border-radius:50%}#tc .ab.on{border-color:rgba(0,0,0,.8) rgba(255,255,255,.9) rgba(255,255,255,.9) rgba(0,0,0,.8);background:rgba(255,230,120,.7)}
#tc .pz{width:46px;height:36px;top:30px;right:8px}
#rotate{position:fixed;top:30px;left:50%;transform:translateX(-50%);z-index:5001;background:#ffffe1;border:1px solid #000;padding:4px 8px;font:12px Tahoma,Verdana,sans-serif;display:none}
body.phone.ingame.portrait #rotate{display:block}
body.phone .icon{width:84px!important}
body.phone.ingame .win:not(#gamewin),body.phone.ingame .toast{display:none!important}
body.phone #vscare.vs-rush .vsst,body.phone #vscare.vs-dark{animation-duration:.3s!important}`;
document.head.appendChild(css);

function choose(ph){MOB.phone=ph;MOB.chosen=true;document.body.classList.toggle('phone',ph);document.body.classList.toggle('pc',!ph);const d=$('devpick');if(d)d.remove();
 if(ph){try{const el=document.documentElement;const r=el.requestFullscreen||el.webkitRequestFullscreen;if(r){const p=r.call(el,{navigationUI:'hide'});if(p&&p.catch)p.catch(()=>{});}}catch(e){}fitWins();}
 try{if(window.Desk&&Desk.render)Desk.render();}catch(e){}window.dispatchEvent(new Event('resize'));}
MOB.choose=choose;
function picker(){if($('devpick'))return;const d=document.createElement('div');d.id='devpick';
 d.innerHTML=`<div class="dw"><div class="dt">🖥️ Битва Шаров 98 — Настройка</div><div class="db"><b style="font-size:15px">На чём вы играете?</b>
 <div class="bb"><button id="dp_pc" class="${auto?'':'auto'}">${pcIco(64)}Компьютер</button><button id="dp_ph" class="${auto?'auto':''}">${phoneSvg(64)}Телефон</button></div>
 <div class="hint">Определено автоматически: <b>${auto?'Телефон':'Компьютер'}</b>. Вопрос задаётся при каждом запуске.</div></div></div>`;
 document.body.appendChild(d);
 const st=e=>e.stopPropagation();d.addEventListener('pointerdown',st);d.addEventListener('click',st);
 $('dp_pc').onclick=()=>choose(false);$('dp_ph').onclick=()=>choose(true);(auto?$('dp_ph'):$('dp_pc')).focus();
 d.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();choose(auto);}});}
picker();

// окна во весь экран телефона
function fitOne(w){if(!MOB.phone||!w||w.id==='gamewin')return;const ww=Math.min(w.offsetWidth,innerWidth);w.style.width=ww+'px';w.style.left=Math.max(0,(innerWidth-ww)/2)+'px';w.style.top='0px';}
function fitWins(){document.querySelectorAll('.win:not(.hide)').forEach(fitOne);}
const ow=window.openWin;if(ow)window.openWin=openWin=function(){const w=ow.apply(this,arguments);if(MOB.phone)fitOne(w);return w;};
addEventListener('resize',()=>{if(MOB.phone)setTimeout(fitWins,50);});

// касание -> мышь для перетаскивания заголовков и холстов с onmousedown (Скетч и т.п.)
const mevt=(t,el,p)=>el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,clientX:p.clientX,clientY:p.clientY,button:0,buttons:1,view:window}));
document.addEventListener('touchstart',e=>{if(!MOB.phone||e.touches.length>1)return;const t=e.target;const tb=t.closest&&t.closest('.win .tb');const cv=t.tagName==='CANVAS'&&t.onmousedown;
 if((tb&&t.tagName!=='BUTTON')||cv){e.preventDefault();const el=cv?t:tb;mevt('mousedown',el,e.touches[0]);
  const mv=ev=>{ev.preventDefault();mevt('mousemove',cv?t:document,ev.touches[0]);};const end=ev=>{mevt('mouseup',cv?t:document,ev.changedTouches[0]);document.removeEventListener('touchmove',mv);document.removeEventListener('touchend',end);document.removeEventListener('touchcancel',end);};
  document.addEventListener('touchmove',mv,{passive:false});document.addEventListener('touchend',end);document.addEventListener('touchcancel',end);}},{passive:false,capture:true});

// долгое нажатие = правый щелчок
let lp=null;document.addEventListener('touchstart',e=>{if(!MOB.phone||e.touches.length>1)return;const t=e.target;if(t.closest('#msg,#tc,#gamewin,canvas,input,textarea'))return;const p=e.touches[0],x=p.clientX,y=p.clientY;clearTimeout(lp&&lp.t);
 lp={x,y,t:setTimeout(()=>{lp.fired=1;t.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:x,clientY:y,button:2,view:window}));if(navigator.vibrate)navigator.vibrate(20);},550)};},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(lp&&Math.hypot(e.touches[0].clientX-lp.x,e.touches[0].clientY-lp.y)>10)clearTimeout(lp.t);},{passive:true,capture:true});
document.addEventListener('touchend',e=>{if(!lp)return;clearTimeout(lp.t);if(lp.fired){e.preventDefault();lp=null;}},{passive:false,capture:true});
addEventListener('contextmenu',e=>{if(MOB.phone&&e.isTrusted&&e.target.closest&&!e.target.closest('#msg'))e.preventDefault();},true);

// змейка: свайпы
let sw=null;document.addEventListener('touchstart',e=>{if(e.target.id==='snc'){const p=e.touches[0];sw={x:p.clientX,y:p.clientY};}},{passive:true});
document.addEventListener('touchend',e=>{if(!sw)return;const p=e.changedTouches[0],dx=p.clientX-sw.x,dy=p.clientY-sw.y;sw=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20||!window.Snake)return;if(Math.abs(dx)>Math.abs(dy))Snake.dir(dx>0?1:-1,0);else Snake.dir(0,dy>0?1:-1);});

// ---- сенсорное управление в матчах ----
const tc=document.createElement('div');tc.id='tc';document.body.appendChild(tc);const rot=document.createElement('div');rot.id='rotate';rot.textContent='↻ Поверните телефон горизонтально для удобной игры';document.body.appendChild(rot);
function joy(pi,style){const j=document.createElement('div');j.className='joy';Object.assign(j.style,style);j.innerHTML='<i></i>';tc.appendChild(j);const k=j.firstChild;let id=null;
 const upd=p=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=(p.clientX-cx)/(r.width/2),dy=(p.clientY-cy)/(r.height/2);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m;}
  MOB.tc[pi].x=Math.abs(dx)<.25?0:dx;MOB.tc[pi].y=Math.abs(dy)<.25?0:dy;k.style.transform=`translate(${dx*43}px,${dy*43}px)`;};
 const rel=()=>{id=null;MOB.tc[pi].x=MOB.tc[pi].y=0;k.style.transform='';};
 j.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;try{j.setPointerCapture(id);}catch(_){}upd(e);});
 j.addEventListener('pointermove',e=>{if(e.pointerId===id)upd(e);});['pointerup','pointercancel','lostpointercapture'].forEach(t=>j.addEventListener(t,e=>{if(e.pointerId===id)rel();}));}
function abtn(pi,style,label){const b=document.createElement('div');b.className='ab';Object.assign(b.style,style);b.textContent=label;tc.appendChild(b);
 b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(_){}MOB.tc[pi].a=true;b.classList.add('on');if(navigator.vibrate)navigator.vibrate(10);});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,()=>{MOB.tc[pi].a=false;b.classList.remove('on');}));}
let layout='';function build(local){const L=local?'2':'1';if(layout===L)return;layout=L;tc.innerHTML='';MOB.tc.forEach(s=>{s.x=s.y=0;s.a=false;});
 if(!local){joy(0,{left:'18px',bottom:'18px'});abtn(0,{right:'24px',bottom:'34px'},'⚡ Удар');}
 else{joy(0,{left:'12px',bottom:'12px'});abtn(0,{left:'40px',bottom:'170px',width:'80px',height:'80px'},'⚡ И1');joy(1,{right:'12px',bottom:'12px'});abtn(1,{right:'40px',bottom:'170px',width:'80px',height:'80px'},'⚡ И2');}
 const p=document.createElement('div');p.className='pz';p.textContent='❚❚';p.title='Пауза';tc.appendChild(p);p.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{onKey('Escape');}catch(_){}});}
const ri=window.readInput;if(ri)window.readInput=readInput=function(set){const r=ri(set);if(!MOB.phone)return r;const local=typeof G!=='undefined'&&G&&G.kind==='local';const t=local?MOB.tc[set]:(set===0?MOB.tc[0]:null);
 if(!t)return r;return {x:Math.max(-1,Math.min(1,r.x+t.x)),y:Math.max(-1,Math.min(1,r.y+t.y)),a:r.a||t.a};};
setInterval(()=>{const gw=$('gamewin');const ing=MOB.phone&&typeof mode!=='undefined'&&mode==='game'&&typeof G!=='undefined'&&G&&gw&&!gw.classList.contains('hide')&&G.phase!=='over';
 document.body.classList.toggle('ingame',!!ing);document.body.classList.toggle('portrait',innerHeight>innerWidth);if(ing)build(G.kind==='local');else{layout='';tc.innerHTML='';MOB.tc.forEach(s=>{s.x=s.y=0;s.a=false;});}},150);

// производительность: меньше частиц на телефоне
const uf=window.updFx;if(uf)window.updFx=updFx=function(){if(MOB.phone){try{if(particles.length>90)particles.splice(0,particles.length-90);}catch(e){}}return uf.apply(this,arguments);};
// замер FPS (для тестов)
MOB.fps=0;let fc=0,ft=performance.now();(function f(n){fc++;if(n-ft>1000){MOB.fps=Math.round(fc*1000/(n-ft));fc=0;ft=n;}requestAnimationFrame(f);})(ft);
})();
