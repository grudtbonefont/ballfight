// ---- Ability logos: bold SVG symbols always drawn on top of balls ----
(function(){
const L={dash:['f','M2 5l7 7-7 7h4l7-7-7-7zM10 5l7 7-7 7h4l7-7-7-7z'],
shield:['f','M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z'],
fire:['f','M12 1c1 4 7 6 7 13a7 7 0 0 1-14 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-7 2-10z'],
heal:['f','M9 3h6v6h6v6h-6v6H9v-6H3V9h6z'],
bomb:['f','M3 14a7 7 0 1 0 14 0a7 7 0 1 0-14 0zM13 6.5l3.5-3.5 2.5 2.5-3.5 3.5zM18 2l1.5-1.5 1 1L19 3z'],
magnet:['f','M3 3h6v9a3 3 0 0 0 6 0V3h6v9a9 9 0 0 1-18 0z'],
ice:['s','M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 3 3-3M9 20.5l3-3 3 3'],
tele:['s','M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
gun:['s','M12 2v6M12 16v6M2 12h6M16 12h6M6 12a6 6 0 1 0 12 0a6 6 0 1 0-12 0'],
web:['s','M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 6l6 6-6 6-6-6z'],
acid:['f','M12 1C9 8 4 11 4 15.5a8 8 0 0 0 16 0C20 11 15 8 12 1z'],
vamp:['f','M3 4h18v3l-4 2-2.5 12L12 9l-2.5 12L7 9 3 7z'],
elec:['f','M14 1L3 14h7l-2 9 12-14h-7l3-8z'],
blades:['f','M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z'],
clone:['s','M3 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0M11 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0'],
giant:['f','M12 1l9 10h-5v12H8V11H3z'],
spikes:['f','M12 0l2.4 6.3 5.6-3.6-1.5 6.5L24 12l-5.5 2.8 1.5 6.5-5.6-3.6L12 24l-2.4-6.3L4 21.3l1.5-6.5L0 12l5.5-2.8L4 2.7l5.6 3.6z'],
dice:['e','M3 3h18v18H3zM5.5 7.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0zM14.5 16.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0zM10 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0z'],
cactus:['f','M10 23V4a2 2 0 0 1 4 0v19zM4 14V8a1.5 1.5 0 0 1 3 0v3h3v3.5H5A1 1 0 0 1 4 14zM20 11V5a1.5 1.5 0 0 0-3 0v3h-3v3.5h5a1 1 0 0 0 1-.5z'],
laser:['s','M2 12h13M14 6l6 6-6 6M20 12h2'],
wave:['s','M1 8c3-4 5-4 8 0s5 4 8 0 4-3 6-2M1 16c3-4 5-4 8 0s5 4 8 0 4-3 6-2'],
harpoon:['s','M3 21L20 4M11 4h9v9M7 13l4 4'],
hive:['f','M12 2l8.7 5v10L12 22l-8.7-5V7z'],
glass:['f','M6 2h12l5 7-11 14L1 9z'],
shackles:['s','M2 9a4 4 0 0 1 4-4h5a4 4 0 0 1 0 8H6a4 4 0 0 1-4-4zM9 15a4 4 0 0 1 4-4h5a4 4 0 0 1 0 8h-5a4 4 0 0 1-4-4z'],
hole:['s','M12 12a1.5 1.5 0 1 1 1.5-1.5 4 4 0 1 1-5.5 3.5 6.5 6.5 0 1 1 11-4.5 9 9 0 1 1-16 6']};
const P={};
function get(id){return L[id]||null;}
// canvas draw: upright, white symbol with thick dark outline
function draw(g,id,x,y,R,alpha){const e=get(id);if(!e)return false;const sz=R*1.15,k=sz/24;
 g.save();g.translate(x-sz/2,y-sz/2);g.scale(k,k);if(alpha!=null)g.globalAlpha*=alpha;const p=P[id]||(P[id]=new Path2D(e[1]));g.lineJoin='round';g.lineCap='round';
 if(e[0]==='s'){g.strokeStyle='#111';g.lineWidth=Math.max(5.2,2.2/k+3);g.stroke(p);g.strokeStyle='#fff';g.lineWidth=3;g.stroke(p);}
 else{g.strokeStyle='#111';g.lineWidth=Math.max(3.4,2/k+1.5);g.stroke(p);g.fillStyle='#fff';g.fill(p,e[0]==='e'?'evenodd':'nonzero');}
 g.restore();return true;}
function svg(id,sz){const e=get(id);if(!e)return '';sz=sz||'70%';
 const body=e[0]==='s'?`<path d="${e[1]}" fill="none" stroke="#111" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${e[1]}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
  :`<path d="${e[1]}" fill="#fff" fill-rule="${e[0]==='e'?'evenodd':'nonzero'}" stroke="#111" stroke-width="2.4" stroke-linejoin="round" paint-order="stroke"/>`;
 return `<svg class="blogo" viewBox="-2 -2 28 28" width="${sz}" height="${sz}" style="overflow:visible;pointer-events:none">${body}</svg>`;}
window.LOGO={L,draw,svg,has:id=>!!L[id]};
})();
