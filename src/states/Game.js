/* globals __DEV__ */
import Phaser from 'phaser';

export default class extends Phaser.State {
  init() {
    this.gameData = {
      gameVelocity: 320,
      wallSpawnPoints: [
        { x: 50, y: -20 },
        { x: this.game.world.centerX, y: -20 },
        { x: this.game.world.width - 50, y: -20 },
      ],
      playerSpawnPoints: [
        { x: 50, y: this.game.world.height - 25 },
        { x: this.game.world.centerX, y: this.game.world.height - 25 },
        { x: this.game.world.width - 50, y: this.game.world.height - 25 },
      ],
      currentPlayerPoint: 1,
      isInputDown: false,
      isGameOver: false,
      score: 0,
      textStyle: {
        font: '30px Arial',
        fill: '#fff',
      },
      totalAvocados: localStorage.getItem('totalAvocados') || 0,
      lastPlayed: localStorage.getItem('lastPlayed'),
    };

    const now = new Date();
    const dayNow = now.getDay();
    const monthNow = now.getMonth();

    if(!this.gameData.lastPlayed) {
      localStorage.setItem('lastPlayed', JSON.stringify({ day: dayNow, month: monthNow }));
    } else {
      const { dayParsed, monthParsed } = JSON.parse(this.gameData.lastPlayed);

      if(dayNow !== dayParsed || monthNow !== monthParsed) {
        localStorage.setItem('totalAvocados', 0);
      }
    }
  }

  create() {
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.autoScroll(0, this.gameData.gameVelocity);

    // игрок
    this.player = this.game.add.sprite(this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].x, this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].y, 'avocado');
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

    // управление
    if(this.game.input.activePointer.isDown && !this.gameData.isInputDown && !this.gameData.isGameOver) {
      var targetX = this.game.input.activePointer.position.x;

      if(targetX > this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].x && this.gameData.currentPlayerPoint < 2) {
        this.gameData.currentPlayerPoint++;
      } else if(targetX < this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].x && this.gameData.currentPlayerPoint > 0) {
        this.gameData.currentPlayerPoint--;
      }

      this.game.add.tween(this.player).to({ x: this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].x}, 70, 'Back.easeOut', true);
      // this.player.position.x = this.gameData.playerSpawnPoints[this.gameData.currentPlayerPoint].x;
      this.gameData.isInputDown = true;
    }

    if(this.game.input.activePointer.isUp && !this.gameData.isGameOver) {
      this.gameData.isInputDown = false;
    }
  }

  _createWall() {
    let spawnSpot = this.game.rnd.pick(this.gameData.wallSpawnPoints);

    let wall = this.walls.getFirstExists(false);

    if(!wall) {
      wall = this.walls.create(spawnSpot.x, spawnSpot.y, 'wall');
    } else {
      wall.reset(spawnSpot.x, spawnSpot.y);
    }

    wall.anchor.setTo(0.5);
    wall.body.velocity.y = this.gameData.gameVelocity;
    wall.checkWorldBounds = true;
    wall.events.onOutOfBounds.add(this._destroyWall, this);
  }

  _destroyWall(wall) {
    this.gameData.score++;
    wall.kill();
  }

  _handleOverlap(player, wall){
    if(player.y > wall.top){
      this._gameOver();
    }
  }

  _levelUp() {
    if(this.walls.children.length < 6) {
      this.wallTimer.delay *= 0.8;
      this.gameData.gameVelocity *= 1.1;
    } else {
      this.wallTimer.delay *= 0.6;
      this.gameData.gameVelocity *= 1.3;
    }

    this.walls.setAll('body.velocity.y', this.gameData.gameVelocity);
    this.background.autoScroll(0, this.gameData.gameVelocity);
  }

  _gameOver() {
    this.gameData.isGameOver = true;
    this.game.camera.shake(0.015, 150);
    this.game.time.events.removeAll();
    this.background.autoScroll(0);
    this.walls.setAll('body.enable', false);

    localStorage.setItem('totalAvocados', ++this.gameData.totalAvocados);

    const bmd = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    bmd.fill(0, 0, 0, 0.7);

    const gameOverText = this.game.make.text(this.game.world.centerX, this.game.world.centerY - 40, 'GAME OVER', this.gameData.textStyle);
    gameOverText.anchor.setTo(0.5);
    bmd.draw(gameOverText);

    const scoreText = this.game.make.text(this.game.world.centerX, this.game.world.centerY, `YOUR SCORE: ${this.gameData.score}`, this.gameData.textStyle);
    scoreText.anchor.setTo(0.5);
    bmd.draw(scoreText);

    const playAgainText = this.game.make.text(this.game.world.centerX, this.game.world.centerY + 40, 'TAP TO PLAY AGAIN', this.gameData.textStyle);
    playAgainText.anchor.setTo(0.5);
    bmd.draw(playAgainText);

    const overlay = this.game.add.sprite(0, -this.game.world.height, bmd);

    this.game.add.tween(overlay).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

    this.game.time.events.add(Phaser.Timer.SECOND, () => {
      this.game.input.onDown.addOnce(() => this.game.state.start('Game'), this);
    }, this);

  }
}
