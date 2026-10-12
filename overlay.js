const P=new URLSearchParams(location.search);
const SOUND=P.get("sound")!=="0";
$("hud").classList.add("pos-"+(["bl","br","tl","tr"].includes(P.get("pos"))?P.get("pos"):"bl"));
document.documentElement.style.setProperty("--scale", Math.min(2,Math.max(.5,parseFloat(P.get("scale"))||1)));

const TICKER=P.get("ticker")!=="0";
const SPEED=Math.max(20,Math.min(400,parseFloat(P.get("speed"))||90)); // pixels par seconde
if(TICKER) $("root").classList.add("has-ticker");
let state=null, mods=[], namesKey="", seenSpin=null, seenEvent=null, spinning=false, first=true;
const feed=[];

/* battement de cœur pour que le panneau de contrôle sache que l'overlay tourne */
setInterval(()=>{ try{ localStorage.setItem(HB, JSON.stringify({t:Date.now(), obs:IN_OBS})); }catch(e){} },1000);

/* s'adapte à la taille de la source navigateur (prévu pour 1920×1080, fonctionne aussi en 1280×720, 800×600…) */
function fit(){
  const s=Math.min(innerWidth/1920, innerHeight/1080), r=$("root");
  r.style.transform=`translate(${(innerWidth-1920*s)/2}px,${(innerHeight-1080*s)/2}px) scale(${s})`;
}
addEventListener("resize",fit); fit();

/* ---------- bandeau défilant ---------- */
let tickKey="", tickX=0, tickW=0, lastT=0;
function renderTicker(){
  const r=state&&state.run, tk=$("ticker");
  const mod=r&&mods.find(m=>m.name===r.mod);
  const left=mod ? mod.items.filter(n=>!r.checked.includes(n)) : [];
  if(!TICKER || !mod || spinning || r.finished || !left.length){ tk.classList.add("off"); return; }
  tk.classList.remove("off");
  $("tkCount").textContent=left.length;
  const key=mod.name+"\u0001"+left.join("\u0001");
  if(key===tickKey) return;
  tickKey=key;
  // ordre mélangé (stable pour une même liste) pour que le bandeau ne suive pas l'ordre du mod
  const order=left.slice().sort((a,b)=>hash(mod.name+a)-hash(mod.name+b));
  const group=`<div class="tk-group">${order.map(n=>`<span class="chip"><span class="slot"><img alt="" src="${iconFor(mod.name,n)}"></span>${esc(n)}</span>`).join("")}</div>`;
  const track=$("tkTrack"); track.innerHTML=group;
  tickW=track.firstElementChild.offsetWidth;
  const copies=Math.max(2, Math.ceil($("tkView").offsetWidth/Math.max(1,tickW))+1);
  track.innerHTML=group.repeat(copies);
  tickX = tickW ? tickX % tickW : 0;
}
function tickLoop(t){
  const dt=lastT?Math.min(.1,(t-lastT)/1000):0; lastT=t;
  if(tickW){ tickX=(tickX+SPEED*dt)%tickW; $("tkTrack").style.transform=`translateX(${-tickX}px)`; }
  requestAnimationFrame(tickLoop);
}
requestAnimationFrame(tickLoop);

function renderHud(){
  const r=state&&state.run, hud=$("hud");
  renderTicker();
  if(!r || spinning){ hud.classList.add("off"); return; }
  const mod=mods.find(m=>m.name===r.mod); if(!mod){ hud.classList.add("off"); return; }
  hud.classList.remove("off");
  const got=r.checked.length, tot=mod.items.length;
  $("modname").textContent=mod.name;
  $("badge").textContent= state.full[mod.name] ? "100 % du mod" : "";
  $("count").innerHTML=`<b>${got}</b> / ${tot} objets`;
  $("fill").style.width=(got/tot*100)+"%";
  $("lvl").textContent=Math.floor(got/tot*100)+"%";
  $("feed").innerHTML=feed.filter(f=>f.mod===mod.name).slice(0,3).map(f=>`<div class="toast${f.undo?" undo":""}"><span class="slot"><img alt="" src="${iconFor(f.mod,f.name)}"></span><span class="plus">${f.undo?"−":"+"}</span><span class="nm">${esc(f.name)}</span></div>`).join("");
}
function renderTime(){
  const r=state&&state.run; const t=$("time");
  t.textContent=fmt(runElapsed(r));
  t.className="time"+(r&&r.finished?" done":r&&r.paused?" paused":"");
}
setInterval(renderTime,250);

function handle(s){
  state=s;
  const key=state.text.length+":"+hash(state.text);
  if(key!==namesKey){ namesKey=key; mods=parse(state.text); buildReel($("strip"), mods.length?mods.map(m=>m.name):["Aucun mod"]); }
  const sp=state.spin;
  if(sp && sp.id!==seenSpin){
    seenSpin=sp.id;
    if(!first && Date.now()-sp.at < sp.dur){
      spinning=true; feed.length=0; $("win").classList.remove("on");
      $("stage").classList.remove("reveal"); $("stage").classList.add("on");
      playSpin($("strip"), sp, { cell:110, sound:SOUND, onDone(){
        $("stage").classList.add("reveal");
        setTimeout(()=>{ $("stage").classList.remove("on"); spinning=false; renderHud(); },2600);
      }});
    }
  }
  const ev=state.event;
  if(ev && ev.id!==seenEvent){
    seenEvent=ev.id;
    if(!first && Date.now()-ev.id<5000){
      if(ev.type==="item"){ for(const n of (ev.names.length?ev.names:[ev.name])) if(n) feed.unshift({mod:ev.mod,name:n}); if(SOUND) beep(880+Math.random()*200,.08,"triangle",.08); }
      if(ev.type==="undo"){ feed.unshift({mod:ev.mod,name:ev.name,undo:true}); }
      if(ev.type==="done"){ $("winTime").textContent=`${ev.mod} · ${fmt(ev.time)}`; $("win").classList.add("on"); if(SOUND) fanfare(); confetti($("fx"),1920,1080); setTimeout(()=>$("win").classList.remove("on"),9000); }
      if(ev.type==="start"){ feed.length=0; }
      feed.length=Math.min(feed.length,6);
    }
  }
  first=false;
  renderHud(); renderTime();
}

(async()=>{ await loadIcons(); onSync(s=>{ /* recharge les icônes si un import vient d'avoir lieu */ if(Object.keys(s.full).some(k=>!ICONS[k])) loadIcons().then(()=>handle(loadState())); else handle(s); }); })();
