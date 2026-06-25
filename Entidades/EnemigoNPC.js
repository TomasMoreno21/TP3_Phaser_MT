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

    this.speed = 0.9;
    this.chaseSpeed = 1.8;
    this.patrolRange = 120;
    this.detectRange = 250;
    this.originX = x;
    this.originY = y;
    this.dirX = 1;
    this.dirY = 1;
    this.ataqueCooldown = false;

    this._stuckTime = 0;
    this._prevPos = { x, y };
    this._slideDir = { x: 0, y: 0 };
    this._wallHit = false;
    this._tryVertical = false;
    this._wallAttemptTimer = 0;

    this._setupCollision();

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

  _setupCollision() {
    this.scene.matter.world.on('collisionstart', event => {
      for (const pair of event.pairs) {
        const bodies = [pair.bodyA, pair.bodyB];
        if (!bodies.includes(this.body)) continue;
        const other = bodies[0] === this.body ? bodies[1] : bodies[0];
        const label = other.label || '';
        if (label === 'breakable') {
          const go = other.gameObject;
          if (go && go.active) {
            go.destroy();
            const arr = this.scene.breakables;
            if (arr) {
              const idx = arr.indexOf(go);
              if (idx !== -1) arr.splice(idx, 1);
            }
          }
          return;
        }
        if (label === 'obstacle' || label.startsWith('world')) {
          this._wallHit = true;
          const normal = pair.bodyA === this.body
            ? pair.collision.normal
            : { x: -pair.collision.normal.x, y: -pair.collision.normal.y };
          this._slideDir = { x: -normal.y, y: normal.x };
          this._tryVertical = Math.abs(normal.x) > Math.abs(normal.y);
        }
      }
    });
  }

  update() {
    if (!this.body) return;

    const jugador = this.scene.jugador;
    const dist = jugador ? Phaser.Math.Distance.Between(this.x, this.y, jugador.x, jugador.y) : Infinity;

    if (jugador && dist < this.detectRange) {
      this._persiguiendo = true;

      const moved = Phaser.Math.Distance.Between(this.x, this.y, this._prevPos.x, this._prevPos.y);
      if (moved < 0.5) {
        this._stuckTime += 16;
      } else {
        if (this._stuckTime > 0) this._stuckTime = Math.max(0, this._stuckTime - 8);
      }
      this._prevPos = { x: this.x, y: this.y };

      let vx, vy;

      if (this._stuckTime > 250) {
        this._stuckTime = 0;
        this._wallHit = false;
        this._wallAttemptTimer = 0;
        this._tryVertical = !this._tryVertical;
        if (this._tryVertical) {
          vx = 0;
          vy = Math.sign(jugador.y - this.y) * this.chaseSpeed * 0.6;
        } else {
          vx = Math.sign(jugador.x - this.x) * this.chaseSpeed * 0.6;
          vy = 0;
        }
      } else if (this._wallHit && this._stuckTime > 100) {
        this._wallAttemptTimer += 16;
        if (this._wallAttemptTimer > 400) {
          this._wallHit = false;
          this._wallAttemptTimer = 0;
        }
        const slide = this._tryVertical ? 0.6 : 0.4;
        vx = this._slideDir.x * this.chaseSpeed * slide;
        vy = this._slideDir.y * this.chaseSpeed * slide;
      } else {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, jugador.x, jugador.y);
        vx = Math.cos(angle) * this.chaseSpeed;
        vy = Math.sin(angle) * this.chaseSpeed;
      }

      this.setVelocity(vx, vy);
      this.setFlipX(this.body.velocity.x < 0);
    } else {
      this._persiguiendo = false;
      this._stuckTime = 0;
      this._wallHit = false;
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
    this.scene.time.delayedCall(800, () => { this.ataqueCooldown = false; });
    return true;
  }
}
