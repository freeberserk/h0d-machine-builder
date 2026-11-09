import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const s=readFileSync(new URL("../scripts/h0d-threat5.js",import.meta.url),"utf8");
// Parse only our static exported data, no Foundry dependency or dynamic module loading.
const machines=Function(s.replace("export const THREAT5_MACHINES =","const THREAT5_MACHINES =")+"\nreturn THREAT5_MACHINES;")();
const expected={
 "ravageur-sauvage":{menace:5,body:40,modules:55,max:95,def:13,atk:7,init:4,speed:12,fort:7,ref:5,will:3,dd:16,scan:14,hack:20,per:6,range:45,parts:10,attacks:5},
 "stalker-sauvage":{menace:5,body:38,modules:49,max:87,def:11,atk:7,init:7,speed:21,fort:5,ref:8,will:3,dd:16,scan:14,hack:20,per:6,range:45,parts:10,attacks:7},
 "clawstrider-sauvage":{menace:2,body:10,modules:18,max:28,def:11,atk:4,init:4,speed:15,fort:3,ref:4,will:1,dd:13,scan:11,hack:17,per:5,range:30,parts:9,attacks:4},
 "fanghorn-sauvage":{menace:5,body:42,modules:62,max:104,def:13,atk:7,init:3,speed:12,fort:8,ref:4,will:3,dd:16,scan:14,hack:20,per:6,range:45,parts:11,attacks:5},
 "moissonneur-elys9":{menace:5,body:44,modules:66,max:110,def:12,atk:7,init:4,speed:9,fort:7,ref:5,will:3,dd:16,scan:14,hack:20,per:6,range:45,parts:9,attacks:10}
};
assert.deepEqual(Object.keys(machines),Object.keys(expected),"Pas de doublon ni de meute composite");
for (const [key,e] of Object.entries(expected)) {
 const machine=machines[key],a=machine.actor;
 assert.equal(a.threat,e.menace,key+": Menace");
 assert.equal(a.bodyPV,e.body,key+": corps");
 assert.equal(a.declaredModulesPV,e.modules,key+": PV annoncés");
 assert.equal(a.sourceMaxPV,e.max,key+": max");
 assert.equal(a.defense,10,key+": DEF corps");
 assert.equal(a.attack,e.atk);
 assert.equal(a.initiative,e.init);
 assert.equal(a.speed,e.speed);
 assert.equal(a.fortitude,e.fort);
 assert.equal(a.reflex,e.ref);
 assert.equal(a.will,e.will);
 assert.equal(a.abilityDC,e.dd);
 assert.equal(a.scanDC,e.scan);
 assert.equal(a.hackDC,e.hack);
 assert.equal(a.perception.total,e.per);
 assert.equal(a.perception.range,e.range);
 assert.equal(machine.pieces.length,e.parts);
 assert.equal(machine.weapons.length,e.attacks);
 assert.equal(machine.pieces.reduce((n,p)=>n+(p.countPV?p.pv:0),0),e.modules,key+": PV composants");
 assert.equal(a.defense+machine.pieces.reduce((n,p)=>n+p.bonusDef,0),e.def,key+": DEF intacte");
 assert(machine.pieces.every(p=>p.def===e.def && p.countPV===true),key+": DEF pièces et intégrité");
 assert(machine.weapons.every(w=>!w.countPV),key+": armes sans PV global");
 assert.equal(new Set(machine.pieces.map(p=>p.name)).size,machine.pieces.length,key+": composants distincts");
 assert.equal(new Set(machine.weapons.map(w=>w.name)).size,machine.weapons.length,key+": attaques distinctes");
}
const part=(m,n)=>machines[m].pieces.find(x=>x.name===n);
const weapon=(m,n)=>machines[m].weapons.find(x=>x.name===n);
assert.equal(part("ravageur-sauvage","Plaques dorsales").bonusDef,2);
assert.equal(part("ravageur-sauvage","Capteur de chasse").perceptionBonus,4);
assert.equal(part("stalker-sauvage","Plaques latérales légères").bonusDef,0);
assert.equal(part("stalker-sauvage","Capteurs optiques").perceptionBonus,4);
assert.equal(weapon("stalker-sauvage","Mine de choc").shotsMax,2);
assert.equal(weapon("stalker-sauvage","Mine de choc").recharge,0,"2 mines par scène != recharge 2 rounds");
assert.equal(weapon("stalker-sauvage","Sprint fulgurant").range,30);
assert.equal(machines["clawstrider-sauvage"].actor.threat,2);
assert.equal(part("clawstrider-sauvage","Module de coordination").pv,3);
assert.equal(part("clawstrider-sauvage","Capteur optique").perceptionBonus,3);
assert.match(weapon("clawstrider-sauvage","Chasse coordonnée").effect,/3\+ : \+2 ATQ/);
assert.match(machines["clawstrider-sauvage"].actor.notes,/PROPOSITION TECHNIQUE/);
assert.equal(machines["fanghorn-sauvage"].actor.category,"Petite");
assert.equal(part("fanghorn-sauvage","Réservoir Blaze gauche").explosion.dc,16);
assert.equal(part("fanghorn-sauvage","Réservoir Purgewater").element,"Purgewater");
assert.equal(part("moissonneur-elys9","Capteurs optiques et antennes").perceptionBonus,4);
assert.equal(machines["moissonneur-elys9"].provisional,false);
assert.equal(machines["moissonneur-elys9"].validation,"valide");
assert.equal(machines["moissonneur-elys9"].actor.category,"Moyenne");
assert.match(machines["moissonneur-elys9"].actor.focus,/SANS violet/);
const main=readFileSync(new URL("../scripts/h0d-machine-builder.js",import.meta.url),"utf8");
assert.match(main,/import \{ THREAT5_MACHINES \} from "\.\/h0d-threat5\.js"/);
assert.match(main,/Object\.assign\(MACHINES, THREAT4_MACHINES, THREAT5_MACHINES\)/);
assert.match(main,/includeProvisional=false/);
assert.match(main,/if \(selection === "threat-5"\) return allMachineKeys\(5\)/);
assert.match(main,/const provisional=selectionKeys\(machine\)/);
assert.match(main,/const threat5Options = allMachineKeys\(5\)/);
assert.doesNotMatch(main,/Données V1 non validées|Moissonneur V1 non validée|Moissonneur ELYS-9 : chiffres V1 à confirmer/);
assert.match(main,/sourceValidation:machine\.validation \?\? "valide"/);
assert.match(main,/sourceValidation:MACHINES\[entry\.machineKey\]\?\.validation \?\? "valide"/);
assert.equal(machines["moissonneur-elys9"].label,"Moissonneur ELYS-9");
assert.match(machines["moissonneur-elys9"].actor.notes,/Fiche chiffrée validée par le MJ/);
assert.doesNotMatch(machines["moissonneur-elys9"].actor.notes,/NON VALIDÉE|V1 À CONFIRMER|V1 NON VALIDÉES/);
assert.equal(Object.values(machines).filter(m=>m.actor.threat===5).length,4,"Quatre profils M5 individuels, Clawstrider M2");
assert.ok(Object.values(machines).every(m=>m.validation==="valide"&&m.provisional===false),"Les cinq profils sont validés");
for (const key of Object.keys(expected)) assert.ok(main.includes('"'+key+'"'),key+": PER/DET manquantes");
assert.doesNotMatch(main,/Lancehorn alpha|Fanghorn\s*\/\s*Lancehorn/i);
console.log("Menace 5 : cinq profils validés ; Moissonneur désormais dans les M5 ; intégrité, DEF, PER et recharges OK.");
