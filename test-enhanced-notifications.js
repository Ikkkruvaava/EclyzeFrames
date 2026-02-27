/**
 * Enhanced Notification System Test Script
 * 
 * This script demonstrates the enhanced notification system that supports:
 * 1. Image URLs in push notifications
 * 2. Custom button text and redirection links
 * 3. Support for in-app navigation and external URLs
 * 4. All push tokens are fetched from PushTokens collection
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d';

// Test data for different notification types
const testNotifications = [
  {
    name: "Home Screen Donation",
    data: {
      channel: "push",
      userGroup: "all",
      title: "Support Our Cause",
      body: "Your donation can make a difference. Help us continue our mission.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s",
      buttonText: "Donate Now",
      buttonLink: "/home?paramamount=150"
    }
  },
  {
    name: "Sponsorship Campaign",
    data: {
      channel: "push",
      userGroup: "all",
      title: "Become a Sponsor",
      body: "Join our sponsorship program and support our community initiatives.",
      imageUrl: "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
      buttonText: "Sponsor Now",
      buttonLink: "/sponsorship"
    }
  },
  {
    name: "Campaign Notification",
    data: {
      channel: "push",
      userGroup: "all",
      title: "Join Our Campaign",
      body: "Be part of our latest campaign and help us reach our goals.",
      imageUrl: "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
      buttonText: "Campaign Now",
      buttonLink: "/campaigns?campaignId=685e9bd8bc5c3adcb650336d"
    }
  },
  {
    name: "YouTube Live Stream",
    data: {
      channel: "push",
      userGroup: "all",
      title: "🔴 Live Now",
      body: "Join us for our live session. Don't miss out on important updates!",
      imageUrl: "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
      buttonText: "Watch Live",
      buttonLink: "https://www.youtube.com/live/R7pkey0Rokk?si=hxpsyuavHEIZWtdj"
    }
  },
  {
    name: "Simple Text Notification",
    data: {
      channel: "push",
      userGroup: "all",
      title: "Important Update",
      body: "This is a simple text notification without images or buttons.",
    }
  }
];

/**
 * Send a test notification
 */
async function sendTestNotification(testData) {
  try {
    console.log(`\n🚀 Sending: ${testData.name}`);
    console.log('📦 Payload:', JSON.stringify(testData.data, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(testData.data),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', result.message);
      if (result.result) {
        console.log(`📊 Sent to ${result.result.sent} tokens, Delivered: ${result.result.delivered}, Failed: ${result.result.failed}`);
      }
    } else {
      console.log('❌ Error:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Request failed:', error.message);
    return null;
  }
}

/**
 * Get user counts for different groups
 */
async function getUserCounts() {
  try {
    console.log('\n📊 Fetching user counts...');
    
    const response = await fetch(`${API_BASE_URL}/api/notifications/user-counts`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('📈 User Counts:');
      console.log(`   📱 All Users: ${result.counts.all}`);
      console.log(`   🔔 Subscribers: ${result.counts.subscribers}`);
      console.log(`   📦 Box Holders: ${result.counts.boxholders}`);
    } else {
      console.log('❌ Failed to fetch user counts:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Request failed:', error.message);
    return null;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🎯 Enhanced Notification System Test');
  console.log('=====================================');
  
  // Get user counts first
  await getUserCounts();
  
  // Test each notification type
  for (let i = 0; i < testNotifications.length; i++) {
    const testData = testNotifications[i];
    
    console.log(`\n📋 Test ${i + 1}/${testNotifications.length}: ${testData.name}`);
    console.log('─'.repeat(50));
    
    await sendTestNotification(testData);
    
    // Wait a bit between requests
    if (i < testNotifications.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎉 All tests completed!');
  console.log('\nKey Features Demonstrated:');
  console.log('✅ Image URLs in push notifications');
  console.log('✅ Custom button text and links');
  console.log('✅ In-app navigation (e.g., /home?paramamount=150)');
  console.log('✅ External URLs (e.g., YouTube links)');
  console.log('✅ Campaign-specific links with parameters');
  console.log('✅ Push tokens fetched from PushTokens collection');
  console.log('\n💡 Data Structure Sent to Mobile App:');
  console.log(`{
  "to": "ExponentPushToken[...]",
  "title": "Your Notification Title",
  "body": "Your Notification Body",
  "data": {
    "imageUrl": "https://example.com/image.jpg",
    "buttonText": "Action Button",
    "buttonLink": "/path/or/url"
  }
}`);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Enhanced Notification System Test Script
=======================================

Usage: node test-enhanced-notifications.js [options]

Options:
  --help, -h     Show this help message
  --counts       Only fetch and display user counts
  --test <name>  Run a specific test by name

Available tests:
${testNotifications.map((t, i) => `  ${i + 1}. ${t.name}`).join('\n')}

Examples:
  node test-enhanced-notifications.js
  node test-enhanced-notifications.js --counts
  node test-enhanced-notifications.js --test "YouTube Live Stream"
`);
  process.exit(0);
}

if (args.includes('--counts')) {
  getUserCounts().then(() => process.exit(0));
} else if (args.includes('--test')) {
  const testIndex = args.indexOf('--test');
  const testName = args[testIndex + 1];
  
  if (!testName) {
    console.error('❌ Please provide a test name after --test');
    process.exit(1);
  }
  
  const testData = testNotifications.find(t => t.name === testName);
  if (!testData) {
    console.error(`❌ Test "${testName}" not found`);
    console.log('Available tests:', testNotifications.map(t => t.name).join(', '));
    process.exit(1);
  }
  
  sendTestNotification(testData).then(() => process.exit(0));
} else {
  runTests().then(() => process.exit(0));
}
