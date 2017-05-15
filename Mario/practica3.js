'use strict';
window.addEventListener("load", function() {
    var Q = window.Q = Quintus({ audioSupported: ['mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        .setup({ width: 320, height: 480 })
        .controls().touch()
        .enableSound();


    Q.load(["mario_small.png", "mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json", "princess.png", "mainTitle.png", "coin.png", "coin.json", "coin.mp3", "coin.ogg", "music_die.mp3", "music_die.ogg", "music_level_complete.mp3", "music_level_complete.ogg", "music_main.mp3", "music_main.ogg", "piranha.png", "piranha.json"], function() {
        Q.compileSheets("mario_small.png", "mario_small.json");
        Q.compileSheets("goomba.png", "goomba.json");
        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.compileSheets("coin.png", "coin.json");
        Q.compileSheets("piranha.png", "piranha.json");

    });



    Q.scene("level1", function(stage) {
        Q.stageTMX("level2.tmx", stage);
        stage.add("viewport");
        Q.audio.stop();

       
        stage.centerOn(150, 380);
        var mario = new Q.Mario({ x: 150, y: 380 });
        var goomba = new Q.Goomba({ x: 1050, y: 380 });
        var goomba2 = new Q.Goomba({ x: 500, y: 380 });
        var bloopa = new Q.Bloopa({ x: 320, y: 380 });
        var bloopa2 = new Q.Bloopa({ x: 1000, y: 380 });
        var princess = new Q.Princess({ x: 1700, y: 380 });
        var coin = new Q.Coin({ x: 250, y: 480 });
        var coin2 = new Q.Coin({ x: 700, y: 580 });
        var coin3 = new Q.Coin({ x: 1500, y: 500 });
        var piranha = new Q.Piranha({ x: 400, y: 380 });


        stage.insert(mario);
        stage.insert(goomba);
        stage.insert(bloopa);
        stage.insert(princess);
        stage.insert(coin);
        stage.insert(goomba2);
        stage.insert(bloopa2);
        stage.insert(coin2);
        stage.insert(coin3);
        stage.insert(piranha);
        stage.add("viewport").follow(mario);

        stage.viewport.offsetX = -125;
        stage.viewport.offsetY = 160;
        Q.state.reset({ vidas: 3, score: 0 });


    });

    Q.loadTMX("level2.tmx", function() {
        Q.stageScene("startGame");

    });


    Q.Sprite.extend("Mario", {
        init: function(p) {
            this._super(p, {
                sheet: "marioR",
                sprite: "mario_anim",
                speed: 250,
                jumpSpeed: -400,
                life: 3,
                caida: 380
            });

            this.add('2d, platformerControls,animation, tween');
        },

        step: function(dt) {

            if (this.p.x > 2000 || this.p.x < 0) {
                this.p.x = 150;
                this.p.y = 380;
                Q.state.dec("vidas", 1);
            }
            if (this.p.vx > 0) {
                this.play("walk_right");
            } else if (this.p.vx < 0) {
                this.play("walk_left");
            } else {
                this.play("stand_" + this.p.direction);
            }

            if (this.p.jumping && this.p.landed < 0) {
                this.play("jump_" + this.p.direction);
            }
            if (Q.state.p.vidas === 0) {
                this.del('platformerControls');
                Q.audio.play("music_die.mp3");
                this.play("death");

                this.animate({ y: this.p.caida }, 1, Q.Easing.Quadratic.Out, { callback: function() { Q.stage().pause(); } });
                Q.stageScene("endGame", 1, { label: "You Died" });

            }


        }
    });


    Q.Sprite.extend("Goomba", {
        init: function(p) {
            this._super(p, {
                sheet: "goomba",
                sprite: "goomba_anim",
                vx: 150
            });

            this.add('2d,aiBounce,animation, defaultEnemy');
            this.play("walk");

        }
    });

    Q.Sprite.extend("Bloopa", {
        init: function(p) {
            this._super(p, {
                sheet: "bloopa",
                sprite: "bloopa_anim",
                vy: -50
            });

            this.add('2d,aiBounce,animation, defaultEnemy');
            this.on("bump.bottom", this, "stomp");
        },
        stomp: function(collision) {
            this.play("jump");
            this.p.vy = -400; // make the player jump

        }

    });

    Q.Sprite.extend("Piranha", {
        init: function(p) {
            this._super(p, {
                sheet: "piranha",
                sprite: "piranha_anim",
                abierto: false
                  
            });

            this.add('2d,aiBounce,animation');

            //this.play("open");
            this.play("open");
            this.on("cambiar_o", function() {
                this.p.abierto = false;
            });
            this.on("cambiar_c", function() {
                this.p.abierto = true;

            });





            this.on("bump.top", function(collision) {
                if (collision.obj.isA("Mario") && (!this.p.abierto)) {
                    //this.play("death");
                    collision.obj.p.vy = -200;
                    this.destroy();

                } else if (collision.obj.isA("Mario") && (this.p.abierto)) {
                    Q.state.dec("vidas", 1);

                    if (Q.state.p.vidas != 0) {
                        collision.obj.p.x = 20;
                        collision.obj.p.y = 500;
                    } else {
                        collision.obj.p.caida = 320;
                        collision.obj.p.life = 0;
                    }
                }
            });


        }

      




    });

    Q.Sprite.extend("Princess", {
        init: function(p) {
            this._super(p, {
                asset: "princess.png"
            });

            this.add('2d, aiBounce');

            this.on("bump.left, bump.right, bump.bottom, bump.top", function(collision) {
                if (collision.obj.isA("Mario")) {
                    Q.stage().pause();
                    Q.audio.play("music_level_complete.mp3");
                    Q.stageScene("endGame", 1, { label: "You Win" });
                }
            });
        }
    });

    Q.Sprite.extend("Coin", {
        init: function(p) {
            this._super(p, {
                sheet: "coin",
                sprite: "coin_anim",
                gravity: 0
            });

            this.add('2d, animation, tween');

            this.on("bump.left, bump.right, bump.bottom, bump.top", function(collision) {
                if (collision.obj.isA("Mario")) {
                    Q.audio.play("coin.mp3");
                    this.del('2d');

                    this.animate({ y: this.p.y - 100 }, 1 / 4, Q.Easing.Quadratic.InOut, { callback: function() { this.destroy() } });
                    Q.state.inc("score", 1);
                }
            });
            this.play("coins");
        }
    });

    Q.component("defaultEnemy", {
        added: function() {
            this.entity.on("bump.left,bump.right", function(collision) {
                if (collision.obj.isA("Mario")) {
                    Q.state.dec("vidas", 1);
                    if (Q.state.p.vidas != 0) {
                        collision.obj.p.x = 20;
                        collision.obj.p.y = 500;
                    } else {
                        collision.obj.p.caida = 320;
                        collision.obj.p.life = 0;
                    }
                }
            });
            this.entity.on("bump.bottom", function(collision) {
                if (collision.obj.isA("Mario")) {
                    Q.state.dec("vidas", 1);
                    if (Q.state.p.vidas != 0) {
                        collision.obj.p.x = 20;
                        collision.obj.p.y = 500;
                    } else {
                        collision.obj.p.caida = 700;
                        collision.obj.p.life = 0;
                    }
                }
            });
            this.entity.on("bump.top", function(collision) {
                if (collision.obj.isA("Mario")) {
                    this.play("death");
                    collision.obj.p.vy = -200;
                    //this.destroy();

                }
            });
            this.entity.on("death", function() {
                this.destroy();
            });
        }
    });

    //animaciones
    Q.animations("mario_anim", {
        walk_right: { frames: [1, 2, 3], rate: 1 / 15, loop: true },
        walk_left: { frames: [15, 16, 17], rate: 1 / 15, loop: true },
        jump_right: { frames: [4], loop: false },
        jump_left: { frames: [18], loop: false },
        stand_right: { frames: [0], loop: false },
        stand_left: { frames: [14], loop: false },
        death: { frames: [12], rate: 1 / 3, loop: false }
    });
    Q.animations("goomba_anim", {
        walk: { frames: [0, 1], rate: 1 / 15 },
        death: { frames: [2], loop: false, rate: 1 / 15, trigger: "death" }
    });

    Q.animations("bloopa_anim", {
        jump: { frames: [0, 1, 0], rate: 1 / 4, loop: false },
        death: { frames: [0, 1, 2], loop: false, rate: 1 / 15, trigger: "death" }
    });
    Q.animations("coin_anim", {
        coins: { frames: [0, 1, 2], rate: 1 / 10 }
    });

    Q.animations("piranha_anim", {
        close: { frames: [0], rate: 5, next: 'open', trigger: "cambiar_c" },
        open: { frames: [1], rate: 5, next: 'close', trigger: "cambiar_o" }
    });

    Q.scene('score', function(stage) {
        var label = stage.insert(new Q.UI.Text({ x: 60, y: 0, label: "score: 0" }));
        Q.state.on("change.score", this, function(score) {
            label.p.label = "score: " + score;
        });
    });
    Q.scene('vidas', function(stage) {
        var label = stage.insert(new Q.UI.Text({ x: 260, y: 0, label: "vidas: 3" }));
        Q.state.on("change.vidas", this, function(vidas) {
            label.p.label = "vidas: " + vidas;
        });
    });


    Q.scene('endGame', function(stage) {

        var box = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "rgba(0,0,0,0.5)"
        }));

        var button = box.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "#CCCCCC",
            label: "Play Again"
        }))
        var label = box.insert(new Q.UI.Text({
            x: 10,
            y: -10 - button.p.h,
            label: stage.options.label
        }));
        button.on("click", function() {
            Q.clearStages();
            Q.stageScene("startGame");
        });
        Q.audio.stop('music_main.mp3');
        box.fit(20);


    });

    Q.scene('startGame', function(stage) {


        var box = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2
        }));

        var button = box.insert(new Q.UI.Button({ asset: "mainTitle.png" }));
        Q.input.on("confirm", button, function() {
            Q.clearStages();
            Q.stageScene("level1");
            Q.stageScene("score", 2);
            Q.stageScene("vidas", 3);
            Q.audio.play("music_main.mp3", { loop: true });

        });
        button.on("click", function() {
            Q.clearStages();
            Q.stageScene('level1');
            Q.stageScene("score", 2);
            Q.stageScene("vidas", 3);
            Q.audio.play("music_main.mp3", { loop: true });
        });


    });


});
