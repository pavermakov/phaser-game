/* globals __DEV__ */
import Phaser from 'phaser';
import Trump from '../sprites/Trump';
import Bullet from '../sprites/Bullet';

export default class extends Phaser.State {
  init() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(-2000, -2000, 2000, 2000);
    this.game.inputEnabled = true;

    if(!Phaser.Device.desktop){
      this.vjoy = this.game.plugins.add(Phaser.Plugin.VJoy);
    }
  }

  create() {
    this.addMap();
    this.addPlayer();
    this.addBullets();
    this.addControls();
  }

  update() {

  }

  addMap() {
    this.map = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'map');
    this.map.anchor.setTo(0.5);
    this.map.scale.setTo(1.5);
  }

  addPlayer() {
    this.trump = new Trump({
      game: this,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'trump',
    });

    this.game.camera.follow(this.trump);
    this.game.add.existing(this.trump);
  }

  addBullets() {
    this.bullets = this.game.add.group();
  }

  addControls() {
    if(this.vjoy) {
      this.vjoy.inputEnable(0, 0);
    }

    this.game.input.onDown.add(this.shoot, this);
  }

  shoot() {
    const angle = this.game.physics.arcade.angleToPointer(this.trump);

    const bullet = new Bullet({
      game: this,
      x: this.trump.x,
      y: this.trump.y,
      angle,
      asset: 'bullet',
    });

    this.bullets.add(bullet);
  }
}
