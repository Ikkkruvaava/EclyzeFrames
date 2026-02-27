# Image URL Implementation Guide

## Overview
The Image URL feature allows sending push notifications with custom images to enhance user engagement. This document explains how the image URL is correctly passed through the entire notification system.

## Flow of Image URL Data

### 1. Frontend Form (UI)
**File**: `src/app/admin/(admin)/notifications/send-notifications/page.tsx`

The form includes an "Image URL (Optional)" field:
```tsx
<div>
  <label htmlFor="customImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Image URL (Optional)
  </label>
  <input
    type="text"
    id="customImageUrl"
    value={customImageUrl}
    onChange={(e) => setCustomImageUrl(e.target.value)}
    placeholder="Enter URL for notification image"
    className="px-3 py-2 w-full bg-white/10 backdrop-blur-md rounded-lg border..."
  />
</div>
```

### 2. Form Submission
**File**: `src/app/admin/(admin)/notifications/send-notifications/page.tsx`

When the form is submitted, the image URL is included in the payload:
```tsx
// Add channel-specific fields
if (selectedChannel === "push") {
  payload.title = customTitle;
  
  // Only add imageUrl if it's not empty
  if (customImageUrl && customImageUrl.trim()) {
    payload.imageUrl = customImageUrl.trim();
  }
  
  // Add button configuration if provided
  if (customButtonText.trim()) {
    payload.buttonText = customButtonText.trim();
    if (customButtonLink && customButtonLink.trim()) {
      payload.buttonLink = customButtonLink.trim();
    }
  }
}
```

### 3. API Endpoint
**File**: `src/app/api/notifications/send/route.js`

The API receives and processes the image URL:
```javascript
// Add channel-specific fields
if (body.channel === 'push') {
    notificationData.title = body.title;
    
    // Only add imageUrl if it exists and is not empty
    if (body.imageUrl && body.imageUrl.trim()) {
        notificationData.imageUrl = body.imageUrl.trim();
    }
    
    // Only add button fields if they exist and are not empty
    if (body.buttonText && body.buttonText.trim()) {
        notificationData.buttonText = body.buttonText.trim();
        if (body.buttonLink && body.buttonLink.trim()) {
            notificationData.buttonLink = body.buttonLink.trim();
        }
    }
}
```

### 4. Push Token Processing
**File**: `src/app/api/notifications/send/route.js`

The image URL is included in the push notification data:
```javascript
// Create messages
const messages = pushTokens.map(token => {
    const message = {
        to: token,
        sound: "default",
        title: data.title,
        body: data.body,
        data: {
            screen: "Notification",
            notificationId: notificationRecord._id.toString()
        },
        priority: "high",
        channelId: "default"
    };

    // Add image URL in data object (as per your Postman example)
    if (data.imageUrl && data.imageUrl.trim()) {
        message.data.imageUrl = data.imageUrl.trim();
    }

    // Add button configuration in data object (as per your Postman example)
    if (data.buttonText && data.buttonText.trim()) {
        message.data.buttonText = data.buttonText.trim();
        if (data.buttonLink && data.buttonLink.trim()) {
            message.data.buttonLink = data.buttonLink.trim();
        }
    }

    return message;
});
```

### 5. Final Expo Payload
The final payload sent to Expo Push Service matches your Postman example:
```json
{
  "to": "ExponentPushToken[...]",
  "title": "Your Notification Title",
  "body": "Your Notification Body",
  "data": {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s",
    "buttonText": "Donate Now",
    "buttonLink": "/home?paramamount=150",
    "screen": "Notification",
    "notificationId": "..."
  }
}
```

## Validation & Error Handling

### Input Validation
- Image URL is trimmed of whitespace
- Empty strings are not sent (converted to undefined)
- URL format is not validated (allows any string)

### Error Handling
- Invalid URLs won't break the notification
- Mobile app should handle missing or invalid image URLs gracefully

## Testing the Image URL Feature

### Method 1: Using the Web Interface
1. Navigate to `/admin/notifications/send-notifications`
2. Select "Push Notification" channel
3. Fill in title and body
4. Enter image URL: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s`
5. Add button text: "Donate Now"
6. Add button link: "/home?paramamount=150"
7. Send notification

### Method 2: Direct API Testing
```javascript
fetch('http://localhost:3000/api/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d'
  },
  body: JSON.stringify({
    channel: 'push',
    userGroup: 'all',
    title: 'Test with Image',
    body: 'This notification has an image',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s',
    buttonText: 'Donate Now',
    buttonLink: '/home?paramamount=150'
  })
})
```

### Method 3: Browser Console Testing
Use the test script in `/public/test-image-url.js`:
```javascript
// Load this script in browser console on the notification page
// It will auto-fill test data and intercept API calls to show the payload
```

## Expected Behavior

### Frontend Preview
The notification preview should show:
- Title and body text
- Image placeholder with icon
- Button with the specified text
- Link type indicator (📱 for internal, 🌐 for external)

### Mobile App Behavior
The mobile app should receive:
- `data.imageUrl` - URL to display image
- `data.buttonText` - Text for the action button
- `data.buttonLink` - URL or path for button action

## Common Issues & Solutions

### Issue: Image not showing in preview
- **Cause**: Empty imageUrl field
- **Solution**: Ensure URL is entered and not just whitespace

### Issue: Image not received in mobile app
- **Cause**: Mobile app not reading `data.imageUrl`
- **Solution**: Verify mobile app is checking the correct data field

### Issue: Button not working
- **Cause**: Missing buttonText or buttonLink
- **Solution**: Both fields must be provided for button to appear

## Integration with Mobile App

The mobile app should handle the notification data structure:
```javascript
// In the mobile app notification handler
const { imageUrl, buttonText, buttonLink } = notification.data;

if (imageUrl) {
  // Display image in notification
}

if (buttonText && buttonLink) {
  // Show button with buttonText
  // Handle click with buttonLink (internal navigation or external URL)
}
```

## Summary

The Image URL feature is fully implemented and correctly passes through:
1. ✅ Frontend form field
2. ✅ Form validation and submission
3. ✅ API endpoint processing
4. ✅ Database storage
5. ✅ Push notification payload
6. ✅ Expo service delivery

The implementation matches your Postman example exactly, with the imageUrl, buttonText, and buttonLink all included in the `data` object of the push notification.
