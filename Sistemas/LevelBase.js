class LevelBase extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  create(config) {
    this.cfg = config;
    gameState.npcsSavedInLevel = 0;
    gameState.oxygen = 100;
    const civiles = Array.isArray(config.civiles) ? config.civiles : [];
    this.cfg.npcsRequeridos = civiles.length;
    this.tiempoRestante = Math.max(5, civiles.length * 5);
    this.temporizadorAgotado = false;
    this.worldWidth = config.worldWidth || 800;
    this.worldHeight = config.worldHeight || 600;
    this.cameras.main.setBackgroundColor(config.bgColor);
    this.matter.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this._crearObstaculos();
    this._crearBreakables();
    GeneradorTexturas.asegurar(this);
    this.jugador = new Bombero(this, config.playerX, config.playerY);
    this.cameras.main.startFollow(this.jugador, true, 0.12, 0.12);

    if (config.civiles) {
      this.civiles = config.civiles.map(p => {
        const civil = new Civil(this, p.x, p.y);
        if (p.zona) civil._zonaConfig = p.zona;
        return civil;
      });
      gameState.addNpcsFromLevel(this.civiles.length, gameState.currentLevel);
      this._crearZonasSalvacion();
    }

    if (config.enemigo) {
      this.enemigo = new EnemigoNPC(this, config.enemigo.x, config.enemigo.y, 'enemigoBody');
      if (config.enemigo.speed) this.enemigo.speed = config.enemigo.speed;
      if (config.enemigo.patrolRange) this.enemigo.patrolRange = config.enemigo.patrolRange;
    }
    if (config.fugasGas) this.fugas = config.fugasGas.map(g => new FugaGas(this, g.x, g.y, g.w, g.h));

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.time.delayedCall(1000, () => this._encadenarEscombro());

    this._crearHUD();
    ManejadorColisiones.configurar(this);
    this._actualizarHUD();
  }

  _crearObstaculos() {
    if (!this.cfg.obstaculos) return;
    this.cfg.obstaculos.forEach(o => {
      const r = this.add.rectangle(o.x, o.y, o.w, o.h, o.color || 0x555555);
      this.matter.add.gameObject(r, { isStatic: true, label: 'obstacle' });
    });
  }

  _crearBreakables() {
    if (!this.cfg.breakables) return;
    this.breakables = this.cfg.breakables.map(b => {
      const r = this.add.rectangle(b.x, b.y, b.w, b.h, 0x8B4513);
      this.matter.add.gameObject(r, { isStatic: true, label: 'breakable' });
      r.setDepth(1);
      return r;
    });
  }

  _crearZonasSalvacion() {
    this.civiles.forEach(civil => {
      const maxX = Math.max(20, this.worldWidth - 20);
      const maxY = Math.max(20, this.worldHeight - 20);
      let zoneX = Phaser.Math.Clamp(civil.x + 40, 20, maxX);
      let zoneY = Phaser.Math.Clamp(civil.y, 20, maxY);
      let zoneW = 28, zoneH = 24;
      if (civil._zonaConfig) {
        zoneX = civil._zonaConfig.x;
        zoneY = civil._zonaConfig.y;
        zoneW = civil._zonaConfig.w || 28;
        zoneH = civil._zonaConfig.h || 24;
      }
      const z = this.add.rectangle(zoneX, zoneY, zoneW, zoneH, 0x00ff00, 0.2)
        .setStrokeStyle(1, 0x00ff00);
      this.matter.add.gameObject(z, { isStatic: true, isSensor: true, label: 'saveZone' });
      z.civil = civil;
      civil.saveZone = z;
    });
  }

  _encadenarEscombro() {
    if (this.temporizadorAgotado) return;
    const candidatos = this.civiles.filter(c => c && !c.estaEnPeligro && !c.fueSalvado && c.body);
    if (candidatos.length === 0) return;
    const objetivo = candidatos.reduce((mejor, civil) => {
      const d = Phaser.Math.Distance.Between(this.jugador.x, this.jugador.y, civil.x, civil.y);
      return !mejor || d < mejor.d ? { civil, d } : mejor;
    }, null).civil;
    const warningDuration = this.cfg.escombroWarningDuration || EscombroSpawner.WARNING_DURACION;
    EscombroSpawner.lanzarEscombro(this, objetivo, warningDuration);
    this.time.delayedCall(warningDuration, () => this._encadenarEscombro());
  }

  _crearHUD() {
    this.uiText = this.add.text(16, 16, '', {
      fontSize: '15px', fill: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 8, y: 4 }
    }).setDepth(20).setScrollFactor(0);
  }

  _actualizarHUD() {
    const t = Math.max(0, Math.ceil(this.tiempoRestante));
    let texto = `Tiempo: ${t}s  Puntos: ${gameState.score}  Vidas: ${gameState.lives}`;
    if (this.civiles) {
      texto += `  Rescatados: ${gameState.npcsSavedInLevel}/${this.cfg.npcsRequeridos || this.civiles.length}`;
    }
    if (this.fugas) {
      texto += `  Oxígeno: ${Math.max(0, Math.round(gameState.oxygen))}%`;
    }
    this.uiText.setText(texto);
  }

  update(time, delta) {
    if (this.temporizadorAgotado) return;
    this.tiempoRestante -= delta / 1000;
    if (this.tiempoRestante <= 0) {
      this.tiempoRestante = 0;
      this.temporizadorAgotado = true;
      gameState.loseLife();
      if (gameState.lives <= 0) {
        this.time.delayedCall(500, () => this.scene.start('GameOverScene'));
      } else {
        this.scene.restart();
      }
      return;
    }
    if (this.jugador) this.jugador.update();
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) ManejadorColisiones.intentarRomper(this);
    if (this.enemigo) this.enemigo.update();
    if (this.fugas) FugaGas.chequearJugador(this);
    this._actualizarHUD();
  }
}
