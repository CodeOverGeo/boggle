from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify
# from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'checkers'

# toolbar = DebugToolbarExtension(app)

times_played = 0

@app.route('/')
def show_game():
    """Generate game board and transmit both high score and times played."""
    board = boggle_game.make_board()
    session['board'] = board
    session.get('high_score', 0)
    times_played = session.get('timesPlayed', 0)
    return render_template('index.html', board = board, times_played = times_played)

@app.route('/find')
def check_guess():
    """
    Check if guess is a valid word and if it exists on the game board
    Reply back in json
    """
    guess = request.args.get('guess')
    board = session['board']
    result = boggle_game.check_valid_word(board, guess)
    reply = {'result': result}
    return jsonify(reply)

@app.route('/finish', methods=['POST'])
def finished():
    """
    Retrieve score from finished game and add it to session if it is the high score
    Increment times played by 1 and reply back in json
    """
    score = request.json['highScore']
    high_score = session.get('high_score', 0)
    session['high_score'] = max(score, high_score)
    times_played = session.get('timesPlayed', 0)
    times_played += 1
    session['timesPlayed'] = times_played
    reply = {'highScore': session['high_score'], 'timesPlayed': session['timesPlayed']}
    return jsonify(reply)
