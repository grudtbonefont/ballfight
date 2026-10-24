'use strict';
// Кланы, онлайн-турниры, теги/титулы в чате и рейтинге. Только схема bf.
module.exports=function(pool,{send,body,auth,limited}){
const init=()=>pool.query(`
CREATE TABLE IF NOT EXISTS bf.clans(id SERIAL PRIMARY KEY,tag TEXT NOT NULL,tag_l TEXT UNIQUE NOT NULL,name TEXT NOT NULL,owner INT,pts INT NOT NULL DEFAULT 0,wk TEXT NOT NULL DEFAULT '',wk_pts INT NOT NULL DEFAULT 0,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.clan_members(user_id INT PRIMARY KEY REFERENCES bf.users(id) ON DELETE CASCADE,clan_id INT NOT NULL REFERENCES bf.clans(id) ON DELETE CASCADE,role TEXT NOT NULL DEFAULT 'member',wk TEXT NOT NULL DEFAULT '',wk_pts INT NOT NULL DEFAULT 0,claimed TEXT NOT NULL DEFAULT '',joined TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.clan_chat(id SERIAL PRIMARY KEY,clan_id INT NOT NULL REFERENCES bf.clans(id) ON DELETE CASCADE,nick TEXT NOT NULL,text TEXT NOT NULL,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.tours(id SERIAL PRIMARY KEY,start_at TIMESTAMPTZ NOT NULL,state JSONB,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.tour_players(tour_id INT REFERENCES bf.tours(id) ON DELETE CASCADE,user_id INT REFERENCES bf.users(id) ON DELETE CASCADE,nick TEXT NOT NULL,ball TEXT,PRIMARY KEY(tour_id,user_id));`);
const BAD=/(х[уy][йияеёю]|п[иі]зд|[её]б[аaнлуи]|бля|сук[аи]|муд[аио]к|пид[оа]р|fuck|shit|bitch|cunt|nigg)/gi;
const clean=t=>t.replace(BAD,m=>'*'.repeat(m.length));
const TAG=/^[A-Za-z0-9А-Яа-яЁё]{2,5}$/,CNAME=/^[A-Za-z0-9А-Яа-яЁё _\-]{3,24}$/,TID=/^[a-z0-9_]{1,24}$/;
const week=()=>{const d=new Date();const t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));const day=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-day+3);const y=t.getUTCFullYear();const w=1+Math.round(((t-Date.UTC(y,0,4))/864e5-3+((new Date(Date.UTC(y,0,4)).getUTCDay()+6)%7))/7);return y+'-W'+String(w).padStart(2,'0');};
const target=n=>Math.min(150,25+15*n);
const ok=(res,o,j)=>{send(res,200,j,o);return true;};const err=(res,o,c,m)=>{send(res,c,{error:m},o);return true;};
const myClan=async uid=>(await pool.query('SELECT c.*,m.role,m.wk mwk,m.wk_pts mpts,m.claimed FROM bf.clan_members m JOIN bf.clans c ON c.id=m.clan_id WHERE m.user_id=$1',[uid])).rows[0];
const rollWeek=async cid=>{const w=week();await pool.query('UPDATE bf.clans SET wk=$2,wk_pts=0 WHERE id=$1 AND wk<>$2',[cid,w]);};
async function clanInfo(uid){const c=await myClan(uid);if(!c)return{clan:null,week:week()};await rollWeek(c.id);const cc=(await pool.query('SELECT * FROM bf.clans WHERE id=$1',[c.id])).rows[0];const w=week();
 const mem=(await pool.query(`SELECT u.nick,m.role,CASE WHEN m.wk=$2 THEN m.wk_pts ELSE 0 END pts,(p.last>now()-interval '60 seconds') online,COALESCE(r.elo,1000) elo,s.data->>'title' title FROM bf.clan_members m JOIN bf.users u ON u.id=m.user_id LEFT JOIN bf.presence p ON p.user_id=m.user_id LEFT JOIN bf.ratings r ON r.user_id=m.user_id LEFT JOIN bf.saves s ON s.user_id=m.user_id WHERE m.clan_id=$1 ORDER BY pts DESC,u.nick`,[c.id,w])).rows;
 return{week:w,clan:{tag:cc.tag,name:cc.name,pts:cc.pts,wk_pts:cc.wk_pts,target:target(mem.length),role:c.role,claimed:c.claimed===w,members:mem.map(m=>({nick:m.nick,role:m.role,pts:m.pts,online:!!m.online,elo:m.elo,title:TID.test(m.title||'')?m.title:''}))}};}
// ---------- tournaments ----------
const BOTN=['Робот Вася','Шарик-3000','Колобок','Бот Петрович','Кибер-шар','Глобус','Пинг-Понг','Скакун','Мячик','Тролль-бот'];
const BOTB=['dash','shield','fire','heal','bomb','magnet','ice','tele','gun','web','acid','vamp','elec','blades','clone','giant'];
const MT=150e3;// таймаут матча
function build(players){const P=players.map(p=>({nm:p.nick,uid:p.user_id,ball:p.ball||'dash'}));const nb=BOTN.slice().sort(()=>Math.random()-.5);
 while(P.length<8){const d=+(0.25+Math.random()*.55).toFixed(2);P.push({nm:nb[P.length%nb.length]+' (бот)',bot:1,d,ball:BOTB[Math.random()*BOTB.length|0]});}
 const o=P.map((_,i)=>i).sort(()=>Math.random()-.5);return{P,R:[o,[],[],[]],r:0,rep:{},t0:Date.now(),done:false};}
function step(S){let ch=true;while(ch&&!S.done){ch=false;const a=S.R[S.r];for(let k=0;k<a.length/2;k++){if(S.R[S.r+1][k]!=null)continue;const x=a[2*k],y=a[2*k+1],A=S.P[x],B=S.P[y];
  if(A.bot&&B.bot){const p=Math.max(.2,Math.min(.8,.5+(A.d-B.d)*.9));S.R[S.r+1][k]=Math.random()<p?x:y;ch=true;continue;}
  const rp=S.rep[S.r+':'+k]||{};const ra=rp[x],rb=rp[y];let w=null;
  if(A.bot||B.bot){const h=A.bot?y:x;if(rp[h]!=null)w=rp[h]?h:(h===x?y:x);else if(Date.now()-S.t0>MT*2)w=h===x?y:x;}
  else{if(ra!=null&&rb!=null&&ra!==rb)w=ra?x:y;else if(ra!=null&&rb!=null)w=Math.random()<.5?x:y;else if(Date.now()-S.t0>MT){if(ra!=null)w=ra?x:y;else if(rb!=null)w=rb?y:x;else w=Math.random()<.5?x:y;}}
  if(w!=null){S.R[S.r+1][k]=w;ch=true;}}
 if(S.R[S.r+1].filter(v=>v!=null).length===a.length/2){S.r++;S.t0=Date.now();ch=true;if(S.r===3)S.done=true;}}return S;}
async function tourState(id){const c=await pool.connect();try{await c.query('BEGIN');const t=(await c.query('SELECT * FROM bf.tours WHERE id=$1 FOR UPDATE',[id])).rows[0];if(!t){await c.query('ROLLBACK');return null;}
 const pl=(await c.query('SELECT user_id,nick,ball FROM bf.tour_players WHERE tour_id=$1 ORDER BY nick',[id])).rows;let S=t.state;
 if(!S&&Date.now()>=+t.start_at){S=build(pl);}if(S&&!S.done){const b=JSON.stringify(S);step(S);if(JSON.stringify(S)!==b||!t.state)await c.query('UPDATE bf.tours SET state=$2 WHERE id=$1',[id,JSON.stringify(S)]);}
 else if(S&&!t.state)await c.query('UPDATE bf.tours SET state=$2 WHERE id=$1',[id,JSON.stringify(S)]);
 await c.query('COMMIT');return{id,start_at:t.start_at,now:new Date(),players:pl.map(p=>p.nick),state:S?{P:S.P.map(p=>({nm:p.nm,bot:!!p.bot,d:p.d,ball:p.ball,uid:p.uid})),R:S.R,r:S.r,done:S.done,t0:S.t0}:null};}
 catch(e){await c.query('ROLLBACK').catch(()=>{});throw e;}finally{c.release();}}
async function handle(req,res,url,o){
 // рейтинг и чат с тегами клана и титулами
 if(req.method==='GET'&&url==='/api/top'){const t=(await pool.query(`SELECT u.nick,r.elo,r.games,r.wins,cl.tag,s.data->>'title' title FROM bf.ratings r JOIN bf.users u ON u.id=r.user_id LEFT JOIN bf.clan_members m ON m.user_id=u.id LEFT JOIN bf.clans cl ON cl.id=m.clan_id LEFT JOIN bf.saves s ON s.user_id=u.id WHERE r.games>0 ORDER BY r.elo DESC,r.wins DESC LIMIT 100`)).rows.map(x=>Object.assign(x,{title:TID.test(x.title||'')?x.title:''}));
  const u=await auth(req);let me=null;if(u){await pool.query('INSERT INTO bf.ratings(user_id) VALUES($1) ON CONFLICT DO NOTHING',[u.id]);const m=(await pool.query('SELECT elo,games,wins,(SELECT count(*)+1 FROM bf.ratings x WHERE x.games>0 AND x.elo>r.elo) AS rank FROM bf.ratings r WHERE user_id=$1',[u.id])).rows[0];me=Object.assign({nick:u.nick},m,{rank:+m.rank});}
  return ok(res,o,{top:t,me});}
 if(req.method==='GET'&&url==='/api/chat'){const since=+(new URL(req.url,'http://x').searchParams.get('since'))||0;
  const r=(await pool.query(`SELECT c.id,c.nick,c.text,c.created,cl.tag,s.data->>'title' title FROM bf.chat c LEFT JOIN bf.users u ON u.nick=c.nick LEFT JOIN bf.clan_members m ON m.user_id=u.id LEFT JOIN bf.clans cl ON cl.id=m.clan_id LEFT JOIN bf.saves s ON s.user_id=u.id WHERE c.id>$1 ORDER BY c.id DESC LIMIT 100`,[since])).rows.reverse().map(x=>Object.assign(x,{title:TID.test(x.title||'')?x.title:''}));return ok(res,o,{msgs:r});}
 if(req.method==='GET'&&url==='/api/clans/top'){const w=week();const r=(await pool.query(`SELECT c.tag,c.name,c.pts,CASE WHEN c.wk=$1 THEN c.wk_pts ELSE 0 END wk_pts,(SELECT count(*) FROM bf.clan_members m WHERE m.clan_id=c.id)::int members FROM bf.clans c ORDER BY wk_pts DESC,c.pts DESC LIMIT 50`,[w])).rows;return ok(res,o,{clans:r,week:w});}
 if(req.method==='GET'&&url==='/api/tags'){const q=new URL(req.url,'http://x').searchParams.get('nicks')||'';const ns=q.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean).slice(0,50);
  const r=(await pool.query(`SELECT u.nick,cl.tag,s.data->>'title' title FROM bf.users u LEFT JOIN bf.clan_members m ON m.user_id=u.id LEFT JOIN bf.clans cl ON cl.id=m.clan_id LEFT JOIN bf.saves s ON s.user_id=u.id WHERE u.nick_l=ANY($1)`,[ns])).rows;return ok(res,o,{tags:r.map(x=>({nick:x.nick,tag:x.tag||'',title:TID.test(x.title||'')?x.title:''}))});}
 if(!/^\/api\/(clan|otour)(\/|$)/.test(url))return false;
 const u=await auth(req);if(!u)return err(res,o,401,'Войдите в аккаунт');
 if(limited('pg:'+u.id,120,60000))return err(res,o,429,'Слишком часто');
 const b=req.method==='POST'?await body(req):{};
 if(url==='/api/clan'&&req.method==='GET')return ok(res,o,await clanInfo(u.id));
 if(url==='/api/clan/create'&&req.method==='POST'){const tag=String(b.tag||'').trim(),name=String(b.name||'').trim();if(!TAG.test(tag))return err(res,o,400,'Тег: 2–5 букв/цифр');if(!CNAME.test(name))return err(res,o,400,'Название: 3–24 символа');
  if(clean(tag)!==tag||clean(name)!==name)return err(res,o,400,'Недопустимые слова');if(await myClan(u.id))return err(res,o,400,'Вы уже в клане');if(limited('cc:'+u.id,3,3600000))return err(res,o,429,'Слишком часто');
  let r;try{r=await pool.query('INSERT INTO bf.clans(tag,tag_l,name,owner,wk) VALUES($1,$2,$3,$4,$5) RETURNING id',[tag.toUpperCase(),tag.toLowerCase(),name,u.id,week()]);}catch(e){if(e.code==='23505')return err(res,o,409,'Такой тег уже занят');throw e;}
  await pool.query("INSERT INTO bf.clan_members(user_id,clan_id,role) VALUES($1,$2,'leader')",[u.id,r.rows[0].id]);return ok(res,o,await clanInfo(u.id));}
 if(url==='/api/clan/join'&&req.method==='POST'){if(await myClan(u.id))return err(res,o,400,'Вы уже в клане');const c=(await pool.query('SELECT id FROM bf.clans WHERE tag_l=$1',[String(b.tag||'').trim().toLowerCase()])).rows[0];if(!c)return err(res,o,404,'Клан не найден');
  const n=(await pool.query('SELECT count(*) n FROM bf.clan_members WHERE clan_id=$1',[c.id])).rows[0].n;if(+n>=30)return err(res,o,400,'В клане максимум 30 игроков');
  await pool.query('INSERT INTO bf.clan_members(user_id,clan_id) VALUES($1,$2)',[u.id,c.id]);return ok(res,o,await clanInfo(u.id));}
 if(url==='/api/clan/leave'&&req.method==='POST'){const c=await myClan(u.id);if(!c)return err(res,o,400,'Вы не в клане');await pool.query('DELETE FROM bf.clan_members WHERE user_id=$1',[u.id]);
  const rest=(await pool.query('SELECT user_id FROM bf.clan_members WHERE clan_id=$1 ORDER BY joined LIMIT 1',[c.id])).rows[0];
  if(!rest)await pool.query('DELETE FROM bf.clans WHERE id=$1',[c.id]);else if(c.role==='leader'){await pool.query("UPDATE bf.clan_members SET role='leader' WHERE user_id=$1",[rest.user_id]);await pool.query('UPDATE bf.clans SET owner=$2 WHERE id=$1',[c.id,rest.user_id]);}
  return ok(res,o,{clan:null,week:week()});}
 if(url==='/api/clan/contrib'&&req.method==='POST'){const c=await myClan(u.id);if(!c)return ok(res,o,{clan:null});if(limited('ct:'+u.id,1,8000)||limited('ctd:'+u.id,40,86400000))return ok(res,o,{limited:true});
  const w=week();await rollWeek(c.id);await pool.query('UPDATE bf.clans SET pts=pts+1,wk_pts=wk_pts+1 WHERE id=$1',[c.id]);
  await pool.query('UPDATE bf.clan_members SET wk_pts=CASE WHEN wk=$2 THEN wk_pts+1 ELSE 1 END,wk=$2 WHERE user_id=$1',[u.id,w]);return ok(res,o,{ok:true});}
 if(url==='/api/clan/claim'&&req.method==='POST'){const i=await clanInfo(u.id);if(!i.clan)return err(res,o,400,'Вы не в клане');if(i.clan.claimed)return err(res,o,400,'Награда уже получена');if(i.clan.wk_pts<i.clan.target)return err(res,o,400,'Задание клана ещё не выполнено');
  const r=await pool.query("UPDATE bf.clan_members SET claimed=$2 WHERE user_id=$1 AND claimed<>$2 RETURNING user_id",[u.id,i.week]);if(!r.rowCount)return err(res,o,400,'Награда уже получена');return ok(res,o,{ok:true,coins:250,gems:5,week:i.week});}
 if(url==='/api/clan/chat'){const c=await myClan(u.id);if(!c)return err(res,o,400,'Вы не в клане');
  if(req.method==='POST'){let t=String(b.text||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,200);if(!t)return err(res,o,400,'Пустое сообщение');if(limited('cch:'+u.id,1,2000)||limited('cchm:'+u.id,15,60000))return err(res,o,429,'Не так быстро!');
   t=clean(t);await pool.query('INSERT INTO bf.clan_chat(clan_id,nick,text) VALUES($1,$2,$3)',[c.id,u.nick,t]);await pool.query('DELETE FROM bf.clan_chat WHERE clan_id=$1 AND id NOT IN (SELECT id FROM bf.clan_chat WHERE clan_id=$1 ORDER BY id DESC LIMIT 100)',[c.id]);}
  const since=+(new URL(req.url,'http://x').searchParams.get('since'))||0;const r=(await pool.query('SELECT id,nick,text,created FROM bf.clan_chat WHERE clan_id=$1 AND id>$2 ORDER BY id DESC LIMIT 60',[c.id,since])).rows.reverse();return ok(res,o,{msgs:r});}
 // ---- online tournament ----
 if(url==='/api/otour/join'&&req.method==='POST'){if(limited('otj:'+u.id,6,60000))return err(res,o,429,'Слишком часто');const ball=/^[a-z0-9_]{1,24}$/.test(String(b.ball||''))?String(b.ball):'dash';
  const mine=(await pool.query("SELECT t.id FROM bf.tour_players p JOIN bf.tours t ON t.id=p.tour_id WHERE p.user_id=$1 AND (t.state IS NULL OR NOT COALESCE((t.state->>'done')::boolean,false)) AND t.created>now()-interval '1 hour' ORDER BY t.id DESC LIMIT 1",[u.id])).rows[0];
  if(mine)return ok(res,o,await tourState(mine.id));
  let t=(await pool.query("SELECT t.id FROM bf.tours t WHERE t.state IS NULL AND t.start_at>now()+interval '5 seconds' AND (SELECT count(*) FROM bf.tour_players p WHERE p.tour_id=t.id)<8 ORDER BY t.id LIMIT 1")).rows[0];
  if(!t)t=(await pool.query("INSERT INTO bf.tours(start_at) VALUES(now()+interval '60 seconds') RETURNING id")).rows[0];
  await pool.query('INSERT INTO bf.tour_players(tour_id,user_id,nick,ball) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[t.id,u.id,u.nick,ball]);
  const n=(await pool.query('SELECT count(*) n FROM bf.tour_players WHERE tour_id=$1',[t.id])).rows[0].n;if(+n>=8)await pool.query('UPDATE bf.tours SET start_at=LEAST(start_at,now()) WHERE id=$1',[t.id]);
  return ok(res,o,await tourState(t.id));}
 if(url==='/api/otour/state'){const id=+(new URL(req.url,'http://x').searchParams.get('id'))||+b.id||0;const s=await tourState(id);if(!s)return err(res,o,404,'Турнир не найден');return ok(res,o,Object.assign(s,{me:u.id}));}
 if(url==='/api/otour/report'&&req.method==='POST'){const id=b.id|0;const c=await pool.connect();try{await c.query('BEGIN');const t=(await c.query('SELECT state FROM bf.tours WHERE id=$1 FOR UPDATE',[id])).rows[0];const S=t&&t.state;
   if(!S||S.done){await c.query('ROLLBACK');return err(res,o,400,'Турнир завершён');}const me=S.P.findIndex(p=>p.uid===u.id);const a=S.R[S.r];const k=Math.floor(a.indexOf(me)/2);
   if(me<0||a.indexOf(me)<0||S.R[S.r+1][k]!=null){await c.query('ROLLBACK');return ok(res,o,{ok:false});}
   const key=S.r+':'+k;S.rep[key]=S.rep[key]||{};if(S.rep[key][me]==null)S.rep[key][me]=!!b.win;step(S);await c.query('UPDATE bf.tours SET state=$2 WHERE id=$1',[id,JSON.stringify(S)]);await c.query('COMMIT');}
  catch(e){await c.query('ROLLBACK').catch(()=>{});throw e;}finally{c.release();}return ok(res,o,Object.assign(await tourState(id),{me:u.id}));}
 if(url==='/api/otour/leave'&&req.method==='POST'){await pool.query('DELETE FROM bf.tour_players p USING bf.tours t WHERE t.id=p.tour_id AND p.user_id=$1 AND t.state IS NULL',[u.id]);return ok(res,o,{ok:true});}
 return err(res,o,404,'not found');}
return{init,handle};};
