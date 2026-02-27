# Enhanced Notification System Documentation

## Overview

We have successfully enhanced the web notification sending feature to support the new mobile app capabilities. The system now supports:

1. **Image URLs** in push notifications
2. **Custom button text and redirection links**
3. **In-app navigation** and **external URLs**
4. **Automatic push token mapping** from the PushTokens collection

## Key Features

### 1. Enhanced Push Notification Data Structure

The mobile app now receives notifications with the following enhanced data structure:

```json
{
  "to": "ExponentPushToken[2275-JAW0mhT2OpkEmCNLI]",
  "title": "Your Notification Title",
  "body": "Your Notification Body", 
  "data": {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s",
    "buttonText": "Donate Now",
    "buttonLink": "/home?paramamount=150"
  }
}
```

### 2. Push Token Management

The system automatically fetches push tokens from the following collections based on user groups:

- **All Users**: `PushTokens` collection
- **Subscribers**: `SubscriberTokens` collection  
- **Box Holders**: `BoxHoldersTokens` collection
- **Custom**: User-provided token list

### 3. Link Types Supported

#### Internal App Navigation
- `/home?paramamount=150` - Home screen with donation amount
- `/campaigns?campaignId=685e9bd8bc5c3adcb650336d` - Specific campaign
- `/sponsorship` - Sponsorship page

#### External URLs
- `https://www.youtube.com/live/R7pkey0Rokk?si=hxpsyuavHEIZWtdj` - YouTube live streams
- Any external website URL

## Implementation Details

### Web UI Enhancements

1. **Custom Button Configuration Section**
   - Button text input field
   - Link type selector (Internal/External)
   - Button link input with contextual placeholders
   - Quick template buttons for common use cases

2. **Quick Templates**
   - 💰 Donation: Sets up donation link with amount parameter
   - 📺 YouTube Live: Configures external YouTube link
   - 🎯 Campaign: Sets up campaign navigation with ID parameter
   - 🤝 Sponsorship: Links to sponsorship page

3. **Enhanced Preview**
   - Shows button in notification preview
   - Displays link type and destination
   - Real-time preview updates

### API Enhancements

#### Request Payload
```json
{
  "channel": "push",
  "userGroup": "all",
  "title": "Your Notification Title",
  "body": "Your Notification Body",
  "imageUrl": "https://example.com/image.jpg",
  "buttonText": "Action Button",
  "buttonLink": "/path/or/url"
}
```

#### Database Schema Updates

**NotificationHistory Model:**
```javascript
{
  // ... existing fields
  buttonText: { type: String },
  buttonLink: { type: String }
}
```

**NotificationTemplate Model:**
```javascript
{
  // ... existing fields  
  buttonText: { type: String },
  buttonLink: { type: String }
}
```

## Usage Examples

### 1. Home Screen Payment Donation
```json
{
  "channel": "push",
  "userGroup": "all", 
  "title": "Support Our Cause",
  "body": "Your donation can make a difference",
  "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s",
  "buttonText": "Donate Now",
  "buttonLink": "/home?paramamount=150"
}
```

### 2. Sponsorship Payment
```json
{
  "channel": "push",
  "userGroup": "all",
  "title": "Become a Sponsor", 
  "body": "Join our sponsorship program",
  "imageUrl": "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
  "buttonText": "Sponsor Now",
  "buttonLink": "/sponsorship"
}
```

### 3. Campaign with ID
```json
{
  "channel": "push",
  "userGroup": "all",
  "title": "Join Our Campaign",
  "body": "Be part of our latest campaign", 
  "imageUrl": "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
  "buttonText": "Campaign Now", 
  "buttonLink": "/campaigns?campaignId=685e9bd8bc5c3adcb650336d"
}
```

### 4. YouTube Live Stream
```json
{
  "channel": "push",
  "userGroup": "all",
  "title": "🔴 Live Now",
  "body": "Join us for our live session",
  "imageUrl": "https://play-lh.googleusercontent.com/_bL4518QFL_ryv813EGZ3Ft6B7f7E_6psQiN1Rp3YePDjw3p0zsjJ-5i-8UaSUwt2RoB",
  "buttonText": "Watch Live",
  "buttonLink": "https://www.youtube.com/live/R7pkey0Rokk?si=hxpsyuavHEIZWtdj"
}
```

## API Endpoints

### Send Notification
- **POST** `https://exp.host/--/api/v2/push/send`
- **Headers**: 
  - `Content-Type: application/json`
  - `Accept: application/json`

### Local API  
- **POST** `/api/notifications/send`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: 9a4f2c8d7e1b5f3a9c2d8e7f1b4a5c3d`

## Testing

Use the provided test script to validate the enhanced functionality:

```bash
# Run all tests
node test-enhanced-notifications.js

# Check user counts only
node test-enhanced-notifications.js --counts

# Run specific test
node test-enhanced-notifications.js --test "YouTube Live Stream"

# Show help
node test-enhanced-notifications.js --help
```

## File Changes Summary

### Frontend Changes
- `src/app/admin/(admin)/notifications/send-notifications/page.tsx`
  - Added button configuration UI
  - Enhanced preview functionality
  - Added quick template buttons
  - Updated form submission logic

### Backend Changes
- `src/app/api/notifications/send/route.js`
  - Enhanced message data structure
  - Added button field support
  - Updated push notification payload

### Database Changes
- `src/models/notificationHistory.ts`
  - Added buttonText and buttonLink fields
- `src/models/notificationTemplate.ts` 
  - Added buttonText and buttonLink fields

## Mobile App Compatibility

The enhanced data structure is fully compatible with the mobile app's new features:

1. **Image Display**: `data.imageUrl` provides the image URL
2. **Custom Button**: `data.buttonText` sets the button label
3. **Navigation**: `data.buttonLink` handles both in-app and external navigation

The mobile app can distinguish between internal and external links by checking if the URL starts with `http` or `https` for external links, or starts with `/` for internal navigation.

## Security Considerations

1. **API Key Protection**: All notification endpoints require a valid API key
2. **Input Validation**: Button links are validated for proper format
3. **Token Validation**: Only valid Expo push tokens are processed
4. **Rate Limiting**: Consider implementing rate limiting for notification endpoints

## Future Enhancements

1. **Rich Media Support**: Support for video thumbnails and GIFs
2. **Advanced Scheduling**: Recurring notifications and timezone-aware scheduling
3. **A/B Testing**: Support for testing different notification variants
4. **Analytics**: Click-through rates and engagement metrics
5. **Template Variables**: Dynamic content replacement in templates

## Troubleshooting

### Common Issues

1. **No tokens found**: Check if PushTokens collection has valid entries
2. **Invalid token format**: Ensure tokens follow Expo format: `ExponentPushToken[...]`
3. **Button not appearing**: Verify buttonText is provided (buttonLink is optional)
4. **External links not opening**: Ensure URL includes protocol (http/https)

### Debug Tools

Use the browser developer tools to inspect notification payloads and check the server logs for detailed error messages.

## Support

For issues or questions about the enhanced notification system, check:
1. Server logs for detailed error messages
2. Browser developer tools for frontend issues  
3. Test script output for API validation
4. Database collections for token and user data
