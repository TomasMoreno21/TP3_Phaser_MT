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

    if (config.civiles) {
      this.civiles = this._crearCiviles(config.civiles);
      this._crearZonasSalvacion();
    }

    if (config.spawnInterval) {
      this._iniciarSpawnerEscombros(config.spawnInterval);
    }

    this._crearHUD();
    this._configurarColisiones();
    this._actualizarHUD();
  }

  _crearPlataformas() {
    this.platformData = this.cfg.plataformas.map(p => {
      const r = this.add.rectangle(p.x, p.y, p.w, p.h, p.color || 0x555555).setOrigin(0.5);
      this.matter.add.gameObject(r, { isStatic: true, label: p.label || 'platform' });
      return { x: p.x, w: p.w, topY: p.y - p.h / 2, label: p.label || 'platform' };
    });
    this.platformData.unshift({
      x: 0, w: 800, topY: 600, label: 'ground'
    });
  }

  _getFloorTopY(x) {
    const match = this.platformData.filter(p =>
      p.label !== 'wall' &&
      x >= p.x - p.w / 2 - 4 && x <= p.x + p.w / 2 + 4
    );
    if (match.length === 0) return 568;
    return Math.min(...match.map(p => p.topY));
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
    g.destroy();
  }

  _crearCiviles(positions) {
    return positions.map(p => new Civil(this, p.x, p.y));
  }

  _crearZonasSalvacion() {
    this.civiles.forEach(civil => {
      const fy = this._getFloorTopY(civil.x);
      const plat = this.platformData.filter(p =>
        p.label !== 'wall' &&
        civil.x >= p.x - p.w / 2 && civil.x <= p.x + p.w / 2
      )[0];

      let ladoDerecho = true;
      if (plat) {
        const espacioDer = (plat.x + plat.w / 2) - civil.x;
        const espacioIzq = civil.x - (plat.x - plat.w / 2);
        ladoDerecho = espacioDer >= espacioIzq;
      }

      const zoneX = civil.x + (ladoDerecho ? 36 : -36);
      const z = this.add.rectangle(zoneX, fy - 12, 28, 24, 0x00ff00, 0.2)
        .setStrokeStyle(1, 0x00ff00);
      this.matter.add.gameObject(z, { isStatic: true, isSensor: true, label: 'saveZone' });
      z.civil = civil;
      civil.saveZone = z;
    });
  }

  _crearHUD() {
    this.uiText = this.add.text(16, 16, '', {
      fontSize: '15px', fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 8, y: 4 }
    }).setDepth(20);
  }

  _iniciarSpawnerEscombros(interval) {
    this.time.addEvent({
      delay: interval,
      callback: () => {
        const candidatos = this.civiles.filter(c => c && !c.estaEnPeligro && !c.fueSalvado && c.body);
        if (candidatos.length === 0) return;
        const objetivo = Phaser.Utils.Array.GetRandom(candidatos);
        EscombroSpawner.lanzarEscombro(this, objetivo.x, this.civiles);
      },
      loop: true
    });
  }

  _configurarColisiones() {
    this.matter.world.on('collisionstart', event => {
      event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        if (labels.includes('bombero') && labels.includes('civil')) {
          this._empujarCivil(pair, labels);
        } else if (labels.includes('civil') && labels.includes('saveZone')) {
          this._revisarZona(pair, labels);
        } else if (labels.includes('escombro') && labels.includes('bombero')) {
          this._escombroGolpeaBombero(pair, labels);
        } else if (labels.includes('escombro') && labels.includes('civil')) {
          this._escombroGolpeaCivil(pair, labels);
        } else if (labels.includes('escombro') && (labels.includes('ground') || labels.includes('platform') || labels.includes('wall'))) {
          this._escombroTocaSuelo(pair, labels);
        }
      });
    });
  }

  _escombroGolpeaBombero(pair, labels) {
    const eb = pair.bodyA.label === 'escombro' ? pair.bodyA : pair.bodyB;
    if (eb.velocity && eb.velocity.y > 2) {
      gameState.loseLife();
      if (gameState.lives <= 0) {
        this.time.delayedCall(300, () => this.scene.start('GameOverScene'));
      }
    }
  }

  _escombroGolpeaCivil(pair, labels) {
    const eb = pair.bodyA.label === 'escombro' ? pair.bodyA : pair.bodyB;
    if (eb.velocity && eb.velocity.y > 2) {
      gameState.addScore(-150);
    }
  }

  _escombroTocaSuelo(pair, labels) {
    const eb = pair.bodyA.label === 'escombro' ? pair.bodyA : pair.bodyB;
    if (eb.gameObject && eb.gameObject.active) {
      eb.gameObject.destroy();
    }
  }

  _empujarCivil(pair, labels) {
    const bomberoBody = pair.bodyA.label === 'bombero' ? pair.bodyA : pair.bodyB;
    const civilBody = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const speed = Math.abs(bomberoBody.velocity.x) + Math.abs(bomberoBody.velocity.y);
    if (speed > 0.1 && civilBody.gameObject && civilBody.gameObject.serEmpujado) {
      civilBody.gameObject.serEmpujado(gameState, this.jugador);
    }
  }

  _revisarZona(pair, labels) {
    const civilBody = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const zoneBody = pair.bodyA.label === 'saveZone' ? pair.bodyA : pair.bodyB;
    const civil = civilBody.gameObject;
    const zone = zoneBody.gameObject;
    if (civil && zone && zone.civil === civil && civil.fueEmpujado && !civil.fueSalvado) {
      civil.fueSalvado = true;
      gameState.saveNPC();
      gameState.addScore(150);
      this._verificarAvance();
    }
  }

  _verificarAvance() {
    if (gameState.npcsSaved >= (this.cfg.npcsRequeridos || this.civiles.length)) {
      this.time.delayedCall(600, () => {
        this.scene.start(this.cfg.siguienteNivel);
      });
    }
  }

  _actualizarHUD() {
    let texto = `Puntos: ${gameState.score}  Vidas: ${gameState.lives}`;
    if (this.civiles) {
      texto += `  Rescatados: ${gameState.npcsSaved}/${this.cfg.npcsRequeridos || this.civiles.length}`;
    }
    this.uiText.setText(texto);
  }

  update() {
    if (this.jugador) this.jugador.update();
    this._actualizarHUD();
  }
}
