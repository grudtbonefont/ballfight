'use strict';
// ===================== WIN98 РАБОЧИЙ СТОЛ =====================
(function(){const st=document.createElement('style');st.textContent=`
.im svg{width:34px;height:34px;display:block;margin:2px auto}#startmenu .it svg{width:20px;height:20px}
.tbb{min-width:0!important;padding:0!important}
.grip{position:absolute;right:0;bottom:0;width:14px;height:14px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 45%,#808080 45% 52%,#fff 52% 60%,transparent 60% 70%,#808080 70% 77%,#fff 77% 85%,transparent 85%)}
.win.mini{display:none!important}
.win.sized:not(.hide){display:flex;flex-direction:column}.win.sized .wb{flex:1;max-height:none;min-height:0}
.win.max{left:0!important;top:0!important;width:100vw!important;height:calc(100vh - 30px)!important;display:flex;flex-direction:column}.win.max .wb{flex:1;max-height:none}.win.max .grip{display:none}
#rubber{position:fixed;border:1px dotted #fff;background:rgba(0,0,128,.15);z-index:800;pointer-events:none}
.icon.drag{opacity:.6;z-index:5}
#ctx,.ctxm{position:fixed;background:#c0c0c0;border:2px solid;border-color:#dfdfdf #000 #000 #dfdfdf;box-shadow:inset -1px -1px #808080,inset 1px 1px #fff;padding:2px;z-index:7000;min-width:170px}
.ctxm .ci{padding:4px 20px;cursor:pointer;white-space:nowrap}.ctxm .ci:hover{background:#000080;color:#fff}.ctxm hr{border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:2px}
#startmenu .it{position:relative}#startmenu .it .arr{margin-left:auto}
#startmenu .sub{display:none;position:absolute;left:100%;top:-3px;min-width:200px;background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080;padding:2px;color:#000}
#startmenu .it:hover>.sub{display:block}#startmenu .sub .it{padding:4px 8px}
#boot,#offscr{position:fixed;inset:0;z-index:100000;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-family:Tahoma}
#boot .lg{font:bold 54px "Times New Roman",serif;font-style:italic;background:linear-gradient(90deg,#f33,#fc0,#3c3,#39f);-webkit-background-clip:text;background-clip:text;color:transparent}
#boot .bar{margin-top:40px;width:260px;height:14px;border:1px solid #666;overflow:hidden}#boot .bar i{display:block;height:100%;width:60px;background:linear-gradient(90deg,transparent,#36f,#9cf,#36f,transparent);animation:bb 1.1s linear infinite}
@keyframes bb{from{transform:translateX(-60px)}to{transform:translateX(260px)}}
#offscr{background:#000;color:#f80;font:bold 30px Tahoma;text-align:center}
#ssaver{position:fixed;inset:0;z-index:99000;background:#000;cursor:none}
#tip{position:fixed;background:#ffffe1;border:1px solid #000;padding:2px 5px;font-size:12px;z-index:99500;pointer-events:none;max-width:280px;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
body.wp-clouds{background:linear-gradient(#3a7bd5 0%,#7fb4ee 60%,#cfe4fb 100%)}
body.wp-clouds #desk{background:radial-gradient(ellipse 160px 60px at 20% 30%,#fff 40%,transparent 70%),radial-gradient(ellipse 220px 70px at 70% 20%,#fff 35%,transparent 70%),radial-gradient(ellipse 180px 55px at 55% 65%,rgba(255,255,255,.9) 35%,transparent 70%),radial-gradient(ellipse 130px 45px at 85% 75%,#fff 35%,transparent 70%)}
body.wp-dark{background:#1b1b2b}body.wp-dark .win,body.wp-dark #taskbar,body.wp-dark #startmenu,body.wp-dark .ctxm{filter:invert(.88) hue-rotate(180deg)}
body.wp-dark canvas,body.wp-dark .ballico{filter:invert(1) hue-rotate(180deg)}
.ms{display:inline-block;border:3px solid;border-color:#808080 #fff #fff #808080;padding:6px;background:#c0c0c0}
.ms .hd{display:flex;justify-content:space-between;align-items:center;border:2px solid;border-color:#808080 #fff #fff #808080;padding:4px;margin-bottom:6px}
.ms .lcd{background:#000;color:#f00;font:bold 22px "Courier New",monospace;padding:0 3px;min-width:48px;text-align:right}
.ms .sm{min-width:0;width:32px;height:32px;padding:0;font-size:18px}
.ms .gr{display:grid;border:3px solid;border-color:#808080 #fff #fff #808080}
.ms .c{width:22px;height:22px;font:bold 14px Tahoma;display:flex;align-items:center;justify-content:center;border:3px solid;border-color:#fff #808080 #808080 #fff;background:#c0c0c0;cursor:default}
.ms .c.o{border:1px solid #808080;border-width:0 1px 1px 0}.ms .c.boom{background:#f00}
`;document.head.appendChild(st);})();
const SYS=Object.assign({wp:'teal',snd:true,ss:true},(()=>{try{return JSON.parse(localStorage.getItem('bf_sys'))||{};}catch(e){return {};}})());
function sysSave(){try{localStorage.setItem('bf_sys',JSON.stringify(SYS));}catch(e){}}
function applyWp(){document.body.classList.remove('wp-teal','wp-clouds','wp-dark');document.body.classList.add('wp-'+SYS.wp);}
applyWp();
// ---- звуки ----
const Sfx={ac:null,
 ctx(){if(!this.ac){try{this.ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(this.ac&&this.ac.state==='suspended')this.ac.resume();return this.ac;},
 tone(f,t0,d,type,v){const a=this.ctx();if(!a||!SYS.snd)return;const o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;const t=a.currentTime+t0;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.15,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.05);},
 startup(){[[523,0],[659,.18],[784,.36],[1047,.54],[784,.9],[1047,1.05]].forEach(([f,t],i)=>{this.tone(f,t,i>3?1.4:.6,'triangle',.12);this.tone(f/2,t,.8,'sine',.06);});},
 click(){this.tone(1800,0,.03,'square',.04);},open(){this.tone(880,0,.08,'triangle',.06);this.tone(1320,.05,.1,'triangle',.05);},
 error(){this.tone(440,0,.25,'square',.08);this.tone(330,.12,.35,'square',.08);},ding(){this.tone(1046,0,.5,'sine',.15);this.tone(1568,0,.4,'sine',.05);},
 shut(){[[784,0],[659,.2],[523,.4],[392,.6]].forEach(([f,t])=>this.tone(f,t,.7,'triangle',.12));}};
const _msg=UI.msg;UI.msg=function(t,b,btns,icon){if(icon==='⚠️'||icon==='❌')Sfx.error();else Sfx.ding();return _msg.apply(this,arguments);};
// ---- окна: свернуть/развернуть/размер ----
function minWin(id){const w=document.getElementById('w_'+id);if(!w)return;w.classList.add('mini');Sfx.click();updTasks();}
function maxWin(id){const w=document.getElementById('w_'+id);if(!w)return;w.classList.toggle('max');front(w);}
function resizify(w){const g=w.querySelector('.grip');w.querySelector('.tb').addEventListener('dblclick',e=>{if(e.target.tagName!=='BUTTON')maxWin(w.id.slice(2));});
 g.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();front(w);const sx=e.clientX,sy=e.clientY,W=w.offsetWidth,H=w.offsetHeight;
  const mv=ev=>{w.classList.add('sized');w.style.width=Math.max(220,W+ev.clientX-sx)+'px';w.style.height=Math.max(120,H+ev.clientY-sy)+'px';};
  const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);};addEventListener('pointermove',mv);addEventListener('pointerup',up);});}
// ---- значки ----
const GX=96,GY=88;
const APPS=MENU.map(m=>({k:m[1],ico:m[0],run:m[2]})).concat([
 {k:'Сапёр',ico:'💣',run:'Mines.open()'},{k:'Шахматы',ico:'♞',run:'Chess.open()'},{k:'Блокнот',ico:'📝',run:'Desk.notes()'},{k:'Свойства экрана',ico:'🖥️',run:'Desk.props()'},...(window.EXTRA||[]),{k:'Корзина',ico:'🗑️',run:'Desk.bin()',fixed:1}]);
const Desk={pos:{},binned:[],sel:new Set(),
 load(){try{const d=JSON.parse(localStorage.getItem('bf_icons'))||{};this.pos=d.pos||{};this.binned=d.bin||[];}catch(e){}},
 store(){try{localStorage.setItem('bf_icons',JSON.stringify({pos:this.pos,bin:this.binned}));}catch(e){}},
 rows(){return Math.max(1,Math.floor((innerHeight-30-8)/GY));},cols(){return Math.max(1,Math.floor((innerWidth-8)/GX));},
 vis(){return APPS.filter(a=>!this.binned.includes(a.k));},
 occ(skip){const o={};for(const a of this.vis())if(a.k!==skip&&this.pos[a.k])o[this.pos[a.k].join()]=a.k;return o;},
 free(c,r,skip){const o=this.occ(skip),R=this.rows(),C=this.cols();c=clamp(c,0,C-1);r=clamp(r,0,R-1);if(!o[[c,r].join()])return [c,r];
  for(let d=1;d<40;d++)for(let dc=-d;dc<=d;dc++)for(let dr=-d;dr<=d;dr++){const x=c+dc,y=r+dr;if(x>=0&&y>=0&&x<C&&y<R&&!o[[x,y].join()])return [x,y];}return [c,r];},
 arrange(){this.pos={};let i=0;const R=this.rows();for(const a of this.vis()){if(a.fixed)continue;this.pos[a.k]=[Math.floor(i/R),i%R];i++;}
  const bin=APPS.find(a=>a.fixed);this.pos[bin.k]=this.free(this.cols()-1,this.rows()-1,bin.k);this.store();this.render();},
 render(){const box=document.getElementById('icons');const C=this.cols(),R=this.rows();let changed=false;
  for(const a of this.vis()){const p=this.pos[a.k];if(!p||p[0]>=C||p[1]>=R){this.pos[a.k]=this.free(p?p[0]:(a.fixed?C-1:0),p?p[1]:(a.fixed?R-1:0),a.k);changed=true;}}
  if(changed)this.store();
  box.innerHTML=this.vis().map(a=>{const ico=a.fixed?(this.binned.length?'🗑️':'🗑'):a.ico;return `<div class="icon${this.sel.has(a.k)?' sel':''}" tabindex="0" data-k="${a.k}" title="${a.k} — двойной щелчок, чтобы открыть" style="left:${4+this.pos[a.k][0]*GX}px;top:${4+this.pos[a.k][1]*GY}px"><div class="im">${ico}</div><span>${a.k}</span></div>`;}).join('');},
 run(k){const a=APPS.find(x=>x.k===k);if(a){Sfx.click();try{(new Function(a.run))();}catch(e){console.error(e);}}},
 select(ks){this.sel=new Set(ks);document.querySelectorAll('#icons .icon').forEach(el=>el.classList.toggle('sel',this.sel.has(el.dataset.k)));},
 toBin(ks){ks=ks.filter(k=>!APPS.find(a=>a.k===k).fixed);if(!ks.length)return;this.binned.push(...ks);ks.forEach(k=>delete this.pos[k]);this.sel.clear();this.store();this.render();Sfx.tone(300,0,.15,'sawtooth',.05);toast('🗑️ В корзине',ks.join(', ')+' — восстановить можно из Корзины');if(!document.getElementById('w_bin')?.classList.contains('hide'))this.bin(1);},
 restore(k){this.binned=k?this.binned.filter(x=>x!==k):[];this.store();this.render();this.bin(1);},
 bin(re){const w=document.getElementById('w_bin');if(re&&(!w||w.classList.contains('hide')))return;
  openWin('bin','Корзина',`<div class="inset" style="min-height:120px">${this.binned.length?this.binned.map(k=>{const a=APPS.find(x=>x.k===k);return `<div style="display:flex;align-items:center;gap:8px;padding:3px"><span style="font-size:22px">${a.ico}</span><span style="flex:1">${k}</span><button onclick="Desk.restore('${k}')">Восстановить</button></div>`;}).join(''):'<i style="color:#808080">Корзина пуста. Перетащите сюда ненужные значки.</i>'}</div>
  <div style="text-align:right;margin-top:8px">${this.binned.length?'<button onclick="Desk.restore()">Восстановить все</button>':''}</div>`,{w:380,icon:'🗑️'});},
 notes(){openWin('notes','Патчноут.txt — Блокнот',`<div style="font-size:12px;margin:-4px 0 4px">Файл&nbsp;&nbsp;Правка&nbsp;&nbsp;Поиск&nbsp;&nbsp;Справка</div><textarea readonly style="width:100%;height:340px;font:13px 'Courier New',monospace;resize:none;border:2px solid;border-color:#808080 #fff #fff #808080">БИТВА ШАРОВ 98 — СПИСОК ИЗМЕНЕНИЙ
==================================

v5 «Рабочий стол»
 * Значки можно перетаскивать (с привязкой к сетке),
   выделять рамкой и открывать двойным щелчком.
 * Окна: свернуть, развернуть, изменить размер за уголок.
 * Правый щелчок по рабочему столу, Свойства экрана и обои.
 * Корзина: перетащите в неё лишний значок.
 * Новые программы: Сапёр и Шахматы (с наградами!).
 * Экранная заставка, звуки системы, загрузочный экран.
 * Пуск: подменю «Программы», «Игры», «Настройки».

v4 «Аккаунты»
 * Вход по нику и паролю, сохранение в облаке.

v3 «Баланс» + музыка
 * Переработан баланс шаров и уровней.
 * Фоновая музыка (🔊 в трее).

v2 — 26 шаров, ящики, улучшения, 30 уровней,
     выживание, турнир, онлайн-бои.

Совет: нажмите Delete, чтобы отправить
выделенные значки в Корзину.</textarea>`,{w:480,icon:'📝'});},
 props(){const wp=[['teal','🟦 Классика (бирюза)'],['clouds','☁️ Облака'],['dark','🌙 Тёмная тема']];
  openWin('props','Свойства: Экран',`<div style="display:flex;gap:12px;flex-wrap:wrap"><div style="width:150px;height:110px;border:10px solid #555;border-bottom-width:20px;border-radius:6px" id="wpprev"></div>
  <fieldset style="flex:1;min-width:180px"><legend>Обои и тема</legend>${wp.map(([k,n])=>`<label style="display:block;padding:2px"><input type="radio" name="wp" value="${k}" ${SYS.wp===k?'checked':''} onchange="SYS.wp='${k}';applyWp();sysSave();Desk.prev()"> ${n}</label>`).join('')}</fieldset></div>
  <fieldset><legend>Прочее</legend><label style="display:block"><input type="checkbox" ${SYS.snd?'checked':''} onchange="SYS.snd=this.checked;sysSave()"> Системные звуки</label>
  <label style="display:block"><input type="checkbox" ${SYS.ss?'checked':''} onchange="SYS.ss=this.checked;sysSave()"> Заставка «Летающие шары» (через 60 с бездействия)</label>
  <label style="display:block"><input type="checkbox" ${Music.on?'checked':''} onchange="if(this.checked!==Music.on)Music.toggle()"> Фоновая музыка</label></fieldset>
  <div style="text-align:right"><button onclick="Saver.start()">Просмотр заставки</button> <button onclick="closeWin('props')">ОК</button></div>`,{w:440,icon:'🖥️'});this.prev();},
 prev(){const p=document.getElementById('wpprev');if(p)p.style.background={teal:'#008080',clouds:'linear-gradient(#3a7bd5,#cfe4fb)',dark:'#1b1b2b'}[SYS.wp];},
 clock(){const d=new Date(),y=d.getFullYear(),m=d.getMonth();const first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();let cells='';for(let i=0;i<first;i++)cells+='<td></td>';
  for(let i=1;i<=n;i++){cells+=`<td style="text-align:center;padding:2px 4px;${i===d.getDate()?'background:#000080;color:#fff':''}">${i}</td>`;if((first+i)%7===0)cells+='</tr><tr>';}
  openWin('clock','Дата и время',`<div style="text-align:center;font:bold 28px 'Courier New'" id="clkbig"></div><div style="text-align:center;margin-bottom:6px">${d.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
  <table class="inset" style="margin:auto;border-collapse:collapse;font-size:12px"><tr>${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<th style="padding:2px 4px">${x}</th>`).join('')}</tr><tr>${cells}</tr></table>`,{w:280,icon:'🕒'});this.tick();},
 tick(){const e=document.getElementById('clkbig');if(e)e.textContent=new Date().toLocaleTimeString('ru-RU');}};
setInterval(()=>Desk.tick(),1000);
Desk.load();Desk.render();
addEventListener('resize',()=>Desk.render());
// перетаскивание значков и рамка выделения
(function(){const box=document.getElementById('icons'),desk=document.getElementById('desk');let lastTap={k:'',t:0};
 desk.addEventListener('pointerdown',e=>{if(e.button!==0)return;hideCtx();const ic=e.target.closest('.icon');
  if(ic){const k=ic.dataset.k;if(!Desk.sel.has(k))Desk.select(e.ctrlKey?[...Desk.sel,k]:[k]);const sx=e.clientX,sy=e.clientY;let drag=false;const els=[...box.querySelectorAll('.icon.sel')];const org=els.map(el=>[el.offsetLeft,el.offsetTop]);
   const mv=ev=>{const dx=ev.clientX-sx,dy=ev.clientY-sy;if(!drag&&Math.hypot(dx,dy)>5){drag=true;els.forEach(el=>el.classList.add('drag'));}if(drag)els.forEach((el,i)=>{el.style.left=org[i][0]+dx+'px';el.style.top=org[i][1]+dy+'px';});};
   const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);
    if(!drag){const now=Date.now();if(e.pointerType!=='mouse'||(lastTap.k===k&&now-lastTap.t<450)){Desk.run(k);lastTap={k:'',t:0};}else lastTap={k,t:now};return;}
    const binEl=box.querySelector('.icon[data-k="Корзина"]');const under=document.elementsFromPoint(ev.clientX,ev.clientY);
    if(binEl&&under.includes(binEl)&&!Desk.sel.has('Корзина')){Desk.toBin([...Desk.sel]);return;}
    const dx=ev.clientX-sx,dy=ev.clientY-sy;els.forEach((el,i)=>{const k2=el.dataset.k;Desk.pos[k2]=Desk.free(Math.round((org[i][0]+dx-4)/GX),Math.round((org[i][1]+dy-4)/GY),k2);});Desk.store();Desk.render();};
   addEventListener('pointermove',mv);addEventListener('pointerup',up);return;}
  if(e.target!==desk&&e.target!==box&&e.target.id!=='logo'&&!e.target.closest('#logo'))return;
  Desk.select([]);const sx=e.clientX,sy=e.clientY;const rb=document.createElement('div');rb.id='rubber';document.body.appendChild(rb);
  const mv=ev=>{const x=Math.min(sx,ev.clientX),y=Math.min(sy,ev.clientY),w=Math.abs(ev.clientX-sx),h=Math.abs(ev.clientY-sy);Object.assign(rb.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
   Desk.select([...box.querySelectorAll('.icon')].filter(el=>{const r=el.getBoundingClientRect();return r.right>x&&r.left<x+w&&r.bottom>y&&r.top<y+h;}).map(el=>el.dataset.k));};
  const up=()=>{rb.remove();removeEventListener('pointermove',mv);removeEventListener('pointerup',up);};addEventListener('pointermove',mv);addEventListener('pointerup',up);});
 box.addEventListener('keydown',e=>{if(e.key==='Enter'){const k=e.target.dataset&&e.target.dataset.k;if(k)Desk.run(k);}if(e.key==='Delete')Desk.toBin([...Desk.sel]);});
 addEventListener('keydown',e=>{if(e.key==='Delete'&&Desk.sel.size&&mode==='menu'&&e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA')Desk.toBin([...Desk.sel]);});
 desk.addEventListener('contextmenu',e=>{e.preventDefault();const ic=e.target.closest('.icon');
  if(ic){const k=ic.dataset.k;Desk.select([k]);showCtx(e.clientX,e.clientY,[['<b>Открыть</b>',()=>Desk.run(k)],...(k==='Корзина'?[['Восстановить все',()=>Desk.restore()]]:[['Удалить в Корзину',()=>Desk.toBin([k])]])]);return;}
  showCtx(e.clientX,e.clientY,[['Упорядочить значки',()=>Desk.arrange()],['Обновить',()=>{document.getElementById('icons').style.visibility='hidden';setTimeout(()=>{Desk.render();document.getElementById('icons').style.visibility='';},120);}],null,['Блокнот',()=>Desk.notes()],['Корзина',()=>Desk.bin()],null,['Свойства',()=>Desk.props()]]);});})();
function showCtx(x,y,items){hideCtx();const m=document.createElement('div');m.className='ctxm';m.id='ctx';
 items.forEach(it=>{if(!it){m.appendChild(document.createElement('hr'));return;}const d=document.createElement('div');d.className='ci';d.innerHTML=it[0];d.onclick=()=>{hideCtx();Sfx.click();it[1]();};m.appendChild(d);});
 document.body.appendChild(m);m.style.left=Math.min(x,innerWidth-m.offsetWidth-2)+'px';m.style.top=Math.min(y,innerHeight-m.offsetHeight-2)+'px';}
function hideCtx(){const m=document.getElementById('ctx');if(m)m.remove();}
addEventListener('pointerdown',e=>{if(!e.target.closest('#ctx'))hideCtx();},true);
// ---- меню Пуск с подменю ----
(function(){const it=(ico,t,run)=>`<div class="it" onclick="event.stopPropagation();toggleStart();Sfx.click();${run}"><span style="font-size:20px">${ico}</span>${t}</div>`;
 const sub=(ico,t,inner)=>`<div class="it"><span style="font-size:20px">${ico}</span>${t}<span class="arr">▸</span><div class="sub">${inner}</div></div>`;
 const m=k=>{const a=APPS.find(x=>x.k===k);return it(a.ico,a.k,a.run);};
 document.getElementById('smitems').innerHTML=
  sub('📁','Программы',['Бой с ботом','Вдвоём','Онлайн-бой','Выживание','Турнир'].map(m).join('')+'<hr>'+sub('🎲','Игры',m('Сапёр')+m('Шахматы')+(window.EXTRA||[]).filter(a=>a.cat==='game').map(a=>m(a.k)).join(''))+sub('🗂️','Стандартные',m('Блокнот')+(window.EXTRA||[]).filter(a=>a.cat==='std').map(a=>m(a.k)).join('')))+
  sub('🎒','Игрок',['Ящики','Магазин','Инвентарь','Достижения','Статистика','Награды','Аккаунт'].map(m).join(''))+
  sub('⚙️','Настройки',it('🖥️','Свойства экрана','Desk.props()')+'<div class="it" id="smmus" onclick="event.stopPropagation();toggleStart();Music.toggle()"><span style="font-size:20px">🎵</span>Музыка: вкл</div>'+it('🗂️','Упорядочить значки','Desk.arrange()'))+
  m('Корзина')+m('Справка')+'<hr>'+it('⏻','Выключить компьютер...','UI.shutdown()');
 Music.ui();})();
UI.shutdown=function(){UI.msg('Завершение работы','Вы действительно хотите завершить работу?<br><small>Прогресс уже сохранён.</small>',[['Да','Desk.off()'],['Отмена','']],'🖥️');};
Desk.off=function(){Sfx.shut();if(Music.a)Music.a.pause();const o=document.createElement('div');o.id='offscr';o.innerHTML='<div style="opacity:0;transition:opacity 1.5s">Теперь компьютер можно выключить.<br><small style="font-size:14px;color:#888;font-weight:normal">(щёлкните, чтобы включить снова)</small></div>';
 document.body.appendChild(o);setTimeout(()=>o.firstChild.style.opacity=1,900);o.onclick=()=>{o.remove();Boot.run();};};
// ---- загрузка ----
const Boot={run(){const b=document.createElement('div');b.id='boot';b.innerHTML='<div style="font-size:64px">🔴🟡🟢🔵</div><div class="lg">Битва Шаров 98</div><div style="color:#9cf;margin-top:6px">Куб-Арена Edition</div><div class="bar"><i></i></div><div style="position:absolute;bottom:20px;color:#666;font-size:12px">Загрузка… (щелчок — пропустить)</div>';
 document.body.appendChild(b);let done=false;const fin=()=>{if(done)return;done=true;b.style.transition='opacity .4s';b.style.opacity=0;setTimeout(()=>b.remove(),400);Sfx.startup();if(Music.on)Music.play();};
 b.onclick=fin;setTimeout(fin,2200);}};
Boot.run();
// ---- подсказки ----
(function(){let tm=0,tip=null,cur=null;addEventListener('mouseover',e=>{const el=e.target.closest('[title],[data-tip]');if(el===cur)return;cur=el;clearTimeout(tm);if(tip){tip.remove();tip=null;}if(!el)return;
 if(el.title){el.dataset.tip=el.title;el.removeAttribute('title');}const x=e.clientX,y=e.clientY;tm=setTimeout(()=>{tip=document.createElement('div');tip.id='tip';tip.textContent=el.dataset.tip;document.body.appendChild(tip);
  tip.style.left=Math.min(x+8,innerWidth-tip.offsetWidth-4)+'px';tip.style.top=(y+20>innerHeight-40?y-24:y+20)+'px';},600);});
 addEventListener('pointerdown',()=>{clearTimeout(tm);if(tip){tip.remove();tip=null;}cur=null;});})();
document.getElementById('clock').title='Щёлкните — дата и календарь';document.getElementById('clock').style.cursor='pointer';document.getElementById('clock').onclick=()=>Desk.clock();
document.getElementById('startbtn').addEventListener('click',()=>Sfx.click());
// ---- заставка ----
const Saver={idle:Date.now(),on:false,raf:0,
 start(){if(this.on)return;this.on=true;this.t0=Date.now();const c=document.createElement('canvas');c.id='ssaver';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const g=c.getContext('2d');
  const bs=(typeof BALLS!=='undefined'?BALLS:[]).slice(0,12).map(b=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,r:20+Math.random()*25,c:b.color||'#f00',s:b.sym||''}));
  while(bs.length<10)bs.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,r:30,c:`hsl(${Math.random()*360},80%,55%)`,s:''});
  const step=()=>{if(!this.on)return;g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,0,c.width,c.height);
   for(const b of bs){b.x+=b.vx;b.y+=b.vy;if(b.x<b.r||b.x>c.width-b.r)b.vx*=-1;if(b.y<b.r||b.y>c.height-b.r)b.vy*=-1;const gr=g.createRadialGradient(b.x-b.r*.3,b.y-b.r*.3,2,b.x,b.y,b.r);gr.addColorStop(0,'#fff');gr.addColorStop(.3,b.c);gr.addColorStop(1,'#000');g.fillStyle=gr;g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill();
    if(b.s){g.fillStyle='#fff';g.font=b.r+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(b.s,b.x,b.y);}}
   g.fillStyle='rgba(255,255,255,.5)';g.font='bold 22px Tahoma';g.textAlign='center';g.fillText('Битва Шаров 98',c.width/2,c.height-30);this.raf=requestAnimationFrame(step);};step();},
 stop(){this.idle=Date.now();if(!this.on||Date.now()-this.t0<800)return;this.on=false;cancelAnimationFrame(this.raf);const c=document.getElementById('ssaver');if(c)c.remove();}};
['pointermove','pointerdown','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,()=>Saver.stop(),true));
setInterval(()=>{if(SYS.ss&&!Saver.on&&Date.now()-Saver.idle>60000&&document.getElementById('gamewin').classList.contains('hide')&&!document.getElementById('boot'))Saver.start();},2000);
