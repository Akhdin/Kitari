        // création du canva
        var game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        var map;
        var tiles;
        var fond;
        var player;
        var platforms;
        var cursors;
        var stars;
        var music;
        var score = 0;
        var scoreText;
        var playing = false;
        var button;
        var life = 100;
        var lifebarText;
        var power = 0;
        var powerText;
        var aliens;

        game.hurtSnd = game.add.audio('coinsnd');



        // charge les assets
        function preload() {

            game.load.image('fond', 'assets/images/fond2.png');
            game.load.image('ground', 'assets/images/platform2.png');
            game.load.image('sol', 'assets/images/platform4.png');
            game.load.image('star', 'assets/images/diamond.png');
            game.load.spritesheet('dude', 'assets/images/foxyfree1.png', 64.5, 54, 8);
            game.load.spritesheet('invader', 'assets/images/invader32x32x4.png', 32, 32);
            game.load.tilemap('map', 'tiled/1eremap.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', 'spriteground1.jpg');
            game.load.audio('boden', ['assets/audio/narusong2.mp3']);
            game.load.audio('jump', ['assets/audio/jump4.wav']);
            game.load.audio("coinsnd", "assets/audio/keepcoins2.wav");
            game.load.spritesheet('button', 'assets/buttons/button2.png', 193, 71);
            game.load.image('hearts', 'assets/images/hearts.png');


        }






        function create() {


            /* music*/
            music = game.sound.play('boden');

            music.onDecoded.add(start, this);

            /*fin music*/

            game.physics.startSystem(Phaser.Physics.ARCADE);

            map = game.add.tilemap('map');

            game.world.setBounds(0, 0, 7000, 0);

            fond = game.add.tileSprite(0, 0, 8000, 1000, 'fond');

            //  active la physique du jeu (système Arcade Physics)
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  affiche le background
            game.add.sprite(0, 0, 'fond');

            //  groupe avec le sol et les plateformes
            platforms = game.add.group();

            //  toute plateforme créé a une physique
            platforms.enableBody = true;

            // création, position du sol
            var ground = platforms.create(0, game.world.height - 98, 'sol');

            //  echelle du sol
            ground.scale.setTo(20, 5);

            //  stabilise la platforme quand on saute dessus
            ground.body.immovable = true;



            // création des platformes
            var ledge = platforms.create(120, 400, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(510, 310, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(820, 410, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(650, 200, 'ground');
            ledge.body.immovable = true;


            ledge = platforms.create(1280, 320, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(1250, 120, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(1500, 320, 'ground');
            ledge.body.immovable = true;



            // le personnage et les  réglages du personnage
            player = game.add.sprite(35, game.world.height - 154, 'dude');



            //  activer la physique sur le personnage
            game.physics.arcade.enable(player);


            //  propriétés physique du personnage
            player.body.bounce.y = 0.1;
            player.body.gravity.y = 1500;
            player.body.collideWorldBounds = true;




            // spritesheet mouvement gauche et droite
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [4, 5, 6, 7], 10, true);
            player.health = 100;


            //  affiche les etoiles
            stars = game.add.group();


            //  physique des etoiles
            stars.enableBody = true;


            //  création des étoiles
            for (var i = 0; i < 100; i++) {
                //  créé une étoile pour le groupe "stars"
                var star = stars.create(i * 200, 10, 'star');

                //  gravité des étoiles
                star.body.gravity.y = 1100;

                //  rebonds des étoiles aléatoires
                star.body.bounce.y = 0.3 + Math.random() * 0.5;
            }

            //  active le clavier pour deplacer le personnage
            cursors = game.input.keyboard.createCursorKeys();




            //score heart and power
            scoreText = game.add.text(50, 32, 'score: 0', {
                fontSize: '25px',
                fill: 'white'
            });

            lifebarText = game.add.text(50, 62, 'life: 100', {
                fontSize: '25px',
                fill: 'white'
            });

            powerText = game.add.text(50, 92, 'power: 0', {
                fontSize: '25px',
                fill: 'white'
            });



            //bouton home
            button = game.add.button(game.world.centerY - -250, 530, 'button',
                actionOnClick, this, 2, 1, 0);


            //camera bouton et score fixé a l'écran
            scoreText.fixedToCamera = true;
            button.fixedToCamera = true;
            game.camera.follow(player);
            lifebarText.fixedToCamera = true;
            powerText.fixedToCamera = true;


            //ennemie slug
            aliens = game.add.group();
            aliens.enableBody = true;
            aliens.physicsBodyType = Phaser.Physics.ARCADE;

            createAliens();

            //hover du bouton
            button.onInputOver.add(over, this);


        }


        function createAliens() {

            for (var y = 1; y < 2; y++) {
                for (var x = 0; x < 1; x++) {
                    var alien = aliens.create(x * 200, y * 40, 'invader');
                    alien.anchor.setTo(0.5, 0.5);
                    alien.animations.add('fly', [0, 1, 2, 3], 20, true);
                    alien.play('fly');
                    alien.body.moves = false;
                }
            }

            aliens.x = 50;
            aliens.y = 50;

            //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
            var tween = game.add.tween(aliens).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);


            //  When the tween loops it calls descend
            tween.onLoop.add(descend, this);

        }








        function actionOnClick() {

            window.location.href = "https://akhdin.github.io/Fox-soul-accueil/";

        }



        function changeVolume(pointer) {

            if (pointer.y < 100) {
                music.mute = false;
            } else if (pointer.y < 300) {
                music.volume += 0.1;
            } else {
                music.volume -= 0.1;
            }

        }


        function update() {


            //  physique entre le personnage + etoiles et les platformes
            game.physics.arcade.collide(player, platforms);
            game.physics.arcade.collide(stars, platforms);
            // game.physics.arcade.collide(player, aliens);


            //  Appel la function collectStar
            game.physics.arcade.overlap(player, stars, collectStar, null, this, );
            game.physics.arcade.overlap(player, aliens, collideAliens, null, this, );

            //  initialise les mouvement du personnage
            player.body.velocity.x = 0;

            if (cursors.left.isDown) {
                //  vers la gauche + vitesse
                player.body.velocity.x = -350;

                player.animations.play('left');
            } else if (cursors.right.isDown) {
                //  vers la droite + vitesse
                player.body.velocity.x = 350;

                player.animations.play('right');
            } else {
                //  a l'arret
                player.animations.stop();

                player.frame = 5;
            }

            //  Jump and sound
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -650;

                var snd = game.add.audio("jump");
                snd.play();


            }

        }


        function collectStar(player, star) {

            // collecte les etoiles et sound
            star.kill();
            var coins = game.add.audio("coinsnd");
            coins.play();
            score += 100;
            life += -10;
            power += 5;


            scoreText.text = 'Score: ' + score;
            lifebarText.text = 'life :' + life;
            powerText.text = 'power :' + power;
        }


        function start() {



        }

        function collideAliens(player, alien) {


            console.log('player : ', player);
            console.log('aliens : ', alien);
            if (player.y > alien.y) {
                alien.kill();
            } else {
                player.kill();
            }


        }