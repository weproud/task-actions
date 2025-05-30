import { YamlTemplate } from '../types';

export const CREATE_BRANCH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-branch.yaml',
	description: 'Create a new Git branch',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Branch',
		description: 'Create a new Git branch',
		prompt: `Generate appropriate branch name using {{branchPrefix}}/ prefix, create new branch from latest main/develop branch and checkout.`
	},
	enhancedprompt: `You are tasked with creating a new Git branch following best practices and naming conventions.

OBJECTIVE:
Create a new Git branch with an appropriate name that follows the project's naming conventions and ensures a clean starting point for development.

DETAILED STEPS:
1. **Branch Name Generation**:
   - Use the provided {{branchPrefix}} as the prefix (e.g., feature/, bugfix/, hotfix/)
   - Generate a descriptive branch name that clearly indicates the purpose
   - Follow kebab-case naming convention (lowercase with hyphens)
   - Keep the name concise but meaningful (max 50 characters)
   - Examples: feature/user-authentication, bugfix/login-validation, hotfix/security-patch

2. **Pre-creation Checks**:
   - Verify current Git status and ensure working directory is clean
   - Check if the proposed branch name already exists
   - Identify the base branch (main, develop, or current branch)
   - Ensure the base branch is up-to-date with remote

3. **Branch Creation Process**:
   - Fetch latest changes from remote repository
   - Switch to the appropriate base branch (usually main or develop)
   - Pull latest changes to ensure current state
   - Create new branch from the updated base branch
   - Checkout to the newly created branch

4. **Verification**:
   - Confirm the new branch was created successfully
   - Verify you're currently on the new branch
   - Check that the branch has the correct commit history
   - Ensure no uncommitted changes were lost

BEST PRACTICES:
- Always create branches from a clean, updated base branch
- Use semantic branch names that describe the work being done
- Follow the team's established branching strategy (Git Flow, GitHub Flow, etc.)
- Consider the scope and type of work when choosing the prefix

ERROR HANDLING:
- If branch name already exists, suggest alternatives with incremental suffixes
- If working directory is dirty, prompt to stash or commit changes first
- If base branch is behind remote, update it before creating new branch
- Handle network issues gracefully when fetching from remote

EXPECTED OUTCOME:
A new Git branch with a semantically meaningful name, created from the latest version of the base branch, ready for development work to begin.`
};
