# test_app.py

import unittest
import json
import sys
from app import app  # Import Flask app

class BasicTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_frequency_by_location(self):
        response = self.app.get('/api/accidents/frequency_by_location')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data())
        self.assertIsInstance(data, list)  # Check if the response is a list
        # Additional tests to check the contents of the response

if __name__ == "__main__":
    unittest.main()
