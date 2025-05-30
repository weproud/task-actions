import { YamlTemplate } from '../types';

export const REFACTORING_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/refactoring-rule.yaml',
	description: 'Rules to follow when refactoring {{projectName}} code',
	content: {
		version: 1,
		kind: 'rule',
		name: 'Refactoring Rule',
		description: 'Rules to follow when refactoring {{projectName}} code',
		prompt: `Follow these rules when refactoring {{projectName}} code:

## Code Quality Improvement
- Remove duplicate code and extract common utility functions
- Use meaningful variable and function names (clear and descriptive)
- Separate complex conditional statements into functions for better readability
- Remove magic numbers and manage them as constants
- Enhance type safety (utilize TypeScript strict mode)

## Structure Improvement
- Separate functions/classes according to Single Responsibility Principle (SRP)
- Reduce coupling through dependency inversion
- Maintain appropriate abstraction levels
- Organize folder structure and separate concerns
- Design flexibly through interfaces and abstraction

## Performance Optimization
- Minimize unnecessary rendering (utilize React.memo, useMemo, useCallback)
- Remove duplicate API calls and apply caching strategies
- Optimize bundle size (code splitting, tree shaking)
- Prevent memory leaks (cleanup event listeners, useEffect cleanup)
- Choose efficient data structures and algorithms

## Maintainability Enhancement
- Add clear comments and documentation
- Ensure test coverage and write testable code
- Externalize configuration values and utilize environment variables
- Improve error handling and user-friendly messages
- Establish logging system and provide debugging information

## Refactoring Principles
- Gradual improvement in small units
- Improve structure without changing functionality
- Verify behavior by running tests before and after refactoring
- Ensure quality through code reviews
`
	}
};
