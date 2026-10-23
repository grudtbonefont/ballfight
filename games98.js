'use strict';
// ===================== САПЁР =====================
const Mines={lv:{b:[9,9,10,'Новичок',5],i:[16,16,40,'Любитель',10],e:[30,16,99,'Профессионал',20]},cur:'b',
 open(l){if(l)this.cur=l;const [W,H,M,n]=this.lv[this.cur];Object.assign(this,{W,H,M,grid:[],st:'ready',t:0,flags:0,opened:0});clearInterval(this.ti);
  for(let i=0;i<W*H;i++)this.grid.push({m:0,o:0,f:0,n:0});
  openWin('mines','Сапёр',`<div style="font-size:12px;margin:-4px 0 6px">${Object.entries(this.lv).map(([k,v])=>`<a href="#" onclick="Mines.open('${k}');return false" style="margin-right:10px;color:#000;${k===this.cur?'font-weight:bold':''}">${v[3]}</a>`).join('')}</div>
  <div class="ms"><div class="hd"><div class="lcd" id="msm"></div><button class="sm" id="mss" onclick="Mines.open()">🙂</button><div class="lcd" id="mst">000</div></div>
  <div class="gr" id="msg" style="grid-template-columns:repeat(${W},22px)" oncontextmenu="return false"></div></div>`,{w:Math.max(260,W*22+40),icon:'💣'});
  const g=document.getElementById('msg');g.innerHTML=this.grid.map((_,i)=>`<div class="c" data-i="${i}"></div>`).join('');
  g.onpointerdown=e=>{const c=e.target.closest('.c');if(!c||this.st==='over')return;if(e.button===2){this.flag(+c.dataset.i);return;}document.getElementById('mss').textContent='😮';
   if(e.pointerType==='touch'){this.lp=setTimeout(()=>{this.lp=0;this.flag(+c.dataset.i);},450);}};
  g.onpointerup=e=>{const c=e.target.closest('.c');if(this.st!=='over')document.getElementById('mss').textContent='🙂';if(!c||e.button!==0||this.st==='over')return;if(e.pointerType==='touch'){if(!this.lp)return;clearTimeout(this.lp);this.lp=0;}const i=+c.dataset.i;
   if(this.grid[i].o)this.chord(i);else this.reveal(i);this.draw();};
  this.draw();},
 nb(i){const x=i%this.W,y=(i/this.W)|0,r=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<this.W&&Y<this.H)r.push(Y*this.W+X);}return r;},
 plant(safe){const ban=new Set([safe,...this.nb(safe)]);let k=0;while(k<this.M){const i=(Math.random()*this.W*this.H)|0;if(this.grid[i].m||ban.has(i))continue;this.grid[i].m=1;k++;}
  this.grid.forEach((c,i)=>c.n=this.nb(i).filter(j=>this.grid[j].m).length);this.st='play';this.t0=Date.now();this.ti=setInterval(()=>{this.t=Math.min(999,((Date.now()-this.t0)/1000)|0);const e=document.getElementById('mst');if(e)e.textContent=String(this.t).padStart(3,'0');},250);},
 flag(i){const c=this.grid[i];if(c.o)return;c.f=!c.f;this.flags+=c.f?1:-1;Sfx.click();this.draw();},
 reveal(i){if(this.st==='ready')this.plant(i);const c=this.grid[i];if(c.o||c.f)return;
  if(c.m){c.boom=1;this.end(false);return;}const q=[i];while(q.length){const j=q.pop(),d=this.grid[j];if(d.o||d.f)continue;d.o=1;this.opened++;if(!d.n)q.push(...this.nb(j).filter(k=>!this.grid[k].o&&!this.grid[k].m));}
  if(this.opened===this.W*this.H-this.M)this.end(true);},
 chord(i){const c=this.grid[i];if(!c.n||this.nb(i).filter(j=>this.grid[j].f).length!==c.n)return;for(const j of this.nb(i))if(this.st==='play')this.reveal(j);},
 end(win){this.st='over';clearInterval(this.ti);document.getElementById('mss').textContent=win?'😎':'😵';this.grid.forEach(c=>{if(c.m&&!c.f&&!win)c.o=1;if(c.m&&win)c.f=1;});
  if(win){Sfx.startup();Reward.give('mines',this.lv[this.cur][4],'💣 Сапёр пройден! '+this.lv[this.cur][3]+' за '+this.t+' с');}else Sfx.error();this.draw();},
 draw(){const g=document.getElementById('msg');if(!g)return;const col=['','#00f','#080','#f00','#008','#800','#088','#000','#888'];
  g.querySelectorAll('.c').forEach((el,i)=>{const c=this.grid[i];el.className='c'+(c.o?' o':'')+(c.boom?' boom':'');el.style.color=col[c.n]||'';
   el.textContent=c.o?(c.m?'💣':(c.n||'')):(c.f?'🚩':'');if(this.st==='over'&&c.f&&!c.m){el.textContent='❌';}});
  const m=document.getElementById('msm');if(m)m.textContent=String(Math.max(-99,this.M-this.flags)).padStart(3,'0');}};
// ===================== ШАХМАТЫ =====================
const CE={V:{p:100,n:320,b:330,r:500,q:900,k:0},
 init(){const r='rnbqkbnr';const b=[];for(let i=0;i<8;i++)b.push(r[i]);for(let i=0;i<8;i++)b.push('p');for(let i=0;i<32;i++)b.push('');for(let i=0;i<8;i++)b.push('P');for(let i=0;i<8;i++)b.push(r[i].toUpperCase());return {b,w:true,cr:'KQkq',ep:-1,hm:0};},
 isW:p=>p&&p===p.toUpperCase(),
 att(b,sq,byW){const r=sq>>3,c=sq&7,P=x=>byW?x.toUpperCase():x;const at=(rr,cc)=>rr>=0&&rr<8&&cc>=0&&cc<8?b[rr*8+cc]:null;
  const pr=byW?r+1:r-1;if(at(pr,c-1)===P('p')||at(pr,c+1)===P('p'))return true;
  for(const [dr,dc] of [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]])if(at(r+dr,c+dc)===P('n'))return true;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if((dr||dc)&&at(r+dr,c+dc)===P('k'))return true;
  for(const [dr,dc,s] of [[1,0,'r'],[-1,0,'r'],[0,1,'r'],[0,-1,'r'],[1,1,'b'],[1,-1,'b'],[-1,1,'b'],[-1,-1,'b']]){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){const x=b[rr*8+cc];if(x){if(x===P(s)||x===P('q'))return true;break;}rr+=dr;cc+=dc;}}return false;},
 king(b,w){return b.indexOf(w?'K':'k');},
 inCheck(s,w){return this.att(s.b,this.king(s.b,w),!w);},
 pseudo(s){const b=s.b,w=s.w,mv=[];const own=x=>x&&this.isW(x)===w,foe=x=>x&&this.isW(x)!==w;
  for(let i=0;i<64;i++){const p=b[i];if(!own(p))continue;const r=i>>3,c=i&7,t=p.toLowerCase();
   const add=(to,o)=>mv.push(Object.assign({f:i,t:to},o||{}));
   if(t==='p'){const d=w?-1:1,r1=r+d,last=w?0:7,start=w?6:1;const pa=to=>{if((to>>3)===last)'qrbn'.split('').forEach(q=>add(to,{pr:q}));else add(to);};
    if(r1>=0&&r1<8&&!b[r1*8+c]){pa(r1*8+c);if(r===start&&!b[(r+2*d)*8+c])add((r+2*d)*8+c,{dbl:1});}
    for(const dc of [-1,1]){const cc=c+dc;if(cc<0||cc>7||r1<0||r1>7)continue;const to=r1*8+cc;if(foe(b[to]))pa(to);else if(to===s.ep)add(to,{ep:1});}}
   else if(t==='n'||t==='k'){const D=t==='n'?[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    for(const [dr,dc] of D){const rr=r+dr,cc=c+dc;if(rr<0||rr>7||cc<0||cc>7)continue;const to=rr*8+cc;if(!own(b[to]))add(to);}
    if(t==='k'){const R=w?7:0,K=w?'K':'k',Q=w?'Q':'q';if(i===R*8+4&&!this.att(b,i,!w)){
     if(s.cr.includes(K)&&!b[R*8+5]&&!b[R*8+6]&&b[R*8+7]===(w?'R':'r')&&!this.att(b,R*8+5,!w)&&!this.att(b,R*8+6,!w))add(R*8+6,{cs:1});
     if(s.cr.includes(Q)&&!b[R*8+3]&&!b[R*8+2]&&!b[R*8+1]&&b[R*8]===(w?'R':'r')&&!this.att(b,R*8+3,!w)&&!this.att(b,R*8+2,!w))add(R*8+2,{cs:1});}}}
   else{const D=t==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:t==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:[[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
    for(const [dr,dc] of D){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){const to=rr*8+cc;if(own(b[to]))break;add(to);if(b[to])break;rr+=dr;cc+=dc;}}}}
  return mv;},
 apply(s,m){const b=s.b.slice(),p=b[m.f],w=s.w;const cap=b[m.t];b[m.t]=m.pr?(w?m.pr.toUpperCase():m.pr):p;b[m.f]='';
  if(m.ep)b[m.t+(w?8:-8)]='';if(m.cs){const R=m.t>>3;if((m.t&7)===6){b[R*8+5]=b[R*8+7];b[R*8+7]='';}else{b[R*8+3]=b[R*8];b[R*8]='';}}
  let cr=s.cr;const rm=ch=>cr=cr.replace(ch,'');if(p==='K'){rm('K');rm('Q');}if(p==='k'){rm('k');rm('q');}
  [[63,'K'],[56,'Q'],[7,'k'],[0,'q']].forEach(([sq,ch])=>{if(m.f===sq||m.t===sq)rm(ch);});
  return {b,w:!w,cr,ep:m.dbl?(m.f+m.t)/2:-1,hm:(cap||p.toLowerCase()==='p')?0:s.hm+1};},
 legal(s){return this.pseudo(s).filter(m=>{const n=this.apply(s,m);return !this.att(n.b,this.king(n.b,s.w),!s.w);});},
 eval(s){let v=0;for(let i=0;i<64;i++){const p=s.b[i];if(!p)continue;const t=p.toLowerCase(),W=p!==t,r=i>>3,c=i&7;let x=this.V[t];
   const cen=3.5-Math.max(Math.abs(3.5-r),Math.abs(3.5-c));if(t==='n'||t==='b')x+=cen*8;if(t==='p')x+=(W?6-r:r-1)*6+(c>1&&c<6?cen*4:0);if(t==='q')x+=cen*2;
   v+=W?x:-x;}return s.w?v:-v;},
 search(s,d,a,bt){const ms=this.legal(s);if(!ms.length)return this.inCheck(s,s.w)?-100000-d:0;if(d===0)return this.eval(s);
  ms.sort((x,y)=>(s.b[y.t]?this.V[s.b[y.t].toLowerCase()]:0)-(s.b[x.t]?this.V[s.b[x.t].toLowerCase()]:0));
  for(const m of ms){const v=-this.search(this.apply(s,m),d-1,-bt,-a);if(v>a)a=v;if(a>=bt)break;}return a;},
 best(s,d,noise){const ms=this.legal(s);let best=null,bv=-1e9;ms.sort(()=>Math.random()-.5);
  for(const m of ms){const v=-this.search(this.apply(s,m),d-1,-1e9,1e9)+(noise?Math.random()*noise:0)+(m.pr&&m.pr!=='q'?-500:0);if(v>bv){bv=v;best=m;}}return best;}};
const Chess={G:{p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'},lvls:[['Лёгкий',1,60,10],['Средний',2,15,20],['Сложный',3,0,40]],ai:0,hw:true,flip:false,
 open(){openWin('chess','Шахматы',`<div class="chtool"><label>Соперник: <select id="chai" onchange="Chess.cfg()">${this.lvls.map((l,i)=>`<option value="${i}">🤖 Компьютер — ${l[0]}</option>`).join('')}<option value="-1">👥 Вдвоём</option></select></label>
  <label id="chcolw">Цвет: <select id="chcol" onchange="Chess.cfg()"><option value="w">♔ Белые</option><option value="b">♚ Чёрные</option></select></label>
  <button onclick="Chess.start()">🆕 Новая игра</button><button onclick="Chess.undo()" title="Отменить ход">↶</button><button onclick="Chess.flip=!Chess.flip;Chess.draw()" title="Перевернуть доску">⇅</button></div>
  <div class="ch"><div class="bwrap"><div class="cap" id="chcapT"></div><div class="bdo"><div class="bd" id="chb"></div><div class="over hide" id="chover"></div></div><div class="cap" id="chcapB"></div></div>
  <div class="side"><div class="inset log" id="chlog"></div><div id="chpr"></div></div></div><div class="sbar"><span id="chst"></span><span id="chmv"></span></div>`,{w:640,icon:'♞'});
  const w=document.getElementById('w_chess');if(!w.dataset.ro){w.dataset.ro=1;new ResizeObserver(()=>this.fit()).observe(w);}
  document.getElementById('chai').value=this.ai;document.getElementById('chcol').value=this.hw?'w':'b';
  if(!this.s)this.start();else this.draw();this.fit();},
 cfg(){this.ai=+document.getElementById('chai').value;this.hw=document.getElementById('chcol').value==='w';this.start();},
 fit(){const w=document.getElementById('w_chess');if(!w||w.classList.contains('hide'))return;const wb=w.querySelector('.wb');
  const narrow=innerWidth<640;const aw=wb.clientWidth-(narrow?24:230),ah=(w.classList.contains('max')||w.classList.contains('sized'))?wb.clientHeight-120:innerHeight-230;
  const q=Math.max(26,Math.min(72,Math.floor(Math.min(aw,ah)/8.4)));w.style.setProperty('--sq',q+'px');},
 start(){this.s=CE.init();this.hist=[];this.log=[];this.sel=-1;this.last=null;this.over=false;this.pend=null;this.thinking=false;this.flip=this.ai>=0&&!this.hw;
  document.getElementById('chcolw')&&(document.getElementById('chcolw').style.display=this.ai>=0?'':'none');this.draw();this.aiTurn();},
 human(){return this.ai<0||this.s.w===this.hw;},
 glyph(p){const t=p.toLowerCase();return `<span class="pc ${p===t?'pb':'pw'}">${this.G[t]}\uFE0E</span>`;},
 sqName:i=>'abcdefgh'[i&7]+(8-(i>>3)),
 caps(){const init={p:8,n:2,b:2,r:2,q:1};const c={w:'',b:''};for(const col of ['w','b']){for(const t of 'qrbnp'){const P=col==='w'?t.toUpperCase():t;const n=init[t]-this.s.b.filter(x=>x===P).length;for(let i=0;i<Math.max(0,n);i++)c[col]+=this.glyph(P);}}return c;},
 draw(){const el=document.getElementById('chb');if(!el)return;const s=this.s;const ms=CE.legal(s);const tg=this.sel>=0?ms.filter(m=>m.f===this.sel).map(m=>m.t):[];const ck=CE.inCheck(s,s.w)?CE.king(s.b,s.w):-1;
  const order=[...Array(64).keys()];if(this.flip)order.reverse();
  el.innerHTML=order.map(i=>{const p=s.b[i],r=i>>3,c=i&7;const fl=this.flip?r===0:r===7,rk=this.flip?c===7:c===0;
   return `<div class="q ${(r+c)%2?'d':'l'}${i===this.sel?' s':''}${this.last&&(i===this.last.f||i===this.last.t)?' lm':''}${i===ck?' ck':''}${tg.includes(i)?(p||(this.sel>=0&&s.b[this.sel].toLowerCase()==='p'&&(i&7)!==(this.sel&7))?' tc':' t'):''}" data-i="${i}">${p?this.glyph(p):''}${rk?`<i class="rk">${8-r}</i>`:''}${fl?`<i class="fl">${'abcdefgh'[c]}</i>`:''}</div>`;}).join('');
  if(!el.dataset.ev){el.dataset.ev=1;el.addEventListener('pointerdown',e=>this.down(e));}
  const cp=this.caps();const top=this.flip?'w':'b';// top player's captured pieces: those they took = opponent pieces
  document.getElementById('chcapT').innerHTML=cp[top==='w'?'b':'w']||'&nbsp;';document.getElementById('chcapB').innerHTML=cp[top]||'&nbsp;';
  let st,end=null;
  if(!ms.length){end=CE.inCheck(s,s.w)?{w:!s.w,t:'Мат!'}:{w:null,t:'Пат — ничья'};}
  else if(s.hm>=100)end={w:null,t:'Ничья (правило 50 ходов)'};else if(this.insuf())end={w:null,t:'Ничья — недостаточно фигур'};
  if(end){st=end.t;this.finish(end);}else st=this.thinking?'🤔 Компьютер думает…':`Ход ${s.w?'белых ♔':'чёрных ♚'}${this.ai>=0?(this.human()?' (ваш ход)':''):''}${ck>=0?' — ШАХ!':''}`;
  document.getElementById('chst').textContent=st;document.getElementById('chmv').textContent=`Ход №${Math.floor(this.log.length/2)+1} · ${this.ai>=0?'vs '+this.lvls[this.ai][0]:'Вдвоём'}`;
  const lg=document.getElementById('chlog');let h='<table>';for(let i=0;i<this.log.length;i+=2)h+=`<tr><td>${i/2+1}.</td><td>${this.log[i]}</td><td>${this.log[i+1]||''}</td></tr>`;lg.innerHTML=(this.log.length?h+'</table>':'<i style="color:#808080">Ходов пока нет</i>');lg.scrollTop=1e5;
  document.getElementById('chpr').innerHTML=this.pend?'<b>Превратить пешку в:</b><br>'+'qrbn'.split('').map(q=>`<button class="prb" onclick="Chess.promo('${q}')">${this.glyph(s.w?q.toUpperCase():q)}</button>`).join(''):'';},
 insuf(){const p=this.s.b.filter(x=>x&&x.toLowerCase()!=='k');return !p.length||(p.length===1&&'nb'.includes(p[0].toLowerCase()));},
 finish(end){if(this.over)return;this.over=true;let msg=end.t,ico='🤝';
  if(end.w!==null){const wn=end.w?'белые':'чёрные';if(this.ai>=0){if(end.w===this.hw){const r=Reward.give('chess',this.lvls[this.ai][3],'♞ Победа в шахматах');msg+=r?` Вы победили! +${r} 🪙`:' Вы победили! (лимит наград на сегодня)';ico='🏆';Sfx.startup();}else{msg+=' Компьютер победил.';ico='💀';Sfx.error();}}else{msg+=` Победили ${wn}.`;ico='🏆';Sfx.ding();}}else Sfx.ding();
  const o=document.getElementById('chover');o.innerHTML=`<div class="dlgw"><div class="tb"><span>♞ Партия окончена</span></div><div style="padding:10px;text-align:center"><div style="font-size:34px">${ico}</div><div style="margin:6px 0 10px">${msg}</div><button onclick="Chess.start()">Новая игра</button> <button onclick="document.getElementById('chover').classList.add('hide')">Смотреть доску</button></div></div>`;
  setTimeout(()=>o.classList.remove('hide'),400);},
 down(e){const q=e.target.closest('.q');if(!q||this.over||this.pend||this.thinking||!this.human())return;e.preventDefault();const i=+q.dataset.i,s=this.s,p=s.b[i];
  if(this.sel>=0&&this.tryMove(this.sel,i))return;
  if(!(p&&CE.isW(p)===s.w)){this.sel=-1;this.draw();return;}
  const was=this.sel===i;this.sel=i;Sfx.click();this.draw();
  const src=document.querySelector(`#chb .q[data-i="${i}"] .pc`);const gh=src.cloneNode(true);gh.className+=' ghost';document.body.appendChild(gh);const sz=document.getElementById('chb').firstChild.offsetWidth;gh.style.fontSize=sz*.8+'px';
  const pos=ev=>{gh.style.left=ev.clientX-sz/2+'px';gh.style.top=ev.clientY-sz/2+'px';};pos(e);let moved=false;const sx=e.clientX,sy=e.clientY;
  const mv=ev=>{if(Math.hypot(ev.clientX-sx,ev.clientY-sy)>4){moved=true;src.style.opacity=.25;}if(moved)pos(ev);};
  const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);gh.remove();src.style.opacity='';
   const t=document.elementsFromPoint(ev.clientX,ev.clientY).find(x=>x.classList&&x.classList.contains('q')&&x.closest('#chb'));
   if(moved&&t&&+t.dataset.i!==i){if(!this.tryMove(i,+t.dataset.i)){this.draw();}}else if(!moved&&was){this.sel=-1;this.draw();}};
  addEventListener('pointermove',mv);addEventListener('pointerup',up);},
 tryMove(f,t){const ms=CE.legal(this.s).filter(m=>m.f===f&&m.t===t);if(!ms.length)return false;if(ms.length>1){this.pend=ms;this.sel=f;this.draw();return true;}this.make(ms[0]);return true;},
 promo(q){const m=this.pend.find(x=>x.pr===q);this.pend=null;this.make(m);},
 san(s,m){const p=s.b[m.f].toLowerCase();if(m.cs)return (m.t&7)===6?'O-O':'O-O-O';const cap=s.b[m.t]||m.ep;const L={n:'К',b:'С',r:'Л',q:'Ф',k:'Кр'};return (p==='p'?(cap?'abcdefgh'[m.f&7]:''):L[p])+(cap?'x':'')+this.sqName(m.t)+(m.pr?'='+L[m.pr]:'');},
 make(m){const cap=this.s.b[m.t]||m.ep;this.hist.push({s:this.s,log:this.log.slice(),last:this.last});let n=this.san(this.s,m);this.s=CE.apply(this.s,m);if(CE.inCheck(this.s,this.s.w))n+=CE.legal(this.s).length?'+':'#';this.log.push(n);this.last=m;this.sel=-1;
  Sfx.tone(cap?300:520,0,.06,'square',.06);this.draw();this.aiTurn();},
 aiTurn(){if(this.ai<0||this.over||this.human())return;this.thinking=true;this.draw();const tok=this.tok=(this.tok||0)+1;
  setTimeout(()=>{if(tok!==this.tok)return;const L=this.lvls[this.ai];const bm=CE.best(this.s,L[1],L[2]);this.thinking=false;if(bm)this.make(bm);else this.draw();},350);},
 undo(){if(!this.hist.length)return;this.tok++;this.thinking=false;let n=this.ai>=0&&this.hist.length>=2&&(this.human()||this.over)?2:1;if(this.ai>=0&&!this.human()&&!this.over)n=1;let h;while(n--&&this.hist.length)h=this.hist.pop();this.s=h.s;this.log=h.log;this.last=h.last;this.over=false;this.sel=-1;this.pend=null;
  document.getElementById('chover').classList.add('hide');this.draw();this.aiTurn();}};
(function(){const st=document.createElement('style');st.textContent=`
#w_chess{--sq:52px}#w_chess .wb{display:flex;flex-direction:column}
.chtool{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px}.chtool button{min-width:0;padding:2px 8px}.chtool select{font:inherit}
.ch{display:flex;gap:10px;flex-wrap:wrap;flex:1}.ch .bwrap{display:flex;flex-direction:column}.ch .cap{min-height:calc(var(--sq)*.45);font-size:calc(var(--sq)*.38);line-height:1}
.ch .bdo{position:relative}.ch .bd{display:grid;grid-template-columns:repeat(8,var(--sq));border:3px solid;border-color:#808080 #fff #fff #808080;touch-action:none}
.ch .q{width:var(--sq);height:var(--sq);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative}
.ch .q.l{background:#f0d9b5}.ch .q.d{background:#b58863}.ch .q.lm{background:#cdd26a}.ch .q.d.lm{background:#aaa23a}.ch .q.s{background:#7fb3ff!important}.ch .q.ck{background:radial-gradient(#f00,#f55 40%,transparent 75%)}
.ch .q.t::after{content:"";width:28%;height:28%;border-radius:50%;background:rgba(0,0,90,.35);position:absolute}.ch .q.tc::after{content:"";position:absolute;inset:3%;border:calc(var(--sq)*.07) solid rgba(0,0,90,.45);border-radius:50%}
.pc{font-family:"DejaVu Sans","Segoe UI Symbol","Noto Sans Symbols2",serif;font-size:calc(var(--sq)*.8);line-height:1;pointer-events:none}
.pc.pw{color:#fff;-webkit-text-stroke:1.5px #000;text-shadow:1px 1px 1px rgba(0,0,0,.5)}.pc.pb{color:#111;text-shadow:0 0 1px #fff}
.ch .cap .pc{font-size:inherit;-webkit-text-stroke-width:1px}
.pc.ghost{position:fixed;z-index:99999;pointer-events:none;width:auto}
.ch .q i{position:absolute;font:bold calc(var(--sq)*.2) Tahoma;font-style:normal;pointer-events:none}.ch .q i.rk{left:2px;top:1px}.ch .q i.fl{right:2px;bottom:0}.ch .q.l i{color:#b58863}.ch .q.d i{color:#f0d9b5}
.ch .side{flex:1;min-width:170px;display:flex;flex-direction:column;gap:6px}.ch .log{flex:1;min-height:120px;max-height:calc(var(--sq)*8);overflow:auto;font:12px "Courier New",monospace}.ch .log td{padding:0 4px}
.prb{min-width:0!important;padding:0 4px!important;margin:2px}.prb .pc{font-size:30px}
.ch .over{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.25)}.ch .over.hide{display:none}
.dlgw{background:#c0c0c0;border:2px solid;border-color:#dfdfdf #000 #000 #dfdfdf;min-width:220px}.dlgw .tb{cursor:default}
.sbar{display:flex;justify-content:space-between;gap:8px;margin-top:6px;font-size:12px}.sbar span{border:1px solid;border-color:#808080 #fff #fff #808080;padding:1px 6px}.sbar span:first-child{flex:1}
@media(max-width:640px){#w_chess .ch .side{min-width:100%}}`;document.head.appendChild(st);})();
