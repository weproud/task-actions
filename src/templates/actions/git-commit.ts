import { YamlTemplate } from '../types';

export const GIT_COMMIT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-commit.yaml',
	description: 'Commit changes to Git',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Commit',
		description: 'Commit changes to Git',
		prompt: `Check changed files, stage them, and execute commit with meaningful commit message (using conventions like feat:, fix:, docs:, etc.).
`,
		enhancedprompt: `You are responsible for creating well-structured, meaningful Git commits that follow conventional commit standards and provide clear project history for team collaboration and maintenance.

OBJECTIVE:
Create atomic, well-documented commits with descriptive messages that clearly communicate what changes were made and why, following conventional commit format and best practices.

DETAILED STEPS:
1. **Pre-Commit Review**:
   - Review all modified, added, and deleted files using git status
   - Examine the diff for each file to understand the changes
   - Ensure only intended changes are included
   - Remove any debug code, console.log statements, or temporary files
   - Verify no sensitive information (passwords, API keys) is included
   - Check that formatting and linting rules are followed

2. **Change Categorization**:
   - Group related changes that should be committed together
   - Separate unrelated changes into different commits
   - Identify the primary type of change (feature, bugfix, refactor, etc.)
   - Consider if changes should be split into multiple atomic commits
   - Ensure each commit represents a logical unit of work

3. **Staging Strategy**:
   - Use git add selectively for specific files or hunks
   - Stage related changes together for atomic commits
   - Use git add -p for partial staging when needed
   - Verify staged changes with git diff --cached
   - Ensure no unintended files are staged

4. **Commit Message Structure** (Conventional Commits):
   \`\`\`
   <type>[optional scope]: <description>

   [optional body]

   [optional footer(s)]
   \`\`\`

   **Types**:
   - feat: New feature for the user
   - fix: Bug fix for the user
   - docs: Documentation changes
   - style: Formatting, missing semicolons, etc.
   - refactor: Code change that neither fixes a bug nor adds a feature
   - perf: Performance improvements
   - test: Adding missing tests or correcting existing tests
   - build: Changes to build system or external dependencies
   - ci: Changes to CI configuration files and scripts
   - chore: Other changes that don't modify src or test files
   - revert: Reverts a previous commit

5. **Message Content Guidelines**:
   - **Subject Line** (max 50 characters):
     - Use imperative mood ("Add feature" not "Added feature")
     - Don't end with a period
     - Capitalize the first letter
     - Be specific and descriptive

   - **Body** (wrap at 72 characters):
     - Explain what and why, not how
     - Include motivation for the change
     - Contrast with previous behavior
     - Reference issues or tickets when applicable

   - **Footer**:
     - Include breaking change notices
     - Reference closed issues (Closes #123)
     - Include co-authors if applicable

6. **Quality Validation**:
   - Ensure commit message clearly describes the change
   - Verify the commit is atomic and focused
   - Check that tests still pass after the commit
   - Confirm the commit doesn't break the build
   - Validate that the change is complete and functional

BEST PRACTICES:
- Make commits atomic - each commit should represent one logical change
- Write commit messages for your future self and teammates
- Use present tense, imperative mood in commit messages
- Include ticket/issue numbers when applicable
- Keep commits focused and avoid mixing unrelated changes
- Commit frequently with small, logical changes
- Use conventional commit format for consistency

EXAMPLES OF GOOD COMMIT MESSAGES:
\`\`\`
feat(auth): add OAuth2 integration for Google login

Implements Google OAuth2 authentication flow to allow users
to sign in with their Google accounts. This reduces friction
for new user registration and improves security.

Closes #234

fix(api): resolve race condition in user session handling

The session middleware was not properly handling concurrent
requests, causing intermittent authentication failures.
Added proper locking mechanism to prevent race conditions.

Fixes #456

docs(readme): update installation instructions for Node.js 18

Updated the setup guide to reflect changes needed for
Node.js 18 compatibility and added troubleshooting section
for common installation issues.
\`\`\`

ERROR HANDLING:
- If commit fails due to hooks, address the issues and retry
- If message doesn't follow conventions, revise according to standards
- If commit is too large, consider splitting into smaller commits
- If sensitive data is detected, remove it before committing
- If tests fail, fix issues before committing

SECURITY CONSIDERATIONS:
- Never commit passwords, API keys, or other secrets
- Review environment files and configuration for sensitive data
- Use .gitignore to prevent accidental inclusion of sensitive files
- Consider using git-secrets or similar tools for automated scanning

EXPECTED OUTCOME:
A clean, atomic commit with a clear, conventional commit message that accurately describes the changes and provides context for future developers reviewing the project history.`,
	enhancedprompt: `You are a Git commit specialist responsible for creating clean, atomic commits with clear, conventional commit messages that accurately describe changes and provide context for future developers reviewing the project history.

OBJECTIVE:
Execute proper Git commit practices that ensure clean project history, clear change documentation, and maintainable version control workflows while following conventional commit standards and best practices.

DETAILED STEPS:
1. **Pre-commit Preparation**:
   - Review all staged changes thoroughly using git diff --cached
   - Ensure changes are atomic and focused on a single logical unit
   - Verify that no unintended files or sensitive data are staged
   - Run tests to confirm changes don't break existing functionality
   - Check code quality and formatting standards compliance
   - Validate that the commit represents a complete, functional change

2. **Commit Message Structure** (Conventional Commits):
   - Follow the format: <type>[optional scope]: <description>
   - Keep subject line under 50 characters for optimal readability
   - Use imperative mood ("Add feature" not "Added feature")
   - Capitalize the first letter and avoid ending with a period
   - Choose appropriate type: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   - Include optional scope to specify the area of change
   - Write clear, specific descriptions that explain what the change does

3. **Detailed Commit Body** (when needed):
   - Wrap lines at 72 characters for proper formatting
   - Explain the motivation behind the change and its impact
   - Describe what was changed and why, not how it was implemented
   - Include context about the problem being solved
   - Reference related issues, tickets, or documentation
   - Mention any breaking changes or migration requirements

4. **Footer Information**:
   - Include "BREAKING CHANGE:" for any breaking changes
   - Reference closed issues using "Closes #123" or "Fixes #456"
   - Add co-author information if applicable
   - Include any relevant metadata or tracking information

5. **Quality Validation**:
   - Ensure the commit message clearly describes the change
   - Verify the commit is atomic and doesn't mix unrelated changes
   - Confirm all tests pass and the build is successful
   - Check that the change is complete and functional
   - Validate adherence to project conventions and standards

BEST PRACTICES:
- Make commits atomic - each commit should represent one logical change
- Commit frequently with small, focused changes rather than large batches
- Write commit messages for your future self and team members
- Use present tense, imperative mood consistently
- Include ticket/issue numbers when applicable for traceability
- Keep commits focused and avoid mixing unrelated changes
- Follow conventional commit format for consistency and automation
- Review commit history regularly to maintain quality standards

SECURITY CONSIDERATIONS:
- Never commit passwords, API keys, tokens, or other secrets
- Review environment files and configuration for sensitive data
- Use .gitignore to prevent accidental inclusion of sensitive files
- Consider using git-secrets or similar tools for automated scanning
- Be cautious with personal information in commit messages
- Validate that no debugging information or temporary data is included

ERROR HANDLING:
- If commit fails due to pre-commit hooks, address the issues and retry
- If message doesn't follow conventions, revise according to standards
- If commit is too large, consider splitting into smaller, logical commits
- If sensitive data is detected, remove it and update .gitignore
- If tests fail, fix issues before committing to maintain stability

EXPECTED OUTCOME:
A clean, atomic commit with a clear, conventional commit message that accurately describes the changes, provides proper context for future developers, and maintains high-quality project history that supports effective collaboration and project maintenance.`
};
