from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'checkers'

toolbar = DebugToolbarExtension(app)

times_played = 0

@app.route('/')
def show_game():
    board = boggle_game.make_board()
    session['board'] = board
    session.get('high_score', 0)
    times_played = session.get('timesPlayed', 0)
    return render_template('index.html', board = board, times_played = times_played)

@app.route('/find')
def check_guess():
    guess = request.args.get('guess')
    board = session['board']
    result = boggle_game.check_valid_word(board, guess)
    reply = {'result': result}
    return jsonify(reply)

@app.route('/finish', methods=['POST'])
def finished():
    # import pdb
    # pdb.set_trace()
    
    if session.get('high_score', 0) < request.json['highScore']:
        session['high_score'] = request.json['highScore']
    times_played = session.get('timesPlayed', 0)
    times_played += 1
    session['timesPlayed'] = times_played
    reply = {'highScore': session['high_score'], 'timesPlayed': session['timesPlayed']}
    return jsonify(reply)
