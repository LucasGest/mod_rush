# Mod Rush

Le concept : la roulette tire un mod au hasard, puis il faut obtenir **tous** les objets de ce mod, chrono lancé.

Le projet contient deux pages :

- `index.html` est le **panneau de contrôle**. Tu y lances le tirage, tu coches les objets obtenus et tu importes tes mods.
- `overlay.html` est l'**overlay** affiché sur le stream. Il a un fond transparent et ne demande aucune interaction.

## Mettre en ligne sur Vercel

Le site est statique, il n'y a rien à compiler.

- **Avec GitHub** : pousse ce dossier dans un dépôt, puis sur vercel.com fais « Add New → Project » et importe le dépôt. Laisse Framework Preset sur « Other ».
- **En ligne de commande** : dans ce dossier, lance `npx vercel`, puis `npx vercel --prod`.

## Brancher OBS

Les deux pages communiquent par le stockage du navigateur. Elles doivent donc **toutes les deux tourner dans OBS**. Le navigateur d'OBS et Chrome ne partagent pas leurs données.

1. **Panneau de contrôle** : dans OBS, va dans *Docks → Docks de navigateur personnalisés*. Ajoute un dock nommé `Mod Rush` avec l'URL `https://ton-site.vercel.app/`.
2. **Overlay** : dans ta scène, ajoute une *Source navigateur* avec l'URL `https://ton-site.vercel.app/overlay.html`, en 1920 × 1080. Coche « Contrôler l'audio via OBS » si tu veux récupérer les sons.
3. En haut du dock, le voyant doit passer au vert (« overlay connecté »). S'il reste rouge, rafraîchis la source navigateur.

Tu peux régler l'overlay en ajoutant des options à la fin de l'URL :

- `?pos=br` place la carte dans un coin : `bl` (par défaut), `br`, `tl` ou `tr`.
- `&scale=1.2` change la taille de la carte (de 0.5 à 2).
- `&sound=0` coupe les sons de l'overlay.

## Importer les listes complètes des mods

Dans le dock, clique sur **Importer des mods (.jar)** et choisis le dossier `mods` de ton instance. Dans CurseForge, fais un clic droit sur le modpack puis « Open Folder » pour le trouver.

La page lit le fichier de traduction de chaque `.jar`, ce qui lui donne **tous les objets et blocs** du mod, nommés en français quand la traduction existe. Elle récupère aussi les icônes quand elles sont trouvées. Les librairies sans objets sont ignorées, et tout reste sur ton PC.

Fais l'import **depuis le dock OBS**, pas depuis Chrome, pour que l'overlay voie la même liste.

Limites à connaître :

- Quelques blocs techniques peuvent apparaître dans la liste alors qu'ils n'existent pas comme objet en survie. Les objets réservés au créatif sont aussi listés. Tu peux les retirer dans « Modifier la liste ».
- Les objets générés par des données (par exemple certains minerais ou matériaux de Tinkers) peuvent manquer s'ils n'ont pas leur propre ligne de traduction.
