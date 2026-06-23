class EscombroSpawner {
  static get WARNING_DURACION() { return 3000; }

  static lanzarEscombro(scene, civil) {
    if (!civil || !civil.body || civil.fueSalvado) return;

    const warningDuration = this.WARNING_DURACION;

    civil.estaEnPeligro = true;
    civil.setTint(0xff6666);

    const warning = scene.add.circle(civil.x, civil.y, 20, 0xff0000, 0.5).setDepth(15);
    scene.tweens.add({
      targets: warning,
      alpha: 0.1,
      duration: 350, yoyo: true,
      repeat: Math.floor(warningDuration / 700) - 1,
    });

    scene.time.delayedCall(warningDuration, () => {
      warning.destroy();
      civil.estaEnPeligro = false;
      civil.clearTint();
      EscombroSpawner._spawnEscombro(scene, warning.x, warning.y);
    });
  }

  static _spawnEscombro(scene, x, y) {
    if (!scene.textures.exists('escombroTexture')) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x8B4513, 1);
      g.fillRect(0, 0, 24, 24);
      g.generateTexture('escombroTexture', 24, 24);
      g.destroy();
    }

    const escombro = scene.add.sprite(x, y, 'escombroTexture');
    escombro.setDisplaySize(24, 24);
    escombro.setDepth(8);

    const visual = scene.add.sprite(x, -30, 'escombroTexture');
    visual.setDisplaySize(24, 24);
    visual.setDepth(9);

    scene.tweens.add({
      targets: visual,
      y: y,
      duration: 400,
      ease: 'Sine.easeIn',
      onComplete: () => {
        visual.destroy();
        scene.matter.add.gameObject(escombro);
        escombro.setRectangle(24, 24, { label: 'escombro', isSensor: true });

        scene.time.delayedCall(4000, () => {
          if (escombro && escombro.active) escombro.destroy();
        });
      }
    });
  }
}
