class Bombero extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, null, null, {
      chamfer: { radius: 6 },
      label: 'bombero'
    });
    scene.add.existing(this);

    this.setRectangle(32, 48);
    this.setDisplaySize(32, 48);
    this.setOrigin(0.5);
    this.setFixedRotation();
    this.setBounce(0);
    this.setFriction(0.08);
    this.setFrictionAir(0.02);
    this.setMass(4);

    this.speed = 3.2;
    this.jumpSpeed = -10;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard.addKey('W'),
      left: scene.input.keyboard.addKey('A'),
      right: scene.input.keyboard.addKey('D')
    };
  }

  _tocandoPiso() {
    if (!this.body) return false;
    return Math.abs(this.body.velocity.y) < 0.05;
  }

  update() {
    let vx = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx = -this.speed;
      this.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx = this.speed;
      this.setFlipX(false);
    }

    this.setVelocityX(vx);

    if ((this.cursors.up.isDown || this.wasd.up.isDown) && this._tocandoPiso()) {
      this.setVelocityY(this.jumpSpeed);
    }
  }
}
