## 0.10.1 — Génération en série sans fermeture de fenêtre

- La fenêtre reste ouverte après une génération ; conserve le profil, le mode et les champs saisis pour une nouvelle opération.
- Bouton **Exécuter** dans le formulaire et bouton **Fermer** explicite ; protection contre les doubles clics et l'exécution simultanée.
- Affichage du résultat/erreur dans la fenêtre sans la fermer.
- Les actions **Mettre à jour** et **Recréer** restent disponibles sur confirmation ; création sans écrasement par défaut.
- Données et règles de génération inchangées. La fermeture du dialogue n'annule pas un document déjà créé.

## 0.9.0 — Synchronisation sûre des composants existants
- Les Pièces Machine générées renseignent tous les champs d'entrée canoniques du template Pièce v2.6 utilisés par l'audit : DD démontage/détachement, effet de détachement, explosion Type/Dégâts/Rayon/DD et récupération/loot.
- Les Armes Machine générées renseignent aussi effet à destruction, effet à détachement, tirs max et tirs restants.
- Ajout de l'action **Synchroniser champs manquants (non destructif)**.
- Cette action met à jour la bibliothèque canonique puis complète les Items embarqués uniquement pour les clés absentes.
- Une valeur déjà présente n'est jamais écrasée : PV actuels, états, marquage Focus, compteurs de recharge et modifications de jeu sont conservés.
- Les Items sont reconnus par la signature stable `kind + nom` et le `machineKey`.
- Aucun réassemblage complet de l'Actor n'est effectué par cette action.
- Aucun changement des statistiques Menaces 1–3.

## 0.8.0 — Boucle pièces machine : création → PV → état → loot
- Le Builder renseigne désormais automatiquement `H0D_Composant_Loot` pour les pièces détachables/récupérables.
- Un `loot` explicite dans une définition de pièce reste prioritaire sur toute inférence.
- Table canonique embarquée :
  - réservoir / bonbonne / poche élémentaire → fluide élémentaire correspondant ;
  - batterie / réacteur / générateur / moteur → cellule d’énergie faible ;
  - optique / radar / capteur visuel → lentilles optiques ;
  - électronique / module / relais / balise / émetteur → circuit ancien abîmé ;
  - structure / griffe / plaque / membre rigide → plaques métalliques ;
  - élément souple / stabilisateur / câblage / filament → fibres synthétiques ;
  - cœur / noyau → noyau de machine selon la catégorie Petite / Moyenne / Lourde.
- Les pièces non détachables et les châssis restent non récupérables.
- Les réservoirs dont l’élément n’est pas déterminable sont marqués `Fluide élémentaire` générique et signalés par la validation au lieu d’inventer Blaze/Chillwater/etc.
- La validation du Builder signale aussi toute pièce récupérable dont la récupération n’est pas déterminée.
- Aucun changement des PV, DEF, attaques ou données de Menace 1–3.

## 0.7.2 — Propriétés explicites de récupération
- Les pièces générées reçoivent Recuperable, Loot et Valeur.
- Les châssis sont toujours non récupérables.
- L'attribut Detachable et les propriétés de protection/Intégrité sont conservés.
- La commande d'assemblage existante recrée les pièces embarquées : ne pas l'exécuter sur une machine déjà engagée en combat.

# Changelog

## 0.7.1
- Recalé sur le vrai H0D Template Manager **1.3.0**.
- Correction de la clé canonique pièce : `item-piece` (et non `item-piece-machine`).
- Utilise l'API publique `getTemplate()` de Template Manager 1.3.
- Correction de la vérification post-génération : le label calculé de protection du corps n'est plus traité comme une prop d'entrée.
- Harmonisation de l'inférence des zones anatomiques avec le Health Manager.
- Les données Menaces 1–3 et les PV totaux historiques restent inchangés.


## 0.7.0
- Intégration du système d’Intégrité v2.
- Attribution automatique d’une zone anatomique à chaque pièce.
- Attribution automatique du rôle de protection du corps aux châssis/blindages/plaques et pièces apportant de la DEF.
- Validation renforcée des nouveaux champs.
- Dépendance H0D Template Manager >= 0.4.0.
- Aucun changement des PV totaux ni des statistiques de combat existantes.


## 0.6.0
- Ajout de la gestion canonique des tailles de tokens à partir de la catégorie Machine.
- Petite = 1×1.
- Moyenne = 2×2.
- Lourde = 3×3.
- Titan / très lourde = 4×4.
- Prototype / boss exige une taille explicite dans la fiche (`actor.tokenSize`).
- Support préparé pour les tokens rectangulaires via `{width, height}`.
- Mise à jour automatique du prototype token lors d'un assemblage / update.
- Synchronisation des tokens déjà placés dans les scènes vers la taille canonique.
- Vérification post-génération de la largeur et de la hauteur du prototype token.
- Aucune modification des statistiques ou Items des machines Menace 1 à 3.


## 0.5.1
- Corrige le mélange aléatoire entre armes/attaques et pièces détachables lors de l'assemblage d'une machine.
- La réinjection CSB n'utilise plus l'ordre retourné par `createEmbeddedDocuments`.
- Chaque Item embarqué est désormais remappé par la signature stable `kind + nom`.
- Vérification post-génération renforcée : chaque pièce doit utiliser le template Pièce Machine et chaque attaque le template Arme Machine.
- Vérifie désormais la présence de toutes les pièces et de toutes les armes, pas seulement les attaques spéciales.
- Une mise à jour d'un Actor machine existant supprime puis recrée les Items générés correctement ; les données Menace 1 à 3 ne changent pas.


## 0.5.0
- Ajout complet des 6 profils Machines Menace 3 validés.
- Dent de Scie d'Aloy, Lancehorn, Longleg, Scrounger, Récolteur ELYS et Tisseur ELYS-9.
- Ajout de la sélection « Toutes les Menace 3 » dans la macro.
- Classement automatique des Actors générés dans le dossier Menace 3.
- Intégration des composants, bonus DEF, batteries/réservoirs, attaques de zone, actions de fuite et brouillage.
- Conservation des règles spéciales : cri d'alerte Longleg 1/scène globale, piratage ELYS DD 18, monture d'urgence d'Aloy.
- Support interne optionnel du champ élément sur les armes machine.
- Aucune modification des données Menace 1 et Menace 2 validées.


## 0.4.0

- Ajout complet des machines **Menace 2** validées : Redeye Watcher, Broadhead, Scrapper blessé, Scrapper standard / intact.
- Ajout du classement automatique des Actors dans `Menace 1` et `Menace 2`.
- Ajout des sélections `Toutes les machines`, `Toutes les Menace 1` et `Toutes les Menace 2`.
- Redeye Watcher : 24 PV max, DEF 11, ATQ +4, œil rouge 4 PV, Rayon rouge, Cri d’alerte renforcé et Marquage optique.
- Broadhead : 26 PV max, DEF 11, ATQ +4, ruade 15 m et Charge de troupeau (Réflexes DD 13).
- Scrapper blessé : 24 PV max, DEF 11, ATQ +3, batterie instable Choc 1d6 / 1,5 m / DD 13, châssis abîmé et Cri parasite.
- Scrapper standard / intact : 29 PV max, DEF 12 grâce au châssis compact +2, ATQ +4 ; traité comme Menace 2 haute dans les notes tout en conservant la valeur numérique 2 du template.
- Les valeurs source non représentables directement par le template (ex. recharge `Scène`) sont conservées dans les notes au lieu d’être inventées.
- Conservation de l’intégration prioritaire H0D Template Manager et des sécurités de génération de la v0.3.x.

## 0.3.1

- Remplacement des anciennes données Menace 1 par le bestiaire Foundry validé.
- Liste canonique : Grazer de rite, Watcher standard, Strider standard, Burrower simple, Grazer sauvage.
- Retrait de l'ancienne définition Grazer adulte au profit du Grazer sauvage.
- Retrait de l'ancienne définition Strider jeune au profit du Strider standard.
- Tous les Actors Menace 1 utilisent désormais DEF corps 9 ; le +1 DEF provient explicitement du châssis.
- Mise à jour complète des PV corps / pièces / max, sauvegardes, DD, vitesses, comportements, pièces et attaques.
- Grazer de rite : 19 PV max ; cornes à 1 PV ; quatre réservoirs Blaze à 2 PV ; châssis léger 2 PV/+1 DEF ; ruade 12 m.
- Watcher standard : 16 PV max ; œil 2 PV ; module d'alerte 2 PV ; queue 2 PV ; deux pattes 1 PV ; châssis 1 PV/+1 DEF ; ajout Scan optique.
- Strider standard : 18 PV max ; module tête, batterie arrière Choc, quatre pattes, châssis de course ; DD piratage 14 ; ajout Embardée.
- Burrower simple : 16 PV max ; œil, module dorsal, queue, quatre pattes, châssis fouisseur ; initiative +2 ; ajout Jaillissement et Cri de détection.
- Grazer sauvage : 21 PV max ; châssis renforcé 3 PV/+1 DEF ; ajout Charge en troupeau (Réflexes DD 12).
- Les explosions de réservoir Blaze utilisent désormais DD 12 conformément aux fiches validées.
- Ajout de la surcharge Choc de la batterie arrière du Strider.
- Les modes source absents du template Arme Machine (Mouvement, Réaction/défense, Collective) sont représentés comme techniques compatibles et conservés dans les notes.
- Intégration prioritaire de l'API **H0D Template Manager** pour récupérer les templates canoniques Machine / Pièce / Arme Machine.
- Conservation d'un fallback structurel si Template Manager est désactivé.
- Migration de clés générées : `strider-jeune` → `strider-standard` et `grazer-adulte` → `grazer-sauvage`.
- Les Items générés devenus obsolètes ne sont plus embarqués dans les Actors nouvellement assemblés.
- Le mode Mise à jour continue de préserver les images personnalisées.
- Version de la fenêtre et de la console mise à jour en 0.3.1.

## 0.3.0

- Correction majeure de la génération des Actors Machine : un template PJ ne peut plus être sélectionné comme template Machine.
- Validation structurelle obligatoire du template Machine par les `itemContainer` `H0D_Machine_Composants_Container` et `H0D_Machine_Armes_Container`.
- Synchronisation CSB en deux phases : application du template puis réinjection des `system.props`.
- Correction des attaques spéciales : `H0D_ArmeMachine_Attaque_Speciale` est forcé après initialisation du template.
- Les armes et attaques de machine sont forcées avec `H0D_ArmeMachine_Compte_PV = false`.
- Conservation des images personnalisées des pièces et attaques en mode Mise à jour.
- Ajout d'une vérification post-génération des valeurs importantes de l'Actor.

## 0.2.3

- Suppression du message de validation PV affiché pour Grazer adulte.

## 0.2.2

- Correction de la sélection des templates CSB et rejet des faux positifs.

## 0.2.1

- Correction de la synchronisation des templates Custom System Builder.

## 0.2.0

- Menace 1 complète.
- Bibliothèque automatique de pièces et attaques.
- Assemblage automatique des machines avec leurs Items embarqués.
