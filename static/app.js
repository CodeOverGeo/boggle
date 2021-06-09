// Pull the necessary values off of the DOM using JQuery

const $submit = $('#submit-guess');
const $resetScore = $('#reset-score');
const $start = $('#start');
const $timer = $('#timer');
const $onStart = $('#on-start')
const $savedScore = $('#saved-score')

// Create a converter for API response to DOM display
const resultConverter = {
    'ok': 'Word is valid!', 
    'not-on-board': 'Word was not found on game board!', 
    'not-word': 'Guess is not a word!'};

// Declare values that will change while game is played

let score = 0;
let timer = 60;

// Create array to hold guesses to prevent duplicate guesses
const guesses = [];

// Display timer of screen. Timer may be able to be selected by user in future version.
$timer.text(timer)

// When user submits a guess, ensure it is a valid length,
// make sure it is a word and check for it on the board.

$submit.on('click', function(evt){    
    evt.preventDefault();
    const $guess = $('#guess').val();
    if (guesses.includes($guess) || $guess.length < 3){
        return;
    }
    runWord($guess);
    $('#guess').val('');
})

//Submit word to API to check if word is valid and is on board

function runWord(guess){    
    checkGuess(guess).then(wordResult => {
    if (wordResult){
    updateHTML(wordResult);
    updateScore(wordResult, guess);
    }else {
        return
    }
    }) 
}

//Check to see if word is valid ond on board using API.
//Handle API down with user notice

async function checkGuess(guess){
    try{
    const response = await axios.get(`/find?guess=${guess}`);
    const guessResult = response.data.result;
    return guessResult
    }
    catch(error){
        console.error(error);
        $('#result').text('API Down, try again');
        return false
    }
}

//Handle user facing notice for guesses

function updateHTML(word){  
    $('#result').text(resultConverter[word]);
}

//Update score for valid words

function updateScore(word, guess){    
    if (word === 'ok'){
        guesses.push(guess);
        score += guess.length;
        $('#score').text(`Score: ${score}`);
    }
}

//Submit final results of score to API and set new high score on DOM

async function saveResults(){
    res = await axios.post('/finish', {highScore: score})
    console.log(res)
    timesPlayed = res.data.timesPlayed;
    highScore = res.data.highScore;
    $savedScore.html(`<p>Times Played:${timesPlayed}</p>
    <p>High Score:${highScore}</p>`);
}

//Start game by clicking start button and starting timer

$start.on('click', function() {
    $onStart.toggle();
    $start.toggle();
    countdownTimer = setInterval(function(){
    timer--
    if(timer <= 0){
        clearInterval(countdownTimer);
        $submit.off();
        $submit.on('click', (evt)=> evt.preventDefault());
        $timer.text('TIMES UP!');
        saveResults();
    }else{
        $timer.text(timer);
    }    
}, 1000);
})
