'use strict';
// ELO ratings, global chat, friends/presence/invites, trades
module.exports=function(pool,{send,body,auth,limited,ip}){
const init=()=>pool.query(`
CREATE TABLE IF NOT EXISTS bf.ratings(user_id INT PRIMARY KEY REFERENCES bf.users(id) ON DELETE CASCADE,elo INT NOT NULL DEFAULT 1000,games INT NOT NULL DEFAULT 0,wins INT NOT NULL DEFAULT 0,updated TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.reports(mid TEXT NOT NULL,user_id INT NOT NULL,opp_id INT NOT NULL,win BOOLEAN NOT NULL,created TIMESTAMPTZ DEFAULT now(),PRIMARY KEY(mid,user_id));
CREATE TABLE IF NOT EXISTS bf.matches(mid TEXT PRIMARY KEY,winner INT,loser INT,delta INT,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.chat(id SERIAL PRIMARY KEY,nick TEXT NOT NULL,text TEXT NOT NULL,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.friends(user_id INT REFERENCES bf.users(id) ON DELETE CASCADE,friend_id INT REFERENCES bf.users(id) ON DELETE CASCADE,PRIMARY KEY(user_id,friend_id));
CREATE TABLE IF NOT EXISTS bf.presence(user_id INT PRIMARY KEY REFERENCES bf.users(id) ON DELETE CASCADE,last TIMESTAMPTZ DEFAULT now(),status TEXT);
CREATE TABLE IF NOT EXISTS bf.invites(id SERIAL PRIMARY KEY,from_id INT NOT NULL,to_id INT NOT NULL,room TEXT NOT NULL,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.trades(id SERIAL PRIMARY KEY,from_id INT NOT NULL,to_id INT NOT NULL,give JSONB NOT NULL,want JSONB NOT NULL,status TEXT NOT NULL DEFAULT 'open',note TEXT,created TIMESTAMPTZ DEFAULT now(),done TIMESTAMPTZ);`);
const BAD=/(х[уy][йияеёю]|п[иі]зд|[её]б[аaнлуи]|бля|сук[аи]|муд[аио]к|пид[оа]р|fuck|shit|bitch|cunt|nigg)/gi;
const clean=t=>t.replace(BAD,m=>'*'.repeat(m.length));
const uidByNick=async n=>{const r=await pool.query('SELECT id,nick FROM bf.users WHERE nick_l=$1',[String(n||'').trim().toLowerCase()]);return r.rows[0];};
const ensureR=id=>pool.query('INSERT INTO bf.ratings(user_id) VALUES($1) ON CONFLICT DO NOTHING',[id]);
function normOffer(x){x=x||{};const balls=[...new Set((Array.isArray(x.balls)?x.balls:[]).map(String).filter(s=>/^[a-z0-9_]{1,24}$/.test(s)))].slice(0,5);
 const coins=Math.max(0,Math.min(1e6,x.coins|0));const cards={};for(const[k,v]of Object.entries(x.cards||{}))if(/^[a-z0-9_]{1,24}$/.test(k)&&(v|0)>0)cards[k]=Math.min(999,v|0);return{balls,coins,cards};}
const empty=o=>!o.balls.length&&!o.coins&&!Object.keys(o.cards).length;
function canPay(s,o){if(!s||!s.owned)return 'нет сохранения';if((s.coins|0)<o.coins)return 'не хватает монет';for(const b of o.balls)if(!s.owned[b])return 'нет шара '+b;
 for(const[k,v]of Object.entries(o.cards))if(!s.owned[k]||(s.owned[k].cards|0)<v)return 'не хватает карт '+k;
 if(Object.keys(s.owned).length-o.balls.length<1)return 'нельзя отдать все шары';return null;}
function canRecv(s,o){for(const b of o.balls)if(s.owned[b])return 'уже есть шар '+b;for(const k of Object.keys(o.cards))if(!s.owned[k]&&!o.balls.includes(k))return 'нет шара для карт '+k;return null;}
function pay(a,b,o){a.coins=(a.coins|0)-o.coins;b.coins=(b.coins|0)+o.coins;
 for(const id of o.balls){b.owned[id]=a.owned[id];delete a.owned[id];if(a.sel===id)a.sel=Object.keys(a.owned)[0];if(a.skins&&a.skins[id]){b.skins=b.skins||{};b.skins[id]=a.skins[id];delete a.skins[id];}}
 for(const[k,v]of Object.entries(o.cards)){a.owned[k].cards-=v;b.owned[k].cards=(b.owned[k].cards|0)+v;}}
async function trade(tid,uid){const c=await pool.connect();try{await c.query('BEGIN');
 const t=(await c.query("SELECT * FROM bf.trades WHERE id=$1 FOR UPDATE",[tid])).rows[0];if(!t||t.to_id!==uid||t.status!=='open'){await c.query('ROLLBACK');return{error:'Сделка недоступна'};}
 const rows=(await c.query('SELECT user_id,data FROM bf.saves WHERE user_id = ANY($1) ORDER BY user_id FOR UPDATE',[[t.from_id,t.to_id]])).rows;
 const A=(rows.find(r=>r.user_id===t.from_id)||{}).data,B=(rows.find(r=>r.user_id===t.to_id)||{}).data;
 const give=normOffer(t.give),want=normOffer(t.want);
 const err=(A&&B)?(canPay(A,give)||canPay(B,want)||canRecv(B,give)||canRecv(A,want)):'нет облачного сохранения';
 if(err){await c.query("UPDATE bf.trades SET status='failed',note=$2,done=now() WHERE id=$1",[tid,err]);await c.query('COMMIT');return{error:'Сделка невозможна: '+err};}
 pay(A,B,give);pay(B,A,want);A._rev=(A._rev|0)+1;B._rev=(B._rev|0)+1;
 await c.query('UPDATE bf.saves SET data=$2,updated=now() WHERE user_id=$1',[t.from_id,JSON.stringify(A)]);
 await c.query('UPDATE bf.saves SET data=$2,updated=now() WHERE user_id=$1',[t.to_id,JSON.stringify(B)]);
 await c.query("UPDATE bf.trades SET status='done',done=now() WHERE id=$1",[tid]);await c.query('COMMIT');return{ok:true,save:B};}
 catch(e){await c.query('ROLLBACK').catch(()=>{});throw e;}finally{c.release();}}
async function report(u,b){const mid=String(b.mid||'');if(!/^[A-Za-z0-9]{8,32}$/.test(mid))return{error:'bad mid'};const opp=await uidByNick(b.opp);if(!opp||opp.id===u.id)return{error:'Соперник не найден'};
 await pool.query('INSERT INTO bf.reports(mid,user_id,opp_id,win) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[mid,u.id,opp.id,!!b.win]);
 const r=(await pool.query('SELECT * FROM bf.reports WHERE mid=$1',[mid])).rows;if(r.length<2)return{pending:true};
 const a=r.find(x=>x.user_id===u.id),o=r.find(x=>x.user_id===opp.id);if(!a||!o||a.opp_id!==o.user_id||o.opp_id!==a.user_id||a.win===o.win)return{rejected:true};
 const c=await pool.connect();try{await c.query('BEGIN');const ins=await c.query('INSERT INTO bf.matches(mid) VALUES($1) ON CONFLICT DO NOTHING RETURNING mid',[mid]);if(!ins.rowCount){await c.query('ROLLBACK');return{done:true};}
  const W=a.win?u.id:opp.id,L=a.win?opp.id:u.id;await c.query('INSERT INTO bf.ratings(user_id) VALUES($1),($2) ON CONFLICT DO NOTHING',[W,L]);
  const rr=(await c.query('SELECT user_id,elo FROM bf.ratings WHERE user_id=ANY($1) FOR UPDATE',[[W,L]])).rows;const ew=rr.find(x=>x.user_id===W).elo,el=rr.find(x=>x.user_id===L).elo;
  const d=Math.max(1,Math.round(32*(1-1/(1+Math.pow(10,(el-ew)/400)))));
  await c.query('UPDATE bf.ratings SET elo=elo+$2,games=games+1,wins=wins+1,updated=now() WHERE user_id=$1',[W,d]);await c.query('UPDATE bf.ratings SET elo=GREATEST(100,elo-$2),games=games+1,updated=now() WHERE user_id=$1',[L,d]);
  await c.query('UPDATE bf.matches SET winner=$2,loser=$3,delta=$4 WHERE mid=$1',[mid,W,L,d]);await c.query('COMMIT');return{applied:true,delta:a.win?d:-d};}
 catch(e){await c.query('ROLLBACK').catch(()=>{});throw e;}finally{c.release();}}
async function handle(req,res,url,o){
 if(req.method==='GET'&&url==='/api/top'){const t=(await pool.query('SELECT u.nick,r.elo,r.games,r.wins FROM bf.ratings r JOIN bf.users u ON u.id=r.user_id WHERE r.games>0 ORDER BY r.elo DESC,r.wins DESC LIMIT 100')).rows;
  const u=await auth(req);let me=null;if(u){await ensureR(u.id);const m=(await pool.query('SELECT elo,games,wins,(SELECT count(*)+1 FROM bf.ratings x WHERE x.games>0 AND x.elo>r.elo) AS rank FROM bf.ratings r WHERE user_id=$1',[u.id])).rows[0];me=Object.assign({nick:u.nick},m,{rank:+m.rank});}
  send(res,200,{top:t,me},o);return true;}
 if(req.method==='GET'&&url==='/api/chat'){const since=+(new URL(req.url,'http://x').searchParams.get('since'))||0;
  const r=(await pool.query('SELECT id,nick,text,created FROM bf.chat WHERE id>$1 ORDER BY id DESC LIMIT 100',[since])).rows.reverse();send(res,200,{msgs:r},o);return true;}
 if(!/^\/api\/(match|chat|friends|heartbeat|invite|trades?)(\/|$)/.test(url))return false;
 const u=await auth(req);if(!u){send(res,401,{error:'Войдите в аккаунт'},o);return true;}
 const b=req.method==='POST'?await body(req):{};
 if(url==='/api/match'&&req.method==='POST'){if(limited('rep:'+u.id,30,3600000)){send(res,429,{error:'Слишком часто'},o);return true;}send(res,200,await report(u,b),o);return true;}
 if(url==='/api/chat'&&req.method==='POST'){let t=String(b.text||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,200);if(!t){send(res,400,{error:'Пустое сообщение'},o);return true;}
  if(limited('chat3:'+u.id,1,2500)||limited('chatm:'+u.id,12,60000)){send(res,429,{error:'Не так быстро!'},o);return true;}
  t=clean(t);const r=await pool.query('INSERT INTO bf.chat(nick,text) VALUES($1,$2) RETURNING id',[u.nick,t]);await pool.query('DELETE FROM bf.chat WHERE id<=$1',[r.rows[0].id-100]);send(res,200,{ok:true,id:r.rows[0].id,text:t},o);return true;}
 if(url==='/api/heartbeat'){await pool.query('INSERT INTO bf.presence(user_id,last,status) VALUES($1,now(),$2) ON CONFLICT(user_id) DO UPDATE SET last=now(),status=EXCLUDED.status',[u.id,String(b.status||'').slice(0,40)]);
  const inv=(await pool.query("SELECT i.id,u.nick,i.room FROM bf.invites i JOIN bf.users u ON u.id=i.from_id WHERE i.to_id=$1 AND i.created>now()-interval '2 minutes'",[u.id])).rows;if(inv.length)await pool.query('DELETE FROM bf.invites WHERE to_id=$1',[u.id]);
  const tr=(await pool.query("SELECT count(*) n FROM bf.trades WHERE to_id=$1 AND status='open'",[u.id])).rows[0].n;const rv=(await pool.query("SELECT COALESCE((data->>'_rev')::int,0) rv FROM bf.saves WHERE user_id=$1",[u.id])).rows[0];send(res,200,{invites:inv,trades:+tr,rev:rv?rv.rv:0},o);return true;}
 if(url==='/api/friends'){if(req.method==='POST'){const f=await uidByNick(b.nick);if(!f){send(res,404,{error:'Игрок не найден'},o);return true;}if(f.id===u.id){send(res,400,{error:'Это вы :)'},o);return true;}
   if(b.remove)await pool.query('DELETE FROM bf.friends WHERE user_id=$1 AND friend_id=$2',[u.id,f.id]);else{const n=(await pool.query('SELECT count(*) n FROM bf.friends WHERE user_id=$1',[u.id])).rows[0].n;if(+n>=100){send(res,400,{error:'Максимум 100 друзей'},o);return true;}await pool.query('INSERT INTO bf.friends VALUES($1,$2) ON CONFLICT DO NOTHING',[u.id,f.id]);}}
  const r=(await pool.query("SELECT u.nick,(p.last>now()-interval '60 seconds') AS online,p.status,COALESCE(r.elo,1000) elo FROM bf.friends f JOIN bf.users u ON u.id=f.friend_id LEFT JOIN bf.presence p ON p.user_id=f.friend_id LEFT JOIN bf.ratings r ON r.user_id=f.friend_id WHERE f.user_id=$1 ORDER BY online DESC NULLS LAST,u.nick",[u.id])).rows;
  send(res,200,{friends:r.map(x=>({nick:x.nick,online:!!x.online,status:x.online?x.status:'',elo:x.elo}))},o);return true;}
 if(url==='/api/invite'&&req.method==='POST'){const f=await uidByNick(b.nick);const room=String(b.room||'').toUpperCase();if(!f||!/^[A-Z0-9]{4,8}$/.test(room)){send(res,400,{error:'Неверный ник или код'},o);return true;}
  if(limited('inv:'+u.id,10,60000)){send(res,429,{error:'Слишком часто'},o);return true;}await pool.query('INSERT INTO bf.invites(from_id,to_id,room) VALUES($1,$2,$3)',[u.id,f.id,room]);send(res,200,{ok:true},o);return true;}
 if(url==='/api/trades'&&req.method==='GET'){const r=(await pool.query(`SELECT t.id,a.nick AS from_nick,b.nick AS to_nick,t.give,t.want,t.status,t.note,t.created,t.done FROM bf.trades t JOIN bf.users a ON a.id=t.from_id JOIN bf.users b ON b.id=t.to_id WHERE t.from_id=$1 OR t.to_id=$1 ORDER BY t.id DESC LIMIT 50`,[u.id])).rows;send(res,200,{trades:r,me:u.nick},o);return true;}
 if(url==='/api/trade'&&req.method==='POST'){if(limited('tr:'+u.id,20,60000)){send(res,429,{error:'Слишком часто'},o);return true;}
  if(b.action==='offer'){const f=await uidByNick(b.to);if(!f||f.id===u.id){send(res,404,{error:'Игрок не найден'},o);return true;}const give=normOffer(b.give),want=normOffer(b.want);if(empty(give)&&empty(want)){send(res,400,{error:'Пустая сделка'},o);return true;}
   const s=(await pool.query('SELECT data FROM bf.saves WHERE user_id=$1',[u.id])).rows[0];const e=canPay(s&&s.data,give);if(e){send(res,400,{error:e},o);return true;}
   const n=(await pool.query("SELECT count(*) n FROM bf.trades WHERE from_id=$1 AND status='open'",[u.id])).rows[0].n;if(+n>=10){send(res,400,{error:'Слишком много открытых предложений'},o);return true;}
   const r=await pool.query('INSERT INTO bf.trades(from_id,to_id,give,want) VALUES($1,$2,$3,$4) RETURNING id',[u.id,f.id,JSON.stringify(give),JSON.stringify(want)]);send(res,200,{ok:true,id:r.rows[0].id},o);return true;}
  const id=b.id|0;
  if(b.action==='accept'){send(res,200,await trade(id,u.id),o);return true;}
  if(b.action==='decline'||b.action==='cancel'){const r=await pool.query("UPDATE bf.trades SET status=$3,done=now() WHERE id=$1 AND status='open' AND (to_id=$2 OR from_id=$2) RETURNING id",[id,u.id,b.action==='decline'?'declined':'cancelled']);send(res,200,{ok:!!r.rowCount},o);return true;}
  send(res,400,{error:'bad action'},o);return true;}
 send(res,404,{error:'not found'},o);return true;}
return{init,handle};};
