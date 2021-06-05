const $submit = $('#submit-guess')



$submit.on('click', function(evt){    
    evt.preventDefault();
    const $guess = $('#guess').val();
    if ( $guess.length < 3 ){
        return;
    }
    checkGuess($guess);
    $('#guess').val('');
})

async function checkGuess(guess){
    response = await axios.get(`/find?guess=${guess}`);
    guessResult = response.data.result;
    $('#result').text(guessResult);
}
