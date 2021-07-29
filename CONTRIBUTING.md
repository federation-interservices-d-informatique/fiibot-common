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

#### Règles pour les commits

Nous nous demandons de suivre le format suivant pour vos commits: `Sujet: Description`. Si votre message vous semble trop "flou", vous pouvez rajouter une description pour le clarifier. **Toute modification ne respectant pas ce format se verra rejetée et nous vous demanderons de modifier le noms de vos commits.**

> Note: La raison pricinpale de ces restrictions sont dues au fait que le journal de modifications est généré automatiquement à chaque version en fonction du format `sujet: description`

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

Merci à tout les contributeurs, peut importe la taille de la contribution.
