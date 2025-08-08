import { Filter } from "bad-words";

const filter = new Filter();

interface MessageInput {
  senderId: string;
  content: string;
}

interface ModerationEvent {
  arguments: {
    input: MessageInput;
  };
  identity: {
    sub: string;
  };
}

interface ModeratedMessage extends MessageInput {
  timestamp: string;
}

exports.handler = async (event: ModerationEvent): Promise<ModeratedMessage> => {
  console.log("Moderation event:", JSON.stringify(event, null, 2));

  const input: MessageInput = event.arguments.input;
  const requesterId: string = event.identity.sub;

  // Security: Sender must match authenticated user
  if (input.senderId !== requesterId) {
    throw new Error("Sender ID does not match authenticated user.");
  }

  // Length validation
  if (input.content && input.content.length > 2000) {
    throw new Error("Message exceeds maximum length (2000 characters).");
  }

  // No links or file references
  if (/https?:\/\//i.test(input.content) || /www\./i.test(input.content) || /\.(jpg|jpeg|png|gif|pdf|docx?|mp4|zip|rar)$/i.test(input.content)) {
    throw new Error("Links and file references are not allowed.");
  }

  // Profanity filter
  if (filter.isProfane(input.content)) {
    throw new Error("Message contains inappropriate language.");
  }

  // Sanitize: remove HTML tags and angle brackets
  const safeContent: string = input.content
    .replace(/<[^>]*>?/gm, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();

  // Check if content is empty after sanitization
  if (!safeContent || safeContent.length === 0) {
    throw new Error("Message is empty after content filtering.");
  }

  // Return sanitized input back to pipeline
  return {
    ...input,
    content: safeContent,
    timestamp: new Date().toISOString(), // Ensure server-controlled timestamp
  };
};
