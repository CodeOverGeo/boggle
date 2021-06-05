const $submit = $('#submit-guess')
const resultConverter = {
    'ok': 'Word is valid!', 
    'not-on-board': 'Word was not found on game board!', 
    'not-word': 'Guess is not a word!'};

let score = 0

$submit.on('click', function(evt){    
    evt.preventDefault();
    const $guess = $('#guess').val();
    if ( $guess.length < 3 ){
        return;
    }
    runWord($guess);
    $('#guess').val('');
})

async function runWord(guess){
    wordResult = await checkGuess(guess)
    updateHTML(wordResult);
    updateScore(wordResult);
}

async function checkGuess(guess){
    try{
    response = await axios.get(`/find?guess=${guess}`);
    guessResult = response.data.result;
    }
    catch(error){
        console.error(error)
    }
    return guessResult
    
}

function updateHTML(word){    
    $('#result').text(resultConverter[word]);
}

function updateScore(word){
    if (word = 'ok'){
        console.log('updateScore')
    }
}
