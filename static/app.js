const $submit = $('#submit-guess')



$submit.on('click', function(evt){
    
    evt.preventDefault();
    const $guess = $('#guess').val();
    checkGuess($guess);
    $('#guess').val('');
})

async function checkGuess(guess){
    console.log(guess)
    response = await axios.get(`/find?guess=${guess}`)
    console.log(response)
}
