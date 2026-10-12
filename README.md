# H0D Machine Builder

Module personnel pour **JDR Zero Dawn**, prévu pour **Foundry VTT v14** avec **Custom System Builder 6.x**.

## Version 0.4.0 — Menaces 1 à 3

La v0.7.1 conserve les cinq machines Menace 1 de la v0.3.1 et ajoute les quatre fiches Menace 2 validées :

- Redeye Watcher
- Broadhead
- Scrapper blessé
- Scrapper standard / intact

La règle commune reste : **PV max = PV corps + PV des pièces comptées**. Le bonus de DEF globale provient du châssis. Pour la Menace 2, la DEF intacte est normalement 11 ; le Scrapper standard/intact monte à 12 grâce à son châssis compact +2.

## Deux fonctions

### 1. Bibliothèque de composants

Le module alimente le compendium monde :

**H0D — Composants Machines**

Chaque machine reçoit deux sous-dossiers : **Pièces** et **Armes**.

Le mode **Mettre à jour** conserve les images personnalisées déjà attribuées aux pièces et attaques. Les anciens Items générés devenus obsolètes peuvent rester dans le compendium comme historique, mais ils ne sont plus embarqués dans les nouvelles machines assemblées.

### 2. Machine complète

L'action **Assembler machine complète** crée ou met à jour les Actors dans :

```text
Acteurs
└── H0D — Machines assemblées
    ├── Menace 1
    └── Menace 2
```

L'Actor reçoit automatiquement ses valeurs, ses pièces et ses attaques.

## Intégration H0D Template Manager

Si **H0D Template Manager v0.3.0+** est actif, Machine Builder utilise en priorité son API comme source canonique :

- `actor-machine`
- `item-piece-machine`
- `item-arme-machine`

Si Template Manager est absent, le Builder conserve sa détection structurelle de secours.

## Menace 1

| Machine | Corps | Pièces | PV max | DEF intacte | ATQ |
|---|---:|---:|---:|---:|---:|
| Grazer de rite | 7 | 12 | 19 | 10 | +3 |
| Watcher standard | 7 | 9 | 16 | 10 | +3 |
| Strider standard | 8 | 10 | 18 | 10 | +3 |
| Burrower simple | 5 | 11 | 16 | 10 | +3 |
| Grazer sauvage | 8 | 13 | 21 | 10 | +3 |

## Menace 2

| Machine | Corps | Pièces | PV max | DEF intacte | ATQ | Init |
|---|---:|---:|---:|---:|---:|---:|
| Redeye Watcher | 10 | 14 | 24 | 11 | +4 | +3 |
| Broadhead | 10 | 16 | 26 | 11 | +4 | +1 |
| Scrapper blessé | 9 | 15 | 24 | 11 | +3 | +1 |
| Scrapper standard / intact | 11 | 18 | 29 | 12 | +4 | +2 |

### Particularités Menace 2

- Redeye Watcher : œil rouge servant de capteur et d'arme à distance ; Rayon rouge, Cri d'alerte renforcé et Marquage optique.
- Broadhead : ruade lourde sur 15 m et Charge de troupeau à Réflexes DD 13.
- Scrapper blessé : batterie instable Choc, châssis abîmé, signal ELYSIUM perturbé et Cri parasite.
- Scrapper standard / intact : Menace 2 haute, châssis compact +2 DEF, 29 PV max.

Quand la fiche source emploie une valeur non représentable directement par le template (par exemple une recharge « Scène »), le Builder conserve l'information dans les notes au lieu de l'inventer.

## Sécurités

- sélection stricte du template Machine ;
- rejet des templates PJ ;
- priorité au H0D Template Manager ;
- application CSB en deux phases ;
- réinjection des `system.props` après le template ;
- attaques spéciales réellement cochées ;
- armes/attaques exclues du calcul des PV globaux ;
- vérification des valeurs essentielles après assemblage ;
- conservation des images personnalisées en mode **Mettre à jour** ;
- classement automatique des Actors par niveau de Menace.

## Utilisation

La macro MJ **H0D — Générateur composants** ouvre le panneau du module.

Choisir :

- l'action ;
- **Toutes les machines**, **Toutes les Menace 1**, **Toutes les Menace 2**, ou une machine précise ;
- la gestion des doublons : Mettre à jour / Ignorer / Recréer.

## Installation The Forge / GitHub

Manifeste de la dernière release :

```text
https://github.com/freeberserk/h0d-machine-builder/releases/latest/download/module.json
```


## Menace 3 — v0.7.1
Machines ajoutées :
- Dent de Scie d'Aloy — spéciale / monture improvisée
- Lancehorn
- Longleg
- Scrounger
- Récolteur ELYS
- Tisseur ELYS-9

Les règles de la fiche Menace 3 sont conservées :
PV max = corps + pièces ; dégâts aux pièces sans transfert automatique au corps ;
bonus DEF issus des châssis / plaques ; batteries et réservoirs ne déclenchent leur
surcharge que dans les conditions prévues par la fiche source.

## Correctif v0.7.1 — Items embarqués
Foundry / Custom System Builder peut réordonner les Items pendant leur création,
notamment lorsqu'ils sont distribués entre plusieurs `itemContainer`.

La v0.5.0 réappliquait les templates par position dans le tableau, ce qui pouvait
mettre un template d'arme sur une pièce et inversement.

La v0.7.1 associe chaque Item par `kind + nom`, puis contrôle après génération
que toutes les pièces et attaques utilisent leur famille de template correcte.


## v0.7.1 — Tailles de tokens canoniques

Le Machine Builder applique maintenant automatiquement l'empreinte Foundry :

| Catégorie H0D | Token |
| --- | --- |
| Petite | 1 × 1 |
| Moyenne | 2 × 2 |
| Lourde | 3 × 3 |
| Titan / très lourde | 4 × 4 |
| Prototype / boss | taille explicite dans la fiche |

`Prototype / boss` n'est volontairement pas converti en taille fixe : une future
machine prototype doit fournir `actor.tokenSize`. Cette valeur peut être un nombre
pour un token carré ou `{width, height}` pour une empreinte particulière.

Lors d'une mise à jour d'une machine déjà générée, le prototype token est corrigé.
Les tokens déjà placés dans les scènes et liés à cet Actor sont également
synchronisés à la taille canonique.


## v0.7.1 — Intégrité v2
- chaque pièce générée reçoit une `H0D_Composant_Zone` ;
- les châssis, blindages, plaques et pièces apportant de la DEF sont marqués `H0D_Composant_Protection_Corps=true` ;
- le Builder exige les templates Machine v4.0 / Pièce v3.0 du Template Manager v0.4.0 ;
- les PV totaux historiques du bestiaire ne changent pas.


## Intégrité v2 / Template Manager 1.3

Le Builder renseigne automatiquement :
- `H0D_Composant_Zone`
- `H0D_Composant_Protection_Corps`

Les châssis, blindages/plaques/carapaces et les pièces apportant un bonus de DEF sont considérés
comme protections du corps. Les PV globaux historiques des machines ne sont pas modifiés.


## v0.8.0 — Chaîne canonique des pièces

Le Builder initialise maintenant la partie **récupération** de chaque pièce au moment de sa création.

Chaîne attendue :

```text
Machine Builder
  → PV max / PV actuels + État Intact
  → Machine Health Manager fait évoluer PV + État
  → H0D Loot lit l'état réel final et le rendement de récupération
```

Pour une pièce détachable/récupérable, `H0D_Composant_Loot` reçoit la ressource secondaire canonique lorsque celle-ci peut être déterminée. Les champs déjà présents du template Pièce v2.6 sont utilisés : aucun nouveau template n'est nécessaire.

Le Builder n'invente pas l'élément d'un réservoir ambigu : la validation le signale afin qu'il puisse être précisé plus tard avec un `loot` explicite dans sa définition.
