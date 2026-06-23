class EnemigoNPC extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture || 'enemigoBody');
    scene.add.existing(this);

    this.setRectangle(32, 48, { label: 'enemigo' });
    this.setDisplaySize(32, 48);
    this.setOrigin(0.5);
    this.setFixedRotation();
    this.setBounce(0);
    this.setFriction(0.08);
    this.setFrictionAir(0.02);
    this.setMass(5);

    this.speed = 1.5;
    this.patrolRange = 120;
    this.originX = x;
    this.dir = 1;
    this.ataqueCooldown = false;
  }

  update() {
    if (!this.body) return;

    if (this.x > this.originX + this.patrolRange) this.dir = -1;
    else if (this.x < this.originX - this.patrolRange) this.dir = 1;

    this.setVelocityX(this.speed * this.dir);
    this.setFlipX(this.dir < 0);
  }

  puedeGolpear() {
    if (this.ataqueCooldown) return false;
    this.ataqueCooldown = true;
    this.scene.time.delayedCall(1500, () => { this.ataqueCooldown = false; });
    return true;
  }
}
