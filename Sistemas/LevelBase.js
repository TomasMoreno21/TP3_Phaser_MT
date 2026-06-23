class LevelBase extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  create(config) {
    this.cfg = config;
    this.cameras.main.setBackgroundColor(config.bgColor);
    this.matter.world.setBounds(0, 0, 800, 600);

    this._crearPlataformas();
    this._asegurarTexturas();
    this.jugador = new Bombero(this, config.playerX, config.playerY);
  }

  _crearPlataformas() {
    this.cfg.plataformas.forEach(p => {
      const r = this.add.rectangle(p.x, p.y, p.w, p.h, p.color).setOrigin(0.5);
      this.matter.add.gameObject(r, { isStatic: true, label: p.label || 'platform' });
    });
  }

  _asegurarTexturas() {
    if (this.textures.exists('bomberoBody')) return;

    const g = this.add.graphics();
    g.fillStyle(0x0077ff, 1);
    g.fillRect(0, 0, 32, 48);
    g.generateTexture('bomberoBody', 32, 48);
    g.destroy();
  }

  update() {
    if (this.jugador) this.jugador.update();
  }
}
