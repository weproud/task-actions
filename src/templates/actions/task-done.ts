import { YamlTemplate } from '../types';

export const TASK_DONE_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/task-done.yaml',
	description: 'Perform task completion processing and cleanup work',
	content: {
		version: 1,
		kind: 'action',
		name: 'Task Done',
		description: 'Perform task completion processing and cleanup work',
		prompt: `Perform task completion processing.

Please perform the following steps:
1. Verify and validate requirement implementation
2. Code cleanup and refactoring
3. Execute and verify tests
4. Change task status to 'done'
5. Send completion notification to team

Notification sending:
- If SLACK_WEBHOOK_URL environment variable is set, send task completion notification to Slack
- If DISCORD_WEBHOOK_URL environment variable is set, send task completion notification to Discord
- Include task ID, task name, and project information in the notification
- Display error and continue even if sending fails

Slack notification message example:
{
  "text": "✅ Task Completed!",
  "username": "Task Actions Bot",
  "icon_emoji": ":white_check_mark:",
  "attachments": [
    {
      "color": "good",
      "title": "Task Information",
      "fields": [
        {
          "title": "Task ID",
          "value": "TASK-001",
          "short": true
        },
        {
          "title": "Task Name",
          "value": "User Authentication Feature Implementation",
          "short": true
        }
      ]
    }
  ]
}

Discord notification message example:
{
  "content": "✅ Task Completed!",
  "username": "Task Actions Bot",
  "embeds": [
    {
      "color": 65280,
      "title": "Task Information",
      "fields": [
        {
          "name": "Task ID",
          "value": "TASK-001",
          "inline": true
        },
        {
          "name": "Task Name",
          "value": "User Authentication Feature Implementation",
          "inline": true
        }
      ]
    }
  ]
}`
	}
};
