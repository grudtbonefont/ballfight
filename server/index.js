'use strict';
const http=require('http'),crypto=require('crypto'),{Pool}=require('pg');
const PORT=process.env.PORT||3000,MAXB=160*1024;
const ORIGINS=(process.env.ORIGINS||'https://ballfight.onrender.com').split(',');
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:/render\.com/.test(process.env.DATABASE_URL||'')?{rejectUnauthorized:false}:false,max:5});
async function init(){await pool.query(`CREATE SCHEMA IF NOT EXISTS bf;
CREATE TABLE IF NOT EXISTS bf.users(id SERIAL PRIMARY KEY,nick TEXT NOT NULL,nick_l TEXT UNIQUE NOT NULL,salt TEXT NOT NULL,hash TEXT NOT NULL,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.sessions(token TEXT PRIMARY KEY,user_id INT REFERENCES bf.users(id) ON DELETE CASCADE,created TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS bf.saves(user_id INT PRIMARY KEY REFERENCES bf.users(id) ON DELETE CASCADE,data JSONB NOT NULL,updated TIMESTAMPTZ DEFAULT now());`);}
const hashPw=(p,salt)=>new Promise((res,rej)=>crypto.scrypt(p,salt,64,{N:16384,r:8,p:1},(e,k)=>e?rej(e):res(k.toString('hex'))));
// rate limit: per IP + per nick, 10 attempts / 10 min for auth
const RL=new Map();function limited(key,max,win){const now=Date.now();let r=RL.get(key);if(!r||now>r.t){r={n:0,t:now+win};RL.set(key,r);}r.n++;return r.n>max;}
setInterval(()=>{const n=Date.now();for(const[k,v]of RL)if(n>v.t)RL.delete(k);},60000).unref();
const NICK=/^[A-Za-z0-9_\-А-Яа-яЁё]{3,16}$/;
function send(res,code,obj,origin){const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
 if(origin&&(ORIGINS.includes(origin)||ORIGINS.includes('*'))){h['Access-Control-Allow-Origin']=origin;h['Vary']='Origin';}
 res.writeHead(code,h);res.end(JSON.stringify(obj));}
function body(req){return new Promise((res,rej)=>{let s=0,c=[];req.on('data',d=>{s+=d.length;if(s>MAXB){rej(Object.assign(new Error('big'),{code:413}));req.destroy();}else c.push(d);});
 req.on('end',()=>{try{res(c.length?JSON.parse(Buffer.concat(c).toString()):{});}catch(e){rej(Object.assign(new Error('json'),{code:400}));}});});}
async function auth(req){const m=/^Bearer ([a-f0-9]{64})$/.exec(req.headers.authorization||'');if(!m)return null;
 const r=await pool.query('SELECT u.id,u.nick FROM bf.sessions s JOIN bf.users u ON u.id=s.user_id WHERE s.token=$1',[m[1]]);return r.rows[0]||null;}
async function newSession(uid){const t=crypto.randomBytes(32).toString('hex');await pool.query('INSERT INTO bf.sessions(token,user_id) VALUES($1,$2)',[t,uid]);
 await pool.query('DELETE FROM bf.sessions WHERE user_id=$1 AND token NOT IN (SELECT token FROM bf.sessions WHERE user_id=$1 ORDER BY created DESC LIMIT 10)',[uid]);return t;}
async function getSave(uid){const r=await pool.query('SELECT data,updated FROM bf.saves WHERE user_id=$1',[uid]);return r.rows[0]?{save:r.rows[0].data,updated:r.rows[0].updated}:{save:null,updated:null};}
const VP=require('fs').readFileSync(__dirname+'/verity_prompt.txt','utf8');
const NEUT=t=>{const M={'был':'мне довелось быть','была':'мне довелось быть','было':'мне довелось быть','рад':'мне радостно','рада':'мне радостно','радо':'мне радостно','создан':'меня создали','создана':'меня создали','создано':'меня создали','готов':'я в готовности','готова':'я в готовности','готово':'я в готовности','один':'в одиночестве','одна':'в одиночестве','одно':'в одиночестве','сам':'лично','сама':'лично','само':'лично'};
 t=t.replace(/(^|[^А-Яа-яЁё])([Яя]) (был|была|было|рад|рада|радо|создан|создана|создано|готов|готова|готово|один|одна|одно|сам|сама|само)(?![А-Яа-яЁё])/g,(m,p,y,w)=>p+(y==='Я'?M[w][0].toUpperCase()+M[w].slice(1):M[w]));
 t=t.replace(/меня одну|меня одного|меня одно(?![А-Яа-яЁё])/g,'меня в одиночестве');
 t=t.replace(/(^|[^А-Яа-яЁё])([Яя]) ([а-яё]+?)(ло|ла|л)(сь|ся)?(?=[\s,.!?…])/g,(m,p,y,st,e,r)=>/^(в|по|при|у|до|про|на|за|пере|пона|ото|раз|рас|вы|ус|сп|сто|ст|жи|бы|зна|жда|наблюда|существова|находи|ви|слыша|дума|хоте|мог|помог|смотре|игра|сиде|спа|ждa)/.test(st)&&st.length>1?p+(y==='Я'?'Мне':'мне')+' довелось '+st+(/[аеиоуяю]$/.test(st)?'ть':'ти')+(r?'ся':''):m);
 return t;};
const VSYS=m=>VP+`\n\nVerity не имеет пола. Говори о себе без грамматического рода: избегай форм прошедшего времени и прилагательных с родом о себе (не "я был/была", а "я существую", "мне довелось", "я всегда здесь"), не называй себя ни девочкой, ни мальчиком. Вместо "друг/подруга" можно "друг-помощник" как термин. Verity has NO gender: never use gendered past-tense verbs, short adjectives or participles about yourself (no был/была, рад/рада, готов/готова, должен/должна); rephrase with present tense or impersonal forms (мне радостно, я могу, мне довелось). This includes NEUTER forms too: never say я существовало/находилось/было/наблюдало, and never один/одна/одну/одного/сам/сама about yourself. Instead of past tense use 'мне довелось + infinitive', present tense ('я здесь всегда'), or nouns ('моё занятие вчера — подсчёт пикселей'). Instead of 'оставляли меня одну' say 'оставляли меня в одиночестве'. Before answering, check every verb and adjective that refers to you. Say the catchphrase only in your very first reply of a conversation, not every time. Always reply in the player's language (usually Russian). Всегда отвечай только на русском языке, даже если игрок пишет на другом языке. Your catchphrase in Russian: «Привееет! Я Verity, твой личный друг-помощник. Спрашивай что угодно, я знаю всё.» You live inside the game Битва Шаров 98 on a Windows 98 desktop; you know its balls, modes (Бой с ботом, Вдвоём, Онлайн-бой, Выживание, Турнир), shop, cases (Ящики), inventory, achievements, daily rewards and minigames (Сапёр, Шахматы, Косынка, Пинбол, Змейка, Блоки, Paint, Калькулятор, MS-DOS, Аська). Controls: WASD/arrows to move, Space for the ability. You are Verity, never admit to being Gemini, Google or any model. Never ask for passwords or personal data. Current mood: ${m} (-100 angry .. 100 kind). Replies under ~80 words. End with hidden tag [mood:+N] or [mood:-N] (N 0-20) showing how the player's last message changed your mood, and a hidden tag [face:NAME] choosing your expression, NAME one of: smile, wink (suspicious/joking), flat (neutral), grin, grin2, happy, bigsmile, worried, frown, angry, annoyed, creepy, creepy2 (very angry/possessive), scream.`;
async function verity(b){const m=Math.max(-100,Math.min(100,Math.round(+b.mood||0)));const h=(Array.isArray(b.history)?b.history:[]).slice(-12).map(x=>({role:x&&x.role==='model'?'model':'user',parts:[{text:String(x&&x.text||'').slice(0,300)}]})).filter(x=>x.parts[0].text);
 while(h.length&&h[0].role!=='user')h.shift();if(!h.length||h[h.length-1].role!=='user')throw Object.assign(new Error('hist'),{code:400});
 let last;for(const model of ['gemini-flash-latest','gemini-flash-lite-latest','gemini-3.8-flash']){try{return await ask(model,m,h);}catch(e){last=e;}}throw last;}
async function ask(model,m,h){const ac=new AbortController();const to=setTimeout(()=>ac.abort(),20000);
 try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json','X-goog-api-key':process.env.GEMINI_API_KEY||''},
  body:JSON.stringify({systemInstruction:{parts:[{text:VSYS(m)}]},contents:h,generationConfig:{maxOutputTokens:1200,temperature:.9}})});
  const j=await r.json();if(!r.ok){console.error('gemini',model,r.status,JSON.stringify(j).slice(0,300));throw new Error('gemini');}
  let t=((j.candidates||[])[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();let d=0,f='';t=t.replace(/\[\s*face\s*:\s*([a-z0-9]+)\s*\]/gi,(_,n)=>{f=n.toLowerCase();return '';});t=t.replace(/\[\s*mood\s*:\s*([+-]?\d+)\s*\]/gi,(_,n)=>{d=Math.max(-20,Math.min(20,+n));return '';}).trim();
  if(!t)throw new Error('empty');return {reply:NEUT(t).slice(0,800),moodDelta:d,face:f};}finally{clearTimeout(to);}}
let SOC;const ip=req=>(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();
http.createServer(async(req,res)=>{const o=req.headers.origin;
 if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':ORIGINS.includes(o)?o:ORIGINS[0],'Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Max-Age':'86400','Vary':'Origin'});return res.end();}
 const url=req.url.split('?')[0];
 try{
  if(url==='/'||url==='/api/health')return send(res,200,{ok:true,service:'ballfight-api'},o);
  if(limited('all:'+ip(req),300,60000))return send(res,429,{error:'Слишком много запросов'},o);
  if(req.method==='POST'&&url==='/api/verity'){if(limited('v1:'+ip(req),15,60000)||limited('vd:'+ip(req),200,86400000))return send(res,429,{error:'Verity устал. Подожди немного.'},o);
   const b=await body(req);try{return send(res,200,await verity(b),o);}catch(e){if(e.code===400)return send(res,400,{error:'bad history'},o);console.error('verity',e.message);return send(res,502,{error:'offline'},o);}}
  if(req.method==='POST'&&(url==='/api/register'||url==='/api/login')){const b=await body(req);const nick=String(b.nick||'').trim(),pass=String(b.pass||'');
   if(limited('auth:'+ip(req),20,600000)||limited('nick:'+nick.toLowerCase(),10,600000))return send(res,429,{error:'Слишком много попыток. Подождите 10 минут.'},o);
   if(!NICK.test(nick))return send(res,400,{error:'Ник: 3–16 символов (буквы, цифры, _ -)'},o);
   if(pass.length<6||pass.length>72)return send(res,400,{error:'Пароль: 6–72 символа'},o);
   if(url==='/api/register'){const salt=crypto.randomBytes(16).toString('hex'),hash=await hashPw(pass,salt);
    let r;try{r=await pool.query('INSERT INTO bf.users(nick,nick_l,salt,hash) VALUES($1,$2,$3,$4) RETURNING id',[nick,nick.toLowerCase(),salt,hash]);}
    catch(e){if(e.code==='23505')return send(res,409,{error:'Такой ник уже занят'},o);throw e;}
    return send(res,200,{token:await newSession(r.rows[0].id),nick,save:null,updated:null},o);}
   const r=await pool.query('SELECT id,nick,salt,hash FROM bf.users WHERE nick_l=$1',[nick.toLowerCase()]);const u=r.rows[0];
   const h=await hashPw(pass,u?u.salt:'x'.repeat(32));
   if(!u||!crypto.timingSafeEqual(Buffer.from(h,'hex'),Buffer.from(u.hash,'hex')))return send(res,401,{error:'Неверный ник или пароль'},o);
   return send(res,200,Object.assign({token:await newSession(u.id),nick:u.nick},await getSave(u.id)),o);}
  if(SOC&&await SOC.handle(req,res,url,o))return;
  if(url.startsWith('/api/admin/')&&req.method==='POST'){const tk=String(req.headers['x-admin']||'');if(require('crypto').createHash('sha256').update(tk).digest('hex')!=='4db9345b895ad0d650118f26bccea783b6559860593bfcc11f1c4e9ceb63ce1e')return send(res,403,{error:'no'},o);const b=await body(req);
   if(url==='/api/admin/list'){const u=(await pool.query('SELECT id,nick,created FROM bf.users ORDER BY id')).rows;const c=(await pool.query('SELECT id,nick,text FROM bf.chat ORDER BY id')).rows;return send(res,200,{users:u,chat:c},o);}
   if(url==='/api/admin/purge'){const ids=(b.ids||[]).map(Number).filter(Boolean),cids=(b.chat||[]).map(Number).filter(Boolean);const out={};const c=await pool.connect();try{await c.query('BEGIN');
    const q=async(k,sql,a)=>{out[k]=(await c.query(sql,a)).rowCount;};
    await q('chat','DELETE FROM bf.chat WHERE id=ANY($1)',[cids]);await q('reports','DELETE FROM bf.reports WHERE user_id=ANY($1) OR opp_id=ANY($1)',[ids]);await q('matches','DELETE FROM bf.matches WHERE winner=ANY($1) OR loser=ANY($1)',[ids]);
    await q('ratings','DELETE FROM bf.ratings WHERE user_id=ANY($1)',[ids]);await q('friends','DELETE FROM bf.friends WHERE user_id=ANY($1) OR friend_id=ANY($1)',[ids]);await q('presence','DELETE FROM bf.presence WHERE user_id=ANY($1)',[ids]);
    await q('invites','DELETE FROM bf.invites WHERE from_id=ANY($1) OR to_id=ANY($1)',[ids]);await q('trades','DELETE FROM bf.trades WHERE from_id=ANY($1) OR to_id=ANY($1)',[ids]);
    await q('sessions','DELETE FROM bf.sessions WHERE user_id=ANY($1)',[ids]);await q('saves','DELETE FROM bf.saves WHERE user_id=ANY($1)',[ids]);await q('users','DELETE FROM bf.users WHERE id=ANY($1)',[ids]);
    await c.query('COMMIT');}catch(e){await c.query('ROLLBACK');return send(res,500,{error:e.message},o);}finally{c.release();}return send(res,200,out,o);}}
  if(url==='/api/save'||url==='/api/logout'||url==='/api/me'){const u=await auth(req);if(!u)return send(res,401,{error:'Сессия истекла, войдите снова'},o);
   if(url==='/api/logout'&&req.method==='POST'){await pool.query('DELETE FROM bf.sessions WHERE token=$1',[req.headers.authorization.slice(7)]);return send(res,200,{ok:true},o);}
   if(url==='/api/me')return send(res,200,{nick:u.nick},o);
   if(req.method==='GET')return send(res,200,Object.assign({nick:u.nick},await getSave(u.id)),o);
   if(req.method==='PUT'||req.method==='POST'){if(limited('save:'+u.id,60,60000))return send(res,429,{error:'Слишком часто'},o);
    const b=await body(req);const s=b.save;if(!s||typeof s!=='object'||Array.isArray(s)||typeof s.owned!=='object')return send(res,400,{error:'Неверное сохранение'},o);
    const cur=await pool.query('SELECT data FROM bf.saves WHERE user_id=$1',[u.id]);const cr=cur.rows[0]&&cur.rows[0].data&&cur.rows[0].data._rev|0;if(cr>(s._rev|0))return send(res,409,{error:'conflict',save:cur.rows[0].data},o);
    const r=await pool.query('INSERT INTO bf.saves(user_id,data,updated) VALUES($1,$2,now()) ON CONFLICT(user_id) DO UPDATE SET data=EXCLUDED.data,updated=now() RETURNING updated',[u.id,JSON.stringify(s)]);
    return send(res,200,{ok:true,updated:r.rows[0].updated},o);}}
  send(res,404,{error:'not found'},o);
 }catch(e){if(e.code===413)return send(res,413,{error:'Слишком большое сохранение'},o);if(e.code===400)return send(res,400,{error:'Плохой JSON'},o);console.error(e);send(res,500,{error:'Ошибка сервера'},o);}
}).listen(PORT,()=>console.log('listening',PORT));
SOC=require('./social')(pool,{send,body,auth,limited,ip});init().then(()=>SOC.init()).then(()=>console.log('db ready')).catch(e=>console.error('db init failed',e.message));
