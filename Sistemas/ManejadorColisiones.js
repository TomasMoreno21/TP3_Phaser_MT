class ManejadorColisiones {
  static configurar(scene) {
    scene.matter.world.on('collisionstart', event => {
      event.pairs.forEach(pair => {
        const a = pair.bodyA, b = pair.bodyB;
        const labels = [a.label, b.label];

        if (labels.includes('bombero') && labels.includes('civil')) {
          ManejadorColisiones._empujar(pair, labels, scene);
        } else if (labels.includes('civil') && labels.includes('saveZone')) {
          ManejadorColisiones._salvar(pair, labels, scene);
        } else if (labels.includes('escombro')) {
          if (labels.includes('bombero')) ManejadorColisiones._escombroGolpeJugador(scene);
          else if (labels.includes('civil')) ManejadorColisiones._escombroGolpeCivil(scene);
        } else if (labels.includes('bombero') && labels.includes('enemigo')) {
          ManejadorColisiones._enemigoGolpeaJugador(scene);
        }
      });
    });
  }

  static _empujar(pair, labels, scene) {
    const bb = pair.bodyA.label === 'bombero' ? pair.bodyA : pair.bodyB;
    const cb = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const speed = Math.abs(bb.velocity.x) + Math.abs(bb.velocity.y);
    if (speed > 0.1 && cb.gameObject && cb.gameObject.serEmpujado) {
      cb.gameObject.serEmpujado(gameState, scene.jugador);
    }
  }

  static _salvar(pair, labels, scene) {
    const cb = pair.bodyA.label === 'civil' ? pair.bodyA : pair.bodyB;
    const zb = pair.bodyA.label === 'saveZone' ? pair.bodyA : pair.bodyB;
    const civil = cb.gameObject;
    const zone = zb.gameObject;
    if (civil && zone && zone.civil === civil && civil.fueEmpujado && !civil.fueSalvado) {
      civil.fueSalvado = true;
      gameState.saveNPC();
      gameState.addScore(150);
      ManejadorColisiones._verificarAvance(scene);
    }
  }

  static _escombroGolpeJugador(scene) {
    gameState.loseLife();
    if (gameState.lives <= 0) {
      scene.time.delayedCall(500, () => scene.scene.start('GameOverScene'));
    }
  }

  static _escombroGolpeCivil(scene) {
    scene.temporizadorAgotado = true;
    scene.time.delayedCall(500, () => scene.scene.start('GameOverScene'));
  }

  static _enemigoGolpeaJugador(scene) {
    if (scene.enemigo && !scene.enemigo.puedeGolpear()) return;
    gameState.loseLife();
    if (gameState.lives <= 0) {
      scene.time.delayedCall(500, () => scene.scene.start('GameOverScene'));
    }
  }

  static _verificarAvance(scene) {
    const req = scene.cfg.npcsRequeridos || (scene.civiles ? scene.civiles.length : 0);
    if (gameState.npcsSavedInLevel >= req) {
      scene.time.delayedCall(500, () => {
        scene.scene.start(scene.cfg.siguienteNivel);
      });
    }
  }

  static intentarRomper(scene) {
    if (!scene.breakables || scene.breakables.length === 0 || !scene.jugador) return;
    const maxDist = 50;
    let objetivo = null;
    let mejorDist = Infinity;
    scene.breakables.forEach(b => {
      if (!b.active) return;
      const d = Phaser.Math.Distance.Between(scene.jugador.x, scene.jugador.y, b.x, b.y);
      if (d < mejorDist) { mejorDist = d; objetivo = b; }
    });
    if (objetivo && mejorDist <= maxDist) {
      objetivo.destroy();
      scene.breakables = scene.breakables.filter(b => b !== objetivo);
      gameState.addScore(50);
    }
  }
}
