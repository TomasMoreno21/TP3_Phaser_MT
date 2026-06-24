class FugaGas {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    const fillColor = 0xD8C6A1;
    const strokeColor = 0xB89F74;
    this.width = width || 48;
    this.height = height || 48;

    this.zone = scene.add.rectangle(x, y, this.width, this.height, fillColor, 0.08)
      .setStrokeStyle(2, strokeColor, 0.4)
      .setDepth(5);

    scene.matter.add.gameObject(this.zone, {
      isStatic: true,
      isSensor: true,
      label: 'fugaGas'
    });

    this.puffs = [];
    this.spawnTimer = scene.time.addEvent({
      delay: 140,
      callback: () => this._spawnPuff(),
      callbackScope: this,
      loop: true
    });

    this._animar();
  }

  _spawnPuff() {
    const x = Phaser.Math.Between(this.zone.x - this.width / 2, this.zone.x + this.width / 2);
    const y = Phaser.Math.Between(this.zone.y - this.height / 2, this.zone.y + this.height / 2);
    const puff = this.scene.add.ellipse(x, y, 12, 8, 0xD8C6A1, 0.5).setDepth(4);
    const targetY = y - Phaser.Math.Between(12, 24);
    this.puffs.push(puff);

    this.scene.tweens.add({
      targets: puff,
      y: targetY,
      alpha: 0,
      scaleX: 0.4,
      scaleY: 0.4,
      duration: Phaser.Math.Between(900, 1400),
      ease: 'Sine.easeOut',
      onComplete: () => {
        const index = this.puffs.indexOf(puff);
        if (index !== -1) this.puffs.splice(index, 1);
        puff.destroy();
      }
    });
  }

  _animar() {
    this.scene.tweens.add({
      targets: this.zone,
      alpha: 0.08,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  destroy() {
    if (this.spawnTimer) this.spawnTimer.remove(false);
    this.puffs.forEach(puff => puff.destroy());
    this.puffs.length = 0;
    if (this.zone) this.zone.destroy();
  }
}
