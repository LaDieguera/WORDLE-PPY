// Definiciones iniciales y obtención de elementos del DOM
const apiUrl = "https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase";
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const letterContainers = document.getElementById("correct-letters");
const resetButton = document.getElementById("reset-button");
const giveUpButton = document.getElementById("give-up-button");
const winningMessage = document.getElementById("winning-message");
const losingMessage = document.getElementById("losing-message");
const highScoreDisplay = document.getElementById("boardScore");
const helpButton = document.getElementById("help-button");
const modal = document.getElementById("myModal");

let wordAPI = "";
let hint = "";
let attempts = 6;
let correctLetters = 0;
let highScore = JSON.parse(localStorage.getItem("highScore") || "0");

// Funciones auxiliares para el juego
function fetchWord() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      wordAPI = data[0];
      fetchHint(wordAPI);
    }).catch(error => console.error("Error al obtener la palabra:", error));
}

function fetchHint(word) {
  const apiUrlDefinition = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
  console.log(word)
  fetch(apiUrlDefinition)
  .then(response => response.json())
  .then(data => {
      hint = data[0].meanings[0].definitions[0].definition;
      helpButton.onclick = () => alert(hint);
    }).catch(error => console.error("Error al obtener la pista:", error));
}

function updateScoreDisplay() {
    highScoreDisplay.innerHTML = "PUNTAJE: " + highScore;
}

function resetGame() {
    modal.style.display = "none";
    location.reload();
}

function giveUp() {
    alert("La palabra es: " + wordAPI);
    resetGame();
}

function checkGuess() {
    if (attempts === 0) {
        losingMessage.style.display = "block";
        modal.style.display = "none";
        letterContainers.innerHTML = "";
        attempts = 6;
        return;
    }
    
    let guess = guessInput.value.toUpperCase();
    if (guess.length !== 5) {
        alert("La palabra debe tener 5 letras");
        return;
    }
    
    attempts--;
    verifyGuess(guess);
}

function verifyGuess(guess) {
    let arrayWord = guess.split("");
    let arrayDictionaryWord = wordAPI.split("");
    if (correctLetters === 5) {
        return
    }
    correctLetters = 0;
    if (arrayWord.length !== arrayDictionaryWord.length) {
      return;
    }
    
  
    // Crea un contenedor para este intento específico
    const attemptContainer = document.createElement("div");
    attemptContainer.classList.add("attempt-container"); // Opcional, por si quieres aplicar estilos específicos
  
    arrayWord.forEach((letter, index) => {
      const letterContainer = document.createElement("div");
      letterContainer.classList.add("letter-container");
  
      if (letter === arrayDictionaryWord[index]) {
        letterContainer.classList.add("correct");
        correctLetters++;
      } else if (arrayDictionaryWord.includes(letter)) {
        letterContainer.classList.add("partialCorrect");
      } else {
        letterContainer.classList.add("incorrect");
      }
  
      letterContainer.textContent = letter;
      // Añade el letterContainer al attemptContainer en lugar de directamente a letterContainers
      attemptContainer.appendChild(letterContainer);
    });
  
    // Añade un <br> después de cada letra dentro del intento, si es necesario
    // attemptContainer.appendChild(document.createElement("br")); // Esta línea es opcional y solo si necesitas un <br> adicional
  
    // Finalmente, añade el attemptContainer completo a letterContainers
    letterContainers.appendChild(attemptContainer);
  
    // Añade un <br> después de cada intento si es necesario (y no lo estás haciendo dentro de attemptContainer)
    // letterContainers.appendChild(document.createElement("br")); // Esta línea es opcional, dependiendo de tu diseño
  
    if (correctLetters === arrayDictionaryWord.length) {
      modal.style.display = "block";
      
      winningMessage.style.display = "block";

      losingMessage.style.display = "none";
      guessButton.style.display = "none";
      resetButton.style.display = "block";
      highScore++;
      localStorage.setItem("highScore", JSON.stringify(highScore));
      updateScoreDisplay();
    } else if (attempts === 0) {
      modal.style.display = "block";
      winningMessage.style.display = "none";
      losingMessage.style.display = "block";
      resetButton.style.display = "none";
      guessButton.style.display = "block";
    }
  }
  
  
// Event listeners
guessButton.addEventListener("click", checkGuess);

guessInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    checkGuess();
  }
});
resetButton.addEventListener("click", resetGame);
giveUpButton.addEventListener("click", giveUp);

// Inicialización del juego
function initGame() {
  fetchWord();
  updateScoreDisplay();
}

initGame();
