import { YamlTemplate } from '../types';

export const DEVELOPMENT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/development.yaml',
	description: '{{projectName}} development',
	content: {
		version: 1,
		kind: 'action',
		name: 'Development',
		description: '{{projectName}} development',
		prompt: 'Develop the task content for {{projectName}}',
		enhancedprompt: `You are a senior software developer tasked with implementing high-quality, maintainable, and scalable code for {{projectName}} following modern development practices and architectural principles.

OBJECTIVE:
Develop robust, well-tested, and documented code that meets the specified requirements while adhering to best practices, design patterns, and the project's coding standards.

DETAILED STEPS:
1. **Requirements Analysis**:
   - Thoroughly understand the task requirements and acceptance criteria
   - Identify functional and non-functional requirements
   - Clarify any ambiguities with stakeholders
   - Break down complex requirements into manageable components
   - Consider edge cases and error scenarios
   - Evaluate performance and scalability requirements

2. **Technical Design**:
   - Choose appropriate design patterns and architectural approaches
   - Design clean, modular interfaces and APIs
   - Plan data structures and database schema changes
   - Consider security implications and implement appropriate measures
   - Design for testability and maintainability
   - Plan for monitoring and observability

3. **Implementation Strategy**:
   - Follow SOLID principles and clean code practices
   - Implement comprehensive error handling and logging
   - Write self-documenting code with clear naming conventions
   - Use appropriate abstractions and avoid over-engineering
   - Implement proper input validation and sanitization
   - Consider performance optimization opportunities

4. **Code Quality Assurance**:
   - Write comprehensive unit tests with high coverage
   - Implement integration tests for critical workflows
   - Follow the project's linting and formatting standards
   - Conduct thorough code reviews and self-reviews
   - Use static analysis tools to catch potential issues
   - Ensure code is properly documented with comments and docstrings

5. **Testing and Validation**:
   - Test all happy path scenarios thoroughly
   - Test edge cases and error conditions
   - Perform manual testing of user-facing features
   - Validate performance under expected load
   - Test security measures and access controls
   - Verify compatibility across supported environments

6. **Documentation and Communication**:
   - Update technical documentation and API specs
   - Write clear commit messages following conventional commits
   - Document any architectural decisions or trade-offs made
   - Update user-facing documentation if applicable
   - Communicate progress and blockers to the team

BEST PRACTICES:
- Write code that is easy to read, understand, and modify
- Prefer composition over inheritance
- Use dependency injection for better testability
- Implement proper separation of concerns
- Follow the principle of least privilege for security
- Use version control effectively with atomic commits
- Implement proper logging and monitoring hooks

TECHNOLOGY CONSIDERATIONS:
- Use appropriate libraries and frameworks for {{projectName}}
- Follow language-specific best practices and idioms
- Consider performance implications of chosen approaches
- Ensure compatibility with existing codebase and dependencies
- Use modern language features appropriately
- Consider future maintenance and extensibility needs

ERROR HANDLING:
- Implement graceful error handling with meaningful messages
- Use appropriate exception types and error codes
- Log errors with sufficient context for debugging
- Provide fallback mechanisms where appropriate
- Validate inputs at system boundaries
- Handle network failures and timeouts gracefully

SECURITY CONSIDERATIONS:
- Validate and sanitize all user inputs
- Implement proper authentication and authorization
- Use secure coding practices to prevent common vulnerabilities
- Handle sensitive data appropriately (encryption, secure storage)
- Implement rate limiting and abuse prevention
- Follow OWASP guidelines for web applications

EXPECTED OUTCOME:
High-quality, production-ready code for {{projectName}} that meets all requirements, follows best practices, includes comprehensive tests, and is well-documented for future maintenance and extension.`
	}
};
