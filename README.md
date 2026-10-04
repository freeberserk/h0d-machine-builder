# H0D Machine Builder

Module personnel pour la campagne **JDR Zero Dawn**, prévu pour **Foundry VTT v14** avec **Custom System Builder 6.x**.

## Version 0.1.0 — BAC-à-SABLE

Cette première version génère uniquement les composants et attaques de :

- **Grazer — Rite**
- **Strider jeune**

Le module crée automatiquement un compendium monde :

**H0D — Composants Machines**

avec cette organisation :

```text
Grazer — Rite
├── Pièces
└── Armes

Strider jeune
├── Pièces
└── Armes
```

Les images sont volontairement laissées libres afin d'être remplacées manuellement dans le compendium.

## Prérequis CSB

Les templates doivent déjà exister dans le monde :

- Pièce détachable : `H0DCompMach00001`
- Arme machine : `H0DWeaponMach001`

## Utilisation

À l'activation du module, une macro MJ est créée automatiquement :

**H0D — Générateur composants**

Elle propose :

- **Ignorer** les entrées existantes ;
- **Mettre à jour** leurs statistiques en conservant l'image personnalisée ;
- **Recréer** les entrées.

## Installation The Forge

Voir `INSTALL-FORGE.txt`.
