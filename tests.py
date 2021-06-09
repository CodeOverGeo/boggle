from unittest import TestCase

from werkzeug.wrappers import response
from app import app, times_played
from flask import json, session
from boggle import Boggle

class BoggleTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True        

    def test_index(self):
        with self.client:
            res = self.client.get('/')
            html = res.get_data(as_text=True)
            self.assertIn('board', session)
            self.assertIsNone(session.get('high_score'))
            self.assertEqual(times_played, 0)
            self.assertEqual(res.status_code, 200)
            self.assertIn('<td>', html)
    
    def test_word_is_valid(self):
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [['J', 'U', 'M', 'P', 'T'],
                                 ['A', 'T', 'M', 'P', 'T'],
                                 ['I', 'U', 'A', 'P', 'T'],
                                 ['L', 'U', 'M', 'I', 'T'],
                                 ['T', 'U', 'A', 'I', 'L']]

        response = self.client.get('/find?guess=jump')
        self.assertEqual(response.json['result'], 'ok')
        response = self.client.get('/find?guess=tail')
        self.assertEqual(response.json['result'], 'ok')
        response = self.client.get('/find?guess=mail')
        self.assertEqual(response.json['result'], 'ok')
        response = self.client.get('/find?guess=jail')
        self.assertEqual(response.json['result'], 'ok')
    
    def test_not_on_board(self):

        self.client.get('/')
        response = self.client.get('/find?guess=stop')
        self.assertEqual(response.json['result'], 'not-on-board')

    def test_not_word(self):

        self.client.get('/')
        response = self.client.get('/find?guess=kdkd')
        self.assertEqual(response.json['result'], 'not-word')

    def test_finish(self):
        with self.client as client:
            response = self.client.post('/finish', json = {'highScore': 31})
            self.assertEqual(response.json['highScore'], 31)
            self.assertEqual(response.json['timesPlayed'], 1)
            