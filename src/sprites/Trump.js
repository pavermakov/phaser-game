import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.scale.setTo(0.1);
    this.velocity = 300;

    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.body.collideWorldBounds = true;

    if(Phaser.Device.desktop){
      this.cursors = this.game.input.keyboard.createCursorKeys();
    } else {
      this.cursors = this.game.joystick.cursors;
    }
  }

  update() {
    this.body.velocity.setTo(0, 0);

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.velocity;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.velocity;
    }

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.velocity;
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.velocity;
    }

  }

}
