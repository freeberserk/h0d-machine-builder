
/* Menace 4 — données tirées du Bestiaire_Machines_Menace_4_Fiches_Foundry(1).pdf, pages 2 à 8.
 * Les capacités conditionnelles non implémentées dans le moteur restent décrites pour arbitrage MJ.
 */
const P = (name, location, pv, effect, type="Structure", extra={}) => ({
  name, location, pv, def:12, countPV:true, bonusDef:0, detachable:true, type, effect, ...extra
});
const W = (name, dmg, effect, opts={}) => ({
  name, mode:"Naturelle", type:"Autre", dmg, dmgType:"Contondant", range:0, recharge:0, effect, ...opts
});
const A = (name, model, variant, role, category, bodyPV, modulesPV, initiative, speed, fortitude, reflex, hackDC, element, faction, behavior, pieces, weapons, notes="", origin="HELIOS standard") => ({
  label:name,
  actor:{
    category, variant, model, threat:4, role, origin, behavior,
    bodyPV, declaredModulesPV:modulesPV, sourceMaxPV:bodyPV+modulesPV,
    defense:10, attack:6, initiative, speed, fortitude, reflex, will:2,
    abilityDC:15, scanDC:13, hackDC, hackable:true,
    weaknesses:pieces.map(p=>p.name).join("; "), immunities:"Non précisées dans la fiche source",
    focus:behavior, notes:notes+" | Élément : "+element+" ; Faction : "+faction
  },pieces,weapons
});
const shock = {type:"Choc",dmg:"1d6",radius:1.5,dc:15};
const blaze = {type:"Feu",dmg:"2d6",radius:3,dc:15};
const cryo = {type:"Froid",dmg:"2d6",radius:3,dc:15};
const white = {type:"Energie",dmg:"2d6",radius:3,dc:15};
const C = (name,pv,effect)=>P(name,"Corps / châssis",pv,effect,"Structure",{bonusDef:1,detachable:false});
const B = (name,pv,effect)=>P(name,"Corps / flancs",pv,effect,"Blindage",{bonusDef:1});
const shockBattery = (name,location,pv=5)=>P(name,location,pv,"Si détruite par choc : explosion 1d6 énergie, rayon 1,5 m, Réflexes DD15 moitié.","Generateur",{explosion:shock});
const attack = (name,dmg,effect,mode,range,recharge,zone,type,dmgType="Contondant",note="")=>W(name,dmg,effect,{
  mode,range,recharge,zone,type,dmgType,special:mode==="Zone"||mode==="Speciale",note
});
const threat4 = {
 "sawtooth-wild": A("Dent de Scie sauvage","Sawtooth","Sauvage","Prédateur rapide","Moyenne",32,42,4,12,6,5,18,"Aucun","HELIOS / faune machine",
 "Attaque les isolés, blessés et cibles reculant ; bond 15 m ; prédateur non bridé.",[
 P("Mâchoire prédatrice","Tête",7,"Perte de Morsure prédatrice ; morsure réduite à 1d6."),
 P("Capteur frontal","Tête",4,"Perception réduite ; ciblage des isolés dégradé.","Capteur"),
 P("Griffe gauche","Patte avant G",5,"Perte d'une partie de Lacération griffes."),
 P("Griffe droite","Patte avant D",5,"Perte d'une partie de Lacération griffes."),
 shockBattery("Batterie dorsale","Dos"),
 P("Queue stabilisatrice","Queue / arrière",4,"Réflexes -1 ; bonds et virages moins précis.","Mobilite"),
 B("Plaques de blindage",6,"+1 DEF tant qu'actives."),
 C("Châssis prédateur",6,"+1 DEF ; si détruit : vitesse -3 m, bond -3 m.")
 ],[
 W("Morsure prédatrice","1d10+2","Si mâchoire détruite : morsure 1d6.",{type:"Morsure",dmgType:"Perforant"}),
 W("Lacération griffes","1d10+1","Nécessite au moins une griffe intacte.",{type:"Griffes",dmgType:"Tranchant"}),
 attack("Bond de chasse","2d8","Bond 15 m ; Réflexes DD15 ou tombe au sol / repoussé 1,5 m.","Speciale",15,2,"Bond 15 m","Autre"),
 attack("Poursuite brutale","2d6+2","Rejoint une cible isolée.","Speciale",12,2,"Ligne 12 m","Autre"),
 attack("Rugissement prédateur","0","Volonté DD15 ; échec : -2 prochaine action agressive, scène intimidante.","Speciale",9,3,"Proches","Sonique")
 ]),
 "charger-wild": A("Charger","Charger","Sauvage","Charge / bélier","Moyenne",34,40,4,12,7,5,18,"Aucun","HELIOS / faune machine",
 "Bélier montagne : charge en pente, rochers et terrain modérément difficile ; terrain très difficile : 12 m.",[
 P("Corne gauche","Tête gauche",5,"Charge perforante réduite si une corne détruite."),
 P("Corne droite","Tête droite",5,"Charge perforante réduite si une corne détruite."),
 P("Plaque frontale","Tête / front",5,"+1 DEF ; si détruite : front vulnérable.","Blindage",{bonusDef:1}),
 shockBattery("Batterie dorsale","Dos"),
 P("Patte avant gauche","Patte avant G",4,"Vitesse -3 m si mobilité déjà endommagée.","Mobilite"),
 P("Patte avant droite","Patte avant D",4,"Vitesse -3 m si mobilité déjà endommagée.","Mobilite"),
 P("Pattes arrière motrices","Pattes arrière",6,"Charge limitée à 12 m ; plus de montée raide.","Mobilite"),
 P("Queue stabilisatrice","Queue / arrière",4,"Plus de charge en pente difficile ; virages serrés impossibles.","Mobilite"),
 C("Châssis charge",2,"+1 DEF ; si détruit : plus de charge, vitesse -3 m.")
 ],[
 W("Cornes","1d10+2","Attaque mêlée principale.",{type:"Cornes",dmgType:"Perforant"}),
 W("Sabot","1d8+2","Attaque de contact.",{type:"Ruade"}),
 attack("Charge perforante","2d8+2","Ligne 18 m ; nécessite au moins 6 m d'élan.","Speciale",18,2,"Ligne 18 m","Cornes","Perforant"),
 attack("Piétinement","2d6+2","Sur cible au sol ou bousculée ; Réflexes DD15 ou tombe.","Speciale",0,2,"Contact","Ruade"),
 attack("Charge de troupeau","2d8","Réflexes DD15 ; réussite moitié dégâts, sans chute. 1/scène.","Zone",18,0,"Ligne 18 m largeur 3 m","Ruade","Contondant","Recharge source : 1/scène ; non automatisée.")
 ]),
 "bellowback-fire": A("Bellowback de Feu","Bellowback","Feu","Élémentaire lourd","Lourde",38,48,2,9,7,3,18,"Feu","HELIOS / faune machine",
 "En feu : 1d4 dégâts au début du prochain tour ; action complète pour éteindre. Réservoirs Blaze vulnérables.",[
 P("Gueule / buse de souffle","Tête",5,"Plus de souffle feu complet ; attaques élémentaires réduites."),
 P("Sac élémentaire dorsal","Dos",10,"Si détruit par feu/choc adapté : explosion Blaze 2d6 feu, rayon 3 m, Réflexes DD15 moitié.","Reservoir",{explosion:blaze}),
 P("Réservoir ventral","Ventre",7,"Nappe incendiaire désactivée.","Reservoir"),
 P("Batterie de pression","Flanc droit",5,"Recharge des souffles +1 round ; risque de fuite.","Generateur"),
 P("Valve de régulation","Flanc gauche",4,"Souffle instable ; sur échec critique, zone dévie.","Autre"),
 P("Queue lourde stabilisatrice","Queue / arrière",6,"Perte de Coup de queue lourd ; Réflexes -1.","Mobilite"),
 P("Pattes arrière lourdes","Pattes arrière",5,"Vitesse -3 m ; plus de charge courte.","Mobilite"),
 B("Plaques latérales",4,"+1 DEF tant qu'actives."),
 C("Châssis lourd",2,"+1 DEF ; si détruit : vitesse -3 m, instable.")
 ],[
 W("Morsure lourde","1d8+2","Mêlée simple.",{type:"Morsure",dmgType:"Perforant"}),
 W("Coup de queue lourd","1d8+1","Réflexes DD15 ou repoussé de 1,5 m.",{type:"Autre"}),
 attack("Charge courte lourde","1d10+2","Ligne 9 m.","Speciale",9,2,"Ligne 9 m","Ruade"),
 attack("Souffle de feu","2d6","Réflexes DD15 ; échec : En feu 1 round ; réussite : moitié, sans état.","Zone",6,3,"Cône 6 m","Souffle","Feu"),
 attack("Nappe incendiaire","1d6","Réflexes DD15 ; ligne 9 m ; zone dangereuse jusqu'au prochain tour MJ si souhaité.","Zone",9,3,"Ligne 9 m","Autre","Feu")
 ]),
 "bellowback-ice": A("Bellowback de Glace","Bellowback","Glace","Élémentaire lourd","Lourde",38,48,2,9,7,3,18,"Glace","HELIOS / faune machine",
 "Ralenti : vitesse -3 m et pas de réaction jusqu'au prochain tour.",[
 P("Gueule / buse de souffle","Tête",5,"Plus de souffle gel complet ; attaques élémentaires réduites."),
 P("Sac élémentaire dorsal","Dos",10,"Si détruit par choc/énergie adaptée : rupture Cryo 2d6 froid, rayon 3 m, Réflexes DD15 moitié.","Reservoir",{explosion:cryo}),
 P("Réservoir ventral","Ventre",7,"Jet de givre au sol désactivé.","Reservoir"),
 P("Batterie de pression","Flanc droit",5,"Recharge des souffles +1 round ; risque de fuite.","Generateur"),
 P("Valve de régulation","Flanc gauche",4,"Souffle instable ; sur échec critique, zone dévie.","Autre"),
 P("Queue lourde stabilisatrice","Queue / arrière",6,"Perte de Coup de queue lourd ; Réflexes -1.","Mobilite"),
 P("Pattes arrière lourdes","Pattes arrière",5,"Vitesse -3 m ; plus de charge courte.","Mobilite"),
 B("Plaques latérales",4,"+1 DEF tant qu'actives."),
 C("Châssis lourd",2,"+1 DEF ; si détruit : vitesse -3 m, instable.")
 ],[
 W("Morsure lourde","1d8+2","Mêlée simple.",{type:"Morsure",dmgType:"Perforant"}),
 W("Coup de queue lourd","1d8+1","Réflexes DD15 ou repoussé de 1,5 m.",{type:"Autre"}),
 attack("Charge courte lourde","1d10+2","Ligne 9 m.","Speciale",9,2,"Ligne 9 m","Ruade"),
 attack("Souffle de gel","2d6","Réflexes DD15 ; échec : Ralenti 1 round ; réussite : moitié, sans état.","Zone",6,3,"Cône 6 m","Souffle","Froid"),
 attack("Jet de givre au sol","1d6","Réflexes DD15 ; ligne 9 m ; peut empêcher charge ou fuite rapide.","Zone",9,3,"Ligne 9 m","Autre","Froid")
 ]),
 "ravager-young": A("Ravageur jeune / affaibli","Ravageur","Jeune / affaibli","Prédateur armé","Moyenne",36,46,3,9,6,4,19,"Aucun","HELIOS / faune machine",
 "Prédateur hybride : choisir entre neutraliser canon dorsal, mobilité ou corps. Bond 9 m.",[
 P("Canon Ravageur","Dos / épaule",10,"Plus d'attaque Canon. Récupérable si détruit proprement.","Autre"),
 shockBattery("Batterie canon","Dos / arrière"),
 P("Mâchoire prédatrice","Tête",5,"Morsure réduite à 1d6."),
 P("Capteur de chasse","Tête",4,"Perception réduite ; ciblage distant moins précis.","Capteur"),
 P("Griffe gauche","Patte avant G",4,"Lacération réduite."),
 P("Griffe droite","Patte avant D",4,"Lacération réduite."),
 P("Plaques dorsales","Dos / épaules",5,"+1 DEF tant qu'actives.","Blindage",{bonusDef:1}),
 P("Queue stabilisatrice","Queue / arrière",3,"Réflexes -1 ; bonds moins précis.","Mobilite"),
 P("Pattes arrière motrices","Pattes arrière",4,"Plus de bond prédateur lourd ; vitesse -3 m.","Mobilite"),
 C("Châssis prédateur lourd",2,"+1 DEF ; si détruit : vitesse -3 m.")
 ],[
 attack("Canon Ravageur","2d8+2","Portée 24 m ; canon et batterie actifs.","Distance",24,2,null,"Canon","Energie"),
 attack("Rafale de suppression","2d6","Réflexes DD15 ; ligne 12 m ou cône 6 m ; échec : aucune réaction jusqu'au prochain tour.","Zone",12,3,"Ligne 12 m ou cône 6 m","Canon","Energie"),
 W("Morsure","1d8+2","Attaque au contact.",{type:"Morsure",dmgType:"Perforant"}),
 W("Lacération","1d8+1","Au moins une griffe intacte.",{type:"Griffes",dmgType:"Tranchant"}),
 attack("Bond prédateur lourd","1d10+1","Bond 9 m ; impossible si pattes arrière détruites.","Speciale",9,2,"Bond 9 m","Autre")
 ]),
 "glouton-elys": A("Glouton ELYS","Glouton","ELYS / blanche","Berserker instable","Moyenne",34,44,4,12,5,5,19,"Énergie blanche","ELYSIUM",
 "Prédateur ELYSIUM original, privé de prudence ; bond 12 m. Consulter les capacités Berserk détaillées.",[
 P("Mâchoire d'acharnement","Tête",6,"Perte de Morsure d'acharnement ; morsure 1d6."),
 P("Capteur prédateur blanc","Tête",4,"Perte du bonus contre cible marquée ; Perception réduite.","Capteur"),
 P("Module d'agression ELYS","Crâne / dos",5,"Déclenche/maintient Berserk instable ; destruction avant Berserk l'empêche ; pendant Berserk : arrêt immédiat et 1d6 internes.","Autre"),
 P("Griffe avant gauche","Patte avant G",4,"Lacération courte réduite."),
 P("Griffe avant droite","Patte avant D",4,"Lacération courte réduite."),
 P("Pattes arrière nerveuses","Pattes arrière",5,"Vitesse -3 m ; plus de Bond nerveux.","Mobilite"),
 P("Queue courte stabilisatrice","Queue / arrière",3,"Réflexes -1 ; bonds moins précis.","Mobilite"),
 P("Batterie blanche instable","Flanc / ventre",5,"Choc/énergie : explosion 2d6, rayon 3 m, Réflexes DD15 moitié ; sinon plus d'Impulsion blanche et 1d6 internes.","Generateur",{explosion:white}),
 B("Plaques blanches ELYS",5,"+1 DEF tant qu'actives."),
 C("Châssis nerveux",3,"+1 DEF ; vitesse et bond stables.")
 ],[
 W("Morsure d'acharnement","1d8+2","+1 dégâts si cible marquée ELYS-9, ralentie, brouillée ou blessée.",{type:"Morsure",dmgType:"Perforant"}),
 W("Lacération courte","1d8+1","Deux griffes intactes et touche de 5+ : +1d4 dégâts.",{type:"Griffes",dmgType:"Tranchant"}),
 attack("Bond nerveux","1d10+1","Bond 12 m ; Réflexes DD15 ou repoussé 1,5 m / tombe au sol.","Speciale",12,2,"Bond 12 m","Autre"),
 attack("Déchiquetage frénétique","2d6+1","Seulement cible déjà touchée ce round, marquée, ralentie, au sol ou immobilisée.","Speciale",0,2,null,"Griffes","Tranchant"),
 attack("Impulsion blanche agressive","1d6","Réflexes DD15 ; rayon 3 m ; échec : repoussé 1,5 m ; réussite : moitié sans poussée.","Zone",3,3,"Rayon 3 m","Laser","Energie"),
 attack("Entrée en Berserk","0","1/scène ou déclencheur. Déclencheurs : corps <=17 PV, module d'agression endommagé, cible marquée ELYS-9 à 9 m, ou choc/brouillage raté. +1 ATQ, +3 m vitesse, +1 dégâts morsure/déchiquetage, -1 DEF ; cible la plus proche ou marquée.","Speciale",0,0,null,"Autre","Autre","Activation et suivi manuels MJ."),
 ],"BERSERK : fin de chaque tour : 3 dégâts internes ignorant la DEF ; dès le 3e tour : -1 DEF supplémentaire ; dès le 4e : une pièce aléatoire ou abîmée subit 1d6. Module détruit pendant Berserk : arrêt immédiat, 1d6 internes, plus de bonus, comportement instable 1d6 en début de tour. Batterie détruite normalement : 1d6 internes, perte d'impulsion.",
 "ELYSIUM — machine originale")
};
export const THREAT4_MACHINES = threat4;
