import { YamlTemplate } from '../types';

export const SEND_MESSAGE_SLACK_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/send-message-slack.yaml',
	description: 'Send message to Slack channel',
	content: {
		version: 1,
		kind: 'action',
		name: 'Send Message to Slack',
		description: 'Send message to Slack channel',
		prompt: `Send message to Slack channel.

The following information is required:
- Slack webhook URL set in SLACK_WEBHOOK_URL environment variable
- Message content to send
- Optional: Message format (plain text, markdown, JSON, etc.)

Please perform the following steps:
1. Check SLACK_WEBHOOK_URL from environment variables
2. Prepare message format and content
3. Send message to Slack webhook via HTTP POST request
4. Check sending result and handle errors

If SLACK_WEBHOOK_URL environment variable is not set, request user to configure it.

Example message format:
{
  "text": "Message content",
  "channel": "#general",
  "username": "Bot",
  "icon_emoji": ":robot_face:"
}

curl example:
curl -X POST -H 'Content-type: application/json' \\
--data '{"text":"Hello, World!"}' \\
\${SLACK_WEBHOOK_URL}`
	}
};
