# Prototipo: Imperium Cross — App de Gimnasio

## Descripción General

Imperium Cross es una aplicación móvil de gimnasio diseñada como prototipo de alta fidelidad (high-fidelity prototype) dentro de un marco simulado de iPhone 14 Pro (390×720px, bordes redondeados de 36px). El fondo de la app es oscuro (#0B0B12) con una paleta de colores que combina naranja (#FF4D00), púrpura (#7B61FF), verde (#30D158) y dorado (#FFD60A) sobre superficies oscuras (#141420, #1C1C2A). La tipografía utiliza Barlow y Barlow Condensed. El prototipo contiene 22 pantallas navegables, un sistema de chat con IA real (Groq API), rutinas de entrenamiento, gamificación, escaneo QR, historial de progreso y más.

---

## Contenido del Prototipo por Pantalla

### 1. Pantalla de Login

**Propósito:** Acceso inicial a la aplicación.

**Elementos visuales:**
- Logo grande "IC" con degradado naranja en la parte superior
- Nombre "Imperium Cross" en tipografía Barlow Condensed
- Campo de entrada de correo electrónico con ícono de email
- Campo de contraseña con ícono de candado y botón de mostrar/ocultar contraseña (ojo)
- Botón de "¿Olvidaste tu contraseña?" en texto naranja
- Botón principal "Iniciar Sesión" con degradado naranja (llamativo, grande)
- Separador visual "O"
- Dos botones de inicio de sesión social: Google y Apple, con iconos de cada marca
- Texto inferior "¿No tienes cuenta? Regístrate aquí" con "Regístrate aquí" en naranja
- Efecto de resplandor radial naranja en la parte superior del fondo

**Flujo de navegación:**
- "Iniciar Sesión" → Pantalla de Inicio (`inicio`)
- "Regístrate aquí" → Pantalla de Onboarding (`onboarding`)

---

### 2. Pantalla de Onboarding

**Propósito:** Registro de nuevo usuario en dos fases.

**Fase 1 — Datos de cuenta:**
- Título "Crea tu cuenta"
- Campo de correo electrónico
- Campo de contraseña
- Botón "Continuar" con degradado naranja
- Texto inferior "¿Ya tienes cuenta? Inicia sesión" con enlace

**Fase 2 — Datos físicos:**
- Título "Cuéntanos sobre ti"
- Control deslizante (slider) de estatura: rango 140–210 cm
- Control deslizante de peso: rango 40–150 kg
- Selector de edad con botones +/- (rango 14–80 años)
- Selector de nivel físico con tres opciones: Principiante / Intermedio / Avanzado
- Resumen visual con chips que muestran los valores seleccionados
- Botón "Finalizar Perfil" con degradado naranja
- Botón "Saltar" para omitir el onboarding

**Transiciones:** Las fases se deslizan horizontalmente con transiciones de 0.32 segundos.

**Flujo de navegación:**
- "Continuar" (Fase 1) → Fase 2
- "Finalizar Perfil" (Fase 2) → Pantalla de Inicio
- "Saltar" → Pantalla de Inicio directamente

---

### 3. Pantalla de Inicio (Home)

**Propósito:** Centro de mando principal del usuario.

**Elementos visuales (de arriba a abajo):**
- Barra superior: Saludo "¡Hola, Carlos!" con ícono de campana de notificaciones a la derecha, y avatar circular "CR" con degradado naranja que lleva al perfil
- Toggle de modo gimnasio: Píldora con dos opciones "Fuera del gym" / "En el gym". Al activar "En el gym", aparece un popup de "Ubicación Verificada" con borde verde y texto "Acceso completo activado" que se cierra automáticamente tras 2.6 segundos
- Tarjeta hero "Rutina del Día": fondo oscuro con resplandor radial naranja, muestra racha de días (streak), calorías estimadas, duración, y botón "Comenzar Entrenamiento"
- Tarjeta "Guía de Máquinas": fondo púrpura con resplandor radial púrpura
- Gráfico semanal de progreso: barras verticales para L-D (Lunes a Domingo) con degradado naranja, el día actual tiene la barra más alta
- Tres tarjetas de estadísticas en fila: Sesiones (ícono de calendario), Calorías (ícono de fuego), Logros (ícono de estrella)
- Tres botones de acceso rápido en fila: Escanear QR, Gamificación (puntos), Coach IA

**Funcionalidad del toggle de modo gimnasio:**
- Cuando está en "En el gym": se desbloquean funciones premium (Chat Coach IA, Gamificación/Premios)
- Cuando está en "Fuera del gym": Chat y Premios muestran un overlay de bloqueo con efecto de desenfoque (blur)
- Al cambiar a "En el gym": se muestra un popup de verificación de ubicación en la parte superior que se cierra solo

**Flujo de navegación:**
- Avatar "CR" → Perfil
- "Ver Planes" → Pantalla de Planes
- "Comenzar Entrenamiento" → Sesión de Entrenamiento
- "Guía de Máquinas" → Lista de Máquinas
- Acceso rápido QR → Escáner QR
- Acceso rápido Gamificación → Gamificación
- Acceso rápido Coach IA → Chat con IA

---

### 4. Pantalla de Planes (Rutinas)

**Propósito:** Explorar y crear rutinas de entrenamiento.

**Elementos visuales:**
- Seis tarjetas de categorías en lista, cada una con emoji, nombre y color de acento:
  - Mis Planes (naranja)
  - Tren Superior (púrpura)
  - Piernas (verde)
  - Core (amarillo)
  - Cardio (rojo)
  - Full Body (azul)
- Sección "Crear nueva rutina" con dos botones:
  - "Plan Manual" con ícono de llave inglesa
  - "Plan con IA" con ícono de destellos, degradado púrpura-naranja

**Flujo de navegación:**
- Tocar categoría → Pantalla de Categoría de Rutina (selecciona la categoría)
- "Plan Manual" → Constructor de Plan Manual
- "Plan con IA" → Generador de Plan con IA

---

### 5. Pantalla de Categoría de Rutina

**Propósito:** Elegir un programa dentro de una categoría.

**Elementos visuales:**
- Barra superior con botón de regresar y título de la categoría
- Tres tarjetas de programas por categoría, cada una con:
  - Barra de color de acento vertical a la izquierda
  - Nombre del programa
  - Badge de nivel (Principiante/Intermedio/Avanzado)
  - Número de días y frecuencia semanal
  - Duración total del programa

**Para la categoría "Mis Planes":** Muestra los planes guardados por el usuario en lugar de los predefinidos.

**Ejemplos de programas (Tren Superior):**
- "Pecho & Triceps Starter" — Principiante, 21 días
- "Volumen Total Superior" — Intermedio, 30 días
- "Power Push Program" — Avanzado, 42 días

**Flujo de navegación:**
- Tocar programa → Pantalla de Detalle de Rutina

---

### 6. Pantalla de Detalle de Rutina

**Propósito:** Ver el plan completo de entrenamiento semana por semana.

**Elementos visuales:**
- Barra superior con botón de regresar y nombre del programa
- Barra de progreso general del plan
- Secciones por semana (Semana 1, 2, 3, 4) con encabezados
- Filas de días expandibles, cada una con:
  - Número de día y enfoque muscular
  - Indicador de estado: completado (check verde), actual (naranja), futuro (gris)
  - Tipo: entrenamiento o descanso
  - Duración y calorías estimadas
- Al expandir un día: lista de ejercicios con series × reps
- Botón flotante "Continuar Día X" con degradado naranja

**Flujo de navegación:**
- "Continuar Día X" → Sesión de Entrenamiento

---

### 7. Pantalla de Sesión de Entrenamiento

**Propósito:** Ejecutar una rutina de ejercicios con temporizadores y guía visual.

**Fases de la sesión (4 fases):**

**Fase 1 — Cuenta Regresiva:**
- Pantalla oscura con resplandor radial naranja
- Círculo grande de 160px con anillo naranja que se reduce
- Números grandes de cuenta regresiva: 5, 4, 3, 2, 1
- Nombre del primer ejercicio y configuración (series × reps o tiempo)
- Texto "Prepárate"

**Fase 2 — Demostración:**
- Contador de ejercicio (1/6, 2/6, etc.)
- Nombre del ejercicio como encabezado
- GIF animado del ejercicio (280px de altura) o imagen estática
- Tarjetas de metadata: número de series + número de reps (o duración para ejercicios basados en tiempo)
- Botón "Comenzar" con degradado naranja

**Fase 3 — Ejecución Activa:**
- GIF en bucle en la parte superior (240px)
- Etiqueta "En Ejecución"
- Indicador de progreso del ejercicio
- Para ejercicios basados en tiempo: temporizador circular de cuenta regresiva (130px), cambia a rojo-naranja cuando quedan ≤5 segundos
- Para ejercicios basados en reps: dos tarjetas de visualización mostrando Series y Reps con números grandes
- Botón "Completar" verde con ícono de check

**Fase 4 — Descanso:**
- Cuenta regresiva de 15 segundos en display circular verde (150px)
- Fondo de degradado radial verde
- Tarjeta de vista previa del siguiente ejercicio (con miniatura, nombre, configuración)
- Botón "Saltar Descanso"
- Si es el último ejercicio: mensaje "¡Último ejercicio completado!"

**Ejercicios en la sesión por defecto (6 ejercicios):**
1. Prensa de Pecho en Máquina — 3×12
2. Fondos de Tríceps Asistidos — 3×10
3. Extensión de Piernas — 3×15
4. Face Pull — 3×12
5. Cinta de Correr — 1×45s
6. Prensa de Pecho Inclinada — 3×10

**Flujo de navegación:**
- Completar todos los ejercicios → Resumen del Entrenamiento

---

### 8. Pantalla de Resumen del Entrenamiento

**Propósito:** Mostrar los resultados del entrenamiento completado.

**Elementos visuales:**
- Popup de progreso de desafío (solo en modo gimnasio): tarjeta verde que muestra el progreso de racha (ej: "Día 3 de 5"), barra de progreso, se cierra automáticamente
- Héroe de completado: checkmark verde grande con efecto de resplandor
- Badge de racha extendida
- Tres tarjetas analíticas:
  - Volumen de Carga Total: 8,400 kg
  - Series Ejecutadas: 24
  - Tiempo Total Bajo Tensión: 42 min
- Gráfico comparativo de barras: Sesión Anterior vs Sesión Actual (Volumen, Series, Tiempo, Calorías) con indicador de mejora +12%

**Flujo de navegación:**
- "Finalizar y Volver al Home" → Pantalla de Inicio

---

### 9. Pantalla de Escáner QR

**Propósito:** Escanear códigos QR de máquinas del gimnasio para ver información.

**Elementos visuales:**
- Visor de escaneo cuadrado de 240×240px con esquinas marcadas (4 esquinas animadas de 22px)
- Línea de escaneo horizontal animada que se mueve de arriba a abajo (efecto de rayo)
- Superposición de estilo CRT con líneas de escaneo sutiles
- Botón "Iniciar Escaneo" con degradado naranja
- Tarjeta informativa "¿Cómo funciona?" con 3 pasos numerizados

**Proceso de escaneo:**
1. El usuario toca "Iniciar Escaneo"
2. Se activa la animación de escaneo (2.2 segundos)
3. Se detecta aleatoriamente una de las 6 máquinas disponibles
4. Se muestra feedback visual: checkmark verde, texto "¡QR detectado!", nombre de la máquina
5. Tras 0.8 segundos, se redirige automáticamente a la Pantalla de Detalle de Máquina

**Estados del visor:**
- Por defecto: borde blanco al 25% de opacidad
- Escaneando: borde naranja
- Detectado: borde verde

**Flujo de navegación:**
- "Iniciar Escaneo" → (tras detección) → Detalle de Máquina

---

### 10. Pantalla de Guía de Máquinas

**Propósito:** Explorar todas las máquinas disponibles con información detallada.

**Elementos visuales:**
- Lista scrollable de 6 máquinas, cada una como tarjeta horizontal con:
  - Nombre del ejercicio en español y inglés
  - Etiqueta del músculo principal
  - Miniatura de imagen de la máquina

**Máquinas disponibles:**
1. Chest Press Machine (#07) — Pectoral Mayor
2. Assisted Triceps Dips (#14) — Tríceps Braquial
3. Leg Extension (#11) — Cuádriceps
4. Face Pull (#03) — Deltoides Posterior
5. Cinta de Correr (#01) — Sistema Cardiovascular
6. Incline Chest Press Machine (#08) — Pecho Superior

**Flujo de navegación:**
- Tocar máquina → Detalle de Máquina

---

### 11. Pantalla de Detalle de Máquina

**Propósito:** Guía completa de uso de una máquina específica.

**Elementos visuales (de arriba a abajo):**
- Barra superior con botón de regresar y nombre de la máquina
- Imagen grande de la máquina
- Tarjeta de descripción con texto explicativo
- Tarjeta de equipamiento necesario
- Etiquetas de músculos trabajados (el músculo principal tiene estrella)
- Sección "Cómo Usarla": tarjetas numerizadas con pasos (4 pasos por máquina)
- Tarjeta de consejos de seguridad con borde amarillo
- Botón "Reproducir Ejemplo" que alterna entre reproducir GIF / reproduciendo...
- Configurador de ejercicio:
  - Toggle de modo: "Por Repeticiones" vs "Por Tiempo"
  - Stepper de series (1–6, con +/-)
  - Stepper de reps (1–50, con +/-)
  - Botones de selección rápida de reps: 6, 8, 10, 12, 15, 20
  - Botones de selección rápida de tiempo: 20s, 30s, 45s, 60s, 90s, 120s
- Botón "Comenzar Ejercicio" naranja

**Flujo de navegación:**
- "Comenzar Ejercicio" → Ejercicio Individual

---

### 12. Pantalla de Ejercicio Individual

**Propósito:** Ejecutar un solo ejercicio fuera de una rutina completa.

**Fases (3 fases):**

**Fase 1 — Cuenta Regresiva:** Igual que en la sesión de entrenamiento (5-4-3-2-1 con anillo naranja).

**Fase 2 — Ejecución Activa:**
- Para ejercicios basados en tiempo: temporizador circular de cuenta regresiva
- Para ejercicios basados en reps: visualización de series y reps
- Botón "Completar" verde

**Fase 3 — Completado:**
- Checkmark verde grande con héroe de éxito
- Métricas: tiempo total, calorías estimadas (tiempo × 0.18), series completadas, reps
- Etiquetas de músculos trabajados
- Botones "Ver Máquina" y "Volver al Inicio"

**Flujo de navegación:**
- "Ver Máquina" → Detalle de Máquina
- "Volver al Inicio" → Pantalla de Inicio

---

### 13. Pantalla de Historial y Progreso

**Propósito:** Visualizar el progreso y actividad del usuario a lo largo del tiempo.

**Elementos visuales:**
- Pestañas de período: Semana / Mes / Total
- Tres tarjetas de estadísticas resumen
- Calendario semanal con días entrenados indicados
- Gráfico de barras de actividad
- Gráfico de líneas SVG de peso corporal con relleno de degradado naranja y línea de objetivo (78 kg)
- Indicador de IMC (índice de masa corporal) con medidor de color: azul (bajo) → verde (normal) → amarillo (sobrepeso) → rojo (obeso)
- Barras de progreso de frecuencia muscular: Pecho 85%, Espalda 70%, Piernas 60%, Hombros 50%, Bíceps 65%, Core 40%
- Lista de sesiones recientes con fecha, duración y calorías

**Datos de ejemplo:**
- Peso: de 82.5 kg a 79.9 kg a lo largo de 12 semanas
- IMC: ~26.1 (con altura de 1.75m)

**Flujo de navegación:**
- Botón de estadísticas → Estadísticas Detalladas

---

### 14. Pantalla de Estadísticas Detalladas

**Propósito:** Visualización avanzada de métricas de rendimiento.

**Elementos visuales:**
- Pestañas de período: Semanal / Mensual / Trimestral
- Gráfico de líneas SVG con tres polilíneas: Peso Corporal, Masa Muscular, Grasa Corporal
- Tarjetas de Récords Personales (PRs):
  - Press de Banca: 120 kg
  - Sentadilla: 150 kg
  - Peso Muerto: 180 kg
  - Press Militar: 80 kg

**Flujo de navegación:**
- Botón de regresar → Historial

---

### 15. Pantalla de Gamificación

**Propósito:** Sistema de desafíos y recompensas.

**Elementos visuales:**
- Tarjeta de puntos con degradado dorado y fondo de resplandor radial
- Botones "Tienda de Premios" y "Mis Cupones"
- Pestañas: Retos Activos / Retos Completados
- Seis tarjetas de desafíos, cada una con:
  - Título del desafío
  - Descripción
  - Barra de progreso
  - Recompensa en puntos

**Desafíos disponibles (6):**
1. Completar 4 visitas al gimnasio por semana — 200 puntos
2. 3 sesiones de piernas al mes — 300 puntos
3. Superar tu récord de sentadilla — 500 puntos
4. Entrenar 5 días consecutivos (racha) — 400 puntos
5. Registrar peso 3 semanas seguidas — 150 puntos
6. 10 sesiones de cardio — 350 puntos

**Bloqueo fuera del gimnasio:** Cuando el usuario está en "Fuera del gym", se muestra un overlay con efecto de desenfoque, ícono de candado, y texto "REQUIERE PRESENCIA EN EL GYM".

**Flujo de navegación:**
- "Tienda de Premios" → Tienda de Premios
- "Mis Cupones" → Cartera de Cupones

---

### 16. Pantalla de Tienda de Premios

**Propósito:** Canjear puntos por recompensas.

**Elementos visuales:**
- Barra de saldo de puntos
- Seis tarjetas de productos canjeables:
  1. 15% descuento en suplementos — 500 puntos
  2. Batido de proteína gratis — 300 puntos
  3. 20% descuento en membresía — 1,000 puntos
  4. Clase especial gratis — 800 puntos
  5. Masaje deportivo de 30 min — 600 puntos
  6. Botella Imperium Cross — 400 puntos

**Modal de confirmación de canje:** Bottom sheet que se desliza desde abajo con:
  - Emoji del producto, título, subtítulo, costo en puntos, fecha de expiración
  - Botones "Confirmar Canje" y "Cancelar"

**Flujo de navegación:**
- "Canjear" → Modal de confirmación → (confirmar) → Gamificación

---

### 17. Pantalla de Cartera de Cupones

**Propósito:** Visualizar y gestionar cupones canjeados.

**Elementos visuales:**
- Barra de saldo de puntos con botón "+ Canjear"
- Tarjetas expandibles de cupones, cada una con:
  - Código de cupón en tipografía monoespaciada
  - Patrón pseudo-QR generado procedimentalmente (cuadrícula 9×9 con esquinas de referencia)
  - Código de barras decorativo
  - Botón "Marcar como Utilizado"
- Estado de cupón utilizado: checkmark verde, texto "Cupón Utilizado", texto tachado, opacidad reducida

**Flujo de navegación:**
- "+ Canjear" → Tienda de Premios
- "Marcar como Utilizado" → Actualiza estado del cupón

---

### 18. Pantalla de Detalle de Mi Plan

**Propósito:** Ver un plan guardado por el usuario.

**Elementos visuales:**
- Chips de metadata: tipo (Plan IA/Plan Manual), músculo, frecuencia, duración
- Barra de progreso del plan
- Selector de días horizontal scrollable con indicador de día de descanso
- Contenido del día seleccionado:
  - Si es día de descanso: emoji de dormir
  - Si es día activo: tarjetas de ejercicios con series, reps y descanso editables
- Botón "Comenzar" con degradado naranja

---

### 19. Pantalla de Plan Manual

**Propósito:** Construir una rutina de entrenamiento personalizada manualmente.

**Elementos visuales:**
- Stepper para número total de días
- Pestañas horizontales de días con indicador de descanso
- Toggle de descanso/activo por día
- Campo de búsqueda de ejercicios con filtro en tiempo real
- Selector de ejercicios categorizados en 5 grupos:
  - Tren Inferior (22 ejercicios)
  - Empujes/Pecho/Hombros/Tríceps (29 ejercicios)
  - Tracciones/Espalda/Bíceps (23 ejercicios)
  - Core/Estabilizadores (12 ejercicios)
  - Cardiovascular/Funcional (11 ejercicios)
- Tarjetas de ejercicios con inputs editables de series, reps y descanso
- Botón de eliminar ejercicio
- Botón "Guardar Rutina" con degradado naranja

**Total de ejercicios disponibles:** ~90+ ejercicios.

**Flujo de navegación:**
- "Guardar Rutina" → Pantalla de Planes (el plan aparece en "Mis Planes")

---

### 20. Pantalla de Plan con IA

**Propósito:** Generar una rutina automáticamente mediante inteligencia artificial.

**Elementos visuales:**
- Banner de IA que explica qué analiza el motor de IA
- Stepper para número total de días (7–84)
- Chips de frecuencia (2–6 días por semana)
- Control deslizante de duración (30–120 minutos)
- Selector de equipamiento con chips multi-selección (7 opciones)
- Cuadrícula de enfoque muscular (6 opciones)
- Orbe de procesamiento animado con tres anillos concéntricos giratorios:
  - Anillo exterior (130px): gira en 8 segundos, borde púrpura
  - Anillo medio (106px): gira en 5 segundos en reversa, borde naranja
  - Anillo interior (84px): ícono de robot o checkmark, fondo degradado
- Barra de progreso animada
- Estados: idle ("Motor de IA en espera") → procesando ("Generando...") → completado ("¡Rutina estructurada!")
- Botón "Generar" / "Ver mi Rutina"

**Flujo de navegación:**
- "Generar" → Animación de procesamiento → "Ver mi Rutina" → Detalle de Mi Plan

---

### 21. Pantalla de Chat con Coach IA (Chatbot)

**Propósito:** Asistente virtual con inteligencia artificial real para resolver dudas sobre ejercicios, nutrición, máquinas y productos.

**Arquitectura técnica:**
- Integración con la API de Groq (modelo LLM en la nube)
- Endpoint importado desde `src/services/groqChat.ts`
- Sistema de prompts que define las capacidades del coach
- Mensajes enviados en formato `{ role: "user" | "assistant", content: string }`
- El historial de chat se mantiene en el estado raíz de la aplicación

**Elementos visuales:**
- Barra superior con avatar de degradado púrpura-naranja, ícono de robot, y indicador "En Línea" con punto verde y animación de pulso
- Hilo de mensajes scrollable:
  - Mensajes del usuario: burbujas naranjas alineadas a la derecha
  - Mensajes del IA: burbujas oscuras (#1C1C2A) alineadas a la izquierda, con avatar del coach
- Indicador de "escribiendo": tres puntos púrpura animados + texto "Pensando..." en itálica
- Barra de entrada de texto con borde que brilla en naranja al enfocar, botón de envío que se activa/desactiva según contenido
- Soporte de formato en mensajes: texto en negrita (`**texto**`), viñetas con bullet points, saltos de línea

**Capacidades del Coach IA (definidas en el prompt del sistema):**
- Técnica de ejercicios: explicar cómo realizar cada ejercicio correctamente
- Nutrición: consejos generales de alimentación para gimnasio
- Máquinas de la sala: instrucciones de uso de las 6 máquinas disponibles
- Productos del counter: información sobre suplementos y productos de la tienda
- Rechaza preguntas fuera de tema (política, clima, etc.) y redirige al contexto del gimnasio

**Mensaje de bienvenida:**
"¡Hola! Soy tu Coach Virtual de Imperium Cross. Puedo ayudarte con técnica de ejercicios, nutrición, máquinas de la sala y productos del counter. ¿En qué te puedo ayudar?"

**Bloqueo fuera del gimnasio:** Cuando el usuario está en "Fuera del gym", se muestra un overlay con efecto de desenfoque, ícono de robot, y texto "DISPONIBLE EN EL GYM".

**Persistencia:** Los mensajes del chat se mantienen entre navegaciones (el estado está en el componente raíz de la aplicación).

---

### 22. Pantalla de Perfil

**Propósito:** Visualizar y gestionar la información del usuario.

**Elementos visuales:**
- Avatar grande "CR" con degradado naranja
- Nombre "Carlos Rodriguez"
- Badge "Socio VIP" con estilo dorado, fecha de expiración "15 Oct 2026"
- Tres tarjetas antropométricas: Estatura (1.75m), Peso (79.9 kg), Nivel (Intermedio)
- Tarjeta de estadísticas: Sesiones (24), Racha (2 días), Puntos (1,240), Logros (8)
- Tres filas de gestión de cuenta

**Flujo de navegación:**
- "Editar datos" → Onboarding (Fase 2)
- "Seguridad" → Configuración
- Ícono de engranaje → Configuración

---

### 23. Pantalla de Configuración

**Propósito:** Ajustes de la aplicación y cuenta.

**Elementos visuales (tres secciones agrupadas):**

**Cuenta:**
- Cambiar contraseña
- Actualizar correo electrónico
- Autenticación de dos factores (2FA) con toggle

**Preferencias:**
- Modo oscuro con toggle (siempre activo en el prototipo)
- Notificaciones push con toggle
- Idioma: Español / Inglés

**Privacidad:**
- Políticas de privacidad
- Términos y condiciones

- Botón "Cerrar Sesión" en rojo
- Número de versión "v1.4.2"

**Flujo de navegación:**
- "Cerrar Sesión" → Pantalla de Login

---

## Navegación General

### Barra de Navegación Inferior (7 pestañas)

| Pestaña | Ícono | Etiqueta | Ruta |
|---|---|---|---|
| Inicio | Home | Inicio | `inicio` |
| Rutinas | ClipboardList | Rutinas | `planes` |
| Coach IA | Bot | Coach IA | `chatbot` |
| Escanear | QrCode | Escanear | `qr` |
| Progreso | TrendingUp | Progreso | `historial` |
| Premios | Trophy | Premios | `gamification` |
| Mi Perfil | User | Mi Perfil | `profile` |

**Características especiales:**
- El botón de QR está elevado: 44×44px, margen negativo superior, esquinas redondeadas de 14px, fondo degradado, borde brillante, ícono más grande
- El estado activo muestra el ícono y texto en naranja con efecto de sombra brillante
- La barra se oculta en pantallas de: login, onboarding, sesión de entrenamiento, resumen, ejercicio individual, plan manual, plan IA, categoría de rutina, detalle de rutina, estadísticas detalladas

### Sistema de Navegación por Pila
- La navegación utiliza un array de historial como pila
- `nav(ruta)` apila una nueva ruta
- `navTab(ruta)` reemplaza toda la pila (reset al cambiar de pestaña)
- Los botones de regresar sacan de la pila

### Pantallas con Barra de Navegación Inferior:
Inicio, Planes, Chatbot, QR, Historial, Gamificación, Perfil, Detalle de Mi Plan

### Pantallas sin Barra de Navegación Inferior:
Login, Onboarding, Sesión de Entrenamiento, Resumen, Ejercicio Individual, Plan Manual, Plan IA, Categoría de Rutina, Detalle de Rutina, Estadísticas Detalladas, Tienda de Premios, Cartera de Cupones

---

## Diseño Visual Detallado

### Paleta de Colores

**Colores principales:**
- Naranja primario: #FF4D00 (CTAs, estados activos, acentos)
- Naranja claro: #FF7A00 (degradados)
- Naranja medio: #FF6B35 (etiquetas secundarias)
- Púrpura: #7B61FF (funciones de IA, chatbot)
- Verde: #30D158 (éxito, descanso, completado)
- Amarillo/Dorado: #FFD60A (nivel intermedio, puntos)
- Rojo: #FF3B30 (logout, eliminar)
- Azul: #3B82F6 (BMI bajo, botón de GIF)

**Colores de texto:**
- Primario: #F2F2F7 (encabezados)
- Secundario: #8E8EA0 (etiquetas, subtítulos)
- Tenue: #5A5A70 (elementos futuros/deshabilitados)
- Cuerpo: #C4C4D0 (descripciones)

**Colores de fondo:**
- Base: #0B0B12 (fondo principal)
- Tarjeta: #141420
- Superficie: #1C1C2A (burbujas de chat)
- Profundo: #090910 (visor QR)

### Degradados Principales
- CTA primario: naranja claro a naranja oscuro (horizontal)
- Tarjeta hero del inicio: tonos marrón oscuro y negro
- Botón de IA: púrpura a naranja
- Avatar del perfil: naranja claro a naranja oscuro
- CTA de éxito: verde claro a verde oscuro
- Gráfico de peso: degradado vertical naranja semitransparente

### Tipografía
- **Barlow**: texto del cuerpo, entradas, descripciones
- **Barlow Condensed**: encabezados, botones, números, etiquetas (peso 700–900)
- **Monoespaciada**: solo códigos de cupones

### Tamaños de Fuente
- Encabezados grandes: 26–28px
- Encabezados de sección: 18–22px
- Títulos de tarjetas: 14–17px
- Texto del cuerpo: 11–13px
- Etiquetas: 9–11px
- Números grandes: 36–96px

### Efectos Visuales
- **Glassmorphism**: barra de navegación inferior con fondo semitransparente y desenfoque (blur 20px)
- **Resplandor radial**: efectos de luz ambiental en tarjetas hero y fondos
- **Sombras de caja**: sombras naranjas en botones CTA, sombras verdes en botones de éxito
- **Transparencias**: fondos de tarjetas con opacidad reducida

### Animaciones
- `scanBeam`: línea de escaneo QR moviéndose arriba-abajo (1.2s infinito)
- `spin`: rotación de 360° para indicadores de carga (8s externo, 5s interno reverso)
- `dotP`: puntos rebotantes para indicador de typing y estado en línea (1.2s infinito)
- Transiciones de fase: opacidad + transformación (0.32s)
- Transiciones de popup: opacidad + transformación (0.45s)
- Barra de progreso de IA: ancho animado (2.8s)

---

## Datos y Estado de la Aplicación

### Variables de Estado Principales
- **Historial de navegación**: pila de rutas visitadas
- **Categoría seleccionada**: para rutinas
- **Plan seleccionado**: para detalle
- **Planes guardados**: array de planes creados por el usuario (manual + IA)
- **Puntos del usuario**: saldo actual (inicia en 1,240)
- **Cupones ganados**: array de cupones canjeados
- **Máquina seleccionada**: índice de la máquina en detalle
- **Ejercicios de la sesión**: array de ejercicios para entrenar
- **Ejercicio individual**: ejercicio para pantalla individual
- **Racha de días**: contador de días consecutivos (inicia en 2)
- **Mensajes del chat**: historial de conversación con el Coach IA
- **Modo gimnasio**: booleano que controla el bloqueo de funciones
- **Popup de ubicación**: controla la visualización del popup de verificación

### Datos Simulados (Mock Data)
- **Rutinas**: 5 categorías × 3 programas = 15 programas predefinidos
- **Plan de ejemplo**: 28 días con ejercicios detallados
- **Máquinas**: 6 con descripciones, pasos de uso, consejos de seguridad, GIFs e imágenes
- **Ejercicios**: ~90+ en 5 categorías
- **Desafíos**: 6 con recompensas en puntos
- **Tienda**: 6 productos canjeables
- **Historial**: datos de peso, IMC, frecuencia muscular, sesiones recientes, récords personales
- **Récords personales**: Press de Banca 120kg, Sentadilla 150kg, Peso Muerto 180kg, Press Militar 80kg

---

## Características Técnicas del Prototipo

- **Framework**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + estilos en línea (inline styles)
- **Componentes UI**: shadcn/ui + MUI (Material UI)
- **Animaciones**: Framer Motion + keyframes CSS personalizados
- **API de IA**: Groq (modelo LLM en la nube) para el chatbot
- **Marcos de referencia**: Simulación de iPhone 14 Pro (390×720px)
- **Estado global**: useState en componente raíz (App.tsx, ~3,400+ líneas)
- **Assets**: GIFs animados para ejercicios, imágenes de máquinas, iconos de Lucide React
- **Archivos**: todo el código está en un solo archivo monolítico `App.tsx`
- **Servicio de chat**: separado en `src/services/groqChat.ts`
- **Variables de entorno**: API key de Groq en `.env` (excluido de git)
- **Persistencia**: estado del chat se mantiene entre navegaciones (en memoria, no persiste al recargar)
