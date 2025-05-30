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
	}
};
