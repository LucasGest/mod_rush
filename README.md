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
2. **Overlay** : dans ta scène, ajoute une *Source navigateur* avec l'URL `https://ton-site.vercel.app/overlay.html`, de préférence en 1920 × 1080 (l'overlay s'adapte à toute autre taille). Coche « Contrôler l'audio via OBS » si tu veux récupérer les sons.
3. En haut du dock, le voyant doit passer au vert (« overlay OBS connecté »). S'il affiche « overlay ouvert hors d'OBS », c'est un onglet de navigateur qui répond : ferme-le et rafraîchis la source navigateur dans OBS.

Si le panneau est ouvert dans Chrome au lieu d'OBS, un bandeau rouge te le signale.

Tu peux régler l'overlay en ajoutant des options à la fin de l'URL :

- `?pos=br` place la carte dans un coin : `bl` (par défaut), `br`, `tl` ou `tr`.
- `&scale=1.2` change la taille de la carte (de 0.5 à 2).
- `&sound=0` coupe les sons de l'overlay.
- `&ticker=0` masque le bandeau des objets à trouver en bas de l'écran.
- `&speed=120` règle la vitesse de défilement du bandeau, en pixels par seconde (90 par défaut).

## Modpack intégré

Le fichier `pack.json` contient les listes complètes et les icônes des 33 mods du profil ModRush. À la première ouverture du dock, la page le charge automatiquement : la roulette est prête sans rien importer. Pour le recharger plus tard, ouvre « Importer des mods (.jar) » et clique sur « Charger le modpack ModRush intégré au site ».

En haut du dock, « Mis à jour le … » donne la date de la version du site. Si elle ne change pas après une mise en ligne, actualise le dock dans OBS. Pense à changer `SITE_UPDATED` dans `common.js` à chaque mise en ligne.

Pendant un rush, le bouton **Retirer des objets** permet de supprimer définitivement d'un clic un objet impossible à obtenir en survie.

## Détection automatique depuis Minecraft

Le dock peut cocher les objets tout seul en lisant les statistiques de ton monde.

1. Dans le panneau **Détection Minecraft**, clique sur « Choisir le dossier de l'instance » et sélectionne le dossier de l'instance CurseForge (par exemple `D:\curseForge\Instances\ModRush`, celui qui contient `mods` et `saves`).
2. Accepte l'accès en lecture. Au démarrage suivant d'OBS, clique sur « Réactiver la détection » si la page le demande.

La liste de vérifications indique si tout est OK : dossier autorisé, monde trouvé, statistiques à jour, mods à jour, objets du mod détectables. Le voyant « jeu » en haut passe au vert quand tout va bien.

À savoir :

- Un objet est coché quand il est **ramassé, fabriqué, utilisé ou jeté** après le tirage. L'option « Ne compter que ce qui est obtenu après le tirage » ignore ce que tu avais déjà dans ce monde. Si tu crées un nouveau monde après le tirage, tout ce qui s'y passe compte.
- Minecraft n'écrit ses statistiques qu'aux **sauvegardes du monde** (automatiquement toutes les 5 minutes, et quand tu quittes le monde). Les objets apparaissent donc avec ce délai.
- Un objet sorti d'une machine moddée sans être ramassé ni fabriqué peut ne pas être compté : coche-le à la main.
- Si tu décoches un objet détecté, il ne sera recoché que si tu en obtiens un autre.

### Commandes en jeu

Une fois la détection active, tu peux piloter le dock depuis le chat de Minecraft, sans mod ni permission (cheats inutiles). Tape simplement le message :

- `!roulette` lance la roulette (refusé si un rush est en cours) ;
- `!abandon` abandonne le rush en cours ;
- `!pause` met en pause ou relance le chrono.

Le dock lit le chat dans `logs/latest.log` (réaction en 1 à 2 secondes). Seuls les messages du joueur connecté sur ce PC sont pris en compte, donc personne d'autre ne peut lancer ta roulette sur un serveur. Le message doit contenir uniquement la commande. La dernière commande reçue s'affiche dans la liste de vérifications.

### Mises à jour des mods

Toutes les 30 secondes, le dock compare les `.jar` du dossier `mods` à la dernière lecture. Quand un mod est mis à jour ou ajouté, sa liste d'objets, ses icônes et ses identifiants sont relus et fusionnés. Les objets apparus sont ajoutés et ceux qui ont disparu du mod sont retirés. Les objets et les mods que tu as retirés toi-même (« Retirer des objets » ou « Modifier la liste ») ne reviennent pas. Un mod supprimé de l'instance est signalé, mais il reste dans la roulette jusqu'à ce que tu le retires.

Ne vont pas dans la roulette : les librairies, les mods qui ont moins de 3 objets, et les **mods de structures**, c'est-à-dire ceux qui génèrent des structures et ont moins de 10 objets (Towns and Towers par exemple). Les mods d'aventure qui ont aussi des structures (Twilight Forest, Aether…) restent, car ils ont beaucoup d'objets. Pour retirer un autre mod, supprime sa section dans « Modifier la liste » : il ne reviendra pas.

## Importer les listes complètes des mods

Dans le dock, clique sur **Importer des mods (.jar)** et choisis le dossier `mods` de ton instance. Dans CurseForge, fais un clic droit sur le modpack puis « Open Folder » pour le trouver.

La page lit le fichier de traduction de chaque `.jar`, ce qui lui donne **tous les objets et blocs** du mod, nommés en anglais par défaut, comme dans le jeu. Tu peux choisir le français dans « Langue des noms » : la liste entière est alors renommée, sans perdre le rush en cours. Elle récupère aussi les icônes quand elles sont trouvées. Les librairies sans objets sont ignorées, et tout reste sur ton PC.

Fais l'import **depuis le dock OBS**, pas depuis Chrome, pour que l'overlay voie la même liste.

Limites à connaître :

- Quelques blocs techniques peuvent apparaître dans la liste alors qu'ils n'existent pas comme objet en survie. Les objets réservés au créatif sont aussi listés. Tu peux les retirer dans « Modifier la liste ».
- Les objets générés par des données (par exemple certains minerais ou matériaux de Tinkers) peuvent manquer s'ils n'ont pas leur propre ligne de traduction.

## Sécurité

Le site n'a ni serveur ni base de données : tout reste dans le navigateur d'OBS (localStorage + IndexedDB).

- `vercel.json` envoie les en-têtes de sécurité (CSP stricte, anti-clickjacking, `nosniff`, HSTS…). Les pages ont aussi une CSP en balise meta.
- Aucun script inline : le code est dans `common.js`, `panel.js` et `overlay.js`. JSZip est chargé avec une empreinte SRI.
- Tout ce qui vient des `.jar`, de `pack.json` ou du stockage est validé : noms nettoyés, icônes limitées aux PNG, état vérifié au chargement, taille des archives limitée.

Si tu ajoutes une librairie externe ou une nouvelle origine (police, API), mets à jour la CSP dans `vercel.json` **et** dans les balises meta des deux pages.
