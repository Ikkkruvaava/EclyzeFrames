// Simple test to verify Image URL is correctly passed
// Copy and paste this into your browser console when on the notification page

console.log("🧪 Testing Image URL Handling...");

// Test 1: Check if imageUrl field is in the form
const imageUrlField = document.getElementById('customImageUrl');
if (imageUrlField) {
  console.log("✅ Image URL field found in form");
  console.log("Current value:", imageUrlField.value);
} else {
  console.log("❌ Image URL field NOT found in form");
}

// Test 2: Fill in test data and check form submission
function fillTestData() {
  const titleField = document.getElementById('customTitle');
  const bodyField = document.getElementById('customBody');
  const imageField = document.getElementById('customImageUrl');
  const buttonTextField = document.getElementById('customButtonText');
  const buttonLinkField = document.getElementById('customButtonLink');
  
  if (titleField) titleField.value = "Test Notification";
  if (bodyField) bodyField.value = "This is a test notification with image";
  if (imageField) imageField.value = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eu_5aioLs4iBkWDF4iaCdtNZxgybaqz0jA&s";
  if (buttonTextField) buttonTextField.value = "Donate Now";
  if (buttonLinkField) buttonLinkField.value = "/home?paramamount=150";
  
  console.log("✅ Test data filled in form");
}

// Test 3: Intercept form submission to check payload
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0] && args[0].includes('/api/notifications/send')) {
    console.log("🚀 Intercepted notification API call");
    console.log("URL:", args[0]);
    
    if (args[1] && args[1].body) {
      try {
        const payload = JSON.parse(args[1].body);
        console.log("📦 Payload:", payload);
        
        if (payload.imageUrl) {
          console.log("✅ Image URL in payload:", payload.imageUrl);
        } else {
          console.log("❌ No image URL in payload");
        }
        
        if (payload.buttonText) {
          console.log("✅ Button Text in payload:", payload.buttonText);
        }
        
        if (payload.buttonLink) {
          console.log("✅ Button Link in payload:", payload.buttonLink);
        }
      } catch (e) {
        console.log("❌ Could not parse payload:", e);
      }
    }
  }
  
  return originalFetch.apply(this, args);
};

console.log("🔧 Fetch interceptor installed");
console.log("📋 Run fillTestData() to fill form with test data");
console.log("📨 Then submit the form to see the payload");

// Auto-fill test data
fillTestData();
