// ===== fun98.js — surprises: rogue ball, Clippo, Command Prompt, BSOD, Ping Chat, replays =====
(function(){
const $=id=>document.getElementById(id);
const AC=()=>{try{return Sfx.ctx&&Sfx.ctx();}catch(e){return null;}};
const st=document.createElement('style');st.textContent=`
#funball{position:fixed;background:transparent!important;border:0!important;width:auto!important;height:auto!important;z-index:99990;cursor:grab;touch-action:none;filter:drop-shadow(3px 5px 3px rgba(0,0,0,.4))}
.crack{position:absolute;inset:0;pointer-events:none;z-index:50}
#clip{position:fixed;right:18px;bottom:44px;z-index:99980;display:flex;flex-direction:column;align-items:flex-end;pointer-events:none}
#clip .bub{pointer-events:auto;background:#ffffe1;border:1px solid #000;border-radius:8px;padding:8px 10px;max-width:230px;font:12px Tahoma,sans-serif;color:#000;margin-bottom:6px;position:relative;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
#clip .bub:after{content:'';position:absolute;right:34px;bottom:-9px;border:9px solid transparent;border-top-color:#ffffe1;border-bottom:0}
#clip .bub .x{position:absolute;right:3px;top:1px;cursor:pointer;font-weight:bold}#clip .bub .bt{margin-top:6px;display:flex;gap:4px}#clip .bub button{min-width:0;padding:1px 6px;font-size:11px}
#clip svg{pointer-events:auto;cursor:pointer;width:62px;height:90px;animation:clipb 2.4s ease-in-out infinite}
@keyframes clipb{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-5px) rotate(3deg)}}
#clip .eye{animation:blink 4s infinite;transform-origin:center;transform-box:fill-box}@keyframes blink{0%,94%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.cmd{background:#000;color:#c0c0c0;font:14px/1.25 'Lucida Console','Courier New',monospace;height:340px;overflow:auto;padding:4px;white-space:pre-wrap;word-break:break-all;cursor:text}
.cmd input{background:transparent;border:0;outline:0;color:inherit;font:inherit;width:60%;padding:0;margin:0;box-shadow:none}
#bsod{position:fixed;inset:0;z-index:999999;background:#0000aa;color:#fff;font:18px/1.5 'Lucida Console','Courier New',monospace;display:flex;align-items:center;justify-content:center;cursor:none}
#bsod .t{background:#aaa;color:#0000aa;padding:0 8px;font-weight:bold}
.icq .log{height:220px;overflow:auto;background:#fff;border:2px inset;padding:4px;font:12px Tahoma,Verdana,sans-serif;user-select:text}.icq .log b{color:#c00}.icq .log b.me{color:#00a}
.icq .row{display:flex;gap:4px;margin-top:4px}.icq input{flex:1}
#mrain{position:fixed;inset:0;z-index:99970;pointer-events:none}
`;document.head.appendChild(st);

// ---------- icons ----------
const ICQ_ICO=`<svg viewBox="0 0 32 32"><g transform="translate(16 16)">${[0,1,2,3,4,5,6,7].map(i=>`<ellipse rx="4.2" ry="7" cy="-8" transform="rotate(${i*45})" fill="${i===2?'#e33':'#3c3'}" stroke="#060" stroke-width=".8"/>`).join('')}<circle r="4.5" fill="#ffd500" stroke="#a80" stroke-width=".8"/></g></svg>`;
const CMD_ICO=`<svg viewBox="0 0 32 32"><rect x="2" y="4" width="28" height="24" fill="#c0c0c0" stroke="#000"/><rect x="2" y="4" width="28" height="5" fill="#000080"/><rect x="4" y="10" width="24" height="16" fill="#000"/><text x="6" y="21" font-family="monospace" font-size="8" fill="#ccc">C:\\&gt;_</text></svg>`;
const CLIP_SVG=`<svg viewBox="0 0 62 90"><path d="M22 84 V22 a9 9 0 0 1 18 0 V70 a5 5 0 0 1 -10 0 V28" fill="none" stroke="#8a8f99" stroke-width="5" stroke-linecap="round"/><path d="M22 84 V22 a9 9 0 0 1 18 0 V70 a5 5 0 0 1 -10 0 V28" fill="none" stroke="#e8ecf2" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="22" cy="30" rx="8" ry="9" fill="#fff" stroke="#333"/><ellipse cx="40" cy="30" rx="8" ry="9" fill="#fff" stroke="#333"/><circle class="eye" cx="24" cy="32" r="3.2" fill="#111"/><circle class="eye" cx="42" cy="32" r="3.2" fill="#111"/>
<path d="M14 18 q7 -6 14 -1 M34 17 q7 -5 14 1" stroke="#333" stroke-width="2" fill="none"/></svg>`;
const CLIP_ICO=`<svg viewBox="0 0 32 32"><path d="M11 28 V9 a5 5 0 0 1 10 0 V24 a3 3 0 0 1 -6 0 V11" fill="none" stroke="#777" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="#fff" stroke="#333"/><circle cx="20" cy="12" r="3" fill="#fff" stroke="#333"/><circle cx="12.5" cy="12.5" r="1.2"/><circle cx="20.5" cy="12.5" r="1.2"/></svg>`;
const REP_ICO=`<svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2" fill="#333" stroke="#000"/><rect x="5" y="8" width="22" height="16" fill="#2a6"/><circle cx="12" cy="17" r="4" fill="#f44"/><circle cx="21" cy="14" r="3.5" fill="#48f"/><path d="M3 6 l4 -4 h4 l-4 4 M11 6 l4 -4 h4 l-4 4 M19 6 l4 -4 h4 l-4 4" fill="#fff" stroke="#000" stroke-width=".7"/></svg>`;

// ---------- sounds ----------
const S={uhoh(){const a=AC();if(!a||!SYS.snd)return;const t=a.currentTime;[[0,620,520],[.2,470,380]].forEach(([d,f1,f2])=>{const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.setValueAtTime(f1,t+d);o.frequency.exponentialRampToValueAtTime(f2,t+d+.16);
  g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.25,t+d+.02);g.gain.exponentialRampToValueAtTime(.001,t+d+.2);o.connect(g);g.connect(a.destination);o.start(t+d);o.stop(t+d+.22);});},
 glass(){const a=AC();if(!a||!SYS.snd)return;const t=a.currentTime,n=a.sampleRate*.5,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3)*(Math.random()<.3?1:.3);
  const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=2500;const g=a.createGain();g.gain.value=.5;s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);
  for(let k=0;k<5;k++)Sfx.tone(2500+Math.random()*3000,.05+k*.06,.15,'sine',.05);},
 boing(){Sfx.tone(180+Math.random()*60,0,.08,'square',.05);}};

// ---------- REPLAYS ----------
const Rep={cur:null,last:null,acc:0,
 rec(){if(!G||mode!=='game'||G.phase==='over'||paused)return;const now=performance.now();if(now-this.acc<50)return;this.acc=now;if(!this.cur)this.start();
  if(this.cur.f.length>24000)return;this.cur.f.push({b:G.balls.map(b=>[Math.round(b.x),Math.round(b.y),Math.round(b.r),Math.max(0,Math.round(b.hp)),b.maxHp,b.hitT>.1?1:0,b.fx.shield>0?1:0]),s:G.score.slice(),ban:G.banner||'',r:G.round});},
 start(){this.cur={ids:G.ids.slice(),names:(G.names||[]).slice(),arena:G.arena,kind:G.kind,date:new Date().toLocaleString('en-US'),f:[]};},
 end(){if(this.cur&&this.cur.f.length>10){this.cur.w=G.winner;this.cur.s=G.score.slice();this.last=this.cur;try{localStorage.setItem('bf_replay',JSON.stringify(this.cur));}catch(e){}}this.cur=null;},
 get(){if(this.last)return this.last;try{return this.last=JSON.parse(localStorage.getItem('bf_replay'));}catch(e){return null;}},
 open(){const r=this.get();if(!r){UI.msg('Replay','No replay yet — play a match and it’ll show up here.',[['OK','']],'🎬');return;}
  openWin('replay','Media Player — match_replay.avi',`<div class="mp"><canvas id="rpc" width="1000" height="700" style="width:100%;background:#000;display:block;border:2px solid;border-color:#808080 #fff #fff #808080"></canvas>
  <input type="range" id="rppos" min="0" max="${r.f.length-1}" value="0" style="width:100%" title="Scrub">
  <div class="row" style="display:flex;gap:4px;align-items:center"><button id="rpplay" style="min-width:0" onclick="Rep.toggle()" title="Play/pause">❚❚</button><button style="min-width:0" onclick="Rep.i=0" title="To start">⏮</button>
  <span style="font-size:12px;margin-left:8px">Speed:</span><select id="rpspd"><option value=".25">0.25×</option><option value=".5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select>
  <span id="rpt" style="margin-left:auto;font-size:12px"></span></div><div style="font-size:11px;color:#333;margin-top:2px">${(r.names||[]).join(' vs ')} · ${r.date||''} · result ${(r.s||[]).join(':')}</div></div>`,{w:560,icon:'🎬'});
  this.r=r;this.i=0;this.play=true;this.t0=performance.now();cancelAnimationFrame(this.raf);
  const pos=$('rppos');pos.oninput=()=>{this.i=+pos.value;};const loop=(now)=>{if(!$('rpc')||$('w_replay').classList.contains('hide')){this.raf=0;return;}
   const dt=Math.min(100,now-(this.lt||now));this.lt=now;if(this.play){this.i+=dt/50*(+$('rpspd').value);if(this.i>=r.f.length-1){this.i=r.f.length-1;this.play=false;$('rpplay').textContent='▶';}}
   pos.value=this.i|0;this.draw();this.raf=requestAnimationFrame(loop);};this.lt=0;this.raf=requestAnimationFrame(loop);},
 toggle(){this.play=!this.play;if(this.play&&this.i>=this.r.f.length-1)this.i=0;$('rpplay').textContent=this.play?'❚❚':'▶';},
 draw(){const c=$('rpc'),g=c.getContext('2d'),r=this.r,f=r.f[this.i|0];if(!f)return;const A=(window.ARENAS&&ARENAS[r.arena])||{};
  g.fillStyle='#0b1020';g.fillRect(0,0,1000,700);const q=[P(0,0),P(W,0),P(W,H),P(0,H)];g.fillStyle=A.floor||'#2e7d32';g.beginPath();q.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=3;g.stroke();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;for(let k=1;k<8;k++){const a=P(W*k/8,0),b=P(W*k/8,H);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();const c1=P(0,H*k/8),c2=P(W,H*k/8);g.beginPath();g.moveTo(c1.x,c1.y);g.lineTo(c2.x,c2.y);g.stroke();}
  const bs=f.b.map((b,i)=>({b,i})).sort((a,b)=>a.b[1]-b.b[1]);
  bs.forEach(({b,i})=>{const d=BY[r.ids[i]]||{color:'#888',sym:'?'};const p=P(b[0],b[1]),R=b[2]*p.k;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(p.x,p.y,R,R*.4,0,0,7);g.fill();
   const y=p.y-R;const gr=g.createRadialGradient(p.x-R*.35,y-R*.35,R*.1,p.x,y,R);gr.addColorStop(0,'#fff');gr.addColorStop(.3,b[5]?'#fff':d.color);gr.addColorStop(1,'#000');g.fillStyle=gr;g.beginPath();g.arc(p.x,y,R,0,7);g.fill();
   if(b[6]){g.strokeStyle='rgba(120,220,255,.9)';g.lineWidth=4;g.beginPath();g.arc(p.x,y,R*1.3,0,7);g.stroke();}
   if(!(window.LOGO&&LOGO.draw(g,d.id,p.x,y,R))){g.fillStyle='rgba(255,255,255,.85)';g.font=`bold ${Math.round(R*.9)}px Tahoma,Verdana,sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(d.sym,p.x,y);g.textBaseline='alphabetic';}
   g.fillStyle='#000';g.fillRect(p.x-R-1,y-R-17,R*2+2,8);g.fillStyle=i?'#ff5252':'#00c853';g.fillRect(p.x-R,y-R-16,R*2*b[3]/b[4],6);});
  g.fillStyle='#fff';g.font='bold 26px Tahoma,Verdana,sans-serif';g.textAlign='center';g.fillText(`${(r.names||[])[0]||'P1'}  ${f.s[0]} : ${f.s[1]}  ${(r.names||[])[1]||'P2'}`,500,50);
  if(f.ban){g.font='bold 48px Tahoma,Verdana,sans-serif';g.fillStyle='#ffeb3b';g.fillText(f.ban,500,140);}
  g.font='bold 18px monospace';g.fillStyle='#f44';g.textAlign='left';if(this.play&&(performance.now()/500|0)%2)g.fillText('● REPLAY',20,680);
  const sec=x=>`${(x/20/60)|0}:${String(((x/20)|0)%60).padStart(2,'0')}`;$('rpt').textContent=`${sec(this.i)} / ${sec(r.f.length)}`;}};
window.Rep=Rep;

// ---------- ROGUE BALL ----------
const Hool={on:false,
 crack(){const gw=$('gamewin');if(!gw)return;const gb=gw.querySelector('.gb')||gw;const c=document.createElement('canvas');c.className='crack';const r=gb.getBoundingClientRect();c.width=r.width;c.height=r.height;
  if(getComputedStyle(gb).position==='static')gb.style.position='relative';gb.appendChild(c);return c;},
 fire(ballIdx){if(this.on)this.stop();const b=G&&G.balls[ballIdx];if(!b)return;const d=BY[b.id]||{color:'#f33',sym:'●'};const cv=$('c');const cr=cv.getBoundingClientRect();const p=P(b.x,b.y);
  const sx=cr.left+p.x/1000*cr.width,sy=cr.top+(p.y-b.r*p.k)/700*cr.height;
  const cc=this.crack();const g=cc&&cc.getContext('2d');const ox=sx-cc.getBoundingClientRect().left,oy=sy-cc.getBoundingClientRect().top;let k=0;S.glass();
  const rays=Array.from({length:14},()=>({a:Math.random()*6.28,l:0,L:120+Math.random()*260,pts:[[ox,oy]]}));
  const grow=()=>{if(!g)return;k++;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.6;rays.forEach(r=>{if(r.l>=r.L)return;const [x,y]=r.pts.at(-1);r.a+=(Math.random()-.5)*.4;const s=18+Math.random()*14;r.l+=s;const nx=x+Math.cos(r.a)*s,ny=y+Math.sin(r.a)*s;r.pts.push([nx,ny]);g.beginPath();g.moveTo(x,y);g.lineTo(nx,ny);g.stroke();});
   if(k%3===0){g.strokeStyle='rgba(255,255,255,.5)';g.beginPath();const R=k*12;for(let a=0;a<6.3;a+=.5){const x=ox+Math.cos(a)*R*(0.8+Math.random()*.4),y=oy+Math.sin(a)*R*(0.8+Math.random()*.4);a?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();g.stroke();}
   if(k<14)requestAnimationFrame(grow);};grow();
  setTimeout(()=>{if(cc){cc.style.transition='opacity 1.5s';cc.style.opacity=0;setTimeout(()=>cc.remove(),1600);}},4000);
  const D=Math.max(40,Math.min(72,Math.round(b.r*p.k/700*cr.height*2+8)));const el=document.createElement('canvas');el.id='funball';el.width=el.height=D;el.title='You can throw me with the mouse! Double-click to put me back';
  const x=el.getContext('2d'),R=D/2-2,gr=x.createRadialGradient(R*.65,R*.6,R*.1,R,R,R);gr.addColorStop(0,'#fff');gr.addColorStop(.3,d.color);gr.addColorStop(1,'#000');x.fillStyle=gr;x.beginPath();x.arc(D/2,D/2,R,0,7);x.fill();
  if(!(window.LOGO&&LOGO.draw(x,d.id,D/2,D/2,R))){x.fillStyle='rgba(255,255,255,.85)';x.font=`bold ${R*.9|0}px Tahoma,Verdana,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(d.sym,D/2,D/2+1);}document.body.appendChild(el);
  this.el=el;this.D=D;this.x=sx-D/2;this.y=sy-D/2;this.vx=(Math.random()<.5?-1:1)*(6+Math.random()*6);this.vy=-14-Math.random()*6;this.rot=0;this.on=true;this.drag=null;this.knocked=new WeakMap();this.home=[sx-D/2,sy-D/2];
  this.bind();cancelAnimationFrame(this.raf);this.lt=0;this.raf=requestAnimationFrame(t=>this.loop(t));if(window.Clip)Clip.say('Whoa! Your ball smashed the glass and escaped onto the desktop! Throw it around with the mouse; double-click puts it back.');},
 bind(){const el=this.el;let hist=[];
  el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);this.drag={dx:e.clientX-this.x,dy:e.clientY-this.y};hist=[[e.clientX,e.clientY,performance.now()]];el.style.cursor='grabbing';});
  el.addEventListener('pointermove',e=>{if(!this.drag)return;this.x=e.clientX-this.drag.dx;this.y=e.clientY-this.drag.dy;hist.push([e.clientX,e.clientY,performance.now()]);if(hist.length>6)hist.shift();});
  const up=e=>{if(!this.drag)return;this.drag=null;el.style.cursor='grab';const a=hist[0],b=hist.at(-1);const dt=Math.max(16,b[2]-a[2]);this.vx=Math.max(-40,Math.min(40,(b[0]-a[0])/dt*16));this.vy=Math.max(-40,Math.min(40,(b[1]-a[1])/dt*16));};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('dblclick',()=>this.goHome());},
 goHome(){if(!this.on)return;const el=this.el;this.on=false;cancelAnimationFrame(this.raf);el.style.transition='left .6s ease-in, top .6s ease-in, transform .6s, opacity .6s';const gw=$('gamewin');let tx=this.home[0],ty=this.home[1];
  if(gw&&!gw.classList.contains('hide')){const r=gw.getBoundingClientRect();tx=r.left+r.width/2-this.D/2;ty=r.top+r.height/2-this.D/2;}el.style.left=tx+'px';el.style.top=ty+'px';el.style.transform='scale(.2)';el.style.opacity=0;setTimeout(()=>el.remove(),650);Sfx.click();},
 stop(){this.on=false;cancelAnimationFrame(this.raf);if(this.el)this.el.remove();this.el=null;},
 knock(node,vx,vy){const now=performance.now();if((this.knocked.get(node)||0)>now)return;this.knocked.set(node,now+1400);const old=node.style.transform||'';const sp=Math.hypot(vx,vy);
  const tx=vx*6,ty=vy*6,rot=(Math.random()-.5)*Math.min(40,sp*2);node.style.transition='transform .35s cubic-bezier(.2,.8,.3,1)';node.style.transform=`${old} translate(${tx}px,${ty}px) rotate(${rot}deg)`;S.boing();
  setTimeout(()=>{node.style.transition='transform .7s cubic-bezier(.5,1.6,.4,1)';node.style.transform=old;setTimeout(()=>{node.style.transition='';},750);},450);},
 loop(t){if(!this.on||!this.el)return;const dt=Math.min(2,(t-(this.lt||t))/16.7||1);this.lt=t;const Wd=innerWidth,Hd=innerHeight-30,D=this.D;
  if(!this.drag){this.vy+=(window.Fun&&Fun.nograv?0:.6)*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;
   if(this.x<0){this.x=0;this.vx=Math.abs(this.vx)*.8;}if(this.x>Wd-D){this.x=Wd-D;this.vx=-Math.abs(this.vx)*.8;}
   if(this.y<0){this.y=0;this.vy=Math.abs(this.vy)*.8;}if(this.y>Hd-D){this.y=Hd-D;if(Math.abs(this.vy)>2)S.boing();this.vy=-Math.abs(this.vy)*.72;this.vx*=.98;if(Math.abs(this.vy)<1.2)this.vy=0;}
   const sp=Math.hypot(this.vx,this.vy);if(sp>4){const cx=this.x+D/2,cy=this.y+D/2;
    document.querySelectorAll('.win:not(.hide), #icons .icon').forEach(n=>{if(n.id==='gamewin')return;const r=n.getBoundingClientRect();if(cx>r.left-D/2&&cx<r.right+D/2&&cy>r.top-D/2&&cy<r.bottom+D/2&&!(cx>r.left+D&&cx<r.right-D&&cy>r.top+D&&cy<r.bottom-D))this.knock(n,this.vx,this.vy);});}
   this.rot+=this.vx*dt*2;}
  this.el.style.left=this.x+'px';this.el.style.top=this.y+'px';this.el.style.transform=`rotate(${this.rot}deg)`;this.raf=requestAnimationFrame(t=>this.loop(t));}};
window.Hool=Hool;

// ---------- CLIPPO ----------
const TIPS={_:['Looks like you’re trying to beat a ball. Want help? No? Okay then…','Tip: balls hate being called “dumplings”.','Did you know Start is in the bottom left? Took me a while too.','Leave the mouse alone long enough and the screensaver kicks in. I checked. Many times.','Ctrl+Alt+Del won’t help here. But stay strong.','I’m a paperclip. I clip things. That’s all I can do. Well, that and jokes.','Try the Command Prompt and type help. Word is there are secrets…','Emptying the Recycle Bin helps sometimes. Same goes for your head.'],
 paint:['Looks like you’re painting a masterpiece! Add more blue?','Tip: right mouse button paints with the second color.'],sol:['Looks like you’re playing solitaire at work. I won’t tell.','Double-click a card to send it home.'],
 mines:['Tip: right-click plants a flag. Mines really hate that.','A “1” means exactly one mine nearby. Exactly one! Not two!'],chess:['Looks like you’re playing chess. The knight moves in an L. Not a Z.','Tip: don’t give your queen away for free. She’ll be offended.'],
 calc:['2+2=4. Verified by calculator.','Looks like you’re counting money. Can I have some?'],pin:['Hold Space longer — the ball launches harder!','Tip: light up the three lights at the top for a multiplier.'],
 snake:['Don’t eat your own tail. It’s rude.'],blocks:['Tip: holes in the floor are bad. Especially in Blocks.'],cmd:['Looks like you’re a hacker! Type help to look even more hacker-y.'],
 media:['Turn it up! The neighbors are awake anyway.'],explorer:['Don’t delete System32. Besides, it’s not even here.'],icq:['Whoa, Ping Chat! Don’t forget to set your status to “Angry” before a fight.'],
 win:['GG on the win! I knew you could do it. Well, almost knew.'],lose:['Don’t sweat it! Even the best balls deflate sometimes.']};
const HELPER={get(){return localStorage.getItem('bf_verity')==='1'?'verity':localStorage.getItem('bf_clip')==='0'?'none':'clippy';},sync(){localStorage.setItem('bf_helper',this.get());}};window.HELPER=HELPER;
(()=>{const h=localStorage.getItem('bf_helper');if(h&&h!==HELPER.get()){localStorage.setItem('bf_verity',h==='verity'?'1':'0');if(h!=='verity')localStorage.setItem('bf_clip',h==='none'?'0':'1');}HELPER.sync();})();
const Clip={get on(){return localStorage.getItem('bf_clip')!=='0';},
 init(){if($('clip'))return;const d=document.createElement('div');d.id='clip';d.innerHTML=`<div class="bub" style="display:none"></div>${CLIP_SVG}`;document.body.appendChild(d);this.d=d;
  d.querySelector('svg').addEventListener('click',()=>this.say(this.pick('_')));d.classList.toggle('hide',!this.on);if(HELPER.get()==='verity')d.style.display='none';
  this.iv=setInterval(()=>{if(this.on&&mode==='menu'&&Math.random()<.5)this.say(this.pick('_'));},95000);},
 pick(k){const a=TIPS[k]||TIPS._;return a[Math.random()*a.length|0];},
 say(t,btns){if(!this.on||!this.d||HELPER.get()==='verity')return;const b=this.d.querySelector('.bub');b.innerHTML=`<span class="x" title="Close">✕</span><div></div><div class="bt"><button data-a="ok">Thanks</button><button data-a="off">Don’t show again</button></div>`;b.children[1].textContent=t;b.style.display='';
  b.querySelector('.x').onclick=b.querySelector('[data-a=ok]').onclick=()=>b.style.display='none';b.querySelector('[data-a=off]').onclick=()=>this.toggle(false);clearTimeout(this.to);this.to=setTimeout(()=>b.style.display='none',12000);},
 toggle(v){if(v==null)v=!this.on;if(v&&HELPER.get()==='verity'&&window.Verity){Verity.banish();}localStorage.setItem('bf_clip',v?'1':'0');HELPER.sync();if(!this.d)this.init();if(v)this.d.style.display='';this.d.classList.toggle('hide',!v);if(v)this.say('I’m back! Miss me? I’m Clippo, your helper. Click me for a tip.');else toast('📎 Clippo is off. Turn on: Start → Programs → Accessories → Clippo');}};
window.Clip=Clip;

// ---------- COMMAND PROMPT ----------
const FS={'C:':{'WINDOWS':{'SYSTEM':{'KUB.DLL':1,'SHAR32.DLL':1},'WIN.INI':1},'PROGRA~1':{'PAINT.EXE':1,'SOL.EXE':1,'PINBALL.EXE':1,'MINES.EXE':1},'MYDOCS~1':{'PATCHNOTES.TXT':1,'DRAWING.BMP':1},'AUTOEXEC.BAT':1,'CONFIG.SYS':1,'COMMAND.COM':1},'D:':{'BALLFIGHT.EXE':1,'MUSIC.MP3':1,'README.TXT':1}};
const Cmd={cwd:['C:'],col:'#c0c0c0',bg:'#000',
 open(){openWin('cmd','MS-DOS Prompt',`<div class="cmd" id="cmdo"></div>`,{w:620,icon:'🖥️'});KF0('w_cmd');const o=$('cmdo');if(!o.dataset.init){o.dataset.init=1;o.style.color=this.col;o.style.background=this.bg;this.out('Microsoft(R) Ball-DOS(R) Version 6.98\n         (C) Cubesoft Corp 1981-1998.\n\nType help for a list of commands.\n');this.prompt();}o.onclick=()=>{const i=o.querySelector('input');i&&i.focus();};setTimeout(()=>{const i=o.querySelector('input');i&&i.focus();},50);},
 path(){return this.cwd.length===1?this.cwd[0]+'\\':this.cwd.join('\\');},
 node(p){let n=FS;for(const k of p)n=n&&n[k];return n;},
 out(t){const o=$('cmdo');if(!o)return;const s=document.createElement('span');s.textContent=t+(t.endsWith('\n')?'':'\n');const cur=o.querySelector('.ln');o.insertBefore(s,cur);o.scrollTop=1e9;},
 prompt(){const o=$('cmdo');const l=document.createElement('div');l.className='ln';l.innerHTML=`<span></span><input maxlength="120" spellcheck="false" autocomplete="off">`;l.firstChild.textContent=this.path()+'>';o.appendChild(l);const i=l.lastChild;i.focus();
  i.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=i.value;l.replaceWith(Object.assign(document.createElement('span'),{textContent:this.path()+'>'+v+'\n'}));this.hist.unshift(v);this.hi=-1;const r=this.run(v.trim());if(r!=='wait')this.prompt();}
   else if(e.key==='ArrowUp'){this.hi=Math.min(this.hist.length-1,this.hi+1);if(this.hist[this.hi]!=null)i.value=this.hist[this.hi];e.preventDefault();}else if(e.key==='ArrowDown'){this.hi=Math.max(-1,this.hi-1);i.value=this.hi<0?'':this.hist[this.hi];e.preventDefault();}e.stopPropagation();});},
 hist:[],hi:-1,
 run(line){if(!line)return;const [c0,...args]=line.split(/\s+/);const c=c0.toLowerCase(),a=args.join(' ');const F=window.Fun;
  const map={
  help:()=>this.out('Available commands:\n  DIR      list files             CD       change directory\n  CLS      clear screen           VER      system version\n  COLOR    color (e.g. COLOR 0A)  TREE     directory tree\n  PING     ping                   ECHO     print text\n  DATE     date                   TIME     time\n  MEM      memory                 START    launch (START PAINT)\n  TYPE     show a file            EXIT     close window\n\nThere are secret commands too. But we won’t tell you. (Hint: IDDQD doesn’t work.)'),
  dir:()=>{const n=this.node(this.cwd);const ks=Object.keys(n);this.out(` Volume in drive ${this.cwd[0][0]} is ${this.cwd[0]==='C:'?'CUBE98':'BALLFIGHT98'}\n Directory of ${this.path()}\n\n`+ks.map(k=>{const dir=typeof n[k]==='object';const [nm,ex]=dir?[k,'']:k.split('.');return `${nm.padEnd(9)}${(ex||'').padEnd(4)}${dir?'<DIR>     ':String(1024+(k.length*7919)%90000).padStart(10)}  24.08.98  12:00`;}).join('\n')+`\n        ${ks.length} file(s)\n            640 KB free (should be enough for anybody)`);},
  cd:()=>{if(!a){this.out(this.path());return;}if(a==='..'||a==='\\'){if(a==='\\')this.cwd=[this.cwd[0]];else if(this.cwd.length>1)this.cwd.pop();return;}const n=this.node(this.cwd),k=Object.keys(n).find(k=>k.toLowerCase()===a.toLowerCase());if(k&&typeof n[k]==='object')this.cwd.push(k);else this.out('Invalid directory');},
  cls:()=>{const o=$('cmdo');o.querySelectorAll('span').forEach(s=>s.remove());},
  ver:()=>this.out('\nBall-DOS version 6.98 (build '+(document.querySelector('meta[name=build]')||{}).content+')\n'),
  color:()=>{const m=/^([0-9a-f])([0-9a-f])$/i.exec(a);const P='000000 000080 008000 008080 800000 800080 808000 c0c0c0 808080 0000ff 00ff00 00ffff ff0000 ff00ff ffff00 ffffff'.split(' ');if(!m){this.out('COLOR XY: X — background, Y — text (0-F). E.g. COLOR 0A — hacker green.');return;}if(m[1].toLowerCase()===m[2].toLowerCase()){this.out('Same color for background and text? Bold. But no.');return;}
   this.bg='#'+P[parseInt(m[1],16)];this.col='#'+P[parseInt(m[2],16)];const o=$('cmdo');o.style.background=this.bg;o.style.color=this.col;},
  tree:()=>{const t=(n,p)=>Object.keys(n).filter(k=>typeof n[k]==='object').map((k,i,ar)=>p+(i===ar.length-1?'└───':'├───')+k+'\n'+t(n[k],p+(i===ar.length-1?'    ':'│   '))).join('');this.out('Folder structure\n'+this.path()+'\n'+(t(this.node(this.cwd),'')||'No subfolders'));},
  ping:()=>{const h=a||'localhost';this.out(`\nPinging ${h} [127.0.0.${(h.length*37)%250+1}] with 32 bytes of data:`);let k=0;const iv=setInterval(()=>{if(!$('cmdo')){clearInterval(iv);return;}if(k<4){this.out(`Reply from ${h}: bytes=32 time=${(Math.random()*90+5)|0}ms TTL=98${k===2?'  (the ball rolled faster)':''}`);k++;}else{clearInterval(iv);this.out(`\nStats: sent = 4, received = 4, lost = 0 (0% loss)\n`);this.prompt();}},400);return 'wait';},
  echo:()=>this.out(a||'ECHO is on.'),date:()=>this.out('Current date: '+new Date().toLocaleDateString('en-US')),time:()=>this.out('Current time: '+new Date().toLocaleTimeString('en-US')),
  mem:()=>this.out('   655360 bytes total conventional memory\n   640000 bytes used by balls\n    15360 bytes free for Clippo'),
  type:()=>{const n=this.node(this.cwd);const k=Object.keys(n).find(k=>k.toLowerCase()===a.toLowerCase());if(!k||typeof n[k]==='object'){this.out('File not found');return;}this.out({'AUTOEXEC.BAT':'@ECHO OFF\nPROMPT $P$G\nLOADHIGH SHARY.SYS\nBALLFIGHT.EXE /BOOM','CONFIG.SYS':'FILES=98\nBUFFERS=40\nDEVICE=HIMEM.SYS\nSHELL=COMMAND.COM /P /FUN','README.TXT':'Ball Brawl 98. Don’t drop balls on the keyboard.','WIN.INI':'[windows]\nload=clippo.exe\nrun=\n[desktop]\nWallpaper=cube.bmp'}[k]||'ÿ╚▒▓█ ...binary file. Makes no sense, but it’s fascinating.');},
  start:()=>{const m={paint:'Paint.open()',calc:'Calc.open()',sol:'Sol.open()',pinball:'Pin.open()',mines:'Mines.open()',chess:'Chess.open()',snake:'Snake.open()',blocks:'Blocks.open()',notepad:'Desk.notes()',icq:'Icq.open()',replay:'Rep.open()',explorer:'Explorer.open()'};const f=m[a.toLowerCase().replace('.exe','')];if(f){new Function(f)();this.out('Running: '+a);}else this.out('Available: '+Object.keys(m).join(', '));},
  exit:()=>{closeWin('cmd');},
  'c:':()=>{this.cwd=['C:'];},'d:':()=>{this.cwd=['D:'];},'a:':()=>this.out('Not ready reading drive A\nAbort, Retry, Ignore? I\n(The floppy with the balls got lost back in 1999)'),
  rainbow:()=>{F.rainbow=!F.rainbow;this.out(F.rainbow?'🌈 Rainbow balls on! (looks only, no power)':'Rainbow off.');},
  matrix:()=>{F.matrix();this.out('Wake up, Neo… Balls are everywhere. (Click or any key — exit)');},
  gravity:()=>{F.gravity(a.toLowerCase()!=='on');this.out(F.nograv?'Desktop gravity disabled! The icons floated away. (gravity on — bring them back)':'Gravity restored. Newton approves.');},
  bsod:()=>F.bsod(),clippy:()=>Clip.toggle(),clippo:()=>Clip.toggle(),'скрепыш':()=>Clip.toggle(),
  iddqd:()=>this.out('God mode? In this game the balls are the gods. No coins for you 🙂'),idkfa:()=>this.out('You already have all the keys. Coins — not so much.'),hesoyam:()=>this.out('Wrong game, CJ. No health or cash here.'),
  format:()=>{if(!/^c:?$/i.test(a)){this.out('Usage: FORMAT drive:');return;}this.out('\nWARNING! ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!\nProceed with Format (Y/N)? Y\n');let p=0;const sp=document.createElement('span');$('cmdo').appendChild(sp);Sfx.error();
   const iv=setInterval(()=>{if(!$('cmdo')){clearInterval(iv);return;}p+=Math.random()*7+2;if(p>=100)p=100;sp.textContent=`Formatting ${p.toFixed(0).padStart(3)}% [${'█'.repeat(p/4|0).padEnd(25,'░')}]  ${['Deleting balls…','Wiping saves…','Destroying high scores…','Deleting Clippo…','Burning coins…'][p/21|0]||''}\n`;
    if(p>=100){clearInterval(iv);setTimeout(()=>{sp.remove();this.out('\n😜 GOTCHA! Nothing was deleted. Your balls, coins and high scores are totally safe.\nBut the look on your face — priceless.\n');Sfx.ding();if(Clip.on)Clip.say('Ha-ha! You really fell for it? I’d never let anyone format the drive. I’m a paperclip, I hold everything together!');this.prompt();},700);}},180);return 'wait';}};
  const f=map[c];if(f)return f();this.out(`"${c0}" is not recognized as an internal or external command, operable program or batch file.`);}};
window.Cmd=Cmd;
function KF0(id){try{KF=id;}catch(e){}}

// ---------- secrets: rainbow, matrix, gravity, BSOD ----------
const Fun={rainbow:false,nograv:false,
 matrix(){if($('mrain'))return;const c=document.createElement('canvas');c.id='mrain';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const g=c.getContext('2d'),cols=Math.ceil(c.width/16),y=Array(cols).fill(0).map(()=>Math.random()*-50);const ch='BALLS98CUBE01アイウエオ●○◎';
  const t0=performance.now();let stop=false;const end=()=>{stop=true;c.remove();removeEventListener('keydown',end,true);removeEventListener('pointerdown',end,true);};setTimeout(()=>{addEventListener('keydown',end,true);addEventListener('pointerdown',end,true);},300);
  const loop=()=>{if(stop)return;g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,0,c.width,c.height);g.fillStyle='#0f0';g.font='15px monospace';y.forEach((v,i)=>{g.fillText(ch[Math.random()*ch.length|0],i*16,v*16);y[i]=v*16>c.height&&Math.random()>.975?0:v+1;});if(performance.now()-t0<15000)requestAnimationFrame(loop);else end();};loop();},
 gravity(off){this.nograv=off;const ics=[...document.querySelectorAll('#icons .icon')];cancelAnimationFrame(this.graf);
  if(!off){ics.forEach(n=>{n.style.transition='transform .8s';n.style.transform='';setTimeout(()=>n.style.transition='',850);});return;}
  const st=ics.map(n=>({n,x:0,y:0,vx:(Math.random()-.5)*2,vy:-Math.random()*2-.5,r:0,vr:(Math.random()-.5)*2}));const loop=()=>{if(!this.nograv)return;st.forEach(s=>{const b=s.n.getBoundingClientRect();s.x+=s.vx;s.y+=s.vy;s.r+=s.vr;
   if(b.left<0&&s.vx<0||b.right>innerWidth&&s.vx>0)s.vx*=-1;if(b.top<0&&s.vy<0||b.bottom>innerHeight-30&&s.vy>0)s.vy*=-1;s.n.style.transform=`translate(${s.x}px,${s.y}px) rotate(${s.r}deg)`;});this.graf=requestAnimationFrame(loop);};loop();},
 bsod(){if($('bsod'))return;const d=document.createElement('div');d.id='bsod';d.innerHTML=`<div style="max-width:760px;padding:20px"><div style="text-align:center;margin-bottom:24px"><span class="t">Ball Brawl 98</span></div>
  A fatal exception 0E has occurred at 0028:C0DE4A11 in VxD BALL(01) + 00001998.<br>The ball rolled out of memory and cannot be found.<br><br>
  *  Press any key to put the ball back.<br>*  Press CTRL+ALT+DEL to… nah, just press any key.<br>*  Don’t worry: progress, coins and balls are saved. This is a joke.<br><br>
  <div style="text-align:center">Press any key to continue <span id="bsc">_</span></div></div>`;document.body.appendChild(d);Sfx.error();
  const bl=setInterval(()=>{const e=$('bsc');if(e)e.style.visibility=e.style.visibility==='hidden'?'':'hidden';},500);
  const end=e=>{if(e)e.preventDefault();clearInterval(bl);d.remove();removeEventListener('keydown',end,true);removeEventListener('pointerdown',end,true);setTimeout(()=>Clip.say('Phew, what was that? I got scared more than you did.'),400);};
  setTimeout(()=>{addEventListener('keydown',end,true);addEventListener('pointerdown',end,true);},400);}};
window.Fun=Fun;
const _ds=window.drawSphere;window.drawSphere=function(x,y,r,c,...rest){if(Fun.rainbow&&r>14)c=`hsl(${(G_t*120+x*.5)%360},90%,55%)`;return _ds.call(this,x,y,r,c,...rest);};
// konami code
{const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let i=0;addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;const kk=k==='и'?'b':k==='ф'?'a':k;if(kk===K[i]){i++;if(i===K.length){i=0;Fun.bsod();}}else i=kk===K[0]?1:0;});}
const _sd=UI.shutdown;UI.shutdown=function(){if(Math.random()<.01||window.__bsod)return Fun.bsod();return _sd.apply(this,arguments);};

// ---------- PING CHAT ----------
const Icq={MAX:200,log:[],
 open(){const peer=Net&&Net.conn&&Net.conn.open;openWin('icq','Ping Chat — '+(peer?'rival online':'no connection'),`<div class="icq"><div style="display:flex;align-items:center;gap:6px;font-size:12px;margin-bottom:4px"><span style="width:20px;height:20px;display:inline-block">${ICQ_ICO}</span><b>${peer?'🟢 Rival':'🔴 Offline'}</b><span style="margin-left:auto;color:#666">UIN: ${(Math.random()*9e8+1e8)|0}</span></div>
  <div class="log" id="icql"></div><div class="row"><input id="icqi" maxlength="${this.MAX}" placeholder="${peer?'Message (up to '+this.MAX+' chars), Enter — send':'Chat works during online matches'}"><button style="min-width:0" onclick="Icq.send()">Send</button></div><div id="icqc" style="font-size:11px;color:#666;text-align:right">0/${this.MAX}</div></div>`,{w:340,icon:'🌼'});
  const i=$('icqi');i.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')this.send();};i.onkeyup=e=>e.stopPropagation();i.oninput=()=>{$('icqc').textContent=i.value.length+'/'+this.MAX;};this.render();},
 render(){const l=$('icql');if(!l)return;l.innerHTML='';this.log.forEach(m=>{const d=document.createElement('div');const b=document.createElement('b');if(m.me)b.className='me';b.textContent=(m.me?'You':'Rival')+` (${m.t}): `;d.appendChild(b);d.appendChild(document.createTextNode(m.m));l.appendChild(d);});l.scrollTop=1e9;},
 add(m,me){this.log.push({m:String(m).slice(0,this.MAX),me,t:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})});if(this.log.length>100)this.log.shift();this.render();},
 send(){const i=$('icqi');if(!i)return;const v=i.value.trim().slice(0,this.MAX);if(!v)return;if(!(Net.conn&&Net.conn.open)){toast('🌼 Ping Chat: no connection to rival');return;}const now=Date.now();if(now-(this.lastS||0)<700){toast('🌼 Slow down!');return;}this.lastS=now;
  Net.send({t:'chat',m:v});this.add(v,true);i.value='';$('icqc').textContent='0/'+this.MAX;},
 recv(m){if(typeof m!=='string')return;const now=Date.now();if(now-(this.lastR||0)<300)return;this.lastR=now;m=m.slice(0,this.MAX);this.add(m,false);S.uhoh();
  const w=$('w_icq');if(!w||w.classList.contains('hide')){this.open();const gw=$('gamewin');if(gw&&!gw.classList.contains('hide'))front(gw);}toast('🌼 New message in Ping Chat');}};
window.Icq=Icq;
const _od=Net.onData.bind(Net);Net.onData=function(d){if(d&&d.t==='chat')return Icq.recv(d.m);return _od(d);};
const _setup=Net.setup.bind(Net);Net.setup=function(c){Icq.log=[];c.on('open',()=>{setTimeout(()=>{Icq.open();Icq.add('Connected. Don’t forget to wish your rival good luck!',false);Icq.log.at(-1).sys=1;},300);});return _setup(c);};

// ---------- game hooks ----------
const _nm=window.newMatch;window.newMatch=function(){Rep.cur=null;Hool.stop();const r=_nm.apply(this,arguments);Rep.start();return r;};
const _om=window.onMatchOver;window.onMatchOver=function(){const w=G.winner,won=G.kind==='local'||w===G.me;Rep.end();const r=_om.apply(this,arguments);
  if(won&&w>=0)setTimeout(()=>{try{Hool.fire(w);}catch(e){console.warn(e);}},350);else setTimeout(()=>Clip.say(Clip.pick('lose')),800);return r;};
const _ow=window.openWin;window.openWin=function(id){const r=_ow.apply(this,arguments);if(TIPS[id]&&Clip.on&&Math.random()<.6&&!(Clip.seen||(Clip.seen={}))[id]){Clip.seen[id]=1;setTimeout(()=>Clip.say(Clip.pick(id)),700);}return r;};
const _rd=window.render;window.render=function(){try{Rep.rec();}catch(e){}return _rd.apply(this,arguments);};
const _mo=Media.open.bind(Media);Media.open=function(){_mo();const row=document.querySelector('#w_media .mp .row');if(row&&!row.querySelector('.rpb')){const b=document.createElement('button');b.className='rpb';b.style.minWidth='0';b.title='Last match replay';b.innerHTML='🎬 Match replay';b.onclick=()=>Rep.open();row.insertBefore(b,row.children[3]);}};

window.EXTRA=window.EXTRA||[];
window.EXTRA.push({k:'Command Prompt',ico:CMD_ICO,run:'Cmd.open()',cat:'std'},{k:'Ping Chat',ico:ICQ_ICO,run:'Icq.open()',cat:'std'},{k:'Clippo',ico:CLIP_ICO,run:'Clip.toggle()',cat:'std',nodesk:1},{k:'Replay',ico:REP_ICO,run:'Rep.open()',cat:'std',nodesk:1});
addEventListener('load',()=>setTimeout(()=>{Clip.init();if(Clip.on&&!localStorage.getItem('bf_clip_hi')){localStorage.setItem('bf_clip_hi','1');Clip.say('Hi! I’m Clippo, your helper. Click me for a tip. Not a fan? Hit “Don’t show again” 😢');}},3500));
})();
