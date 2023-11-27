# test_app.py

import unittest
import json
from app import app 

class BasicTests(unittest.TestCase):

    def setUp(self):
        # Create a test client using the Flask application configured for testing
        self.app = app.test_client()
        self.app.testing = True

    def test_frequency_by_location(self):
        # Send a GET request to the application
        response = self.app.get('/api/accidents/frequency_by_location')
        self.assertEqual(response.status_code, 200)
        
        # Load the response data as JSON and validate the expected format
        data = json.loads(response.data.decode('utf-8'))
        self.assertIsInstance(data, list)  # The response should be a list
        
        # Check for Non-Empty Response
        self.assertGreater(len(data), 0)  # The response should not be an empty list



if __name__ == "__main__":
    unittest.main()

