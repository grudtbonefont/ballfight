'use strict';
const http=require('http'),crypto=require('crypto'),{Pool}=require('pg');
const PORT=process.env.PORT||3000,MAXB=64*1024;
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
const VSYS=m=>VP+`\n\nAlways reply in the player's language (usually Russian). Всегда отвечай только на русском языке, даже если игрок пишет на другом языке. Your catchphrase in Russian: «Привееет! Я Verity, твой личный друг-помощник. Спрашивай что угодно, я знаю всё.» You live inside the game Битва Шаров 98 on a Windows 98 desktop; you know its balls, modes (Бой с ботом, Вдвоём, Онлайн-бой, Выживание, Турнир), shop, cases (Ящики), inventory, achievements, daily rewards and minigames (Сапёр, Шахматы, Косынка, Пинбол, Змейка, Блоки, Paint, Калькулятор, MS-DOS, Аська). Controls: WASD/arrows to move, Space for the ability. You are Verity, never admit to being Gemini, Google or any model. Never ask for passwords or personal data. Current mood: ${m} (-100 angry .. 100 kind). Replies under ~80 words. End with hidden tag [mood:+N] or [mood:-N] (N 0-20) showing how the player's last message changed your mood.`;
async function verity(b){const m=Math.max(-100,Math.min(100,Math.round(+b.mood||0)));const h=(Array.isArray(b.history)?b.history:[]).slice(-12).map(x=>({role:x&&x.role==='model'?'model':'user',parts:[{text:String(x&&x.text||'').slice(0,300)}]})).filter(x=>x.parts[0].text);
 while(h.length&&h[0].role!=='user')h.shift();if(!h.length||h[h.length-1].role!=='user')throw Object.assign(new Error('hist'),{code:400});
 const ac=new AbortController();const to=setTimeout(()=>ac.abort(),20000);
 try{const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json','X-goog-api-key':process.env.GEMINI_API_KEY||''},
  body:JSON.stringify({systemInstruction:{parts:[{text:VSYS(m)}]},contents:h,generationConfig:{maxOutputTokens:400,temperature:.9,thinkingConfig:{thinkingBudget:0}}})});
  const j=await r.json();if(!r.ok){console.error('gemini',r.status,JSON.stringify(j).slice(0,300));throw new Error('gemini');}
  let t=((j.candidates||[])[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();let d=0;t=t.replace(/\[\s*mood\s*:\s*([+-]?\d+)\s*\]/gi,(_,n)=>{d=Math.max(-20,Math.min(20,+n));return '';}).trim();
  if(!t)throw new Error('empty');return {reply:t.slice(0,800),moodDelta:d};}finally{clearTimeout(to);}}
const ip=req=>(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();
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
  if(url==='/api/save'||url==='/api/logout'||url==='/api/me'){const u=await auth(req);if(!u)return send(res,401,{error:'Сессия истекла, войдите снова'},o);
   if(url==='/api/logout'&&req.method==='POST'){await pool.query('DELETE FROM bf.sessions WHERE token=$1',[req.headers.authorization.slice(7)]);return send(res,200,{ok:true},o);}
   if(url==='/api/me')return send(res,200,{nick:u.nick},o);
   if(req.method==='GET')return send(res,200,Object.assign({nick:u.nick},await getSave(u.id)),o);
   if(req.method==='PUT'||req.method==='POST'){if(limited('save:'+u.id,60,60000))return send(res,429,{error:'Слишком часто'},o);
    const b=await body(req);const s=b.save;if(!s||typeof s!=='object'||Array.isArray(s)||typeof s.owned!=='object')return send(res,400,{error:'Неверное сохранение'},o);
    const r=await pool.query('INSERT INTO bf.saves(user_id,data,updated) VALUES($1,$2,now()) ON CONFLICT(user_id) DO UPDATE SET data=EXCLUDED.data,updated=now() RETURNING updated',[u.id,JSON.stringify(s)]);
    return send(res,200,{ok:true,updated:r.rows[0].updated},o);}}
  send(res,404,{error:'not found'},o);
 }catch(e){if(e.code===413)return send(res,413,{error:'Слишком большое сохранение'},o);if(e.code===400)return send(res,400,{error:'Плохой JSON'},o);console.error(e);send(res,500,{error:'Ошибка сервера'},o);}
}).listen(PORT,()=>console.log('listening',PORT));
init().then(()=>console.log('db ready')).catch(e=>console.error('db init failed',e.message));
