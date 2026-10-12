/* Mod Rush — code partagé entre le panneau de contrôle (index.html) et l'overlay OBS (overlay.html).
   Les deux pages doivent être sur le même domaine (ton site Vercel) et ouvertes dans OBS
   (dock personnalisé + source navigateur) pour partager le même stockage. */
/* date de la version du site, affichée dans le dock : à changer à chaque mise en ligne */
const SITE_UPDATED = "2026-10-12";
const LS = "modrush.v4";
const HB = "modrush.overlay.heartbeat";

const MAX_TEXT=2000000, MAX_NAME=120;
function defaultState(){ return { text: "", full:Object.create(null), removed:Object.create(null), hiddenMods:[], wheel:{max:500, off:[], on:[]}, run:null, history:[], spin:null, event:null }; }

/* ---------- sécurité : tout ce qui vient du stockage, de pack.json ou des .jar est validé avant usage ---------- */
const isStr=v=>typeof v==="string", isNum=v=>typeof v==="number" && isFinite(v), isObj=v=>!!v && typeof v==="object" && !Array.isArray(v);
/* remplace les caractères de contrôle et d'inversion de sens (noms trompeurs) par des espaces, et limite la longueur */
function cleanText(v, max=MAX_NAME){ return String(v).replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩﻿]/g," ").trim().slice(0,max); }
/* noms qui casseraient les objets JS utilisés comme dictionnaires */
const RESERVED=new Set(["__proto__","constructor","prototype"]);
function safeName(v){ const t=cleanText(v); return RESERVED.has(t) ? t+" (mod)" : t; }
function cleanFull(f){ const out=Object.create(null); if(isObj(f)) for(const k of Object.keys(f)) if(f[k]===true && !RESERVED.has(k)) out[k]=true; return out; }
/* seules des images PNG en base64 sont acceptées comme icônes */
const SAFE_ICON=/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/;
function cleanIcons(m){ const out=Object.create(null); if(isObj(m)) for(const k of Object.keys(m)) if(!RESERVED.has(k) && isStr(m[k]) && m[k].length<120000 && SAFE_ICON.test(m[k])) out[k]=m[k]; return out; }
/* identifiants Minecraft du type "create:cogwheel" */
const SAFE_ID=/^[a-z0-9_.-]{1,64}:[a-z0-9_./-]{1,128}$/;
function cleanIds(m){ const out=Object.create(null); if(isObj(m)) for(const k of Object.keys(m)) if(!RESERVED.has(k) && isStr(m[k]) && SAFE_ID.test(m[k])) out[k]=m[k]; return out; }
const strs=a=>Array.isArray(a) ? a.filter(isStr).map(x=>x.slice(0,MAX_NAME)).slice(0,20000) : [];
function cleanRun(r){
  if(!isObj(r) || !isStr(r.mod)) return null;
  return { mod:r.mod.slice(0,MAX_NAME), checked:[...new Set(strs(r.checked))], elapsed:isNum(r.elapsed)?Math.max(0,r.elapsed):0,
    startedAt:isNum(r.startedAt)?r.startedAt:Date.now(), paused:r.paused===true, finished:r.finished===true,
    auto:strs(r.auto), base:cleanBase(r.base) };
}
/* compteurs Minecraft relevés au moment du tirage : seuls les gains après ce point cochent un objet */
function cleanBase(b){
  if(!isObj(b) || !isStr(b.src)) return null;
  const counts=Object.create(null);
  if(isObj(b.counts)) for(const k of Object.keys(b.counts)) if(SAFE_ID.test(k) && isNum(b.counts[k])) counts[k]=b.counts[k];
  return { src:b.src.slice(0,300), counts };
}
function cleanState(s){
  const d=defaultState();
  if(!isObj(s) || !isStr(s.text)) return d;
  d.text=s.text.slice(0,MAX_TEXT); d.full=cleanFull(s.full); d.run=cleanRun(s.run);
  d.hiddenMods=strs(s.hiddenMods).slice(0,500);
  if(isObj(s.wheel)) d.wheel={ max:isNum(s.wheel.max)?Math.max(0,Math.min(100000,Math.round(s.wheel.max))):500, off:strs(s.wheel.off).slice(0,1000), on:strs(s.wheel.on).slice(0,1000) };
  if(isObj(s.removed)) for(const k of Object.keys(s.removed)) if(!RESERVED.has(k)) d.removed[k]=strs(s.removed[k]).slice(0,5000);
  d.history=(Array.isArray(s.history)?s.history:[]).filter(h=>isObj(h) && isStr(h.mod)).slice(0,30).map(h=>({ mod:h.mod.slice(0,MAX_NAME),
    time:isNum(h.time)?h.time:0, done:h.done===true, got:isNum(h.got)?h.got:0, total:isNum(h.total)?h.total:0, at:isNum(h.at)?h.at:0 }));
  const sp=s.spin;
  if(isObj(sp) && [sp.id,sp.start,sp.target,sp.at,sp.dur].every(isNum) && isStr(sp.mod) && sp.dur>0 && sp.dur<=10000 && Math.abs(sp.target-sp.start)<100000)
    d.spin={id:sp.id, start:sp.start, target:sp.target, at:sp.at, dur:sp.dur, mod:sp.mod.slice(0,MAX_NAME)};
  const ev=s.event;
  if(isObj(ev) && isNum(ev.id) && ["start","item","undo","done","abandon"].includes(ev.type) && isStr(ev.mod))
    d.event={id:ev.id, type:ev.type, mod:ev.mod.slice(0,MAX_NAME), name:isStr(ev.name)?ev.name.slice(0,MAX_NAME):undefined, names:strs(ev.names).slice(0,50), auto:ev.auto===true, time:isNum(ev.time)?ev.time:0};
  return d;
}
function loadState(){
  try{ return cleanState(JSON.parse(localStorage.getItem(LS)||"null")); }catch(e){}
  return defaultState();
}
let bc=null; try{ bc=new BroadcastChannel("modrush"); }catch(e){}
function saveState(s){
  try{ localStorage.setItem(LS, JSON.stringify(s)); }catch(e){ console.warn("Sauvegarde impossible", e); }
  try{ bc && bc.postMessage("sync"); }catch(e){}
}
/* Appelle cb(state) dès que l'autre page modifie l'état : BroadcastChannel, événement storage, et vérification régulière en secours. */
function onSync(cb){
  let last=null;
  const check=()=>{ let raw=null; try{ raw=localStorage.getItem(LS); }catch(e){} if(raw!==last){ last=raw; cb(loadState()); } };
  try{ bc && bc.addEventListener("message", check); }catch(e){}
  window.addEventListener("storage", e=>{ if(e.key===LS) check(); });
  setInterval(check, 500);
  check();
}

function parse(text){
  const mods=[]; let cur=null;
  text.split(/\r?\n/).forEach(l=>{
    const t=l.trim(); if(!t) return;
    if(t.startsWith("#")){ cur={name:safeName(t.replace(/^#+\s*/,""))||"Sans nom", items:[]}; mods.push(cur); }
    else if(cur){ const n=cleanText(t); if(n && !cur.items.includes(n)) cur.items.push(n); }
  });
  return mods.filter(m=>m.items.length);
}
/* roue : un mod y est s'il n'est pas exclu, et s'il ne dépasse pas la limite d'objets (sauf s'il est forcé) */
function inWheel(m, w){ return !w.off.includes(m.name) && (w.on.includes(m.name) || !w.max || m.items.length<=w.max); }
function wheelMods(ms, w){ return ms.filter(m=>inWheel(m,w)); }
function serialize(mods){ return mods.map(m=>"# "+m.name+"\n"+m.items.join("\n")).join("\n\n"); }

function runElapsed(r){ if(!r) return 0; return r.elapsed + (r.paused||r.finished ? 0 : Date.now()-r.startedAt); }

const $ = id=>document.getElementById(id);
const esc = s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = ms=>{ const s=Math.floor(ms/1000); return [s/3600|0,(s%3600)/60|0,s%60].map(n=>String(n).padStart(2,"0")).join(":"); };
function hash(str){ let h=2166136261; for(const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return h>>>0; }

/* ---------- icônes : vraies textures extraites des .jar (IndexedDB), sinon icône pixel générée ---------- */
/* stores : "icons" (mod → {objet: image}), "ids" (mod → {objet: identifiant Minecraft}), "handles" (dossier saves choisi) */
let ICONS=Object.create(null), IDS=Object.create(null);
function idb(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open("modrush",2);
    r.onupgradeneeded=()=>{ for(const s of ["icons","ids","handles"]) if(!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s); };
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
  });
}
async function idbAll(store, clean){
  const out=Object.create(null);
  try{
    const db=await idb();
    await new Promise((res)=>{
      const c=db.transaction(store,"readonly").objectStore(store).openCursor();
      c.onsuccess=()=>{ const cur=c.result; if(cur){ if(isStr(cur.key) && !RESERVED.has(cur.key)) out[cur.key]=clean(cur.value); cur.continue(); } else res(); };
      c.onerror=()=>res();
    });
  }catch(e){}
  return out;
}
async function idbDo(store, fn){
  try{ const db=await idb(); await new Promise(res=>{ const tx=db.transaction(store,"readwrite"); fn(tx.objectStore(store)); tx.oncomplete=res; tx.onerror=res; }); }catch(e){}
}
async function idbGet(store, key){
  try{ const db=await idb(); return await new Promise(res=>{ const q=db.transaction(store,"readonly").objectStore(store).get(key); q.onsuccess=()=>res(q.result); q.onerror=()=>res(null); }); }catch(e){ return null; }
}
async function loadIcons(){ ICONS=await idbAll("icons", cleanIcons); IDS=await idbAll("ids", cleanIds); }
async function saveIcons(mod, map){
  if(RESERVED.has(mod)) return;
  map=cleanIcons(map); ICONS[mod]=map;
  await idbDo("icons", st=>st.put(map, mod));
}
async function saveIds(mod, map){
  if(RESERVED.has(mod)) return;
  map=cleanIds(map); IDS[mod]=map;
  await idbDo("ids", st=>st.put(map, mod));
}
async function clearIcons(){
  ICONS=Object.create(null); IDS=Object.create(null);
  await idbDo("icons", st=>st.clear()); await idbDo("ids", st=>st.clear());
}
const genCache=Object.create(null);
function genIcon(name){
  if(genCache[name]) return genCache[name];
  const h=hash(name), hue=h%360, c=document.createElement("canvas"); c.width=c.height=5;
  const g=c.getContext("2d");
  for(let y=0;y<5;y++) for(let x=0;x<3;x++){
    if((h>>(y*3+x))&1){ g.fillStyle=`hsl(${hue},${55+((h>>20)&15)}%,${38+((x+y)%3)*12}%)`; g.fillRect(x,y,1,1); g.fillRect(4-x,y,1,1); }
  }
  return genCache[name]=c.toDataURL();
}
function iconFor(mod, name){ const v=ICONS[mod] && ICONS[mod][name]; return isStr(v) && SAFE_ICON.test(v) ? v : genIcon(name); }
function iconHtml(mod, name){ return `<img class="ico" alt="" src="${iconFor(mod,name)}">`; }

/* ---------- sons ---------- */
let audioCtx=null;
function beep(f,d=.05,type="square",v=.05){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type; o.frequency.value=f; g.gain.value=v;
    g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime+d);
    o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+d);
  }catch(e){}
}
function fanfare(){ beep(523,.15,"square",.07); setTimeout(()=>beep(659,.15,"square",.07),150); setTimeout(()=>beep(784,.15,"square",.07),300); setTimeout(()=>beep(1047,.4,"square",.07),450); }

/* ---------- roulette (même animation sur les deux pages) ---------- */
const CELL=72;
function reelRepeat(n){ return Math.max(6, Math.ceil(150/Math.max(1,n))+3); }
function buildReel(stripEl, names){
  const R=reelRepeat(names.length); let html="";
  for(let r=0;r<R;r++) names.forEach(n=>html+=`<div class="cell">${esc(n)}</div>`);
  stripEl.innerHTML=html;
}
function setReel(stripEl,p,cell=CELL){ stripEl.style.transform=`translateY(${(-p+1)*cell}px)`; }
/* Anime de spin.start à spin.target sur spin.dur ms, synchronisé sur spin.at (horloge partagée). */
function playSpin(stripEl, spin, {cell=CELL, sound=true, onDone}={}){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur=reduce?300:spin.dur;
  let last=-1;
  function frame(){
    const k=Math.min(1,Math.max(0,(Date.now()-spin.at)/dur)), e=1-Math.pow(1-k,4);
    const p=spin.start+(spin.target-spin.start)*e; setReel(stripEl,p,cell);
    const i=Math.floor(p+.5); if(i!==last){ if(last>=0 && sound && k<1) beep(520+Math.random()*80,.03); last=i; }
    if(k<1) requestAnimationFrame(frame);
    else{ if(sound){ beep(660,.12,"square",.06); setTimeout(()=>beep(990,.25,"square",.06),110); } onDone&&onDone(); }
  }
  requestAnimationFrame(frame);
}

/* ---------- confettis pixel ---------- */
function confetti(cv, W=innerWidth, H=innerHeight){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const g=cv.getContext("2d"); cv.width=W; cv.height=H;
  const cols=["#f2c14e","#86d14a","#e5483d","#5ec8e5","#ebe8de"];
  const ps=Array.from({length:180},()=>({x:W/2+(Math.random()-.5)*240,y:H*.4,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:7+Math.random()*7|0,c:cols[Math.random()*5|0]}));
  const t0=performance.now();
  (function f(now){
    g.clearRect(0,0,cv.width,cv.height);
    ps.forEach(p=>{ p.vy+=.45; p.x+=p.vx; p.y+=p.vy; g.fillStyle=p.c; g.fillRect(p.x|0,p.y|0,p.s,p.s); });
    if(now-t0<4000) requestAnimationFrame(f); else g.clearRect(0,0,cv.width,cv.height);
  })(t0);
}

/* battement de cœur de l'overlay : {t, obs} — obs vaut true quand la page tourne dans OBS */
function readHeartbeat(){
  try{ const raw=localStorage.getItem(HB); if(!raw) return null; const v=JSON.parse(raw); return typeof v==="number" ? {t:v, obs:false} : v; }catch(e){ return null; }
}
const IN_OBS = !!window.obsstudio;
