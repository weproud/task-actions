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
\${SLACK_WEBHOOK_URL}`,
		enhancedprompt: `You are responsible for sending well-formatted, informative messages to Slack channels using webhooks, ensuring proper delivery, error handling, and team communication effectiveness.

OBJECTIVE:
Send clear, contextual messages to appropriate Slack channels with proper formatting, error handling, and delivery confirmation to facilitate effective team communication and notifications.

DETAILED STEPS:
1. **Environment and Configuration Validation**:
   - Verify SLACK_WEBHOOK_URL environment variable is set and valid
   - Validate webhook URL format and accessibility
   - Check network connectivity and firewall restrictions
   - Ensure proper authentication and permissions
   - Test webhook endpoint availability before sending

2. **Message Content Preparation**:
   - Determine appropriate message content based on context
   - Choose suitable message format (plain text, markdown, rich formatting)
   - Include relevant context and actionable information
   - Add timestamps, user mentions, or channel references as needed
   - Ensure message length is within Slack limits (40,000 characters)

3. **Message Structure and Formatting**:
   - **Basic Message**: Simple text with optional formatting
   - **Rich Message**: Attachments, blocks, and interactive elements
   - **Threaded Message**: Replies to existing conversations
   - **Scheduled Message**: Time-delayed delivery
   - **Ephemeral Message**: Visible only to specific users

4. **Advanced Message Features**:
   - **Mentions**: @user, @channel, @here for notifications
   - **Formatting**: Bold, italic, code blocks, lists
   - **Links**: URLs, deep links to applications
   - **Emojis**: Custom and standard emoji support
   - **Attachments**: Files, images, and rich media
   - **Interactive Elements**: Buttons, dropdowns, date pickers

5. **Message Delivery Process**:
   - Construct proper JSON payload according to Slack API specifications
   - Set appropriate HTTP headers (Content-Type: application/json)
   - Send POST request to webhook URL with retry logic
   - Handle rate limiting and throttling appropriately
   - Monitor delivery status and response codes

6. **Error Handling and Validation**:
   - Validate message payload before sending
   - Handle network timeouts and connection failures
   - Process Slack API error responses appropriately
   - Implement retry logic for transient failures
   - Log errors with sufficient context for debugging

BEST PRACTICES:
- Use clear, concise language appropriate for the audience
- Include relevant context and actionable information
- Avoid spamming channels with excessive notifications
- Use threading for related messages to reduce noise
- Choose appropriate channels based on message importance
- Include links to relevant resources or documentation
- Use consistent formatting and tone across messages

MESSAGE TYPES AND TEMPLATES:
- **Status Updates**: Project progress, deployment status, build results
- **Alerts**: Error notifications, system issues, security concerns
- **Announcements**: Feature releases, policy changes, team updates
- **Reminders**: Meeting notifications, deadline alerts, task assignments
- **Reports**: Daily summaries, metrics, performance data

SLACK-SPECIFIC CONSIDERATIONS:
- **Channel Selection**: Public channels, private groups, direct messages
- **Permissions**: Ensure bot has permission to post in target channels
- **Rate Limits**: Respect Slack's rate limiting (1 message per second per webhook)
- **Message Threading**: Use thread_ts for replies to existing messages
- **Workspace Limits**: Consider workspace message retention policies

SECURITY AND PRIVACY:
- Never include sensitive information in messages
- Validate and sanitize user input before sending
- Use secure webhook URLs (HTTPS only)
- Rotate webhook URLs periodically for security
- Follow organization's data sharing policies
- Be mindful of channel visibility and membership

MONITORING AND ANALYTICS:
- Track message delivery success rates
- Monitor webhook response times and failures
- Log message content for audit purposes (if required)
- Analyze engagement and response patterns
- Set up alerts for webhook failures or issues

INTEGRATION PATTERNS:
- **CI/CD Notifications**: Build status, deployment results
- **Monitoring Alerts**: System health, performance issues
- **Task Management**: Project updates, milestone achievements
- **Team Communication**: Daily standups, retrospectives
- **Customer Support**: Ticket updates, escalations

ERROR SCENARIOS AND SOLUTIONS:
- **Invalid Webhook URL**: Verify URL format and accessibility
- **Network Issues**: Implement exponential backoff retry logic
- **Rate Limiting**: Queue messages and respect rate limits
- **Message Too Large**: Split large messages or use attachments
- **Channel Not Found**: Verify channel exists and bot has access
- **Authentication Failure**: Check webhook URL and permissions

EXPECTED OUTCOME:
Successful delivery of well-formatted, contextually appropriate messages to the target Slack channel with proper error handling, delivery confirmation, and effective team communication facilitation.`
	}
};
