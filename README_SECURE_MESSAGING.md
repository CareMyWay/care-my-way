# Secure Messaging System - Complete Implementation Guide

## 🚀 Quick Setup

This implementation follows the Amplify Gen 2 pipeline resolver pattern for secure message moderation.

### 1. Install Dependencies

```bash
# In your main project directory
cd amplify/functions/message-moderation
npm install

# Back to root
cd ../../..
```

### 2. Deploy to AWS

```bash
# For development
npx amplify sandbox

# For production
npx amplify deploy
```

## 📁 File Structure

```
amplify/
├── functions/
│   └── message-moderation/
│       ├── handler.ts          # Moderation Lambda (preProcess)
│       ├── package.json        # Dependencies (bad-words)
│       ├── resource.ts         # Amplify function definition
│       └── tsconfig.json       # TypeScript config
├── data/
│   └── resource.ts             # Updated schema with Message model
└── backend.ts                  # Main backend config

src/
├── services/
│   └── messageService.ts       # Frontend service layer
└── components/
    └── messaging/
        └── ChatInterface.tsx   # React chat component
```

## 🔒 Security Features Implemented

### Server-Side Moderation (Lambda Pipeline)

✅ **Identity Verification**: `senderId` must match authenticated user  
✅ **Content Length**: 2000 character limit  
✅ **URL Blocking**: No links, domains, or file references  
✅ **Profanity Filter**: Uses `bad-words` library  
✅ **HTML Sanitization**: Removes all HTML tags and brackets  
✅ **Empty Content Check**: Prevents empty messages after filtering

### Client-Side Validation

✅ **Pre-flight Checks**: Length and URL validation before API call  
✅ **Real-time Character Count**: Visual feedback  
✅ **Error Handling**: User-friendly error messages

### Authorization Rules

✅ **Sender Ownership**: Only message senders can delete their messages  
✅ **Authenticated Read**: Authenticated users can read messages  
✅ **Admin Access**: Full CRUD for moderation

## 🛠 Usage Examples

### Basic Message Sending

```tsx
import { MessageService } from "@/services/messageService";

// Send a message
try {
  const message = await MessageService.sendMessage({
    bookingId: "booking_123",
    recipientId: "user_456",
    recipientName: "Dr. Smith",
    content: "Hi, I'll be 5 minutes late to our appointment.",
  });

  console.log("Message sent:", message.id);
} catch (error) {
  // Handle moderation errors
  alert(error.message); // "Message contains inappropriate language."
}
```

### Loading Chat History

```tsx
const messages = await MessageService.getMessagesForBooking("booking_123");
```

### Complete Chat Interface

```tsx
import { ChatInterface } from "@/components/messaging/ChatInterface";

function BookingChatPage({ booking }) {
  return (
    <ChatInterface
      bookingId={booking.id}
      recipientId={booking.providerId}
      recipientName={booking.providerName}
      className="h-96 border rounded-lg"
    />
  );
}
```

## 🔍 Testing the Security

### Test Cases to Run

1. **Length Limit**:

   ```tsx
   // Should fail with "exceeds maximum length"
   await MessageService.sendMessage({
     content: "a".repeat(2001), // > 2000 chars
     // ... other props
   });
   ```

2. **URL Blocking**:

   ```tsx
   // All should fail with "Links and file references are not allowed"
   await MessageService.sendMessage({
     content: "Check out https://example.com",
   });
   await MessageService.sendMessage({ content: "Visit www.google.com" });
   await MessageService.sendMessage({
     content: "See document.pdf for details",
   });
   ```

3. **HTML Sanitization**:

   ```tsx
   // Should pass but HTML gets stripped
   const result = await MessageService.sendMessage({
     content: "Hello <b>world</b> <script>alert('xss')</script>",
   });
   console.log(result.content); // "Hello world "
   ```

4. **Profanity Filter**:

   ```tsx
   // Should fail with "inappropriate language"
   await MessageService.sendMessage({ content: "This is damn good!" });
   ```

5. **Identity Verification**:
   ```tsx
   // Should fail with "Sender ID does not match authenticated user"
   await MessageService.sendMessage({
     senderId: "different_user_id", // Wrong sender ID
     content: "Hello",
   });
   ```

## 🎛 Error Messages Reference

| Error                                                 | Trigger                     | User Action              |
| ----------------------------------------------------- | --------------------------- | ------------------------ |
| `"Message exceeds maximum length (2000 characters)."` | Content > 2000 chars        | Shorten message          |
| `"Links and file references are not allowed."`        | URLs, www., file extensions | Remove links             |
| `"Message contains inappropriate language."`          | Profanity detected          | Use appropriate language |
| `"Sender ID does not match authenticated user."`      | Identity mismatch           | Re-authenticate          |
| `"Message is empty after content filtering."`         | Only HTML/filtered content  | Add actual text content  |

## 🚀 Production Enhancements

### 1. Enhanced Profanity Filter

Replace basic filter with context-aware service:

```bash
npm install @google-cloud/language
```

```typescript
// In handler.ts
import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient();
const [result] = await client.analyzeSentiment({
  document: { content, type: "PLAIN_TEXT" },
});

if (result.documentSentiment.score < -0.5) {
  throw new Error("Message tone is too negative");
}
```

### 2. Rate Limiting

Add DynamoDB rate limiting:

```typescript
// Check message count per user per minute
const recentMessages = await docClient.query({
  TableName: "Messages",
  KeyConditionExpression: "senderId = :senderId",
  FilterExpression: "#timestamp > :oneMinuteAgo",
  ExpressionAttributeNames: { "#timestamp": "timestamp" },
  ExpressionAttributeValues: {
    ":senderId": senderId,
    ":oneMinuteAgo": new Date(Date.now() - 60000).toISOString(),
  },
});

if (recentMessages.Items.length > 10) {
  throw new Error(
    "Rate limit exceeded. Please wait before sending another message."
  );
}
```

### 3. Real-time Subscriptions

```typescript
// In MessageService.ts
static subscribeToMessages(bookingId: string, onMessage: (msg: MessageData) => void) {
  return client.models.Message.onCreate({
    filter: { bookingId: { eq: bookingId } }
  }).subscribe({
    next: ({ data }) => onMessage(data),
    error: (err) => console.error('Subscription error:', err)
  });
}
```

## 📊 Monitoring & Logging

### CloudWatch Metrics to Track

- **Lambda Duration**: Moderation processing time
- **Error Rate**: Failed moderation attempts
- **Message Volume**: Messages per minute/hour
- **Filter Hits**: Which filters are triggered most

### Log Analysis

```bash
# Search for moderation failures
aws logs filter-log-events \
  --log-group-name /aws/lambda/messageModeration \
  --filter-pattern "ERROR"

# Count profanity blocks
aws logs filter-log-events \
  --log-group-name /aws/lambda/messageModeration \
  --filter-pattern "inappropriate language"
```

## 🔧 Troubleshooting

### Common Issues

1. **Lambda Timeout**: Increase timeout in `resource.ts`:

   ```typescript
   export const messageModerationFunction = defineFunction({
     entry: "./handler.ts",
     timeout: 30, // seconds
   });
   ```

2. **Missing Dependencies**: Ensure `bad-words` is installed in Lambda:

   ```bash
   cd amplify/functions/message-moderation
   npm install bad-words
   ```

3. **Authorization Errors**: Check Cognito user groups and IAM policies

4. **Type Errors**: Amplify Gen 2 types may need casting:
   ```typescript
   const result = await client.models.Message.create(input);
   const message = result.data as unknown as MessageData;
   ```

## 🎯 Deployment Checklist

- [ ] Install `bad-words` dependency in Lambda
- [ ] Deploy backend with `npx amplify sandbox`
- [ ] Test message creation in console
- [ ] Verify moderation blocks inappropriate content
- [ ] Test frontend chat interface
- [ ] Monitor CloudWatch logs for errors
- [ ] Set up production monitoring/alerts

## 🔐 Security Audit

Run these commands to verify security:

```bash
# Check no hardcoded secrets
grep -r "password\|secret\|key" amplify/functions/

# Verify HTTPS only
grep -r "http://" src/ # Should find no insecure links

# Check for console.log in production
grep -r "console.log" src/ # Remove or replace with proper logging
```

This implementation provides enterprise-grade message security with no file uploads, comprehensive content filtering, and proper authentication/authorization controls.
