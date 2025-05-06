"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/hooks/use-account"
import { getWalletData, setWalletData } from "@/lib/wallet-storage"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  speed?: number
  type?: string
}

export function EndlessRunner() {
  const { address } = useAccount()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [coinsCollected, setCoinsCollected] = useState(0)
  const [totalCoins, setTotalCoins] = useState(0)

  // Game assets
  const characterImageRef = useRef<HTMLImageElement | null>(null)
  const coinImageRef = useRef<HTMLImageElement | null>(null)

  // Animation frames
  const animFrameRef = useRef(0)
  const runCycleRef = useRef(0)
  const breatheRef = useRef(0)

  // Game state stored in refs to avoid re-renders
  const gameStateRef = useRef({
    player: {
      x: 50,
      y: 0,
      width: 60, // Adjusted for new character
      height: 80, // Adjusted for new character
      jumping: false,
      jumpForce: 0,
      gravity: 0.5,
      runFrame: 0,
      breatheDirection: 1, // For breathing animation
      breatheAmount: 0, // Current breathing amount
    },
    buildings: [] as GameObject[],
    coins: [] as GameObject[],
    ground: 0,
    speed: 5, // Increased starting speed for faster gameplay
    spawnTimer: 0,
    coinTimer: 0,
    animationFrame: 0,
    score: 0,
    coinsCollected: 0,
    difficultyTimer: 0, // Timer for increasing difficulty
    buildingFrequencyTimer: 0, // Timer for increasing building frequency every 4 seconds
    buildingFrequency: 2000, // Higher value = fewer buildings (in milliseconds)
    buildingWidth: 40, // Starting with narrower buildings
    minBuildingHeight: 50, // Minimum building height
    maxBuildingHeight: 100, // Maximum building height
    difficultyLevel: 1, // Track difficulty level for progressive scaling
    buildingFrequencyLevel: 1, // Track building frequency level
  })

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions based on container width
    const updateCanvasDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        const containerWidth = container.clientWidth
        // Keep the same aspect ratio but scale to container width
        canvas.width = containerWidth
        canvas.height = containerWidth * 0.375 // Maintain 8:3 aspect ratio

        // Adjust ground level
        gameStateRef.current.ground = canvas.height - 50

        // Reset player position if needed
        if (!gameStarted) {
          gameStateRef.current.player.y = gameStateRef.current.ground - gameStateRef.current.player.height
        }
      }
    }

    updateCanvasDimensions()

    // Add resize listener
    const handleResize = () => {
      updateCanvasDimensions()
    }

    window.addEventListener("resize", handleResize)

    // Set ground level
    gameStateRef.current.ground = canvas.height - 50

    // Reset player position
    gameStateRef.current.player.y = gameStateRef.current.ground - gameStateRef.current.player.height

    // Load high score and total coins from wallet-specific localStorage
    if (address) {
      const savedHighScore = getWalletData(address, "tectraRunnerHighScore", 0)
      const savedTotalCoins = getWalletData(address, "tectraRunnerTotalCoins", 0)

      setHighScore(savedHighScore)
      setTotalCoins(savedTotalCoins)
    }

    // Load character image - using the new robot character
    const characterImage = new Image()
    characterImage.src = "/images/robot-character.png"
    characterImage.crossOrigin = "anonymous"
    characterImage.onload = () => {
      characterImageRef.current = characterImage
    }

    // Load coin image
    const coinImage = new Image()
    coinImage.src = "/images/tectra-coin-logo.png"
    coinImage.crossOrigin = "anonymous"
    coinImage.onload = () => {
      coinImageRef.current = coinImage
    }

    // Preload city background
    const cityBackground = new Image()
    cityBackground.src = "/images/city-background.png"
    cityBackground.crossOrigin = "anonymous"

    return () => {
      // Cleanup
      window.removeEventListener("resize", handleResize)
    }
  }, [address, gameStarted])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return

    let lastTime = 0
    const gameLoop = (timestamp: number) => {
      if (!canvasRef.current) return

      // Calculate delta time
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Update game state
      updateGame(deltaTime)

      // Render game
      renderGame()

      // Update animation frame
      animFrameRef.current = (animFrameRef.current + 1) % 60
      if (animFrameRef.current % 5 === 0) {
        // Faster animation cycle
        runCycleRef.current = (runCycleRef.current + 1) % 4
      }

      // Update breathing animation
      updateBreathingAnimation()

      // Continue the game loop
      const animationId = requestAnimationFrame(gameLoop)
      gameStateRef.current.animationFrame = animationId

      // Update score in state occasionally (not every frame)
      if (timestamp % 5 === 0) {
        setScore(Math.floor(gameStateRef.current.score))
        setCoinsCollected(gameStateRef.current.coinsCollected)
      }
    }

    const animationId = requestAnimationFrame(gameLoop)
    gameStateRef.current.animationFrame = animationId

    return () => {
      cancelAnimationFrame(gameStateRef.current.animationFrame)
    }
  }, [gameStarted, gameOver])

  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && !gameStateRef.current.player.jumping) {
        gameStateRef.current.player.jumping = true
        gameStateRef.current.player.jumpForce = 12
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameStarted])

  // Update breathing animation
  const updateBreathingAnimation = () => {
    const { player } = gameStateRef.current

    // Update breathing animation
    if (player.breatheDirection === 1) {
      player.breatheAmount += 0.05
      if (player.breatheAmount >= 1) {
        player.breatheDirection = -1
      }
    } else {
      player.breatheAmount -= 0.05
      if (player.breatheAmount <= -1) {
        player.breatheDirection = 1
      }
    }
  }

  // Update game state
  const updateGame = (deltaTime: number) => {
    const { player, buildings, coins, ground, speed } = gameStateRef.current

    // Update player
    if (player.jumping) {
      player.y -= player.jumpForce
      player.jumpForce -= player.gravity

      if (player.y >= ground - player.height) {
        player.y = ground - player.height
        player.jumping = false
      }
    }

    // Gradually increase difficulty over time
    gameStateRef.current.difficultyTimer += deltaTime
    if (gameStateRef.current.difficultyTimer > 10000) {
      // Every 10 seconds (faster progression)
      // Increase difficulty level
      gameStateRef.current.difficultyLevel += 1

      // Increase speed more aggressively
      gameStateRef.current.speed += 0.3

      // Gradually increase building width as the game progresses
      gameStateRef.current.buildingWidth = Math.min(70, gameStateRef.current.buildingWidth + 3)

      // Increase maximum building height
      gameStateRef.current.maxBuildingHeight = Math.min(140, gameStateRef.current.maxBuildingHeight + 5)

      // Also increase minimum building height for more challenge
      gameStateRef.current.minBuildingHeight = Math.min(60, gameStateRef.current.minBuildingHeight + 2)

      gameStateRef.current.difficultyTimer = 0

      // Log difficulty increase for debugging
      console.log(
        `Difficulty increased to level ${gameStateRef.current.difficultyLevel}. Speed: ${gameStateRef.current.speed.toFixed(1)}, Building width: ${gameStateRef.current.buildingWidth}, Height range: ${gameStateRef.current.minBuildingHeight}-${gameStateRef.current.maxBuildingHeight}`,
      )
    }

    // Increase building frequency every 4 seconds (4000ms)
    gameStateRef.current.buildingFrequencyTimer += deltaTime
    if (gameStateRef.current.buildingFrequencyTimer > 4000) {
      // Every 4 seconds
      gameStateRef.current.buildingFrequencyLevel += 1

      // Reduce building frequency (lower value = more frequent buildings)
      // Make sure it doesn't go below a minimum threshold to keep the game playable
      gameStateRef.current.buildingFrequency = Math.max(
        400, // Minimum building frequency (very frequent)
        gameStateRef.current.buildingFrequency - 150, // Reduce by 150ms each time
      )

      gameStateRef.current.buildingFrequencyTimer = 0

      // Log building frequency increase for debugging
      console.log(
        `Building frequency increased to level ${gameStateRef.current.buildingFrequencyLevel}. New frequency: ${gameStateRef.current.buildingFrequency}ms`,
      )
    }

    // Spawn buildings
    gameStateRef.current.spawnTimer -= deltaTime
    if (gameStateRef.current.spawnTimer <= 0) {
      const minGap = 450 // Slightly smaller minimum gap for faster gameplay
      const maxGap = 750 // Slightly smaller maximum gap for faster gameplay

      // Random gap
      const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap

      // Random building height based on current min/max
      const minHeight = gameStateRef.current.minBuildingHeight
      const maxHeight = gameStateRef.current.maxBuildingHeight
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight

      // Create building
      buildings.push({
        x: canvasRef.current!.width,
        y: ground - height,
        width: gameStateRef.current.buildingWidth, // Use the current building width
        height: height,
        type: "building",
      })

      // Reset spawn timer with random delay and use buildingFrequency to control how often buildings appear
      gameStateRef.current.spawnTimer = gap / speed + gameStateRef.current.buildingFrequency
    }

    // Spawn coins
    gameStateRef.current.coinTimer -= deltaTime
    if (gameStateRef.current.coinTimer <= 0) {
      const minY = ground - 150 // Minimum height for coins
      const maxY = ground - 50 // Maximum height for coins

      coins.push({
        x: canvasRef.current!.width,
        y: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
        width: 30,
        height: 30,
        type: "coin",
      })

      // Reset coin timer - faster coin spawning
      gameStateRef.current.coinTimer = 1200 / speed
    }

    // Move buildings
    for (let i = 0; i < buildings.length; i++) {
      buildings[i].x -= speed

      // Remove buildings that are off screen
      if (buildings[i].x + buildings[i].width < 0) {
        buildings.splice(i, 1)
        i--
      }
    }

    // Move coins
    for (let i = 0; i < coins.length; i++) {
      coins[i].x -= speed

      // Remove coins that are off screen
      if (coins[i].x + coins[i].width < 0) {
        coins.splice(i, 1)
        i--
      }
    }

    // Check for collisions
    checkCollisions()

    // Increase score faster with higher speed
    gameStateRef.current.score += 0.1 * (speed / 4)
  }

  // Check for collisions
  const checkCollisions = () => {
    const { player, buildings, coins } = gameStateRef.current

    // Check building collisions
    for (let i = 0; i < buildings.length; i++) {
      if (
        player.x < buildings[i].x + buildings[i].width &&
        player.x + player.width > buildings[i].x &&
        player.y < buildings[i].y + buildings[i].height &&
        player.y + player.height > buildings[i].y
      ) {
        // Game over
        handleGameOver()
        return
      }
    }

    // Check coin collisions
    for (let i = 0; i < coins.length; i++) {
      if (
        player.x < coins[i].x + coins[i].width &&
        player.x + player.width > coins[i].x &&
        player.y < coins[i].y + coins[i].height &&
        player.y + player.height > coins[i].y
      ) {
        // Collect coin
        coins.splice(i, 1)
        gameStateRef.current.score += 5
        gameStateRef.current.coinsCollected += 1
        i--
      }
    }
  }

  // Render game
  const renderGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { player, buildings, coins, ground } = gameStateRef.current

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, ground)
    gradient.addColorStop(0, "#1a1a2e")
    gradient.addColorStop(1, "#4a4a6a")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw city silhouette in background
    ctx.fillStyle = "#0f0f1a"
    for (let i = 0; i < canvas.width; i += 100) {
      const height = 20 + Math.sin(i * 0.01) * 10
      ctx.fillRect(i, ground - height, 60, height)
    }

    // Draw ground
    ctx.fillStyle = "#333"
    ctx.fillRect(0, ground, canvas.width, canvas.height - ground)

    // Draw player (character)
    if (characterImageRef.current) {
      try {
        // Character body
        ctx.save()

        // Position at the character's center for transformations
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

        // Add more dynamic animations based on state
        if (player.jumping) {
          // When jumping, rotate slightly and scale for a more dynamic jump
          const jumpProgress = 1 - player.jumpForce / 15 // 0 at start of jump, 1 at peak
          ctx.rotate(-0.2 + jumpProgress * 0.1) // Rotate more at start, less at peak

          // Scale slightly for a "stretching" effect during jump
          const jumpScale = 1 + Math.sin(jumpProgress * Math.PI) * 0.1
          ctx.scale(0.95, jumpScale)
        } else {
          // Running animation - bob up and down
          const runBob = Math.sin(animFrameRef.current * 0.2) * 2
          ctx.translate(0, runBob)

          // Slight rotation for running motion
          ctx.rotate(Math.sin(animFrameRef.current * 0.1) * 0.05)

          // Breathing animation when running
          const breatheScale = 1 + player.breatheAmount * 0.03
          ctx.scale(1, breatheScale)
        }

        // Draw the character (adjusting for the translation)
        ctx.drawImage(
          characterImageRef.current,
          -player.width / 2 - 5, // Adjust x position for centered drawing
          -player.height / 2 - 5, // Adjust y position
          player.width + 10,
          player.height + 10,
        )

        // Add a motion blur effect when running fast
        if (gameStateRef.current.speed > 5 && !player.jumping) {
          ctx.globalAlpha = 0.3
          ctx.drawImage(
            characterImageRef.current,
            -player.width / 2 - 5 - 5, // Offset for motion blur
            -player.height / 2 - 5,
            player.width + 10,
            player.height + 10,
          )
          ctx.globalAlpha = 1.0
        }

        ctx.restore()

        // Add a shadow beneath the character
        ctx.fillStyle = "rgba(0,0,0,0.3)"
        ctx.beginPath()
        ctx.ellipse(player.x + player.width / 2, ground - 2, player.width / 2, 5, 0, 0, Math.PI * 2)
        ctx.fill()
      } catch (error) {
        // Fallback if drawing fails
        console.error("Error drawing character:", error)
        ctx.fillStyle = "#fff"
        ctx.fillRect(player.x, player.y, player.width, player.height)
      }
    } else {
      // Fallback if image not loaded
      ctx.fillStyle = "#fff"
      ctx.fillRect(player.x, player.y, player.width, player.height)
    }

    // Draw buildings
    ctx.fillStyle = "#555"
    for (const building of buildings) {
      // Building base
      ctx.fillRect(building.x, building.y, building.width, building.height)

      // Windows
      ctx.fillStyle = "#ffff00"
      const windowSize = 8
      const windowGap = 12

      for (let y = building.y + 10; y < building.y + building.height - 10; y += windowGap) {
        for (let x = building.x + 10; x < building.x + building.width - 10; x += windowGap) {
          // Randomly light some windows
          if (Math.random() > 0.3) {
            ctx.fillRect(x, y, windowSize, windowSize)
          }
        }
      }

      ctx.fillStyle = "#555"
    }

    // Draw coins with the new Tectra logo
    for (const coin of coins) {
      if (coinImageRef.current) {
        try {
          // Draw coin with pulsing animation
          const pulseFactor = 1 + Math.sin(animFrameRef.current * 0.1) * 0.1
          const coinSize = coin.width * pulseFactor

          // Draw the coin image
          ctx.drawImage(
            coinImageRef.current,
            coin.x + (coin.width - coinSize) / 2,
            coin.y + (coin.height - coinSize) / 2,
            coinSize,
            coinSize,
          )
        } catch (error) {
          // Fallback if drawing fails
          console.error("Error drawing coin:", error)
          ctx.fillStyle = "#ffcc00"
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Fallback if image not loaded
        ctx.fillStyle = "#ffcc00"
        ctx.beginPath()
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw score
    ctx.fillStyle = "#fff"
    ctx.font = "20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${Math.floor(gameStateRef.current.score)}`, 20, 30)

    // Draw coins collected
    ctx.fillText(`Coins: ${gameStateRef.current.coinsCollected}`, 20, 60)

    // Draw current speed/level (optional)
    ctx.fillText(`Level: ${gameStateRef.current.difficultyLevel}`, canvas.width - 120, 30)
    ctx.fillText(`Building Freq: ${gameStateRef.current.buildingFrequencyLevel}`, canvas.width - 200, 60)
  }

  // Handle game over
  const handleGameOver = () => {
    cancelAnimationFrame(gameStateRef.current.animationFrame)
    setGameOver(true)

    if (!address) return

    // Update high score
    if (gameStateRef.current.score > highScore) {
      const newHighScore = Math.floor(gameStateRef.current.score)
      setHighScore(newHighScore)
      setWalletData(address, "tectraRunnerHighScore", newHighScore)
    }

    // Update total coins
    const newTotalCoins = totalCoins + gameStateRef.current.coinsCollected
    setTotalCoins(newTotalCoins)
    setWalletData(address, "tectraRunnerTotalCoins", newTotalCoins)
  }

  // Start game
  const startGame = () => {
    // Reset game state
    gameStateRef.current = {
      player: {
        x: 50,
        y: canvasRef.current!.height - 50 - 80, // ground - player height
        width: 60, // Adjusted for new character
        height: 80, // Adjusted for new character
        jumping: false,
        jumpForce: 0,
        gravity: 0.5,
        runFrame: 0,
        breatheDirection: 1,
        breatheAmount: 0,
      },
      buildings: [],
      coins: [],
      ground: canvasRef.current!.height - 50,
      speed: 5, // Increased starting speed for faster gameplay
      spawnTimer: 60,
      coinTimer: 100,
      animationFrame: 0,
      score: 0,
      coinsCollected: 0,
      difficultyTimer: 0,
      buildingFrequencyTimer: 0, // Reset building frequency timer
      buildingFrequency: 1800, // Starting building frequency
      buildingWidth: 45, // Increased from 40 to 45
      minBuildingHeight: 50, // Increased from 40 to 50
      maxBuildingHeight: 100, // Increased from 90 to 100
      difficultyLevel: 1,
      buildingFrequencyLevel: 1, // Reset building frequency level
    }

    // Reset animation frames
    animFrameRef.current = 0
    runCycleRef.current = 0

    setScore(0)
    setCoinsCollected(0)
    setGameStarted(true)
    setGameOver(false)
  }

  // Handle canvas click for jumping
  const handleCanvasClick = () => {
    if (gameStarted && !gameOver && !gameStateRef.current.player.jumping) {
      gameStateRef.current.player.jumping = true
      gameStateRef.current.player.jumpForce = 12
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg border border-purple-300/50 shadow-lg p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">Tectra Runner</h2>
        <p className="text-sm text-purple-100">Jump over buildings and collect coins!</p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full bg-black/20 rounded-md cursor-pointer touch-manipulation"
          onClick={handleCanvasClick}
          style={{ height: "auto", touchAction: "manipulation" }}
        />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-md">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white">Game Over</h3>
              <p className="text-white">Score: {score}</p>
              <p className="text-white">Coins Collected: {coinsCollected}</p>
              <p className="text-white">High Score: {highScore}</p>
              <p className="text-white">Total Coins: {totalCoins}</p>
            </div>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-purple-100">Press Space or tap/click to jump</p>
      </div>
    </div>
  )
}
