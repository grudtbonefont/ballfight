// ---- Win98 pixel-art icons (16x16 grid, shown at 32px) ----
(function(){
const PAL={k:'#000',w:'#fff',l:'#c0c0c0',g:'#808080',n:'#000080',b:'#0000ff',c:'#00ffff',t:'#008080',r:'#ff0000',m:'#800000',y:'#ffff00',o:'#808000',e:'#00ff00',d:'#008000',p:'#ff00ff',u:'#800080',s:'#c08040',a:'#804000',h:'#ffc080'};
const G={
pc:["","kkkkkkkkkkkkkkk",".kwwwwwwwwwwwlk",".kwkkkkkkkkkwgk",".kwknnnnnnnkwgk",".kwkntcttttkwgk",".kwknttttttkwgk",".kwknttttttkwgk",".kwkkkkkkkkkwgk",".kllllllllleegk",".kgggggggggggk",".kkkkkkkkkkkkkk","......kgggk",".. .kkkkkkkkkkk","....klllllllllgk","....kkkkkkkkkkkk"],
disp:["","kkkkkkkkkkkkkkk",".kwwwwwwwwwwwlk",".kwkkkkkkkkkwgk",".kwkccccccckwgk",".kwkcyycccckwgk",".kwkcyyccrrkwgk",".kwkddddrrrkwgk",".kwkkkkkkkkkwgk",".kllllllllleegk",".kgggggggggggk",".kkkkkkkkkkkkkk","......kgggk","....kkkkkkkkkkk","....klllllllllgk","....kkkkkkkkkkkk"],
bin:["","","..kkkkkkkkkkkk",".kwwwwwwwwwwwwk",".kllllllllllllk","..kkkkkkkkkkkk","..kwglwglwglgk","..kwglwglwglgk","..kwglwglwglgk","...kwglwglwgk","...kwglwglwgk","...kwglwglwgk","...kwglwglwgk","....kwglwglk","....kkkkkkkk"],
binf:["....kk.kkk","...kwwkyywk.kk","..kwwwkyyykkwwk","..kkkkkkkkkkkkk",".kwwwwwwwwwwwwk",".kllllllllllllk","..kkkkkkkkkkkk","..kwglwglwglgk","..kwglwglwglgk","...kwglwglwgk","...kwglwglwgk","...kwglwglwgk","...kwglwglwgk","....kwglwglk","....kkkkkkkk"],
note:["..k.k.k.k.k.k",".kgkgkgkgkgkgk",".kwwwwwwwwwwwkk",".kwwwwwwwwwwwkg",".kwnnnnnnnwwwkg",".kwwwwwwwwwwwkg",".kwnnnnnnnnnwkg",".kwwwwwwwwwwwkg",".kwnnnnnnwwwwkg",".kwwwwwwwwwwwkg",".kwnnnnnnnnnwkg",".kwwwwwwwwwwwkg",".kwnnnnnwwwwwkg",".kwwwwwwwwwwwkg",".kkkkkkkkkkkkkg","..ggggggggggggg"],
paint:["............kk","...........kmk","..........kmk",".........kmk","...kkkkkkllk","..ksssssklkk",".ksrrssskkbk",".ksrrsskbbk.",".ksssssskk",".ksbbsseeesk",".ksbbsseeesk",".kssssyysssk","..ksssyysssk","..kkssssssk","....kkkkkk"],
calc:["..kkkkkkkkkkk","..klllllllllgk","..kkkkkkkkkkgk","..kdeeeeeeekgk","..kdddddddekgk","..kkkkkkkkkkgk","..kwkwkwkrkkgk","..kgkgkgkmkkgk","..kwkwkwkwkkgk","..kgkgkgkgkkgk","..kwkwkwkwkkgk","..kgkgkgkgkkgk","..klllllllllgk","..kgggggggggk","..kkkkkkkkkkk"],
media:["","kkkkkkkkkkkkkkk","klllllllllllllgk","kgkkkkkkkkkkkwgk","kgknnnnnnnnnkwgk","kgknnnekknnnkwgk","kgknnneeeknnkwgk","kgknnneeeeknkwgk","kgknnneeeknnkwgk","kgknnnekknnnkwgk","kgkkkkkkkkkkkwgk","kwwwwwwwwwwwwwgk","klrlelllggggggk","kggggggggggggggk","kkkkkkkkkkkkkkk"],
cmd:["","kkkkkkkkkkkkkkkk","knnnnnnnnnnlklkk","kkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkk","kkwkkkkkkkkkkkkk","kwkkwkkwkkkkkkkk","kwkkkkwkkkkkkkkk","kwkkwkwkkkkkkkkk","kkwkkwkkwwwkkkkk","kkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkk","klllllllllllllgk","kkkkkkkkkkkkkkkk"],
icq:["......kkk","..kk.keeek.kk",".keek.keek.keek",".keeekkeekkeeek","..keeekkkkeeek","kk.kkkyyykkk.kk","keekkyyyyykkrrk","keeekyyyyykrrrk","kkekkyyyyykkrrk","..kkkkyyykkkkk","..keeekkkkeeek",".keeekkeekkeeek",".keek.keek.keek","..kk.keeek.kk","......kkk"],
mine:[".......k",".......k","...k.kkkkk.k","....kkkkkkk","...kkwwkkkkk","...kkwwkkkkk","kkkkkkkkkkkkkkk","...kkkkkkkkk","...kkkkkkkkk","....kkkkkkk","...k.kkkkk.k",".......k",".......k"],
knight:["......k.k",".....kwkwk","....kwwwwwk","...kwwkwwwwk","..kwwwwwwwwk",".kwwwwwwwwwgk",".kwkkwwwwwwgk","..kk.kwwwwgk",".....kwwwwgk","....kwwwwwgk","....kwwwwwgk","...kwwwwwwwgk","..kkkkkkkkkkkk","..kwwwwwwwwwgk","..kkkkkkkkkkkk"],
cards:["kkkkkkkk","kwwwwwwk","kwrwwwwk","kwwkkkkkkkkk","kwwkwwwwwwwwk","kwwkwrkwwwwwk","kwwkwwwwwwwwk","kwwkwwrwrwwwk","kwwkwrrrrrwwk","kkkkwrrrrrwwk","...kwwrrrwwwk","...kwwwrwwwwk","...kwwwwwwrwk","...kwwwwwwwwk","...kkkkkkkkkk"],
pin:["","....kkkkkk","...kwwlllgk","..kwwwlllggk",".kwwllllgggk",".kwlllllgggk",".klllllggggk",".kllllggggk",".klllggggggk","..kggggggggk","...kkkkkkkk","","k.kkkkk..kkkkk.k","krrrrrk..krrrrrk",".kkkkkk..kkkkkk"],
snake:["","..........kkk",".........krrrk","........kkrrrk","....kkkkkkrrk","...keeeeek..k","..keekeeeek","..keeeeeek","...kkk.keek","......keek","..kkkkkeek",".keeeeeek",".keekkkk",".keek","..keeeeeek","...kkkkkkk"],
blocks:["","..kkkkkkkk","..krrkrrrk","..krmkrrmk","..kkkkkkkkkkk","..kbbkyykyyk","..kbnkyokyok","kkkkkkkkkkkkk","keekbbkbbkuuk","kedkbnkbnkuuk","kkkkkkkkkkkkk","keekeekpppk","kedkedkpppk","kkkkkkkkkkk"],
swords:["kk...........kk","kwk.........kwk",".kwk.......kwk","..kwk.....kwk","...kwk...kwk","....kwk.kwk",".....kwkwk","......kwk",".....kwkwk","..k.kwk.kwk.k","..kkmk...kmkk","...kmk...kmk","..kmkk...kkmk",".kmk.......kmk",".kk.........kk"],
two:["","...kkk","..khhhk...kkk","..khhhk..kssk","..khhhk..khhhk","...kkk...khhhk","..kbbbk...kkk",".kbbbbbk.krrrk",".kbbbbbkkrrrrrk",".kbbbbbkkrrrrrk",".kbkbkbkkrkrkrk",".kbkbkbkkrkrkrk","..kkkkk.krrrrrk","..kk.kk..kk.kk"],
globe:["","....kkkkkk","..kkbbeebbkk",".kbbeeeebbbbk",".kbbeeeebeebk","kbbbbeebbeeebk","kbbbbbebbeeebk","kbbbbbbbbbeebk","kbeeebbbbbbbbk","kbeeeebbbbbbbk",".kbeeebbbbebk",".kbbeebbbbbbk","..kkbbbbbbkk","....kkkkkk"],
skull:["","....kkkkkk","..kkwwwwwwkk",".kwwwwwwwwwlk",".kwwwwwwwwwlk",".kwkkkwwkkklk",".kwkkkwwkkklk",".kwkkkwwkkklk",".kwwwwkkwwwlk","..kwwwkkwwlk","...kwwwwwlk","...kwkwkwk","...kwkwkwk","....kkkkk"],
trophy:["..kkkkkkkkkkk",".kkyyyyywyyykk","kyky yyyywyykyk","kykyyyyyyyyykyk","kykyyyyyyyoykyk",".kkyyyyyyyokk","...kyyyyyyok","....kyyyyok",".....kkyok","......kyk","......kyk",".....kyyok","...kkkkkkkkk","...kssssssak","...kkkkkkkkk"],
crate:["","kkkkkkkkkkkkkkk","ksssssssssssssak","ksaaaaaaaaaaasak","ksaksssssssskak","ksasksssssskaak","ksassksssskasak","ksasssksskassak","ksassssksassak","ksassskaksssak","ksasskssssksak","ksaskssssssakak","ksaaaaaaaaaaasak","kaaaaaaaaaaaaak","kkkkkkkkkkkkkkk"],
cart:["","kkk","klk","..kkkkkkkkkkkkk","..klwlwlwlwlwlk","..kwlwlwlwlwlk","...klwlwlwlwlk","...kwlwlwlwlk","....kklwlwlwk","....kkkkkkkkk","....kl","....kkkkkkkkkk","....kkk....kkk","....kgk....kgk","....kkk....kkk"],
pack:["......kkkk",".....kakka","....kak..kak","..kkkkkkkkkkkk",".ksssssssssssak",".ksssssssssssak",".kaaaaaaaaaaaak",".ksssskyykssssak",".ksssskkksssssak",".kssssssssssssak",".kssssssssssssak",".kssssssssssssak",".ksssssssssssak","..kkkkkkkkkkkk"],
medal:["...kk....kk","...kbk..kbk","...kbrk.krbk","....kbrkrbk",".....kbrbk","......kkk","....kkkkkk","...kyyyyyyk","..kyywyyyyok","..kywyyyyyok","..kyyyyyyyok","..kyyyyyyyok","...kyyyyyok","....kkkkkk"],
chart:["","..........kkk","..........krk","..........krk",".....kkk..krk",".....kbk..krk",".....kbk..krk","..kkkkbk..krk","..kekkbk..krk","..kekkbkkkkrk","..kekkbkkykrk","..kekkbkkykrk","kkkkkkkkkkkkkkk","kwwwwwwwwwwwwk"],
cal:["","..k.....k","kkkkkkkkkkkkkkk","krrrrrrrrrrrrrk","kmmmmmmmmmmmmmk","kwwwwwwwwwwwwwk","kwkwkwkwkwkwkwk","kwwwwwwwwwwwwwk","kwkwkwkwkrkwkwk","kwwwwwwwwwwwwwk","kwkwkwkwkwkwkwk","kwwwwwwwwwwwwwk","kgggggggggggggk","kkkkkkkkkkkkkkk"],
user:["","......kkkk",".....khhhhk","....khhhhhhk","....khhhhhhk","....khhhhhhk",".....khhhhk","......kkkk","....kkkkkkkk","..kkbbbbbbbbkk",".kbbbbbbbbbbbbk",".kbbbbbbbbbbbbk",".kbbbbbbbbbbbbk",".kkkkkkkkkkkkkk"],
help:["","....kkkkkk","..kkbbbbbbkk",".kbbbwwwwbbbk",".kbbwwbbwwbbk","kbbbbbbbwwbbbk","kbbbbbbwwbbbbk","kbbbbbwwbbbbbk","kbbbbbwwbbbbbk","kbbbbbbbbbbbbk",".kbbbbwwbbbbk",".kbbbbwwbbbbk","..kkbbbbbbkk","....kkkkkk"],
clip:["","......kkkk",".....kl..lk","....kl.kk.lk","....kl.kl.lk","....kl.kl.lk","....kl.kl.lk","....kl.kl.lk","....kl.kl.lk","....kl.kl.lk","....kl.kl.lk","....kl..kl.lk","....kl....lk",".....kllllk","......kkkk"],
reel:["","....kkkkkk","..kkllllllkk",".kllkkllkkllk",".kllkkllkkllk","kllllllllllllk","kkklllkkllllkk","kkklllkkllllkk","kllllllllllllk",".kllkkllkkllk",".kllkkllkkllk","..kkllllllkk","....kkkkkkkkkkk"],
folder:["","","..kkkkk",".kyyyyyk",".kyyyyyykkkkkkk",".kwwwwwwwwwwwwyk",".kwyyyyyyyyyyyok",".kwyyyyyyyyyyyok",".kwyyyyyyyyyyyok",".kwyyyyyyyyyyyok",".kwyyyyyyyyyyyok",".kwyyyyyyyyyyyok",".koooooooooooook",".kkkkkkkkkkkkkkk"],
gear:["","......kkk","...k..klk..k","..klkkklkkklk","...kllllllk","..kllkkkkllk","kkkllk..kllkkk","kllllk..kllllk","kkkllk..kllkkk","..kllkkkkllk","...kllllllk","..klkkklkkklk","...k..klk..k","......kkk"],
music:["","........kkkkkk","......kkkbbbbk","......kbbbkkbk","......kbk...bk","......kbk...kbk","......kbk....bk","......kbk....bk","......kbk..kkbk","...kkkkbk.kbbbk","..kbbbbbk.kbbbk","..kbbbbbk..kkk","...kbbbk","....kkk"],
win:["","kkkkkkkkkkkkkkk","knnnnnnnnnnlklk","kkkkkkkkkkkkkkk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kwwwwwwwwwwwwwk","kkkkkkkkkkkkkkk"],
power:["","......kk","....k.kk.k","...kk.kk.kk","..kk..kk..kk","..kk..kk..kk","..kk......kk","..kk......kk","...kk....kk","....kkkkkk"],
flag:["","...kkk","..krrrkkeee","..krrrkkeeek","..krrrkkeeek",".krrrkkeeek",".kkkkkkkkkk",".kbbbkkyyyk",".kbbbkkyyyk","kbbbkkyyyk","kbbbkkyyyk","kkkk.kkkk"],
coin:["","....kkkkk","..kkyyyyykk",".kyywyyyyyok",".kywyyoyyyok","kyyyyoyyyyok","kyyyyoyyyyok","kyyyyoyyyyok","kyyyyoyyyyok",".kyyyyyyyyok",".kyyyyyyyok","..kkooookk","....kkkkk"],
gem:["","","...kkkkkkkk","..kcwccbcbbk",".kcwccbcbbbbk","kkkkkkkkkkkkkk",".kcwcbbbbbbnk","..kcwcbbbbnk","...kcwbbbnk","....kccbnk",".....kcnk","......kk"],
cloud:["","","","....kkk","...kwwwk.kk","..kwwwwwkwwk",".kkwwwwwwwwwk","kwwwwwwwwwwwlk","kwwwwwwwwwwwlk","kllllllllllllk",".kkkkkkkkkkkk"],
hour:["","..kkkkkkkkkk","..kssssssssk","...kwwwwwwk","...kyyyyyyk","....kyyyyk",".....kyyk",".....kwyk","....kwwywk","...kwwyywwk","...kwyyyyyk","..kssssssssk","..kkkkkkkkkk"],
warn:["","......kk",".....kyyk",".....kyyk","....kyyyyk","....kykkyk","...kyykkyyk","...kyykkyyk","..kyyykkyyyk","..kyyyyyyyyk",".kyyyykkyyyyk",".kyyyyyyyyyyk","kkkkkkkkkkkkkk"],
star:["","......kk",".....kyyk",".....kyyk","kkkkkyyyykkkkk",".kyyyyyyyyyyk","..kyyyyyyyyk","...kyyyyyyk","..kyyyykyyyk","..kyykk.kkyyk",".kykk.....kyk",".kk........kk"],
dice:["","","..kkkkkkkkkk","..kwwwwwwwwlk","..kwkwwwwwwlk","..kwwwwwwwwlk","..kwwwwkwwwlk","..kwwwwwwwwlk","..kwwwwwwkwlk","..kwwwwwwwwlk","..kllllllllgk","..kkkkkkkkkk"],
clock:["","....kkkkkk","..kkwwwwwwkk",".kwwwwkwwwwlk",".kwwwwkwwwwlk","kwwwwwkwwwwwlk","kwwwwwkwwwwwlk","kwwwwwkkkkwwlk","kwwwwwwwwwwwlk",".kwwwwwwwwwlk",".kwwwwwwwwwlk","..kkllllllkk","....kkkkkk"],
spk:["","......k",".....kk","kkkkklk...k","kllllklk...k","kllllklk.k..k","kllllklk.k..k","kllllklk...k","kkkkklk...k",".....kk","......k"],
mute:["","......k",".....kk","kkkkklk","kllllklkr...r","kllllklk.r.r","kllllklk..r","kllllklk.r.r","kkkkklkr...r",".....kk","......k"],
game:["","","","..kkkkkkkkkkk",".kllllllllllllk","klkllllllllrllk","kkkkklllllrlrlk","klkllllllllrllk","klllllllllllllk",".kgggk...kgggk","..kkk.....kkk"]
};
function svg(n,s){const g=G[n]||G.win;if(window.ISTY&&ISTY.on())return ISTY.draw(g,s||32,PAL);let r='';g.forEach((row,y)=>{row=row.replace(/ /g,'');let x=0;while(x<row.length&&x<16){const c=row[x];let e=x;while(e+1<row.length&&row[e+1]===c)e++;if(PAL[c])r+=`<rect x="${x}" y="${y}" width="${e-x+1}" height="1" fill="${PAL[c]}"/>`;x=e+1;}});
 return `<svg class="px" viewBox="0 0 16 16" width="${s||32}" height="${s||32}" shape-rendering="crispEdges">${r}</svg>`;}
const BYK={'Хэллоуин':'skull','Новый год':'star','Internet Explorer':'globe','Рейтинг':'trophy','Обмен':'two','Скины':'paint','Мой компьютер':'pc','Корзина':'bin','Блокнот':'note','Paint':'paint','Калькулятор':'calc','Проигрыватель':'media','Командная строка':'cmd','Аська':'icq','Сапёр':'mine','Шахматы':'knight','Косынка':'cards','Пинбол':'pin','Змейка':'snake','Блоки':'blocks','Бой с ботом':'swords','Вдвоём':'two','Онлайн-бой':'globe','Выживание':'skull','Турнир':'trophy','Ящики':'crate','Магазин':'cart','Инвентарь':'pack','Достижения':'medal','Статистика':'chart','Награды':'cal','Аккаунт':'user','Справка':'help','Свойства экрана':'disp','Скрепыш':'clip','Повтор матча':'reel','Программы':'folder','Игры':'dice','Стандартные':'folder','Игрок':'folder','Настройки':'gear','Упорядочить значки':'folder','Выключить компьютер...':'power','Проводник':'folder'};
const EMO={'🗑️':'bin','🗑':'bin','📝':'note','🖥️':'disp','🖥':'disp','🕒':'clock','⚔️':'swords','👥':'two','🌐':'globe','💀':'skull','🏆':'trophy','📦':'crate','🛒':'cart','🎒':'pack','🎖️':'medal','🏅':'medal','📊':'chart','📅':'cal','👤':'user','❓':'help','💣':'mine','♞':'knight','🃏':'cards','🐍':'snake','🎬':'reel','🌼':'icq','☁️':'cloud','⚠️':'warn','❌':'warn','ℹ️':'help','💻':'pc','🎮':'game','🎵':'music','🎶':'music','📁':'folder','📂':'folder','🎲':'dice','⚙️':'gear','🏁':'flag','⭐':'star','★':'star','🪙':'coin','💎':'gem','⏳':'hour','🎨':'paint','🧮':'calc','📼':'media','📀':'media','💿':'media','🗂️':'folder','⏻':'power','🎯':'pin','🧱':'blocks'};
const isEmo=s=>/\p{Extended_Pictographic}|[♞⏻★]/u.test(s);
window.PX={svg,BYK,EMO,ico:(k,s)=>svg(BYK[k]||'win',s),emo:(e,s)=>svg(EMO[(e||'').trim()]||'win',s)};
const st=document.createElement('style');st.textContent=`svg.px{image-rendering:pixelated;vertical-align:middle;display:inline-block;flex:none}
.icon .im{font-size:0!important;line-height:0!important;height:32px;margin:2px auto 3px;filter:none!important}
.icon span{color:#fff;font-family:'MS Sans Serif',Tahoma,Arial,sans-serif;font-size:11px;border:1px dotted transparent;text-shadow:none}
.icon.sel span{background:#000080;outline:none;border:1px dotted #ffff7f}.icon.sel .im{opacity:1}.icon.sel .im svg{filter:sepia(1) saturate(4) hue-rotate(190deg) brightness(.7)}
.tt svg.px,#tasks svg.px,#tray svg.px,#startbtn svg.px{margin-right:3px;vertical-align:-3px}#startbtn{font-weight:bold}`;document.head.appendChild(st);
// desktop
APPS.forEach(a=>{if(BYK[a.k])a.ico=svg(BYK[a.k]);else if(isEmo(a.ico))a.ico=PX.emo(a.ico);});
const _r=Desk.render.bind(Desk);Desk.render=function(){_r();if(window.ISTY)document.querySelectorAll('#icons .icon').forEach(i=>{const n=BYK[i.dataset.k],m=i.querySelector('.im');if(n&&m&&m.querySelector('svg'))m.innerHTML=svg(n);});const b=document.querySelector('#icons .icon[data-k="Корзина"] .im');if(b)b.innerHTML=svg(this.binned.length?'binf':'bin');};Desk.render();
// start menu
function fixMenu(){document.querySelectorAll('#smitems .it').forEach(it=>{const sp=it.querySelector(':scope>span');if(!sp||sp.querySelector('svg'))return;let lab='';it.childNodes.forEach(n=>{if(n.nodeType===3)lab+=n.textContent;});lab=lab.trim().replace(/:.*$/,'');
 sp.innerHTML=BYK[lab]?svg(BYK[lab],20):(sp.textContent.trim()==='🎵'?svg('music',20):PX.emo(sp.textContent,20));sp.style.cssText='display:inline-flex;width:24px;justify-content:center';});
 const sb=document.getElementById('startbtn');if(sb&&!sb.querySelector('svg'))sb.innerHTML=svg('flag',16)+'Пуск';}
fixMenu();
// titles & tasks
const tic=w=>{if(w.id==='gamewin')return svg('game',16);const k=w.dataset.title;return BYK[k]?svg(BYK[k],16):PX.emo(w.dataset.icon,16);};
function fixTitles(){document.querySelectorAll('.win').forEach(w=>{const tt=w.querySelector('.tt');if(!tt||tt.querySelector('svg.px'))return;let t=tt.textContent;if(w.id!=='gamewin'){if(!w.dataset.title)return;t=w.dataset.title;}else t=t.replace(/^[^\wА-Яа-яЁё]+/u,'');
 tt.innerHTML='';tt.insertAdjacentHTML('beforeend',tic(w));tt.appendChild(document.createTextNode(' '+t.replace(/^\s*(\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u,'')));});}
const _u=window.updTasks;window.updTasks=updTasks=function(){_u();fixTitles();const ws=[...document.querySelectorAll('.win:not(.hide)')];const bs=[...document.querySelectorAll('#tasks button')];
 bs.forEach((b,i)=>{const w=ws[i];if(!w)return;const t=w.id==='gamewin'?'Куб-Арена':w.dataset.title;b.innerHTML='';b.insertAdjacentHTML('beforeend',tic(w));b.appendChild(document.createTextNode(t));});};
// tray
function fixTray(){[['trc','coin'],['trg','gem'],['trl','star'],['tra',null],['trm',null]].forEach(([id,n])=>{const el=document.getElementById(id);if(!el||el.querySelector('svg'))return;let t=el.textContent;const m=t.match(/^\s*((?:\p{Extended_Pictographic}|\uFE0F|★)+)\s*/u);
 if(!m)return;const nm=n||({'⏳':'hour','⚠️':'warn','☁️':'cloud','👤':'user','🔊':'spk','🔈':'spk','🔉':'spk','🔇':'mute'}[m[1]]||'user');el.innerHTML='';el.insertAdjacentHTML('beforeend',svg(nm,16));el.appendChild(document.createTextNode(t.slice(m[0].length)));});}
const _t=window.updTray;if(_t){window.updTray=updTray=function(){_t();fixTray();};}
if(window.Cloud&&Cloud.ui){const _c=Cloud.ui.bind(Cloud);Cloud.ui=function(){_c();fixTray();};}
fixTray();setInterval(()=>{fixTray();fixTitles();const sb=document.getElementById('startbtn');if(sb&&!sb.querySelector('svg'))fixMenu();},700);
{const l=document.createElement('link');l.rel='icon';l.href='data:image/svg+xml,'+encodeURIComponent(svg('flag').replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));document.head.appendChild(l);}updTasks();
})();
