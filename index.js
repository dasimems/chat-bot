const express = require("express");
const { createServer } = require("http");
var cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(
  cors({
    origin: "*"
  })
);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const definitions = {
  facial:
    "Facial treatments are cosmetic procedures designed to improve the health & appearance of the skin on the face",
  body: "Body treatment are therapeutic or cosmetic procedures aimed at improving the health and appearance of the skin on the body",
  pediMani:
    "This focus on the care and cosmetic enhancement of the nails and skins on the hands and feet"
};

const dateRegex =
  /\b(?:\d{1,4}[-/\s]?\d{1,2}[-/\s]?\d{1,4}|\d{1,2}(?:st|nd|rd|th)?[-\s/]?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[-\s/]?(?:\d{2,4}|this year))\b/i;

function checkDateInMessage(message) {
  return dateRegex.test(message);
}
function checkWordsInText(text, wordList) {
  // Convert the text to lowercase for case-insensitive matching
  const lowercaseText = text.toLowerCase();

  // Check if all words in the wordList are present in the text
  return wordList.every((word) => lowercaseText.includes(word.toLowerCase()));
}

io.on("connection", (socket) => {
  socket.on("message", (messageContent) => {
    const { message } = messageContent || {};

    if (!message || message.length < 1 || typeof message !== "string") {
      return;
    }

    if (
      !checkWordsInText(message, ["hi"]) &&
      !checkWordsInText(message, ["hello"]) &&
      !checkWordsInText(message, ["menu"]) &&
      !checkWordsInText(message, ["list"]) &&
      !checkWordsInText(message, ["offer"]) &&
      !checkWordsInText(message, ["book", "appointment"]) &&
      !checkWordsInText(message, ["book"]) &&
      !checkWordsInText(message, ["appointment"]) &&
      !checkWordsInText(message, ["okay"]) &&
      !checkWordsInText(message, ["facial"]) &&
      !checkWordsInText(message, ["facial", "treatment"]) &&
      !checkWordsInText(message, ["body"]) &&
      !checkWordsInText(message, ["body", "treatment"]) &&
      !checkWordsInText(message, ["meaning"]) &&
      !checkWordsInText(message, ["these", "mean"]) &&
      !checkWordsInText(message, ["they", "mean"]) &&
      !checkWordsInText(message, ["this", "mean"]) &&
      !checkDateInMessage(message) &&
      !checkWordsInText(message, ["pedi"]) &&
      !checkWordsInText(message, ["mani"]) &&
      !checkWordsInText(message, ["pedi", "mani"]) &&
      !checkWordsInText(message, ["pedi", "mani", "treatment"]) &&
      !checkWordsInText(message, ["why", "need", "treatment"]) &&
      !checkWordsInText(message, ["why", "need"]) &&
      !checkWordsInText(message, ["why", "treatment"]) &&
      !checkWordsInText(message, ["I", "need", "treatment"]) &&
      !checkWordsInText(message, ["how", "get", "treatment"]) &&
      !checkWordsInText(message, ["how", "get"]) &&
      !checkWordsInText(message, ["get", "treatment"]) &&
      !checkWordsInText(message, ["how", "help", "service"]) &&
      !checkWordsInText(message, ["does", "help", "service"]) &&
      !checkWordsInText(message, ["service", "help"]) &&
      !checkWordsInText(message, ["how", "does", "help"])
    ) {
      socket.emit("response", {
        response: "Sorry i couldn't catch that, can you rephrase?"
      });
    }

    if (
      checkWordsInText(message, ["hi"]) ||
      checkWordsInText(message, ["hello"])
    ) {
      socket.emit("response", {
        response: "Welcome to heritage spa, how can we assist you today?"
      });
    }
    if (
      checkWordsInText(message, ["menu"]) ||
      checkWordsInText(message, ["list"]) ||
      checkWordsInText(message, ["offer"])
    ) {
      socket.emit("response", {
        response:
          "We offer, Facial treatment, Body treatment and Pedi & Mani treatment"
      });
    }
    if (
      checkWordsInText(message, ["facial"]) ||
      checkWordsInText(message, ["facial", "treatment"])
    ) {
      socket.emit("response", {
        response: definitions.facial
      });
    }
    if (
      checkWordsInText(message, ["body"]) ||
      checkWordsInText(message, ["body", "treatment"])
    ) {
      socket.emit("response", {
        response: definitions.body
      });
    }
    if (
      checkWordsInText(message, ["meaning"]) ||
      checkWordsInText(message, ["these", "mean"]) ||
      checkWordsInText(message, ["they", "mean"]) ||
      checkWordsInText(message, ["this", "mean"])
    ) {
      socket.emit("response", {
        response: `Facial treatment: ${definitions.facial}`
      });
      socket.emit("response", {
        response: `Body treatment: ${definitions.body}`
      });
      socket.emit("response", {
        response: `Pedi & mani treatment: ${definitions.pediMani}`
      });
    }
    if (
      checkWordsInText(message, ["pedi"]) ||
      checkWordsInText(message, ["mani"]) ||
      checkWordsInText(message, ["pedi", "mani"]) ||
      checkWordsInText(message, ["pedi", "mani", "treatment"])
    ) {
      socket.emit("response", {
        response: definitions.pediMani
      });
    }
    if (
      checkWordsInText(message, ["book", "appointment"]) ||
      checkWordsInText(message, ["book"]) ||
      checkWordsInText(message, ["appointment"])
    ) {
      socket.emit("response", {
        response: "What time and date would you like to check in?"
      });
    }
    if (
      checkWordsInText(message, ["why", "need", "treatment"]) ||
      checkWordsInText(message, ["why", "need"]) ||
      checkWordsInText(message, ["why", "treatment"])
    ) {
      socket.emit("response", {
        response: "1.) Improve your health and maintenance"
      });
      socket.emit("response", {
        response: "2.) Improve your Psychological well being"
      });
      socket.emit("response", {
        response: "3.) Aesthetics"
      });
    }
    if (
      checkWordsInText(message, ["I", "need", "treatment"]) ||
      checkWordsInText(message, ["how", "get", "treatment"]) ||
      checkWordsInText(message, ["how", "get"]) ||
      checkWordsInText(message, ["get", "treatment"])
    ) {
      socket.emit("response", {
        response: "You can get treatment only when you book an appointment"
      });
    }
    if (
      checkWordsInText(message, ["how", "help", "service"]) ||
      checkWordsInText(message, ["how", "does", "help"]) ||
      checkWordsInText(message, ["does", "help", "service"]) ||
      checkWordsInText(message, ["service", "help"])
    ) {
      socket.emit("response", {
        response: "It helps in terms of:"
      });
      socket.emit("response", {
        response: "1.) Improved skin health and maintenance"
      });
      socket.emit("response", {
        response: "2.) Aesthetic enhancement"
      });
      socket.emit("response", {
        response: "3.) Stress relief and relaxation"
      });
    }

    if (checkDateInMessage(message)) {
      socket.emit("response", {
        response:
          "Thank you for messaging us, your date have been received and we will get back to you shortly. 🙂"
      });
    }
  });

  socket.on("connect_app", () => {
    socket.emit("connection_successful", { socket_id: socket.id });
  });

  // ...
});

httpServer.listen(8000, () => {
  console.log("Server running at 8000");
});
