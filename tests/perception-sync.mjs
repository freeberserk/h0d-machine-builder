import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const src=await readFile(new URL("../scripts/h0d-machine-builder.js", import.meta.url),"utf8");
assert.match(src,/const VERSION = "0\.10\.2"/);
for (const key of [
  "H0D_Machine_Perception_Base",
  "H0D_Machine_Perception_Portee_Base",
  "H0D_Composant_Capteur_Specialise",
  "H0D_Composant_Capteur_Cible",
  "H0D_Composant_Capteur_Portee",
  "H0D_Composant_Capteur_Bonus_Perception"
]) assert.ok(src.includes(key), "Champ absent : "+key);
assert.ok(src.includes('"scrapper-standard::Radar dorsal"'),"Radar Scrapper standard non spécialisé");
assert.ok(src.includes('Machines au sol / carcasses'),"Cible radar Scrapper absente");
assert.ok(src.includes('syncPerceptionSelection'),"Synchronisation PER absente");
assert.ok(src.includes('value="sync-perception"'),"Action UI PER absente");
console.log("Machine perception sync OK");
