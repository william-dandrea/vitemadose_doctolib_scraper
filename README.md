## Script ayant pour objectif de trouver un rendez-vous pour se faire vacciner rapidement.

### Comment configurer le script 
Le script va parcourir une liste de centre de vaccination (que vous aurez défini vous) et va regarder tout les N secondes si un créneau s'est validé. 

Pour trouver la liste de liens, regardez la vidéo WATCHME.mp4, ensuite, récupérez le lien de la dernière page (ou il y a écrit "aucune dose disponible ...") et inserez le dans la liste "links" du fichier app.js. Ajoutez autant de lien que vous voulez.

Ensuite, indiquez un temps de rafraichissement, l'idéal est surement 25 (toutes les 25 secondes)

Ensuite, libre a vous de réimplémenter la fonction "actionWhenAppointment" pour que vous ayez une notification sur le fait qu'un rdv est disponible. Cette fonction est appelé au moment ou un rendez-vous est disponible

Enjoy:)

### Lancer le script

```npm run start```


### Auteur
D'Andreéa William
