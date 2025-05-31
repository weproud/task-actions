import { YamlTemplate } from '../types';

export const CREATE_PULL_REQUEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-pull-request.yaml',
	description: 'Create Pull Request on GitHub',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Pull Request',
		description: 'Create Pull Request for completed feature development',
		prompt: `Write PR with clear title and description, set appropriate reviewers and labels to create Pull Request.`,
		enhancedprompt: `You are tasked with creating a comprehensive and professional Pull Request that facilitates effective code review and project collaboration.

OBJECTIVE:
Create a well-structured Pull Request with clear documentation, appropriate metadata, and proper workflow integration to ensure smooth code review and merge process.

DETAILED STEPS:
1. **Pre-PR Validation**:
   - Ensure all changes are committed and pushed to the feature branch
   - Verify that all tests pass locally
   - Check that the branch is up-to-date with the target branch
   - Confirm no merge conflicts exist
   - Validate that CI/CD pipelines are passing

2. **PR Title Creation**:
   - Write a concise, descriptive title (max 72 characters)
   - Use conventional commit format if applicable (feat:, fix:, docs:, etc.)
   - Include ticket/issue number if relevant
   - Examples: "feat: Add user authentication system (#123)", "fix: Resolve login validation bug"

3. **PR Description Structure**:
   - **Summary**: Brief overview of what was changed and why
   - **Changes Made**: Bullet-point list of specific modifications
   - **Testing**: Description of testing performed (unit, integration, manual)
   - **Screenshots/Videos**: Visual evidence for UI changes
   - **Breaking Changes**: Any backwards-incompatible modifications
   - **Related Issues**: Link to relevant tickets or issues
   - **Checklist**: Standard items like tests added, docs updated, etc.

4. **Metadata Configuration**:
   - **Target Branch**: Usually main, develop, or release branch
   - **Reviewers**: Select appropriate team members based on code areas
   - **Assignees**: Typically the PR author
   - **Labels**: Apply relevant tags (feature, bugfix, documentation, etc.)
   - **Milestone**: Link to current sprint or release if applicable
   - **Projects**: Associate with relevant project boards

5. **Review Preparation**:
   - Self-review the diff to catch obvious issues
   - Add inline comments for complex logic or decisions
   - Ensure sensitive information is not exposed
   - Verify that only intended files are included

BEST PRACTICES:
- Keep PRs focused and reasonably sized (< 400 lines when possible)
- Write clear, actionable descriptions that help reviewers understand context
- Include both what changed and why it changed
- Use draft PRs for work-in-progress to get early feedback
- Link to relevant documentation or design decisions
- Follow the team's PR template if one exists

ERROR HANDLING:
- If CI checks fail, fix issues before requesting review
- If merge conflicts arise, resolve them promptly
- If reviewers request changes, address them systematically
- If PR becomes stale, rebase or close if no longer relevant

QUALITY CHECKS:
- Ensure code follows project style guidelines
- Verify all new code has appropriate test coverage
- Check that documentation is updated for public APIs
- Confirm no debug code or temporary changes remain
- Validate that performance implications are considered

EXPECTED OUTCOME:
A professional, well-documented Pull Request that clearly communicates the changes, facilitates effective review, and integrates smoothly into the project workflow.`
	}
};
