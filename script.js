const gameContainer = document.getElementById("game-container")
const scoreDisplay = document.getElementById("score")
const timerDisplay = document.getElementById("timer")
const comboDisplay = document.getElementById("combo")
const levelDisplay = document.getElementById("level")
const powerUpDisplay = document.getElementById("power-up-display")
const gameOverScreen = document.getElementById("game-over")
const finalScoreDisplay = document.getElementById("final-score")
const finalComboDisplay = document.getElementById("final-combo")
const finalLevelDisplay = document.getElementById("final-level")
const tutorialModal = document.getElementById("tutorial-modal")
const bubbleTooltip = document.getElementById("bubble-tooltip")
const pauseOverlay = document.getElementById("pause-overlay")
const pauseBtn = document.getElementById("pause-btn")

let score = 0
let timeLeft = 60
let combo = 0
let maxCombo = 0
let level = 1
let spawnRate = 1000
let gameRunning = true
let activePowerUp = null
let gamePaused = false

let spawnInterval
let timerInterval
let comboResetTimer

const bubbleTypes = {
  normal: {
    points: 10,
    probability: 0.4,
    class: "normal",
    label: "●",
    description: "Normal Bubble\n10 pts | Builds combo",
  },
  double: {
    points: 20,
    probability: 0.3,
    class: "double",
    label: "◆",
    description: "Double Points\n20 pts | 2x value",
  },
  triple: {
    points: 50,
    probability: 0.15,
    class: "triple",
    label: "★",
    description: "Triple Points\n50 pts | 3x value",
  },
  bomb: {
    points: -30,
    probability: 0.1,
    class: "bomb",
    label: "💣",
    isNegative: true,
    description: "Bomb Bubble\n-30 pts | Chain reaction",
  },
  powerup: {
    points: 100,
    probability: 0.05,
    class: "powerup",
    label: "⚡",
    isPowerUp: true,
    description: "Power-up\n100 pts | Special ability",
  },
}

const powerUps = {
  slowmo: {
    name: "SLOW MOTION",
    duration: 5000,
    effect: () => {
      const bubbles = document.querySelectorAll(".bubble")
      bubbles.forEach((b) => {
        const duration = Number.parseFloat(b.style.animationDuration)
        b.style.animationDuration = duration * 2 + "s"
      })
      spawnRate = Math.max(500, spawnRate + 300)
    },
    undo: () => {
      spawnRate = Math.max(300, spawnRate - 300)
    },
  },
  doublePts: {
    name: "2X POINTS",
    duration: 8000,
    effect: () => {},
  },
  shieldPop: {
    name: "SHIELD",
    duration: 6000,
    effect: () => {},
  },
}

window.addEventListener("load", () => {
  tutorialModal.classList.remove("hidden")
})

function startTutorial() {
  tutorialModal.classList.add("hidden")
  startGame()
}

function startGame() {
  score = 0
  combo = 0
  maxCombo = 0
  level = 1
  timeLeft = 60
  spawnRate = 1000
  gameRunning = true
  gamePaused = false
  activePowerUp = null

  scoreDisplay.textContent = score
  timerDisplay.textContent = timeLeft
  comboDisplay.textContent = "0x"
  levelDisplay.textContent = level
  gameOverScreen.classList.add("hidden")
  powerUpDisplay.classList.add("hidden")
  pauseOverlay.classList.add("hidden")
  gameContainer.classList.remove("hidden")

  document.querySelectorAll(".bubble").forEach((b) => b.remove())

  clearInterval(spawnInterval)
  clearInterval(timerInterval)
  clearInterval(comboResetTimer)

  spawnInterval = setInterval(createBubble, spawnRate)
  timerInterval = setInterval(updateTimer, 1000)
}

function restartGame() {
  gameRunning = true
  startGame()
}

function updateTimer() {
  if (!gameRunning || gamePaused) return

  timeLeft--
  timerDisplay.textContent = timeLeft

  if (timeLeft <= 0) endGame()
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickBubbleType() {
  const rand = Math.random()
  let cumulative = 0

  for (const [key, type] of Object.entries(bubbleTypes)) {
    cumulative += type.probability
    if (rand <= cumulative) return { key, ...type }
  }

  return { key: "normal", ...bubbleTypes.normal }
}

function createBubble() {
  if (!gameRunning || gamePaused) return

  const bubble = document.createElement("div")
  bubble.classList.add("bubble")

  const type = pickBubbleType()
  bubble.classList.add(type.class)
  bubble.dataset.type = type.key
  bubble.dataset.points = type.points

  const size = random(80, 140)
  bubble.style.width = size + "px"
  bubble.style.height = size + "px"

  bubble.style.left = random(0, gameContainer.offsetWidth - size) + "px"
  bubble.style.animationDuration = 8 - level * 0.3 + "s"

  bubble.textContent = type.label

  bubble.addEventListener("animationend", () => {
    if (!bubble.classList.contains("popped") && gameRunning) {
      if (type.isNegative && !activePowerUp?.includes("shield")) {
        score += type.points
        createDamageNumber(bubble, type.points, "combo")
      }
      resetCombo()
      bubble.remove()
    }
  })

  bubble.addEventListener("click", () => popBubble(bubble, type))
  gameContainer.appendChild(bubble)
}

function popBubble(bubble, type) {
  if (!gameRunning || gamePaused || bubble.classList.contains("popped")) return

  bubble.classList.add("popped")

  playPopSound()

  let points = type.points

  if (activePowerUp?.includes("2x")) {
    points *= 2
  }

  const comboMultiplier = Math.min(1 + combo * 0.1, 3)
  points = Math.floor(points * comboMultiplier)

  score += points
  scoreDisplay.textContent = score

  if (type.key === "bomb") {
    triggerBombExplosion(bubble)
  } else if (type.key === "powerup") {
    activatePowerUp(bubble)
  } else {
    if (!type.isNegative) {
      combo++
      maxCombo = Math.max(maxCombo, combo)
      comboDisplay.textContent = combo + "x"

      createDamageNumber(bubble, "+" + points, "combo")

      if (combo % 5 === 0) {
        level++
        levelDisplay.textContent = level
        spawnRate = Math.max(300, spawnRate - 50)
        clearInterval(spawnInterval)
        spawnInterval = setInterval(createBubble, spawnRate)
      }
    }

    clearTimeout(comboResetTimer)
    comboResetTimer = setTimeout(() => resetCombo(), 3000)
  }

  createSparkles(bubble, type)
  setTimeout(() => bubble.remove(), 200)
}

function resetCombo() {
  if (combo > 0) {
    combo = 0
    comboDisplay.textContent = "0x"
  }
}

function triggerBombExplosion(bombBubble) {
  const bombRect = bombBubble.getBoundingClientRect()
  const explosionRadius = 150

  const explosion = document.createElement("div")
  explosion.style.position = "fixed"
  explosion.style.left = bombRect.left + "px"
  explosion.style.top = bombRect.top + "px"
  explosion.style.width = "40px"
  explosion.style.height = "40px"
  explosion.style.background = "radial-gradient(circle, #ff6b00, #ff0000)"
  explosion.style.borderRadius = "50%"
  explosion.style.animation = "popExplode 0.4s ease-out forwards"
  explosion.style.zIndex = "20"
  document.body.appendChild(explosion)

  setTimeout(() => explosion.remove(), 400)

  const allBubbles = document.querySelectorAll(".bubble")
  let chainCount = 0

  allBubbles.forEach((bubble) => {
    if (bubble === bombBubble || bubble.classList.contains("popped")) return

    const bubbleRect = bubble.getBoundingClientRect()
    const distance = Math.hypot(bubbleRect.left - bombRect.left, bubbleRect.top - bombRect.top)

    if (distance < explosionRadius) {
      chainCount++
      const type = bubbleTypes[bubble.dataset.type]

      popBubble(bubble, { ...type, key: bubble.dataset.type })
    }
  })

  if (chainCount > 0) {
    createDamageNumber(bombBubble, `Chain x${chainCount}!`, "combo")
    combo += chainCount * 2
    comboDisplay.textContent = combo + "x"
  }
}

function activatePowerUp(powerupBubble) {
  const powerUpList = Object.keys(powerUps)
  const randomPowerUp = powerUpList[Math.floor(Math.random() * powerUpList.length)]
  const powerUp = powerUps[randomPowerUp]

  activePowerUp = randomPowerUp

  powerUpDisplay.textContent = "✦ " + powerUp.name + " ✦"
  powerUpDisplay.classList.remove("hidden")

  powerUp.effect()

  setTimeout(() => {
    powerUp.undo?.()
    activePowerUp = null
    powerUpDisplay.classList.add("hidden")
  }, powerUp.duration)

  createDamageNumber(powerupBubble, powerUp.name, "powerup")
}

function createSparkles(bubble, type) {
  const bubbleRect = bubble.getBoundingClientRect()
  const numSparkles = 16
  const colors = {
    normal: "#0096ff",
    double: "#00ff64",
    triple: "#ffd700",
    bomb: "#ff0000",
    powerup: "#00ff88",
  }

  for (let i = 0; i < numSparkles; i++) {
    const sparkle = document.createElement("div")
    sparkle.classList.add("sparkle")

    sparkle.style.left = bubbleRect.left + bubbleRect.width / 2 + "px"
    sparkle.style.top = bubbleRect.top + bubbleRect.height / 2 + "px"
    sparkle.style.background = colors[type.class]
    sparkle.style.boxShadow = `0 0 20px ${colors[type.class]}, 0 0 40px ${colors[type.class]}`

    const angle = (i / numSparkles) * Math.PI * 2
    const distance = 100
    const tx = Math.cos(angle) * distance + "px"
    const ty = Math.sin(angle) * distance + "px"

    sparkle.style.setProperty("--tx", tx)
    sparkle.style.setProperty("--ty", ty)

    document.body.appendChild(sparkle)
    sparkle.addEventListener("animationend", () => sparkle.remove())
  }
}

function createDamageNumber(bubble, text, type = "damage") {
  const damageNum = document.createElement("div")
  damageNum.classList.add("damage-number", type)
  damageNum.textContent = text

  const bubbleRect = bubble.getBoundingClientRect()
  damageNum.style.left = bubbleRect.left + bubbleRect.width / 2 + "px"
  damageNum.style.top = bubbleRect.top + bubbleRect.height / 2 + "px"
  damageNum.style.transform = "translate(-50%, -50%)"

  document.getElementById("damage-numbers-container").appendChild(damageNum)

  damageNum.addEventListener("animationend", () => damageNum.remove())
}

function playPopSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const now = audioContext.currentTime
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.frequency.setValueAtTime(800, now)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.1)

  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

  osc.start(now)
  osc.stop(now + 0.1)
}

function endGame() {
  gameRunning = false
  gamePaused = false
  clearInterval(spawnInterval)
  clearInterval(timerInterval)
  clearInterval(comboResetTimer)

  finalScoreDisplay.textContent = score
  finalComboDisplay.textContent = "Best Combo: " + maxCombo + "x"
  finalLevelDisplay.textContent = "Final Wave: " + level
  pauseOverlay.classList.add("hidden")
  gameOverScreen.classList.remove("hidden")
}

function togglePause() {
  if (!gameRunning) return

  gamePaused = !gamePaused

  if (gamePaused) {
    pauseOverlay.classList.remove("hidden")
    pauseBtn.textContent = "▶ RESUME"
  } else {
    pauseOverlay.classList.add("hidden")
    pauseBtn.textContent = "⏸ PAUSE"
  }
}