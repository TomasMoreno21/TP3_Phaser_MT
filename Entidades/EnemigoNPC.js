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
    this.chaseSpeed = 2.5;
    this.patrolRange = 120;
    this.detectRange = 180;
    this.originX = x;
    this.originY = y;
    this.dirX = 1;
    this.dirY = 1;
    this.ataqueCooldown = false;

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(1500, 3000),
      callback: () => {
        if (!this._persiguiendo) {
          this.dirX = Phaser.Math.Between(0, 1) ? 1 : -1;
          this.dirY = Phaser.Math.Between(0, 1) ? 1 : -1;
        }
      },
      loop: true
    });
  }

  update() {
    if (!this.body) return;

    const jugador = this.scene.jugador;
    const dist = jugador ? Phaser.Math.Distance.Between(this.x, this.y, jugador.x, jugador.y) : Infinity;

    if (jugador && dist < this.detectRange) {
      this._persiguiendo = true;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, jugador.x, jugador.y);
      this.setVelocity(
        Math.cos(angle) * this.chaseSpeed,
        Math.sin(angle) * this.chaseSpeed
      );
      this.setFlipX(this.body.velocity.x < 0);
    } else {
      this._persiguiendo = false;
      if (this.x > this.originX + this.patrolRange) this.dirX = -1;
      else if (this.x < this.originX - this.patrolRange) this.dirX = 1;
      if (this.y > this.originY + this.patrolRange) this.dirY = -1;
      else if (this.y < this.originY - this.patrolRange) this.dirY = 1;
      this.setVelocityX(this.speed * this.dirX);
      this.setVelocityY(this.speed * this.dirY);
      this.setFlipX(this.dirX < 0);
    }
  }

  puedeGolpear() {
    if (this.ataqueCooldown) return false;
    this.ataqueCooldown = true;
    this.scene.time.delayedCall(1500, () => { this.ataqueCooldown = false; });
    return true;
  }
}
