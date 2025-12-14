# Diseño del Videojuego RPG 2D - Batalla de Héroes

## Concepto General
Videojuego en 2D con estilo RPG automático donde los jugadores controlan equipos de peleadores que combaten automáticamente.

## Géneros de Personajes
- **Masculino** 🧙‍♂️
- **Femenino** 🧙‍♀️

## Clases de Trabajo (8 clases disponibles)

### 1. Bárbaro 🪓
Guerrero feroz con alto daño físico

### 2. Tanque 🛡️
Defensor resistente que protege al equipo

### 3. Asesino 🗡️
Atacante ágil con golpes críticos

### 4. Arquero 🏹
Atacante a distancia con precisión

### 5. Peleador 👊
Luchador equilibrado cuerpo a cuerpo

### 6. Curador 💚
Sanador que restaura vida del equipo

### 7. Hechicero 🔮
Mago con poderosos hechizos

### 8. Invocador 👻
Controla criaturas invocadas

---

## Sistema de Stats (4 estadísticas principales)

### 1. Fuerza (STR)
- **Efecto**: Incrementa daño físico

### 2. Agilidad (AGI)
- **Efectos**:
  - Incrementa éxito de ataque (precisión)
  - Incrementa evasión
  - Incrementa velocidad de ataque
  - Incrementa velocidad de movimiento

### 3. Resistencia (RES)
- **Efectos**:
  - Incrementa defensa física
  - Incrementa resistencia mágica

### 4. Inteligencia (INT)
- **Efectos**:
  - Incrementa maná
  - Incrementa fuerza de las invocaciones

---

## Sistema de Niveles

### Nivel de Cuenta (Max: 30)
Determina la cantidad de peleadores que puedes controlar:

| Nivel | Peleadores |
|-------|------------|
| 1-10  | 1 peleador |
| 11-20 | 2 peleadores |
| 21-30 | 3 peleadores |

### Nivel de Peleador (Max: 50)
- Cada nivel otorga **5 puntos** para distribuir libremente en stats
- Los stats base también incrementan automáticamente con cada nivel
- Desbloquea habilidades en niveles específicos

---

## Sistema de Habilidades

### Pool de Habilidades por Peleador
- **Total**: 20 habilidades (10 activas + 10 pasivas)
- **Aprende**: 6 habilidades (3 activas + 3 pasivas)
- **Selección**: Aleatoria por el sistema

### Progresión de Habilidades

#### Habilidades Activas

| Nivel | Habilidad | Descripción |
|-------|-----------|-------------|
| 5     | Activa #1 Tier 1 | Primera habilidad activa |
| 8     | Activa #1 Tier 2 | Mejora de habilidad #1 |
| 20    | Activa #1 Tier 3 | Mejora máxima de habilidad #1 |
| 30    | Activa #2 Tier 1 | Segunda habilidad activa |
| 40    | Activa #3 Tier 1 | Tercera habilidad activa |
| 45    | Activa #2 Tier 2 | Mejora de habilidad #2 |
| 45    | Activa #3 Tier 2 | Mejora de habilidad #3 |
| 50    | Activa #3 Tier 3 | Mejora máxima de habilidad #3 |

#### Habilidades Pasivas

| Nivel | Habilidad | Descripción |
|-------|-----------|-------------|
| 11    | Pasiva #1 Tier 1 | Primera habilidad pasiva |
| 15    | Pasiva #1 Tier 2 | Mejora de pasiva #1 |
| 27    | Pasiva #1 Tier 3 | Mejora máxima de pasiva #1 |
| 25    | Pasiva #2 Tier 1 | Segunda habilidad pasiva |
| 29    | Pasiva #2 Tier 2 | Mejora de pasiva #2 |
| 35    | Pasiva #2 Tier 3 | Mejora máxima de pasiva #2 |
| 33    | Pasiva #3 Tier 1 | Tercera habilidad pasiva |
| 43    | Pasiva #3 Tier 2 | Mejora de pasiva #3 |
| 49    | Pasiva #3 Tier 3 | Mejora máxima de pasiva #3 |

---

## Sistema de Combate Automático

### Mecánica de Ataque
1. Cada peleador tiene una **barra de acción** horizontal (0-100%)
2. La barra se carga según la **velocidad de ataque** del personaje
3. Al llegar a **100%**, el personaje ataca automáticamente
4. La barra se reinicia después de cada ataque

### Ataques Especiales
- Cada **4 ataques básicos**, el 5º ataque será un **ataque especial**
- El ataque especial usa una de las habilidades activas aprendidas

### Condiciones de Victoria
- **Gana**: El jugador que derrote a todos los peleadores enemigos primero
- **Recompensas**: Puntos de experiencia y objetos al azar

### Batallas de Equipo
- Hasta **3 peleadores por jugador** simultáneamente
- La batalla termina cuando todos los peleadores de un jugador caen
- Gana el jugador con al menos un peleador con vida

---

## Modos de Juego

### 1. Exploración 🗺️
- **Objetivo**: Completar misiones y vencer monstruos y jefes
- **Progresión**: Sistema de zonas y escenarios
- **Recompensas**: Experiencia y oro escalados por dificultad

### 2. Arena ⚔️
- **Objetivo**: Combatir contra otros jugadores
- **Sistema**: PvP competitivo
- **Ranking**: Sistema de puntos y clasificación

---

## Notas de Implementación
- El juego es completamente **automático** (no requiere control manual en combate)
- Los jugadores se enfocan en **estrategia** (composición de equipo, distribución de stats)
- Sistema de **progresión** a través de experiencia y niveles
- **Personalización** mediante elección de stats y habilidades aleatorias
