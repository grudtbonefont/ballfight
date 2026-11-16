// ===== events98.js — seasonal events by date: Halloween, New Year =====
(function(){
const $=id=>document.getElementById(id);
Object.assign(LOGO.L,{
 pumpkin:['e','M12 6c-5 0-9 3-9 7.5S7 21 12 21s9-3 9-7.5S17 6 12 6zM7 11l3 3H6zM17 11l1 3h-4zM7 16h10l-1.5 2h-7zM11 2h2l1 4h-4z'],
 ghost:['e','M5 21V10a7 7 0 0 1 14 0v11l-2.3-2-2.4 2-2.3-2-2.3 2-2.4-2zM8 9.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0zM13 9.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0z'],
 bat:['f','M12 8l1-2.5 1 2.5c2.5-1.5 6-1.5 9 1-2 .3-3 2-3 4.5-1.3-1.3-3-1.3-4 .5-.8-1-2-1.5-3-1.5s-2.2.5-3 1.5c-1-1.8-2.7-1.8-4-.5 0-2.5-1-4.2-3-4.5 3-2.5 6.5-2.5 9-1l1-2.5z'],
 snowman:['f','M12 2.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7zM12 9.5a6 6 0 1 0 0 12a6 6 0 1 0 0-12z'],
 cracker:['f','M2 12l5-4v8zM22 12l-5-4v8zM7 8.5h10v7H7zM10 4l1 3M14 4l-1 3M12 3v3']});
const EV=[{id:'halloween',name:'Halloween',from:[10,15],to:[11,5],cur:'🍬',curN:'Candy',balls:['pumpkin','ghost','bat'],price:60,col:'#ff7518',bg:'#1a0d24'},
 {id:'newyear',name:'New Year',from:[12,20],to:[1,10],cur:'❄️',curN:'Snowflakes',balls:['snowman','cracker'],price:60,col:'#4fc3f7',bg:'#0b2340'}];
const inR=(d,e)=>{const m=d.getMonth()+1,x=m*100+d.getDate(),a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];return a<=b?x>=a&&x<=b:x>=a||x<=b;};
const active=()=>{const t=(new URLSearchParams(location.search)).get('event');if(t)return EV.find(e=>e.id===t)||null;return EV.find(e=>inR(new Date(),e))||null;};
const E=active();window.EVENTS={list:EV,active:E,inR};
if(!E)return;
const day=()=>new Date().toDateString();
const st=()=>{save.ev=save.ev||{};const s=save.ev[E.id]=save.ev[E.id]||{c:0,q:{},day:'',snap:null,opened:0};
 if(s.day!==day()){s.day=day();s.q={};s.snap={m:save.stats.matches,w:save.stats.wins,a:save.stats.abil,o:s.opened};}return s;};
const Q=[{id:'m',n:'Play 3 matches',k:'m',need:3,r:15},{id:'w',n:'Win 2 times',k:'w',need:2,r:20},{id:'a',n:'Use your ability 15 times',k:'a',need:15,r:10},{id:'o',n:'Open the event crate',k:'o',need:1,r:10}];
const prog=q=>{const s=st(),c={m:save.stats.matches,w:save.stats.wins,a:save.stats.abil,o:s.opened};return Math.max(0,Math.min(q.need,c[q.k]-s.snap[q.k]));};
const add=n=>{st().c+=n;persist();upd();};
// earn currency
// ---- bonus sources (modest, shared daily cap) ----
const BCAP=20,LIM={pk:5,pump:4,mini:3};
const bst=()=>{const s=st();if(!s.b||s.b.d!==day())s.b={d:day(),t:0,n:{}};return s.b;};
const bonus=(k,n,why)=>{const b=bst();if(LIM[k]&&(b.n[k]||0)>=LIM[k])return 0;n=Math.min(n,BCAP-b.t);if(n<=0)return 0;b.t+=n;b.n[k]=(b.n[k]||0)+1;add(n);try{toast(E.cur+' +'+n+' '+E.curN.toLowerCase(),why+' (bonus today: '+b.t+'/'+BCAP+')');}catch(e){}return n;};
window.EVENTS.bonusLeft=()=>BCAP-bst().t;
try{PKT.candy={n:'Candy',c:E.col,s:E.cur};}catch(e){}
window.EVENTS.candyPk=()=>{try{if(!G||G.kind==='online'||G.kind==='local'||G.multi&&G.kind==='online')return false;const b=bst();if(b.t>=BCAP||(b.n.pk||0)>=LIM.pk||G.pk.some(p=>p.k==='candy'))return false;return Math.random()<.12;}catch(e){return false;}};
window.EVENTS.candyGet=()=>{if(bonus('pk',1,'Grabbed candy in the arena'))try{emit({k:'float',x:G.balls[G.me].x,y:G.balls[G.me].y-30,s:'+1 '+E.cur,c:E.col});}catch(e){}};
let pend='';
const _rmB=window.recordMatch;window.recordMatch=function(won){const r=_rmB.apply(this,arguments);try{const s=st();const parts=[];const kind=G&&G.kind;
 if(kind!=='local'){if(won){s.ws=(s.ws||0)+1;if(s.fw!==day()){s.fw=day();const n=bonus('fw',3,'First win of the day');if(n)parts.push('first win of the day +'+n);}
   if(s.ws%3===0){const n=bonus('st'+s.ws,2,'Streak of '+s.ws+' wins');if(n)parts.push('streak '+s.ws+' wins +'+n);}
   if(kind==='daily'&&s.dc!==day()){s.dc=day();const n=bonus('dc',3,'Daily Challenge');if(n)parts.push('daily challenge +'+n);}
   if(kind==='surv'&&typeof Surv!=='undefined'&&Surv.wave%5===0){const n=bonus('sv'+Surv.wave,1,'Survival: wave '+Surv.wave);if(n)parts.push('wave '+Surv.wave+' +'+n);}}
  else s.ws=0;}
 pend=parts.length?'<br><span style="color:'+E.col+'">'+E.cur+' Bonus: '+parts.join(', ')+'</span>':'';persist();}catch(e){}return r;};
try{const _msg=UI.msg;UI.msg=function(t,b){if(pend){b=(b||'')+pend;pend='';}return _msg.apply(this,[t,b].concat([].slice.call(arguments,2)));};}catch(e){}
try{const _g=Reward.give;Reward.give=function(){const r=_g.apply(this,arguments);if(r>0)bonus('mini',1,'Mini-game reward');return r;};}catch(e){}
const _rm=window.recordMatch;window.recordMatch=function(won,xp){const r=_rm.apply(this,arguments);try{add(won?3:1);}catch(e){}return r;};
// ---- decor ----
const css=document.createElement('style');css.textContent=`
#evdecor{position:fixed;inset:0;pointer-events:none;z-index:2;overflow:hidden}
#evdecor .bat{position:absolute;font-size:22px;animation:evfly 14s linear infinite;filter:drop-shadow(0 0 2px #000)}
@keyframes evfly{0%{transform:translate(-60px,0)}25%{transform:translate(25vw,-30px)}50%{transform:translate(50vw,20px)}75%{transform:translate(75vw,-20px)}100%{transform:translate(110vw,0)}}
#evdecor .pk{position:absolute;bottom:34px;font-size:34px;animation:evglow 2s ease-in-out infinite alternate}
@keyframes evglow{from{filter:drop-shadow(0 0 2px #ff7518)}to{filter:drop-shadow(0 0 12px #ffb000)}}
#evdecor .web{position:absolute;top:0;right:0;width:150px;height:150px;opacity:.55}
#evdecor .snow{position:absolute;top:-20px;color:#fff;animation:evsnow linear infinite}
@keyframes evsnow{to{transform:translateY(105vh) rotate(360deg)}}
#evdecor .gar{position:absolute;top:0;left:0;right:0;height:18px;background:radial-gradient(circle,#f33 4px,transparent 5px) 0 6px/40px 18px,radial-gradient(circle,#ff0 4px,transparent 5px) 20px 6px/40px 18px;animation:evblink 1s steps(2) infinite}
@keyframes evblink{50%{filter:hue-rotate(120deg)}}
.evwin .evh{background:linear-gradient(90deg,${E.bg},${E.col});color:#fff;padding:8px;font:bold 15px Tahoma,Verdana,sans-serif;text-shadow:1px 1px #000}
.evwin .evq{display:flex;align-items:center;gap:6px;padding:3px;border-bottom:1px solid #ddd;font-size:12px}
.evwin .evbar{flex:1;height:10px;border:1px inset #fff;background:#fff}.evwin .evbar i{display:block;height:100%;background:${E.col}}
#evspin{display:flex;gap:6px;overflow:hidden;width:330px;margin:6px auto;padding:6px;background:#000;border:2px inset #fff}`;
document.head.appendChild(css);
const dec=document.createElement('div');dec.id='evdecor';
if(E.id==='halloween'){dec.innerHTML=[0,1,2].map(i=>`<div class="bat" style="top:${8+i*14}%;animation-delay:${-i*5}s;animation-duration:${12+i*4}s">🦇</div>`).join('')+`<div class="pk" style="left:42%">🎃</div><div class="pk" style="right:110px;animation-delay:1s">🎃</div>
<svg class="web" viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width=".7"><path d="M100 0L0 100M100 0L30 100M100 0L0 30M100 0L60 100M100 0L0 60"/>${[20,40,60,80].map(r=>`<path d="M${100-r} 0Q${100-r*.8} ${r*.4} ${100-r*.7} ${r*.7}Q${100-r*.4} ${r*.8} 100 ${r}"/>`).join('')}</svg>`;}
else{dec.innerHTML='<div class="gar"></div>'+Array.from({length:30},(_,i)=>`<div class="snow" style="left:${Math.random()*100}%;font-size:${8+Math.random()*12}px;animation-duration:${6+Math.random()*8}s;animation-delay:${-Math.random()*10}s">❄</div>`).join('');}
if(E.id==='halloween')dec.querySelectorAll('.pk').forEach(p=>{p.style.pointerEvents='auto';p.style.cursor='pointer';p.title='Pumpkin';p.onclick=()=>{const s=st(),now=Date.now(),cd=30*60e3;
 if(s.pt&&now-s.pt<cd){try{toast('Pumpkin is empty','Check back in '+Math.ceil((cd-(now-s.pt))/60e3)+' min.');}catch(e){}return;}
 if(bonus('pump',1,'Candy from a pumpkin')){s.pt=now;persist();}else{try{toast('Pumpkin is empty','No more pumpkin candy today.');}catch(e){}}};});
const putDec=()=>{if(!$('evdecor'))document.body.appendChild(dec);};setTimeout(putDec,2600);
// ---- window ----
const W={open(){const s=st();openWin('event',E.name+' 2026 — event',`<div class="evwin"><div class="evh">${E.id==='halloween'?'🎃':'🎄'} ${E.name}! Event until ${E.to[1]}.${String(E.to[0]).padStart(2,'0')} <span style="float:right">${E.cur} <b id="evcur">${s.c}</b></span></div>
 <fieldset><legend>Daily quests (${E.curN})</legend><div id="evql"></div></fieldset>
 <fieldset><legend>Event crate — ${E.price} ${E.cur}</legend><div style="display:flex;gap:10px;justify-content:center">${E.balls.map(id=>`<div style="text-align:center;font-size:11px;width:90px">${ballIco(BY[id],48)}<br><b>${BY[id].name}</b><br><span class="evown" data-id="${id}">${save.owned[id]?'✅ have':'🔒 locked'}</span></div>`).join('')}</div>
 <div id="evspin" style="display:none"></div><div style="text-align:center"><button id="evopen"><b>Open crate</b></button> <span id="evmsg" style="font-size:12px"></span></div></fieldset>
 <div style="font-size:11px;color:#555">${E.curN}: +1 per match, +3 per win, rewards for quests. Bonuses (up to ${BCAP} per day): first win of the day +3, every 3 wins in a row +2, daily challenge +3, every 5 survival waves +1, arena candy +1 (up to 5), desktop pumpkin +1 every 30 min (up to 4), mini-games +1 (up to 3). Event balls are only in this crate and only during the event.</div></div>`,{w:460,icon:E.id==='halloween'?'🎃':'🎄'});
 this.q();$('evopen').onclick=()=>this.crate();},
 q(){const l=$('evql');if(!l)return;const s=st();l.innerHTML=Q.map(q=>{const p=prog(q),done=s.q[q.id];return `<div class="evq"><span style="width:180px">${q.n}</span><div class="evbar"><i style="width:${p/q.need*100}%"></i></div><span>${p}/${q.need}</span>${done?'✅':`<button data-q="${q.id}" ${p>=q.need?'':'disabled'}>+${q.r} ${E.cur}</button>`}</div>`;}).join('');
  l.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const q=Q.find(x=>x.id===b.dataset.q);if(prog(q)<q.need||st().q[q.id])return;st().q[q.id]=1;add(q.r);try{Sfx.tone(880,0,.15,'square',.05);}catch(e){}this.q();});},
 crate(){const s=st(),m=$('evmsg');if(s.c<E.price){m.textContent='Not enough '+E.curN.toLowerCase()+': need '+E.price;return;}s.c-=E.price;s.opened++;
  const id=E.balls[Math.random()*E.balls.length|0];const sp=$('evspin');sp.style.display='flex';const seq=Array.from({length:24},(_,i)=>i===20?id:E.balls[Math.random()*E.balls.length|0]);
  sp.innerHTML=seq.map(x=>`<div style="flex:none">${ballIco(BY[x],48)}</div>`).join('');let x=0;$('evopen').disabled=true;
  const t=setInterval(()=>{x+=9;sp.scrollLeft=x;if(x>=20*54-141){clearInterval(t);
   let msg;if(save.owned[id]){save.owned[id].cards=(save.owned[id].cards||0)+3;s.c+=10;msg='Dupe: '+BY[id].name+' — +3 cards and +10 '+E.cur;}else{save.owned[id]={lvl:1,cards:0};msg='🎉 New ball: '+BY[id].name+'!';}
   persist();upd();document.querySelectorAll('.evown').forEach(e=>e.textContent=save.owned[e.dataset.id]?'✅ have':'🔒 locked');m.textContent=msg;toast(E.cur+' '+E.name,msg);$('evopen').disabled=false;this.q();try{checkAch();}catch(e){}}},16);persist();upd();}};
const upd=()=>{const c=$('evcur');if(c)c.textContent=st().c;};
window.EventWin=W;
window.EXTRA=window.EXTRA||[];window.EXTRA.push({k:E.name,ico:E.id==='halloween'?'🎃':'🎄',run:'EventWin.open()',cat:'std'});
setTimeout(()=>{try{toast((E.id==='halloween'?'🎃 ':'🎄 ')+E.name+'!','Event is live: collect '+E.curN.toLowerCase()+' and open the event crate. Shortcut “'+E.name+'” on the desktop.');}catch(e){}},4000);
})();
