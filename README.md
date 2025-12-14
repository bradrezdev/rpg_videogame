# ⚔️ Batalla de Héroes - RPG Automático

Un juego de rol automático en 2D donde gestionas un equipo de peleadores que combaten automáticamente. Recluta héroes, mejora sus habilidades, explora mazmorras y compite en la arena PvP.

🎮 **[Jugar Ahora](https://bradrezdev.github.io/rpg_videogame/)**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Características

### 💪 Sistema de Personajes
- **8 Clases Únicas**: Bárbaro, Tanque, Asesino, Arquero, Peleador, Curador, Hechicero, Invocador
- **Sistema de Stats**: Fuerza, Agilidad, Resistencia, Inteligencia
- **Niveles**: Cuenta (1-30) y Peleadores (1-50)
- **Personalización**: Distribución libre de puntos de stats

### ⚔️ Sistema de Combate
- **Combate Automático**: Los peleadores luchan solos basándose en sus stats
- **Barras de Acción**: Sistema dinámico basado en velocidad
- **Habilidades**: 3 activas + 3 pasivas por peleador
- **Sistema de Tiers**: Mejoras de habilidades en niveles específicos
- **Críticos y Evasión**: Mecánicas avanzadas de combate

### 🗺️ Modos de Juego

#### Exploración
- **5 Zonas**: Desde Bosque Inicial hasta Trono del Rey
- **10 Escenarios por zona**: 9 normales + 1 jefe final
- **Progresión**: Desbloquea zonas al derrotar jefes
- **Recompensas escaladas**: EXP y Oro aumentan con la dificultad

#### Arena PvP
- **13 Rangos**: Desde Bronce III hasta Gran Maestro
- **Oponentes Dinámicos**: Equipos generados con IA
- **Sistema de Puntos**: Gana/pierde puntos según victoria/derrota
- **Recompensas por Rango**: Oro y gemas según tu posición

### 🎒 Sistema de Items
- **3 Tipos**: Armas, Armaduras, Accesorios
- **4 Raridades**: Normal, Raro, Épico, Legendario
- **Drops por Zona**: Mejores items en zonas avanzadas
- **Stats Escalados**: Bonificaciones aumentan con rareza y zona
- **50+ Items Diferentes**: Variedad para personalizar builds

### 🎯 Sistema de Habilidades
- **10 Activas + 10 Pasivas** por clase
- **Aprendizaje Aleatorio**: Sistema de pool único por peleador
- **3 Tiers de Mejora**: Habilidades evolucionan con el nivel
- **Synergías**: Combina activas y pasivas para builds poderosos

---

## 🎮 Cómo Jugar

### Inicio
1. **Crea tu cuenta**: Elige nombre y avatar
2. **Recluta peleadores**: Empieza con 100 de oro
3. **Forma tu equipo**: Hasta 3 peleadores según nivel de cuenta

### Progresión
1. **Exploración**: Completa escenarios para ganar EXP y oro
2. **Mejora personajes**: Distribuye puntos de stats al subir de nivel
3. **Desbloquea habilidades**: Se aprenden automáticamente al subir de nivel
4. **Obtén items**: Derrota enemigos para conseguir equipo
5. **Compite en Arena**: Enfrenta oponentes para escalar rangos

### Consejos
- 🎯 **Diversifica tu equipo**: Combina diferentes clases para balance
- 📊 **Distribuye stats sabiamente**: Cada clase tiene fortalezas diferentes
- 🗡️ **Prioriza items**: Los legendarios valen la espera
- ⚔️ **Practica en Exploración**: Gana experiencia antes de la Arena
- 🏆 **Sube de rango gradualmente**: La Arena es más difícil en rangos altos

---

## 🎨 Clases y Especialidades

| Clase | Especialidad | Stats Clave | Rol |
|-------|--------------|-------------|-----|
| 🪓 **Bárbaro** | Daño físico alto | STR, RES | Damage Dealer |
| 🛡️ **Tanque** | Defensa extrema | RES, STR | Tank |
| 🗡️ **Asesino** | Críticos letales | AGI, STR | Assassin |
| 🏹 **Arquero** | Ataques precisos | AGI, STR | Ranged DPS |
| 👊 **Peleador** | Combos rápidos | STR, AGI | Balanced Fighter |
| 💚 **Curador** | Sanación | INT, RES | Support/Healer |
| 🔮 **Hechicero** | Magia poderosa | INT | Magic DPS |
| 👻 **Invocador** | Invocaciones | INT, AGI | Summoner |

---

## 🏆 Sistema de Raridades

### Items
- ⚪ **Normal** (1.0x stats): Items básicos
- 🔵 **Raro** (1.5x stats): Items mejorados
- 🟣 **Épico** (2.0x stats): Items poderosos
- 🟠 **Legendario** (3.0x stats): Items definitivos

### Drops por Zona
1. 🌲 **Bosque Inicial**: 100% Normal
2. 🏔️ **Montaña Oscura**: 80% Normal, 20% Raro
3. 🏰 **Castillo Sombrío**: 80% Raro, 20% Épico
4. 🌋 **Volcán Infernal**: 80% Épico, 20% Legendario
5. 👑 **Trono del Rey**: 50% Épico, 50% Legendario

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Almacenamiento**: LocalStorage (guardado automático)
- **Fuentes**: Google Fonts (Cinzel, Almendra, Rajdhani)
- **Hosting**: GitHub Pages

---

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/rpg_videogame.git

# Navegar al directorio
cd rpg_videogame

# Abrir index.html en tu navegador
# O usar un servidor local:
python -m http.server 8000
# Luego visita: http://localhost:8000
```

---

## 🗺️ Roadmap

### Fase 1-5 ✅ (Completadas)
- [x] Sistema de menús y navegación
- [x] Personajes y stats
- [x] Combate automático
- [x] Sistema de habilidades
- [x] Exploración y Arena
- [x] Sistema de items y drops

### Futuras Mejoras 🔮
- [ ] Sistema de equipamiento completo
- [ ] Más zonas y enemigos
- [ ] Sistema de logros
- [ ] Música y efectos de sonido
- [ ] Modo multijugador real
- [ ] Sistema de gremios
- [ ] Eventos especiales

---

## 🎯 Estado del Proyecto

**Versión Actual**: 1.0.0  
**Estado**: Completamente jugable (95%)  
**Última Actualización**: Diciembre 2025

### Progreso por Sistema
- ✅ Core Gameplay: 100%
- ✅ Exploración: 100%
- ✅ Arena: 100%
- ✅ Sistema de Items: 100%
- ⚠️ Sistema de Equipamiento: 0% (placeholder)
- ⚠️ Audio: 0%

---

## 👨‍💻 Desarrollo

El juego fue desarrollado usando arquitectura modular con:
- Sistema de estados (gameState)
- Inicializadores de pantalla
- Motor de combate por turnos
- Generación procedural de enemigos y items
- Sistema de guardado automático

### Estructura de Archivos
```
rpg_videogame/
├── index.html          # Estructura HTML
├── styles.css          # Estilos y temas
├── game.js            # Lógica del juego
├── README.md          # Documentación
└── detalles_videogame.md  # Diseño original
```

---

## 🐛 Reportar Bugs

¿Encontraste un bug? Por favor abre un [Issue](https://github.com/TU_USUARIO/rpg_videogame/issues) con:
- Descripción del problema
- Pasos para reproducir
- Navegador y versión
- Screenshots (si aplica)

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- Diseño de juego inspirado en RPGs clásicos
- Fuentes de [Google Fonts](https://fonts.google.com/)
- Emojis para iconografía

---

## 📧 Contacto

**Desarrollador**: [Tu Nombre]  
**GitHub**: [@TU_USUARIO](https://github.com/TU_USUARIO)  
**Email**: tu_email@ejemplo.com

---

<div align="center">

**⚔️ ¡Prepárate para la batalla! ⚔️**

[Jugar Ahora](https://bradrezdev.github.io/rpg_videogame/) • [Reportar Bug](https://github.com/bradrezdev/rpg_videogame/issues) • [Contribuir](https://github.com/bradrezdev/rpg_videogame/pulls)

</div>
