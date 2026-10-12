let state = loadState();
let mods = parse(state.text);
let spinning=false, tickTimer=null, soundHere=false, stripPos=0, filterText="", removeMode=false;

/* ---------- roulette ---------- */
function rebuildReel(){
  const names = mods.length ? mods.map(m=>m.name) : ["Aucun mod"];
  buildReel($("strip"), names);
  const idx = state.run ? Math.max(0, mods.findIndex(m=>m.name===state.run.mod)) : 0;
  stripPos = names.length*2 + idx; setReel($("strip"), stripPos);
  const full=mods.filter(m=>state.full[m.name]).length;
  $("poolInfo").textContent = `${mods.length} mod${mods.length>1?"s":""}${full?` · ${full} complet${full>1?"s":""}`:""}`;
}
function eligible(){
  const done = new Set(state.history.filter(h=>h.done).map(h=>h.mod));
  let pool = mods.map((m,i)=>i);
  if($("optNoRepeat").checked){ const f=pool.filter(i=>!done.has(mods[i].name)); if(f.length) pool=f; }
  if(pool.length>1 && state.run) pool = pool.filter(i=>mods[i].name!==state.run.mod);
  return pool;
}
function draw(){
  if(spinning || !mods.length) return;
  const b=$("btnDraw");
  if(state.run && !state.run.finished){
    if(!b.dataset.confirm){
      b.dataset.confirm="1"; b.textContent="Rush en cours : recliquer pour abandonner et retirer";
      setTimeout(()=>{ delete b.dataset.confirm; refreshDrawBtn(); },3500);
      return;
    }
    delete b.dataset.confirm; endRun(false);
  }
  const pool=eligible(), pick=pool[Math.floor(Math.random()*pool.length)], n=mods.length;
  const spin={ id:Date.now(), start: stripPos % n + n*2, target: n*(reelRepeat(n)-3)+pick, at: Date.now()+120, dur:4200, mod: mods[pick].name };
  state.spin=spin; state.run=null; saveState(state);
  spinning=true; refreshDrawBtn(); renderBoard(); renderClock();
  playSpin($("strip"), spin, { sound: soundHere, onDone(){ stripPos=spin.target; spinning=false; startRun(mods[pick]); } });
}
function refreshDrawBtn(){
  const b=$("btnDraw");
  b.disabled = spinning || !mods.length;
  b.textContent = spinning ? "Ça tourne…" : (state.run && !state.run.finished ? "Retirer un autre mod" : "Tirer un mod");
}

/* ---------- rush ---------- */
function startRun(mod){
  state.run={mod:mod.name, checked:[], elapsed:0, startedAt:Date.now(), paused:false, finished:false, auto:[], base:snapBase(mod.name)};
  state.event={id:Date.now(), type:"start", mod:mod.name};
  save(); render(); startTick();
}
function save(){ saveState(state); }
function startTick(){ clearInterval(tickTimer); tickTimer=setInterval(renderClock,250); renderClock(); }
function togglePause(){
  const r=state.run; if(!r||r.finished) return;
  if(r.paused){ r.paused=false; r.startedAt=Date.now(); } else { r.elapsed=runElapsed(r); r.paused=true; }
  save(); render();
}
function endRun(done){
  const r=state.run; if(!r) return;
  const mod=mods.find(m=>m.name===r.mod);
  r.elapsed=runElapsed(r); r.finished=true;
  state.history.unshift({mod:r.mod, time:r.elapsed, done, got:r.checked.length, total:mod?mod.items.length:r.checked.length, at:Date.now()});
  state.history=state.history.slice(0,30);
  if(!done) state.run=null;
  state.event={id:Date.now(), type: done?"done":"abandon", mod:r.mod, time:r.elapsed};
  save(); render();
}
function toggleItem(name){
  const r=state.run; if(!r||r.finished) return;
  const i=r.checked.indexOf(name);
  if(i>=0){ r.checked.splice(i,1); r.auto=r.auto.filter(n=>n!==name); rebaseItem(r,name); if(soundHere) beep(300,.05); state.event={id:Date.now(), type:"undo", mod:r.mod, name}; }
  else{ r.checked.push(name); if(soundHere) beep(880+Math.random()*200,.07,"triangle",.07); state.event={id:Date.now(), type:"item", mod:r.mod, name}; }
  afterCheck();
}
/* sauvegarde après un cochage et termine le rush si tout est obtenu */
function afterCheck(){
  const r=state.run, mod=mods.find(m=>m.name===r.mod);
  if(mod && r.checked.length>=mod.items.length){ save(); endRun(true); if(soundHere) fanfare(); confetti($("fx")); return; }
  save(); renderBoard(); renderClock();
}

/* ---------- rendu ---------- */
function renderClock(){
  const r=state.run, c=$("clock");
  c.textContent=fmt(runElapsed(r));
  c.className="clock "+(!r?"idle":r.finished?"done":r.paused?"idle":"run");
  $("timerState").textContent = spinning?"tirage…": !r?"en attente": r.finished?"terminé": r.paused?"en pause":"en cours";
  $("btnPause").disabled=!r||r.finished; $("btnPause").textContent=r&&r.paused?"Reprendre":"Pause";
  const a=$("btnAbandon"); a.disabled=!r||r.finished; if(!a.dataset.confirm) a.textContent="Abandonner";
}
function renderBoard(){
  const r=state.run, b=$("board");
  if(!r){ b.innerHTML=`<div class="panel-h"><span>Objets</span><span>—</span></div><div class="placeholder">${spinning?"La roulette tourne…":"Lance la roulette pour tirer le mod à rusher."}</div>`; return; }
  const mod=mods.find(m=>m.name===r.mod);
  if(!mod){ b.innerHTML=`<div class="placeholder">Le mod « ${esc(r.mod)} » n'est plus dans la liste.</div>`; return; }
  const got=r.checked.length, tot=mod.items.length, pct=Math.floor(got/tot*100);
  const q=filterText.toLowerCase();
  const list=mod.items.filter(n=>!q||n.toLowerCase().includes(q));
  list.sort((a,b)=>(r.checked.includes(a)-r.checked.includes(b)));
  const full=state.full[mod.name];
  b.innerHTML=`
    <div class="panel-h"><span>Mod tiré</span><span class="badge ${full?"full":"part"}">${full?"liste complète":"liste partielle"}</span></div>
    <div class="mod-head">
      <h2 class="mod-name">${esc(mod.name)}</h2>
      <div class="counts"><span><b>${got}</b> / ${tot} obtenus</span><span>${tot-got} restant${tot-got>1?"s":""}</span></div>
      <div class="xpbar" role="progressbar" aria-valuemin="0" aria-valuemax="${tot}" aria-valuenow="${got}"><div class="xpfill" style="width:${got/tot*100}%"></div><span class="xplvl">${pct}%</span></div>
    </div>
    ${r.finished?`<div class="win">Mod complété en ${fmt(r.elapsed)} !</div>`:""}
    <div class="filter"><input id="flt" type="search" placeholder="Chercher un objet…" value="${esc(filterText)}" aria-label="Chercher un objet"><button type="button" class="btn${removeMode?" danger on":""}" id="btnRemove" aria-pressed="${removeMode}">${removeMode?"Terminer le retrait":"Retirer des objets"}</button></div>
    ${removeMode?`<p class="hint">Clique sur un objet impossible à obtenir pour le retirer définitivement de la liste de ce mod.</p>`:""}
    <div class="items${removeMode?" removing":""}">${list.map(n=>`<button type="button" class="item${r.checked.includes(n)?" ok":""}" data-n="${esc(n)}" aria-pressed="${r.checked.includes(n)}"><span class="slot">${iconHtml(mod.name,n)}</span><span class="n">${esc(n)}</span>${r.auto.includes(n)?`<span class="auto" title="Détecté dans le jeu">auto</span>`:""}</button>`).join("")||`<div class="empty">Aucun objet ne correspond.</div>`}</div>`;
  $("btnRemove").onclick=()=>{ removeMode=!removeMode; renderBoard(); };
  $("flt").addEventListener("input",e=>{ filterText=e.target.value; const pos=e.target.selectionStart; renderBoard(); const nf=$("flt"); nf.focus(); nf.setSelectionRange(pos,pos); });
}
function renderHist(){
  const h=$("hist");
  if(!state.history.length){ h.innerHTML=`<li class="empty" style="padding:8px 0">Aucun rush pour l'instant.</li>`; return; }
  h.innerHTML=state.history.map(x=>`<li><span>${esc(x.mod)}</span><span class="t${x.done?"":" ab"}">${x.done?fmt(x.time):`abandon ${x.got}/${x.total}`}</span></li>`).join("");
}
function render(){ renderBoard(); renderClock(); renderHist(); refreshDrawBtn(); renderDetect(); }

/* ---------- détection Minecraft : lit saves/<monde>/stats/<uuid>.json ----------
   Minecraft y compte, par identifiant d'objet, ce qui a été ramassé, fabriqué, utilisé ou jeté.
   Le fichier n'est réécrit qu'aux sauvegardes du monde (automatique toutes les 5 min, et en quittant le monde). */
const STAT_KINDS=["minecraft:picked_up","minecraft:crafted","minecraft:used","minecraft:dropped"];
const MAX_STATS=20*1024*1024, POLL_MS=3000, STALE_MS=6*60*1000, JAR_POLL_MS=30000;
const FS_OK=typeof window.showDirectoryPicker==="function";
let detDir=null, detTimer=null, jarTimer=null, detPerm="", detErr="", SNAP=null; // SNAP = {src, world, modified, counts}

/* compteurs actuels des objets d'un mod, pris comme point de départ du rush */
function snapBase(modName){
  if(!SNAP || !$("optFresh").checked) return null;
  const counts=Object.create(null);
  for(const id of Object.values(IDS[modName]||{})) if(SNAP.counts[id]) counts[id]=SNAP.counts[id];
  return {src:SNAP.src, counts};
}
/* accepte le dossier de l'instance, son dossier saves, ou directement un monde */
async function listStats(dir){
  const out=[];
  async function world(w){
    let st; try{ st=await w.getDirectoryHandle("stats"); }catch(e){ return; }
    for await (const h of st.values()) if(h.kind==="file" && /\.json$/i.test(h.name)) out.push({h, world:w.name, src:w.name+"/"+h.name});
  }
  await world(dir);
  if(out.length) return out;
  let saves=dir; try{ saves=await dir.getDirectoryHandle("saves"); }catch(e){}
  for await (const h of saves.values()) if(h.kind==="directory") await world(h);
  return out;
}
async function readStats(){
  try{
    const cands=await listStats(detDir);
    if(!cands.length){ detErr="noworld"; return; }
    let best=null; // le monde joué le plus récemment
    for(const c of cands){ const f=await c.h.getFile(); if(!best || f.lastModified>best.f.lastModified) best={...c, f}; }
    if(!(SNAP && SNAP.src===best.src && SNAP.modified===best.f.lastModified)){
      if(best.f.size>MAX_STATS){ detErr="format"; return; }
      const j=looseJson(await best.f.text()), stats=isObj(j) && isObj(j.stats) ? j.stats : null;
      if(!stats){ detErr="format"; return; }
      const counts=Object.create(null);
      for(const k of STAT_KINDS) if(isObj(stats[k])) for(const [id,n] of Object.entries(stats[k])) if(SAFE_ID.test(id) && isNum(n) && n>0) counts[id]=(counts[id]||0)+n;
      SNAP={src:best.src, world:cleanText(best.world,60), modified:best.f.lastModified, counts};
    }
    detErr=""; applySnap();
  }catch(e){
    detErr = e && e.name==="NotAllowedError" ? "perm" : e && e.name==="NotFoundError" ? "gone" : "read";
  }finally{ renderDetect(); }
}
/* coche les objets du mod dont un compteur a augmenté depuis le point de départ */
function applySnap(){
  const r=state.run; if(!SNAP || !r || r.finished) return;
  const ids=IDS[r.mod], mod=mods.find(m=>m.name===r.mod); if(!ids || !mod) return;
  if($("optFresh").checked && !r.base){ r.base=snapBase(r.mod); save(); return; } // détection lancée en cours de rush : on part d'ici
  const base = r.base && r.base.src===SNAP.src ? r.base.counts : null; // autre monde que celui du tirage (nouveau monde) : tout compte
  const found=mod.items.filter(n=>ids[n] && !r.checked.includes(n) && (SNAP.counts[ids[n]]||0) > ((base && base[ids[n]])||0));
  if(!found.length) return;
  r.checked.push(...found); r.auto.push(...found);
  state.event={id:Date.now(), type:"item", mod:r.mod, name:found[0], names:found, auto:true};
  if(soundHere) beep(880+Math.random()*200,.07,"triangle",.07);
  afterCheck();
}
/* décocher un objet à la main : la détection ne le recochera que si son compteur augmente encore */
function rebaseItem(r, name){
  const id=IDS[r.mod] && IDS[r.mod][name]; if(!SNAP || !id) return;
  if(!r.base || r.base.src!==SNAP.src) r.base={src:SNAP.src, counts:Object.create(null)};
  r.base.counts[id]=SNAP.counts[id]||0;
}

/* ---------- mises à jour des mods : compare les .jar du dossier mods à la dernière lecture ----------
   Empreinte d'un .jar = taille + date de modification. Un .jar nouveau ou modifié est relu et sa liste fusionnée. */
const JARS_KEY="jars.v2"; // changer la clé force une relecture de tous les .jar (nouvelles règles de tri)
let jarBusy=false, jarInfo={state:"", count:0, changes:[], missing:[]};
async function scanJars(){
  if(jarBusy || !detDir || spinning) return; // pas de reconstruction de la roulette pendant un tirage
  let modsDir; try{ modsDir=await detDir.getDirectoryHandle("mods"); }catch(e){ jarInfo.state="nomods"; renderDetect(); return; }
  if(typeof JSZip==="undefined"){ jarInfo.state="err"; renderDetect(); return; }
  jarBusy=true;
  try{
    const known=(await idbGet("handles",JARS_KEY))||{}, now={}, todo=[];
    for await (const h of modsDir.values()){
      if(h.kind!=="file" || !/\.jar$/i.test(h.name)) continue;
      const f=await h.getFile(), fp=f.size+":"+f.lastModified, k=known[h.name];
      if(k && k.fp===fp) now[h.name]=k; else todo.push({h, f, fp});
    }
    jarInfo.count=Object.keys(now).length+todo.length;
    if(todo.length){ jarInfo.state="scan"; jarInfo.todo=todo.length; renderDetect(); }
    const lang=$("impLang").value, skipEggs=$("impEggs").checked, results=[], structMods=[];
    for(const t of todo){
      let r=null; try{ r=await readJar(t.f, lang, skipEggs); }catch(e){}
      now[t.h.name]={fp:t.fp, mod: r && r.items.length>=3 ? r.name : null};
      if(r && r.items.length>=3) results.push(r);
      if(r && r.structures) structMods.push(r.name);
    }
    const changes=results.length||structMods.length ? await mergeJars(results, structMods) : [];
    const present=new Set(Object.values(now).map(x=>x.mod).filter(Boolean));
    jarInfo.missing=[...new Set(Object.values(known).map(x=>x.mod).filter(m=>m && !present.has(m)))];
    if(changes.length) jarInfo.changes=changes;
    jarInfo.state="ok";
    await idbDo("handles", st=>st.put(now,JARS_KEY));
  }catch(e){ jarInfo.state = e && e.name==="NotAllowedError" ? "perm" : "err"; }
  jarBusy=false; renderDetect();
}
/* fusionne les listes relues dans la liste actuelle ; renvoie un résumé des changements */
async function mergeJars(results, structMods=[]){
  const list=parse(state.text), changes=[];
  // mods de structures ajoutés auparavant : on les sort de la roulette (sauf s'ils sont en cours de rush)
  for(const name of structMods){
    const i=list.findIndex(x=>x.name===name);
    if(i>=0 && state.full[name] && !(state.run && state.run.mod===name)){ list.splice(i,1); delete state.full[name]; changes.push({mod:name, structures:true}); }
  }
  for(const r of results){
    const m=list.find(x=>x.name===r.name);
    if(!m && state.hiddenMods.includes(r.name)) continue; // mod retiré volontairement de la roulette
    if(!m){ list.push({name:r.name, items:r.items}); state.full[r.name]=true; changes.push({mod:r.name, isNew:true, added:r.items.length, gone:0}); }
    else{
      const removed=new Set(state.removed[r.name]||[]);
      const added=r.items.filter(i=>!m.items.includes(i) && !removed.has(i));
      // on ne retire des objets que d'une liste issue d'un .jar, jamais d'une liste tapée à la main
      const gone=state.full[r.name] ? m.items.filter(i=>!r.items.includes(i)) : [];
      if(added.length || gone.length){
        m.items=m.items.filter(i=>!gone.includes(i)).concat(added);
        if(state.run && state.run.mod===r.name){ state.run.checked=state.run.checked.filter(i=>!gone.includes(i)); state.run.auto=state.run.auto.filter(i=>!gone.includes(i)); }
        changes.push({mod:r.name, added:added.length, gone:gone.length});
      }
    }
    await saveIcons(r.name, r.icons); await saveIds(r.name, r.ids);
  }
  if(changes.length){
    list.sort((a,b)=>a.name.localeCompare(b.name,"fr"));
    state.text=serialize(list); mods=parse(state.text);
    save(); rebuildReel(); render();
  }
  return changes;
}
/* après un import manuel ou le chargement du pack, la prochaine vérification relit tous les .jar */
const resetJars=()=>idbDo("handles", st=>st.delete(JARS_KEY));

const ago=ms=>{ const s=Math.max(0,Math.round(ms/1000)); return s<60?`${s} s`:s<3600?`${Math.round(s/60)} min`:`${Math.round(s/3600)} h`; };
function renderDetect(){
  const C=[], add=(lvl,txt,sub)=>C.push({lvl,txt,sub});
  const r=state.run, ids=r && IDS[r.mod], mod=r && mods.find(m=>m.name===r.mod);
  const active=!!(detDir && detPerm==="granted" && !["perm","gone"].includes(detErr));
  if(!FS_OK) add("ko","Lecture de dossier impossible ici","Le navigateur d'OBS doit être à jour (OBS 30 ou plus récent).");
  else if(detErr==="pick") add("ko","Impossible d'ouvrir le dossier","OBS a refusé l'accès. Réessaie, ou mets OBS à jour.");
  else if(!detDir) add("wait","Aucun dossier choisi","Choisis le dossier de ton instance, par exemple D:\\curseForge\\Instances\\ModRush.");
  else if(detPerm!=="granted") add("warn-c","Autorisation à renouveler","Clique sur « Réactiver la détection » : l'accès au dossier est redemandé à chaque démarrage.");
  else if(!active) add("ko","Dossier inaccessible",detErr==="gone"?"Le dossier a été déplacé ou supprimé. Choisis-le à nouveau.":"L'accès a été refusé. Choisis le dossier à nouveau.");
  else add("ok",`Dossier « ${detDir.name} » autorisé`);
  if(active){
    if(detErr==="noworld") add("ko","Aucun monde trouvé","Ouvre un monde dans le jeu : ses statistiques apparaissent à la première sauvegarde.");
    else if(detErr==="format" || detErr==="read") add("ko","Statistiques illisibles","Le fichier stats du monde est vide ou en cours d'écriture. Nouvel essai dans quelques secondes.");
    else if(SNAP){
      add("ok",`Monde « ${SNAP.world} » trouvé`);
      const age=Date.now()-SNAP.modified;
      if(age<STALE_MS) add("ok","Statistiques à jour",`Dernière sauvegarde du jeu il y a ${ago(age)}.`);
      else add("warn-c","Pas de sauvegarde récente",`Dernière il y a ${ago(age)}. Le jeu est-il lancé sur ce monde ? Minecraft sauvegarde toutes les 5 min.`);
    }else add("wait","Recherche du monde…");
    const J=jarInfo, sum=J.changes.map(c=>c.structures?`${c.mod} retiré (mod de structures)`:c.isNew?`nouveau mod ${c.mod} (${c.added} objets)`:`${c.mod} : +${c.added} / −${c.gone}`).join(" · ");
    if(J.state==="nomods") add("warn-c","Dossier mods introuvable","Pour suivre les mises à jour des mods, choisis le dossier de l'instance (celui qui contient mods et saves).");
    else if(J.state==="scan") add("wait",`Lecture de ${J.todo} mod${J.todo>1?"s":""} nouveau${J.todo>1?"x":""} ou mis à jour…`);
    else if(J.state==="err" || J.state==="perm") add("ko","Mods illisibles","Impossible de lire le dossier mods. Nouvel essai dans 30 s.");
    else if(J.state==="ok"){
      if(J.missing.length) add("warn-c",`Mod${J.missing.length>1?"s":""} absent${J.missing.length>1?"s":""} de l'instance`,`${J.missing.join(", ")} : toujours dans la roulette, retire-le${J.missing.length>1?"s":""} via « Modifier la liste » si besoin.`);
      add("ok", J.changes.length?"Mods mis à jour":"Mods à jour", J.changes.length ? sum : `${J.count} fichiers .jar suivis.`);
    }
  }
  if(!r || r.finished) add("wait","En attente d'un rush","Les objets seront cochés dès qu'un mod est tiré.");
  else if(mod){
    const n=ids ? mod.items.filter(x=>ids[x]).length : 0;
    if(!n) add("warn-c","Objets du mod non reconnus","Ce mod n'a pas d'identifiants : réimporte ses .jar ou recharge le modpack intégré.");
    else add(n<mod.items.length?"warn-c":"ok",`${n} / ${mod.items.length} objets détectables`, n<mod.items.length?"Les autres sont à cocher à la main.":`${r.auto.length} coché${r.auto.length>1?"s":""} automatiquement pour l'instant.`);
  }
  const icon={ok:"✓","warn-c":"!",ko:"✗",wait:"…"};
  $("detChecks").innerHTML=C.map(c=>`<li class="${c.lvl}"><span class="ic" aria-hidden="true">${icon[c.lvl]}</span><span>${esc(c.txt)}${c.sub?`<small>${esc(c.sub)}</small>`:""}</span></li>`).join("");
  const worst=C.some(c=>c.lvl==="ko")?"ko":C.some(c=>c.lvl==="warn-c")?"warn":"ok";
  $("gameDot").className="dot"+(active && worst==="ok"?" on":active && worst==="warn"?" mid":"");
  $("gameTxt").textContent=!active?"jeu non suivi":worst==="ok"?"jeu suivi":"jeu : à vérifier";
  $("detState").textContent=active?(worst==="ok"?"tout est ok":"à vérifier"):"désactivée";
  $("btnDetect").textContent=detDir && detPerm!=="granted" ? "Réactiver la détection" : detDir ? "Changer de dossier" : "Choisir le dossier de l'instance";
  $("btnDetect").disabled=!FS_OK;
  $("btnDetectStop").hidden=!detDir;
}
async function startDetect(h){
  detDir=h; clearInterval(detTimer); clearInterval(jarTimer); detErr=""; jarInfo={state:"", count:0, changes:[], missing:[]};
  try{ detPerm=await h.queryPermission({mode:"read"}); }catch(e){ detPerm="granted"; }
  if(detPerm==="granted"){
    await readStats(); detTimer=setInterval(readStats, POLL_MS);
    scanJars(); jarTimer=setInterval(scanJars, JAR_POLL_MS);
  }
  renderDetect();
}
$("btnDetect").onclick=async()=>{
  try{
    if(detDir && detPerm!=="granted" && await detDir.requestPermission({mode:"read"})==="granted") return startDetect(detDir);
    const h=await window.showDirectoryPicker({id:"modrush", mode:"read"});
    await idbDo("handles", st=>st.put(h,"saves"));
    SNAP=null; await startDetect(h);
  }catch(e){ if(!e || e.name!=="AbortError"){ detErr="pick"; renderDetect(); } }
};
$("btnDetectStop").onclick=async()=>{ clearInterval(detTimer); clearInterval(jarTimer); detTimer=jarTimer=null; detDir=null; detPerm=""; SNAP=null; detErr=""; await idbDo("handles", st=>st.delete("saves")); renderDetect(); };
setInterval(()=>{ if(!detTimer) renderDetect(); },5000);

/* ---------- état de l'overlay ---------- */
setInterval(()=>{
  const hb=readHeartbeat(), alive=hb && Date.now()-hb.t<3000;
  const on=alive && hb.obs;
  $("hbDot").classList.toggle("on",on);
  $("hbTxt").textContent= on ? "overlay OBS connecté" : alive ? "overlay ouvert hors d'OBS" : "overlay non détecté";
},1000);
$("obsWarn").hidden = IN_OBS;
$("ovUrl").textContent = new URL("overlay.html", location.href).href;
$("dockUrl").textContent = new URL("./", location.href).href;

/* ---------- import des .jar ---------- */
const SKIP_NS=new Set(["minecraft","c","forge","neoforge","fabric","realms","quilt"]);
/* librairies et utilitaires : pas de vrais objets à rusher */
const LIBS=new Set(["titanium","irons_lib","sophisticatedcore","patchouli","guideme","modonomicon","moonlight","placebo","cucumber","curios","apothic_attributes","apothic_spawners","aces_spell_utils","jei","jade","emi","architectury","cloth_config","balm","bookshelf","prickle","resourcefullib","geckolib","azurelib","smartbrainlib","lionfishapi","owo","playeranimator","supermartijn642corelib","supermartijn642configlib","kotlinforforge","ftblibrary","polymorph","citadel"]);
/* textes de lang qui ne sont pas des objets (infobulles, exemples) */
const isNoise = l => l.length>48 || /[\[\]%{}]|\.$|^Example /.test(l);
/* objets impossibles à obtenir en survie */
const isUnobtainable = l => /\b(cr[ée]ati(f|ve|on)|creative)\b/i.test(l) || /verrouill|porte du trésor|^(Locked|Boss Doorway|Treasure Doorway)\b|^(Trapped|Locked) .*Stone|Stone .*piégée|Pierre .*piégée/i.test(l);
function looseJson(txt){
  txt=txt.replace(/^﻿/,"");
  try{ return JSON.parse(txt); }catch(e){}
  try{ return JSON.parse(txt.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,"").replace(/,\s*([}\]])/g,"$1")); }catch(e){ return {}; }
}
/* blocs qui n'existent pas en objet (pots, variantes murales) */
const isBlockOnly = id => /^potted_/.test(id) || /(^|_)wall_(torch|sign|hanging_sign|banner|head|skull|fan)$/.test(id);
/* limites contre les archives piégées (zip bombs) et les fichiers démesurés */
const MIN_STRUCT_ITEMS=10, MAX_JAR=300*1024*1024, MAX_JARS=1500, MAX_META=1024*1024, MAX_LANG=8*1024*1024, MAX_PNG=64*1024, MAX_ITEMS=5000;
const unzSize = f => f && f._data && typeof f._data.uncompressedSize==="number" ? f._data.uncompressedSize : Infinity;
/* renvoie le fichier de l'archive seulement s'il existe et ne dépasse pas max octets une fois décompressé */
const zfile = (zip, p, max) => { const f=zip.file(p); return f && unzSize(f)<=max ? f : null; };
async function readJar(file, lang, skipEggs){
  if(file.size>MAX_JAR) throw new Error("fichier trop gros");
  const zip=await JSZip.loadAsync(file);
  const files=Object.keys(zip.files);
  // nom du mod
  let name=null, modid=null;
  for(const p of ["META-INF/neoforge.mods.toml","META-INF/mods.toml"]){
    if(zfile(zip,p,MAX_META)){
      const t=await zip.file(p).async("string");
      const m=t.match(/displayName\s*=\s*(?:"([^"\n]+)"|'([^'\n]+)')/); if(m && !name) name=(m[1]||m[2]).trim().replace(/\s+v?\d+(\.\d+)+$/,"");
      const id=t.match(/^\s*modId\s*=\s*"([^"]+)"/m); if(id && !modid) modid=id[1];
    }
  }
  if(modid && LIBS.has(modid)) return {name:name||modid, items:[], icons:{}, ids:{}, lib:true};
  if(!name && zfile(zip,"fabric.mod.json",MAX_META)){ try{ name=looseJson(await zip.file("fabric.mod.json").async("string")).name; }catch(e){} }
  if(typeof name!=="string") name=null;
  if(!name) name=file.name.replace(/\.jar$/i,"").replace(/[-_ ]?(mc|neoforge|forge|fabric)?[-_ ]?\d[\w.+-]*$/i,"") || file.name;
  name=safeName(name) || "Sans nom";
  // espaces de noms qui ont un fichier de langue
  const nss=new Set();
  files.forEach(p=>{ const m=p.match(/^assets\/([^/]+)\/lang\/(en_us|fr_fr)\.json$/i); if(m && !SKIP_NS.has(m[1])) nss.add(m[1]); });
  const items=[], icons={}, itemIds={}, seen=new Set();
  for(const ns of nss){
    const enF=zfile(zip,`assets/${ns}/lang/en_us.json`,MAX_LANG), locF=lang!=="en_us" && zfile(zip,`assets/${ns}/lang/${lang}.json`,MAX_LANG);
    const en=enF ? looseJson(await enF.async("string")) : {};
    const loc=locF ? looseJson(await locF.async("string")) : {};
    if(!isObj(en) || !isObj(loc)) continue;
    const ids=new Map();
    for(const src of [en,loc]) for(const k of Object.keys(src)){
      const m=k.match(/^(item|block)\.([^.]+)\.([a-z0-9_]+)$/);
      if(!m || m[2]!==ns) continue;
      const id=m[3];
      if(isBlockOnly(id) || (skipEggs && /_spawn_egg$/.test(id))) continue;
      if(!ids.has(id) || m[1]==="item") ids.set(id, k);
    }
    for(const [id,k] of ids){
      if(items.length>=MAX_ITEMS) break;
      let label=(loc[k]||en[k]||id);
      if(typeof label!=="string") continue;
      label=cleanText(label.replace(/§./g,"").replace(/^#+/,""));
      if(!label || isNoise(label) || isUnobtainable(label)) continue;
      if(seen.has(label)) label=`${label} (${id})`;
      if(seen.has(label)) continue;
      seen.add(label); items.push(label); itemIds[label]=`${ns}:${id}`;
      for(const tp of [`assets/${ns}/textures/item/${id}.png`,`assets/${ns}/textures/block/${id}.png`]){
        const f=zip.file(tp);
        if(f){ if(unzSize(f)<=MAX_PNG) icons[label]="data:image/png;base64,"+await f.async("base64"); break; }
      }
    }
  }
  // mod de génération de structures : quelques objets annexes au plus, rien à rusher
  if(items.length<MIN_STRUCT_ITEMS && files.some(p=>/^data\/[^/]+\/worldgen\/structure\/.+\.json$/.test(p))) return {name, items:[], icons:{}, ids:{}, structures:true};
  return {name, items, icons, ids:itemIds};
}
async function collectFromDrop(dt){
  const out=[];
  async function walk(entry){
    if(entry.isFile){ await new Promise(res=>entry.file(f=>{ out.push(f); res(); }, res)); }
    else if(entry.isDirectory){
      const reader=entry.createReader();
      let batch; do{ batch=await new Promise(res=>reader.readEntries(res,()=>res([]))); for(const e of batch) await walk(e); }while(batch.length);
    }
  }
  const entries=[...dt.items].map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean);
  if(entries.length) for(const e of entries) await walk(e); else out.push(...dt.files);
  return out;
}
let importing=false;
async function importFiles(fileList){
  if(importing) return;
  const jars=[...fileList].filter(f=>/\.jar$/i.test(f.name));
  const log=$("impLog"); log.hidden=false; log.innerHTML="";
  const line=(cls,txt)=>{ log.insertAdjacentHTML("beforeend",`<div class="${cls}">${esc(txt)}</div>`); log.scrollTop=log.scrollHeight; };
  if(!jars.length){ line("err","Aucun fichier .jar trouvé. Choisis le dossier mods de ton instance."); return; }
  if(jars.length>MAX_JARS){ line("err",`Trop de fichiers (${jars.length}). Maximum : ${MAX_JARS}.`); return; }
  if(typeof JSZip==="undefined"){ line("err","La librairie de lecture des .jar n'a pas chargé. Vérifie ta connexion puis recharge la page."); return; }
  importing=true;
  const lang=$("impLang").value, skipEggs=$("impEggs").checked, replace=$("impReplace").checked;
  const found=[]; let skipped=0;
  for(let i=0;i<jars.length;i++){
    const f=jars[i];
    try{
      const r=await readJar(f, lang, skipEggs);
      if(r.items.length>=3){ found.push(r); line("ok",`[${i+1}/${jars.length}] ${r.name} : ${r.items.length} objets`); }
      else{ skipped++; line("skip",`[${i+1}/${jars.length}] ${r.name||f.name} : ${r.structures?"mod de structures":r.lib?"librairie":"aucun objet"}, ignoré`); }
    }catch(e){ skipped++; line("err",`[${i+1}/${jars.length}] ${f.name} : illisible (${e.message||e})`); }
  }
  if(found.length){
    let list = replace ? [] : parse(state.text);
    if(replace){ state.full=Object.create(null); state.removed=Object.create(null); state.hiddenMods=[]; await clearIcons(); }
    await resetJars();
    for(const r of found){
      let nm=r.name; const ex=list.findIndex(m=>m.name===nm);
      if(ex>=0) list.splice(ex,1);
      list.push({name:nm, items:r.items});
      state.full[nm]=true;
      await saveIcons(nm, r.icons); await saveIds(nm, r.ids);
    }
    list.sort((a,b)=>a.name.localeCompare(b.name,"fr"));
    state.text=serialize(list); mods=parse(state.text);
    if(state.run && !mods.some(m=>m.name===state.run.mod)) state.run=null;
    save(); rebuildReel(); render();
  }
  line(found.length?"ok":"err",`Terminé : ${found.length} mods importés, ${skipped} fichiers ignorés.`);
  importing=false;
}

/* ---------- événements ---------- */
$("btnDraw").onclick=draw;
$("btnPause").onclick=togglePause;
$("btnAbandon").onclick=()=>{
  const b=$("btnAbandon");
  if(!b.dataset.confirm){ b.dataset.confirm="1"; b.textContent="Confirmer l'abandon"; setTimeout(()=>{delete b.dataset.confirm; renderClock();},3000); return; }
  delete b.dataset.confirm; endRun(false);
};
$("board").addEventListener("click",e=>{ const it=e.target.closest(".item"); if(!it) return; removeMode ? removeItem(it.dataset.n) : toggleItem(it.dataset.n); });
function removeItem(name){
  const r=state.run; if(!r) return;
  const all=parse(state.text), mod=all.find(m=>m.name===r.mod); if(!mod) return;
  mod.items=mod.items.filter(n=>n!==name);
  r.checked=r.checked.filter(n=>n!==name); r.auto=r.auto.filter(n=>n!==name);
  (state.removed[r.mod]=state.removed[r.mod]||[]).push(name); // une mise à jour du mod ne le remettra pas
  state.text=serialize(all); mods=parse(state.text);
  if(mod.items.length && r.checked.length>=mod.items.length && !r.finished){ save(); endRun(true); return; }
  save(); renderBoard();
}
$("btnClearHist").onclick=()=>{ state.history=[]; save(); renderHist(); };
$("btnSound").onclick=()=>{ soundHere=!soundHere; $("btnSound").textContent="Son ici : "+(soundHere?"on":"off"); $("btnSound").setAttribute("aria-pressed",soundHere); };

const dlg=$("dlg");
$("btnEdit").onclick=()=>{ $("txt").value=state.text; $("msg").textContent=""; dlg.showModal(); };
$("btnCancel").onclick=()=>dlg.close();
$("btnReset").onclick=()=>{ $("txt").value=SAMPLE; $("msg").className="msg"; $("msg").textContent="Exemples remis. Clique sur Enregistrer pour valider."; };
$("btnSave").onclick=()=>{
  const parsed=parse($("txt").value), m=$("msg");
  if(!parsed.length){ m.className="msg err"; m.textContent="Aucun mod trouvé. Commence une section par « # Nom du mod » puis un objet par ligne."; return; }
  // ce qui est retiré à la main ne doit pas revenir avec une mise à jour des mods
  for(const old of mods){
    const now=parsed.find(x=>x.name===old.name);
    if(!now){ if(!state.hiddenMods.includes(old.name)) state.hiddenMods.push(old.name); continue; }
    const gone=old.items.filter(i=>!now.items.includes(i));
    if(gone.length) state.removed[old.name]=[...new Set([...(state.removed[old.name]||[]), ...gone])];
  }
  state.hiddenMods=state.hiddenMods.filter(n=>!parsed.some(x=>x.name===n));
  state.text=$("txt").value; mods=parsed;
  if(state.run && !mods.some(x=>x.name===state.run.mod)) state.run=null;
  save(); rebuildReel(); render(); dlg.close();
};

const imp=$("imp");
$("btnImport").onclick=()=>{ $("impReplace").checked = !Object.keys(state.full).length; imp.showModal(); };
$("impClose").onclick=()=>imp.close();
$("impDir").onchange=e=>importFiles(e.target.files);
$("impFiles").onchange=e=>importFiles(e.target.files);
const drop=$("drop");
["dragenter","dragover"].forEach(t=>drop.addEventListener(t,e=>{ e.preventDefault(); drop.classList.add("over"); }));
["dragleave","drop"].forEach(t=>drop.addEventListener(t,()=>drop.classList.remove("over")));
drop.addEventListener("drop",async e=>{ e.preventDefault(); importFiles(await collectFromDrop(e.dataTransfer)); });

/* modpack intégré au site (pack.json) : chargé automatiquement à la première ouverture */
let PACK=null;
async function fetchPack(){
  try{
    const r=await fetch("pack.json",{cache:"no-cache", credentials:"same-origin"});
    if(!r.ok || !/json/.test(r.headers.get("content-type")||"")) return PACK;
    const p=await r.json();
    if(isObj(p) && isStr(p.text) && p.text.length<=MAX_TEXT) PACK={ name:isStr(p.name)?cleanText(p.name,40):"", text:p.text, full:cleanFull(p.full), icons:isObj(p.icons)?p.icons:{}, ids:isObj(p.ids)?p.ids:{} };
  }catch(e){}
  return PACK;
}
async function applyPack(){
  if(!PACK) return;
  const log=$("impLog"); log.hidden=false; log.textContent="Chargement du modpack…";
  await clearIcons();
  for(const [m,map] of Object.entries(PACK.icons)) await saveIcons(m,map);
  for(const [m,map] of Object.entries(PACK.ids)) await saveIds(m,map);
  state.text=PACK.text; state.full=cleanFull(PACK.full); state.removed=Object.create(null); state.hiddenMods=[]; state.run=null; state.history=[];
  await resetJars();
  mods=parse(state.text); save(); rebuildReel(); render();
  log.innerHTML=`<div class="ok">${mods.length} mods chargés (${mods.reduce((a,m)=>a+m.items.length,0)} objets).</div>`;
  try{ localStorage.setItem("modrush.packLoaded", PACK.text.length+":"+hash(PACK.text)); }catch(e){}
}
$("btnPack").onclick=applyPack;

(async()=>{
  await loadIcons();
  if(await fetchPack()){
    $("packRow").hidden=false; $("packName").textContent=PACK.name||"";
    let done=null; try{ done=localStorage.getItem("modrush.packLoaded"); }catch(e){}
    if(!done && !Object.keys(state.full).length) await applyPack();
    // pack déjà chargé avant l'ajout des identifiants : on les complète sans toucher à la liste
    for(const [m,map] of Object.entries(PACK.ids)) if(!IDS[m]) await saveIds(m,map);
  }
  rebuildReel(); render();
  if(state.run && !state.run.finished) startTick();
  const h=FS_OK && await idbGet("handles","saves");
  if(h && h.kind==="directory") await startDetect(h);
})();
