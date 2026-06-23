class FugaGas {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.zone = scene.add.rectangle(x, y, width, height, 0x66ff00, 0.12)
      .setStrokeStyle(2, 0x66ff00, 0.4)
      .setDepth(5);

    scene.matter.add.gameObject(this.zone, {
      isStatic: true,
      isSensor: true,
      label: 'fugaGas'
    });

    this._animar();
  }

  _animar() {
    this.scene.tweens.add({
      targets: this.zone,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  destroy() {
    if (this.zone) this.zone.destroy();
  }
}
