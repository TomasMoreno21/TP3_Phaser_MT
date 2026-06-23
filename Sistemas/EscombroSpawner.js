class EscombroSpawner {
  static lanzarEscombro(scene, objetivoX, objetivoY) {
    const warningDuration = 2000;
    const offsetX = Phaser.Math.Between(-60, 60);
    const offsetY = Phaser.Math.Between(-60, 60);
    const x = Phaser.Math.Clamp(objetivoX + offsetX, 30, 770);
    const y = Phaser.Math.Clamp(objetivoY + offsetY, 30, 570);

    const warning = scene.add.circle(x, y, 18, 0xff0000, 0.6);
    warning.setDepth(10);

    const targetCivil = scene.civiles.find(c =>
      c && !c.fueSalvado && c.body &&
      Phaser.Math.Distance.Between(x, y, c.x, c.y) <= 60
    );
    if (targetCivil) targetCivil.estaEnPeligro = true;

    scene.tweens.add({
      targets: warning,
      alpha: 0.1,
      ease: 'Sine.easeInOut',
      duration: 300,
      yoyo: true,
      repeat: Math.floor(warningDuration / 300) - 1
    });

    scene.time.delayedCall(warningDuration, () => {
      warning.destroy();
      if (targetCivil) targetCivil.estaEnPeligro = false;
      EscombroSpawner._spawnEscombro(scene, x, y);
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
    scene.matter.add.gameObject(escombro);
    escombro.setRectangle(24, 24, { label: 'escombro', isSensor: true });
    escombro.setDepth(8);

    scene.time.delayedCall(4000, () => {
      if (escombro && escombro.active) escombro.destroy();
    });
  }
}
