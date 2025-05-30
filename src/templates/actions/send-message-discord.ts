import { YamlTemplate } from '../types';

export const SEND_MESSAGE_DISCORD_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/send-message-discord.yaml',
	description: 'Send message to Discord channel',
	content: {
		version: 1,
		kind: 'action',
		name: 'Send Message to Discord',
		description: 'Send message to Discord channel',
		prompt: `Send message to Discord channel.

The following information is required:
- Discord webhook URL set in DISCORD_WEBHOOK_URL environment variable
- Message content to send
- Optional: Message format (plain text, embed, etc.)

Please perform the following steps:
1. Check DISCORD_WEBHOOK_URL from environment variables
2. Prepare message format and content
3. Send message to Discord webhook via HTTP POST request
4. Check sending result and handle errors

If DISCORD_WEBHOOK_URL environment variable is not set, request user to configure it.

Example message format:
{
  "content": "Message content",
  "username": "Bot",
  "embeds": [
    {
      "title": "Title",
      "description": "Description",
      "color": 16711680,
      "fields": [
        {
          "name": "Field name",
          "value": "Field value",
          "inline": true
        }
      ]
    }
  ]
}

curl example:
curl -X POST -H 'Content-type: application/json' \\
--data '{"content":"Hello, World!"}' \\
\${DISCORD_WEBHOOK_URL}`
	},
	enhancedprompt: `You are responsible for sending engaging, well-formatted messages to Discord channels using webhooks, ensuring proper delivery, rich formatting, and effective community communication.

OBJECTIVE:
Send visually appealing, contextually appropriate messages to Discord channels with rich embeds, proper formatting, error handling, and delivery confirmation to enhance community engagement and notifications.

DETAILED STEPS:
1. **Environment and Configuration Validation**:
   - Verify DISCORD_WEBHOOK_URL environment variable is set and valid
   - Validate webhook URL format and Discord server accessibility
   - Check network connectivity and firewall restrictions
   - Ensure webhook permissions and channel access
   - Test webhook endpoint availability before sending

2. **Message Content Strategy**:
   - Determine appropriate message type (simple text, rich embed, file attachment)
   - Choose suitable formatting based on content importance and audience
   - Include relevant context, links, and actionable information
   - Consider message length limits (2000 characters for content, 6000 for embeds)
   - Plan for multimedia content (images, videos, files)

3. **Message Structure Options**:
   - **Simple Message**: Plain text with basic formatting
   - **Rich Embed**: Structured content with title, description, fields, colors
   - **File Attachment**: Documents, images, or other media files
   - **Combined Message**: Text content with embeds and attachments
   - **Interactive Message**: Buttons and components (requires bot application)

4. **Discord Embed Features**:
   - **Title and Description**: Main content with markdown support
   - **Color Coding**: Visual categorization using hex colors
   - **Fields**: Structured data with inline/block layout options
   - **Thumbnails and Images**: Visual enhancement with media
   - **Footer**: Additional context, timestamps, or branding
   - **Author**: Attribution with name, icon, and links

5. **Message Delivery Process**:
   - Construct proper JSON payload according to Discord webhook API
   - Set appropriate HTTP headers (Content-Type: application/json)
   - Handle file uploads with multipart/form-data when needed
   - Send POST request with retry logic and rate limiting
   - Monitor delivery status and Discord API responses

BEST PRACTICES:
- Use embeds for structured, important information
- Choose appropriate colors for different message types (green for success, red for errors)
- Keep content concise and scannable with proper formatting
- Use fields for organized data presentation
- Include relevant links and references
- Respect Discord's rate limits and community guidelines
- Test messages in development channels before production use

EXPECTED OUTCOME:
Successful delivery of visually appealing, well-structured messages to the target Discord channel with proper formatting, error handling, and enhanced community engagement through rich content presentation.`
};
