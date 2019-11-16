### 16/11/2019 - Rapport d’avancement pour le Kick-Off du troisième sprint

Pour ce début de troisième sprint, nous avons recruté un nouveau membre dans notre équipe afin de nous aider à continuer d'avancer dans le projet. Afin de correctement l'intégrer dans notre groupe, nous avons décidé d'attendre le prochain sprint avant de recruter une nouvelle personne.

Dans le but de faciliter la création du PLD ainsi que la mise en relation de son contenu et de nos issues présentes sur GitLab, nous avons décidé de le générer directement depuis l'api de GitLab. Cela nous permet de passer moins de temps à maintenir et mettre à jour notre PLD ainsi qu'à le rendre plus qualitatif car plus proche de nos issues. Cela nous aide également à avoir des issues bien construites puisqu'elle respectent maintenant la structure des cartes du PLD, en comprenant une story ainsi que des définitions of done. Le PLD comporte désormais un code couleur pour les cartes (rouge : "à faire", orange : "en cours" et vert : "fait"), ainsi que des définitions of done avec des cases cochées ou non en fonction de leur état d'avancement. Toutes les informations nécéssaires y sont présentes et seule la mise en page à l'aide de CSS reste à faire.

Le but principal de ce sprint sera de remettre notre projet sur la bonne voie, après un second sprint légèrement chaotique du au départ de deux de nos membres. L'un de nos objectifs le plus critique sera de mettre en place une nouvelle version du serveur écrite en C# afin d'avoir de nouveau une pleine maîtrise de celui-ci, en effet les deux personnes responsables de celui-ci étant les mêmes personnes ayant quitté notre équipe. Le nouveau serveur en C# nous permettra également d’utiliser des structures de données communes entre le client et le serveur, ce qui devrai faciliter le développement.

---

### 14/10/2019 - Rapport d’avancement pour le Delivery du second sprint

Après un début difficile sur le second sprint, nous avons organisé plusieurs réunions afin de discuter de l’avenir du groupe. À l’unanimité, les membres encore présents ont exprimé leur souhait de poursuivre le projet malgré les difficultés que cela pouvait représenter. Un début de réorganisation s’est opéré, des postes plus polyvalents sont considérés et Paul Laffitte prend en charge la responsabilité de chef de groupe.

Les réalisations sont :

- Ethan:
	- Client : Création de préfabs d’UI - **1** J/H
	- Client : Finitions sur le UI Layout System - **1** J/H
	- Client : Ajout d’un menu des paramètres - **3** J/H
- Pierre:
	- Client : Retour visuel lors du loot - **4** J/H
	- Client : Correction d’un bug faisant disparaître les objets de la map à la fin d’un combat - **1** J/H
- Paul:
	- Client : Réparation de l’éditeur de code - **1** J/H
	- Admin : Correction des redirections et de l’utilisation des ports - **1** J/H
	- Admin : Création de sous-domaines spécifiques à l’api et aux comptes - **1** J/H
	- Autre : Outil de génération de PLD à partir des issues Gitlab (en cours) - **2** J/H
	- Autre : Réorganisation des issues et des milestones Gitlab - **0.5** J/H
	- Autre : PLD - **0.5** J/H
- Guillaume:
	- Client: Afficher le hall d’entrée de la même façon qu’une autre zone - **3** J/H
	- Client: Amélioration de l’UX de l’éditeur de zones - **3** J/H
	- Serveur: Conception du hall d’entrée - **4** J/H

Un recrutement est prévu dans l’objectif de rééquilibrer les effectifs ainsi que la charge de
travail.

---

### 21/09/2019 - Rapport d’avancement pour le Follow-up du second sprint

La période s’étalant du Kick-Off au Follow-Up du second sprint s’est avéré pour le moins chaotique, deux membres de notre équipe ayant décidé de quitter le navire (Thomas Arbona et Arthur Chaloin). Le reste de l’équipe s’est retrouvé désemparé car privé d’un chef de projet et soucieux de l’avenir du projet, ne pouvant pas le valider à quatre, en plus de la charge de travail d’autant plus importante. L’équipe a vu sa motivation au plus bas et la qualité ainsi que la quantité de travail s’en est fait ressentir.

Les réalisations sont :

- Arthur:
	- Server : Utilisation des statistiques du joueur dans les combats - **1** J/H
- Paul:
	- Client : Refonte graphique du chat et de l’éditeur de code - **2** J/H
- Thomas:
	- Server : Début de tests unitaires - **1** J/H
- Ethan:
	- Client : Déplacement des fenêtres - **1** J/H
	- Client : Système de layout (bouton / checkbox) - **1** J/H
- Pierre:
	- Autre : Document de game design - **1** J/H

---

### 17/07/2019 - Rapport d’avancement pour le Kick-Off du second sprint

Pour le Kick-Off de notre second sprint, nous avons mis en place de multiples méthodes et
éléments techniques inspirés de la méthode Scrum pour mieux encadrer les perspectives et
objectifs de cette période de travail.

Ces méthodes et éléments techniques ont été, dans l’ordre chronologique :

- La mise en place d’un **Trello** afin de faire un **brainstorming** d’idées. Chacun a marqué les idées qu’il pouvait avoir concernant les fonctionnalités à implémenter dans une première colonne. Ensuite, les idées ont été triées en trois colonnes :
	- **Court terme** (Fonctionnalités à implémenter dans le sprint courant ou dans le prochain).
	- **Moyen terme** (Fonctionnalités nécessaires à l’obtention d’une version de jeu présentable au public sous forme de beta).
	- **Long terme** (Fonctionnalité non prioritaires).

- Un tri des idées à court terme afin de former un bloc cohérent. Nous avons choisi un thème interne afin de garder un objectif concret : **L’implémentation des Stats**. Ce thème n’est pas restrictif mais reste défini ; des tâches annexes n’ayant pas de rapport ont été ajoutées, mais ces dernières restent minoritaires dans le sprint.\
Ce thème implique donc :
	- La définition et l’implémentation des Statistiques d’un personnage pouvant
	combattre côté serveur puis client.
	- L’implémentation d’objets permettant de **modifier les Statistiques**.
	- La **synchronisation** et la **persistance des données** côté serveur.

- L’assignation des tâches sous la forme d’**Issues** dans notre **GitLab**, et l’estimation de leur durée. Etant donné notre mode de fonctionnement en **mini-sprints d’une semaine** dans notre équipe, les issues sont classées en fonction de leur degré de complétion : **Open** (pas dans le mini-sprint), **To Do** (à faire), **Doing** (une branche active contient notre travail), **To Review** (à tester), **Done** (complété).

---

### 17/06/2019 - Rapport d’avancement pour le Delivery du premier sprint

Pour le Delivery de notre premier sprint, nous sommes parvenus à \~70% de complétion des tâches.

Les réalisations sont :

- Thomas :
	- Game : UI standardisée - **2,5** J/H
	- Server : Charger le contenu du lobby depuis le content - **1** J/H
	- Server : Correction d’une erreur d’encodage - **0,5** J/H
- Paul :
	- Backoffice : Finitions et corrections - **1,5** /H
	- Website : UI de connexion - **0,5** J/H
	- Game : UI de connexion - **0,5** J/H
	- Global : Authentification - **2,5** J/H
	- Autre : PLD & Proposition de milestone - **0,5** J/H
	- Backoffice : Fix d’un bug de lancement de l’assistant de configuration - **0,5** J/H
- Arthur :
	- Website : Création d’un site web public - **2** J/H
	- Game : Implémentation CI / CD - **2** J/H
	- Website : Implémentation CI / CD - **0,5** J/H
	- Website : Implémentation de l’inscription - **1** J/H
- Pierre :
	- Game : Retour visuel pour le loot - **4** J/H
	- Game : Communication de la position au serveur - **1** J/H
- Ethan :
	- Game : Interface utilisateur, drag’n’drop - **1** J/H
- Guillaume :
	- Game : Editeur de niveaux - **4** J/H

Pour cette seconde partie de sprint, nous avons étés plus structurés dans notre méthode de travail, nous avons mis en place plusieurs sous-sprints d’une semaine chacun.

---

### 24/05/2019 - Rapport d’avancement pour le Follow Up du premier sprint

Lors du follow up de notre premier sprint, nous sommes parvenus à \~35% de complétion des
tâches.

Les réalisations sont :

- Ethan :
	- Game : Inventaire et système de drag and drop (en cours de réalisation) - **4** J/H
	- Guillaume :
	- Game : Editeur de niveaux (en cours de réalisation) - **3** J/H
- Pierre
	- Game : Réécriture et optimisation des communications avec le serveur - **3** J/H
- Thomas :
	- Serveur : Apparition d’objets en fin de combat - **1** J/H
	- Serveur : Correction de bugs causés par Judge0 (utilisé pour tester le code
	envoyé par les utilisateurs), non prévu - **1** J/H
	- Serveur : Correction d’un bug provoquant la perte d’objets équipés - **1** J/H
- Arthur
	- Serveur : Correction des tests unitaires - **2** J/H
	- Backend : Mise en place de l’intégration et du déploiement continu - **1** J/H
	- Backend : Base d’une mise en production - **2** J/H
	- Autre : Mise en place d’une page de documentation pour Kubernetes - **0,5** J/H
- Paul :
	- Backoffice : Un backoffice (en cours de réalisation) - **4** J/H
	- Backend : Mise en place d’une base de données - **1** J/H
	- Backend : Authentification (en cours de réalisation) - **2** J/H
	- Backoffice : Assistant d’installation - **1** J/H

Pour la seconde partie de ce sprint, nous comptons être encore plus structurés dans notre
méthode de travail, et nous allons mettre en place plusieurs sous-sprints de une à deux
semaines.

---

### 31/03/2019 - Rapport d’avancement pour le Kick Off du premier sprint

Lors de la Forward, nous avons pu créer un prototype permettant à un utilisateur :

- De se connecter sur le client avec un pseudonyme et un avatar
- De communiquer avec les autres joueurs par le biais d’un chat textuel
- De faire des donjons

Lors de sa connexion, le joueur arrive sur un salon virtuel, le “Lobby”, où il peut choisir le donjon
qu’il souhaite faire.

Les donjons sont composés de salles comportant chacune un exercice à résoudre par le biais
d’un éditeur de texte intégré au jeu. Le code du joueur est testé côté serveur et la porte pour la
salle suivante se déverrouille en cas de réussite de l’exercice.

Le joueur possède un compagnon (ou “Follower”), qui doit être scripté par le joueur afin qu’il
puisse participer à des combats. Jusqu’à quatre scripts de combat peuvent être enregistrés par
le joueur. Ces derniers sont modifiables.

Un donjon se termine par un “Boss”, qui est un ennemi à vaincre pour finir le donjon. Lors d’un
combat, le “Follower” du joueur va exécuter le premier script enregistré par le joueur. Il est
possible de changer le script exécuté par le “Follower” en combat.

Nous ne rencontrons pour le moment aucun problème d’organisation. Nous avons mis en place
différentes plateformes afin de respecter nos engagement et de permettre à n’importe lequel
des membres de notre groupe de mettre au courant les autres en cas de problèmes.

Les plateformes utilisées sont :

- Discord (pour les réunions en appel vocal)
- Messenger (pour des réponses textuelles rapides)
- Google Drive (Pour le partage et la modification de documents)