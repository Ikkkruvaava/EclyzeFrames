// Test script for the notification API
const API_KEY = '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d';

async function testNotificationAPI() {
  try {
    console.log('Testing notification API...');
    
    const response = await fetch('http://localhost:3000/api/admin/recent-activities?limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Success! API Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Test after server is ready
setTimeout(testNotificationAPI, 5000);
