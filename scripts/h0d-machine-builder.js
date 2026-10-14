import { THREAT4_MACHINES } from "./h0d-threat4.js";
const MODULE_ID = "h0d-machine-builder";
const VERSION = "0.10.1";
const COMPONENT_PACK_LABEL = "H0D — Composants Machines";
const WORLD_MACHINE_FOLDER = "H0D — Machines assemblées";

const TOKEN_SIZE_BY_CATEGORY = Object.freeze({
  Petite: 1,
  Moyenne: 2,
  Lourde: 3,
  Titan: 4
});

/*
 * Convention H0D Foundry :
 * Petite  -> 1 x 1
 * Moyenne -> 2 x 2
 * Lourde  -> 3 x 3
 * Titan   -> 4 x 4
 *
 * Prototype / boss n'est pas une taille physique fiable.
 * Une fiche Prototype doit donc fournir actor.tokenSize explicitement.
 * tokenSize peut être un nombre (carré) ou {width, height}.
 */

/*
 * H0D Machine Builder v0.9.0
 * Foundry VTT v14 + Custom System Builder 6.x
 *
 * Menaces 1 à 4 complètes :
 * - Menace 1 : Grazer de rite, Watcher, Strider, Burrower, Grazer sauvage
 * - Menace 2 : Redeye Watcher, Broadhead, Scrapper blessé, Scrapper standard/intact
 * - Menace 3 : Dent de Scie d'Aloy, Lancehorn, Longleg, Scrounger, Récolteur ELYS, Tisseur ELYS-9
 *
 * Deux fonctions :
 * 1. Générer / mettre à jour la bibliothèque de pièces et attaques.
 * 2. Assembler automatiquement un Actor Machine avec ses Items embarqués.
 */

const LEGACY_MACHINE_KEYS = {
  "strider-standard": ["strider-jeune"],
  "grazer-sauvage": ["grazer-adulte"]
};

const MACHINES = {
  "grazer-rite": {
    label: "Grazer de rite",
    actor: {
      category: "Petite", variant: "Autre", model: "Grazer", threat: 1,
      role: "Tutoriel de démontage, réservoir Blaze, cornes, châssis",
      origin: "HELIOS standard, comportement bridé par le contexte rituel",
      behavior: "Fuit, panique, rue si acculée. Agressivité limitée.",
      bodyPV: 7, declaredModulesPV: 12, sourceMaxPV: 19,
      defense: 9, attack: 3, initiative: 2, speed: 9,
      fortitude: 3, reflex: 2, will: 0, abilityDC: 12,
      scanDC: 10, hackDC: 15, hackable: true,
      weaknesses: "Réservoirs Blaze ; cornes ; châssis léger",
      immunities: "Aucune notable",
      focus: "Réservoirs Blaze très visibles ; cornes fragiles ; châssis léger protège la DEF. Role pédagogique : apprendre à viser les pièces et comprendre qu’un réservoir ne sature que par l’élément adéquat.",
      notes: "Version validée. Variante source : de rite / bridée / encadrée. Vitesse normale 9 m ; ruade sur 12 m. Elle reste plus faible que le Grazer sauvage ; son but est le tutoriel, pas la menace de groupe."
    },
    pieces: [
      {name:"Corne gauche", type:"Structure", location:"Tête", pv:1, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie ; si les 2 cornes sont détruites, attaque de cornes impossible.", note:"Type source : Arme naturelle."},
      {name:"Corne droite", type:"Structure", location:"Tête", pv:1, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie ; si les 2 cornes sont détruites, attaque de cornes impossible.", note:"Type source : Arme naturelle."},
      ...[1,2,3,4].map(n => ({name:`Réservoir Blaze ${n}`, type:"Reservoir", location:"Dos/flanc", pv:2, def:10, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Feu", dmg:"1d6", radius:1.5, dc:12},
       effect:"Si détruit par Feu : explosion 1d6 feu, rayon 1,5 m, Réflexes DD 12 moitié."})),
      {name:"Châssis léger", type:"Structure", location:"Structure", pv:2, def:10, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; ruade impossible ; vitesse -3 m.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de cornes", mode:"Naturelle", type:"Cornes", dmg:"1d6", dmgType:"Autre", range:0, recharge:0,
       effect:"Au moins 1 corne doit être intacte.", note:"Type de dégâts source : Perforant/contondant."},
      {name:"Ruade de rite", mode:"Naturelle", type:"Ruade", dmg:"1d6", dmgType:"Contondant", range:12, zone:"Ligne 12 m", recharge:2,
       effect:"Châssis intact + au moins 1 corne intacte."},
      {name:"Coup de sabot", mode:"Naturelle", type:"Ruade", dmg:"1d4+1", dmgType:"Contondant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Fuite paniquée", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:9, recharge:0, special:true,
       effect:"Si une issue existe.", note:"Mode source : Mouvement / Déplacement."}
    ]
  },

  "watcher": {
    label: "Watcher standard",
    actor: {
      category: "Petite", variant: "Standard", model: "Watcher", threat: 1,
      role: "Surveillance, alerte, reconnaissance",
      origin: "HELIOS standard",
      behavior: "Observe, scanne, crie l’alerte, fuit ou harcèle si isolé.",
      bodyPV: 7, declaredModulesPV: 9, sourceMaxPV: 16,
      defense: 9, attack: 3, initiative: 3, speed: 9,
      fortitude: 2, reflex: 4, will: 0, abilityDC: 12,
      scanDC: 10, hackDC: 15, hackable: true,
      weaknesses: "Œil optique ; module d’alerte ; queue stabilisatrice ; châssis léger",
      immunities: "Aucune notable",
      focus: "Œil, module d’alerte, queue et châssis. Role pédagogique : neutraliser l’alerte avant l’arrivée de renforts.",
      notes: "Version validée. Le +1 DEF vient du châssis léger, pas de l’œil. Le Redeye Watcher est une variante Menace 2 boostée."
    },
    pieces: [
      {name:"Œil optique", type:"Capteur", location:"Tête", pv:2, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Aveuglée ; scan impossible ; Perception -4.", malusPerception:-4},
      {name:"Module d’alerte", type:"Capteur", location:"Gorge/tête", pv:2, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Cri d’alerte impossible."},
      {name:"Queue stabilisatrice", type:"Mobilite", location:"Arrière", pv:2, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Coup de queue impossible ; équilibre instable."},
      {name:"Patte gauche", type:"Mobilite", location:"Membre", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Si les 2 pattes sont détruites : Ralentie."},
      {name:"Patte droite", type:"Mobilite", location:"Membre", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Si les 2 pattes sont détruites : Ralentie."},
      {name:"Châssis léger", type:"Structure", location:"Structure", pv:1, def:10, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; fuite et repositionnement dégradés.", note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de griffe", mode:"Naturelle", type:"Griffes", dmg:"1d4+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Coup de queue", mode:"Naturelle", type:"Queue", dmg:"1d4", dmgType:"Contondant", range:0, recharge:0,
       effect:"Impossible si la queue est détruite."},
      {name:"Cri d’alerte", mode:"Speciale", type:"Sonique", dmg:"0", dmgType:"Autre", range:18, recharge:2, special:true,
       effect:"Impossible si le module d’alerte est détruit.", note:"Type source : Son/alerte."},
      {name:"Scan optique", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:18, recharge:1, special:true,
       effect:"Impossible si l’œil est détruit.", note:"Type source : Détection."}
    ]
  },

  "strider-standard": {
    label: "Strider standard",
    actor: {
      category: "Petite", variant: "Standard", model: "Strider", threat: 1,
      role: "Monture, fuite, déplacement rapide",
      origin: "HELIOS standard",
      behavior: "Fuit d’abord ; charge ou rue si acculé ; devient intéressante pour le piratage/monture.",
      bodyPV: 8, declaredModulesPV: 10, sourceMaxPV: 18,
      defense: 9, attack: 3, initiative: 3, speed: 12,
      fortitude: 3, reflex: 3, will: 0, abilityDC: 12,
      scanDC: 10, hackDC: 14, hackable: true,
      weaknesses: "Batterie arrière ; module tête ; châssis de course ; pattes",
      immunities: "Aucune notable",
      focus: "Batterie arrière, module tête, châssis de course. Seuil pattes : 1 patte détruite = vitesse -3 m ; 2 pattes = Ralentie ; 3+ = chute ou déplacement très limité.",
      notes: "Version validée. Machine rapide : vitesse normale 12 m. La batterie arrière remplace la bonbonne."
    },
    pieces: [
      {name:"Module tête", type:"Capteur", location:"Tête", pv:2, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Perception -4 ; scan impossible.", malusPerception:-4},
      {name:"Batterie arrière", type:"Generateur", location:"Arrière", pv:2, def:10, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Choc", dmg:"1d6", radius:1.5, dc:12},
       effect:"Si détruite par choc/énergie adaptée : surcharge 1d6 choc, rayon 1,5 m, Réflexes DD 12 moitié.", note:"Type source : Batterie / énergie."},
      {name:"Patte avant gauche", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte avant droite", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte arrière gauche", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte arrière droite", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Châssis de course", type:"Structure", location:"Structure", pv:2, def:10, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; ruade impossible ; vitesse -3 m ; monture peu fiable.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de sabot", mode:"Naturelle", type:"Ruade", dmg:"1d4+1", dmgType:"Contondant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Ruade légère", mode:"Naturelle", type:"Ruade", dmg:"1d6+1", dmgType:"Contondant", range:12, zone:"Ligne 12 m", recharge:2,
       effect:"Châssis intact + au moins 3 pattes fonctionnelles."},
      {name:"Fuite paniquée", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:12, recharge:0, special:true,
       effect:"Si une issue existe.", note:"Mode source : Mouvement / Déplacement."},
      {name:"Embardée", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:3, recharge:2, special:true,
       effect:"Impossible si le châssis est détruit.", note:"Mode source : Réaction/défense ; type source : Mobilité."}
    ]
  },

  "burrower-simple": {
    label: "Burrower simple",
    actor: {
      category: "Petite", variant: "Autre", model: "Burrower", threat: 1,
      role: "Fouisseur, éclaireur, détection sonore/vibratoire",
      origin: "HELIOS standard",
      behavior: "Se cache, détecte, jaillit pour surprendre, fuit sous terre si possible.",
      bodyPV: 5, declaredModulesPV: 11, sourceMaxPV: 16,
      defense: 9, attack: 3, initiative: 2, speed: 9,
      fortitude: 2, reflex: 3, will: 0, abilityDC: 12,
      scanDC: 10, hackDC: 15, hackable: true,
      weaknesses: "Œil optique ; module dorsal ; pattes ; queue stabilisatrice ; châssis fouisseur",
      immunities: "Aucune notable",
      focus: "Œil, module dorsal, pattes, queue, châssis. Seuil pattes : 1 patte détruite = vitesse -3 m ; 2 pattes = Ralentie et fouissage impossible ; 3+ = chute ou déplacement très limité.",
      notes: "Version validée. Variante source : Simple. Vitesse normale 9 m ; fouissage 6 m. Le châssis fouisseur explicite porte le +1 DEF."
    },
    pieces: [
      {name:"Œil optique", type:"Capteur", location:"Tête", pv:2, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Perception -4 ; détection/scan impossible.", malusPerception:-4},
      {name:"Module dorsal", type:"Capteur", location:"Dos", pv:2, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Cri de détection impossible ; fouissage moins précis.", note:"Type source : Capteur / alerte."},
      {name:"Queue stabilisatrice", type:"Mobilite", location:"Arrière", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Coup de queue impossible ; jaillissement instable."},
      {name:"Patte avant gauche", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte avant droite", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte arrière gauche", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Patte arrière droite", type:"Mobilite", location:"Patte", pv:1, def:10, countPV:true, bonusDef:0, detachable:false,
       effect:"Voir seuil pattes."},
      {name:"Châssis fouisseur", type:"Structure", location:"Structure", pv:2, def:10, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; fouissage impossible ; vitesse -3 m.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Morsure courte", mode:"Naturelle", type:"Morsure", dmg:"1d4+1", dmgType:"Perforant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Coup de queue", mode:"Naturelle", type:"Queue", dmg:"1d4", dmgType:"Contondant", range:0, recharge:0,
       effect:"Impossible si la queue est détruite."},
      {name:"Jaillissement", mode:"Speciale", type:"Autre", dmg:"1d6", dmgType:"Contondant", range:0, zone:"Depuis fouissage", recharge:2, special:true,
       effect:"Châssis fonctionnel + pas 2 pattes détruites.", note:"Type de dégâts source : Impact."},
      {name:"Cri de détection", mode:"Speciale", type:"Sonique", dmg:"0", dmgType:"Autre", range:0, zone:"Proche", recharge:2, special:true,
       effect:"Impossible si le module dorsal est détruit.", note:"Type source : Alerte."}
    ]
  },

  "grazer-sauvage": {
    label: "Grazer sauvage",
    actor: {
      category: "Petite", variant: "Autre", model: "Grazer", threat: 1,
      role: "Troupeau, fuite, ruade défensive, charge collective",
      origin: "HELIOS standard",
      behavior: "Fuit d’abord ; charge si acculé ou panique ; devient dangereux en groupe.",
      bodyPV: 8, declaredModulesPV: 13, sourceMaxPV: 21,
      defense: 9, attack: 3, initiative: 2, speed: 9,
      fortitude: 3, reflex: 2, will: 0, abilityDC: 12,
      scanDC: 10, hackDC: 15, hackable: true,
      weaknesses: "Réservoirs Blaze ; cornes ; châssis léger renforcé",
      immunities: "Aucune notable",
      focus: "Variante plus robuste que le Grazer de rite. Sa vraie menace vient du troupeau et de la zone traversée, pas de son attaque individuelle.",
      notes: "Variante source : Sauvage / standard en nature. Vitesse normale 9 m ; ruade 12 m. Charge en troupeau : réussite = moitié ; échec = dégâts complets + renversé ou repoussé 1,5 m ; 5+ Grazers = 2d6 ou DD +1 au choix du MJ."
    },
    pieces: [
      {name:"Corne gauche", type:"Structure", location:"Tête", pv:1, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie.", note:"Type source : Arme naturelle."},
      {name:"Corne droite", type:"Structure", location:"Tête", pv:1, def:10, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie ; si les 2 cornes sont détruites, attaque de cornes impossible.", note:"Type source : Arme naturelle."},
      ...[1,2,3,4].map(n => ({name:`Réservoir Blaze ${n}`, type:"Reservoir", location:"Dos/flanc", pv:2, def:10, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Feu", dmg:"1d6", radius:1.5, dc:12},
       effect:"Si détruit par Feu : explosion 1d6 feu, rayon 1,5 m, Réflexes DD 12 moitié."})),
      {name:"Châssis léger renforcé", type:"Structure", location:"Structure", pv:3, def:10, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; ruade impossible ; vitesse -3 m ; ne participe plus à la charge en troupeau.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de cornes", mode:"Naturelle", type:"Cornes", dmg:"1d6", dmgType:"Autre", range:0, recharge:0,
       effect:"Au moins 1 corne intacte.", note:"Type de dégâts source : Perforant/contondant."},
      {name:"Ruade défensive", mode:"Naturelle", type:"Ruade", dmg:"1d6+1", dmgType:"Contondant", range:12, zone:"Ligne 12 m", recharge:2,
       effect:"Châssis intact + au moins 1 corne intacte."},
      {name:"Coup de sabot", mode:"Naturelle", type:"Ruade", dmg:"1d4+1", dmgType:"Contondant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Charge en troupeau", mode:"Zone", type:"Autre", dmg:"1d6+1", dmgType:"Contondant", range:12, zone:"Ligne 12 m, largeur 3 m", recharge:0, special:true,
       effect:"3 Grazers sauvages ou plus paniquent/chargent ensemble ; Réflexes DD 12. Réussite : moitié. Échec : dégâts complets + renversé ou repoussé 1,5 m.",
       note:"Usage source : scène. 5+ Grazers : 2d6 ou DD +1 au choix du MJ. Mode source : Collective / Zone-sauvegarde."}
    ]
  },

  "redeye-watcher": {
    label: "Redeye Watcher",
    actor: {
      category: "Petite", variant: "Autre", model: "Watcher", threat: 2,
      role: "Surveillance agressive, alerte, harcèlement",
      origin: "HELIOS standard",
      behavior: "Observe, marque les cibles, tire à distance, crie l’alerte, fuit si isolé.",
      bodyPV: 10, declaredModulesPV: 14, sourceMaxPV: 24,
      defense: 10, attack: 4, initiative: 3, speed: 9,
      fortitude: 3, reflex: 4, will: 1, abilityDC: 13,
      scanDC: 11, hackDC: 16, hackable: true,
      weaknesses: "Œil rouge optique ; module d’alerte renforcé ; queue stabilisatrice",
      immunities: "Aucune notable",
      focus: "Version agressive du Watcher. L’œil rouge sert à la fois de capteur et d’arme à distance.",
      notes: "Variante source : Redeye / renforcée. Sert de passerelle entre Menace 1 et Menace 2 : fragile si les PJ ciblent l’œil ou le module d’alerte, dangereux si ignoré."
    },
    pieces: [
      {name:"Œil rouge optique", type:"Capteur", location:"Tête", pv:4, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Rayon rouge impossible ; scan impossible ; Perception -4.", malusPerception:-4, note:"Type source : Capteur / arme."},
      {name:"Module d’alerte renforcé", type:"Capteur", location:"Gorge/tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Cri d’alerte impossible.", note:"Type source : Capteur / alerte."},
      {name:"Queue stabilisatrice", type:"Mobilite", location:"Arrière", pv:2, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Coup de queue impossible ; équilibre instable.", note:"Type source : Mobilité / arme."},
      {name:"Patte gauche", type:"Mobilite", location:"Membre", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie."},
      {name:"Patte droite", type:"Mobilite", location:"Membre", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie."},
      {name:"Châssis léger renforcé", type:"Structure", location:"Corps", pv:3, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; fuite/équilibre dégradés.", note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de griffe", mode:"Naturelle", type:"Griffes", dmg:"1d4+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Toujours disponible."},
      {name:"Coup de queue", mode:"Naturelle", type:"Queue", dmg:"1d4+1", dmgType:"Contondant", range:0, recharge:0,
       effect:"Impossible si la queue est détruite."},
      {name:"Rayon rouge", mode:"Distance", type:"Laser", dmg:"1d6+1", dmgType:"Energie", range:12, recharge:1,
       effect:"Impossible si l’œil est détruit.", note:"Type source : Énergie."},
      {name:"Cri d’alerte renforcé", mode:"Speciale", type:"Sonique", dmg:"0", dmgType:"Autre", range:24, recharge:2, special:true,
       effect:"Impossible si le module d’alerte est détruit.", note:"Type source : Alerte/son."},
      {name:"Marquage optique", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:18, recharge:1, special:true,
       effect:"Impossible si l’œil est détruit.", note:"Type source : Détection."}
    ]
  },

  "broadhead": {
    label: "Broadhead",
    actor: {
      category: "Petite", variant: "Standard", model: "Broadhead", threat: 2,
      role: "Troupeau, charge défensive, monture potentielle",
      origin: "HELIOS standard",
      behavior: "Plus lourd qu’un Strider, moins agile qu’un coureur. Fuit si possible, charge en ligne droite si acculé.",
      bodyPV: 10, declaredModulesPV: 16, sourceMaxPV: 26,
      defense: 10, attack: 4, initiative: 1, speed: 9,
      fortitude: 4, reflex: 1, will: 0, abilityDC: 13,
      scanDC: 11, hackDC: 15, hackable: true,
      weaknesses: "Cornes ; batterie arrière ; châssis de charge",
      immunities: "Aucune notable",
      focus: "Machine de troupeau plus lourde qu’un Strider. Dangereuse surtout en ligne droite ou en panique collective.",
      notes: "Variante source : Standard sauvage. Ruade : 15 m en ligne droite. Ne pas le traiter comme un Trampler : il n’est pas massif/tank, seulement plus robuste et moins agile qu’un Strider."
    },
    pieces: [
      {name:"Module tête", type:"Capteur", location:"Tête", pv:2, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Perception -4 ; scan impossible.", malusPerception:-4, note:"Type source : Capteur / tête."},
      {name:"Corne gauche", type:"Structure", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie.", note:"Type source : Arme naturelle."},
      {name:"Corne droite", type:"Structure", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Ruade affaiblie.", note:"Type source : Arme naturelle."},
      {name:"Batterie arrière", type:"Generateur", location:"Arrière", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Surcharge choc légère si détruite par élément adapté.", note:"La fiche source ne chiffre pas davantage cette surcharge."},
      {name:"Patte avant gauche", type:"Mobilite", location:"Patte", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie, ruade impossible."},
      {name:"Patte avant droite", type:"Mobilite", location:"Patte", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie, ruade impossible."},
      {name:"Patte arrière gauche", type:"Mobilite", location:"Patte", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie, ruade impossible."},
      {name:"Patte arrière droite", type:"Mobilite", location:"Patte", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"1 patte : vitesse -3 m ; 2 pattes : Ralentie, ruade impossible."},
      {name:"Châssis de charge", type:"Structure", location:"Corps", pv:1, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; ruade impossible ; vitesse -3 m.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de sabot", mode:"Naturelle", type:"Ruade", dmg:"1d6", dmgType:"Contondant", range:0, recharge:0, effect:"Toujours disponible."},
      {name:"Coup de cornes", mode:"Naturelle", type:"Cornes", dmg:"1d8", dmgType:"Autre", range:0, recharge:0,
       effect:"Au moins 1 corne intacte.", note:"Type de dégâts source : Perforant/contondant."},
      {name:"Ruade lourde", mode:"Naturelle", type:"Ruade", dmg:"1d8+1", dmgType:"Contondant", range:15, zone:"Ligne 15 m", recharge:2,
       effect:"Châssis intact + au moins 1 corne + 3 pattes fonctionnelles."},
      {name:"Charge de troupeau", mode:"Speciale", type:"Autre", dmg:"1d8+1", dmgType:"Contondant", range:15, zone:"Ligne 15 m, largeur 3 m", recharge:0, special:true,
       effect:"2 Broadheads ou plus ; Réflexes DD 13, réussite moitié, échec repousse 1,5 m, échec critique renverse.",
       note:"Type source : Zone / sauvegarde. Recharge source : Scène."}
    ]
  },

  "scrapper-blesse": {
    label: "Scrapper blessé",
    actor: {
      category: "Petite", variant: "Endommagee", model: "Scrapper", threat: 2,
      role: "Récupération agressive, panique, tutoriel prédateur",
      origin: "HELIOS standard perturbé par signal ELYSIUM",
      behavior: "Agressif mais instable. Attaque par morsure/griffe, comportements erratiques si pièces perdues.",
      bodyPV: 9, declaredModulesPV: 15, sourceMaxPV: 24,
      defense: 10, attack: 3, initiative: 1, speed: 9,
      fortitude: 3, reflex: 2, will: 1, abilityDC: 13,
      scanDC: 11, hackDC: 17, hackable: true,
      weaknesses: "Mâchoire ; griffes ; radar dorsal ; châssis abîmé ; batterie arrière instable",
      immunities: "Aucune notable ; comportement instable",
      focus: "Prédateur de récupération blessé. Les fragments visibles sont des morceaux de châssis brisé.",
      notes: "Variante source : Blessé / perturbé. Piratage DD 17, ou DD 15 si brouillé. Signal ELYSIUM perturbé : au début de son tour, si au moins une pièce est perdue, le MJ peut lancer 1d6 : 1 attaque la cible la plus proche ; 2-3 tourne/recul ; 4-6 agit normalement."
    },
    pieces: [
      {name:"Mâchoire de récupération", type:"Structure", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Morsure réduite ; déchiquetage impossible.", note:"Type source : Arme / outil."},
      {name:"Griffe gauche", type:"Structure", location:"Avant", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Déchiquetage affaibli.", note:"Type source : Arme / outil."},
      {name:"Griffe droite", type:"Structure", location:"Avant", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Déchiquetage affaibli.", note:"Type source : Arme / outil."},
      {name:"Radar dorsal endommagé", type:"Capteur", location:"Dos", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Perception -4 ; scan/marquage impossible.", malusPerception:-4},
      {name:"Batterie arrière instable", type:"Generateur", location:"Arrière", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Choc", dmg:"1d6", radius:1.5, dc:13},
       effect:"Surcharge choc 1d6 dans 1,5 m si détruite par élément adapté ; Réflexes DD 13 moitié."},
      {name:"Queue / stabilisateur arrière", type:"Mobilite", location:"Arrière", pv:1, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Bond perturbé ; équilibre dégradé."},
      {name:"Châssis abîmé", type:"Structure", location:"Corps", pv:2, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; bond impossible ; vitesse -3 m. Fragments visibles = châssis brisé, pas plaques propres.", malusSpeed:-3}
    ],
    weapons: [
      {name:"Morsure de récupération", mode:"Naturelle", type:"Morsure", dmg:"1d6+1", dmgType:"Perforant", range:0, recharge:0, effect:"Mâchoire fonctionnelle."},
      {name:"Coup de griffe", mode:"Naturelle", type:"Griffes", dmg:"1d6", dmgType:"Tranchant", range:0, recharge:0, effect:"Au moins 1 griffe fonctionnelle."},
      {name:"Déchiquetage instable", mode:"Naturelle", type:"Griffes", dmg:"1d8+1", dmgType:"Tranchant", range:0, recharge:2,
       effect:"Mâchoire + au moins 1 griffe. Si 1 griffe détruite : 1d6+1 ; si 2 griffes : impossible."},
      {name:"Bond court perturbé", mode:"Naturelle", type:"Autre", dmg:"1d8", dmgType:"Contondant", range:"Courte", recharge:2,
       effect:"Châssis fonctionnel.", note:"Type source : Impact."},
      {name:"Cri parasite", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:"Court", recharge:0, special:true,
       effect:"Effet narratif / signal ELYSIUM.", note:"Type source : Brouillage léger. Recharge source : Scène."}
    ]
  },

  "scrapper-standard": {
    label: "Scrapper standard / intact",
    actor: {
      category: "Petite", variant: "Standard", model: "Scrapper", threat: 2,
      role: "Récupération agressive, prédateur léger, menace active",
      origin: "HELIOS standard",
      behavior: "Fonctionnel, compact, agressif. Harcèle, bondit, déchiquette les cibles isolées.",
      bodyPV: 11, declaredModulesPV: 18, sourceMaxPV: 29,
      defense: 10, attack: 4, initiative: 2, speed: 9,
      fortitude: 4, reflex: 3, will: 1, abilityDC: 13,
      scanDC: 11, hackDC: 16, hackable: true,
      weaknesses: "Mâchoire ; griffes ; radar ; batterie arrière ; châssis compact",
      immunities: "Aucune notable ; DEF élevée pour Menace 2 grâce au châssis compact",
      focus: "Scrapper intact : châssis compact cohérent, plus résistant que la version blessée. DEF 12 tant que le châssis tient.",
      notes: "Menace 2 haute. La solution tactique est de casser le châssis pour faire tomber sa DEF. Le champ numérique Niveau / menace reste à 2 ; la mention ‘haute’ est conservée ici."
    },
    pieces: [
      {name:"Mâchoire de récupération", type:"Structure", location:"Tête", pv:3, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Morsure réduite ; déchiquetage impossible.", note:"Type source : Arme / outil."},
      {name:"Griffe gauche", type:"Structure", location:"Avant", pv:2, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Déchiquetage affaibli.", note:"Type source : Arme / outil."},
      {name:"Griffe droite", type:"Structure", location:"Avant", pv:2, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Déchiquetage affaibli.", note:"Type source : Arme / outil."},
      {name:"Radar dorsal", type:"Capteur", location:"Dos", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Perception -4 ; scan/marquage impossible.", malusPerception:-4},
      {name:"Batterie arrière", type:"Generateur", location:"Arrière", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Choc", dmg:"1d6", radius:1.5, dc:13},
       effect:"Surcharge choc 1d6 dans 1,5 m si détruite par élément adapté ; Réflexes DD 13 moitié."},
      {name:"Queue / stabilisateur", type:"Mobilite", location:"Arrière", pv:2, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Bond plus difficile ; équilibre dégradé."},
      {name:"Châssis compact intact", type:"Structure", location:"Corps", pv:3, def:12, countPV:true, bonusDef:2, detachable:false,
       effect:"Perte du +2 DEF ; bond impossible ; vitesse -3 m. Châssis intact, pas plaques séparées.", malusSpeed:-3}
    ],
    weapons: [
      {name:"Morsure de récupération", mode:"Naturelle", type:"Morsure", dmg:"1d6+1", dmgType:"Perforant", range:0, recharge:0, effect:"Mâchoire fonctionnelle."},
      {name:"Coup de griffe", mode:"Naturelle", type:"Griffes", dmg:"1d6", dmgType:"Tranchant", range:0, recharge:0, effect:"Au moins 1 griffe fonctionnelle."},
      {name:"Déchiquetage", mode:"Naturelle", type:"Griffes", dmg:"1d8+1", dmgType:"Tranchant", range:0, recharge:2,
       effect:"Mâchoire + au moins 1 griffe. Si 1 griffe détruite : 1d6+1 ; si 2 griffes : impossible."},
      {name:"Bond de ferraille", mode:"Naturelle", type:"Autre", dmg:"1d8+1", dmgType:"Contondant", range:"Courte", recharge:2,
       effect:"Châssis fonctionnel.", note:"Type source : Impact."}
    ]
  }
,
  "sawtooth-aloy": {
    label: "Dent de Scie d'Aloy",
    actor: {
      category: "Moyenne", variant: "Autre", model: "Dent de Scie / Sawtooth", threat: 3,
      role: "Monture d'urgence / intimidation / poursuite",
      origin: "Machine HELIOS piratée en urgence par Aloy via Focus",
      behavior: "Obéit à Aloy, attaque seulement pour défendre ou dégager la route.",
      bodyPV: 24, declaredModulesPV: 32, sourceMaxPV: 56,
      defense: 10, attack: 5, initiative: 3, speed: 12,
      fortitude: 5, reflex: 4, will: 2, abilityDC: 14,
      scanDC: 12, hackDC: 20, hackable: true,
      weaknesses: "Mâchoire de prédation ; griffes ; capteur frontal ; batterie dorsale ; queue stabilisatrice ; châssis prédateur",
      immunities: "Aucune notable",
      focus: "Monture improvisée piratée par Aloy. Aucun harnachement installé. Les prises naturelles du châssis servent de points d'appui.",
      notes: "Menace 3 spéciale. Bond / charge courte : 15 m. Piratage : DD 20 ou scène dédiée. Ne peut pas être commandée normalement par un autre personnage. Aloy seule utilise la charge montée d'urgence."
    },
    pieces: [
      {name:"Mâchoire de prédation", type:"Structure", location:"Tête", pv:6, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Morsure réduite à 1d6 ; intimidation diminuée.", note:"Type source : Arme naturelle."},
      {name:"Griffe gauche", type:"Structure", location:"Patte avant", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Attaque de griffes affaiblie.", note:"Type source : Arme naturelle."},
      {name:"Griffe droite", type:"Structure", location:"Patte avant", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Attaque de griffes affaiblie.", note:"Type source : Arme naturelle."},
      {name:"Capteur frontal", type:"Capteur", location:"Tête", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Perception -4 ; pistage impossible ; rugissement moins efficace.", malusPerception:-4},
      {name:"Batterie dorsale", type:"Generateur", location:"Dos", pv:5, def:12, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Choc", dmg:"1d6", radius:1.5, dc:14},
       effect:"Si détruite par élément adapté : surcharge 1d6 choc, rayon 1,5 m, Réflexes DD 14 moitié."},
      {name:"Queue stabilisatrice", type:"Mobilite", location:"Arrière", pv:3, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Bond instable ; virages brutaux impossibles ; charge montée désavantagée."},
      {name:"Châssis prédateur", type:"Structure", location:"Corps", pv:6, def:12, countPV:true, bonusDef:2, detachable:false,
       effect:"Perte du +2 DEF ; bond impossible ; vitesse -3 m.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Morsure contrôlée", mode:"Naturelle", type:"Morsure", dmg:"1d8+2", dmgType:"Perforant", range:0, recharge:0,
       effect:"Mâchoire fonctionnelle.", note:"Type de dégâts source : Perforant / tranchant."},
      {name:"Coup de griffes", mode:"Naturelle", type:"Griffes", dmg:"1d8+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Au moins 1 griffe fonctionnelle."},
      {name:"Bond prédateur", mode:"Speciale", type:"Autre", dmg:"2d6", dmgType:"Contondant", range:15, zone:"Bond 15 m", recharge:2, special:true,
       effect:"Châssis intact + queue fonctionnelle.", note:"Mode source : Mouvement / attaque. Type source : Impact / tranchant."},
      {name:"Charge montée d'urgence", mode:"Speciale", type:"Ruade", dmg:"2d6+1", dmgType:"Contondant", range:15, zone:"Ligne 12–15 m", recharge:0, special:true,
       effect:"Aloy montée, châssis intact, trajectoire dégagée.", note:"Recharge source : scène."},
      {name:"Rugissement mécanique", mode:"Speciale", type:"Sonique", dmg:"0", dmgType:"Autre", range:9, recharge:2, special:true,
       effect:"Volonté DD 14 ; capteur frontal fonctionnel.", note:"Type source : Intimidation."}
    ]
  },

  "lancehorn": {
    label: "Lancehorn",
    actor: {
      category: "Moyenne", variant: "Standard", model: "Lancehorn", threat: 3,
      role: "Collecteur territorial / charge / troupeau",
      origin: "HELIOS standard",
      behavior: "Fuit si isolé, charge si acculé ou si le troupeau est menacé.",
      bodyPV: 18, declaredModulesPV: 24, sourceMaxPV: 42,
      defense: 10, attack: 5, initiative: 2, speed: 9,
      fortitude: 5, reflex: 3, will: 1, abilityDC: 14,
      scanDC: 12, hackDC: 17, hackable: true,
      weaknesses: "Lances frontales ; réservoirs élémentaires ; module de collecte ; pattes ; châssis de charge",
      immunities: "Aucune notable",
      focus: "Grazer plus agressif et plus robuste. Sa menace vient des lances frontales et de la charge, surtout s'il protège un troupeau ou une zone de collecte.",
      notes: "Charge : 15 m. Les réservoirs n'explosent que s'ils sont détruits avec l'élément adapté ; sinon ils se décrochent."
    },
    pieces: [
      {name:"Lance gauche", type:"Structure", location:"Tête", pv:4, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Charge affaiblie ; dégâts de lance réduits.", note:"Type source : Arme naturelle."},
      {name:"Lance droite", type:"Structure", location:"Tête", pv:4, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Charge affaiblie ; dégâts de lance réduits.", note:"Type source : Arme naturelle."},
      {name:"Réservoir élémentaire gauche", type:"Reservoir", location:"Flanc", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Se décroche ; explose seulement si détruit par l'élément adapté.", note:"Explosion/source : Secousse de réservoir, 1d6, rayon 1,5 m, Réflexes DD 14."},
      {name:"Réservoir élémentaire droit", type:"Reservoir", location:"Flanc", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Se décroche ; explose seulement si détruit par l'élément adapté.", note:"Explosion/source : Secousse de réservoir, 1d6, rayon 1,5 m, Réflexes DD 14."},
      {name:"Module de collecte", type:"Autre", location:"Tête / thorax", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Ne peut plus récolter ; fuite plus probable."},
      {name:"Patte avant gauche", type:"Mobilite", location:"Patte", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Vitesse -3 m ; charge impossible si 2 pattes détruites."},
      {name:"Patte avant droite", type:"Mobilite", location:"Patte", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Vitesse -3 m ; charge impossible si 2 pattes détruites."},
      {name:"Châssis de charge", type:"Structure", location:"Corps", pv:3, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; ruade impossible.", note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de lance", mode:"Naturelle", type:"Cornes", dmg:"1d8+1", dmgType:"Perforant", range:0, recharge:0,
       effect:"Au moins 1 lance fonctionnelle."},
      {name:"Coup de sabot", mode:"Naturelle", type:"Ruade", dmg:"1d6+1", dmgType:"Contondant", range:0, recharge:0,
       effect:"Au moins 2 pattes fonctionnelles.", note:"Type source : Impact."},
      {name:"Ruade perforante", mode:"Speciale", type:"Cornes", dmg:"2d6+1", dmgType:"Perforant", range:15, zone:"Ligne 15 m", recharge:2, special:true,
       effect:"Châssis intact + au moins 1 lance.", note:"Mode source : Mouvement / charge. Type source : Perforant / impact."},
      {name:"Charge de troupeau", mode:"Zone", type:"Ruade", dmg:"2d6", dmgType:"Contondant", range:15, zone:"Ligne 15 m, largeur 3 m", recharge:0, special:true,
       effect:"3 Lancehorns ou Grazers/Lancehorns paniqués ; Réflexes DD 14.", note:"Recharge source : scène."},
      {name:"Secousse de réservoir", mode:"Zone", type:"Autre", dmg:"1d6", dmgType:"Energie", range:1.5, zone:"Rayon 1,5 m", recharge:0, special:true,
       effect:"Réflexes DD 14 ; déclenchée uniquement si un réservoir est détruit par l'élément adapté.", note:"Type source : Élémentaire ; recharge source : Déclenchée."}
    ]
  },

  "longleg": {
    label: "Longleg",
    actor: {
      category: "Moyenne", variant: "Standard", model: "Longleg", threat: 3,
      role: "Alerte, perturbation, attaque de zone",
      origin: "HELIOS standard",
      behavior: "Repère les intrus, crie, attire les machines proches, reste mobile.",
      bodyPV: 20, declaredModulesPV: 26, sourceMaxPV: 46,
      defense: 10, attack: 5, initiative: 3, speed: 12,
      fortitude: 4, reflex: 5, will: 1, abilityDC: 14,
      scanDC: 12, hackDC: 17, hackable: true,
      weaknesses: "Sac vocal ; module d'alerte ; bec ; pattes ; griffes ; châssis agile",
      immunities: "Aucune notable",
      focus: "Machine tactique de zone. Son cri peut transformer une rencontre simple en alerte générale.",
      notes: "Bond court : 12 m. Cri d'alerte : 1 fois par scène au total, peu importe le nombre de Longlegs présents. Assourdi : -2 Perception auditive et -2 Focus/Concentration liés au bruit pendant 1 round. Désorienté : -2 prochaine attaque/test technique ; impossible de viser une pièce, marquer une pièce ou scan concentré jusqu'au début du prochain tour."
    },
    pieces: [
      {name:"Sac vocal", type:"Autre", location:"Gorge / torse", pv:5, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Désactive Cri strident et Cri basse fréquence.", note:"Type source : Module sonore."},
      {name:"Module d'alerte", type:"Capteur", location:"Tête / dos", pv:4, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Ne peut plus appeler ou activer les machines proches.", note:"Type source : Signal."},
      {name:"Bec / tête d'impact", type:"Structure", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Coup de bec réduit à 1d4+1.", note:"Type source : Arme naturelle."},
      {name:"Patte gauche", type:"Mobilite", location:"Patte", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Vitesse -3 m ; bond impossible si 2 pattes détruites."},
      {name:"Patte droite", type:"Mobilite", location:"Patte", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Vitesse -3 m ; bond impossible si 2 pattes détruites."},
      {name:"Griffe gauche", type:"Structure", location:"Patte", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Coup de griffes affaibli.", note:"Type source : Arme naturelle."},
      {name:"Griffe droite", type:"Structure", location:"Patte", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Coup de griffes affaibli.", note:"Type source : Arme naturelle."},
      {name:"Châssis agile", type:"Structure", location:"Corps", pv:4, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; vitesse -3 m ; bond impossible.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de bec", mode:"Naturelle", type:"Autre", dmg:"1d6+1", dmgType:"Perforant", range:0, recharge:0,
       effect:"Bec fonctionnel.", note:"Type de dégâts source : Perforant / impact."},
      {name:"Coup de griffes", mode:"Naturelle", type:"Griffes", dmg:"1d6+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Au moins 1 griffe fonctionnelle."},
      {name:"Bond agressif", mode:"Speciale", type:"Autre", dmg:"1d8+1", dmgType:"Contondant", range:12, zone:"Bond 12 m", recharge:2, special:true,
       effect:"Châssis intact + pattes fonctionnelles.", note:"Mode source : Mouvement / attaque. Type source : Impact."},
      {name:"Cri strident", mode:"Zone", type:"Sonique", dmg:"1d4", dmgType:"Autre", range:9, zone:"Rayon 9 m", recharge:2, special:true,
       effect:"Vigueur DD 14 ; ajoute Assourdi. Sac vocal fonctionnel.", note:"Assourdi : -2 Perception auditive et -2 Focus/Concentration liés au bruit pendant 1 round."},
      {name:"Cri basse fréquence", mode:"Zone", type:"Sonique", dmg:"1d6", dmgType:"Autre", range:6, zone:"Cône 6 m ou rayon 4,5 m", recharge:3, special:true,
       effect:"Vigueur DD 14 ; ajoute Désorienté. Sac vocal fonctionnel.", note:"Désorienté : -2 prochaine attaque/test technique ; impossible de viser/marquer une pièce ou scan concentré jusqu'au prochain tour."},
      {name:"Cri d'alerte", mode:"Speciale", type:"Sonique", dmg:"0", dmgType:"Autre", range:30, zone:"Rayon 30 m", recharge:0, special:true,
       effect:"Module d'alerte fonctionnel.", note:"1 fois par scène globale, peu importe le nombre de Longlegs présents."}
    ]
  },

  "scrounger": {
    label: "Scrounger",
    actor: {
      category: "Petite", variant: "Standard", model: "Scrounger", threat: 3,
      role: "Harceleur rapide / plasma / meute",
      origin: "HELIOS standard",
      behavior: "Tire à distance, bondit sur les cibles isolées, recule si son canon est détruit.",
      bodyPV: 16, declaredModulesPV: 24, sourceMaxPV: 40,
      defense: 10, attack: 5, initiative: 4, speed: 12,
      fortitude: 3, reflex: 5, will: 1, abilityDC: 14,
      scanDC: 12, hackDC: 17, hackable: true,
      weaknesses: "Canon plasma ; batterie plasma ; mâchoire ; griffes ; capteur ; queue ; châssis agile",
      immunities: "Aucune notable",
      focus: "Scrapper plus léger et plus nerveux. Moins robuste, mais plus rapide et dangereux à distance grâce au plasma.",
      notes: "Bond / déplacement agressif : 15 m. Harcèlement de meute : si au moins 2 Scroungers ciblent le même ennemi, le premier qui touche donne +1 ATQ au suivant contre cette cible jusqu'à la fin du round."
    },
    pieces: [
      {name:"Canon plasma", type:"Autre", location:"Dos / épaules", pv:5, def:11, countPV:true, bonusDef:0, detachable:true, loot:"Circuit ancien abîmé",
       effect:"Désactive Tir plasma et Tir de couverture plasma.", note:"Type source : Arme distante."},
      {name:"Batterie plasma", type:"Generateur", location:"Dos / flanc", pv:4, def:11, countPV:true, bonusDef:0, detachable:true,
       explosion:{type:"Energie", dmg:"1d6", radius:1.5, dc:14},
       effect:"Si détruite par élément adapté : explosion plasma 1d6, rayon 1,5 m, Réflexes DD 14 moitié."},
      {name:"Mâchoire de récupération", type:"Structure", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Morsure réduite à 1d4+1.", note:"Type source : Arme naturelle."},
      {name:"Griffe gauche", type:"Structure", location:"Patte avant", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Coup de griffes affaibli.", note:"Type source : Arme naturelle."},
      {name:"Griffe droite", type:"Structure", location:"Patte avant", pv:2, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Coup de griffes affaibli.", note:"Type source : Arme naturelle."},
      {name:"Capteur de charognard", type:"Capteur", location:"Tête", pv:3, def:11, countPV:true, bonusDef:0, detachable:true,
       effect:"Perception -4 ; ne profite plus des cibles isolées/blessées.", malusPerception:-4},
      {name:"Queue stabilisatrice", type:"Mobilite", location:"Arrière", pv:2, def:11, countPV:true, bonusDef:0, detachable:false,
       effect:"Bond instable ; déplacement agressif impossible."},
      {name:"Châssis agile", type:"Structure", location:"Corps", pv:3, def:11, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; vitesse -3 m ; bond impossible.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Tir plasma", mode:"Distance", type:"Canon", dmg:"1d8+1", dmgType:"Energie", range:18, recharge:0,
       effect:"Canon plasma fonctionnel.", note:"Type source : Plasma / énergie."},
      {name:"Tir de couverture plasma", mode:"Distance", type:"Canon", dmg:"1d6", dmgType:"Energie", range:18, recharge:2,
       effect:"Canon plasma fonctionnel.", note:"Mode source : Distance / pression. Type source : Plasma."},
      {name:"Morsure de récupération", mode:"Naturelle", type:"Morsure", dmg:"1d6+1", dmgType:"Perforant", range:0, recharge:0,
       effect:"Mâchoire fonctionnelle.", note:"Type de dégâts source : Perforant / tranchant."},
      {name:"Coup de griffes", mode:"Naturelle", type:"Griffes", dmg:"1d6+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Au moins 1 griffe fonctionnelle."},
      {name:"Bond charognard", mode:"Speciale", type:"Autre", dmg:"1d8+1", dmgType:"Contondant", range:15, zone:"Bond 15 m", recharge:2, special:true,
       effect:"Châssis + queue fonctionnels.", note:"Mode source : Mouvement / attaque. Type source : Impact / tranchant."}
    ]
  },

  "recolteur-elys": {
    label: "Récolteur ELYS",
    actor: {
      category: "Moyenne", variant: "ELYSIUM", model: "Custom ELYSIUM", threat: 3,
      role: "Récupération / cargaison / fuite",
      origin: "ELYSIUM — machine custom de collecte",
      behavior: "Protège sa cargaison puis fuit vers un relais ou itinéraire ELYSIUM.",
      bodyPV: 18, declaredModulesPV: 32, sourceMaxPV: 50,
      defense: 10, attack: 5, initiative: 3, speed: 12,
      fortitude: 4, reflex: 4, will: 2, abilityDC: 14,
      scanDC: 12, hackDC: 18, hackable: true,
      weaknesses: "Museau extracteur ; griffes ; module dorsal de cargaison ; balise blanche ; batterie blanche ; capteur de matériaux ; plaques blanches ; châssis de collecte",
      immunities: "Aucune notable",
      focus: "Machine custom ELYSIUM. Son objectif est de rapporter composants naturels et pièces machines au Creuset ELYSIUM ; elle ne cherche pas le combat prolongé.",
      notes: "Fuite assistée : 15 m. Déclenche sa fuite si elle subit des dégâts, perd une pièce, ou est bloquée à moins de 6 m d'un ennemi. Si le module dorsal est détruit : cargaison perdue ou abandonnée. Si la balise est détruite : route du Creuset non automatique."
    },
    pieces: [
      {name:"Museau extracteur", type:"Autre", location:"Tête", pv:4, def:12, countPV:true, bonusDef:0, detachable:true, loot:"Plaques métalliques",
       effect:"Ne peut plus collecter / arracher proprement.", note:"Type source : Outil."},
      {name:"Griffe gauche de récupération", type:"Structure", location:"Patte avant", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Attaque de griffes affaiblie.", note:"Type source : Arme / outil."},
      {name:"Griffe droite de récupération", type:"Structure", location:"Patte avant", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Attaque de griffes affaiblie.", note:"Type source : Arme / outil."},
      {name:"Module dorsal de cargaison", type:"Cargo", location:"Dos", pv:5, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Perd ou abandonne la cargaison.", note:"Type source : Stockage."},
      {name:"Balise blanche ELYS", type:"Capteur", location:"Dos / tête", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Ne retrouve plus automatiquement la route du Creuset.", note:"Type source : Signal."},
      {name:"Batterie blanche", type:"Generateur", location:"Corps", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Désactive impulsion blanche et réduit fuite assistée."},
      {name:"Capteur de matériaux", type:"Capteur", location:"Tête / thorax", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Ne détecte plus ressources / carcasses utiles."},
      {name:"Plaques blanches ELYS", type:"Blindage", location:"Corps", pv:3, def:12, countPV:true, bonusDef:1, detachable:true,
       effect:"Perte du +1 DEF des plaques."},
      {name:"Châssis de collecte", type:"Structure", location:"Corps", pv:3, def:12, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; vitesse -3 m ; fuite assistée impossible.", malusSpeed:-3, note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Coup de griffes de récupération", mode:"Naturelle", type:"Griffes", dmg:"1d6+1", dmgType:"Tranchant", range:0, recharge:0,
       effect:"Au moins 1 griffe fonctionnelle.", note:"Mode source : Naturelle / outil."},
      {name:"Pince / museau extracteur", mode:"Naturelle", type:"Pince", dmg:"1d6", dmgType:"Perforant", range:0, recharge:0,
       effect:"Museau extracteur fonctionnel.", note:"Mode source : Outil. Type source : Perforant / arrachement."},
      {name:"Charge basse défensive", mode:"Speciale", type:"Ruade", dmg:"1d8+1", dmgType:"Contondant", range:9, zone:"Ligne 9 m", recharge:2, special:true,
       effect:"Châssis fonctionnel.", note:"Mode source : Mouvement / attaque. Type source : Impact."},
      {name:"Impulsion blanche défensive", mode:"Zone", type:"Laser", dmg:"1d6", dmgType:"Energie", range:3, zone:"Rayon 3 m", recharge:3, special:true,
       effect:"Réflexes DD 14 ; repousse 3 m ; batterie blanche fonctionnelle."},
      {name:"Fuite assistée ELYS", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:15, zone:"Désengagement + 15 m", recharge:3, special:true,
       effect:"Châssis de collecte fonctionnel.", note:"Mode source : Mouvement / Fuite."}
    ]
  },

  "tisseur-elys9": {
    label: "Tisseur ELYS-9",
    actor: {
      category: "Petite", variant: "ELYSIUM", model: "Tisseur ELYS-9", threat: 3,
      role: "Brouillage Focus / marquage / relais parasite",
      origin: "ELYSIUM-9 — relais parasite",
      behavior: "Évite le frontal, parasite, brouille, se replie.",
      bodyPV: 16, declaredModulesPV: 30, sourceMaxPV: 46,
      defense: 10, attack: 5, initiative: 4, speed: 9,
      fortitude: 3, reflex: 5, will: 2, abilityDC: 14,
      scanDC: 13, hackDC: 18, hackable: true,
      weaknesses: "Abdomen relais ; émetteur parasite ; filaments ; tête capteur ; mandibules ; pattes ; plaques blanches ; châssis arachnéen",
      immunities: "Aucune notable",
      focus: "Relais parasite arachnéen inspiré d'un Corrupteur, mais moins agressif et moins scorpion. Il prépare le terrain : brouillage, marquage, corruption légère, repli.",
      notes: "Escalade : 9 m. Balise parasite : marque 3 rounds ; machines ELYS à 18 m connaissent la position approximative ; -2 discrétion et -2 piratage contre machines ELYS. Brouillage Focus : échec = scan rapide impossible 1 round, scan complet/concentré impossible jusqu'au prochain tour, -2 Focus/piratage ; réussite = -1 Focus/piratage 1 round. Parasitage léger : cible une machine non-ELYS blessée ou ayant perdu une pièce ; impulsion temporaire seulement, pas de contrôle complet."
    },
    pieces: [
      {name:"Abdomen relais ELYS-9", type:"Autre", location:"Abdomen", pv:6, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Désactive relais ELYS, brouillage Focus et transmission longue portée.", note:"Type source : Relais / signal."},
      {name:"Émetteur parasite violet", type:"Autre", location:"Dos / thorax", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Désactive Balise parasite et Parasitage léger.", note:"Type source : Signal parasite."},
      {name:"Filaments de signal", type:"Autre", location:"Face / mandibules", pv:4, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Désactive Filament parasite ; ne peut plus accrocher ni ralentir.", note:"Type source : Outil / contrôle."},
      {name:"Tête capteur", type:"Capteur", location:"Tête", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Perception -4 ; ciblage parasite imprécis.", malusPerception:-4},
      {name:"Mandibules d'injection", type:"Structure", location:"Tête", pv:3, def:12, countPV:true, bonusDef:0, detachable:false,
       effect:"Morsure d'injection réduite à 1d4.", note:"Type source : Arme naturelle."},
      {name:"Pattes arachnéennes avant", type:"Mobilite", location:"Avant", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Vitesse -3 m.", malusSpeed:-3},
      {name:"Pattes arachnéennes arrière", type:"Mobilite", location:"Arrière", pv:3, def:12, countPV:true, bonusDef:0, detachable:true,
       effect:"Escalade impossible si détruites."},
      {name:"Plaques blanches ELYS", type:"Blindage", location:"Corps", pv:2, def:12, countPV:true, bonusDef:1, detachable:true,
       effect:"Perte du +1 DEF des plaques blanches."},
      {name:"Châssis arachnéen", type:"Structure", location:"Corps", pv:2, def:12, countPV:true, bonusDef:1, detachable:false,
       effect:"Perte du +1 DEF ; escalade impossible ; repli désactivé.", note:"Type source : Châssis."}
    ],
    weapons: [
      {name:"Morsure d'injection", mode:"Naturelle", type:"Morsure", dmg:"1d6", dmgType:"Perforant", range:0, recharge:0,
       effect:"Mandibules fonctionnelles.", note:"Type source : Perforant / parasite."},
      {name:"Filament parasite", mode:"Distance", type:"Projectile", dmg:"1d4", dmgType:"Autre", range:9, recharge:2, special:true,
       effect:"ATQ +5 puis Réflexes DD 14 ; filaments fonctionnels.", note:"Type source : Signal / contrôle."},
      {name:"Balise parasite", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:9, recharge:3, special:true,
       effect:"Volonté DD 14 ; émetteur parasite fonctionnel. Marque 3 rounds.", note:"Machines ELYS à 18 m connaissent la position approximative ; -2 discrétion et -2 piratage contre machines ELYS."},
      {name:"Impulsion brouillage Focus", mode:"Zone", type:"Autre", dmg:"0", dmgType:"Autre", range:6, zone:"Rayon 6 m", recharge:3, special:true,
       effect:"Volonté DD 14 ; abdomen relais fonctionnel.", note:"Échec : scan rapide impossible 1 round, scan complet/concentré impossible jusqu'au prochain tour, -2 Focus/piratage. Réussite : -1 Focus/piratage 1 round."},
      {name:"Parasitage léger de machine", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:6, recharge:3, special:true,
       effect:"DD 14 ; émetteur + abdomen relais fonctionnels.", note:"Cible une machine non-ELYS blessée ou ayant perdu une pièce ; impulsion temporaire seulement, pas de contrôle complet."},
      {name:"Repli arachnéen", mode:"Speciale", type:"Autre", dmg:"0", dmgType:"Autre", range:12, zone:"Désengagement + 12 m", recharge:3, special:true,
       effect:"Châssis + pattes fonctionnels.", note:"Mode source : Mouvement / Fuite / repositionnement."}
    ]
  }


};

Object.assign(MACHINES, THREAT4_MACHINES);

function notify(type, msg) { ui.notifications?.[type]?.(msg); }
function clone(value) { return foundry.utils.deepClone(value); }
function hasText(obj, key) { try { return JSON.stringify(obj ?? {}).includes(key); } catch { return false; } }

function allMachineKeys(threat=null) {
  const entries = Object.entries(MACHINES);
  if (threat == null) return entries.map(([key]) => key);
  return entries.filter(([, machine]) => Number(machine.actor?.threat) === Number(threat)).map(([key]) => key);
}

function threatFolderName(machine) {
  return `Menace ${Number(machine?.actor?.threat ?? 0)}`;
}

function selectionKeys(selection) {
  if (selection === "all") return allMachineKeys();
  if (selection === "threat-1") return allMachineKeys(1);
  if (selection === "threat-2") return allMachineKeys(2);
  if (selection === "threat-3") return allMachineKeys(3);
  if (selection === "threat-4") return allMachineKeys(4);
  return [selection];
}

function machineKeyAliases(machineKey) {
  return [machineKey, ...(LEGACY_MACHINE_KEYS[machineKey] ?? [])];
}

function templateManagerApi() {
  const mod = game.modules?.get("h0d-template-manager");
  return mod?.active && mod.api ? mod.api : null;
}

function canonicalTemplate(key) {
  try { return templateManagerApi()?.getTemplate?.(key) ?? null; }
  catch (err) {
    console.warn(`${MODULE_ID} | Template Manager indisponible pour ${key}`, err);
    return null;
  }
}

function machineWarnings(machine) {
  const piecePV = machine.pieces.reduce((sum, p) => sum + (p.countPV ? Number(p.pv || 0) : 0), 0);
  const warnings = [];
  if (piecePV !== Number(machine.actor.declaredModulesPV)) {
    warnings.push(`PV modules annoncés ${machine.actor.declaredModulesPV}, mais les lignes de composants totalisent +${piecePV}.`);
  }
  if (Number(machine.actor.bodyPV) + Number(machine.actor.declaredModulesPV) !== Number(machine.actor.sourceMaxPV)) {
    warnings.push(`PV max source ${machine.actor.sourceMaxPV} ≠ corps ${machine.actor.bodyPV} + modules annoncés ${machine.actor.declaredModulesPV}.`);
  }

  for (const p of machine.pieces ?? []) {
    const recoverable = !!p.detachable && !isChassisPiece(p) && p.recuperable !== false;
    if (!recoverable) continue;
    const loot = inferPieceLoot(machine, p);
    if (!loot) warnings.push(`Récupération non définie pour « ${p.name} ».`);
    else if (loot === "Fluide élémentaire") warnings.push(`Élément du fluide à préciser pour « ${p.name} ».`);
  }

  return warnings;
}

function versionParts(name) {
  const match = String(name ?? "").match(/\bv\s*(\d+(?:\.\d+)*)/i);
  return match ? match[1].split(".").map(n => Number(n) || 0) : [0];
}

function compareVersionParts(a, b) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

function newestTemplate(candidates) {
  const list = Array.from(candidates ?? []);
  list.sort((a, b) => {
    const byName = compareVersionParts(versionParts(b.name), versionParts(a.name));
    if (byName !== 0) return byName;
    const auv = Number(a.system?.templateSystemUniqueVersion ?? 0);
    const buv = Number(b.system?.templateSystemUniqueVersion ?? 0);
    return buv - auv;
  });
  return list[0] ?? null;
}

function normalizedTemplateName(name) {
  return String(name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasAllText(obj, keys) {
  return keys.every(key => hasText(obj, key));
}

function hasNodeWithKeyAndType(root, key, type=null) {
  const seen = new Set();
  const stack = [root];
  while (stack.length) {
    const value = stack.pop();
    if (!value || typeof value !== "object") continue;
    if (seen.has(value)) continue;
    seen.add(value);

    if (!Array.isArray(value)) {
      if (value.key === key && (!type || value.type === type)) return true;
      for (const child of Object.values(value)) stack.push(child);
    } else {
      for (const child of value) stack.push(child);
    }
  }
  return false;
}

function isMachineActorTemplate(template) {
  if (template?.type !== "_template") return false;
  const system = template.system ?? {};
  const requiredFields = [
    "H0D_Machine_Categorie",
    "H0D_Machine_Modele",
    "H0D_Machine_PV_Corps_Base",
    "H0D_Machine_DEF_Corps_Base",
    "H0D_Machine_Corps_Protection_Aff"
  ];
  if (!hasAllText(system, requiredFields)) return false;

  // Signature structurelle indispensable : un vrai template Machine doit posséder
  // les deux itemContainers qui accueillent les pièces et les attaques.
  const hasPieces = hasNodeWithKeyAndType(system, "H0D_Machine_Composants_Container", "itemContainer");
  const hasWeapons = hasNodeWithKeyAndType(system, "H0D_Machine_Armes_Container", "itemContainer");
  return hasPieces && hasWeapons;
}

function scoreItemTemplate(template, kind) {
  const name = normalizedTemplateName(template.name);
  const system = template.system ?? {};
  const expectedId = kind === "piece" ? "H0DCompMach00001" : "H0DWeaponMach001";

  if (template.type !== "_equippableItemTemplate") return -9999;

  if (kind === "piece") {
    const required = ["H0D_Composant_Type", "H0D_Composant_PV_Max", "H0D_Composant_Effet_Destruction", "H0D_Composant_Zone", "H0D_Composant_Protection_Corps"];
    if (!hasAllText(system, required)) return -9999;

    let score = 50;
    if (template.id === expectedId) score += 20;
    if (/composant|piece|detachable/.test(name)) score += 120;
    if (/machine/.test(name)) score += 20;
    // Un template d'arme générique peut contenir des clés de composant dans son système :
    // il ne doit jamais gagner uniquement grâce à ces clés ou à un ancien ID.
    if (/arme/.test(name) && !/composant|piece/.test(name)) score -= 180;
    return score;
  }

  const required = ["H0D_ArmeMachine_Mode", "H0D_ArmeMachine_Degats", "H0D_ArmeMachine_Recharge"];
  if (!hasAllText(system, required)) return -9999;

  let score = 50;
  if (template.id === expectedId) score += 20;
  if (/arme/.test(name) && /machine/.test(name)) score += 120;
  if (/weapon/.test(name) && /machine/.test(name)) score += 100;
  if (/composant|piece|detachable/.test(name)) score -= 180;
  return score;
}

function bestScoredTemplate(candidates, scoreFn, minimumScore=40) {
  const ranked = Array.from(candidates ?? [])
    .map(doc => ({doc, score: scoreFn(doc)}))
    .filter(x => x.score >= minimumScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const byName = compareVersionParts(versionParts(b.doc.name), versionParts(a.doc.name));
      if (byName !== 0) return byName;
      const auv = Number(a.doc.system?.templateSystemUniqueVersion ?? 0);
      const buv = Number(b.doc.system?.templateSystemUniqueVersion ?? 0);
      return buv - auv;
    });
  return ranked[0]?.doc ?? null;
}

function findItemTemplate(kind) {
  // Source prioritaire : H0D Template Manager. Le fallback structurel permet au
  // Builder de rester utilisable si le Manager est temporairement désactivé.
  const canonicalKey = kind === "piece" ? "item-piece" : "item-arme-machine";
  const canonical = canonicalTemplate(canonicalKey);
  if (canonical && scoreItemTemplate(canonical, kind) >= 40) return canonical;

  return bestScoredTemplate(game.items ?? [], t => scoreItemTemplate(t, kind));
}

function scoreMachineTemplate(template) {
  if (!isMachineActorTemplate(template)) return -9999;
  const name = normalizedTemplateName(template.name);

  // Un template PJ peut contenir quelques champs Machine pour l'affichage ou la DEF ;
  // il est explicitement rejeté même si sa structure évolue plus tard.
  if (/(^|[-_ ])pj($|[-_ ])|personnage|player/.test(name)) return -9999;

  let score = 100;
  if (template.id === "wRHfQ4gZbHTaYOsR") score += 20;
  if (/h0d[-_ ]*template[-_ ]*machine/.test(name)) score += 180;
  else if (/actor[-_ ]*template[-_ ]*machine/.test(name)) score += 150;
  else if (/template[-_ ]*machine|machine[-_ ]*template/.test(name)) score += 120;
  else if (/machine/.test(name)) score += 60;
  if (/creature/.test(name)) score -= 220;
  return score;
}

function findMachineTemplate() {
  const canonical = canonicalTemplate("actor-machine");
  if (canonical && isMachineActorTemplate(canonical)) return canonical;
  return bestScoredTemplate(game.actors ?? [], scoreMachineTemplate);
}

function detectedTemplatesText() {
  const piece = findItemTemplate("piece");
  const weapon = findItemTemplate("weapon");
  const machine = findMachineTemplate();
  return {
    piece: piece?.name ?? "Introuvable",
    weapon: weapon?.name ?? "Introuvable",
    machine: machine?.name ?? "Introuvable",
    source: templateManagerApi() ? "H0D Template Manager" : "détection locale de secours"
  };
}

async function ensureComponentPack() {
  let pack = Array.from(game.packs ?? []).find(p => p.documentName === "Item" && p.title === COMPONENT_PACK_LABEL);
  if (!pack) {
    pack = await foundry.documents.collections.CompendiumCollection.createCompendium({label: COMPONENT_PACK_LABEL, type: "Item"});
  }
  if (pack.locked) { try { await pack.configure({locked:false}); } catch (_) {} }
  await pack.getIndex();
  return pack;
}

async function ensurePackFolder(pack, name, parentId=null) {
  await pack.getIndex();
  const folders = pack.folders ? Array.from(pack.folders) : [];
  const existing = folders.find(f => f.name === name && String(f.folder?.id ?? f.folder ?? "") === String(parentId ?? ""));
  if (existing) return existing;
  const [created] = await Folder.implementation.createDocuments([{name, type:"Item", folder:parentId}], {pack:pack.collection});
  return created;
}

async function ensureWorldActorFolder(name, parentId=null) {
  const existing = Array.from(game.folders ?? []).find(f => f.type === "Actor" && f.name === name && String(f.folder?.id ?? f.folder ?? "") === String(parentId ?? ""));
  if (existing) return existing;
  const [created] = await Folder.implementation.createDocuments([{name, type:"Actor", folder:parentId}]);
  return created;
}

function inferPieceZone(p) {
  if (p?.zone) return p.zone;
  const text = `${p?.name ?? ""} ${p?.location ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (/tete|gorge|machoire|mandib|corne|cran|oeil|capteur frontal/.test(text)) return "Tete";
  if (/arriere|queue|croupe|rear/.test(text)) return "Arriere";
  if (/ventre|ventral|abdomen/.test(text)) return "Ventre";
  if (/dos|dorsal/.test(text)) return "Dos";
  if (/avant|front|epaule/.test(text)) return "Avant";
  if (/patte/.test(text)) {
    if (/avant/.test(text)) return "Avant";
    if (/arriere/.test(text)) return "Arriere";
    return "Central";
  }
  if (/chassis|structure|blindage|plaque|carapace|flanc/.test(text)) return "Central";
  return "Autre";
}

function inferBodyProtection(p) {
  if (typeof p?.protectsBody === "boolean") return p.protectsBody;
  const text = `${p?.name ?? ""} ${p?.type ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return Number(p?.bonusDef || 0) > 0 || /chassis|blindage|plaque|carapace/.test(text);
}

function isChassisPiece(p) {
  const name = `${p?.name ?? ""} ${p?.type ?? ""}`;
  return /chassis/i.test(name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
}

function normPartText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function inferElementalFluid(p) {
  const text = normPartText([
    p?.name, p?.type, p?.location, p?.effect, p?.note,
    p?.explosion?.type, p?.element
  ].filter(Boolean).join(" "));

  if (/blaze|\bfeu\b/.test(text)) return "Fluide élémentaire — Blaze";
  if (/chillwater|cryo|cryogen|\bgel\b|froid/.test(text)) return "Fluide élémentaire — Chillwater";
  if (/metalburn|acide|corrosion/.test(text)) return "Fluide élémentaire — Metalburn";
  if (/sparker|\bchoc\b|electrique|electrique/.test(text)) return "Fluide élémentaire — Sparker";
  return "";
}

function inferMachineCoreLoot(machine) {
  const category = normPartText(machine?.actor?.category);
  if (/petite/.test(category)) return "Noyau de petite machine";
  if (/moyenne/.test(category)) return "Noyau de machine moyenne";
  if (/lourde|titan|prototype/.test(category)) return "Noyau de machine lourde";
  return "Noyau de machine";
}

function inferPieceLoot(machine, p) {
  const explicit = String(p?.loot ?? "").trim();
  if (explicit) return explicit;

  if (!p?.detachable || p?.recuperable === false || isChassisPiece(p)) return "";

  const type = normPartText(p?.type);
  const text = normPartText([
    p?.name, p?.type, p?.location, p?.effect, p?.note,
    p?.explosion?.type, p?.element
  ].filter(Boolean).join(" "));

  // Cœurs / noyaux.
  if (type === "noyau" || /\bcoeur\b|\bnoyau\b/.test(text)) {
    return inferMachineCoreLoot(machine);
  }

  // Réservoirs / bonbonnes / poches élémentaires.
  if (type === "reservoir" || /reservoir|bonbonne|poche elementaire|sac elementaire/.test(text)) {
    return inferElementalFluid(p) || "Fluide élémentaire";
  }

  // Éléments souples / stabilisateurs / câblages.
  if (/stabilisateur|cablage|cable|fibre|filament|faisceau|tendon|souple/.test(text)) {
    return "Fibres synthétiques";
  }

  // Batteries / réacteurs / générateurs.
  if (type === "generateur" || type === "moteur" || /batterie|reacteur|generateur|accumulateur/.test(text)) {
    return "Cellule d’énergie faible";
  }

  // Optiques / radars / capteurs visuels.
  if (/oeil|optique|radar|lentille|capteur frontal|capteur de materiaux|capteur de charognard|tete capteur/.test(text)) {
    return "Lentilles optiques";
  }

  // Électronique / modules / relais / balises / émetteurs.
  if (/circuit|relais|electronique|module|balise|emetteur|recepteur|interface|signal|alerte/.test(text)) {
    return "Circuit ancien abîmé";
  }

  // Un capteur générique restant est traité comme une optique simple.
  if (type === "capteur") return "Lentilles optiques";

  // Structures rigides / griffes / plaques / membres.
  if (["structure","mobilite","blindage"].includes(type)
      || /structure|griffe|plaque|blindage|membre|patte|aile|carapace|coque|armature|corne|lance/.test(text)) {
    return "Plaques métalliques";
  }

  return "";
}

function pieceEntry(machineKey, machine, p) {
  const recoverable = !!p.detachable && !isChassisPiece(p) && p.recuperable !== false;
  const inferredLoot = recoverable ? inferPieceLoot(machine, p) : "";

  const explosion = p.explosion
    ? {
        type:p.explosion.type ?? "Aucune",
        dmg:p.explosion.dmg ?? "",
        radius:Number(p.explosion.radius || 0),
        dc:Number(p.explosion.dc ?? 15)
      }
    : p.blaze
      ? {type:"Feu", dmg:"1d6", radius:1.5, dc:12}
      : {type:"Aucune", dmg:"", radius:0, dc:15};

  const props = {
    H0D_Composant_Type: p.type,
    H0D_Composant_Emplacement: p.location,
    H0D_Composant_Zone: inferPieceZone(p),
    H0D_Composant_Origine: machine.label,
    H0D_Composant_Etat: "Intact",
    H0D_Composant_Destructible: true,
    H0D_Composant_Detachable: !!p.detachable,
    H0D_Composant_Recuperable: recoverable,
    H0D_Composant_Loot: inferredLoot,
    H0D_Composant_Valeur: Number(p.lootValue ?? 0),
    H0D_Composant_Marquee: false,
    H0D_Composant_Compte_PV: !!p.countPV,
    H0D_Composant_Protection_Corps: inferBodyProtection(p),
    H0D_Composant_PV_Actuels: Number(p.pv),
    H0D_Composant_PV_Max: Number(p.pv),
    H0D_Composant_DEF_Base: Number(p.def),
    H0D_Composant_Bonus_DEF_Machine: Number(p.bonusDef || 0),
    H0D_Composant_DD_Demontage: Number(p.ddDemontage ?? 15),
    H0D_Composant_DD_Detachement: Number(p.ddDetachement ?? 15),
    H0D_Composant_Effet_Destruction: p.effect ?? "",
    H0D_Composant_Effet_Detachement: p.detachEffect ?? "",
    H0D_Composant_Explosion_Type: explosion.type,
    H0D_Composant_Explosion_Degats: explosion.dmg,
    H0D_Composant_Explosion_Rayon: explosion.radius,
    H0D_Composant_Explosion_DD: explosion.dc,
    H0D_Composant_Notes: p.note ?? "",
    H0D_Composant_Malus_Perception_Destruction: Number(p.malusPerception || 0),
    H0D_Composant_Malus_Vitesse_Destruction: Number(p.malusSpeed || 0)
  };

  return {name:p.name, props, machineKey, kind:"piece"};
}

function weaponEntry(machineKey, machine, w) {
  const shotsMax = Number(w.shotsMax ?? 0);
  return {name:w.name, machineKey, kind:"weapon", props:{
    H0D_ArmeMachine_Mode: w.mode,
    H0D_ArmeMachine_Type: w.type,
    H0D_ArmeMachine_Origine: machine.label,
    H0D_ArmeMachine_Etat: "Intacte",
    H0D_ArmeMachine_Detachable: false,
    // Les armes/attaques sont affichées dans la machine mais ne contribuent jamais à ses PV globaux.
    H0D_ArmeMachine_Compte_PV: false,
    H0D_ArmeMachine_Marquee: false,
    H0D_ArmeMachine_Attaque_Speciale: !!w.special,
    H0D_ArmeMachine_PV_Actuels: 1,
    H0D_ArmeMachine_PV_Max: 1,
    H0D_ArmeMachine_DEF_Base: 10,
    H0D_ArmeMachine_Bonus_Attaque: 0,
    H0D_ArmeMachine_Degats: w.dmg,
    H0D_ArmeMachine_Type_Degats: w.dmgType,
    H0D_ArmeMachine_Element: w.element ?? "Aucun",
    H0D_ArmeMachine_Portee: String(w.range ?? 0),
    H0D_ArmeMachine_Zone: w.zone ?? "",
    H0D_ArmeMachine_Recharge: Number(w.recharge || 0),
    H0D_ArmeMachine_Recharge_Compteur: 0,
    H0D_ArmeMachine_Tirs_Max: shotsMax,
    H0D_ArmeMachine_Tirs_Restants: Number(w.shotsRemaining ?? shotsMax),
    H0D_ArmeMachine_Effet_Destruction: w.destroyEffect ?? "",
    H0D_ArmeMachine_Effet_Detachement: w.detachEffect ?? "",
    H0D_ArmeMachine_Effet_Special: w.effect ?? "",
    H0D_ArmeMachine_Notes: w.note ?? ""
  }};
}

function systemFromItemTemplate(template, props) {
  const system = clone(template.system ?? {});
  system.props = clone(props);
  system.template = template.id;
  system.templateSystemUniqueVersion = Number(template.system?.templateSystemUniqueVersion ?? 0);
  if (Object.prototype.hasOwnProperty.call(system, "uniqueId")) system.uniqueId = foundry.utils.randomID();
  return system;
}

function itemData(template, entry, folderId=null) {
  return {
    name: entry.name,
    type: "equippableItem",
    img: template.img || "icons/svg/item-bag.svg",
    folder: folderId,
    system: systemFromItemTemplate(template, entry.props),
    flags: {[MODULE_ID]: {generated:true, machineKey:entry.machineKey, kind:entry.kind, sourceTemplateId:template.id}}
  };
}

function templateUniqueVersion(template) {
  return Number(template?.system?.templateSystemUniqueVersion ?? 0);
}

async function forceItemTemplateAndProps(doc, template, props) {
  if (!doc) return;

  // Phase 1 : synchroniser la structure du template. CSB peut initialiser/réinitialiser
  // les props à cette étape, on ne lui confie donc pas les valeurs finales ici.
  const baseSystem = clone(template.system ?? {});
  baseSystem.template = template.id;
  baseSystem.templateSystemUniqueVersion = templateUniqueVersion(template);
  if (Object.prototype.hasOwnProperty.call(baseSystem, "uniqueId")) {
    baseSystem.uniqueId = doc.system?.uniqueId || foundry.utils.randomID();
  }
  await doc.update({system: baseSystem});

  // Phase 2 : réinjecter les valeurs H0D après la synchronisation CSB.
  await doc.update({
    "system.template": template.id,
    "system.templateSystemUniqueVersion": templateUniqueVersion(template),
    "system.props": clone(props)
  });

  // Sécurité ciblée : sur les attaques spéciales, le checkbox doit être réellement coché
  // après l'initialisation du template, même si CSB avait appliqué son defaultChecked=false.
  if (Object.prototype.hasOwnProperty.call(props, "H0D_ArmeMachine_Attaque_Speciale")) {
    await doc.update({
      "system.props.H0D_ArmeMachine_Attaque_Speciale": props.H0D_ArmeMachine_Attaque_Speciale === true
    });
  }
}

async function upsertPackItem(pack, data, mode, template, props) {
  const docs = Array.from(await pack.getDocuments());
  const targetKey = data.flags?.[MODULE_ID]?.machineKey ?? null;
  const targetKind = data.flags?.[MODULE_ID]?.kind ?? null;
  const aliases = targetKey ? machineKeyAliases(targetKey) : [];
  const existing = docs.find(d => {
    const generatedMatch = aliases.includes(d.getFlag(MODULE_ID, "machineKey"))
      && d.getFlag(MODULE_ID, "kind") === targetKind
      && d.name === data.name;
    const folderMatch = d.name === data.name
      && String(d.folder?.id ?? d.folder ?? "") === String(data.folder ?? "");
    return generatedMatch || folderMatch;
  });

  if (!existing) {
    const [created] = await Item.implementation.createDocuments([data], {pack:pack.collection});
    await forceItemTemplateAndProps(created, template, props);
    return "created";
  }
  if (mode === "skip") return "skipped";
  if (mode === "replace") {
    await existing.delete();
    const [created] = await Item.implementation.createDocuments([data], {pack:pack.collection});
    await forceItemTemplateAndProps(created, template, props);
    return "replaced";
  }

  // Update : l'image personnalisée n'est jamais touchée.
  await existing.update({
    name:data.name,
    folder:data.folder,
    flags:foundry.utils.mergeObject(clone(existing.flags ?? {}), data.flags, {inplace:false, overwrite:true})
  });
  await forceItemTemplateAndProps(existing, template, props);
  return "updated";
}

async function generateLibraryOne(machineKey, mode="update") {
  const machine = MACHINES[machineKey];
  if (!machine) throw new Error(`Machine inconnue : ${machineKey}`);

  const pieceTemplate = findItemTemplate("piece");
  const weaponTemplate = findItemTemplate("weapon");
  if (!pieceTemplate) throw new Error("Template Pièce détachable introuvable (H0DCompMach00001).");
  if (!weaponTemplate) throw new Error("Template Arme machine introuvable (H0DWeaponMach001).");

  const pack = await ensureComponentPack();
  const machineFolder = await ensurePackFolder(pack, machine.label);
  const pieceFolder = await ensurePackFolder(pack, "Pièces", machineFolder.id);
  const weaponFolder = await ensurePackFolder(pack, "Armes", machineFolder.id);

  const stats = {created:0, updated:0, replaced:0, skipped:0};
  for (const p of machine.pieces) {
    const entry = pieceEntry(machineKey, machine, p);
    const result = await upsertPackItem(pack, itemData(pieceTemplate, entry, pieceFolder.id), mode, pieceTemplate, entry.props);
    stats[result]++;
  }
  for (const w of machine.weapons) {
    const entry = weaponEntry(machineKey, machine, w);
    const result = await upsertPackItem(pack, itemData(weaponTemplate, entry, weaponFolder.id), mode, weaponTemplate, entry.props);
    stats[result]++;
  }

  await pack.getIndex({fields:["name","folder","img"]});
  return {pack, stats};
}

function canonicalEntryMap(machineKey) {
  const machine = MACHINES[machineKey];
  if (!machine) return new Map();
  const entries = [
    ...(machine.pieces ?? []).map(p => pieceEntry(machineKey, machine, p)),
    ...(machine.weapons ?? []).map(w => weaponEntry(machineKey, machine, w))
  ];
  return new Map(entries.map(entry => [`${entry.kind}::${entry.name}`, entry]));
}

async function repairEmbeddedMissingOne(machineKey) {
  const machine = MACHINES[machineKey];
  if (!machine) throw new Error(`Machine inconnue : ${machineKey}`);

  const aliases = machineKeyAliases(machineKey);
  const actor = Array.from(game.actors ?? []).find(a =>
    aliases.includes(a.getFlag(MODULE_ID,"machineKey")) &&
    a.getFlag(MODULE_ID,"blueprint") === true
  );

  if (!actor) return {actors:0, items:0, props:0, skipped:0};

  const canonical = canonicalEntryMap(machineKey);
  const stats = {actors:1, items:0, props:0, skipped:0};

  for (const item of actor.items ?? []) {
    if (item.getFlag(MODULE_ID,"generated") !== true) continue;
    const itemMachineKey = item.getFlag(MODULE_ID,"machineKey");
    if (!aliases.includes(itemMachineKey)) continue;

    const kind = item.getFlag(MODULE_ID,"kind");
    const entry = canonical.get(`${kind}::${item.name}`);
    if (!entry) {
      stats.skipped++;
      continue;
    }

    const current = item.system?.props ?? {};
    const update = {};
    let added = 0;

    // Sécurité : compléter uniquement les clés totalement absentes.
    // Jamais d'écrasement des PV actuels, états, marquages, recharges ou valeurs modifiées en jeu.
    for (const [key,value] of Object.entries(entry.props)) {
      if (Object.prototype.hasOwnProperty.call(current,key)) continue;
      update[`system.props.${key}`] = clone(value);
      added++;
    }

    if (!added) continue;
    await item.update(update);
    stats.items++;
    stats.props += added;
  }

  return stats;
}

async function repairEmbeddedMissingSelection(machineSelection) {
  const keys = selectionKeys(machineSelection);
  const total = {actors:0, items:0, props:0, skipped:0};

  for (const key of keys) {
    // La bibliothèque sert de source canonique et reçoit d'abord les définitions complètes.
    await generateLibraryOne(key, "update");
    const stats = await repairEmbeddedMissingOne(key);
    for (const field of Object.keys(total)) total[field] += Number(stats[field] || 0);
  }

  return total;
}

function actorProps(machine) {
  const a = machine.actor;
  const warnings = machineWarnings(machine);
  const warningText = warnings.length ? `\n\n⚠ VALIDATION SOURCE : ${warnings.join(" ")}` : "";
  return {
    H0D_Machine_Categorie: a.category,
    H0D_Machine_Variante: a.variant,
    H0D_Machine_Niveau_Menace: a.threat,
    H0D_Machine_Role: a.role,
    H0D_Machine_Modele: a.model,
    H0D_Machine_Origine: a.origin,
    H0D_Machine_Comportement: a.behavior,
    H0D_Machine_PV_Corps_Base: a.bodyPV,
    H0D_Machine_PV_Actuels: a.sourceMaxPV,
    H0D_Machine_DEF_Corps_Base: a.defense,
    H0D_Machine_Attaque_Base: a.attack,
    H0D_Machine_Initiative: a.initiative,
    H0D_Machine_Vitesse_Base: a.speed,
    H0D_Machine_Vigueur: a.fortitude,
    H0D_Machine_Reflexes: a.reflex,
    H0D_Machine_Volonte: a.will,
    H0D_Machine_DD_Capacites: a.abilityDC,
    H0D_Machine_Mod_Attaque_Temp: 0,
    H0D_Machine_Mod_DEF_Temp: 0,
    H0D_Machine_Mod_Perception_Temp: 0,
    H0D_Machine_Mod_Vitesse_Temp: 0,
    H0D_Machine_Etat_Marquee: false,
    H0D_Machine_Etat_Ralentie: false,
    H0D_Machine_Etat_Aveuglee: false,
    H0D_Machine_Etat_Brouillee: false,
    H0D_Machine_Etat_Surchargee: false,
    H0D_Machine_Scan_DD: a.scanDC,
    H0D_Machine_Piratable: !!a.hackable,
    H0D_Machine_Piratage_DD_Base: a.hackDC,
    H0D_Machine_Scan_Simple: a.focus,
    H0D_Machine_Faiblesses: a.weaknesses,
    H0D_Machine_Immunites: a.immunities,
    H0D_Machine_Notes_MJ: `${a.notes}${warningText}

Système Intégrité v2 : corps protégé = dégâts directs /2 ; corps exposé = dégâts normaux ; overkill d'une pièce = 50 % vers une seule pièce active de la même zone, sans cascade ; sans pièce adjacente valide, le report est perdu.`
  };
}


function tokenDimensionsForMachine(machine) {
  const actor = machine?.actor ?? {};
  const explicit = actor.tokenSize;

  if (Number.isFinite(Number(explicit)) && Number(explicit) > 0) {
    const n = Number(explicit);
    return {width:n, height:n};
  }

  if (explicit && typeof explicit === "object") {
    const width = Number(explicit.width);
    const height = Number(explicit.height);
    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      return {width, height};
    }
  }

  if (actor.category === "Prototype") {
    throw new Error(
      `${machine.label} : la catégorie Prototype / boss exige une taille de token explicite ` +
      `dans actor.tokenSize (ex. 4 ou {width:4,height:5}).`
    );
  }

  const size = TOKEN_SIZE_BY_CATEGORY[actor.category];
  if (!size) {
    throw new Error(
      `${machine.label} : catégorie machine inconnue pour la taille de token : ` +
      `${actor.category ?? "∅"}.`
    );
  }

  return {width:size, height:size};
}

async function applyCanonicalPrototypeTokenSize(actor, machine) {
  const {width, height} = tokenDimensionsForMachine(machine);
  await actor.update({
    "prototypeToken.width": width,
    "prototypeToken.height": height,
    [`flags.${MODULE_ID}.tokenWidth`]: width,
    [`flags.${MODULE_ID}.tokenHeight`]: height
  });
  return {width, height};
}

async function syncPlacedTokensToCanonicalSize(actor, machine) {
  if (!game.user?.isGM || !actor?.id) return 0;

  const {width, height} = tokenDimensionsForMachine(machine);
  let changed = 0;

  for (const scene of game.scenes ?? []) {
    const updates = [];
    for (const token of scene.tokens ?? []) {
      if (token.actorId !== actor.id) continue;
      if (Number(token.width) === width && Number(token.height) === height) continue;
      updates.push({_id: token.id, width, height});
    }
    if (updates.length) {
      await scene.updateEmbeddedDocuments("Token", updates);
      changed += updates.length;
    }
  }

  return changed;
}

function actorDataFromTemplate(template, machineKey, machine, folderId) {
  const system = clone(template.system ?? {});
  // La structure est créée depuis le template ; les valeurs finales sont injectées
  // dans une seconde phase après que CSB a terminé son initialisation.
  system.template = template.id;
  system.templateSystemUniqueVersion = templateUniqueVersion(template);

  const prototypeToken = clone(template.prototypeToken ?? {});
  const tokenSize = tokenDimensionsForMachine(machine);
  prototypeToken.name = machine.label;
  prototypeToken.actorLink = false;
  prototypeToken.width = tokenSize.width;
  prototypeToken.height = tokenSize.height;

  return {
    name: `${machine.label} — Menace ${Number(machine.actor.threat)}`,
    type: "character",
    img: template.img || "systems/custom-system-builder/img/template-logo.svg",
    folder: folderId,
    system,
    prototypeToken,
    flags: {[MODULE_ID]: {generated:true, machineKey, threat:Number(machine.actor.threat), blueprint:true, sourceTemplateId:template.id}}
  };
}

async function forceActorTemplateAndProps(actor, template, machine) {
  if (!actor) return;

  const baseSystem = clone(template.system ?? {});
  baseSystem.template = template.id;
  baseSystem.templateSystemUniqueVersion = templateUniqueVersion(template);
  await actor.update({
    system: baseSystem,
    "flags.h0d-machine-builder.generated": true,
    "flags.h0d-machine-builder.machineKey": actor.getFlag(MODULE_ID, "machineKey") || null,
    "flags.h0d-machine-builder.threat": Number(machine.actor.threat),
    "flags.h0d-machine-builder.blueprint": true,
    "flags.h0d-machine-builder.sourceTemplateId": template.id
  });

  await actor.update({
    "system.template": template.id,
    "system.templateSystemUniqueVersion": templateUniqueVersion(template),
    "system.props": actorProps(machine)
  });
}

function propsEquivalent(actual, expected) {
  if (typeof expected === "boolean") return actual === expected || String(actual) === String(expected);
  if (typeof expected === "number") return Number(actual) === expected;
  return String(actual ?? "") === String(expected ?? "");
}

function verifyGeneratedActor(actor, machine) {
  const expected = actorProps(machine);
  const actual = actor.system?.props ?? {};
  const keys = [
    "H0D_Machine_Modele",
    "H0D_Machine_Niveau_Menace",
    "H0D_Machine_PV_Corps_Base",
    "H0D_Machine_DEF_Corps_Base",
    "H0D_Machine_Attaque_Base",
    "H0D_Machine_Initiative",
    "H0D_Machine_Vigueur",
    "H0D_Machine_Reflexes",
    "H0D_Machine_DD_Capacites"
  ];
  const errors = keys
    .filter(key => !propsEquivalent(actual[key], expected[key]))
    .map(key => `${key}: attendu ${expected[key]}, obtenu ${actual[key] ?? "∅"}`);

  const expectedToken = tokenDimensionsForMachine(machine);
  const actualWidth = Number(actor.prototypeToken?.width ?? 0);
  const actualHeight = Number(actor.prototypeToken?.height ?? 0);

  if (actualWidth !== expectedToken.width || actualHeight !== expectedToken.height) {
    errors.push(
      `Token : attendu ${expectedToken.width}×${expectedToken.height}, ` +
      `obtenu ${actualWidth}×${actualHeight}`
    );
  }

  return errors;
}

function verifyEmbeddedItems(actor, machine, machineKey) {
  const aliases = machineKeyAliases(machineKey);
  const generated = Array.from(actor.items ?? []).filter(i =>
    aliases.includes(i.getFlag(MODULE_ID, "machineKey")) && i.getFlag(MODULE_ID, "generated") === true
  );
  const errors = [];
  const expectedCount = machine.pieces.length + machine.weapons.length;
  if (generated.length !== expectedCount) {
    errors.push(`Items embarqués : attendu ${expectedCount}, obtenu ${generated.length}`);
  }

  const pieceTemplate = findItemTemplate("piece");
  const weaponTemplate = findItemTemplate("weapon");

  for (const piece of machine.pieces) {
    const item = generated.find(i =>
      i.getFlag(MODULE_ID, "kind") === "piece" &&
      i.name === piece.name
    );
    if (!item) {
      errors.push(`Pièce absente : ${piece.name}`);
      continue;
    }
    if (pieceTemplate && item.system?.template !== pieceTemplate.id) {
      errors.push(
        `Mauvais template pour la pièce ${piece.name} : ` +
        `${item.system?.template ?? "∅"} au lieu de ${pieceTemplate.id}`
      );
    }
    const pp = item.system?.props ?? {};
    const expectedZone = inferPieceZone(piece);
    const expectedProtection = inferBodyProtection(piece);
    if (String(pp.H0D_Composant_Zone ?? "") !== expectedZone) {
      errors.push(`Zone anatomique ${piece.name} : attendu ${expectedZone}, obtenu ${pp.H0D_Composant_Zone ?? "∅"}`);
    }
    if (pp.H0D_Composant_Protection_Corps !== expectedProtection) {
      errors.push(`Protection corps ${piece.name} : attendu ${expectedProtection}, obtenu ${pp.H0D_Composant_Protection_Corps ?? "∅"}`);
    }
  }

  for (const weapon of machine.weapons) {
    const item = generated.find(i =>
      i.getFlag(MODULE_ID, "kind") === "weapon" &&
      i.name === weapon.name
    );
    if (!item) {
      errors.push(`Arme/attaque absente : ${weapon.name}`);
      continue;
    }
    if (weaponTemplate && item.system?.template !== weaponTemplate.id) {
      errors.push(
        `Mauvais template pour l'arme ${weapon.name} : ` +
        `${item.system?.template ?? "∅"} au lieu de ${weaponTemplate.id}`
      );
    }

    if (weapon.special) {
      const checked = item.system?.props?.H0D_ArmeMachine_Attaque_Speciale === true;
      if (!checked) errors.push(`Case Attaque spéciale non cochée : ${weapon.name}`);
    }
  }

  return errors;
}

function cleanEmbeddedItemData(doc) {
  const data = doc.toObject();
  delete data._id;
  delete data.folder;
  delete data.sort;
  delete data.ownership;
  delete data._stats;
  return data;
}

async function libraryDocsForMachine(machineKey) {
  const pack = await ensureComponentPack();
  const docs = Array.from(await pack.getDocuments());
  const machine = MACHINES[machineKey];
  if (!machine) return [];
  const pieceNames = new Set(machine.pieces.map(p => p.name));
  const weaponNames = new Set(machine.weapons.map(w => w.name));
  const aliases = machineKeyAliases(machineKey);

  const compatible = docs.filter(d => {
    if (!aliases.includes(d.getFlag(MODULE_ID, "machineKey"))) return false;
    const kind = d.getFlag(MODULE_ID,"kind");
    if (kind === "piece") return pieceNames.has(d.name);
    if (kind === "weapon") return weaponNames.has(d.name);
    return false;
  });

  // Une ancienne migration peut avoir laissé un doublon sous une clé historique.
  // On n'embarque qu'une entrée par couple type+nom, en préférant la clé courante.
  compatible.sort((a, b) => {
    const ac = a.getFlag(MODULE_ID, "machineKey") === machineKey ? 0 : 1;
    const bc = b.getFlag(MODULE_ID, "machineKey") === machineKey ? 0 : 1;
    return ac - bc;
  });
  const unique = new Map();
  for (const doc of compatible) {
    const sig = `${doc.getFlag(MODULE_ID,"kind")}::${doc.name}`;
    if (!unique.has(sig)) unique.set(sig, doc);
  }
  return Array.from(unique.values());
}

async function assembleMachineOne(machineKey, mode="update") {
  const machine = MACHINES[machineKey];
  if (!machine) throw new Error(`Machine inconnue : ${machineKey}`);
  const machineTemplate = findMachineTemplate();
  if (!machineTemplate) {
    throw new Error(
      "Template Machine valide introuvable. Le template doit contenir les itemContainers " +
      "H0D_Machine_Composants_Container et H0D_Machine_Armes_Container."
    );
  }

  // Synchronise d'abord la bibliothèque : stats à jour, images personnalisées conservées.
  await generateLibraryOne(machineKey, "update");

  const rootFolder = await ensureWorldActorFolder(WORLD_MACHINE_FOLDER);
  const threatFolder = await ensureWorldActorFolder(threatFolderName(machine), rootFolder.id);

  const aliases = machineKeyAliases(machineKey);
  let actor = Array.from(game.actors ?? []).find(a => aliases.includes(a.getFlag(MODULE_ID,"machineKey")) && a.getFlag(MODULE_ID,"blueprint") === true);

  if (actor && mode === "skip") return {action:"skipped", actor};
  if (actor && mode === "replace") {
    await actor.delete();
    actor = null;
  }

  const wasExisting = !!actor;
  if (!actor) {
    const [created] = await Actor.implementation.createDocuments([actorDataFromTemplate(machineTemplate, machineKey, machine, threatFolder.id)]);
    actor = created;
    await actor.setFlag(MODULE_ID, "machineKey", machineKey);
  } else {
    const generatedItems = Array.from(actor.items ?? []).filter(i => aliases.includes(i.getFlag(MODULE_ID,"machineKey")) && i.getFlag(MODULE_ID,"generated") === true);
    if (generatedItems.length) await actor.deleteEmbeddedDocuments("Item", generatedItems.map(i => i.id));
  }

  // Important : template d'abord, valeurs ensuite. Cela évite que CSB remette les valeurs
  // par défaut du template après la création/migration de l'Actor.
  await forceActorTemplateAndProps(actor, machineTemplate, machine);
  await actor.update({
    name:`${machine.label} — Menace ${Number(machine.actor.threat)}`,
    folder:threatFolder.id,
    "prototypeToken.name":machine.label,
    [`flags.${MODULE_ID}.machineKey`]:machineKey
  });

  // v0.6.0 : la catégorie H0D pilote désormais l'empreinte du token.
  const canonicalTokenSize = await applyCanonicalPrototypeTokenSize(actor, machine);

  const sourceDocs = await libraryDocsForMachine(machineKey);
  if (!sourceDocs.length) throw new Error(`Aucun Item de bibliothèque trouvé pour ${machine.label}.`);
  const embeddedData = sourceDocs.map(cleanEmbeddedItemData);
  const createdEmbedded = await actor.createEmbeddedDocuments("Item", embeddedData);

  // IMPORTANT v0.5.1 :
  // Foundry/CSB ne garantit pas que createEmbeddedDocuments renvoie les Items dans
  // le même ordre que le tableau source (notamment lorsqu'ils sont dispatchés dans
  // plusieurs itemContainers). Une correspondance par index peut donc transformer
  // une pièce en arme et inversement.
  //
  // On remappe désormais chaque Item par une identité stable : kind + nom.
  const sourceBySignature = new Map(
    sourceDocs.map(source => [
      `${source.getFlag(MODULE_ID, "kind")}::${source.name}`,
      source
    ])
  );

  for (const embedded of createdEmbedded) {
    if (!embedded) continue;

    const kind = embedded.getFlag(MODULE_ID, "kind");
    const signature = `${kind}::${embedded.name}`;
    const source = sourceBySignature.get(signature);

    if (!source) {
      throw new Error(
        `${machine.label} : impossible de retrouver la source de l'Item embarqué ` +
        `"${embedded.name}" (${kind ?? "type inconnu"}).`
      );
    }

    const sourceTemplate = kind === "piece"
      ? findItemTemplate("piece")
      : kind === "weapon"
        ? findItemTemplate("weapon")
        : null;

    if (!sourceTemplate) {
      throw new Error(
        `${machine.label} : template embarqué introuvable pour "${embedded.name}" (${kind}).`
      );
    }

    await forceItemTemplateAndProps(
      embedded,
      sourceTemplate,
      clone(source.system?.props ?? {})
    );
  }

  // Les PV actuels sont remplis à la fin, une fois les composants effectivement embarqués.
  await actor.update({"system.props.H0D_Machine_PV_Actuels": Number(machine.actor.sourceMaxPV)});

  const mismatches = verifyGeneratedActor(actor, machine);
  const embeddedMismatches = verifyEmbeddedItems(actor, machine, machineKey);
  const allMismatches = [...mismatches, ...embeddedMismatches];
  if (allMismatches.length) {
    throw new Error(`${machine.label} : vérification post-génération échouée — ${allMismatches.join(" ; ")}`);
  }

  const resizedSceneTokens = await syncPlacedTokensToCanonicalSize(actor, machine);

  const warnings = machineWarnings(machine);
  if (warnings.length) notify("warn", `${machine.label} : ${warnings.join(" ")}`);

  if (resizedSceneTokens > 0) {
    notify(
      "info",
      `${machine.label} : ${resizedSceneTokens} token(s) déjà placé(s) synchronisé(s) ` +
      `en ${canonicalTokenSize.width}×${canonicalTokenSize.height}.`
    );
  }

  return {action: wasExisting ? "assembled" : "created", actor};
}

function mergeStats(total, add) {
  for (const k of ["created","updated","replaced","skipped"]) total[k] = (total[k] || 0) + (add[k] || 0);
  return total;
}

async function runAction(action, machineSelection, mode) {
  const keys = selectionKeys(machineSelection);

  if (action === "library") {
    const total = {created:0, updated:0, replaced:0, skipped:0};
    let pack = null;
    for (const key of keys) {
      const result = await generateLibraryOne(key, mode);
      pack = result.pack;
      mergeStats(total, result.stats);
      for (const w of machineWarnings(MACHINES[key])) notify("warn", `${MACHINES[key].label} : ${w}`);
    }
    notify("info", `H0D : bibliothèque terminée — ${total.created} créé(s), ${total.updated} mis à jour, ${total.replaced} recréé(s), ${total.skipped} ignoré(s).`);
    pack?.render(true);
    return;
  }

  if (action === "repair-missing") {
    const total = await repairEmbeddedMissingSelection(machineSelection);
    notify(
      "info",
      `H0D : synchronisation non destructive terminée — ${total.actors} machine(s), ${total.items} Item(s), ${total.props} champ(s) ajouté(s), ${total.skipped} entrée(s) non reconnue(s).`
    );
    return;
  }

  let count = 0;
  for (const key of keys) {
    const result = await assembleMachineOne(key, mode);
    if (result.action !== "skipped") count++;
  }
  notify("info", `H0D : assemblage terminé — ${count} machine(s) préparée(s) dans Acteurs > ${WORLD_MACHINE_FOLDER}, classées par niveau de Menace.`);
}


/** Garde la fenêtre ouverte entre deux générations, tout en sérialisant les clics. */
async function h0dPersistentDialog(options,run) {
  const Dialog=foundry.applications.api.DialogV2;
  await Dialog.wait({
    window:options.window,
    content:options.content+
      '<div class="h0d-batch-controls" style="margin-top:10px;display:flex;gap:8px;align-items:center;">'+
      '<button type="button" data-h0d-batch-run><i class="fa-solid fa-gears"></i> Exécuter</button>'+
      '<small data-h0d-batch-status aria-live="polite">Prêt à générer plusieurs éléments.</small></div>',
    buttons:[{action:"close",label:"Fermer",icon:"fa-solid fa-xmark"}],
    rejectClose:false,
    render:(_event,dialog)=>{
      const root=dialog.element,button=root?.querySelector("[data-h0d-batch-run]"),
        status=root?.querySelector("[data-h0d-batch-status]");
      if(!button||!status||button.dataset.bound==="yes")return;
      button.dataset.bound="yes";
      let busy=false;
      button.addEventListener("click",async()=>{
        if(busy)return;
        const form=root.querySelector("form");
        if(!form)return;
        const input=Object.fromEntries(new FormData(form).entries());
        busy=true;button.disabled=true;
        const close=root.querySelector('[data-action="close"]');
        if(close)close.disabled=true;
        status.textContent="Opération en cours…";
        try{
          await run(input);
          status.textContent="Terminé. Tu peux générer un autre élément.";
        }catch(err){
          console.error("H0D | génération",err);
          status.textContent="Erreur : "+(err?.message??err);
          ui.notifications?.error("H0D : "+(err?.message??err));
        }finally{
          busy=false;button.disabled=false;
          if(close)close.disabled=false;
        }
      });
    }
  });
}

async function openBuilder() {
  if (!game.user.isGM) return notify("warn", "H0D Machine Builder est réservé au MJ.");

  const threat1Options = allMachineKeys(1).map(key => `<option value="${key}">${MACHINES[key].label}</option>`).join("");
  const threat2Options = allMachineKeys(2).map(key => `<option value="${key}">${MACHINES[key].label}</option>`).join("");
  const threat3Options = allMachineKeys(3).map(key => `<option value="${key}">${MACHINES[key].label}</option>`).join("");
  const threat4Options = allMachineKeys(4).map(key => `<option value="${key}">${MACHINES[key].label}</option>`).join("");
  const machineOptions = [
    `<option value="all">Toutes les machines</option>`,
    `<option value="threat-1">Toutes les Menace 1</option>`,
    `<option value="threat-2">Toutes les Menace 2</option>`,
    `<option value="threat-3">Toutes les Menace 3</option>`,
    `<option value="threat-4">Toutes les Menace 4</option>`,
    `<optgroup label="Menace 1">${threat1Options}</optgroup>`,
    `<optgroup label="Menace 2">${threat2Options}</optgroup>`,
    `<optgroup label="Menace 3">${threat3Options}</optgroup>`,
    `<optgroup label="Menace 4">${threat4Options}</optgroup>`
  ].join("");

  await h0dPersistentDialog({
    window: {title:`H0D — Machine Builder v${VERSION}`},
    content: `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <p><strong>Menaces 1 à 4.</strong> Génère la bibliothèque ou assemble directement les machines avec leurs pièces et attaques.</p>
      <p><strong>Tokens :</strong> Petite 1×1 · Moyenne 2×2 · Lourde 3×3 · Titan 4×4 · Prototype = taille explicite.</p>
        ${(() => {
          const t = detectedTemplatesText();
          return `<div style="padding:6px 8px;border:1px solid #666;border-radius:5px;font-size:.9em;">
            <strong>Templates détectés :</strong><br>
            Pièces : ${t.piece}<br>
            Armes machine : ${t.weapon}<br>
            Machine : ${t.machine}<br>
            Source : ${t.source}<br>
            <span style="opacity:.8">Le mode « Mettre à jour » réapplique entièrement ces templates aux entrées générées.</span><br>
            <span style="opacity:.8">« Synchroniser champs manquants » ne modifie jamais une valeur déjà présente sur les machines assemblées.</span>
          </div>`;
        })()}
        <div class="form-group">
          <label>Action</label>
          <select name="action">
            <option value="library">Générer / mettre à jour la bibliothèque</option>
            <option value="repair-missing">Synchroniser champs manquants (non destructif)</option>
            <option value="assemble">Assembler machine complète</option>
          </select>
        </div>
        <div class="form-group">
          <label>Machine</label>
          <select name="machine">${machineOptions}</select>
        </div>
        <div class="form-group">
          <label>Si l'entrée existe déjà</label>
          <select name="mode">
            <option value="update">Mettre à jour (conserve les images)</option>
            <option value="skip">Ignorer</option>
            <option value="replace">Recréer</option>
          </select>
        </div>
        <hr>
        <p style="font-size:.9em;opacity:.8;">
          <strong>Bibliothèque :</strong> ${COMPONENT_PACK_LABEL}<br>
          <strong>Machines assemblées :</strong> Acteurs → ${WORLD_MACHINE_FOLDER} → Menace 1 / Menace 2 / Menace 3 / Menace 4<br>
          L'assemblage réutilise les Items du compendium : tes images personnalisées suivent donc la machine.
        </p>
      </div>`,
  }, async result => {
  try {
    await runAction(result.action || "library", result.machine || "all", result.mode || "update");
  } catch (err) {
    console.error(`${MODULE_ID} |`, err);
    notify("error", `H0D Machine Builder : ${err?.message ?? err}`);
  }
  });
}

async function ensureLauncherMacro() {
  if (!game.user.isGM) return;
  const name = "H0D — Générateur composants";
  let macro = game.macros?.getName(name);
  const command = "game.h0dMachineBuilder.open();";
  if (macro) {
    if (macro.command !== command) await macro.update({command});
    return;
  }
  await Macro.create({name,type:"script",scope:"global",img:"icons/svg/gears.svg",command});
  notify("info", "H0D Machine Builder : macro de lancement créée.");
}

Hooks.once("ready", async () => {
  game.h0dMachineBuilder = {
    open: openBuilder,
    generateLibrary: generateLibraryOne,
    assemble: assembleMachineOne,
    machines: MACHINES,
    validate: key => machineWarnings(MACHINES[key]),
    repairMissing: repairEmbeddedMissingOne
  };
  await ensureLauncherMacro();
  if (game.user.isGM) console.log(`${MODULE_ID} | v${VERSION} prêt`);
});
