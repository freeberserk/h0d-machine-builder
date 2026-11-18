/* Menace 6 — Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf, pages 1 à 6.
 * Statut source : quatre fiches « Validé pour lot M6 », Corrupteur Faro « Finalisé ».
 * Document synthétique : plusieurs champs nécessaires au template CSB sont absents.
 * Ne pas inventer PER, DD scan/piratage, DEF de pièce, vitesse, sauvegardes ou taille.
 * Ces profils peuvent alimenter la bibliothèque, pas l'assemblage d'Actor incomplet.
 * La ligne « Corps » devient actor.bodyPV et ne compte pas comme Item.
 * Les effets spéciaux restent du texte MJ lorsque les chiffres sont incomplets.
 */
export const THREAT6_MACHINES = {
  "shell-walker": {
    "label": "Shell-Walker",
    "importReady": false,
    "validation": "validé pour lot M6 (fiche synthétique)",
    "provenance": "Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf (document fourni)",
    "actor": {
      "category": null,
      "variant": "Standard",
      "model": "Shell-Walker",
      "threat": 6,
      "role": "Transport blindé / défensif",
      "origin": null,
      "behavior": "Défend sa cargaison, un objectif ou une route ; se retranche derrière son bouclier et utilise ses pinces et son canon.",
      "bodyPV": 42,
      "declaredModulesPV": 98,
      "sourceMaxPV": 140,
      "defense": 11,
      "attack": 8,
      "initiative": null,
      "speed": null,
      "fortitude": null,
      "reflex": null,
      "will": null,
      "abilityDC": null,
      "scanDC": null,
      "hackDC": null,
      "hackable": null,
      "weaknesses": "Bouclier énergétique; Caisse cargo; Pince gauche; Pince droite; Canon lourd",
      "immunities": "Non renseignées dans le dossier M6",
      "focus": "Bouclier énergétique (DEF -4 après destruction), caisse cargo et canon lourd.",
      "notes": "FICHE SYNTHÉTIQUE M6 : 42 PV de corps ; 98 PV de pièces. Le bouclier apporte +4 DEF sur la DEF de corps 11. Aucune portée de canon ni initiative fournie. Les valeurs non fournies dans le PDF restent NULL (ni extrapolation, ni zéro fictif). Références de DEF individuelle des pièces, portées non chiffrées, sauvegardes, taille de token et PER/Focus à compléter avant assemblage.",
      "perception": {
        "total": null,
        "range": null
      }
    },
    "pieces": [
      {
        "name": "Bouclier énergétique",
        "type": "Blindage",
        "location": "Avant",
        "pv": 25,
        "def": null,
        "countPV": true,
        "bonusDef": 4,
        "detachable": false,
        "effect": "Bouclier énergétique détruit : DEF 15 → 11 (-4) ; résistance frontale perdue."
      },
      {
        "name": "Caisse cargo",
        "type": "Cargo",
        "location": "Non précisé",
        "pv": 25,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Cargaison ou butin rare perdu à la destruction. Le contenu et son éventuelle récupération ne sont pas chiffrés."
      },
      {
        "name": "Pince gauche",
        "type": "Structure",
        "location": "Gauche",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaque avec la pince gauche impossible."
      },
      {
        "name": "Pince droite",
        "type": "Structure",
        "location": "Droite",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaque avec la pince droite impossible."
      },
      {
        "name": "Canon lourd",
        "type": "Arme",
        "location": "Non précisé",
        "pv": 18,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaque de canon lourd impossible."
      }
    ],
    "weapons": [
      {
        "name": "Pince",
        "mode": "Naturelle",
        "type": "Pince",
        "dmg": "3d6",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Corps à corps, pince(s) opérationnelle(s). Les conditions d'une frappe par pince sont arbitrées par le MJ."
      },
      {
        "name": "Canon lourd",
        "mode": "Distance",
        "type": "Canon",
        "dmg": "3d8",
        "dmgType": "",
        "range": null,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Attaque à distance ; portée non indiquée dans le dossier M6. Le canon doit être fonctionnel."
      }
    ]
  },
  "bellowback-feu": {
    "label": "Bellowback Feu",
    "importReady": false,
    "validation": "validé pour lot M6 (fiche synthétique)",
    "provenance": "Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf (document fourni)",
    "actor": {
      "category": null,
      "variant": "Feu",
      "model": "Bellowback",
      "threat": 6,
      "role": "Réservoir lourd / zone incendiaire",
      "origin": null,
      "behavior": "Verrouille l'espace avec un cône de feu, pénalise les groupes rapprochés ; charge et balaie de la queue.",
      "bodyPV": 80,
      "declaredModulesPV": 70,
      "sourceMaxPV": 150,
      "defense": 15,
      "attack": 8,
      "initiative": null,
      "speed": null,
      "fortitude": null,
      "reflex": null,
      "will": null,
      "abilityDC": null,
      "scanDC": null,
      "hackDC": null,
      "hackable": null,
      "weaknesses": "Grand réservoir Blaze; Sac ventral Blaze; Lance-flammes; Queue",
      "immunities": "Non renseignées dans le dossier M6",
      "focus": "Grand réservoir Blaze, sac ventral Blaze, lance-flammes, queue.",
      "notes": "FICHE SYNTHÉTIQUE M6 : 80 PV de corps + 70 PV de pièces. Explosion Blaze 5d6 : rayon, DD et conditions élémentaires non précisés. Les valeurs non fournies dans le PDF restent NULL (ni extrapolation, ni zéro fictif). Références de DEF individuelle des pièces, portées non chiffrées, sauvegardes, taille de token et PER/Focus à compléter avant assemblage.",
      "perception": {
        "total": null,
        "range": null
      }
    },
    "pieces": [
      {
        "name": "Grand réservoir Blaze",
        "type": "Reservoir",
        "location": "Non précisé",
        "pv": 20,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "À destruction : explosion de feu 5d6. Rayon et DD NON indiqués : pas d'explosion automatique chiffrée.",
        "element": "Blaze"
      },
      {
        "name": "Sac ventral Blaze",
        "type": "Reservoir",
        "location": "Ventre",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Jet de feu réduit ; réduction exacte non renseignée.",
        "element": "Blaze"
      },
      {
        "name": "Lance-flammes",
        "type": "Arme",
        "location": "Non précisé",
        "pv": 20,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Jet de feu impossible."
      },
      {
        "name": "Queue",
        "type": "Structure",
        "location": "Arrière",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaque de queue impossible."
      }
    ],
    "weapons": [
      {
        "name": "Jet de feu",
        "mode": "Zone",
        "type": "Souffle",
        "dmg": "3d8",
        "dmgType": "Feu",
        "range": null,
        "recharge": 0,
        "zone": "Cône — portée à valider",
        "special": true,
        "effect": "Cône de courte portée (longueur non définie) ; lance-flammes actif."
      },
      {
        "name": "Charge",
        "mode": "Naturelle",
        "type": "Charge",
        "dmg": "3d6",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Charge au contact (distance de déplacement non indiquée)."
      },
      {
        "name": "Queue",
        "mode": "Naturelle",
        "type": "Queue",
        "dmg": "2d8",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Balayage au corps à corps ; queue intacte."
      }
    ]
  },
  "bellowback-gel": {
    "label": "Bellowback Gel",
    "importReady": false,
    "validation": "validé pour lot M6 (fiche synthétique)",
    "provenance": "Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf (document fourni)",
    "actor": {
      "category": null,
      "variant": "Gel",
      "model": "Bellowback",
      "threat": 6,
      "role": "Réservoir lourd / contrôle cryo",
      "origin": null,
      "behavior": "Ralentit et isole avec son souffle cryogénique, punit les déplacements ; charge et balaie de la queue.",
      "bodyPV": 80,
      "declaredModulesPV": 70,
      "sourceMaxPV": 150,
      "defense": 15,
      "attack": 8,
      "initiative": null,
      "speed": null,
      "fortitude": null,
      "reflex": null,
      "will": null,
      "abilityDC": null,
      "scanDC": null,
      "hackDC": null,
      "hackable": null,
      "weaknesses": "Grand réservoir Gel; Sac ventral Gel; Canon cryo; Queue",
      "immunities": "Non renseignées dans le dossier M6",
      "focus": "Grand réservoir Gel/Freeze, sac ventral Gel, canon cryo et queue.",
      "notes": "FICHE SYNTHÉTIQUE M6 : 80 PV de corps + 70 PV de pièces. Explosion Gel 5d6 : rayon et DD non précisés, pas de ralentissement mécanique inventé. Les valeurs non fournies dans le PDF restent NULL (ni extrapolation, ni zéro fictif). Références de DEF individuelle des pièces, portées non chiffrées, sauvegardes, taille de token et PER/Focus à compléter avant assemblage.",
      "perception": {
        "total": null,
        "range": null
      }
    },
    "pieces": [
      {
        "name": "Grand réservoir Gel",
        "type": "Reservoir",
        "location": "Non précisé",
        "pv": 20,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "À destruction : explosion cryo 5d6. Rayon et DD NON indiqués : pas d'explosion automatique chiffrée.",
        "element": "Gel"
      },
      {
        "name": "Sac ventral Gel",
        "type": "Reservoir",
        "location": "Ventre",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Souffle cryo réduit ; réduction exacte non renseignée.",
        "element": "Gel"
      },
      {
        "name": "Canon cryo",
        "type": "Arme",
        "location": "Non précisé",
        "pv": 20,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Souffle cryo impossible."
      },
      {
        "name": "Queue",
        "type": "Structure",
        "location": "Arrière",
        "pv": 15,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaque de queue impossible."
      }
    ],
    "weapons": [
      {
        "name": "Souffle gel",
        "mode": "Zone",
        "type": "Souffle",
        "dmg": "3d8",
        "dmgType": "Froid",
        "range": null,
        "recharge": 0,
        "zone": "Cône — portée à valider",
        "special": true,
        "effect": "Cône de courte portée (longueur non définie) ; canon cryo actif."
      },
      {
        "name": "Charge",
        "mode": "Naturelle",
        "type": "Charge",
        "dmg": "3d6",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Charge au contact (distance de déplacement non indiquée)."
      },
      {
        "name": "Queue",
        "mode": "Naturelle",
        "type": "Queue",
        "dmg": "2d8",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Balayage au corps à corps ; queue intacte."
      }
    ]
  },
  "ravageur-blanc": {
    "label": "Ravageur blanc",
    "importReady": false,
    "validation": "validé pour lot M6 (fiche synthétique)",
    "provenance": "Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf (document fourni)",
    "actor": {
      "category": null,
      "variant": "Blanc (ELYSIUM)",
      "model": "Ravageur",
      "threat": 6,
      "role": "Prédateur armé / variante ELYSIUM",
      "origin": "ELYSIUM",
      "behavior": "Variante blanche du Ravageur ; prédateur plus agressif et plus stable, poursuite et garde rapprochée d'une zone blanche.",
      "bodyPV": 71,
      "declaredModulesPV": 74,
      "sourceMaxPV": 145,
      "defense": 15,
      "attack": 8,
      "initiative": null,
      "speed": null,
      "fortitude": null,
      "reflex": null,
      "will": null,
      "abilityDC": null,
      "scanDC": null,
      "hackDC": null,
      "hackable": null,
      "weaknesses": "Canon dorsal blanc; Batterie; Crocs; Griffe avant gauche; Griffe avant droite; Griffe arrière gauche; Griffe arrière droite",
      "immunities": "Non renseignées dans le dossier M6",
      "focus": "Canon dorsal blanc récupérable, batterie, crocs, quatre griffes.",
      "notes": "FICHE SYNTHÉTIQUE M6 : 71 PV de corps + 74 PV de pièces. Plaques blanches ELYSIUM. Aucune explosion électrique automatique chiffrée sans valeurs de source. Les valeurs non fournies dans le PDF restent NULL (ni extrapolation, ni zéro fictif). Références de DEF individuelle des pièces, portées non chiffrées, sauvegardes, taille de token et PER/Focus à compléter avant assemblage.",
      "perception": {
        "total": null,
        "range": null
      }
    },
    "pieces": [
      {
        "name": "Canon dorsal blanc",
        "type": "Arme",
        "location": "Dos",
        "pv": 12,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": true,
        "effect": "Canon blanc impossible. Arme récupérable en cas de détachement propre.",
        "recuperable": false,
        "note": "Pièce récupérable selon le PDF si détachée proprement ; attribution manuelle au MJ tant que la référence canonique du canon n'est pas déclarée dans H0D Catalogue (pas de conversion automatique en PM)."
      },
      {
        "name": "Batterie",
        "type": "Generateur",
        "location": "Dos",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Explosion électrique à la destruction (dégâts, rayon et DD non renseignés)."
      },
      {
        "name": "Crocs",
        "type": "Structure",
        "location": "Tête",
        "pv": 12,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Morsure réduite ; valeurs exactes non indiquées."
      },
      {
        "name": "Griffe avant gauche",
        "type": "Structure",
        "location": "Avant gauche",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaques de corps à corps affaiblies."
      },
      {
        "name": "Griffe avant droite",
        "type": "Structure",
        "location": "Avant droite",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Attaques de corps à corps affaiblies."
      },
      {
        "name": "Griffe arrière gauche",
        "type": "Mobilite",
        "location": "Arrière gauche",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Mobilité et attaques affaiblies."
      },
      {
        "name": "Griffe arrière droite",
        "type": "Mobilite",
        "location": "Arrière droite",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Mobilité et attaques affaiblies."
      }
    ],
    "weapons": [
      {
        "name": "Canon blanc",
        "mode": "Distance",
        "type": "Canon",
        "dmg": "3d8",
        "dmgType": "",
        "range": null,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Attaque à distance, portée non renseignée ; dépend du canon dorsal."
      },
      {
        "name": "Griffes",
        "mode": "Naturelle",
        "type": "Griffes",
        "dmg": "2d8+3",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Corps à corps, dépend des griffes fonctionnelles."
      },
      {
        "name": "Morsure",
        "mode": "Naturelle",
        "type": "Morsure",
        "dmg": "2d6+3",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Corps à corps, affaiblie après destruction des crocs ; valeur réduite non précisée."
      }
    ]
  },
  "corrupteur-faro": {
    "label": "Corrupteur Faro",
    "importReady": false,
    "validation": "finalisé (fiche PDF)",
    "provenance": "Bestiaire_Machines_Menace_6_Fiches_Foundry(1).pdf (document fourni)",
    "actor": {
      "category": null,
      "variant": "Faro",
      "model": "Corrupteur",
      "threat": 6,
      "role": "Corruption / contrôle tactique",
      "origin": "Faro",
      "behavior": "Asservit jusqu'à trois machines pour un total de six niveaux de Menace, emploie piques, grenade de Frénésie Faro et bond écrasant.",
      "bodyPV": 58,
      "declaredModulesPV": 72,
      "sourceMaxPV": 130,
      "defense": 11,
      "attack": null,
      "initiative": 5,
      "speed": 15,
      "fortitude": null,
      "reflex": null,
      "will": null,
      "abilityDC": 17,
      "scanDC": null,
      "hackDC": null,
      "hackable": null,
      "weaknesses": "Noyau central unifié; Lance-piques; Lance-grenades; Queue perforante; Patte avant gauche; Patte avant droite; Patte arrière gauche; Patte arrière droite",
      "immunities": "Non renseignées dans le dossier M6",
      "focus": "Noyau central unifié (contrôle/refroidissement), ciblable sans scan préalable sous Brûlure ; armes et pattes destructibles.",
      "notes": "FICHE SYNTHÉTIQUE M6 : Fiche dite « finalisée » dans le PDF, mais ATQ de base et défenses secondaires absentes. 58 PV de corps + 72 PV de pièces. Initiative +5, vitesse 15 m, DD capacités 17. L'action d'asservissement et les effets Faro sont des textes MJ. Les valeurs non fournies dans le PDF restent NULL (ni extrapolation, ni zéro fictif). Références de DEF individuelle des pièces, portées non chiffrées, sauvegardes, taille de token et PER/Focus à compléter avant assemblage.",
      "perception": {
        "total": null,
        "range": null
      }
    },
    "pieces": [
      {
        "name": "Noyau central unifié",
        "type": "Noyau",
        "location": "Centre",
        "pv": 18,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Destruction : libère les machines asservies, interdit tout nouvel asservissement, surcharge 3d6 dégâts au corps et DEF -2 durant 1 round. Sous Brûlure : noyau ciblable sans scan préalable."
      },
      {
        "name": "Lance-piques",
        "type": "Arme",
        "location": "Non précisé",
        "pv": 12,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Supprime le tir de piques."
      },
      {
        "name": "Lance-grenades",
        "type": "Arme",
        "location": "Non précisé",
        "pv": 12,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Supprime la Frénésie Faro."
      },
      {
        "name": "Queue perforante",
        "type": "Structure",
        "location": "Arrière",
        "pv": 10,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Supprime l'attaque de queue."
      },
      {
        "name": "Patte avant gauche",
        "type": "Mobilite",
        "location": "Avant gauche",
        "pv": 5,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Vitesse -3 m."
      },
      {
        "name": "Patte avant droite",
        "type": "Mobilite",
        "location": "Avant droite",
        "pv": 5,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Vitesse -3 m."
      },
      {
        "name": "Patte arrière gauche",
        "type": "Mobilite",
        "location": "Arrière gauche",
        "pv": 5,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Vitesse -3 m."
      },
      {
        "name": "Patte arrière droite",
        "type": "Mobilite",
        "location": "Arrière droite",
        "pv": 5,
        "def": null,
        "countPV": true,
        "bonusDef": 0,
        "detachable": false,
        "effect": "Vitesse -3 m ; bond impossible après destruction de deux pattes."
      }
    ],
    "weapons": [
      {
        "name": "Griffes mécaniques",
        "mode": "Naturelle",
        "type": "Griffes",
        "dmg": "2d6+3",
        "dmgType": "",
        "range": 0,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Attaque de corps à corps."
      },
      {
        "name": "Queue perforante",
        "mode": "Naturelle",
        "type": "Queue",
        "dmg": "2d8+3",
        "dmgType": "",
        "range": 3,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Portée 3 m, exige queue fonctionnelle."
      },
      {
        "name": "Lance-piques",
        "mode": "Distance",
        "type": "Projectile",
        "dmg": "2d8+2",
        "dmgType": "",
        "range": 24,
        "recharge": 0,
        "zone": "",
        "special": false,
        "effect": "Tir à 24 m, exige lance-piques fonctionnel."
      },
      {
        "name": "Bond écrasant",
        "mode": "Speciale",
        "type": "Charge",
        "dmg": "3d6+2",
        "dmgType": "",
        "range": 12,
        "recharge": 0,
        "zone": "",
        "special": true,
        "effect": "Bond 12 m ; Réflexes DD17 pour éviter d'être renversé."
      },
      {
        "name": "Grenade Frénésie Faro",
        "mode": "Speciale",
        "type": "Corruption",
        "dmg": "",
        "dmgType": "",
        "range": 24,
        "recharge": 3,
        "zone": "Rayon 3 m",
        "special": true,
        "effect": "Rayon 3 m, recharge 3 rounds. Pendant 1d3 rounds : machines touchées +1 attaque, +3 m vitesse, +1 dégâts de mêlée, -1 DEF ; attaquent la cible non corrompue la plus proche."
      },
      {
        "name": "Asservissement Faro",
        "mode": "Speciale",
        "type": "Contrôle",
        "dmg": "",
        "dmgType": "",
        "range": null,
        "recharge": 0,
        "zone": "",
        "special": true,
        "effect": "1 machine par action de mouvement OU jusqu'à 3 machines par round complet ; maximum 3 machines pour un total de 6 niveaux de Menace. DD : Menace 1=17, 2=16, 3=15, 4=14, 5=13, 6=12."
      }
    ]
  }
};
