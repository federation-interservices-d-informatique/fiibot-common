# Contribuer

Toutes les contributions sont les bienvenues, cependant nous vous demandons de respecter quelques prérequis.

## Cas global

> Choses à vérifier dans tout les cas

### S'assurer que le code compile et est valide

Le premier prérequis, bien qu'il soit plutôt logique est de s'assurer que le code soit valide et que les tests soient fonctionnels. Ces tests seront également exécutés par GitHub actions avant que votre Pull Request soit acceptée.

#### Marche à suivre

```bash
npm install # Installation des dépendances
npm run build # Vérification du code TypeScript avec TSC
npm test # Exécution des tests
```

### Vérifier le formatage du code

Afin que le code soit lisible par tous et pousser certains test, `prettier` et `eslint` seront également utilisés. Ces tests seront également exécutés par GitHub Actions.

#### Marche à suivre

```bash
npm install
npm run lint
```

#### Correction automatique des différentes erreurs

**Certaines** erreurs peuvent être automatiquement corrigées par `prettier` ou `eslint`

```bash
npm install
npm run lint-fix
npm run format
```

n'oubliez pas de vous assurer que toutes les erreurs sont corrigées avant de proposer vos changements.

## Ajout de fonctionnalités / modifieations du code ajoutant des fonctions

Si vous souhaitez ajouter une fonctionnalité / des fonctions dans le code, nous vons demandons de documenter un minimum celles-ci en utilisant JSDoc.
