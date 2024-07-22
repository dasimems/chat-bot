const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

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
      !checkDateInMessage(message)
    ) {
      socket.emit("response", {
        response: "Welcome to heritage spa, how can we assist you today?"
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
        response: "We offer \n Manicure \n Pendicure \n Facial treatment"
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

    if (checkDateInMessage(message)) {
      socket.emit("response", {
        response:
          "Thank you for messaging us, your date have been received and we will get back to you shortly. 🙂"
      });
    }
  });
  // ...
});

httpServer.listen(8000, () => {
  console.log("Server running at 8000");
});
