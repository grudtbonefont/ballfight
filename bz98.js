// ---- Late-90s pre-rendered CGI icons, pixelated (tiny SDF raymarcher) for 3d* styles ----
(function(){
const N=32,SS=2,V=1.22;
const L=Math.hypot,cl=(v,a,b)=>v<a?a:v>b?b:v,mixn=(a,b,t)=>a+(b-a)*t;
const nrm=v=>{const l=L(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];},dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const hex=h=>{h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255);};
// materials
const M={beige:'#e8dcc0',grey:'#b8bec8',dark:'#3a3f4e',black:'#22232a',white:'#f6f6f6',cyan:'#5fd8ef',blue:'#3f6fe0',navy:'#25309a',purple:'#8b5cd6',lilac:'#b99af0',pink:'#ff6fb5',red:'#e8332c',green:'#3fbf4a',lime:'#8fe04a',yellow:'#ffcf2e',gold:'#f2b431',orange:'#ff8a1f',brown:'#9a5a2a',wood:'#c98a4a',skin:'#ffc896',screen:'#58c8f0',paper:'#fbf6e6',silver:'#d6dbe3'};
const MT={grey:1,silver:1,gold:1,dark:0};
// sdf prims (p already in object space)
const sph=(p,r)=>L(p[0],p[1],p[2])-r;
const box=(p,b,r)=>{const q=[Math.abs(p[0])-b[0]+r,Math.abs(p[1])-b[1]+r,Math.abs(p[2])-b[2]+r];return L(Math.max(q[0],0),Math.max(q[1],0),Math.max(q[2],0))+Math.min(Math.max(q[0],Math.max(q[1],q[2])),0)-r;};
const cyl=(p,r,h,rr)=>{const d=[L(p[0],p[2])-r+rr,Math.abs(p[1])-h+rr];return Math.min(Math.max(d[0],d[1]),0)+L(Math.max(d[0],0),Math.max(d[1],0))-rr;};
const tor=(p,R,r)=>L(L(p[0],p[1])-R,p[2])-r; // ring in xy plane
const cap=(p,a,b,r)=>{const pa=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],ba=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];const h=cl(dot(pa,ba)/dot(ba,ba),0,1);return L(pa[0]-ba[0]*h,pa[1]-ba[1]*h,pa[2]-ba[2]*h)-r;};
const cone=(p,r1,r2,h)=>{const q=L(p[0],p[2]),t=cl((p[1]+h)/(2*h),0,1),r=mixn(r1,r2,t);return Math.max(q-r,Math.abs(p[1])-h)*.8;};
const poly2=(x,y,P)=>{let d=1e9,s=1;for(let i=0,j=P.length-1;i<P.length;j=i++){const[ax,ay]=P[j],[bx,by]=P[i],ex=bx-ax,ey=by-ay,wx=x-ax,wy=y-ay,h=cl((wx*ex+wy*ey)/(ex*ex+ey*ey),0,1);d=Math.min(d,L(wx-ex*h,wy-ey*h));if((ay>y)!==(by>y)&&x<ex*(y-ay)/ey+ax)s=-s;}return s*d;};
const prism=(p,P,t,r)=>{const d2=poly2(p[0],p[1],P)+r,dz=Math.abs(p[2])-t+r;return Math.min(Math.max(d2,dz),0)+L(Math.max(d2,0),Math.max(dz,0))-r;};
const rot=(p,r)=>{let[x,y,z]=p;if(r[2]){const c=Math.cos(r[2]),s=Math.sin(r[2]);[x,y]=[c*x+s*y,-s*x+c*y];}if(r[0]){const c=Math.cos(r[0]),s=Math.sin(r[0]);[y,z]=[c*y+s*z,-s*y+c*z];}if(r[1]){const c=Math.cos(r[1]),s=Math.sin(r[1]);[x,z]=[c*x-s*z,s*x+c*z];}return[x,y,z];};
// prim spec: [type, pos, args..., mat, opts{r:[rx,ry,rz],k:smooth}]
function ev(pr,p){const[t,c]=pr;let q=[p[0]-c[0],p[1]-c[1],p[2]-c[2]];const o=pr[pr.length-1];if(o&&o.r)q=rot(q,o.r);if(o&&o.sc)q=[q[0]/o.sc[0],q[1]/o.sc[1],q[2]/o.sc[2]];const f=o&&o.sc?Math.min(...o.sc):1;
 switch(t){case's':return sph(q,pr[2])*f;case'b':return box(q,pr[2],pr[3])*f;case'c':return cyl(q,pr[2],pr[3],pr[4])*f;case't':return tor(q,pr[2],pr[3])*f;case'k':return cap(q,pr[2],pr[3],pr[4])*f;case'n':return cone(q,pr[2],pr[3],pr[4])*f;case'p':return prism(q,pr[2],pr[3],pr[4])*f;}return 1e9;}
const matOf=pr=>{const o=pr[pr.length-1];return typeof o==='string'?o:pr[pr.length-2];};
function scene(prs,p){let d=1e9,m=null;for(const pr of prs){const o=pr[pr.length-1];let e=ev(pr,p);if(o&&o.cut){d=Math.max(d,-e);continue;}if(o&&o.and){d=Math.max(d,e);continue;}const k=o&&o.k;if(k&&d<1e8){const h=cl(.5+.5*(e-d)/k,0,1);const nd=mixn(e,d,h)-k*h*(1-h);if(e<d)m=matOf(pr);d=nd;}else if(e<d){d=e;m=matOf(pr);}}return[d,m];}
// camera: slight 3/4 view
const YAW=-.38,PIT=.3;const camRot=p=>rot(p,[PIT,YAW,0]);
const LD=nrm([-.55,.7,.6]),HV=nrm([LD[0],LD[1],LD[2]+1]);
const B4=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
function shade(prs,mat,P,n,st,vd){if(mat==='globe'){const v=Math.sin(P[0]*5+1)*Math.cos(P[1]*4)+Math.sin(P[2]*6+P[1]*3)*.6;mat=v>.35?'green':'blue';}let base=hex(M[mat]||'#ff00ff'),metal=MT[mat]===1,emis=mat==='screen'?.35:0;
 if(st==='3d-цвет'){const m=(base[0]+base[1]+base[2])/3;base=base.map(v=>cl(m+(v-m)*1.6+.03,0,1));}
 if(st==='3d-золото'){const l=.3*base[0]+.59*base[1]+.11*base[2];base=[1*(.55+.45*l),.72*(.5+.5*l),.25*(.4+.6*l)];metal=true;}
 const nl=dot(n,LD),dif=Math.max(0,nl*.8+.2);
 let ao=1;for(let i=1;i<=4;i++){const h=i*.06;ao-=(h-scene(prs,[P[0]+n[0]*h,P[1]+n[1]*h,P[2]+n[2]*h])[0])*(1.6/i);}ao=cl(ao,.35,1);
 const spec=Math.pow(Math.max(0,dot(n,HV)),metal?18:40)*(metal?1.1:.85);
 const fr=Math.pow(1-Math.max(0,dot(n,vd)),3);
 if(st==='3d-неон'){const g=fr*1.8+.08+spec*.6;return base.map(v=>cl(v*g*1.3+v*.05,0,1));}
 let col;if(metal){const env=.45+.55*(n[1]*.5+.5);col=base.map(v=>v*(.25+.85*dif*env)*ao+spec);}
 else col=base.map((v,i)=>v*(.32*ao+.85*dif*ao)+spec+fr*.18*[.75,.85,1][i]+emis*v);
 return col.map(v=>cl(v,0,1));}
function renderRaw(prs,st){const R=N*SS,img=new Array(R*R);const vd=nrm(camRot([0,0,1]).map(v=>v));
 const fwd=camRot([0,0,-1]),ux=camRot([1,0,0]),uy=camRot([0,1,0]);
 for(let j=0;j<R;j++)for(let i=0;i<R;i++){const sx=((i+.5)/R*2-1)*V,sy=(1-(j+.5)/R*2)*V+.05;let o=[ux[0]*sx+uy[0]*sy-fwd[0]*3,ux[1]*sx+uy[1]*sy-fwd[1]*3,ux[2]*sx+uy[2]*sy-fwd[2]*3],t=0,hit=null;
  for(let k=0;k<70;k++){const p=[o[0]+fwd[0]*t,o[1]+fwd[1]*t,o[2]+fwd[2]*t];const[d,m]=scene(prs,p);if(d<.004){hit=[p,m];break;}t+=Math.max(d*.9,.003);if(t>6)break;}
  if(!hit){img[j*R+i]=null;continue;}const[p,m]=hit,e=.003;const g=a=>scene(prs,a)[0];
  const n=nrm([g([p[0]+e,p[1],p[2]])-g([p[0]-e,p[1],p[2]]),g([p[0],p[1]+e,p[2]])-g([p[0],p[1]-e,p[2]]),g([p[0],p[1],p[2]+e])-g([p[0],p[1],p[2]-e])]);
  img[j*R+i]=shade(prs,m,p,n,st,[-fwd[0],-fwd[1],-fwd[2]]);}
 return img;}
const cache={};
function make(name,st){const k=name+'|'+st;if(cache[k])return cache[k];const prs=BZ[name];const R=N*SS,img=renderRaw(prs,st);
 const cv=document.createElement('canvas');cv.width=cv.height=N;const cx=cv.getContext('2d'),id=cx.createImageData(N,N),D=id.data;const A=[];
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){let c=[0,0,0],n=0;for(let b=0;b<SS;b++)for(let a=0;a<SS;a++){const v=img[(y*SS+b)*R+x*SS+a];if(v){c[0]+=v[0];c[1]+=v[1];c[2]+=v[2];n++;}}A[y*N+x]=n>=2?c.map(v=>v/n):null;}
 const neon=st==='3d-неон',lv=7;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,c=A[y*N+x];
  if(!c){// contact shadow / neon halo
   const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>A[(y+b)*N+x+a]&&x+a>=0&&x+a<N&&y+b<N&&y+b>=0);
   if(neon&&nb){D[i]=255;D[i+1]=60;D[i+2]=220;D[i+3]=110;continue;}
   const ex=(x+.5-15)/12,ey=(y+.5-29.3)/2.2;if(!neon&&ex*ex+ey*ey<1){D[i]=0;D[i+1]=0;D[i+2]=0;D[i+3]=(ex*ex+ey*ey<.45)?95:55;}continue;}
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const xx=x+a,yy=y+b;return xx<0||yy<0||xx>=N||yy>=N||!A[yy*N+xx];});
  const th=(B4[y&3][x&3]/16-.5)/lv;let col=c.map(v=>Math.round(cl(v+th,0,1)*lv)/lv);if(edge)col=col.map(v=>v*(neon?1:.62));
  D[i]=col[0]*255;D[i+1]=col[1]*255;D[i+2]=col[2]*255;D[i+3]=255;}
 cx.putImageData(id,0,0);return cache[k]=cv.toDataURL();}
// ---- icon models ----
const Z={};const s=(p,r,m,o)=>['s',p,r,m,o],b=(p,h,r,m,o)=>['b',p,h,r,m,o],c=(p,r,h,rr,m,o)=>['c',p,r,h,rr,m,o],t=(p,R,r,m,o)=>['t',p,R,r,m,o],k=(p,a,bb,r,m,o)=>['k',p,a,bb,r,m,o],n=(p,r1,r2,h,m,o)=>['n',p,r1,r2,h,m,o],pp=(p,P,th,r,m,o)=>['p',p,P,th,r,m,o];
const O=[0,0,0],X=Math.PI/2;
const BZ={
pc:[b([0,-.62,0],[.85,.17,.6],.07,'beige'),b([0,.12,-.05],[.7,.52,.5],.16,'beige'),b([0,.14,.44],[.52,.38,.06],.06,'screen'),b([.45,-.62,.6],[.08,.03,.02],.01,'green'),b([-.35,-.62,.6],[.3,.03,.02],.01,'dark')],
disp:[b([0,.2,0],[.82,.6,.18],.08,'dark'),b([0,.2,.16],[.68,.48,.05],.03,'screen'),c([0,-.55,0],.12,.2,.04,'grey'),c([0,-.75,0],.45,.06,.05,'grey')],
floppy:[b(O,[.78,.82,.09],.07,'purple'),b([.05,.5,.08],[.42,.3,.03],.02,'silver'),b([.22,.5,.12],[.08,.2,.02],.01,'dark'),b([0,-.32,.08],[.55,.4,.03],.03,'paper')],
folder:[b([0,.05,-.06],[.88,.65,.05],.05,'yellow'),b([-.45,.72,-.06],[.33,.1,.05],.05,'yellow'),b([0,-.08,.12],[.88,.55,.04],.04,'gold',{r:[-.18,0,0]}),b([0,.2,.03],[.78,.45,.01],.01,'paper')],
icq:[b([0,.12,0],[.88,.6,.3],.45,'cyan'),k(O,[.25,-.4,0],[.55,-.85,0],.14,'cyan',{k:.1}),s([-.38,.12,.3],.1,'white'),s([0,.12,.3],.1,'white'),s([.38,.12,.3],.1,'white')],
game:[k(O,[-.38,.08,0],[.38,.08,0],.42,'pink'),s([-.55,-.3,0],.36,'pink',{k:.2}),s([.55,-.3,0],.36,'pink',{k:.2}),b([-.45,.05,.38],[.24,.07,.05],.03,'white'),b([-.45,.05,.38],[.07,.24,.05],.03,'white'),s([.35,.2,.36],.09,'yellow'),s([.55,0,.36],.09,'cyan'),s([.15,0,.36],.09,'green'),s([.35,-.2,.36],.09,'purple')],
globe:[s(O,.78,'globe'),t(O,1.02,.07,'yellow',{r:[1.2,0,.3]})],
cmd:[b(O,[.9,.72,.22],.12,'dark'),b([0,.6,.04],[.88,.12,.2],.06,'blue'),k(O,[-.55,.15,.22],[-.3,-.05,.22],.07,'lime'),k(O,[-.55,-.25,.22],[-.3,-.05,.22],.07,'lime'),b([.1,-.3,.22],[.22,.05,.04],.02,'lime')],
bin:[n([0,-.1,0],.48,.66,.72,'silver'),t([0,.62,0],.64,.07,'grey',{r:[X,0,0]}),c([0,.62,0],.6,.02,.01,'dark')],
medal:[b([-.25,.5,0],[.18,.42,.04],.02,'red',{r:[0,0,-.35]}),b([.25,.5,0],[.18,.42,.04],.02,'blue',{r:[0,0,.35]}),c([0,-.28,.05],.5,.08,.05,'gold',{r:[X,0,0]}),pp([0,-.28,.14],[[0,.3],[.09,.1],[.3,.08],[.13,-.06],[.19,-.28],[0,-.15],[-.19,-.28],[-.13,-.06],[-.3,.08],[-.09,.1]],.03,.01,'yellow')],
cart:[b([.05,.05,0],[.7,.35,.42],.08,'red'),b([.05,.22,0],[.6,.2,.36],.03,'dark',{cut:1}),k(O,[-.9,.55,0],[-.62,.3,0],.07,'grey'),s([-.35,-.62,.32],.17,'black'),s([.5,-.62,.32],.17,'black'),s([-.35,-.62,-.32],.17,'black')],
pack:[b([0,-.1,0],[.62,.75,.35],.3,'orange'),b([0,.38,.06],[.64,.3,.33],.25,'brown'),b([0,-.38,.32],[.4,.28,.08],.08,'yellow'),t([0,.82,0],.22,.06,'brown')],
anvil:[b([0,.05,0],[.6,.16,.32],.05,'grey'),n([-.72,.1,0],.02,.2,.12,'grey',{r:[0,0,-X]}),b([0,-.25,0],[.28,.18,.22],.04,'grey'),b([0,-.58,0],[.6,.16,.36],.05,'grey'),k(O,[.3,.4,.3],[.75,.85,.3],.06,'wood'),b([.35,.82,.3],[.3,.11,.11],.04,'silver',{r:[0,0,-.78]})],
bpass:[b(O,[.92,.55,.06],.1,'gold'),c([.92,0,0],.18,.2,.01,'gold',{cut:1,r:[X,0,0]}),c([-.92,0,0],.18,.2,.01,'gold',{cut:1,r:[X,0,0]}),pp([-.15,0,.06],[[0,.38],[.11,.12],[.38,.1],[.17,-.08],[.24,-.36],[0,-.2],[-.24,-.36],[-.17,-.08],[-.38,.1],[-.11,.12]],.04,.01,'red'),b([.55,0,.06],[.03,.45,.02],.01,'brown')],
clan:[pp(O,[[-.75,.8],[.75,.8],[.72,.0],[0,-.88],[-.72,0]],.14,.1,'blue'),b([0,.05,.14],[.09,.55,.03],.02,'yellow'),b([0,.25,.14],[.42,.09,.03],.02,'yellow')],
trophy:[s([0,.25,0],.5,'gold'),b([0,.68,0],[.6,.3,.6],.0,'gold',{cut:1}),c([0,.42,0],.5,.02,.01,'gold'),t([-.55,.25,0],.2,.06,'gold'),t([.55,.25,0],.2,.06,'gold'),c([0,-.35,0],.08,.25,.03,'gold'),b([0,-.7,0],[.42,.12,.3],.04,'wood')],
flag:[c([-.7,0,0],.05,.88,.03,'silver'),s([-.7,.9,0],.08,'gold'),b([-.05,.42,0],[.3,.22,.04],.02,'red'),b([.55,.42,0],[.3,.22,.04],.02,'green'),b([-.05,-.04,0],[.3,.22,.04],.02,'blue'),b([.55,-.04,0],[.3,.22,.04],.02,'yellow')],
swords:[k(O,[-.75,.75,0],[.4,-.4,0],.07,'silver'),k(O,[.75,.75,0],[-.4,-.4,0],.07,'silver'),b([.45,-.45,.05],[.28,.06,.06],.03,'gold',{r:[0,0,.78]}),b([-.45,-.45,.05],[.28,.06,.06],.03,'gold',{r:[0,0,-.78]}),k(O,[.5,-.5,0],[.72,-.72,0],.08,'brown'),k(O,[-.5,-.5,0],[-.72,-.72,0],.08,'brown')],
user:[s([0,.45,0],.33,'skin'),k(O,[-.3,-.45,0],[.3,-.45,0],.38,'blue',{sc:[1,1,.75]}),s([-.12,.5,.3],.05,'black'),s([.12,.5,.3],.05,'black')],
two:[s([-.38,.4,-.1],.26,'skin'),k(O,[-.55,-.4,-.1],[-.2,-.4,-.1],.3,'pink'),s([.38,.35,.1],.26,'skin'),k(O,[.2,-.45,.1],[.55,-.45,.1],.3,'cyan')],
help:[s(O,.8,'blue'),k(O,[-.2,.3,.76],[0,.42,.78],.08,'white'),k(O,[0,.42,.78],[.2,.3,.76],.08,'white'),k(O,[.2,.3,.76],[.04,.05,.8],.08,'white'),k(O,[.04,.05,.8],[.04,-.12,.8],.08,'white'),s([.04,-.4,.74],.09,'white')],
skull:[s([0,.15,0],.68,'white'),b([0,-.45,0],[.38,.22,.4],.15,'white',{k:.12}),s([-.27,.12,.55],.18,'black'),s([.27,.12,.55],.18,'black'),s([0,-.18,.62],.07,'black'),b([0,-.52,.4],[.25,.03,.05],.01,'dark')],
pumpkin:[s([0,-.12,0],.62,'orange',{sc:[1.25,.9,1]}),s([-.42,-.12,.05],.45,'orange',{k:.15}),s([.42,-.12,.05],.45,'orange',{k:.15}),k(O,[0,.45,0],[.08,.8,0],.09,'green'),pp([-.28,.05,.55],[[-.12,-.08],[.12,-.08],[0,.12]],.05,.01,'black'),pp([.28,.05,.55],[[-.12,-.08],[.12,-.08],[0,.12]],.05,.01,'black'),b([0,-.35,.6],[.32,.06,.05],.02,'black')],
mine:[s([0,-.1,0],.58,'black'),k(O,[0,-.95,0],[0,.75,0],.07,'dark'),k(O,[-.85,-.1,0],[.85,-.1,0],.07,'dark'),k(O,[-.6,-.7,0],[.6,.5,0],.07,'dark'),k(O,[.6,-.7,0],[-.6,.5,0],.07,'dark'),s([-.22,.12,.42],.1,'white')],
knight:[c([0,-.75,0],.48,.1,.05,'white'),k(O,[0,-.6,0],[-.05,.0,0],.3,'white',{k:.1}),b([.15,.25,0],[.45,.2,.22],.15,'white',{r:[0,0,-.5],k:.1}),k(O,[-.1,.55,0],[-.15,.85,0],.08,'white',{k:.05}),s([.05,.35,.22],.05,'black')],
cards:[b([-.2,0,-.05],[.42,.62,.03],.06,'white',{r:[0,0,.25]}),b([.2,-.05,.05],[.42,.62,.03],.06,'white',{r:[0,0,-.18]}),s([.12,.0,.1],.13,'red'),s([.32,.0,.1],.13,'red'),b([.22,-.12,.1],[.16,.16,.04],.02,'red',{r:[0,0,.78]})],
pin:[c(O,.78,.14,.08,'pink',{r:[X,0,0]}),t([0,0,.14],.45,.08,'white'),s([0,0,.1],.2,'yellow')],
snake:[s([-.7,-.45,0],.2,'green'),s([-.4,-.55,0],.22,'green',{k:.12}),s([-.05,-.45,0],.23,'green',{k:.12}),s([.25,-.2,0],.24,'green',{k:.12}),s([.3,.15,0],.24,'green',{k:.12}),s([.1,.45,0],.26,'lime',{k:.12}),s([.02,.55,.2],.06,'black'),s([.25,.55,.2],.06,'black')],
blocks:[b([-.42,-.45,0],[.2,.2,.2],.05,'red'),b([0,-.45,0],[.2,.2,.2],.05,'yellow'),b([.42,-.45,0],[.2,.2,.2],.05,'cyan'),b([0,-.03,0],[.2,.2,.2],.05,'purple')],
calc:[b(O,[.6,.85,.12],.08,'grey'),b([0,.5,.1],[.45,.18,.03],.02,'lime'),...[-.3,0,.3].flatMap(x=>[-.05,-.35,-.62].map(y=>b([x,y,.12],[.11,.09,.04],.03,x>.2&&y<-.5?'orange':'white')))],
crate:[b(O,[.72,.66,.6],.04,'wood'),b([0,0,.6],[.74,.1,.03],.01,'brown'),b([0,.55,.6],[.74,.06,.03],.01,'brown'),b([0,-.55,.6],[.74,.06,.03],.01,'brown')],
chart:[b([0,-.72,0],[.85,.06,.4],.03,'white'),b([-.5,-.42,0],[.15,.28,.15],.04,'red'),b([0,-.22,0],[.15,.48,.15],.04,'green'),b([.5,.02,0],[.15,.72,.15],.04,'blue')],
gear:[c(O,.58,.16,.04,'silver',{r:[X,0,0]}),...[0,1,2,3].map(i=>b(O,[.85,.12,.14],.04,'silver',{r:[0,0,i*Math.PI/4]})),c(O,.2,.3,.02,'grey',{cut:1,r:[X,0,0]})],
dice:[b(O,[.62,.62,.62],.16,'white'),s([0,0,.62],.12,'red'),s([.62,.3,.3],.1,'black'),s([.62,-.3,-.3],.1,'black'),s([-.3,.62,.3],.1,'black'),s([.3,.62,-.3],.1,'black'),s([-.32,.32,.62],.1,'black'),s([.32,-.32,.62],.1,'black')],
coin:[c(O,.72,.1,.06,'gold',{r:[X,.3,0]}),b([0,0,.12],[.08,.38,.04],.02,'yellow',{r:[0,.3,0]})],
gem:[pp(O,[[-.5,.55],[.5,.55],[.85,.15],[0,-.85],[-.85,.15]],.3,.02,'cyan'),b([0,.62,0],[.6,.1,.35],0,'cyan',{cut:1})],
power:[s(O,.75,'red'),k(O,[0,.45,.68],[0,.05,.75],.07,'white'),k(O,[-.25,.3,.7],[-.38,0,.68],.07,'white'),k(O,[-.38,0,.68],[0,-.35,.68],.07,'white'),k(O,[0,-.35,.68],[.38,0,.68],.07,'white'),k(O,[.38,0,.68],[.25,.3,.7],.07,'white')],
win:[b(O,[.85,.7,.08],.05,'grey'),b([0,.58,.06],[.82,.1,.04],.02,'blue'),b([0,-.1,.07],[.75,.52,.03],.01,'white'),b([.68,.58,.1],[.07,.06,.02],.01,'red')],
music:[s([-.35,-.55,0],.25,'purple',{sc:[1.3,1,1]}),s([.4,-.4,0],.25,'purple',{sc:[1.3,1,1]}),k(O,[-.08,-.5,0],[-.08,.65,0],.06,'purple'),k(O,[.68,-.35,0],[.68,.8,0],.06,'purple'),b([.3,.72,0],[.4,.1,.06],.03,'purple',{r:[0,0,.15]})],
lock:[t([0,.3,0],.35,.09,'silver'),b([0,-.3,0],[.6,.45,.25],.1,'gold'),b([0,-.25,.24],[.06,.15,.03],.02,'black')],
gift:[b([0,-.25,0],[.65,.55,.55],.06,'red'),b([0,.38,0],[.72,.12,.6],.04,'red'),b([0,0,0],[.13,.7,.62],.02,'yellow'),b([0,0,0],[.73,.6,.13],.02,'yellow'),s([-.22,.62,0],.2,'yellow',{sc:[1.2,.8,.6]}),s([.22,.62,0],.2,'yellow',{sc:[1.2,.8,.6]})],
cloud:[s([-.4,-.1,0],.38,'white'),s([.05,.15,0],.5,'white',{k:.15}),s([.5,-.12,0],.36,'white',{k:.15}),b([0,-.35,0],[.75,.2,.3],.18,'white',{k:.15})],
warn:[pp(O,[[0,.85],[.88,-.7],[-.88,-.7]],.18,.1,'yellow'),k(O,[0,.35,.18],[0,-.15,.18],.08,'black'),s([0,-.42,.18],.08,'black')],
bat:[s([0,0,0],.3,'purple'),pp([0,.0,0],[[-.95,.4],[-.3,.1],[0,.15],[.3,.1],[.95,.4],[.7,-.15],[.4,-.05],[0,-.3],[-.4,-.05],[-.7,-.15]],.05,.02,'purple'),s([-.1,.08,.26],.05,'yellow'),s([.1,.08,.26],.05,'yellow')],
candy:[s(O,.42,'pink'),n([-.65,0,0],.0,.3,.2,'pink',{r:[0,0,X]}),n([.65,0,0],.0,.3,.2,'pink',{r:[0,0,-X]}),t([0,0,.05],.25,.05,'white',{r:[0,0,0]})],
tree:[n([0,.45,0],.0,.35,.3,'green'),n([0,.05,0],.1,.55,.32,'green'),n([0,-.35,0],.15,.72,.32,'green'),c([0,-.8,0],.14,.14,.03,'brown'),s([0,.85,0],.12,'yellow'),s([-.25,-.15,.4],.07,'red'),s([.25,.2,.25],.07,'yellow'),s([.3,-.45,.45],.07,'blue')],
smile:[s(O,.78,'yellow'),s([-.25,.2,.72],.1,'black'),s([.25,.2,.72],.1,'black'),k(O,[-.4,-.1,.68],[-.18,-.32,.72],.06,'black'),k(O,[-.18,-.32,.72],[.18,-.32,.72],.06,'black'),k(O,[.18,-.32,.72],[.4,-.1,.68],.06,'black')],
bolt:[pp(O,[[.25,.92],[-.5,-.05],[0,-.05],[-.25,-.92],[.5,.15],[0,.15]],.14,.04,'yellow')],
check:[k(O,[-.6,0,0],[-.15,-.5,0],.16,'green'),k(O,[-.15,-.5,0],[.7,.6,0],.16,'green')],
clip:[k(O,[-.15,-.6,0],[-.15,.55,0],.06,'silver'),k(O,[.2,-.4,0],[.2,.7,0],.06,'silver'),t([.025,.55,0],.175,.06,'silver'),k(O,[-.15,-.6,0],[.45,-.6,0],.06,'silver'),k(O,[.45,-.6,0],[.45,.4,0],.06,'silver')],
note:[b(O,[.6,.82,.1],.05,'paper'),c([0,.78,0],.12,.62,.04,'brown',{r:[0,0,X]}),...[.35,.1,-.15,-.4].map(y=>b([0,y,.1],[.42,.025,.01],.01,'blue'))],
paint:[c(O,.8,.07,.05,'wood',{r:[X,0,0],sc:[1.15,1,1]}),s([-.4,.25,.08],.14,'red'),s([0,.42,.08],.14,'yellow'),s([.4,.25,.08],.14,'blue'),s([.45,-.15,.08],.14,'green'),c([-.3,-.3,0],.16,.3,0,'wood',{cut:1,r:[X,0,0]}),k(O,[.0,-.75,.25],[.55,.0,.3],.06,'brown'),s([.0,-.78,.25],.09,'pink')],
media:[b(O,[.85,.62,.2],.22,'red'),pp([.06,0,.2],[[-.22,.3],[-.22,-.3],[.3,0]],.04,.02,'white')],
cal:[b([0,-.1,0],[.75,.72,.1],.06,'white'),b([0,.5,.02],[.75,.18,.1],.06,'red'),t([-.38,.68,.0],.12,.04,'silver',{r:[0,X,0]}),t([.38,.68,.0],.12,.04,'silver',{r:[0,X,0]}),...[-.4,0,.4].flatMap(x=>[.05,-.3,-.6].map(y=>b([x,y,.1],[.1,.09,.01],.01,x===0&&y>0?'red':'grey')))],
hour:[c([0,.78,0],.55,.08,.03,'wood'),c([0,-.78,0],.55,.08,.03,'wood'),n([0,.35,0],.06,.42,.35,'cyan'),n([0,-.35,0],.42,.06,.35,'cyan'),n([0,-.5,.0],.33,.05,.15,'yellow')],
clock:[c(O,.75,.14,.06,'white',{r:[X,0,0]}),t([0,0,0],.75,.1,'blue'),k(O,[0,0,.16],[0,.48,.16],.05,'black'),k(O,[0,0,.16],[.35,0,.16],.05,'red')],
star:[pp(O,[[0,.9],[.22,.28],[.88,.28],[.36,-.1],[.55,-.78],[0,-.38],[-.55,-.78],[-.36,-.1],[-.88,.28],[-.22,.28]],.16,.08,'yellow')]};
BZ.reel=BZ.media;BZ.shield=BZ.clan;BZ.tcup=BZ.trophy;BZ.binf=BZ.bin.concat([s([-.15,.72,0],.25,'paper'),s([.25,.68,.1],.2,'white')]);BZ.game2=BZ.game;
window.BZI={BZ,make,cache};
// hook into ISTY
const _d=ISTY.draw;ISTY.draw=function(g,sz,PAL,nm){if(ISTY.cur.startsWith('3d')&&sz>=24&&nm&&BZ[nm]){const u=make(nm,ISTY.cur);return `<svg class="px bz isty-${ISTY.cur}" viewBox="0 0 32 32" width="48" height="48"><image href="${u}" width="32" height="32" style="image-rendering:pixelated"/></svg>`;}return _d(g,sz,PAL,nm);};
const css=document.createElement('style');css.textContent='svg.bz{width:48px!important;height:48px!important;image-rendering:pixelated}svg.bz image{image-rendering:pixelated}body[data-icons^="3d"] .icon .im{height:48px!important}';document.head.appendChild(css);
// replace shade used in renderRaw with globe-aware one
ISTY.apply();
})();
