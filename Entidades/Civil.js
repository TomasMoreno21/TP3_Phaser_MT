class Civil extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, 'civilBody', null);
    scene.add.existing(this);

    this.setRectangle(32, 64, { label: 'civil' });
    this.setDisplaySize(32, 64);
    this.setOrigin(0.5);
    this.setFriction(0.1);
    this.setBounce(0.05);
    this.setMass(2.5);
    this.setFrictionAir(0.02);

    this.estaEnPeligro = false;
    this.fueEmpujado = false;
    this.fueSalvado = false;
    this._cooldownEmpujon = false;
    this.saveZone = null;
  }

  serEmpujado(gameState, bombero) {
    if (this._cooldownEmpujon || this.fueSalvado) return;

    const dx = this.x - bombero.x;
    const dy = this.y - bombero.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    this.applyForce({ x: 0.02 * (dx / len), y: 0.02 * (dy / len) });
    this.fueEmpujado = true;

    if (this.estaEnPeligro) {
      gameState.addScore(100);
      this.estaEnPeligro = false;
    } else {
      gameState.addScore(-20);
    }

    this._cooldownEmpujon = true;
    this.scene.time.delayedCall(800, () => { this._cooldownEmpujon = false; });
  }
}
