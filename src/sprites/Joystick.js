// TODO: упростить, убрать повторения

import Phaser from 'phaser';

export default class extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.alpha = 0.3;
    this.fixedToCamera = true;
    this.cameraOffset.x = 70;
    this.cameraOffset.y = this.game.camera.height - 70;

    this.maxDistanceInPixels = 150;
    this.isJoystickDown = false;
    this.pointer = {};

    this.cursors = {
      up: {
        isDown: false,
      },
      down: {
        isDown: false,
      },
      left: {
        isDown: false,
      },
      right: {
        isDown: false,
      }
    };

    this.addBase();
  }

  addBase() {
    this.base = this.game.add.sprite(this.cameraOffset.x, this.cameraOffset.y, 'vjoy_base');
    this.base.anchor.setTo(0.5);
    this.base.scale.setTo(0.9);
    this.base.alpha = 0.8;
    this.base.fixedToCamera = true;
    this.base.inputEnabled = true;

    this.base.speed = {
      x: 0,
      y: 0,
    };

    this.base.events.onInputDown.add(this.activateJoystick, this);
    this.base.events.onInputUp.add(this.resetJoystick, this);
  }

  setDirection() {
    this.base.cameraOffset.x = this.pointer.x;
    this.base.cameraOffset.y = this.pointer.y;

    const d = this.position.distance(this.base.position);
    const angle = this.position.angle(this.base.position) * 180 / Math.PI;
    let deltaX = this.base.position.x - this.x;
    let deltaY = this.base.position.y - this.y;

    if (d > this.maxDistanceInPixels) {
      const borderX = this.pointer.x;
      const borderY = this.pointer.y;

      this.base.cameraOffset.x = borderX;
      this.base.cameraOffset.y = borderY;

      deltaX = Math.cos(angle) * this.maxDistanceInPixels;
      deltaY = Math.sin(angle) * this.maxDistanceInPixels;
    }

    this.base.speed.x = parseInt((deltaX / this.maxDistanceInPixels) * 100 * -1, 10);
    this.base.speed.y = parseInt((deltaY / this.maxDistanceInPixels) * 100 * -1, 10);

    this.cursors.up.isDown = ((angle < - 45 / 2) && (angle > -180 + 45 / 2));
    this.cursors.down.isDown = ((angle > 45 / 2) && (angle < 180 - 45 / 2));
    this.cursors.left.isDown = ((angle < -90 - 45 / 2) || (angle > 90 + 45 / 2));
    this.cursors.right.isDown = ((angle > -90 + 45 / 2) && (angle < 90 - 45 / 2));
  }

  activateJoystick() {
    this.isJoystickDown = true;
  }

  resetJoystick() {
    this.isJoystickDown = false;
    this.base.cameraOffset.x = this.cameraOffset.x;
    this.base.cameraOffset.y = this.cameraOffset.y;
    this.cursors.up.isDown = false;
    this.cursors.down.isDown = false;
    this.cursors.left.isDown = false;
    this.cursors.right.isDown = false;
  }

  getJoystickState() {
    return this.isJoystickDown;
  }

  update() {
    if(this.isJoystickDown) {
      this.pointer.x = this.game.input.x;
      this.pointer.y = this.game.input.y;
      this.setDirection();
    }
  }
}
