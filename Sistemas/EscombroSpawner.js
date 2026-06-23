class EscombroSpawner {
  static lanzarEscombro(scene, x, civiles) {
    const warningDuration = 2000;
    const warningY = scene.scale.height - 40;

    const warning = scene.add.circle(x, warningY, 16, 0xff0000, 0.7);
    warning.setDepth(10);

    const targetCivil = civiles.find(c =>
      c && !c.fueSalvado && Math.abs(c.x - x) <= 50
    );
    if (targetCivil) {
      targetCivil.estaEnPeligro = true;
    }

    scene.tweens.add({
      targets: warning,
      alpha: 0.15,
      ease: 'Sine.easeInOut',
      duration: 300,
      yoyo: true,
      repeat: Math.floor(warningDuration / 300) - 1
    });

    scene.time.delayedCall(warningDuration, () => {
      warning.destroy();
      if (targetCivil) targetCivil.estaEnPeligro = false;
      EscombroSpawner._spawnEscombro(scene, x);
    });
  }

  static _spawnEscombro(scene, x) {
    if (!scene.textures.exists('escombroTexture')) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x8B4513, 1);
      g.fillRect(0, 0, 24, 24);
      g.generateTexture('escombroTexture', 24, 24);
      g.destroy();
    }

    const escombro = scene.add.sprite(x, 60, 'escombroTexture');
    escombro.setDisplaySize(24, 24);
    scene.matter.add.gameObject(escombro);
    escombro.setRectangle(24, 24, { label: 'escombro' });
    escombro.setBounce(0.15);
    escombro.setFriction(0.05);
    escombro.setFrictionAir(0.01);
    escombro.setMass(3);

    return escombro;
  }
}
