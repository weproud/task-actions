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
	},
	enhancedprompt: `You are responsible for completing task finalization with comprehensive validation, cleanup, documentation, and team communication to ensure proper project closure and knowledge transfer.

OBJECTIVE:
Execute thorough task completion procedures including validation, cleanup, testing, status updates, and team notifications to ensure high-quality deliverables and proper project closure.

DETAILED STEPS:
1. **Comprehensive Validation and Quality Assurance**:
   - Review all requirements and acceptance criteria for completeness
   - Verify that all functional requirements have been implemented correctly
   - Validate non-functional requirements (performance, security, usability)
   - Check that all edge cases and error scenarios are handled
   - Ensure code follows project standards and best practices
   - Validate that documentation is complete and accurate

2. **Code Quality and Cleanup**:
   - Remove any debug code, console.log statements, or temporary files
   - Refactor code for improved readability and maintainability
   - Ensure consistent code formatting and style guidelines
   - Optimize performance where applicable
   - Remove unused imports, variables, and functions
   - Update comments and inline documentation

3. **Comprehensive Testing Validation**:
   - Execute full test suite (unit, integration, end-to-end tests)
   - Verify test coverage meets project requirements
   - Perform manual testing of critical user journeys
   - Validate that all tests pass consistently
   - Check for any flaky or unstable tests
   - Document any known limitations or future improvements needed

4. **Documentation and Knowledge Transfer**:
   - Update technical documentation and API specifications
   - Create or update user documentation if applicable
   - Document any architectural decisions or trade-offs made
   - Update README files with new features or changes
   - Create deployment or configuration notes if needed
   - Document any dependencies or environment requirements

5. **Task Status Management**:
   - Update task status to 'done' in project management system
   - Add completion timestamp and final notes
   - Link to relevant pull requests, commits, or deployments
   - Update any related tickets or dependencies
   - Archive or organize task-related files and resources

6. **Team Communication and Notifications**:
   - Send completion notifications to relevant team members
   - Include summary of work completed and key achievements
   - Highlight any important changes or impacts
   - Provide links to relevant resources (PRs, documentation, demos)
   - Schedule knowledge sharing sessions if needed

NOTIFICATION SYSTEM:
- **Multi-Platform Support**: Send notifications to Slack, Discord, or other configured channels
- **Rich Content**: Include task details, completion summary, and relevant links
- **Error Handling**: Continue execution even if notification delivery fails
- **Customizable Templates**: Use appropriate formatting for each platform

QUALITY GATES:
- All tests must pass before marking task as complete
- Code review requirements must be satisfied
- Documentation must be updated and reviewed
- Security and performance requirements must be validated
- Deployment readiness must be confirmed

BEST PRACTICES:
- Perform thorough self-review before marking task complete
- Ensure all work is properly committed and pushed
- Verify that no breaking changes were introduced
- Check that all dependencies are properly managed
- Validate that the solution is production-ready
- Document any lessons learned or improvements for future tasks

COMMUNICATION TEMPLATES:
- **Success Notification**: Celebrate completion with key achievements
- **Summary Report**: Provide overview of work done and impact
- **Handover Notes**: Include information for maintenance and support
- **Demo Links**: Provide access to working features or prototypes
- **Next Steps**: Outline any follow-up work or recommendations

ERROR HANDLING:
- If validation fails, document issues and revert to in-progress status
- If tests fail, fix issues before attempting completion again
- If notifications fail, log errors but continue with task completion
- If documentation is incomplete, create tasks for follow-up work

EXPECTED OUTCOME:
Task marked as complete with all deliverables validated, code cleaned up, tests passing, documentation updated, and team properly notified of the successful completion with comprehensive summary and next steps.`
};
