"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAccount } from "@/hooks/use-account"
import { getWalletData, setWalletData } from "@/lib/wallet-storage"

// Define card types
interface PlayingCard {
  suit: string
  value: string
  numericValue: number
}

// Define hand type
interface Hand {
  cards: PlayingCard[]
  score: number
}

export function BlackjackGame() {
  const { address } = useAccount()

  // Game state
  const [deck, setDeck] = useState<PlayingCard[]>([])
  const [playerHand, setPlayerHand] = useState<Hand>({ cards: [], score: 0 })
  const [dealerHand, setDealerHand] = useState<Hand>({ cards: [], score: 0 })
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealerTurn" | "gameOver">("betting")
  const [message, setMessage] = useState("")
  const [betAmount, setBetAmount] = useState(10)
  const [totalCoins, setTotalCoins] = useState(0)
  const [result, setResult] = useState<"" | "win" | "lose" | "push">("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize the game
  useEffect(() => {
    if (!address) {
      setIsLoading(false)
      return
    }

    // Load total coins from wallet-specific localStorage
    const savedTotalCoins = getWalletData(address, "tectraRunnerTotalCoins", 0)

    if (savedTotalCoins > 0) {
      setTotalCoins(savedTotalCoins)
    } else {
      // Give some starter coins if none exist
      const starterCoins = 100
      setTotalCoins(starterCoins)
      setWalletData(address, "tectraRunnerTotalCoins", starterCoins)
    }

    setIsLoading(false)
  }, [address])

  // Create a new deck of cards
  const createDeck = (): PlayingCard[] => {
    const suits = ["♠", "♥", "♦", "♣"]
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    const newDeck: PlayingCard[] = []

    for (const suit of suits) {
      for (const value of values) {
        let numericValue = 0
        if (value === "A") {
          numericValue = 11
        } else if (["J", "Q", "K"].includes(value)) {
          numericValue = 10
        } else {
          numericValue = Number.parseInt(value)
        }

        newDeck.push({ suit, value, numericValue })
      }
    }

    return shuffleDeck(newDeck)
  }

  // Shuffle the deck
  const shuffleDeck = (deckToShuffle: PlayingCard[]): PlayingCard[] => {
    const shuffled = [...deckToShuffle]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Deal a card from the deck
  const dealCard = (currentDeck: PlayingCard[]): [PlayingCard, PlayingCard[]] => {
    const newDeck = [...currentDeck]
    const card = newDeck.pop()!
    return [card, newDeck]
  }

  // Calculate the score of a hand
  const calculateScore = (cards: PlayingCard[]): number => {
    let score = 0
    let aces = 0

    for (const card of cards) {
      score += card.numericValue
      if (card.value === "A") {
        aces++
      }
    }

    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }

  // Start a new game
  const startGame = () => {
    if (!address) {
      setMessage("Please connect your wallet first!")
      return
    }

    if (totalCoins < betAmount) {
      setMessage("Not enough coins to place bet!")
      return
    }

    // Deduct bet amount
    const newTotalCoins = totalCoins - betAmount
    setTotalCoins(newTotalCoins)
    setWalletData(address, "tectraRunnerTotalCoins", newTotalCoins)

    // Create and shuffle a new deck
    const newDeck = createDeck()
    setDeck(newDeck)

    // Deal initial cards
    let currentDeck = [...newDeck]
    const playerCards: PlayingCard[] = []
    const dealerCards: PlayingCard[] = []

    // Deal 2 cards to player and dealer
    let card: PlayingCard
    ;[card, currentDeck] = dealCard(currentDeck)
    playerCards.push(card)
    ;[card, currentDeck] = dealCard(currentDeck)
    dealerCards.push(card)
    ;[card, currentDeck] = dealCard(currentDeck)
    playerCards.push(card)
    ;[card, currentDeck] = dealCard(currentDeck)
    dealerCards.push(card)

    // Update state
    setDeck(currentDeck)
    setPlayerHand({ cards: playerCards, score: calculateScore(playerCards) })
    setDealerHand({ cards: dealerCards, score: calculateScore(dealerCards) })
    setGameState("playing")
    setMessage("")
    setResult("")
  }

  // Player hits (takes another card)
  const handleHit = () => {
    if (gameState !== "playing") return

    let currentDeck = [...deck]
    let card: PlayingCard
    ;[card, currentDeck] = dealCard(currentDeck)

    const newPlayerHand = {
      cards: [...playerHand.cards, card],
      score: calculateScore([...playerHand.cards, card]),
    }

    setDeck(currentDeck)
    setPlayerHand(newPlayerHand)

    // Check if player busts
    if (newPlayerHand.score > 21) {
      setGameState("gameOver")
      setMessage("Bust! You went over 21.")
      setResult("lose")
    }
  }

  // Player stands (ends turn)
  const handleStand = () => {
    if (gameState !== "playing") return

    setGameState("dealerTurn")
    dealerPlay()
  }

  // Dealer's turn
  const dealerPlay = () => {
    let currentDeck = [...deck]
    const currentDealerHand = { ...dealerHand }

    // Dealer hits until score is 17 or higher
    while (currentDealerHand.score < 17) {
      let card: PlayingCard
      ;[card, currentDeck] = dealCard(currentDeck)
      currentDealerHand.cards.push(card)
      currentDealerHand.score = calculateScore(currentDealerHand.cards)
    }

    setDeck(currentDeck)
    setDealerHand(currentDealerHand)

    // Determine winner
    determineWinner(playerHand.score, currentDealerHand.score)
  }

  // Determine the winner
  const determineWinner = (playerScore: number, dealerScore: number) => {
    if (!address) return

    setGameState("gameOver")

    if (playerScore > 21) {
      setMessage("Bust! You went over 21.")
      setResult("lose")
    } else if (dealerScore > 21) {
      setMessage("Dealer busts! You win!")
      setResult("win")
      // Award winnings (bet amount * 2)
      const winnings = betAmount * 2
      const newTotalCoins = totalCoins + winnings
      setTotalCoins(newTotalCoins)
      setWalletData(address, "tectraRunnerTotalCoins", newTotalCoins)
    } else if (playerScore > dealerScore) {
      setMessage("You win!")
      setResult("win")
      // Award winnings (bet amount * 2)
      const winnings = betAmount * 2
      const newTotalCoins = totalCoins + winnings
      setTotalCoins(newTotalCoins)
      setWalletData(address, "tectraRunnerTotalCoins", newTotalCoins)
    } else if (playerScore < dealerScore) {
      setMessage("Dealer wins!")
      setResult("lose")
    } else {
      setMessage("Push! It's a tie.")
      setResult("push")
      // Return bet amount
      const newTotalCoins = totalCoins + betAmount
      setTotalCoins(newTotalCoins)
      setWalletData(address, "tectraRunnerTotalCoins", newTotalCoins)
    }
  }

  // Adjust bet amount
  const adjustBet = (amount: number) => {
    const newBet = Math.max(10, Math.min(totalCoins, betAmount + amount))
    setBetAmount(newBet)
  }

  // Render a card
  const renderCard = (card: PlayingCard) => {
    const isRed = card.suit === "♥" || card.suit === "♦"
    return (
      <div
        className={`w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 rounded-md flex flex-col items-center justify-center border-2 ${
          isRed ? "text-red-500 border-red-300" : "text-white border-white/50"
        } bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-sm shadow-md`}
      >
        <div className="text-base sm:text-lg font-bold">{card.value}</div>
        <div className="text-xl sm:text-2xl">{card.suit}</div>
      </div>
    )
  }

  // Render a face-down card
  const renderFaceDownCard = () => {
    return (
      <div className="w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 rounded-md flex items-center justify-center border-2 border-purple-300/50 bg-gradient-to-br from-purple-800/80 to-pink-800/80 backdrop-blur-sm shadow-md">
        <div className="text-2xl sm:text-3xl font-bold text-white">?</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg border border-purple-300/50 shadow-lg p-4 flex justify-center items-center h-96">
        <div className="animate-pulse text-white font-bold">Loading...</div>
      </div>
    )
  }

  if (!address) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg border border-purple-300/50 shadow-lg p-4">
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet</h3>
          <p className="text-purple-100 mb-6">Please connect your wallet to play Tectra Blackjack.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg border border-purple-300/50 shadow-lg p-4">
      {/* Coins Display */}
      <div className="flex justify-between items-center mb-6 bg-purple-900/50 p-3 rounded-lg border border-purple-400/30">
        <div className="flex items-center">
          <Coins className="h-5 w-5 text-yellow-300 mr-2" />
          <span className="text-white font-bold">Your Coins: {totalCoins}</span>
        </div>
        {gameState === "betting" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white font-bold">Bet: {betAmount}</span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustBet(-10)}
                disabled={betAmount <= 10}
                className="border-purple-300/50 bg-white/20 text-white hover:bg-white/30 h-8 w-8 p-0"
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustBet(10)}
                disabled={betAmount + 10 > totalCoins}
                className="border-purple-300/50 bg-white/20 text-white hover:bg-white/30 h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="space-y-8">
        {/* Dealer's Hand */}
        <Card className="bg-purple-900/30 border-purple-300/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Dealer's Hand</CardTitle>
            {gameState !== "betting" && (
              <CardDescription className="text-purple-200">
                Score: {gameState === "playing" ? "?" : dealerHand.score}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {gameState === "betting" ? (
              <div className="flex justify-center items-center h-28 text-purple-200">
                Place your bet to start the game
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {gameState === "playing"
                  ? // During player's turn, show only first dealer card
                    [renderCard(dealerHand.cards[0]), renderFaceDownCard()]
                  : // During dealer's turn or game over, show all dealer cards
                    dealerHand.cards.map((card, index) => <div key={index}>{renderCard(card)}</div>)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player's Hand */}
        <Card className="bg-purple-900/30 border-purple-300/50 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Your Hand</CardTitle>
            {gameState !== "betting" && (
              <CardDescription className="text-purple-200">Score: {playerHand.score}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {gameState === "betting" ? (
              <div className="flex justify-center items-center h-28 text-purple-200">
                Cards will be dealt when you start the game
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {playerHand.cards.map((card, index) => (
                  <div key={index}>{renderCard(card)}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Message */}
        {message && (
          <Alert
            className={`${
              result === "win"
                ? "bg-green-900/50 border-green-300/50"
                : result === "lose"
                  ? "bg-red-900/50 border-red-300/50"
                  : "bg-blue-900/50 border-blue-300/50"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-white font-bold">
              {result === "win" ? "You Won!" : result === "lose" ? "You Lost!" : "It's a Tie!"}
            </AlertTitle>
            <AlertDescription className="text-white">{message}</AlertDescription>
          </Alert>
        )}

        {/* Game Controls */}
        <div className="flex justify-center space-x-4">
          {gameState === "betting" ? (
            <Button
              onClick={startGame}
              disabled={totalCoins < betAmount}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            >
              Deal Cards
            </Button>
          ) : gameState === "playing" ? (
            <>
              <Button
                onClick={handleHit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-md"
              >
                Hit
              </Button>
              <Button
                onClick={handleStand}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-md"
              >
                Stand
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setGameState("betting")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          )}
        </div>
      </div>

      {/* Game Rules */}
      <div className="mt-8 p-4 bg-purple-900/30 backdrop-blur-sm rounded-lg border border-purple-300/50 text-white">
        <h3 className="text-lg font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Place your bet using coins collected from Tectra Runner</li>
          <li>Try to get a hand value closer to 21 than the dealer without going over</li>
          <li>Number cards are worth their face value, face cards are worth 10, and Aces are worth 1 or 11</li>
          <li>Hit to take another card, Stand to end your turn</li>
          <li>The dealer must hit until they have at least 17</li>
          <li>Win to double your bet, lose and forfeit your bet, push (tie) to get your bet back</li>
        </ul>
      </div>
    </div>
  )
}
