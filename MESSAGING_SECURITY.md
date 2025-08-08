# Secure Messaging System Implementation

## Overview

This implementation provides a secure, moderated messaging system for Care My Way that enforces the following security policies:

- **No file attachments or uploads** - Content is plain text only
- **Profanity filtering** - Inappropriate language is blocked
- **URL/link blocking** - Prevents sharing of external content
- **HTML sanitization** - Removes HTML tags and potential XSS content
- **Authentication** - Only authenticated participants can send/receive messages
- **Authorization** - Users can only message within valid booking contexts

## Architecture

### Backend Components

1. **Enhanced Message Schema** (`amplify/data/resource.ts`)
   - Added moderation fields: `isModerated`, `moderationFlags`
   - Updated authorization rules for secure access
   - Added custom `sendMessage` mutation

2. **Message Moderation Lambda** (`amplify/functions/message-moderation/`)
   - Pre-processes all messages before storage
   - Validates sender identity and booking relationship
   - Applies content filtering and sanitization
   - Blocks inappropriate content with detailed error messages

3. **Backend Configuration** (`amplify/backend.ts`)
   - Integrates moderation function with the data layer

### Frontend Components

1. **MessageService** (`src/services/messageService.ts`)
   - Secure API wrapper for message operations
   - Client-side validation before server calls
   - Real-time subscription support (conceptual)
   - Error handling with user-friendly messages

2. **ChatInterface Component** (`src/components/messaging/ChatInterface.tsx`)
   - Complete chat UI with security features
   - Character limit enforcement (2000 chars)
   - Real-time message updates
   - Visual feedback for moderated content

## Security Features

### Content Moderation Pipeline

1. **Client-side pre-validation**:
   - Length limits (2000 characters)
   - Basic URL detection
   - Empty content prevention

2. **Server-side Lambda validation**:
   - Identity verification (sender must match authenticated user)
   - Booking relationship validation
   - Profanity filtering
   - HTML/script tag removal
   - URL/link blocking
   - Content sanitization

3. **Storage**:
   - Only approved, sanitized content is stored
   - Moderation flags track what was filtered
   - Timestamps and metadata are server-controlled

### Authorization Rules

- **Message Creation**: Only authenticated users via custom mutation
- **Message Reading**: Senders and recipients only (not enforced at DB level due to Amplify limitations)
- **Message Deletion**: Only message senders
- **Admin Access**: Full CRUD for moderation purposes

## Usage Examples

### Sending a Message

```typescript
import { MessageService } from "@/services/messageService";

try {
  const message = await MessageService.sendMessage({
    bookingId: "booking_123",
    recipientId: "user_456",
    recipientName: "John Doe",
    content: "Hello, I'll be there at 3 PM today.",
  });
  console.log("Message sent:", message.id);
} catch (error) {
  // Handle moderation errors
  if (error.message.includes("inappropriate language")) {
    alert("Please use appropriate language in your messages.");
  } else if (error.message.includes("Links")) {
    alert("Links are not allowed in messages.");
  } else {
    alert("Failed to send message. Please try again.");
  }
}
```

### Loading Messages for a Booking

```typescript
const messages = await MessageService.getMessagesForBooking("booking_123");
```

### Using the Chat Component

```tsx
import { ChatInterface } from "@/components/messaging/ChatInterface";

function BookingPage({ booking }) {
  return (
    <div>
      <h2>Booking Details</h2>
      {/* Other booking content */}

      <ChatInterface
        bookingId={booking.id}
        recipientId={booking.providerId}
        recipientName={booking.providerName}
        className="mt-6"
      />
    </div>
  );
}
```

## Deployment Steps

1. **Install Dependencies**:

   ```bash
   npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
   ```

2. **Deploy Backend**:

   ```bash
   npx amplify sandbox  # For development
   # or
   npx amplify deploy   # For production
   ```

3. **Update Environment Variables**:
   The Lambda function needs access to DynamoDB tables. These are automatically configured through the Amplify resource definitions.

## Customization Options

### Enhanced Profanity Filtering

Replace the simple word list with a more sophisticated library:

```bash
npm install bad-words
```

```typescript
import Filter from "bad-words";
const filter = new Filter();

if (filter.isProfane(content)) {
  // Block or sanitize
}
```

### External Moderation Services

For advanced content moderation, integrate with services like:

- **Perspective API** (Google) - Toxicity scoring
- **AWS Comprehend** - Sentiment analysis
- **Azure Content Moderator** - Multi-language support

### Real-time Subscriptions

For production real-time messaging, implement proper GraphQL subscriptions:

```typescript
// Subscribe to new messages
const subscription = client.models.Message.onCreate({
  filter: { bookingId: { eq: bookingId } },
}).subscribe({
  next: (data) => {
    // Handle new message
    setMessages((prev) => [...prev, data]);
  },
});
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limits to prevent spam
2. **User Blocking**: Add functionality to block abusive users
3. **Message Retention**: Implement automatic message deletion after booking completion
4. **Audit Logging**: Log all moderation actions for compliance
5. **Admin Tools**: Build admin interface for reviewing flagged content

## Error Handling

The system provides specific error messages for different moderation failures:

- `"Message exceeds maximum length (2000 characters)"`
- `"Links and URLs are not allowed in messages"`
- `"Message contains inappropriate language"`
- `"Users are not valid participants in this booking"`
- `"Message is empty after content filtering"`

These can be used to provide helpful feedback to users about why their message was rejected.

## Testing

Test the moderation system with various inputs:

1. **Length limits**: Send messages over 2000 characters
2. **URLs**: Try sending links, email addresses, domain names
3. **HTML**: Send messages with HTML tags
4. **Profanity**: Test with inappropriate language
5. **Authorization**: Attempt to send messages for invalid bookings

## Performance Considerations

- Lambda cold start times may add latency to first message
- Consider provisioned concurrency for high-traffic periods
- Message list queries are filtered by bookingId for efficient retrieval
- DynamoDB secondary indexes support efficient querying patterns
