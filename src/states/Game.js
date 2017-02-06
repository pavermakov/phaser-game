/* globals __DEV__ */
import Phaser from 'phaser';
import Trump from '../sprites/Trump';
import Bullet from '../sprites/Bullet';
import Joystick from '../sprites/Joystick';

export default class extends Phaser.State {
  init() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(-2000, -2000, 2000, 2000);
    this.game.input.addPointer();
  }

  create() {
    this.addMap();
    this.addControls();
    this.addPlayer();
    this.addBullets();
  }

  addMap() {
    this.map = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'map');
    this.map.anchor.setTo(0.5);
    this.map.scale.setTo(1.5);
    this.map.inputEnabled = true;

    this.map.events.onInputDown.add(this.shoot, this);
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
    if(!Phaser.Device.desktop){
      this.joystick = new Joystick({
        game: this,
        x: 0,
        y: 0,
        asset: 'vjoy_cap',
      });

      this.game.add.existing(this.joystick);
    }
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
