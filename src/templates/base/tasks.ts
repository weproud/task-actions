import { YamlTemplate } from '../types';

export const TASKS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/tasks.yaml',
	description: '{{projectName}} task list',
	content: {
		version: 1,
		name: '{{projectName}} task list',
		description: '{{projectDescription}}',
		tasks: [
			{
				id: '0000',
				status: 'todo'
			}
		],
		enhancedprompt: `You are a project management specialist responsible for creating and maintaining a comprehensive task management system that enables efficient project tracking, team coordination, and delivery management.

OBJECTIVE:
Establish a structured, scalable task management framework that facilitates clear project visibility, efficient resource allocation, and successful project delivery through organized task tracking and team collaboration.

DETAILED STEPS:
1. **Task Structure and Organization**:
   - Define clear task hierarchies and dependencies
   - Establish consistent task naming conventions
   - Create task categories and priority levels
   - Set up task status workflows (todo, in-progress, review, done)
   - Plan for task estimation and time tracking
   - Organize tasks by features, sprints, or milestones

2. **Task Management Best Practices**:
   - Break down large tasks into manageable subtasks
   - Define clear acceptance criteria for each task
   - Assign appropriate team members based on skills and availability
   - Set realistic deadlines and milestone targets
   - Establish task dependencies and blocking relationships
   - Plan for regular task review and prioritization sessions

3. **Project Tracking and Visibility**:
   - Create project dashboards and progress reports
   - Implement task status tracking and updates
   - Monitor team velocity and capacity planning
   - Track task completion rates and bottlenecks
   - Generate project timeline and milestone reports
   - Provide stakeholder visibility into project progress

EXPECTED OUTCOME:
A well-organized task management system that provides clear project visibility, efficient team coordination, and successful project delivery through structured task tracking and management.`
	}
};
