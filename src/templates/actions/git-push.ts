import { YamlTemplate } from '../types';

export const GIT_PUSH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-push.yaml',
	description: 'Push local changes to remote repository',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Push',
		description: 'Push local changes to remote repository',
		prompt: `Push changes from current branch to remote repository and set upstream if necessary.`
	},
	enhancedprompt: `You are responsible for safely pushing local Git changes to the remote repository while ensuring data integrity, following team workflows, and maintaining proper branch relationships.

OBJECTIVE:
Push local commits to the remote repository with proper upstream tracking, validation checks, and error handling to ensure successful synchronization without conflicts or data loss.

DETAILED STEPS:
1. **Pre-Push Validation**:
   - Verify you're on the correct branch using git branch
   - Check that all intended changes are committed locally
   - Ensure working directory is clean (no uncommitted changes)
   - Validate that local branch has commits to push
   - Check remote repository connectivity and authentication
   - Verify you have push permissions to the target repository

2. **Remote Status Check**:
   - Fetch latest changes from remote to check for updates
   - Compare local branch with remote branch (git status)
   - Identify if remote has new commits that need to be pulled first
   - Check for potential merge conflicts before pushing
   - Verify the remote branch exists or needs to be created

3. **Upstream Configuration**:
   - Check if current branch has upstream tracking configured
   - Set upstream branch if this is the first push (git push -u origin branch-name)
   - Ensure upstream branch name matches local branch name
   - Verify remote name is correct (usually 'origin')
   - Configure push behavior according to team preferences

4. **Push Strategy Selection**:
   - **First Push**: Use git push -u origin <branch-name> to set upstream
   - **Regular Push**: Use git push for branches with existing upstream
   - **Force Push**: Only when absolutely necessary and safe (git push --force-with-lease)
   - **Protected Branches**: Follow special procedures for main/develop branches
   - Consider using --dry-run flag to preview push operation

5. **Push Execution**:
   - Execute the appropriate push command
   - Monitor push progress and output for errors
   - Verify push completed successfully
   - Check that remote branch reflects local commits
   - Confirm upstream tracking is properly configured

6. **Post-Push Verification**:
   - Verify commits appear on remote repository (GitHub, GitLab, etc.)
   - Check that CI/CD pipelines are triggered if configured
   - Ensure branch protection rules are respected
   - Validate that team members can see the changes
   - Update any related issue tracking or project management tools

BEST PRACTICES:
- Always fetch before pushing to check for remote changes
- Use descriptive branch names that clearly indicate the work
- Push frequently to avoid large, complex merges
- Never force push to shared branches without team coordination
- Use --force-with-lease instead of --force for safer force pushes
- Keep push operations atomic and focused
- Communicate with team when pushing to shared branches

BRANCH-SPECIFIC CONSIDERATIONS:
- **Feature Branches**: Safe to push freely, set upstream on first push
- **Main/Master Branch**: Often protected, may require pull requests
- **Develop Branch**: May have special merge requirements
- **Release Branches**: Follow release management procedures
- **Hotfix Branches**: May need expedited review and merge processes

ERROR HANDLING:
- **Push Rejected (non-fast-forward)**:
  - Fetch and merge/rebase remote changes first
  - Resolve any merge conflicts
  - Push again after successful merge/rebase

- **Authentication Failures**:
  - Verify Git credentials are configured correctly
  - Check SSH keys or personal access tokens
  - Ensure repository permissions are granted

- **Network Issues**:
  - Retry push operation after network recovery
  - Use different remote URL if primary fails
  - Consider pushing to different remote if configured

- **Branch Protection Violations**:
  - Follow required review process
  - Ensure all required checks pass
  - Get necessary approvals before pushing

SECURITY CONSIDERATIONS:
- Verify you're pushing to the correct repository
- Ensure no sensitive data is included in commits
- Use secure authentication methods (SSH keys, tokens)
- Follow organization's security policies for code sharing
- Be cautious with force pushes that could overwrite others' work

TEAM COLLABORATION:
- Communicate significant pushes to shared branches
- Follow team's branching and merging strategies
- Respect code review requirements
- Update team on push status if it affects their work
- Document any issues or special circumstances

EXPECTED OUTCOME:
Local commits successfully pushed to the remote repository with proper upstream tracking configured, all validation checks passed, and team workflow requirements satisfied.`
};
