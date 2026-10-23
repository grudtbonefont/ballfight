'use strict';
// ===================== НАГРАДЫ С ЛИМИТОМ =====================
const Reward={MAX:5,
 st(){const d=new Date().toDateString();let o;try{o=JSON.parse(localStorage.getItem('bf_rw'))||{};}catch(e){o={};}if(o.d!==d)o={d,c:{}};return o;},
 left(k){return this.MAX-(this.st().c[k]||0);},
 give(k,n,title){const o=this.st();const c=o.c[k]||0;if(c>=this.MAX){toast(title||'Победа!','Лимит наград на сегодня исчерпан ('+this.MAX+'/'+this.MAX+')');return 0;}
  o.c[k]=c+1;try{localStorage.setItem('bf_rw',JSON.stringify(o));}catch(e){}save.coins+=n;persist();toast(title||'Победа!',`+${n} 🪙 (наград сегодня: ${c+1}/${this.MAX})`);return n;}};
// ===================== SVG-ЗНАЧКИ =====================
const SV=(b)=>`<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${b}</svg>`;
const ICO={
 paint:SV('<rect x="3" y="6" width="22" height="20" fill="#fff" stroke="#000"/><rect x="5" y="20" width="4" height="4" fill="#f00"/><rect x="10" y="20" width="4" height="4" fill="#0a0"/><rect x="15" y="20" width="4" height="4" fill="#00f"/><path d="M14 4 L28 18 L25 21 L11 7Z" fill="#fc0" stroke="#000"/><path d="M11 7 L8 4 L14 4Z" fill="#555"/>'),
 calc:SV('<rect x="6" y="2" width="20" height="28" fill="#c0c0c0" stroke="#000"/><rect x="9" y="5" width="14" height="6" fill="#cfc" stroke="#000"/>'+[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${9+c*5}" y="${14+r*5}" width="4" height="4" fill="#fff" stroke="#000" stroke-width=".5"/>`).join('')).join('')),
 media:SV('<rect x="2" y="6" width="28" height="20" fill="#c0c0c0" stroke="#000"/><rect x="4" y="8" width="16" height="16" fill="#000"/><path d="M9 11 L17 16 L9 21Z" fill="#0f0"/><rect x="22" y="9" width="6" height="3" fill="#008"/><rect x="22" y="14" width="6" height="3" fill="#008"/><rect x="22" y="19" width="6" height="3" fill="#008"/>'),
 pc:SV('<rect x="4" y="3" width="24" height="18" fill="#c0c0c0" stroke="#000"/><rect x="7" y="6" width="18" height="12" fill="#008080"/><rect x="10" y="21" width="12" height="3" fill="#808080"/><rect x="5" y="24" width="22" height="5" fill="#c0c0c0" stroke="#000"/>'),
 cards:SV('<rect x="4" y="4" width="16" height="22" rx="2" fill="#fff" stroke="#000" transform="rotate(-12 12 15)"/><rect x="12" y="5" width="16" height="22" rx="2" fill="#fff" stroke="#000"/><path d="M20 11 C17 7 13 12 20 19 C27 12 23 7 20 11Z" fill="#d00"/>'),
 pin:SV('<rect x="6" y="2" width="20" height="28" fill="#20206a" stroke="#000"/><circle cx="12" cy="10" r="3" fill="#f0f"/><circle cx="20" cy="12" r="3" fill="#0ff"/><circle cx="16" cy="18" r="2.5" fill="#ddd"/><path d="M8 26 L14 24 M24 26 L18 24" stroke="#fc0" stroke-width="2"/>'),
 snake:SV('<rect x="2" y="2" width="28" height="28" fill="#9c6" stroke="#000"/><rect x="6" y="20" width="16" height="4" fill="#060"/><rect x="18" y="8" width="4" height="16" fill="#060"/><rect x="18" y="8" width="8" height="4" fill="#060"/><rect x="8" y="8" width="4" height="4" fill="#d00"/>'),
 blocks:SV('<rect x="2" y="2" width="28" height="28" fill="#000"/><rect x="6" y="22" width="5" height="5" fill="#0cf"/><rect x="11" y="22" width="5" height="5" fill="#0cf"/><rect x="16" y="22" width="5" height="5" fill="#fc0"/><rect x="21" y="22" width="5" height="5" fill="#fc0"/><rect x="16" y="17" width="5" height="5" fill="#fc0"/><rect x="11" y="7" width="5" height="5" fill="#f33"/><rect x="11" y="12" width="5" height="5" fill="#f33"/><rect x="16" y="12" width="5" height="5" fill="#f33"/>'),
 drive:SV('<rect x="3" y="12" width="26" height="10" fill="#c0c0c0" stroke="#000"/><rect x="22" y="16" width="4" height="2" fill="#0c0"/>'),
 cd:SV('<circle cx="16" cy="16" r="12" fill="#ddd" stroke="#000"/><circle cx="16" cy="16" r="12" fill="url(#g)" opacity=".5"/><circle cx="16" cy="16" r="3" fill="#fff" stroke="#000"/><path d="M8 10 A10 10 0 0 1 16 6" stroke="#f0f" stroke-width="2" fill="none"/>'),
 folder:SV('<path d="M2 8 H12 L14 10 H30 V27 H2Z" fill="#fc3" stroke="#000"/>'),
 ctrl:SV('<rect x="3" y="5" width="26" height="22" fill="#fff" stroke="#000"/><rect x="6" y="9" width="8" height="6" fill="#00f"/><rect x="18" y="9" width="8" height="6" fill="#0a0"/><rect x="6" y="18" width="8" height="6" fill="#f80"/><rect x="18" y="18" width="8" height="6" fill="#c0c"/>')};
window.EXTRA=[{k:'Мой компьютер',ico:ICO.pc,run:'Explorer.open()',cat:'std'},{k:'Paint',ico:ICO.paint,run:'Paint.open()',cat:'std'},{k:'Калькулятор',ico:ICO.calc,run:'Calc.open()',cat:'std'},{k:'Проигрыватель',ico:ICO.media,run:'Media.open()',cat:'std'}];
(function(){const st=document.createElement('style');st.textContent=`
.pt{display:flex;gap:4px}.pt .tools{display:grid;grid-template-columns:repeat(2,26px);gap:1px;align-content:start}
.pt .tools button,.pt .sz button{min-width:0;width:26px;height:26px;padding:0;display:flex;align-items:center;justify-content:center}.pt .tools button.on,.pt .sz button.on{border-color:#000 #fff #fff #000;background:repeating-conic-gradient(#c0c0c0 0 25%,#fff 0 50%) 0 0/2px 2px}
.pt .tools svg{width:18px;height:18px}.pt .sz{display:grid;grid-template-columns:repeat(2,26px);gap:1px;margin-top:6px}
.pt .cv{flex:1;overflow:auto;background:#808080;border:2px solid;border-color:#808080 #fff #fff #808080;padding:4px;max-height:60vh}.pt canvas{background:#fff;display:block;cursor:crosshair;touch-action:none}
.pal{display:flex;gap:6px;margin-top:6px;align-items:center}.pal .cur{width:34px;height:34px;position:relative;border:2px solid;border-color:#808080 #fff #fff #808080;background:#c0c0c0}
.pal .cur i{position:absolute;width:16px;height:16px;border:1px solid #000}.pal .grid{display:grid;grid-template-columns:repeat(14,16px);gap:1px}.pal .grid div{width:16px;height:16px;border:1px solid;border-color:#808080 #fff #fff #808080;cursor:pointer}
.calc{display:grid;grid-template-columns:repeat(5,44px);gap:4px}.calc button{min-width:0;padding:4px 0;font-weight:bold}.calc .r{color:#c00}.calc .b{color:#00c}
.calcd{background:#fff;text-align:right;font:20px "Courier New",monospace;padding:4px 6px;margin-bottom:8px;border:2px solid;border-color:#808080 #fff #fff #808080;overflow:hidden;white-space:nowrap}
.mp .scr{background:#000;height:110px;border:2px solid;border-color:#808080 #fff #fff #808080}.mp input[type=range]{width:100%}.mp .row{display:flex;gap:4px;align-items:center;margin-top:6px}.mp .row button{min-width:0;padding:2px 10px}
.ex .bar{display:flex;gap:6px;align-items:center;margin-bottom:6px;font-size:12px}.ex .addr{flex:1;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px 4px}
.ex .items{display:flex;flex-wrap:wrap;gap:6px;background:#fff;min-height:200px;padding:8px;border:2px solid;border-color:#808080 #fff #fff #808080;align-content:flex-start}
.ex .it2{width:84px;text-align:center;font-size:12px;cursor:pointer;padding:3px}.ex .it2 svg{width:32px;height:32px}.ex .it2:hover span{background:#000080;color:#fff}.ex .sb{font-size:12px;margin-top:4px;border:1px solid;border-color:#808080 #fff #fff #808080;padding:1px 6px}
`;document.head.appendChild(st);})();
// ===================== PAINT =====================
const Paint={tool:'pencil',size:2,c1:'#000000',c2:'#ffffff',undo:[],
 PAL:['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808040','#004040','#0080ff','#004080','#8000ff','#804000','#ffffff','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffff80','#00ff80','#80ffff','#8080ff','#ff0080','#ff8040'],
 T:{pencil:['Карандаш','<path d="M3 15 L5 17 L16 6 L14 4Z" fill="#fc0" stroke="#000"/><path d="M3 15 L2 18 L5 17Z" fill="#000"/>'],brush:['Кисть','<path d="M10 2 L13 2 L13 10 L10 10Z" fill="#a52" stroke="#000"/><path d="M9 10 H14 L14 13 Q11 18 9 13Z" fill="#00f" stroke="#000"/>'],
  eraser:['Ластик','<path d="M3 12 L10 5 L16 11 L9 18Z" fill="#fff" stroke="#000"/><path d="M3 12 L9 18 L6 18 L2 14Z" fill="#f9c" stroke="#000"/>'],fill:['Заливка','<path d="M4 9 L10 3 L16 9 L10 15Z" fill="#ddd" stroke="#000"/><path d="M15 10 Q18 15 16 16 Q13 15 15 10Z" fill="#00f"/>'],
  line:['Линия','<path d="M3 16 L16 3" stroke="#000" stroke-width="2"/>'],rect:['Прямоугольник','<rect x="3" y="5" width="13" height="10" fill="none" stroke="#000" stroke-width="2"/>'],
  ellipse:['Эллипс','<ellipse cx="9.5" cy="10" rx="7" ry="5" fill="none" stroke="#000" stroke-width="2"/>'],pick:['Пипетка','<path d="M12 3 L16 7 L8 15 L4 16 L5 12Z" fill="#cde" stroke="#000"/>']},
 open(){openWin('paint','Безымянный — Paint',`<div style="font-size:12px;margin:-4px 0 4px;display:flex;gap:6px"><button style="min-width:0;padding:1px 8px" onclick="Paint.doUndo()">↶ Отменить</button><button style="min-width:0;padding:1px 8px" onclick="Paint.clear()">🗋 Очистить</button><button style="min-width:0;padding:1px 8px" onclick="Paint.savePng()">💾 Сохранить PNG</button><label style="display:flex;align-items:center;gap:4px"><input type="checkbox" id="ptfill"> заливка фигур</label></div>
 <div class="pt"><div><div class="tools">${Object.entries(this.T).map(([k,v])=>`<button data-t="${k}" title="${v[0]}" onclick="Paint.setTool('${k}')"><svg viewBox="0 0 19 19">${v[1]}</svg></button>`).join('')}</div>
 <div class="sz">${[1,2,4,8,12,20].map(z=>`<button data-z="${z}" title="Толщина ${z}" onclick="Paint.setSize(${z})"><i style="display:block;width:${Math.min(z,18)}px;height:${Math.min(z,18)}px;border-radius:50%;background:#000"></i></button>`).join('')}</div></div>
 <div class="cv"><div style="position:relative;display:inline-block"><canvas id="ptc" width="640" height="400"></canvas><canvas id="pto" width="640" height="400" style="position:absolute;left:0;top:0;background:transparent;pointer-events:none"></canvas></div></div></div>
 <div class="pal"><div class="cur" title="Основной / фоновый цвет (левая / правая кнопка)"><i id="ptc2" style="right:3px;bottom:3px"></i><i id="ptc1" style="left:3px;top:3px"></i></div><div class="grid">${this.PAL.map(c=>`<div style="background:${c}" data-c="${c}"></div>`).join('')}</div></div>`,{w:760,icon:'🎨'});
  const c=document.getElementById('ptc');if(!c.dataset.ev){c.dataset.ev=1;this.ctx=c.getContext('2d',{willReadFrequently:true});this.ctx.fillStyle='#fff';this.ctx.fillRect(0,0,640,400);this.bind(c);}
  document.querySelector('#w_paint .grid').onpointerdown=e=>{const c=e.target.dataset.c;if(!c)return;if(e.button===2)this.c2=c;else this.c1=c;this.ui();};document.querySelector('#w_paint .grid').oncontextmenu=e=>e.preventDefault();this.ui();},
 ui(){document.querySelectorAll('#w_paint .tools button').forEach(b=>b.classList.toggle('on',b.dataset.t===this.tool));document.querySelectorAll('#w_paint .sz button').forEach(b=>b.classList.toggle('on',+b.dataset.z===this.size));
  document.getElementById('ptc1').style.background=this.c1;document.getElementById('ptc2').style.background=this.c2;},
 setTool(t){this.tool=t;this.ui();},setSize(z){this.size=z;this.ui();},
 snap(){this.undo.push(this.ctx.getImageData(0,0,640,400));if(this.undo.length>25)this.undo.shift();},
 doUndo(){const d=this.undo.pop();if(d)this.ctx.putImageData(d,0,0);},
 clear(){this.snap();this.ctx.fillStyle='#fff';this.ctx.fillRect(0,0,640,400);},
 savePng(){const a=document.createElement('a');a.download='рисунок.png';a.href=document.getElementById('ptc').toDataURL('image/png');a.click();},
 bind(c){const o=document.getElementById('pto').getContext('2d');const P=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*400/r.height];};
  c.oncontextmenu=e=>e.preventDefault();
  c.addEventListener('pointerdown',e=>{e.preventDefault();c.setPointerCapture(e.pointerId);const col=e.button===2?this.c2:this.c1,[x0,y0]=P(e),g=this.ctx,t=this.tool;
   if(t==='pick'){const d=g.getImageData(x0|0,y0|0,1,1).data;const h='#'+[0,1,2].map(i=>d[i].toString(16).padStart(2,'0')).join('');if(e.button===2)this.c2=h;else this.c1=h;this.ui();return;}
   this.snap();if(t==='fill'){this.flood(x0|0,y0|0,col);return;}
   let lx=x0,ly=y0;const stroke=(x,y)=>{g.strokeStyle=t==='eraser'?this.c2:col;g.lineWidth=t==='pencil'?Math.max(1,this.size/2):t==='eraser'?this.size*2+4:this.size*1.5+1;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(lx,ly);g.lineTo(x+.01,y);g.stroke();lx=x;ly=y;};
   const shape=(ctx,x,y)=>{ctx.strokeStyle=col;ctx.fillStyle=e.button===2?this.c1:this.c2;ctx.lineWidth=Math.max(1,this.size/1.5);ctx.beginPath();
    if(t==='line'){ctx.moveTo(x0,y0);ctx.lineTo(x,y);}else if(t==='rect')ctx.rect(x0,y0,x-x0,y-y0);else ctx.ellipse((x0+x)/2,(y0+y)/2,Math.abs(x-x0)/2,Math.abs(y-y0)/2,0,0,7);
    if(t!=='line'&&document.getElementById('ptfill').checked)ctx.fill();ctx.stroke();};
   const free=['pencil','brush','eraser'].includes(t);if(free)stroke(x0,y0);
   const mv=ev=>{const [x,y]=P(ev);if(free)stroke(x,y);else{o.clearRect(0,0,640,400);shape(o,x,y);}};
   const up=ev=>{c.removeEventListener('pointermove',mv);c.removeEventListener('pointerup',up);if(!free){o.clearRect(0,0,640,400);const [x,y]=P(ev);shape(g,x,y);}};
   c.addEventListener('pointermove',mv);c.addEventListener('pointerup',up);});},
 flood(x,y,col){const g=this.ctx,im=g.getImageData(0,0,640,400),d=im.data,W=640,H=400;const tc=parseInt(col.slice(1),16),R=tc>>16,G=(tc>>8)&255,B=tc&255;const i0=(y*W+x)*4,sr=d[i0],sg=d[i0+1],sb=d[i0+2];
  if(sr===R&&sg===G&&sb===B)return;const m=i=>Math.abs(d[i]-sr)+Math.abs(d[i+1]-sg)+Math.abs(d[i+2]-sb)<40;const st=[[x,y]];
  while(st.length){let [cx,cy]=st.pop();let i=(cy*W+cx)*4;while(cx>=0&&m(i)){cx--;i-=4;}cx++;i+=4;let up=false,dn=false;
   while(cx<W&&m(i)){d[i]=R;d[i+1]=G;d[i+2]=B;d[i+3]=255;if(cy>0){const u=i-W*4;if(m(u)){if(!up){st.push([cx,cy-1]);up=true;}}else up=false;}if(cy<H-1){const v=i+W*4;if(m(v)){if(!dn){st.push([cx,cy+1]);dn=true;}}else dn=false;}cx++;i+=4;}}
  g.putImageData(im,0,0);}};
// ===================== КАЛЬКУЛЯТОР =====================
const Calc={v:'0',acc:null,op:null,fresh:true,mem:0,
 open(){const K=[['MC','b','mc'],['7','','7'],['8','','8'],['9','','9'],['/','r','/'],['MR','b','mr'],['4','','4'],['5','','5'],['6','','6'],['*','r','*'],['MS','b','ms'],['1','','1'],['2','','2'],['3','','3'],['-','r','-'],['M+','b','m+'],['0','','0'],['±','b','neg'],[',','','.'],['+','r','+'],['C','r','c'],['CE','r','ce'],['√','b','sqrt'],['%','b','%'],['=','r','=']];
  openWin('calc','Калькулятор',`<div class="calcd" id="cald">0</div><div class="calc">${K.map(k=>`<button class="${k[1]}" onclick="Calc.key('${k[2]}')">${k[0]}</button>`).join('')}</div>`,{w:270,icon:'🧮'});this.show();},
 show(){const e=document.getElementById('cald');if(e)e.textContent=(this.mem?'M ':'')+this.v.replace('.',',');},
 calc(a,b,o){return o==='+'?a+b:o==='-'?a-b:o==='*'?a*b:b===0?NaN:a/b;},
 fmt(x){if(!isFinite(x))return 'Ошибка';return String(+x.toPrecision(12));},
 key(k){Sfx.click();const n=parseFloat(this.v)||0;
  if(/^[0-9]$/.test(k)){this.v=this.fresh||this.v==='0'?k:this.v+k;this.fresh=false;}
  else if(k==='.'){if(this.fresh){this.v='0.';this.fresh=false;}else if(!this.v.includes('.'))this.v+='.';}
  else if('+-*/'.includes(k)){if(this.op&&!this.fresh)this.v=this.fmt(this.calc(this.acc,n,this.op));this.acc=parseFloat(this.v);this.op=k;this.fresh=true;}
  else if(k==='='){if(this.op){this.v=this.fmt(this.calc(this.acc,n,this.op));this.op=null;}this.fresh=true;}
  else if(k==='c'){this.v='0';this.acc=null;this.op=null;this.fresh=true;}else if(k==='ce'){this.v='0';this.fresh=true;}
  else if(k==='neg')this.v=this.fmt(-n);else if(k==='sqrt'){this.v=this.fmt(Math.sqrt(n));this.fresh=true;}else if(k==='%'){this.v=this.fmt(this.acc!=null?this.acc*n/100:n/100);}
  else if(k==='mc')this.mem=0;else if(k==='mr'){this.v=this.fmt(this.mem);this.fresh=true;}else if(k==='ms')this.mem=n;else if(k==='m+')this.mem+=n;
  this.show();}};
addEventListener('keydown',e=>{const w=document.getElementById('w_calc');if(!w||w.classList.contains('hide')||w.classList.contains('inactive')||e.target.tagName==='INPUT')return;const m={Enter:'=',Escape:'c',Backspace:'ce',',':'.'};const k=m[e.key]||e.key;if(/^[0-9.+\-*/=]$/.test(k)||['c','ce'].includes(k)){Calc.key(k);e.preventDefault();}});
// ===================== ПРОИГРЫВАТЕЛЬ =====================
const Media={raf:0,
 open(){Music.init();openWin('media','Проигрыватель — music.mp3',`<div class="mp"><canvas class="scr" id="mpc" width="360" height="110" style="width:100%"></canvas>
  <div style="font-size:12px;margin-top:4px">🎵 <b>Фоновая музыка</b> — «Битва Шаров 98» <span id="mpt" style="float:right"></span></div>
  <input type="range" id="mppos" min="0" max="1000" value="0" title="Перемотка">
  <div class="row"><button onclick="Media.play()" title="Воспроизвести">▶</button><button onclick="Media.pause()" title="Пауза">❚❚</button><button onclick="Media.stop()" title="Стоп">■</button><span style="margin-left:auto;font-size:12px">Громкость</span><input type="range" id="mpvol" min="0" max="100" style="width:110px"></div></div>`,{w:400,icon:'🎵'});
  const a=Music.a,vol=document.getElementById('mpvol'),pos=document.getElementById('mppos');vol.value=Math.round(a.volume*100);
  vol.oninput=()=>{a.volume=vol.value/100;try{localStorage.setItem('ballfight_vol',a.volume);}catch(e){}};pos.oninput=()=>{if(a.duration)a.currentTime=pos.value/1000*a.duration;};
  cancelAnimationFrame(this.raf);const loop=()=>{this.draw();if(!document.getElementById('w_media').classList.contains('hide'))this.raf=requestAnimationFrame(loop);};loop();},
 play(){if(!Music.on)Music.toggle();else{Music.play();}},pause(){if(Music.a)Music.a.pause();},stop(){if(Music.a){Music.a.pause();Music.a.currentTime=0;}},
 draw(){const c=document.getElementById('mpc');if(!c)return;const g=c.getContext('2d'),a=Music.a,t=performance.now()/1000,on=a&&!a.paused;g.fillStyle='#000';g.fillRect(0,0,360,110);
  for(let i=0;i<32;i++){const h=on?(Math.abs(Math.sin(t*3+i*.7)*Math.cos(t*1.7+i*.3))*80+10*Math.random()):3;g.fillStyle=`hsl(${120-h},100%,50%)`;g.fillRect(6+i*11,104-h,8,h);}
  const f=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'--:--';const e=document.getElementById('mpt');if(e&&a)e.textContent=f(a.currentTime)+' / '+f(a.duration)+(on?' ▶':' ❚❚');
  const p=document.getElementById('mppos');if(p&&a&&a.duration&&document.activeElement!==p)p.value=a.currentTime/a.duration*1000;}};
try{const v=parseFloat(localStorage.getItem('ballfight_vol'));if(v>=0){const _i=Music.init.bind(Music);Music.init=function(){const f=!this.a;_i();if(f)this.a.volume=v;};}}catch(e){}
// ===================== МОЙ КОМПЬЮТЕР =====================
const Explorer={path:'',
 open(p){this.path=p||'';const it=(ico,n,run)=>`<div class="it2" ondblclick="${run}" onclick="if(event.pointerType!=='mouse')${run}">${ico}<br><span>${n}</span></div>`;let items,addr;
  if(!this.path){addr='Мой компьютер';items=it(ICO.drive,'Диск 3,5 (A:)',"UI.msg('Диск A:','Вставьте дискету в дисковод A:.',[['Повтор',''],['Отмена','']],'⚠️')")+it(ICO.drive,'Локальный диск (C:)',"Explorer.open('C')")+it(ICO.cd,'BALLFIGHT98 (D:)',"Explorer.open('D')")+it(ICO.ctrl,'Панель управления',"Desk.props()")+it(ICO.folder,'Принтеры',"UI.msg('Принтеры','Принтер не установлен. Может, оно и к лучшему.',[['ОК','']],'🖨️')");}
  else if(this.path==='C'){addr='C:\\';items=it(ICO.folder,'Program Files',"Explorer.open('P')")+it(ICO.folder,'Мои документы',"Explorer.open('M')")+it(ICO.folder,'WINDOWS',"UI.msg('WINDOWS','Системная папка. Лучше ничего тут не трогать.',[['ОК','']],'⚠️')")+`<div class="it2">${ICO.paint}<br><span>autoexec.bat</span></div>`;}
  else if(this.path==='P'){addr='C:\\Program Files';items=(window.EXTRA||[]).concat([{k:'Сапёр',ico:'💣',run:'Mines.open()'},{k:'Шахматы',ico:'♞',run:'Chess.open()'},{k:'Блокнот',ico:'📝',run:'Desk.notes()'}]).filter(a=>a.k!=='Мой компьютер').map(a=>it(typeof a.ico==='string'&&a.ico.startsWith('<svg')?a.ico:`<div style="font-size:28px">${a.ico}</div>`,a.k+'.exe',a.run)).join('');}
  else if(this.path==='M'){addr='C:\\Мои документы';items=it(`<div style="font-size:28px">📝</div>`,'Патчноут.txt','Desk.notes()')+it(ICO.paint,'рисунок.bmp','Paint.open()');}
  else{addr='D:\\ (BALLFIGHT98)';items=it(`<div style="font-size:28px">🎮</div>`,'BALLFIGHT.EXE','UI.levels()')+it(ICO.media,'music.mp3','Media.open()')+it(`<div style="font-size:28px">❓</div>`,'README.TXT','UI.help()');}
  openWin('explorer',addr,`<div class="ex"><div class="bar"><button style="min-width:0;padding:1px 8px" onclick="Explorer.open(${this.path==='P'||this.path==='M'?"'C'":"''"})" ${this.path?'':'disabled'}>⬆ Вверх</button>Адрес:<div class="addr">${addr}</div></div><div class="items">${items}</div>
  <div class="sb">Объектов: ${(items.match(/class="it2"/g)||[]).length}${this.path==='C'?' · Свободно: 640 КБ (должно хватить всем)':''}</div></div>`,{w:520,icon:'💻'});}};
