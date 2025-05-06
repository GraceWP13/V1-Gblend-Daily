/**
 * Utility functions for wallet-based storage access
 * This ensures all app statistics are synchronized with the connected wallet
 */

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// In-memory fallback storage when localStorage is not available
const memoryStorage: Record<string, string> = {}

// Get a value from storage with wallet-specific key
export function getWalletData<T>(address: string, key: string, defaultValue: T): T {
  if (!address) return defaultValue

  try {
    const walletKey = `wallet-${address}-${key}`

    if (isLocalStorageAvailable()) {
      const storedValue = localStorage.getItem(walletKey)
      if (storedValue === null) return defaultValue
      return JSON.parse(storedValue) as T
    } else {
      // Fallback to memory storage
      const storedValue = memoryStorage[walletKey]
      if (storedValue === undefined) return defaultValue
      return JSON.parse(storedValue) as T
    }
  } catch (error) {
    console.error(`Error getting wallet data for ${key}:`, error)
    return defaultValue
  }
}

// Set a value in storage with wallet-specific key
export function setWalletData<T>(address: string, key: string, value: T): void {
  if (!address) return

  try {
    const walletKey = `wallet-${address}-${key}`
    const valueString = JSON.stringify(value)

    if (isLocalStorageAvailable()) {
      localStorage.setItem(walletKey, valueString)
    } else {
      // Fallback to memory storage
      memoryStorage[walletKey] = valueString
    }
  } catch (error) {
    console.error(`Error setting wallet data for ${key}:`, error)
  }
}

// Get all keys for a specific wallet address
export function getWalletKeys(address: string, prefix = ""): string[] {
  if (!address) return []

  try {
    const walletPrefix = `wallet-${address}-${prefix}`
    const keys: string[] = []

    if (isLocalStorageAvailable()) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(walletPrefix)) {
          keys.push(key.replace(`wallet-${address}-`, ""))
        }
      }
    } else {
      // Fallback to memory storage
      Object.keys(memoryStorage).forEach((key) => {
        if (key.startsWith(walletPrefix)) {
          keys.push(key.replace(`wallet-${address}-`, ""))
        }
      })
    }

    return keys
  } catch (error) {
    console.error(`Error getting wallet keys:`, error)
    return []
  }
}

// Migrate legacy data to wallet-specific storage
export function migrateToWalletStorage(address: string): void {
  if (!address) return

  try {
    // Only proceed if localStorage is available
    if (!isLocalStorageAvailable()) return

    // Migrate Tectra Runner high score
    const highScore = localStorage.getItem("tectraRunnerHighScore")
    if (highScore) {
      const walletHighScore = getWalletData(address, "tectraRunnerHighScore", 0)
      // Only migrate if wallet doesn't have a higher score already
      if (Number(highScore) > walletHighScore) {
        setWalletData(address, "tectraRunnerHighScore", Number(highScore))
      }
    }

    // Migrate Tectra Runner total coins
    const totalCoins = localStorage.getItem("tectraRunnerTotalCoins")
    if (totalCoins) {
      const walletTotalCoins = getWalletData(address, "tectraRunnerTotalCoins", 0)
      // Add legacy coins to wallet coins
      setWalletData(address, "tectraRunnerTotalCoins", walletTotalCoins + Number(totalCoins))
      // Clear legacy storage
      localStorage.removeItem("tectraRunnerTotalCoins")
    }

    // Migrate attendance data
    const attendancePrefix = `gblend-attendance-${address}-`
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(attendancePrefix)) {
        const dateStr = key.replace(attendancePrefix, "")
        // Validate that it's a proper date format (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          setWalletData(address, `attendance-${dateStr}`, true)
        }
      }
    }

    console.log("Data migration to wallet-specific storage complete")
  } catch (error) {
    console.error("Error migrating to wallet storage:", error)
  }
}
