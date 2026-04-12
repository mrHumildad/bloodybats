# ⚾ BLOODY HOLY BATS ⚔️
**Documento de Referencia Técnica - Motor de Juego 3x3x3**

Este documento define la arquitectura lógica y mecánica para un RPG de simulación deportiva táctica basado en la Teoría de la Información.

---

## 1. CONCEPTOS FUNDAMENTALES
* **Ambientación:** Imperio medioeval teocrático de la "HOLY BALL". El béisbol es un ritual sagrado y violento que ha canalizzado las rivalidades y las guerras.
* **Formato:** Partidos entre equipos de moonjes guerreros representando su convento y comarca. Equipos de 1 lanzador, 5 bateadores y 1 receptor, 2 guardias de base y un jardinero mas 5 reservas.
* **El Bate:** Herramienta de procesado y arma de combate. El bateador **nunca** suelta el bate durante la carrera. 
* **El Lanzamiento:** Es un **proceso de comunicación** entre el lanzador y el receptor.

## 2. MATRIZ DE ATRIBUTOS (DADOS DINÁMICOS)
Cada acción se resuelve sumando **3 dados** (rango $d4$ a $d12$), seleccionando uno de cada eje:
Cada jugador es un **sistema de procesamiento de datos** con 9 atributos dinámicos en 3 ejes:
los atributos son representados por dados de 4 caras, 6 caras, 8 caras, 10 caras, 12 caras.
### A. Eje de los REINOS (El Sustrato)
| Atributo | Definición |
| :--- | :--- |
| **Cuerpo** | Capacidad física, motor biológico y resistencia al impacto. |
| **Mente** | Procesamiento táctico, cálculo de trayectorias y frialdad. |
| **Corazón** | Conexión espiritual con la Diosa, moral y fe bajo presión. |

### B. Eje de los MODOS (El Flujo de Datos)
| Atributo | Definición |
| :--- | :--- |
| **Emanación** | Salida de información (proyectar la bola, golpear, empujar). |
| **Percepción** | Entrada de información (leer el lanzamiento, ver huecos). |
| **Esencia** | Estado interno del sistema (integridad, aura, presencia). |

### C. Eje de las PRAXIS (La Naturaleza)
| Atributo | Definición |
| :--- | :--- |
| **Astucia** | Engaño, técnica refinada, "ruido" táctico. |
| **Potencia** | Fuerza bruta, velocidad cinética, explosividad. |
| **Fortaleza** | Integridad estructural, absorción de daño, aguante. |

---

## 3. ROLES Y ACCIONES (SISTEMA 4-COMBO)
Cada clase posee un Dado de Especialidad (aumenta el tamaño del dado un nivel) y 4 acciones predefinidas que combinan Reino + Modo, a las que el jugador añade una Praxis para lanzar el tercer dado.

1. Lanzador (Paladín) - Especialista en Emanación
   - Sentencia: Cuerpo + Emanación.
   - Parábola: Mente + Emanación.
   - Presencia: Corazón + Esencia.
   - Revelación: Mente + Percepción.

2. Catcher (Inquisidor) - Especialista en Fortaleza
   - Bloqueo: Cuerpo + Esencia.
   - Encuadre: Mente + Percepción.
   - Disparo: Cuerpo + Emanación.
   - Comunión: Corazón + Esencia.

3. Bateador (Cruzado) - Especialista en Potencia
   - Impacto: Cuerpo + Emanación.
   - Lectura: Mente + Percepción.
   - Resistencia: Corazón + Esencia.
   - Carga: Cuerpo + Esencia.

4. Defensa (Centinela) - Especialista en Percepción
   - Interceptar: Cuerpo + Percepción.
   - Filtrado: Mente + Percepción.
   - Retorno: Cuerpo + Emanación.
   - Anclaje: Corazón + Esencia.

---

## 4. BUCLE DE LANZAMIENTO (RESOLUCIÓN)

### Paso 1: Generación de la Señal (Lanzador)
El lanzador elige una acción y genera un **Umbral de Ruido (UR)**.
* *Ejemplo Fastball:* `Cuerpo + Emanación + Potencia`.
* *Resultado:* 18 (Este es el número que el bateador debe superar).

### Paso 2: Respuesta del Sistema (Bateador)
El bateador elige su acción y tira sus dados.
* *Ejemplo Swing Poder:* `Cuerpo + Percepción + Potencia`.

### Paso 3: Margen de Éxito (ME)
Se calcula: `Suma Bateador - UR = ME`.

| Margen (ME) | Resultado Técnico | Efecto |
| :--- | :--- | :--- |
| **< 0** | Strike / Fallo | Degradación de Esencia/Corazón. |
| **0 - 2** | Contacto Débil | Rodado (Groundball). El defensa tiene bono de fildeo. |
| **3 - 5** | Contacto Sólido | Hit sencillo a los jardines. |
| **6 - 9** | Impacto de Gracia | Extra Base (Doble o Triple). |
| **10+** | Colapso del Canal | **Home Run** (La bola sale del sistema). |

---

## 5. REGLAS TÁCTICAS AVANZADAS
* **Interferencia (Piedra-Papel-Tijera):**
    * **Astucia** vence a **Potencia**: 
    * **Fortaleza** vence a **Astucia**:
    * **Potencia** vence a **Fortaleza**:
    * Si el bateador usa una Praxis que vence a la del lanzador, su dado praxis se multiplica por 2.


---

## 6. STACK PARA PROTOTIPO (SUGERIDO)
* **Lenguaje:** Javascript.
* **UI:** React + vainilla CSS.
