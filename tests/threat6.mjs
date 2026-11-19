import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const raw=readFileSync(new URL("../scripts/h0d-threat6.js",import.meta.url),"utf8");
const js=readFileSync(new URL("../scripts/h0d-machine-builder.js",import.meta.url),"utf8");
const module=JSON.parse(readFileSync(new URL("../module.json",import.meta.url),"utf8"));
const machines=new Function(raw.replace("export const THREAT6_MACHINES =","const THREAT6_MACHINES =")+
  "\nreturn THREAT6_MACHINES;")();
const names=["shell-walker-m6","bellowback-feu-sauvage-m6",
  "bellowback-glace-sauvage-m6","ravageur-blanc-m6","corrupteur-faro-m6"];
assert.equal(module.version,"0.14.0");
assert.deepEqual(Object.keys(machines),names);
const expected={
  "shell-walker-m6":{name:"Shell-Walker blindé",body:42,pieces:98,pv:140,def:13,atk:8,init:2,speed:9,fort:9,ref:3,will:4,per:7,scan:15,hack:21,size:2,nParts:7,nActions:4},
  "bellowback-feu-sauvage-m6":{name:"Bellowback de Feu sauvage",body:54,pieces:96,pv:150,def:12,atk:8,init:2,speed:9,fort:9,ref:3,will:4,per:6,scan:15,hack:21,size:3,nParts:9,nActions:5},
  "bellowback-glace-sauvage-m6":{name:"Bellowback de Glace sauvage",body:54,pieces:96,pv:150,def:12,atk:8,init:2,speed:9,fort:9,ref:3,will:4,per:6,scan:15,hack:21,size:3,nParts:9,nActions:5},
  "ravageur-blanc-m6":{name:"Ravageur blanc ELYSIUM",body:45,pieces:90,pv:135,def:13,atk:8,init:5,speed:12,fort:8,ref:7,will:5,per:7,scan:16,hack:22,size:2,nParts:11,nActions:5},
  "corrupteur-faro-m6":{name:"Corrupteur Faro",body:54,pieces:76,pv:130,def:11,atk:8,init:5,speed:15,fort:6,ref:8,will:5,per:7,scan:16,hack:null,size:2,nParts:9,nActions:6}
};
let totalParts=0,totalActions=0;
for(const [key,e] of Object.entries(expected)){
 const m=machines[key],a=m.actor;
 assert.equal(m.label,e.name,key+" label");
 assert.equal(a.threat,6,key+" threat");
 assert.equal(m.provisional,false,key+" provisional");
 assert.equal(m.importReady,true,key+" assemblable");
 assert.equal(m.validation,"valide",key+" validé");
 assert.equal(a.bodyPV,e.body,key+" corps");
 assert.equal(a.declaredModulesPV,e.pieces,key+" modules PV");
 assert.equal(a.sourceMaxPV,e.pv,key+" PV max");
 assert.equal(a.bodyPV+m.pieces.filter(p=>p.countPV).reduce((sum,p)=>sum+p.pv,0),e.pv,key+" Intégrité v2");
 assert.equal(m.pieces.reduce((sum,p)=>sum+p.bonusDef,0)+a.defense,e.def,key+" DEF active");
 assert.equal(a.defense,10,key+" DEF corps 10");
 assert(m.pieces.every(p=>p.def===e.def),key+" DEF pièces intactes");
 assert(m.pieces.every(p=>p.countPV===true&&p.pv>0),key+" pièces destructibles comptées");
 assert.equal(m.pieces.length,e.nParts,key+" pièces");
 assert.equal(m.weapons.length,e.nActions,key+" attaques");
 assert.equal(new Set(m.pieces.map(p=>p.name)).size,e.nParts,key+" noms uniques pièces");
 assert.equal(new Set(m.weapons.map(w=>w.name)).size,e.nActions,key+" noms uniques attaques");
 assert.equal(a.attack,e.atk,key+" ATQ");
 assert.equal(a.initiative,e.init,key+" INIT");
 assert.equal(a.speed,e.speed,key+" vitesse");
 assert.equal(a.fortitude,e.fort,key+" Vig");
 assert.equal(a.reflex,e.ref,key+" Ref");
 assert.equal(a.will,e.will,key+" Vol");
 assert.equal(a.abilityDC,17,key+" DD capacités");
 assert.equal(a.scanDC,e.scan,key+" DD scan");
 assert.equal(a.hackable,e.hack!==null,key+" piratage autorisé");
 assert.equal(a.hackDC,e.hack,key+" DD piratage");
 assert.equal(a.perception.total,e.per,key+" PER");
 assert.equal(a.perception.range,45,key+" portée PER");
 assert.equal(a.tokenSize,e.size,key+" token");
 assert.equal(a.category,e.size===3?"Lourde":"Moyenne",key+" catégorie CSB");
 if(e.size===3)assert.equal(m.sourceCategory,"Grande",key+" appellation source");
 assert(m.weapons.every(w=>w.range!==null&&w.range!==undefined),key+" portée chiffrée");
 totalParts+=m.pieces.length;totalActions+=m.weapons.length;
}
assert.equal(totalParts,45);
assert.equal(totalActions,25);
const piece=(k,n)=>{const p=machines[k].pieces.find(p=>p.name===n);assert(p, k+" missing piece "+n);return p};
const act=(k,n)=>{const w=machines[k].weapons.find(w=>w.name===n);assert(w,k+" missing action "+n);return w};
const shell="shell-walker-m6";
assert.equal(piece(shell,"Bouclier énergétique").bonusDef,2);
assert.equal(piece(shell,"Châssis porteur").bonusDef,1);
assert.equal(piece(shell,"Caisse cargo").pv,17);
assert.equal(piece(shell,"Capteur de navigation").malusPerception,-4);
assert.equal(act(shell,"Canon lourd").range,24);
assert.equal(act(shell,"Canon lourd").recharge,2);
assert.match(act(shell,"Interception du bouclier").effect,/1\/round/);
assert.match(act(shell,"Interception du bouclier").effect,/14/);
assert.match(act(shell,"Pince droite").effect,/pas deux attaques gratuites/i);
for(const key of ["bellowback-feu-sauvage-m6","bellowback-glace-sauvage-m6"]){
 assert.equal(piece(key,"Plaques latérales").bonusDef,1);
 assert.equal(piece(key,"Châssis lourd").bonusDef,1);
 assert.equal(piece(key,"Queue lourde").detachable,false);
 assert.equal(piece(key,"Pattes arrière lourdes").detachable,false);
 assert.equal(act(key,"Charge courte").recharge,2);
 assert.equal(act(key,"Charge courte").range,12);
 assert.equal(act(key,"Morsure lourde").dmg,"2d8+2");
 assert.equal(act(key,"Coup de queue").dmg,"2d8+2");
 assert.equal(piece(key,"Batterie de pression").pv,5);
 assert.equal(piece(key,"Grand réservoir "+(key.includes("feu")?"Blaze":"Cryo")).pv,20);
 assert.equal(piece(key,"Grand réservoir "+(key.includes("feu")?"Blaze":"Cryo")).explosion,undefined,
   "Pas d'automatisation inconditionnelle de l'explosion élémentaire");
}
assert.equal(act("bellowback-feu-sauvage-m6","Souffle de feu").range,9);
assert.match(act("bellowback-feu-sauvage-m6","Souffle de feu").effect,/Brûlure 1d6/);
assert.equal(act("bellowback-glace-sauvage-m6","Souffle de glace").range,9);
assert.match(act("bellowback-glace-sauvage-m6","Souffle de glace").effect,/Ralentie/);
const rav="ravageur-blanc-m6";
assert.equal(piece(rav,"Plaques blanches").bonusDef,2);
assert.equal(piece(rav,"Châssis prédateur ELYSIUM").bonusDef,1);
assert.equal(piece(rav,"Canon dorsal blanc").detachable,true);
assert.match(piece(rav,"Canon dorsal blanc").effect,/récupérable/);
assert.equal(piece(rav,"Capteurs blancs").malusPerception,-4);
assert.equal(piece(rav,"Griffe arrière gauche").malusSpeed,-3);
assert.equal(piece(rav,"Griffe arrière droite").malusSpeed,-3);
assert.equal(act(rav,"Lacération").dmg,"2d6+3");
assert.match(act(rav,"Lacération").effect,/1d6\+3/);
assert.equal(act(rav,"Rafale blanche").recharge,3);
assert.equal(act(rav,"Canon blanc").range,24);
const faro="corrupteur-faro-m6";
assert.equal(piece(faro,"Noyau central unifié").pv,18);
assert.equal(piece(faro,"Noyau central unifié").detachable,false);
assert.equal(piece(faro,"Châssis Faro").bonusDef,1);
assert.match(piece(faro,"Noyau central unifié").effect,/3d6 dégâts au corps/);
assert.match(piece(faro,"Noyau central unifié").effect,/DEF -2/);
assert.equal(act(faro,"Lance-piques").range,24);
assert.equal(act(faro,"Lance-piques").recharge,2);
assert.equal(act(faro,"Grenade Frénésie Faro").range,24);
assert.equal(act(faro,"Grenade Frénésie Faro").recharge,3);
assert.match(act(faro,"Grenade Frénésie Faro").effect,/ne se cumule pas avec l'asservissement/);
assert.match(act(faro,"Grenade Frénésie Faro").effect,/indépendant/);
assert.match(act(faro,"Asservissement Faro").effect,/M1 17, M2 16, M3 15, M4 14, M5 13, M6 12/);
assert.match(act(faro,"Asservissement Faro").effect,/3 machines totalisant 6 Menaces/);
assert.equal(act(faro,"Bond écrasant").recharge,2);

// Dossier v2 remplace les cinq clés M6 v1, sans toucher M1–5.
const old=["shell-walker","bellowback-feu","bellowback-gel","ravageur-blanc","corrupteur-faro"];
for(const key of old)assert.equal(machines[key],undefined,key+" ne doit pas créer de doublon");
const begin=js.indexOf("const LEGACY_MACHINE_KEYS = ");
const end=js.indexOf("\nconst MACHINES =",begin);
const aliases=new Function(js.slice(begin,end)+"\nreturn LEGACY_MACHINE_KEYS;")();
for(let i=0;i<names.length;i++)assert(aliases[names[i]].includes(old[i]),names[i]+" alias de migration");
assert.match(js,/aliases\.includes\(d\.getFlag\(MODULE_ID, "machineKey"\)\)/);
assert.match(js,/obsolete\.push\(doc\)/);
assert.match(js,/doc\.getFlag\(MODULE_ID,"generated"\)===true/);
assert.match(js,/Number\(machine\.actor\.threat\)===6 && mode!=="skip"/);
assert.match(js,/const resizedSceneTokens = Number\(machine\.actor\.threat\)===6/);
assert.match(js,/sourceValidation:machine\.validation \?\? "valide"/);
assert.match(js,/H0D_ArmeMachine_Notes: \[w\.attackOrDC/);

const ss=js.indexOf("function selectionKeys("),se=js.indexOf("function machineKeyAliases(",ss);
const fs=new Function("MACHINES","allMachineKeys",js.slice(ss,se)+"\nreturn selectionKeys;")(
 {m5:{actor:{threat:5}},...machines},
 n=>n===6?names:n===5?["m5"]:["m5",...names]
);
assert.deepEqual(fs("threat-6"),names);
assert.deepEqual(fs("all"),["m5",...names]);

const start=js.indexOf("function missingMachineFields(");
const stop=js.indexOf("function machineWarnings(",start);
const checks=new Function(js.slice(start,stop)+"\nreturn {missingMachineFields,assertMachineReadyForActor};")();
for(const [key,m] of Object.entries(machines)){
 assert.deepEqual(checks.missingMachineFields(m),[],key+" complet");
 assert.doesNotThrow(()=>checks.assertMachineReadyForActor(m),key+" prêt pour Actor");
}
const damaged={...machines[faro],actor:{...machines[faro].actor,hackable:true,hackDC:null}};
assert(checks.missingMachineFields(damaged).includes("hackDC"),"Piratage absent interdit si piratable");
const incomplete={...machines[shell],actor:{...machines[shell].actor,initiative:null}};
assert.throws(()=>checks.assertMachineReadyForActor(incomplete),/profil non assemblable/);

// PER M6 : valeurs du PDF, capteurs +4 sans double compte.
const pstart=js.indexOf("function machinePerceptionProfile(");
const pend=js.indexOf("function notify(",pstart);
const compute=new Function("MACHINE_PERCEPTION_PROFILES","sensorProfile",
 js.slice(pstart,pend)+"\nreturn machinePerceptionProfile;"
)({},(_,piece)=>({generalBonus:piece?.malusPerception===-4?4:0}));
assert.deepEqual(compute(shell,machines[shell]),{total:7,base:3,range:45});
assert.deepEqual(compute("bellowback-feu-sauvage-m6",machines["bellowback-feu-sauvage-m6"]),{total:6,base:6,range:45});
assert.deepEqual(compute(rav,machines[rav]),{total:7,base:3,range:45});
assert.deepEqual(compute(faro,machines[faro]),{total:7,base:7,range:45});
console.log("M6 canon : 5 Actors, 45 pièces, 25 actions, PV, DEF, tokens, rarités, Faro, PER et alias historiques OK");
