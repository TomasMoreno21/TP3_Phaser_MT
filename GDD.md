# GDD — SALVAVIDAS

## Nombre del juego
**SALVAVIDAS**

## Concepto
"Está mal, pero no tan mal" — Sos un bombero en un edificio en llamas. Para salvar a los civiles, tenés que empujarlos fuera de las zonas de peligro antes de que les caigan escombros. Empujar está mal, pero acá no tan mal porque es la única forma de salvarles la vida.

## Plataforma
Web (Phaser.js 4.1.0 + Matter.js)

## Controles
- WASD / Flechas: mover al bombero
- ESPACIO: romper obstáculos

## Niveles

### Nivel 1 — Casa
Escenario simple para aprender la mecánica. Civiles distraídos, escombros que caen con advertencia visual (círculo rojo). Se salvan 3 NPCs para avanzar.

### Nivel 2 — Departamento
Se agregan zonas de gas que bajan el oxígeno y restan puntos. Obstáculos rompibles con ESPACIO. Mayor cantidad de escombros y menor tiempo de reacción.

### Nivel 3 — Edificio
Nivel final. Se agrega un enemigo (bombero que enloqueció con el humo) que patrulla y descuenta vidas al contacto. Esquivar al enemigo mientras se rescatan NPCs.

## Mecánicas principales
- Empujar civiles fuera de la zona de peligro
- Advertencia visual: círculo rojo + parpadeo antes de que caiga escombro
- Romper obstáculos con ESPACIO
- Zonas de gas que drenan oxígeno
- Enemigo que patrulla y persigue

## Puntaje
- **Suma puntos**: salvar NPC (+100), romper obstáculo (+50)
- **Resta puntos**: empujar NPC sin peligro (-20), perder vida (-100), estar en gas

## Vidas
- 3 vidas por partida
- Se pierde una vida al: ser golpeado por escombro, tocar el enemigo, quedarse sin oxígeno, agotar el tiempo
- Game Over al perder todas las vidas

## Objetivo
Salvar a todos los NPCs en cada nivel para avanzar. Completar los 3 niveles para ganar.

## Pantallas
- Menú principal → Nivel 1 → Nivel 2 → Nivel 3 → Victoria
- Game Over si se pierden todas las vidas
