from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'checkers'

toolbar = DebugToolbarExtension(app)

board = boggle_game.make_board()

@app.route('/')
def show_game():
    session['board'] = board
    return render_template('index.html', board=board)

@app.route('/find')
def check_guess():
    guess = request.args.get('guess')
    result = boggle_game.check_valid_word(board, guess)
    reply = {'result': result}
    return jsonify(reply)
