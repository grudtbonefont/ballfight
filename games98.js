'use strict';
// ===================== САПЁР =====================
const Mines={lv:{b:[9,9,10,'Новичок',15],i:[16,16,40,'Любитель',40],e:[30,16,99,'Профессионал',100]},cur:'b',
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
  if(win){const r=this.lv[this.cur][4];save.coins+=r;persist();Sfx.startup();toast('💣 Сапёр пройден!',`${this.lv[this.cur][3]} за ${this.t} с — +${r} 🪙`);}else Sfx.error();this.draw();},
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
const Chess={G:{b:'♟',n:'♞',bb:'♝',r:'♜',q:'♛',k:'♚'},lvls:[['Лёгкий',1,60,30],['Средний',2,15,60],['Сложный',3,0,120]],
 open(){openWin('chess','Шахматы',`<div style="margin-bottom:8px"><b>Новая игра:</b> ${this.lvls.map((l,i)=>`<button onclick="Chess.start(${i})">🤖 ${l[0]}</button>`).join(' ')} <button onclick="Chess.start(-1)">👥 Вдвоём</button></div>
  <div class="ch"><div class="bd" id="chb"></div><div class="side"><div id="chst" class="inset" style="margin-bottom:6px;min-height:40px"></div><div class="log inset" id="chlog"></div>
  <div id="chpr" style="margin-top:6px"></div><button style="margin-top:6px" onclick="Chess.undo()">↶ Отменить ход</button></div></div>`,{w:620,icon:'♞'});
  if(!this.s)this.start(0);else this.draw();},
 start(l){this.ai=l;this.s=CE.init();this.hist=[];this.log=[];this.sel=-1;this.last=null;this.over=false;this.pend=null;this.draw();},
 glyph(p){const t=p.toLowerCase();return `<span class="${p===t?'pb':'pw'}">${t==='b'?this.G.bb:this.G[t]}</span>`;},
 sqName:i=>'abcdefgh'[i&7]+(8-(i>>3)),
 draw(){const el=document.getElementById('chb');if(!el)return;const s=this.s;const tg=this.sel>=0?CE.legal(s).filter(m=>m.f===this.sel).map(m=>m.t):[];const ck=CE.inCheck(s,s.w)?CE.king(s.b,s.w):-1;
  el.innerHTML=s.b.map((p,i)=>`<div class="q ${((i>>3)+(i&7))%2?'d':'l'}${i===this.sel?' s':''}${this.last&&(i===this.last.f||i===this.last.t)?' lm':''}${i===ck?' ck':''}${tg.includes(i)?(p?' tc':' t'):''}" data-i="${i}">${p?this.glyph(p):''}</div>`).join('');
  el.onpointerdown=e=>{const q=e.target.closest('.q');if(q)this.press(+q.dataset.i,false);};
  el.onpointerup=e=>{const q=document.elementFromPoint(e.clientX,e.clientY);const qq=q&&q.closest&&q.closest('#chb .q');if(qq&&+qq.dataset.i!==this.sel&&this.sel>=0)this.press(+qq.dataset.i,true);};
  const ms=CE.legal(s);let st;
  if(!ms.length){st=CE.inCheck(s,s.w)?`<b>Мат!</b> Победили ${s.w?'чёрные':'белые'}.`:'<b>Пат</b> — ничья.';this.finish(ms.length||!CE.inCheck(s,s.w)?null:!s.w);}
  else if(s.hm>=100||s.b.filter(x=>x).length===2){st='<b>Ничья</b>.';this.finish(null);}
  else st=`Ход: <b>${s.w?'белые ♔':'чёрные ♚'}</b>${ck>=0?' — <span style="color:red">шах!</span>':''}<br><small>${this.ai>=0?'Против компьютера ('+this.lvls[this.ai][0]+')':'Вдвоём на одном устройстве'}</small>`;
  document.getElementById('chst').innerHTML=st;const lg=document.getElementById('chlog');lg.innerHTML=this.log.map((m,i)=>i%2?' '+m+'<br>':(i/2+1)+'. '+m).join('');lg.scrollTop=1e5;
  document.getElementById('chpr').innerHTML=this.pend?'Превращение: '+'qrbn'.split('').map(q=>`<button style="min-width:0;font-size:20px;padding:0 6px" onclick="Chess.promo('${q}')">${this.glyph(s.w?q.toUpperCase():q)}</button>`).join(''):'';},
 finish(whiteWon){if(this.over)return;this.over=true;if(whiteWon===true&&this.ai>=0){const r=this.lvls[this.ai][3];save.coins+=r;persist();Sfx.startup();toast('♞ Победа в шахматах!',`+${r} 🪙 (${this.lvls[this.ai][0]})`);}else if(whiteWon===false&&this.ai>=0)Sfx.error();else Sfx.ding();},
 press(i,isUp){if(this.over||this.pend||(this.ai>=0&&!this.s.w)||this.thinking)return;const s=this.s,p=s.b[i];
  if(this.sel>=0){const ms=CE.legal(s).filter(m=>m.f===this.sel&&m.t===i);if(ms.length){if(ms.length>1){this.pend=ms;this.draw();return;}this.make(ms[0]);return;}}
  if(isUp)return;if(p&&CE.isW(p)===s.w){this.sel=i;Sfx.click();}else this.sel=-1;this.draw();},
 promo(q){const m=this.pend.find(x=>x.pr===q);this.pend=null;this.make(m);},
 san(s,m){const p=s.b[m.f].toLowerCase();if(m.cs)return (m.t&7)===6?'O-O':'O-O-O';const cap=s.b[m.t]||m.ep;return (p==='p'?(cap?'abcdefgh'[m.f&7]:''):p.toUpperCase().replace('B','С').replace('N','К').replace('R','Л').replace('Q','Ф').replace('K','Кр'))+(cap?'x':'')+this.sqName(m.t)+(m.pr?'='+m.pr.toUpperCase():'');},
 make(m){this.hist.push({s:this.s,log:this.log.slice(),last:this.last});let n=this.san(this.s,m);this.s=CE.apply(this.s,m);if(CE.inCheck(this.s,this.s.w))n+=CE.legal(this.s).length?'+':'#';this.log.push(n);this.last=m;this.sel=-1;
  CE.V&&(this.s.b[m.t]&&Sfx.tone(this.hist.at(-1).s.b[m.t]?300:520,0,.06,'square',.06));this.draw();
  if(this.ai>=0&&!this.s.w&&!this.over){this.thinking=true;document.getElementById('chst').innerHTML+='<br>🤔 Компьютер думает…';
   setTimeout(()=>{const L=this.lvls[this.ai];const bm=CE.best(this.s,L[1],L[2]);this.thinking=false;if(bm)this.make(bm);},250);}},
 undo(){if(this.thinking||!this.hist.length)return;let n=this.ai>=0&&this.s.w&&this.hist.length>=2?2:1;let h;while(n--&&this.hist.length)h=this.hist.pop();this.s=h.s;this.log=h.log;this.last=h.last;this.over=false;this.sel=-1;this.pend=null;this.draw();}};
