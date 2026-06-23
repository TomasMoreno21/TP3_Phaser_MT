class LevelBase extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  create(config) {
    this.cfg = config;
    gameState.npcsSaved = 0;
    gameState.oxygen = 100;
    this.cameras.main.setBackgroundColor(config.bgColor);
    this.matter.world.setBounds(0, 0, 800, 600);

    this._crearObstaculos();
    this._asegurarTexturas();
    this.jugador = new Bombero(this, config.playerX, config.playerY);

    if (config.civiles) {
      this.civiles = this._crearCiviles(config.civiles);
      this._crearZonasSalvacion();
    }

    if (config.enemigo) this._crearEnemigo(config.enemigo);
    if (config.fugasGas) this._crearFugasGas(config.fugasGas);

    if (config.spawnInterval) this._iniciarSpawner(config.spawnInterval);

    this._crearHUD();
    this._configurarColisiones();
    this._actualizarHUD();
  }

  _crearObstaculos() {
    if (!this.cfg.obstaculos) return;
    this.cfg.obstaculos.forEach(o => {
      const r = this.add.rectangle(o.x, o.y, o.w, o.h, o.color || 0x555555);
      this.matter.add.gameObject(r, { isStatic: true, label: 'obstacle' });
    });
  }

  _asegurarTexturas() {
    if (this.textures.exists('bomberoBody')) return;

    const g = this.add.graphics();
    g.fillStyle(0x0077ff, 1);
    g.fillRect(0, 0, 32, 48);
    g.generateTexture('bomberoBody', 32, 48);
    g.clear();
    g.fillStyle(0xcc3333, 1);
    g.fillRect(0, 0, 32, 64);
    g.generateTexture('civilBody', 32, 64);
    g.clear();
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, 32, 48);
    g.generateTexture('enemigoBody', 32, 48);
    g.destroy();
  }

  _crearCiviles(positions) {
    return positions.map(p => new Civil(this, p.x, p.y));
  }

  _crearZonasSalvacion() {
    this.civiles.forEach(civil => {
      const zoneX = Phaser.Math.Clamp(civil.x + 40, 20, 780);
      const zoneY = Phaser.Math.Clamp(civil.y, 20, 580);
      const z = this.add.rectangle(zoneX, zoneY, 28, 24, 0x00ff00, 0.2)
        .setStrokeStyle(1, 0x00ff00);
      this.matter.add.gameObject(z, { isStatic: true, isSensor: true, label: 'saveZone' });
      z.civil = civil;
      civil.saveZone = z;
    });
  }

  _crearEnemigo(config) {
    this.enemigo = new EnemigoNPC(this, config.x, config.y, 'enemigoBody');
    if (config.speed) this.enemigo.speed = config.speed;
    if (config.patrolRange) this.enemigo.patrolRange = config.patrolRange;
  }

  _crearFugasGas(configs) {
    this.fugas = configs.map(g => new FugaGas(this, g.x, g.y, g.w, g.h));
  }

  _iniciarSpawner(interval) {
    this.time.addEvent({
      delay: interval,
      callback: () => {
        const candidatos = this.civiles.filter(c => c && !c.estaEnPeligro && !c.fueSalvado && c.body);
        if (candidatos.length === 0) return;
        const objetivo = Phaser.Utils.Array.GetRandom(candidatos);
        EscombroSpawner.lanzarEscombro(this, objetivo.x, objetivo.y);
      },
      loop: true
    });
  }

  _crearHUD() {
    this.uiText = this.add.text(16, 16, '', {
      fontSize: '15px', fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 8, y: 4 }
    }).setDepth(20);
  }

  _configurarColisiones() {
    this.matter.world.on('collisionstart', event => {
      event.pairs.forEach(pair => {
        const a = pair.bodyA;
        const b = pair.bodyB;
        const labels = [a.label, b.label];

        if (labels.includes('bombero') && labels.includes('civil')) {
          this._empujar(pair, labels);
        } else if (labels.includes('civil') && labels.includes('saveZone')) {
          this._salvar(pair, labels);
        } else if (labels.includes('escombro')) {
          if (labels.includes('bombero')) this._escombroGolpeJugador();
          else if (labels.includes('civil')) this._escombroGolpeCivil();
        } else if (labels.includes('bombero') && labels.includes('enemigo')) {
          this._enemigoGolpeaJugador();
        }
      });
    });
  }

  _empujar(pair, labels) {
    const bb = pair.bodyA.label === 'bombero' ? pair.bodyA : pair.bodyB;
    const cb = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const speed = Math.abs(bb.velocity.x) + Math.abs(bb.velocity.y);
    if (speed > 0.1 && cb.gameObject && cb.gameObject.serEmpujado) {
      cb.gameObject.serEmpujado(gameState, this.jugador);
    }
  }

  _salvar(pair, labels) {
    const cb = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const zb = pair.bodyA.label === 'saveZone' ? pair.bodyA : pair.bodyB;
    const civil = cb.gameObject;
    const zone = zb.gameObject;
    if (civil && zone && zone.civil === civil && civil.fueEmpujado && !civil.fueSalvado) {
      civil.fueSalvado = true;
      gameState.saveNPC();
      gameState.addScore(150);
      this._verificarAvance();
    }
  }

  _escombroGolpeJugador() {
    gameState.loseLife();
    if (gameState.lives <= 0) {
      this.time.delayedCall(500, () => this.scene.start('GameOverScene'));
    }
  }

  _escombroGolpeCivil() {
    gameState.addScore(-150);
  }

  _enemigoGolpeaJugador() {
    if (this.enemigo && !this.enemigo.puedeGolpear()) return;
    gameState.loseLife();
    if (gameState.lives <= 0) {
      this.time.delayedCall(500, () => this.scene.start('GameOverScene'));
    }
  }

  _verificarAvance() {
    const req = this.cfg.npcsRequeridos || this.civiles.length;
    if (gameState.npcsSaved >= req) {
      this.time.delayedCall(500, () => {
        this.scene.start(this.cfg.siguienteNivel);
      });
    }
  }

  _actualizarHUD() {
    let texto = `Puntos: ${gameState.score}  Vidas: ${gameState.lives}`;
    if (this.civiles) {
      texto += `  Rescatados: ${gameState.npcsSaved}/${this.cfg.npcsRequeridos || this.civiles.length}`;
    }
    if (this.fugas) {
      texto += `  Oxígeno: ${Math.max(0, Math.round(gameState.oxygen))}%`;
    }
    this.uiText.setText(texto);
  }

  _chequearGas() {
    if (!this.fugas || !this.jugador || !this.jugador.body) return;

    const enGas = this.fugas.some(f => {
      if (!f.zone || !f.zone.body) return false;
      const b = f.zone.body.bounds;
      const jb = this.jugador.body.bounds;
      return Phaser.Geom.Intersects.RectangleToRectangle(
        new Phaser.Geom.Rectangle(b.min.x, b.min.y, b.max.x - b.min.x, b.max.y - b.min.y),
        new Phaser.Geom.Rectangle(jb.min.x, jb.min.y, jb.max.x - jb.min.x, jb.max.y - jb.min.y)
      );
    });

    if (enGas) {
      gameState.oxygen -= 0.3;
      if (gameState.oxygen <= 0) {
        gameState.oxygen = 100;
        gameState.loseLife();
        if (gameState.lives <= 0) this.scene.start('GameOverScene');
      }
    } else {
      gameState.oxygen = Math.min(100, gameState.oxygen + 0.1);
    }
  }

  update() {
    if (this.jugador) this.jugador.update();
    if (this.enemigo) this.enemigo.update();
    if (this.fugas) this._chequearGas();
    this._actualizarHUD();
  }
}
