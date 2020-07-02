/*
Game Framework:
  - Player must guess number with [min, max]
  - Player has limited number of attempts
  - Player will be notified of win or loss
  - Player has the ability to play again
*/

// Game values
let min = 1, max = 10, guessesLeft = 3;
let winNum = Math.floor(Math.random() * max + 1);

// UI Elements
const game = document.querySelector('#game'),
      minNum = document.querySelector('.min-num')
      maxNum = document.querySelector('.max-num')
      guessBtn = document.querySelector('#guess-btn'),
      guessInput = document.querySelector('#guess-input'),
      message = document.querySelector('.message');

// Assign UI min and max
minNum.textContent = min;
maxNum.textContent = max;

// Play again event listener
game.addEventListener('mousedown', function(e){
  if(e.target.className === 'play-again'){
    window.location.reload();
  }
}); 

// Listen for guess
guessBtn.addEventListener('click', function(e){  
  // Check if user has lost
  if (guessesLeft <= 0){
    gameOver(`Game over. You are out of guesses. Winning number was ${winNum}.`, 'red')
    guessBtn.value = 'Play Again';
    guessBtn.className += 'play-again';
    return;
  }

  // Parse Input
  let guess = parseInt(guessInput.value);

  // Validate input
  if(isNaN(guess) || guess < min || guess > max){
    setMessage(`Please enter a number between ${min} and ${max}`, 'red');
  }
  else{
  // Check if correct number guessed
  if (guess === winNum){
    gameOver(`${winNum} is correct. You win.`, 'green')
    guessBtn.value = 'Play Again';
    guessBtn.className += 'play-again';
    return
  }
  else{
    // Check if user has lost
    if (guessesLeft == 1){
      guessesLeft -= 1;
      gameOver(`Game over. You are out of guesses. Winning number was ${winNum}.`, 'red');
      guessBtn.value = 'Play Again';
      guessBtn.className += 'play-again';
    }
    else{
      guessesLeft -= 1;
      setMessage(`${guess} is incorrect. You have ${guessesLeft} guess remaining.`, 'red');
    }
  }
}
});

// Updates the UI to end of game screen with the given message and color
function gameOver(msg, color){
  guessInput.disabled = true;
  guessInput.style.borderColor = color;
  guessInput.value = '';
  setMessage(msg, color);
}

// Sets the message
function setMessage(msg, color){
  message.style.color = color;
  message.textContent = msg;
}
    