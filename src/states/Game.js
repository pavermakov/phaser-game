/* globals __DEV__ */
import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.LEVEL_VELOCITY = 220;
    this.WALL_SPAWN_POINTS = [
      { x: 50, y: -20 },
      { x: this.game.world.centerX, y: -20 },
      { x: this.game.world.width - 50, y: -20 }
    ];
    this.PREV_WALL_SPAWN_POINT = 0;
    this.PLAYER_SPAWN_POINTS = [
      { x: 50, y: this.game.world.height - 25 },
      { x: this.game.world.centerX, y: this.game.world.height - 25 },
      { x: this.game.world.width - 50, y: this.game.world.height - 25 }
    ];
    this.CURRENT_PLAYER_POINT = 1;
    this.IS_INPUT_DOWN = false;
    this.GAME_OVER = false;
    this.SCORE = 0;
    this.TEXT_STYLE = {
      font: '30px Arial',
      fill: '#fff'
    };
  }

  create() {
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.autoScroll(0, this.LEVEL_VELOCITY);

    // игрок
    this.player = this.game.add.sprite(this.PLAYER_SPAWN_POINTS[this.CURRENT_PLAYER_POINT].x, this.PLAYER_SPAWN_POINTS[this.CURRENT_PLAYER_POINT].y, 'avocado');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    // стены
    this.walls = this.game.add.group();
    this.walls.enableBody = true;

    // таймер, контролирующий появление стен
    this._createWall();
    this.wallTimer = this.game.time.events.loop(Phaser.Timer.SECOND, this._createWall, this);

    // таймер контролирующий скорость игры
    this.gameTimer = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this._levelUp, this);
  }

  update() {
    this.game.physics.arcade.overlap(this.player, this.walls, this._handleOverlap, null, this);

    if(this.game.input.activePointer.isDown && !this.IS_INPUT_DOWN && !this.GAME_OVER) {
      var targetX = this.game.input.activePointer.position.x;

      if(targetX > this.PLAYER_SPAWN_POINTS[this.CURRENT_PLAYER_POINT].x && this.CURRENT_PLAYER_POINT < 2) {
        this.CURRENT_PLAYER_POINT++;
      } else if(targetX < this.PLAYER_SPAWN_POINTS[this.CURRENT_PLAYER_POINT].x && this.CURRENT_PLAYER_POINT > 0) {
        this.CURRENT_PLAYER_POINT--;
      }

      this.player.position.x = this.PLAYER_SPAWN_POINTS[this.CURRENT_PLAYER_POINT].x;
      this.IS_INPUT_DOWN = true;
    }

    if(this.game.input.activePointer.isUp && !this.GAME_OVER) {
      this.IS_INPUT_DOWN = false;
    }
  }

  _createWall() {
    let spawnSpot = this.game.rnd.pick(this.WALL_SPAWN_POINTS);

    let wall = this.walls.getFirstExists(false);

    if(!wall) {
      wall = this.walls.create(spawnSpot.x, spawnSpot.y, 'wall');
    } else {
      wall.reset(spawnSpot.x, spawnSpot.y);
    }

    wall.anchor.setTo(0.5);
    wall.checkWorldBounds = true;
    wall.body.velocity.y = this.LEVEL_VELOCITY + 70;
    wall.events.onOutOfBounds.add(this._destroyWall, this);
  }

  _destroyWall(wall) {
    this.SCORE++;
    wall.kill();
  }

  _handleOverlap(player, wall){
    if(player.y > wall.top){
      this._gameOver();
    }
  }

  _levelUp() {
    this.wallTimer.delay *= 0.9;

    // this.LEVEL_VELOCITY *= 1.10;
    // this.walls.setAll('body.velocity.y', this.LEVEL_VELOCITY);
  }

  _gameOver() {
    this.GAME_OVER = true;
    this.game.time.events.removeAll();
    this.walls.setAll('body.enable', false);

    const bmd = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    bmd.ctx.fillStyle = "black";
    bmd.ctx.fillRect(0, 0, this.game.world.width,this.game.world.height);

    const overlay = this.game.add.sprite(0, 0, bmd);
    overlay.alpha = 0.8;

    // this.game.add.tween(this).to({y:0}, 1000, Phaser.Easing.Bounce.Out, true);

    const gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 40, 'GAME OVER', this.TEXT_STYLE);
    gameOverText.anchor.setTo(0.5);

    const scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, `YOUR SCORE: ${this.SCORE}`, this.TEXT_STYLE);
    scoreText.anchor.setTo(0.5);

    const playAgainText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 40, 'TAP TO PLAY AGAIN', this.TEXT_STYLE);
    playAgainText.anchor.setTo(0.5);

    this.game.input.onDown.addOnce(() => this.game.state.start('Game'), this);
  }
}
