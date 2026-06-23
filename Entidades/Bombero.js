class Bombero extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'bomberoBody', null);
    scene.add.existing(this);

    this.setRectangle(36, 52, { label: 'bombero' });
    this.setDisplaySize(36, 52);
    this.setOrigin(0.5);
    this.setFixedRotation();
    this.setDepth(2);
    this.setFriction(0.08);
    this.setFrictionAir(0.02);
    this.setMass(4);

    this.speed = 3.2;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard.addKey('W'),
      down: scene.input.keyboard.addKey('S'),
      left: scene.input.keyboard.addKey('A'),
      right: scene.input.keyboard.addKey('D')
    };
  }

  update() {
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -this.speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = this.speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -this.speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = this.speed;

    this.setVelocity(vx, vy);
  }
}
