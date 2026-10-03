# Delta-Immo — site vitrine d'agence immobilière de prestige

Site statique (HTML, CSS et JavaScript sans dépendance ni étape de build), publié sur Netlify.

## Structure

| Fichier / dossier | Rôle |
| --- | --- |
| `index.html` | Accueil : slider plein écran, présentation, sélection de biens, services, témoignage |
| `portfolio.html` | Galerie des 12 biens, filtres par type, tri par prix, visionneuse plein écran |
| `informations.html` | L'agence : histoire, services, méthode en quatre étapes, questions fréquentes |
| `contact.html` | Coordonnées, horaires et formulaire branché sur **Netlify Forms** |
| `merci.html` | Page de confirmation après envoi du formulaire |
| `404.html` | Page d'erreur personnalisée (servie automatiquement par Netlify) |
| `mentions-legales.html` | Mentions légales et politique de données |
| `styles/main.css` | Design system partagé : palette, typographie, en-tête, pied de page, cartes, boutons |
| `styles/home.css`, `portfolio.css`, `informations.css`, `contact.css` | Styles propres à chaque page |
| `script/main.js` | Navigation mobile, en-tête au défilement, animations d'apparition |
| `script/home.js`, `portfolio.js`, `contact.js` | Slider, galerie/visionneuse, validation et envoi du formulaire |
| `ressources/` | Images (JPEG optimisés + variantes WebP), icônes SVG, favicon |
| `netlify.toml` | Dossier publié (`.`), en-têtes de sécurité et de cache |

## Déploiement Netlify

Aucune commande de build : le dossier publié est la racine du dépôt. Le site se redéploie à chaque
commit sur la branche de production du site Netlify lié au dépôt GitHub (ou par glisser-déposer du
dossier dans l'interface Netlify).

Le formulaire de contact utilise Netlify Forms (`data-netlify="true"`) : les messages apparaissent
dans l'onglet **Forms** du tableau de bord Netlify, où l'on peut activer les notifications par e-mail.

## Modifier le contenu

- **Biens** : chaque bien est un bloc `<article class="property">` dans `portfolio.html`
  (attributs `data-type`, `data-price`, `data-title`, `data-meta`, `data-price-label`).
  Les trois biens mis en avant sur l'accueil sont dans la section « Sélection du moment » de `index.html`.
- **Images** : déposer un JPEG dans `ressources/images-portfolio/` et, idéalement, une variante
  WebP de 900 px de large nommée `nom-900.webp` pour les cartes.
- **Coordonnées** : adresse, téléphone et e-mail figurent dans le pied de page de chaque page,
  dans `contact.html` et dans `mentions-legales.html`.

## Développement local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
