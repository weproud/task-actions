import { YamlTemplate } from '../types';

export const DEPLOY_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/deploy.yaml',
	description: 'Application deployment',
	content: {
		version: 1,
		kind: 'action',
		name: 'Deploy',
		description: 'Deploy application',
		prompt: `Deploy application.

Please perform the following steps:
1. Check deployment environment (staging, production, etc.)
2. Verify build and test completion
3. Execute deployment script
4. Perform health check after deployment
5. Prepare rollback plan (in case of failure)

Check deployment environment variables and configuration, and perform safe deployment through CI/CD pipeline.`
	}
};
