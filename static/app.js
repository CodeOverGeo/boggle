const $submit = $('#submit-guess');
const $resetScore = $('#reset-score');
const $start = $('#start');
const $timer = $('#timer');
const $letter = $('.letter');
const $savedScore = $('#saved-score')
const resultConverter = {
    'ok': 'Word is valid!', 
    'not-on-board': 'Word was not found on game board!', 
    'not-word': 'Guess is not a word!'};

let score = 0;
let timer = 10;
let countdownTimer = null;

const guesses = [];

$timer.text(timer)

$submit.on('click', function(evt){    
    evt.preventDefault();
    const $guess = $('#guess').val();
    if (guesses.includes($guess) || $guess.length < 3){
        return;
    }
    runWord($guess);
    $('#guess').val('');
})

async function runWord(guess){    
    wordResult = await checkGuess(guess);
    updateHTML(wordResult);
    updateScore(wordResult, guess);
}

async function checkGuess(guess){
    try{
    response = await axios.get(`/find?guess=${guess}`);
    guessResult = response.data.result;
    }
    catch(error){
        console.error(error);
    }
    return guessResult;
}

function updateHTML(word){  
    $('#result').text(resultConverter[word]);
}

function updateScore(word, guess){
    
    if (word === 'ok'){
        guesses.push(guess);
        score += guess.length;
        $('#score').text(`Score: ${score}`);
        
    }
}

$resetScore.on('click', function(evt){
    
    score = 0;
    $('#score').text(`Score: ${score}`);
})

async function saveResults(){
    res = await axios.post('/finish', {highScore: score})
    console.log(res)
    timesPlayed = res.data.timesPlayed;
    highScore = res.data.highScore;
    $savedScore.html(`<p>Times Played:${timesPlayed}</p>
    <p>High Score:${highScore}</p>`);
}

$start.on('click', function() {
    $letter.css('color', 'black');
    $start.off();
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
