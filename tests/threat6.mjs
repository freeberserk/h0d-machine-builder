import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source = readFileSync(new URL("../scripts/h0d-threat6.js",import.meta.url),"utf8");
const main = readFileSync(new URL("../scripts/h0d-machine-builder.js",import.meta.url),"utf8");
const modules = JSON.parse(readFileSync(new URL("../module.json",import.meta.url),"utf8"));
const machines = new Function(source.replace("export const THREAT6_MACHINES =","const THREAT6_MACHINES =")+"\nreturn THREAT6_MACHINES;")();
assert.equal(modules.version,"0.13.0");
assert.deepEqual(Object.keys(machines),[
  "shell-walker","bellowback-feu","bellowback-gel","ravageur-blanc","corrupteur-faro"
],"Cinq profils M6 distincts, sans doublon");

const expected={
  "shell-walker":{pv:140,body:42,modules:98,def:15,base:11,atk:8,parts:5,attacks:2},
  "bellowback-feu":{pv:150,body:80,modules:70,def:15,base:15,atk:8,parts:4,attacks:3},
  "bellowback-gel":{pv:150,body:80,modules:70,def:15,base:15,atk:8,parts:4,attacks:3},
  "ravageur-blanc":{pv:145,body:71,modules:74,def:15,base:15,atk:8,parts:7,attacks:3},
  "corrupteur-faro":{pv:130,body:58,modules:72,def:11,base:11,atk:null,parts:8,attacks:6}
};
for (const [key,e] of Object.entries(expected)){
  const m=machines[key],a=m.actor,pieces=m.pieces,weapons=m.weapons;
  assert.equal(a.threat,6,key+" menace");
  assert.equal(m.importReady,false,key+" bloque les Actors incomplets");
  assert.equal(a.sourceMaxPV,e.pv,key+" PV totaux");
  assert.equal(a.bodyPV,e.body,key+" PV corps");
  assert.equal(a.declaredModulesPV,e.modules,key+" PV pièces");
  assert.equal(a.bodyPV+pieces.reduce((sum,p)=>sum+(p.countPV?p.pv:0),0),e.pv,key+" aucune double comptabilisation");
  assert.equal(a.defense,e.base,key+" DEF de base non inventée");
  assert.equal(a.defense+pieces.reduce((sum,p)=>sum+p.bonusDef,0),e.def,key+" DEF intacte");
  assert.equal(a.attack,e.atk,key+" ATQ absent = null");
  assert.equal(pieces.length,e.parts,key+" nombre de pièces hors Corps");
  assert.equal(weapons.length,e.attacks,key+" attaques/capacités");
  assert(!pieces.some(p=>/^(corps|châssis)$/i.test(p.name)),key+" Corps intégré aux PV de corps");
  assert(pieces.every(p=>p.def===null&&p.countPV===true),key+" DEF individuelle non donnée");
  assert(!pieces.some(p=>p.explosion),key+" pas d'explosion automatisée à rayon/DD inventés");
  assert.equal(a.category,null,key+" taille de token non donnée");
  assert.equal(a.scanDC,null,key+" scan DD non donné");
  assert.equal(a.hackDC,null,key+" piratage DD non donné");
  assert.equal(a.perception.total,null,key+" PER totale non donnée");
  assert.equal(a.perception.range,null,key+" PER portée non donnée");
  assert.equal(new Set(pieces.map(p=>p.name)).size,pieces.length);
  assert.equal(new Set(weapons.map(w=>w.name)).size,weapons.length);
}
const piece=(m,n)=>machines[m].pieces.find(p=>p.name===n);
const weapon=(m,n)=>machines[m].weapons.find(w=>w.name===n);
assert.equal(piece("shell-walker","Bouclier énergétique").bonusDef,4);
assert.equal(piece("shell-walker","Caisse cargo").pv,25);
assert.equal(piece("shell-walker","Canon lourd").pv,18);
assert.equal(weapon("shell-walker","Canon lourd").range,null,"Portée du canon inconnue");

for(const kind of ["feu","gel"]){
  const k="bellowback-"+kind,n=kind==="feu"?"Grand réservoir Blaze":"Grand réservoir Gel";
  assert.equal(piece(k,n).pv,20);
  assert.match(piece(k,n).effect,/5d6/);
  assert.equal(weapon(k,kind==="feu"?"Jet de feu":"Souffle gel").dmg,"3d8");
  assert.equal(weapon(k,kind==="feu"?"Jet de feu":"Souffle gel").range,null);
}
assert.equal(piece("ravageur-blanc","Canon dorsal blanc").pv,12);
assert.equal(piece("ravageur-blanc","Canon dorsal blanc").detachable,true);
assert.equal(piece("ravageur-blanc","Canon dorsal blanc").recuperable,false,"Pas de PM substituées à l'arme rare");
assert.match(piece("ravageur-blanc","Canon dorsal blanc").note,/attribution manuelle/i);
assert.equal(weapon("ravageur-blanc","Griffes").dmg,"2d8+3");
assert.equal(weapon("ravageur-blanc","Morsure").dmg,"2d6+3");

const core=piece("corrupteur-faro","Noyau central unifié");
assert.equal(core.pv,18);
assert.match(core.effect,/surcharge 3d6/i);
assert.match(core.effect,/DEF -2 durant 1 round/);
assert.equal(machines["corrupteur-faro"].actor.initiative,5);
assert.equal(machines["corrupteur-faro"].actor.speed,15);
assert.equal(machines["corrupteur-faro"].actor.abilityDC,17);
assert.equal(weapon("corrupteur-faro","Grenade Frénésie Faro").range,24);
assert.equal(weapon("corrupteur-faro","Grenade Frénésie Faro").recharge,3);
assert.match(weapon("corrupteur-faro","Grenade Frénésie Faro").effect,/1d3 rounds/);
assert.equal(weapon("corrupteur-faro","Lance-piques").range,24);
assert.match(weapon("corrupteur-faro","Asservissement Faro").effect,/total de 6 niveaux de Menace/);
assert.match(weapon("corrupteur-faro","Asservissement Faro").effect,/Menace 1=17, 2=16, 3=15, 4=14, 5=13, 6=12/);

// Sélections : M6 uniquement sur sélection explicite ; pas de création d'Actor silencieuse.
assert.match(main,/import \{ THREAT6_MACHINES \} from "\.\/h0d-threat6\.js"/);
assert.match(main,/Object\.assign\(MACHINES, THREAT4_MACHINES, THREAT5_MACHINES, THREAT6_MACHINES\)/);
assert.match(main,/if \(selection === "threat-6"\) return allMachineKeys\(6,\{includeIncomplete:true\}\)/);
assert.match(main,/value="threat-6"/);
assert.match(main,/action!=="library"/);
assert.match(main,/assertMachineReadyForActor\(machine\)/);
assert.match(main,/H0D_Composant_DEF_Base: p\.def===null\|\|p\.def===undefined \? ""/);
assert.match(main,/H0D_ArmeMachine_Portee: w\.range===null \? ""/);

const start=main.indexOf("function allMachineKeys(");
const end=main.indexOf("function machineKeyAliases(",start);
const selectionFns=new Function("MACHINES",main.slice(start,end)+"\nreturn {allMachineKeys,selectionKeys};");
const {allMachineKeys,selectionKeys}=selectionFns({
  "existing-m5":{actor:{threat:5},provisional:false},
  ...machines
});
assert.deepEqual(selectionKeys("all"),["existing-m5"],"Lots existants protégés");
assert.deepEqual(selectionKeys("threat-6"),Object.keys(machines));
assert.deepEqual(allMachineKeys(6),[],"Aucun Actor M6 incomplet inclus dans la génération validée");

const mstart=main.indexOf("function missingMachineFields(");
const mend=main.indexOf("function machineWarnings(",mstart);
const checkFns=new Function(main.slice(mstart,mend)+"\nreturn {missingMachineFields,assertMachineReadyForActor};")();
for(const [key,m] of Object.entries(machines)){
  const missing=checkFns.missingMachineFields(m);
  assert(missing.includes("category"),key+" taille manquante");
  assert(missing.includes("DEF des pièces"),key+" DEF individuelles manquantes");
  assert(missing.includes("PER totale"),key+" PER non inventée");
  assert.throws(()=>checkFns.assertMachineReadyForActor(m),/non assemblable/,key+" assemblage bloqué");
}
assert(checkFns.missingMachineFields(machines["corrupteur-faro"]).includes("attack"),"ATQ Corrupteur non chiffrée");

const pstart=main.indexOf("function machinePerceptionProfile(");
const pend=main.indexOf("function notify(",pstart);
const perceptFn=new Function("MACHINE_PERCEPTION_PROFILES","sensorProfile",
  main.slice(pstart,pend)+"\nreturn machinePerceptionProfile;"
)({},()=>({generalBonus:0}));
assert.deepEqual(perceptFn("corrupteur-faro",machines["corrupteur-faro"]),{total:null,base:null,range:null},"Pas de PER Menace+1 déduite pour M6");

console.log("Menace 6 : 5 profils, 28 pièces, 17 capacités, valeurs source, garde-fous d'import et absence de chiffres inventés : OK");
