// ===== social98.js — рейтинг ELO, общий чат, друзья, обмен шарами, скины =====
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=(p,m,b,ms)=>Cloud.req(p,m,b,ms||30000);
const rnd=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>'abcdefghijkmnpqrstuvwxyz23456789'[x%32]).join('');
const need=()=>{if(Cloud.auth)return true;toast('👤 Нужен аккаунт','Войдите через «Аккаунт», чтобы пользоваться сетевыми функциями');try{UI.account();}catch(e){}return false;};
const bname=id=>(BY[id]&&BY[id].name)||id;
// ---------- cloud: conflict (after trade) => adopt server save ----------
Cloud.push=async function(){if(!this.auth)return;if(this.busy){this.queue();return;}this.busy=true;this.set('sync','Сохранение в облако…');
 try{const j=await this.req('/api/save','PUT',{save});this.last=new Date(j.updated);this.set('ok','Сохранено в облаке '+this.last.toLocaleTimeString('ru-RU'));}
 catch(e){if(e.status===409&&e.data&&e.data.save){this.adopt(e.data.save);this.set('ok','Сохранение обновлено из облака');toast('🔄 Облако','Загружены изменения (обмен шарами)');}else this.set('err','Облако: '+e.message);}
 finally{this.busy=false;}};
Cloud.flush=async function(){clearTimeout(this.timer);for(let i=0;i<40&&this.busy;i++)await new Promise(r=>setTimeout(r,250));await this.push();};
// ================= SKINS =================
const SK={cache:{},MAX:9000,MAXN:6,
 get(id){return save.skins&&save.skins[id]||null;},
 img(u){if(!u||typeof u!=='string'||!/^data:image\/(webp|jpeg|png);base64,/.test(u)||u.length>12000)return null;let i=this.cache[u];if(!i){i=new Image();i.src=u;this.cache[u]=i;}return i.complete&&i.naturalWidth?i:null;},
 forBall(b,i){if((typeof G!=='undefined'&&G)&&G.kind==='online')return Net.skins?Net.skins[i]:null;return this.get(b.id);},
 paint(ctx,b,i,s){const im=this.img(this.forBall(b,i));if(!im)return;ctx.save();ctx.beginPath();ctx.arc(s.x,s.y,s.R,0,7);ctx.clip();ctx.drawImage(im,s.x-s.R,s.y-s.R,s.R*2,s.R*2);
  const g=ctx.createRadialGradient(s.x-s.R*.35,s.y-s.R*.4,s.R*.1,s.x,s.y,s.R);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=g;ctx.fillRect(s.x-s.R,s.y-s.R,s.R*2,s.R*2);ctx.restore();},
 css(b){const u=this.get(b.id);return u&&this.img(u)!==undefined&&/^data:image/.test(u)?`url(${u}) center/cover,`:'';},
 set(id,u){save.skins=save.skins||{};if(u)save.skins[id]=u;else delete save.skins[id];const ks=Object.keys(save.skins);if(ks.length>this.MAXN)delete save.skins[ks[0]];persist();}};
window.SKIN=SK;
// skin editor window
const Ed={open(){const own=ownedIds();const sel=save.sel&&own.includes(save.sel)?save.sel:own[0];
 const pal=['#000000','#ffffff','#808080','#c0c0c0','#ff0000','#800000','#ffff00','#808000','#00ff00','#008000','#00ffff','#008080','#0000ff','#000080','#ff00ff','#800080','#ff8c1a','#8b4513','#ffc0cb','#7fffd4'];
 openWin('skined','Редактор скинов',`<div style="display:flex;gap:10px;font-size:12px"><div><canvas id="sked" width="128" height="128" style="width:256px;height:256px;border-radius:50%;background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px;cursor:crosshair;image-rendering:pixelated;box-shadow:inset 0 0 0 2px #000"></canvas></div>
 <div style="width:200px"><div>Шар: <select id="skball">${own.map(id=>`<option value="${id}" ${id===sel?'selected':''}>${esc(bname(id))}</option>`).join('')}</select></div>
 <div id="skpal" style="display:grid;grid-template-columns:repeat(5,22px);gap:2px;margin:6px 0">${pal.map(c=>`<div data-c="${c}" style="width:20px;height:20px;background:${c};border:1px solid #000;cursor:pointer"></div>`).join('')}</div>
 <div>Кисть: <select id="skbr"><option>2</option><option selected>5</option><option>10</option><option>20</option></select> <label><input type="checkbox" id="skfill">Заливка</label></div>
 <div style="margin:6px 0"><button id="skclr">Очистить</button> <button id="skpaint">Из Paint</button> <button id="skrand">Узор</button></div>
 <div id="skprev" style="display:flex;justify-content:center;margin:4px 0"></div>
 <div><button id="skapply"><b>Применить</b></button> <button id="skdel">Снять скин</button></div><div id="skmsg" style="color:#800;margin-top:4px"></div>
 <div style="color:#555;margin-top:4px">Логотип способности всегда рисуется поверх скина.</div></div></div>`,{w:500,icon:'🎨'});
 const c=$('sked'),x=c.getContext('2d');let col='#ff0000',down=false,lx=0,ly=0;
 const load=id=>{x.clearRect(0,0,128,128);const u=SK.get(id);if(u){const i=new Image();i.onload=()=>{x.drawImage(i,0,0,128,128);prev();};i.src=u;}prev();};
 const prev=()=>{const id=$('skball').value;const b=BY[id];const t=c.toDataURL();$('skprev').innerHTML=`<div class="ballico" style="position:relative;background:url(${t}) center/cover,radial-gradient(circle at 35% 35%,${shade(b.color,.6)},${b.color} 55%,${shade(b.color,-.55)})">${LOGO.svg(id)}</div>`;};
 const pos=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*128/r.width,(e.clientY-r.top)*128/r.height];};
 const flood=(px,py)=>{const d=x.getImageData(0,0,128,128),a=d.data,i0=((py|0)*128+(px|0))*4,t=a.slice(i0,i0+4);const[r,g,b]=[1,3,5].map(k=>parseInt(col.substr(k,2),16));if(t[0]===r&&t[1]===g&&t[2]===b&&t[3]===255)return;const st=[[px|0,py|0]];
  const same=i=>a[i]===t[0]&&a[i+1]===t[1]&&a[i+2]===t[2]&&a[i+3]===t[3];while(st.length){const[X,Y]=st.pop();if(X<0||Y<0||X>127||Y>127)continue;const i=(Y*128+X)*4;if(!same(i))continue;a[i]=r;a[i+1]=g;a[i+2]=b;a[i+3]=255;st.push([X+1,Y],[X-1,Y],[X,Y+1],[X,Y-1]);}x.putImageData(d,0,0);};
 c.onmousedown=e=>{const[p,q]=pos(e);if($('skfill').checked){flood(p,q);prev();return;}down=true;lx=p;ly=q;c.onmousemove(e);};
 c.onmousemove=e=>{if(!down)return;const[p,q]=pos(e);x.strokeStyle=col;x.lineWidth=+$('skbr').value;x.lineCap='round';x.beginPath();x.moveTo(lx,ly);x.lineTo(p,q);x.stroke();lx=p;ly=q;};
 window.addEventListener('mouseup',()=>{if(down){down=false;prev();}});
 $('skpal').onclick=e=>{const v=e.target.dataset.c;if(v){col=v;[...$('skpal').children].forEach(d=>d.style.outline=d.dataset.c===v?'2px solid #000':'');}};
 $('skclr').onclick=()=>{x.clearRect(0,0,128,128);prev();};
 $('skrand').onclick=()=>{const h=Math.random()*360;for(let k=0;k<10;k++){x.fillStyle=`hsl(${h+k*36},80%,${40+k%3*15}%)`;x.beginPath();x.arc(64,64,64-k*6,0,7);x.fill();}prev();};
 $('skpaint').onclick=()=>{const pc=document.querySelector('#w_paint canvas');if(!pc){$('skmsg').textContent='Откройте Paint и нарисуйте что-нибудь.';return;}const s=Math.min(pc.width,pc.height);x.drawImage(pc,(pc.width-s)/2,(pc.height-s)/2,s,s,0,0,128,128);prev();};
 $('skball').onchange=()=>load($('skball').value);
 $('skapply').onclick=()=>{const t=document.createElement('canvas');t.width=t.height=128;const g=t.getContext('2d');g.beginPath();g.arc(64,64,64,0,7);g.clip();g.drawImage(c,0,0);
  let u='';for(const [sz,q] of [[128,.8],[128,.6],[96,.6],[96,.4],[64,.5]]){const t2=document.createElement('canvas');t2.width=t2.height=sz;t2.getContext('2d').drawImage(t,0,0,sz,sz);u=t2.toDataURL('image/webp',q);if(!/^data:image\/webp/.test(u))u=t2.toDataURL('image/jpeg',q);if(u.length<=SK.MAX)break;}
  if(u.length>SK.MAX){$('skmsg').textContent='Слишком сложный рисунок — упростите.';return;}SK.set($('skball').value,u);$('skmsg').style.color='#060';$('skmsg').textContent='Скин применён ('+Math.round(u.length/1024*10)/10+' КБ)';toast('🎨 Скин','Скин применён к шару «'+bname($('skball').value)+'»');};
 $('skdel').onclick=()=>{SK.set($('skball').value,null);load($('skball').value);$('skmsg').textContent='Скин снят';};
 load(sel);}};
window.SkinEd=Ed;
// ================= ONLINE HOOKS: nick, match id, skins, ELO report =================
const _send=Net.send.bind(Net);Net.send=function(o){if(o&&o.t==='hello')o.nick=Cloud.auth?Cloud.auth.nick:'';
 if(o&&o.t==='pick'){const s=SK.get(o.id);if(s&&s.length<=SK.MAX)o.skin=s;Net.mySkin=o.skin||null;}
 if(o&&o.t==='start'){o.mid=Net.mid=rnd(16);o.skins=Net.skins=[Net.mySkin||null,Net.theirSkin||null];Net.rep=null;}return _send(o);};
const _od=Net.onData.bind(Net);Net.onData=function(d){if(d&&d.t==='hello')Net.oppNick=String(d.nick||'').slice(0,16);
 if(d&&d.t==='pick')Net.theirSkin=typeof d.skin==='string'&&d.skin.length<=SK.MAX?d.skin:null;
 if(d&&d.t==='start'&&!Net.isHost){Net.mid=String(d.mid||'');Net.rep=null;Net.skins=Array.isArray(d.skins)?d.skins.map(s=>typeof s==='string'&&s.length<=SK.MAX?s:null):[null,null];}return _od(d);};
const _ov=Net.over.bind(Net);Net.over=function(w){const r=_ov(w);try{if(Cloud.auth&&Net.oppNick&&Net.mid&&Net.rep!==Net.mid){Net.rep=Net.mid;report(Net.mid,Net.oppNick,w===G.me,0);}}catch(e){}return r;};
async function report(mid,opp,win,n){try{const j=await api('/api/match','POST',{mid,opp,win});if(j.pending&&n<6)return setTimeout(()=>report(mid,opp,win,n+1),4000);
 if(j.applied)toast('📈 Рейтинг',(j.delta>0?'+':'')+j.delta+' ELO');else if(j.rejected)toast('⚠️ Рейтинг','Результаты игроков не совпали — матч не засчитан');}catch(e){}}
// ================= LEADERBOARD =================
const Top={async open(){openWin('top','Рейтинг ELO — топ 100',`<div id="topb" class="inset" style="font-size:12px;height:360px;overflow:auto">Загрузка…</div><div id="topme" style="margin-top:6px;font-size:12px"></div><div style="font-size:11px;color:#555">Рейтинг считается за онлайн-бои между игроками с аккаунтами. Оба игрока отправляют результат — засчитывается, только если они совпали.</div>`,{w:420,icon:'🏆'});
 try{const j=await api('/api/top');$('topb').innerHTML=j.top.length?`<table style="width:100%;border-collapse:collapse">${'<tr style="background:#000080;color:#fff"><th>#</th><th align=left>Игрок</th><th>ELO</th><th>Побед/Игр</th></tr>'}${j.top.map((r,i)=>`<tr style="${j.me&&r.nick===j.me.nick?'background:#ffffc0;font-weight:bold':''}"><td align=center>${i+1}</td><td>${i<3?['🥇','🥈','🥉'][i]:''} ${window.PROG?PROG.nick(r.nick,r.tag,r.title):esc(r.nick)}</td><td align=center>${r.elo}</td><td align=center>${r.wins}/${r.games}</td></tr>`).join('')}</table>`:'Пока никто не сыграл рейтинговый матч. Будьте первым!';
  $('topme').innerHTML=j.me?`Вы: <b>${esc(j.me.nick)}</b> — ELO <b>${j.me.elo}</b>, место: <b>${j.me.games>0?j.me.rank:'—'}</b> (${j.me.wins}/${j.me.games})`:'Войдите в аккаунт, чтобы попасть в рейтинг.';}catch(e){$('topb').textContent='Ошибка: '+e.message;}}};
window.Top=Top;
// ================= GLOBAL CHAT =================
const Chat={last:0,t:0,open(){openWin('gchat','Аська — Общий чат',`<div id="gcl" class="inset" style="height:300px;overflow:auto;font-size:12px;background:#fff"></div>
 <div style="display:flex;gap:4px;margin-top:4px"><input id="gci" maxlength="200" style="flex:1" placeholder="${Cloud.auth?'Сообщение всем…':'Войдите, чтобы писать'}"><button id="gcs">Отправить</button></div><div id="gcm" style="font-size:11px;color:#800"></div>`,{w:440,icon:'🌼'});
 this.last=0;$('gcl').innerHTML='';$('gcs').onclick=()=>this.send();$('gci').onkeydown=e=>{if(e.key==='Enter')this.send();};this.poll();},
 async poll(){clearTimeout(this.t);if(!$('gcl'))return;try{const j=await fetch(Cloud.api+'/api/chat?since='+this.last).then(r=>r.json());const l=$('gcl');if(!l)return;
  (j.msgs||[]).forEach(m=>{this.last=Math.max(this.last,m.id);const d=document.createElement('div');const me=Cloud.auth&&m.nick===Cloud.auth.nick;d.innerHTML=`<span style="color:#888">${new Date(m.created).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</span> ${m.tag?`<b style="color:#800080">[${esc(m.tag)}]</b> `:''}<b style="color:${me?'#c00':'#00a'}">${esc(m.nick)}</b>${m.title&&window.PROG&&PROG.TITLES[m.title]?` <i style="color:#666">«${PROG.TITLES[m.title].n}»</i>`:''}<b>:</b> ${esc(m.text)}`;l.appendChild(d);});
  if((j.msgs||[]).length){while(l.children.length>100)l.firstChild.remove();l.scrollTop=1e9;}}catch(e){}
  this.t=setTimeout(()=>this.poll(),document.hidden?15000:4000);},
 async send(){if(!need())return;const i=$('gci');const v=i.value.trim();if(!v)return;try{await api('/api/chat','POST',{text:v.slice(0,200)});i.value='';$('gcm').textContent='';this.poll();}catch(e){$('gcm').textContent=e.message;}}};
window.GChat=Chat;
// ================= FRIENDS + PRESENCE + INVITES =================
const Fr={hbT:0,async open(){if(!need())return;openWin('friends','Аська — Друзья',`<div style="display:flex;gap:4px;margin-bottom:4px"><input id="fri" placeholder="Ник друга" maxlength="16" style="flex:1"><button id="fra">Добавить</button></div>
 <div id="frl" class="inset" style="height:260px;overflow:auto;font-size:12px;background:#fff">Загрузка…</div><div id="frm" style="font-size:11px;color:#800"></div>
 <div style="font-size:11px;color:#555">🌼 зелёный — в сети. «Пригласить» создаст комнату и отправит другу код.</div>`,{w:360,icon:'🌼'});
 $('fra').onclick=()=>this.act({nick:$('fri').value});this.act(null);},
 async act(b){try{const j=b?await api('/api/friends','POST',b):await api('/api/friends');if(b&&!b.remove)$('fri').value='';this.render(j.friends);$('frm').textContent='';}catch(e){$('frm').textContent=e.message;}},
 render(f){const l=$('frl');if(!l)return;l.innerHTML=f.length?f.map(x=>`<div style="display:flex;align-items:center;gap:6px;padding:2px;border-bottom:1px solid #eee"><span style="color:${x.online?'#0a0':'#c00'};font-size:14px">✿</span><b style="flex:1">${esc(x.nick)}</b><span style="color:#666">${x.online?esc(x.status||'в сети'):'не в сети'} · ${x.elo}</span>
  <button data-inv="${esc(x.nick)}" ${x.online?'':'disabled'}>Пригласить</button><button data-tr="${esc(x.nick)}" title="Обмен">⇄</button><button data-rm="${esc(x.nick)}" title="Удалить">✕</button></div>`).join(''):'Список пуст. Добавьте друга по нику.';
  l.querySelectorAll('[data-inv]').forEach(b=>b.onclick=()=>this.invite(b.dataset.inv));l.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>this.act({nick:b.dataset.rm,remove:1}));l.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>Trade.open(b.dataset.tr));},
 async invite(nick){let code=$('oncode')&&$('oncode').textContent.trim();if(!code||!/^[A-Z0-9]{4,8}$/.test(code)){UI.online();Net.host();for(let i=0;i<60;i++){await new Promise(r=>setTimeout(r,250));code=$('oncode')&&$('oncode').textContent.trim();if(/^[A-Z0-9]{4,8}$/.test(code||''))break;}}
  if(!/^[A-Z0-9]{4,8}$/.test(code||'')){toast('⚠️ Приглашение','Не удалось создать комнату');return;}try{await api('/api/invite','POST',{nick,room:code});toast('🌼 Приглашение','Отправлено '+nick+' — комната '+code);}catch(e){toast('⚠️ Приглашение',e.message);}},
 async hb(){clearTimeout(this.hbT);this.hbT=setTimeout(()=>this.hb(),30000);if(!Cloud.auth||document.hidden)return;
  try{const st=(typeof mode!=='undefined'&&mode==='game')?'в бою':(Net.conn&&Net.conn.open?'онлайн-матч':'в сети');const j=await api('/api/heartbeat','POST',{status:st},20000);
   (j.invites||[]).forEach(v=>this.gotInvite(v));if(j.trades&&j.trades!==this.lastTr){this.lastTr=j.trades;toast('⇄ Обмен','Новых предложений: '+j.trades+' (ярлык «Обмен»)');}
   if((j.rev|0)>(save._rev|0)){const s=await api('/api/save');if(s.save&&(s.save._rev|0)>(save._rev|0)){Cloud.adopt(s.save);toast('🔄 Обмен','Сделка завершена — сохранение обновлено');}}}catch(e){}},
 gotInvite(v){openWin('finv','Приглашение в бой',`<div class="inset" style="font-size:13px">🌼 <b>${esc(v.nick)}</b> приглашает вас в онлайн-бой!<br>Комната: <b>${esc(v.room)}</b></div><div style="text-align:center;margin-top:8px"><button id="finy"><b>Принять</b></button> <button onclick="closeWin('finv')">Отказаться</button></div>`,{w:320,icon:'⚔️'});
  $('finy').onclick=()=>{closeWin('finv');UI.online();Net.join(v.room);};}};
window.Friends=Fr;
// ================= TRADES =================
const Trade={async open(to){if(!need())return;const own=ownedIds();
 openWin('trade','Обмен шарами',`<div style="font-size:12px"><fieldset><legend>Новое предложение</legend>Кому: <input id="tto" maxlength="16" value="${esc(to||'')}" style="width:120px">
 <div style="display:flex;gap:8px;margin-top:4px"><div style="flex:1"><b>Отдаю:</b><div class="inset" style="height:110px;overflow:auto;background:#fff">${own.map(id=>`<label style="display:block"><input type="checkbox" class="tg" value="${id}"> ${esc(bname(id))} (ур.${save.owned[id].lvl})</label>`).join('')}</div>🪙 <input id="tgc" type="number" min="0" value="0" style="width:70px"></div>
 <div style="flex:1"><b>Хочу:</b><div class="inset" style="height:110px;overflow:auto;background:#fff">${BALLS.filter(b=>!save.owned[b.id]).map(b=>`<label style="display:block"><input type="checkbox" class="tw" value="${b.id}"> ${esc(b.name)}</label>`).join('')||'У вас все шары'}</div>🪙 <input id="twc" type="number" min="0" value="0" style="width:70px"></div></div>
 <div style="margin-top:4px"><button id="tsend"><b>Предложить</b></button> <span id="tmsg" style="color:#800"></span></div></fieldset>
 <fieldset><legend>Предложения и журнал</legend><div id="tlist" class="inset" style="height:170px;overflow:auto;background:#fff">Загрузка…</div></fieldset>
 <div style="color:#555;font-size:11px">Обмен проверяет сервер: у обоих должно хватать шаров и монет, а дубликаты невозможны. Нужен вход в аккаунт и облачное сохранение.</div></div>`,{w:520,icon:'⇄'});
 $('tsend').onclick=()=>this.offer();this.list();},
 async offer(){const m=$('tmsg');const give={balls:[...document.querySelectorAll('.tg:checked')].map(i=>i.value),coins:Math.max(0,+$('tgc').value|0)},want={balls:[...document.querySelectorAll('.tw:checked')].map(i=>i.value),coins:Math.max(0,+$('twc').value|0)};
  if(give.coins>save.coins){m.textContent='Не хватает монет';return;}m.textContent='Отправка…';try{await Cloud.flush();await api('/api/trade','POST',{action:'offer',to:$('tto').value.trim(),give,want});m.style.color='#060';m.textContent='Предложение отправлено!';this.list();}catch(e){m.style.color='#800';m.textContent=e.message;}},
 desc(o){o=o||{};const p=[...(o.balls||[]).map(bname)];if(o.coins)p.push('🪙'+o.coins);for(const[k,v]of Object.entries(o.cards||{}))p.push(v+' карт '+bname(k));return p.join(', ')||'ничего';},
 async list(){const l=$('tlist');if(!l)return;try{const j=await api('/api/trades');const ST={open:'⏳ ожидает',done:'✅ завершена',declined:'❌ отклонена',cancelled:'🚫 отменена',failed:'⚠️ не удалась'};
  l.innerHTML=j.trades.length?j.trades.map(t=>{const mine=t.from_nick===j.me;return `<div style="border-bottom:1px solid #ddd;padding:3px">#${t.id} ${mine?'Вы → <b>'+esc(t.to_nick)+'</b>':'<b>'+esc(t.from_nick)+'</b> → вам'}: ${mine?'отдаёте':'даёт'} <i>${esc(this.desc(t.give))}</i> за <i>${esc(this.desc(t.want))}</i> — ${ST[t.status]||t.status}${t.note?' ('+esc(t.note)+')':''}
   ${t.status==='open'?(mine?`<button data-a="cancel" data-id="${t.id}">Отменить</button>`:`<button data-a="accept" data-id="${t.id}"><b>Принять</b></button><button data-a="decline" data-id="${t.id}">Отклонить</button>`):''}</div>`;}).join(''):'Сделок пока нет.';
  l.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>this.act(b.dataset.a,+b.dataset.id));}catch(e){l.textContent='Ошибка: '+e.message;}},
 async act(a,id){try{if(a==='accept')await Cloud.flush();const j=await api('/api/trade','POST',{action:a,id});if(j.error)toast('⚠️ Обмен',j.error);
  if(j.save){Cloud.adopt(j.save);toast('✅ Обмен','Сделка завершена!');try{UI.inv&&$('w_inv')&&UI.inv();}catch(e){}}this.list();}catch(e){toast('⚠️ Обмен',e.message);}}};
window.Trade=Trade;
// ================= Аська: кнопки общего чата и друзей =================
if(window.Icq){const _o=Icq.open.bind(Icq);Icq.open=function(){_o();const w=$('w_icq');if(!w||w.querySelector('.icqsoc'))return;const d=document.createElement('div');d.className='icqsoc';d.style.cssText='display:flex;gap:4px;margin:0 0 6px';
 d.innerHTML='<button onclick="GChat.open()">🌐 Общий чат</button><button onclick="Friends.open()">👥 Друзья</button><button onclick="Top.open()">🏆 Рейтинг</button>';const wb=w.querySelector('.wb')||w;wb.insertBefore(d,wb.firstChild);};}
window.EXTRA=window.EXTRA||[];
window.EXTRA.push({k:'Рейтинг',ico:'🏆',run:'Top.open()',cat:'std'},{k:'Обмен',ico:'⇄',run:'Trade.open()',cat:'std'},{k:'Скины',ico:'🎨',run:'SkinEd.open()',cat:'std'});
setTimeout(()=>Fr.hb(),5000);
})();
