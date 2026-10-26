// ---- Desktop icon styles: `icons <style>` in MS-DOS, also in Свойства экрана ----
(function(){
const LS=localStorage,K='bf_icostyle';
const ST={'3d':'3D — объёмные пиксельные (по умолчанию)','3d-цвет':'3D Цвет — яркие насыщенные','3d-золото':'3D Золото — литое золото','3d-неон':'3D Неон — светящийся объём во тьме',win98:'Windows 98 — классика',win95:'Windows 95 — плоские, старая палитра',winxp:'Windows XP — крупные, глянцевые',mono:'Mono — 1-бит, как старый Mac',dos:'DOS — зелёный ASCII на чёрном',neon:'Neon — светящийся контур',verity:'Verity — ☺ (нужно встретить Verity)'};
const AL={'3d-color':'3d-цвет','3d-gold':'3d-золото','3d-neon':'3d-неон',color:'3d-цвет',gold:'3d-золото'};
const met=()=>LS.getItem('bf_vmet')==='1'||LS.getItem('bf_verity')==='1';
const mood=()=>window.Verity?Verity.mood:+(LS.getItem('bf_vmood')||0);
const hex=c=>{c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(c.substr(i,2),16));};
const lum=c=>{const[r,g,b]=hex(c);return (.3*r+.59*g+.11*b)/255;};
const to=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v|0)).toString(16).padStart(2,'0')).join('');
const W95={'#0000ff':'#0000a8','#00ffff':'#00a8a8','#ff0000':'#a80000','#00ff00':'#00a800','#ffff00':'#a8a800','#ff00ff':'#a800a8','#c0c0c0':'#a8a8a8','#008080':'#005454','#ffc080':'#c89c6c'};
const XP={'#000080':'#1c54d4','#0000ff':'#3a8dff','#008080':'#1fa8a0','#00ffff':'#7fe6ff','#ff0000':'#ff4b3a','#800000':'#c0302a','#00ff00':'#6ae04a','#008000':'#2f9e2f','#ffff00':'#ffd84a','#808000':'#c9a227','#c0c0c0':'#dfe4ee','#808080':'#8b95a8','#000':'#2a3550'};
function grid(g,PAL){const M=[];for(let y=0;y<16;y++){M[y]=[];const row=(g[y]||'').replace(/ /g,'');for(let x=0;x<16;x++){const c=row[x];M[y][x]=c&&PAL[c]?PAL[c]:null;}}return M;}

function d3(M,s,st){const N=32,A=[];for(let y=0;y<N;y++){A[y]=[];for(let x=0;x<N;x++)A[y][x]=M[y>>1][x>>1];}
 const BK=c=>c&&lum(c)<.06,body=(x,y)=>{const c=A[y][x];if(!BK(c))return c;for(const[a,b]of[[-1,-1],[-1,0],[0,-1],[-2,-2],[-2,0],[0,-2]]){const q=A[y+b]&&A[y+b][x+a];if(q&&!BK(q))return q;}return '#404040';};const dk=(x,y)=>!inn(x,y)||BK(A[y][x]);const inn=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&A[y][x];const mix=(c,t,k)=>{const a=hex(c),b=hex(t);return to(a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k);};
 const B=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
 const tone=c=>{if(!c)return '#404040';const[r,g,b]=hex(c),l=lum(c);if(st==='3d-золото')return l<.08?'#3a2000':to(70+185*l,40+170*l,10+60*l*l);
  if(st==='3d-цвет'){const m=(r+g+b)/3,sat=Math.max(r,g,b)-Math.min(r,g,b);if(sat<30&&l>.08)return mix(c,l>.6?'#7fd8ff':'#3a5cff',.55);return to(m+(r-m)*1.8+20,m+(g-m)*1.8+10,m+(b-m)*1.8+30);}
  if(st==='3d-неон')return l<.08?'#12002a':['#ff2bd6','#b02bff','#2bf0ff','#b6ff2b','#ffe62b'][Math.min(4,(l*5)|0)];return c;};
 const P=[];const put=(x,y,c,o)=>{P.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"${o?` opacity="${o}"`:''}/>`);};
 const neon=st==='3d-неон',occ=(x,y)=>inn(x,y)||inn(x-1,y-1)||inn(x-2,y-2);
 if(neon)for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!occ(x,y)&&(occ(x+1,y)||occ(x-1,y)||occ(x,y+1)||occ(x,y-1)))put(x,y,'#ff2bd6',.35);}
 // drop shadow (dithered, offset down-right)
 if(!neon)for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!occ(x,y)&&inn(x-4,y-4)&&((x+y)&1))put(x,y,'#000',.45);
 // extrusion depth
 for(let d=3;d>=1;d--)for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(inn(x-d,y-d)&&!inn(x,y)&&!(d<3&&inn(x-d-1,y-d-1)&&!inn(x-d-1+1,y-d-1+1)&&0)){const t=tone(body(x-d,y-d));const edge=!inn(x-d+1,y-d+1)&&d===1||!inn(x+1,y)&&!inn(x-d-0,y-d+1)&&0;put(x,y,neon?mix(t,'#000',.5):mix(t,'#000',.35+.12*d));}}
 // lit face
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=A[y][x];if(!c)continue;let t=tone(c);const l=lum(c);
  if(l<.06&&!neon){put(x,y,'#000');continue;}
  const tl=dk(x-1,y)||dk(x,y-1),br=dk(x+1,y)||dk(x,y+1)||dk(x+1,y+1);
  const g=(x+y)/(2*N)-.5,th=(B[y&3][x&3]/16-.5)*.25;let k=-g*.9+th*.5;
  if(tl&&!br)t=mix(t,'#fff',.6);else if(br&&!tl)t=mix(t,'#000',.45);else if(k>.12)t=mix(t,'#fff',Math.min(.4,k));else if(k<-.12)t=mix(t,'#000',Math.min(.35,-k));
  if(!tl&&!br&&inn(x-2,y-2)&&!inn(x-3,y-3)&&x<14&&y<14)t=mix(t,'#fff',.35);
  put(x,y,t);}
 return `<svg class="px p3d isty-${st}" viewBox="0 0 32 32" width="${s}" height="${s}" shape-rendering="crispEdges" style="image-rendering:pixelated">${neon?'<rect width="32" height="32" fill="#0a0018" opacity=".0"/>':''}${P.join('')}</svg>`;}
let uid=0;
function draw(g,s,PAL){let st=ISTY.cur;const M=grid(g,PAL);if(st.startsWith('3d')){if(s>=24)return d3(M,s,st);st='win98';}const id='is'+(uid++);let r='',defs='',pre='',extra='',sr='crispEdges';
 const each=f=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(M[y][x])f(x,y,M[y][x]);};
 const edge=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!(M[y+b]&&M[y+b][x+a]));
 if(st==='win95')each((x,y,c)=>{r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${W95[c]||c}"/>`;});
 else if(st==='winxp'){sr='geometricPrecision';s=Math.round(s*1.25);
  defs=`<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><filter id="${id}s"><feDropShadow dx=".5" dy=".7" stdDeviation=".45" flood-opacity=".45"/></filter>`;
  each((x,y,c)=>{r+=`<rect x="${x-.08}" y="${y-.08}" width="1.16" height="1.16" rx=".42" fill="${XP[c]||c}"/>`;});
  r=`<g filter="url(#${id}s)">${r}</g>`;each((x,y)=>{r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="url(#${id}g)" opacity=".55"/>`;});}
 else if(st==='mono')each((x,y,c)=>{const l=lum(c);const on=l<.28?1:l>.75?0:((x+y)%2?1:0)*(l<.5?1:0)+((x+y)%2&&l>=.5&&l<=.75?0:0)+(l>=.5&&l<=.75?((x+y)%2):0);r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${on?'#000':'#fff'}"/>`;});
 else if(st==='dos'){pre=`<rect width="16" height="16" fill="#000"/>`;const chars='░▒▓█';
  each((x,y,c)=>{const l=lum(c);const k=edge(x,y)?3:Math.min(3,Math.floor(l*4));r+=`<rect x="${x+.08}" y="${y+.1}" width=".84" height=".8" fill="#33ff33" opacity="${[.28,.5,.75,1][k]}"/>`;});
  for(let y=0;y<16;y+=2)extra+=`<rect x="0" y="${y+1.7}" width="16" height=".3" fill="#000" opacity=".5"/>`;}
 else if(st==='neon'){sr='geometricPrecision';const pal=['#ff2bd6','#2bf0ff','#b6ff2b','#ffd12b'];
  defs=`<filter id="${id}n" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  pre=`<rect width="16" height="16" rx="2" fill="#0a0018"/>`;let q='';each((x,y,c)=>{if(edge(x,y)){const h=lum(c)>.6?pal[1]:lum(c)>.3?pal[0]:pal[2];q+=`<rect x="${x+.15}" y="${y+.15}" width=".7" height=".7" fill="${h}"/>`;}});r=`<g filter="url(#${id}n)">${q}</g>`;}
 else if(st==='verity'){const m=mood(),ang=m<=-35;sr='geometricPrecision';
  each((x,y,c)=>{const[R,G,B]=hex(c),l=lum(c);let col=to(255*Math.min(1,l*1.1+.15),210*Math.min(1,l+.1),40*l);if(c==='#000'||l<.05)col='#3a2a00';
   let dx=0;if(ang&&((y*7+Math.floor(m))%5===0))dx=(y%3-1)*(m<=-70?2:1);if(ang&&Math.random()<(m<=-70?.12:.05))col='#c00000';
   r+=`<circle cx="${x+.5+dx}" cy="${y+.5}" r=".55" fill="${col}"/>`;});
  extra=`<circle cx="13" cy="3" r="2.4" fill="#ffd400" stroke="#000" stroke-width=".3"/><circle cx="12.2" cy="2.5" r=".35" fill="#000"/><circle cx="13.8" cy="2.5" r=".35" fill="#000"/><path d="M11.8 3.6 Q13 ${ang?3.2:4.8} 14.2 3.6" stroke="#000" stroke-width=".3" fill="none"/>`;
  if(ang)extra+=`<rect x="0" y="${(Math.random()*14)|0}" width="16" height=".6" fill="#ff0040" opacity=".55"/>`;}
 else each((x,y,c)=>{r+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`;});
 return `<svg class="px isty-${st}" viewBox="0 0 16 16" width="${s}" height="${s}" shape-rendering="${sr}">${defs?'<defs>'+defs+'</defs>':''}${pre}${r}${extra}</svg>`;}
window.ISTY={cur:LS.getItem(K)||'3d',ST,met,draw,on(){return this.cur!=='win98';},
 set(n){n=AL[n]||n;if(n==='verity'&&!met())return 'locked';if(!ST[n])return 'bad';this.cur=n;LS.setItem(K,n);this.apply();return 'ok';},
 apply(){if(this.cur==='verity'&&!met()){this.cur='win98';}try{Desk.render();}catch(e){}try{updTasks();updTray&&updTray();}catch(e){}document.body.dataset.icons=this.cur;}};
if(ISTY.cur==='verity'&&!met())ISTY.cur='win98';
const css=document.createElement('style');css.textContent=`body[data-icons=dos] #icons .ico span,body[data-icons=dos] #icons .ico div:last-child{color:#33ff33!important;font-family:'Courier New',monospace}body[data-icons=neon] #icons svg.px{border-radius:4px}`;document.head.appendChild(css);
// re-render glitch icons when Verity is angry
setInterval(()=>{if(ISTY.cur==='verity'&&mood()<=-35)try{Desk.render();}catch(e){}},2500);
// DOS command
const _r=Cmd.run.bind(Cmd);Cmd.run=function(line){const m=(line||'').trim().toLowerCase().match(/^icons(?:\s+(\S+))?\s*$/);
 if(!m)return _r(line);const a=m[1];
 if(!a){this.out('Стили значков (текущий: '+ISTY.cur.toUpperCase()+'):\n'+Object.keys(ST).map(k=>'  '+k.padEnd(10)+(k===ISTY.cur?'* ':'  ')+(k==='verity'&&!met()?'??????? [ЗАБЛОКИРОВАНО]':ST[k])).join('\n')+'\nИспользование: ICONS <стиль> | ICONS RESET (=3d)\nПример: ICONS 3d-неон (или 3d-neon, 3d-gold, 3d-color)');return;}
 const n=a==='reset'||a==='default'?'3d':a;const res=ISTY.set(n);
 this.out(res==='ok'?'Стиль значков: '+n.toUpperCase()+'. Рабочий стол обновлён.':res==='locked'?'ДОСТУП ЗАПРЕЩЁН. Сначала познакомься с ним.':'ICONS: неизвестный стиль — '+a+'. Введите ICONS для списка.');};
// help line
if(Cmd.cmds&&Cmd.cmds.help){}
// Свойства экрана
const _p=Desk.props.bind(Desk);Desk.props=function(){_p();setTimeout(()=>{const w=document.getElementById('w_props');if(!w||w.querySelector('#isty'))return;const b=w.querySelector('.wb')||w;const d=document.createElement('div');d.style.cssText='margin:8px 0;font-size:12px';
 d.innerHTML='<b>Стиль значков:</b> <select id="isty">'+Object.keys(ST).map(k=>`<option value="${k}" ${k===ISTY.cur?'selected':''} ${k==='verity'&&!met()?'disabled':''}>${k==='verity'&&!met()?'??? (заблокировано)':ST[k]}</option>`).join('')+'</select>';
 d.innerHTML+='<div id="istyp" style="margin-top:4px;padding:4px;background:#008080;display:flex;gap:6px"></div>';b.insertBefore(d,b.firstChild);const pv=()=>{const p=d.querySelector('#istyp');if(p&&window.PX9)p.innerHTML=['pc','bin','folder','globe','cmd'].map(n=>PX9(n)).join('');};pv();d.querySelector('select').onchange=e=>{ISTY.set(e.target.value);pv();};},30);};
ISTY.apply();
})();
