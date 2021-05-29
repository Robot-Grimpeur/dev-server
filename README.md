# Dev-server

Ce projet est le serveur de développement pour Raspberry Pi de notre projet. Combiné avec le dev-client, il offre un *REPL* et du *Live-Reload*. Ce projet est fait pour être installé sur *PiOS*.

## Installation

1. Connecter le Raspberry à internet
   1. Utiliser `raspi-config` pour configurer les options de connexion WiFi
   2. Exécuter `wpa_cli reconfigure && systemctl restart wpa_supplicant`
   3. Noter l'IP retournée par la commande `hostname -I | awk '{print $1}'`
2. Installer Node.js
   1. Exécuter `curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -`
   2. Exécuter `apt install -y nodejs`
3. Installer `rg-dev-server`
   1. Exécuter `npm i -g @robot-grimpeur/dev-server`
4. Créer le service
   1. Créer le fichier `/etc/systemd/system/rg-dev-server.service` et mettre le contenu suivant:
      ```
      [Unit]
      Description=Main service
      After=network.target
      StartLimitIntervalSec=0

      [Service]
      Type=simple
      Restart=always
      RestartSec=1
      User=root
      ExecStart=rg-dev-server

      [Install]
      WantedBy=multi-user.target
      ```
    2. Exécuter `systemctl start rg-dev-server && systemctl enable rg-dev-server`
5. Préparer une paire de clefs SSH pour l'usager `root`
   1. Créer la paire de clefs en exécutant `ssh-keygen -t ed25519` sur l'ordinateur client
   2. Modifier le `~/.ssh/config` du client pour y ajouter le contenu suivant
      ```
      Host %Nom de votre choix%
        HostName %Ip du Raspberry Pi%
        User root
        Port 22
        IdentityFile %Endroit où vous avez sauvegardé la clef privée%
      ```
    1. Sur le Raspberry Pi, créer le fichier `/root/.ssh/authorized_keys`
    2. Exécuter la commande `chmod -R 600 /root/.ssh/authorized_keys`
    3. Copier la clef publique dans le fichier `/root/.ssh/authorized_keys`
   