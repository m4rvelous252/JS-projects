/*
GAME FUNCTION:
- Player must guess a number between a min and max
- Player gets a certain amount of guesses
- Notify player of guesses remaining
- Notify the player of the correct answer if loose
- Let player choose to play again
*/

// Game values
let min = 1,
    max = 10,
    winningNum = getRandomNum(min, max),
    guessesLeft = 3;

// UI Elements
const   game = document.querySelector('#game'),
        minNum = document.querySelector('.min-num'),
        maxnum = document.querySelector('.max-num'),
        guessBtn = document.querySelector('#guess-btn'),
        guessInput = document.querySelector('#guess-input'),
        message = document.querySelector('.message');

// Assign UI min max
minNum.textContent = min;
maxnum.textContent = max;

// Play again listener
game.addEventListener('mousedown', function(e){
    if(e.target.className === 'play-again'){
        window.location.reload()
    }
})

// Listen for guess
guessBtn.addEventListener('click', function(){
    let guess = parseInt(guessInput.value);

    // Validate
    if(isNaN(guess) || guess < min || guess > max){
        setMessage(`Please enter a number between ${min} and ${max}`, 'red')
    }else{
        // Check if won
        if(guess === winningNum){
            // Game over - won

            gameOver(true, `${winningNum} is correct, YOU WIN!`)
        } else {
            // Reduce number of guesses
            guessesLeft--;
            // Set message
            if(guessesLeft==0){
                // Game over - lost
                gameOver(false, `Game over! YOU LOST. The correct answer was ${winningNum}`)
            }else{
                // Change border color
                guessInput.style.borderColor = 'red';
                // Set message
                setMessage(`${guess} is incorrect, ${guessesLeft} guesses left`, 'red')
                // Clear input
                guessInput.value = ''
            } 
        }
    }
})

// Game over
function gameOver(won, msg){
    let color;
    won === true ? color = 'green' : color = 'red'

    // Disable input
    guessInput.disable = true;
    // Change border color
    guessInput.style.borderColor = color
    // Set message
    setMessage(msg, color)
    // PLay again
    guessBtn.value = 'Play again'
    guessBtn.className += 'play-again'
}

function getRandomNum(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Set message
function setMessage(msg, color){
    message.style.color = color
    message.textContent = msg
}