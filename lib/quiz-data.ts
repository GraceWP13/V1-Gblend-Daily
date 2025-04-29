export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Is Fluent a Layer 1 or Layer 2 network?",
    options: ["Layer 1", "Layer 2"],
    correctAnswer: "Layer 2",
  },
  {
    question: "What is Fluent?",
    options: [
      "The exspressive blockchain that blended EVM, SVM and Wasm into one chain.",
      "The blockchain that is focusing on Dating to find your soulmate on the spaces.",
    ],
    correctAnswer: "The exspressive blockchain that blended EVM, SVM and Wasm into one chain.",
  },
  {
    question: "How much has Fluent raised currently?",
    options: ["$2 million", "$8 million", "$10 million"],
    correctAnswer: "$8 million",
  },
  {
    question: "What narrative is Fluent trying to convey?",
    options: ["Exspressivity", "Speedy"],
    correctAnswer: "Exspressivity",
  },
  {
    question: "Who are some of Fluent's backers?",
    options: ["a16z and Google", "Coinbase and Binance", "Polychain Capital, dao5, Symbolic Capital"],
    correctAnswer: "Polychain Capital, dao5, Symbolic Capital",
  },
  {
    question: "Who are the co-founders of Fluent?",
    options: ["Dmitry Savonin and Blendino", "Vitalik Buterin and Anatoly Yakovenko", "Brian Armstrong and CZ"],
    correctAnswer: "Dmitry Savonin and Blendino",
  },
  {
    question: "What is rWasm?",
    options: [
      "The core of Fluent Virtual Machine which supports a blended execution enviroment for multiple VMs.",
      "The platform that is used as a p2p exchange.",
    ],
    correctAnswer: "The core of Fluent Virtual Machine which supports a blended execution enviroment for multiple VMs.",
  },
]
