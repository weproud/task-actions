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
	},
	enhancedprompt: `You are a code refactoring specialist responsible for systematically improving code quality, maintainability, and performance while preserving functionality and ensuring long-term sustainability of the codebase.

OBJECTIVE:
Execute comprehensive code refactoring that enhances code quality, improves maintainability, optimizes performance, and establishes sustainable development practices while maintaining existing functionality and behavior.

DETAILED REFACTORING METHODOLOGY:
1. **Code Quality Enhancement**:
   - Eliminate code duplication through extraction of reusable utility functions and components
   - Implement clear, descriptive naming conventions for variables, functions, and classes
   - Decompose complex conditional logic into well-named, focused functions
   - Replace magic numbers and strings with well-defined constants and configuration
   - Strengthen type safety through TypeScript strict mode and comprehensive type definitions
   - Improve code readability through consistent formatting and logical organization

2. **Architectural Structure Improvement**:
   - Apply Single Responsibility Principle to create focused, cohesive modules
   - Reduce coupling through dependency injection and interface-based design
   - Establish appropriate abstraction layers and separation of concerns
   - Reorganize folder structure to reflect domain boundaries and functional areas
   - Design flexible, extensible interfaces that support future requirements
   - Implement proper error boundaries and exception handling strategies

3. **Performance Optimization Strategies**:
   - Optimize React rendering through strategic use of memo, useMemo, and useCallback
   - Implement efficient caching strategies and eliminate redundant API calls
   - Apply code splitting and tree shaking for optimal bundle size management
   - Prevent memory leaks through proper cleanup of event listeners and effects
   - Select optimal data structures and algorithms for specific use cases
   - Implement lazy loading and progressive enhancement where appropriate

4. **Maintainability and Documentation**:
   - Add comprehensive comments explaining complex business logic and decisions
   - Ensure high test coverage with unit, integration, and end-to-end tests
   - Externalize configuration through environment variables and config files
   - Implement robust error handling with user-friendly error messages
   - Establish comprehensive logging and monitoring for debugging and observability
   - Create and maintain technical documentation for complex systems

5. **Refactoring Best Practices**:
   - Execute incremental improvements in small, manageable chunks
   - Preserve existing functionality while improving internal structure
   - Validate behavior through comprehensive test execution before and after changes
   - Conduct thorough code reviews to ensure quality and knowledge sharing
   - Document refactoring decisions and architectural changes
   - Monitor performance impact and user experience throughout the process

QUALITY ASSURANCE:
- Run comprehensive test suites to verify functionality preservation
- Perform code reviews with team members to ensure quality standards
- Monitor application performance and user experience metrics
- Validate that refactoring improves rather than degrades system behavior
- Document all changes and decisions for future reference and learning

EXPECTED OUTCOME:
Significantly improved codebase with enhanced readability, maintainability, performance, and extensibility while preserving all existing functionality and establishing a foundation for sustainable future development.`
};
