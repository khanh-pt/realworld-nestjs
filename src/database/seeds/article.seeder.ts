import { DataSource, Repository } from 'typeorm';
import { ArticleEntity } from '@/api/article/entities/article.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { TagEntity } from '@/api/tag/entities/tag.entity';

export class ArticleSeeder {
  private articleRepository: Repository<ArticleEntity>;

  constructor(private dataSource: DataSource) {
    this.articleRepository = this.dataSource.getRepository(ArticleEntity);
  }

  async seed(users: UserEntity[], tags: TagEntity[]): Promise<ArticleEntity[]> {
    const articlesData = [
      {
        title: 'Getting Started with NestJS: A Comprehensive Guide',
        slug: 'getting-started-with-nestjs-comprehensive-guide',
        description:
          'Learn how to build scalable Node.js applications with NestJS framework',
        body: `# Getting Started with NestJS

NestJS is a progressive Node.js framework for building efficient and scalable server-side applications. It uses modern JavaScript, is built with TypeScript, and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

## Key Features

- **Modular Architecture**: Build applications using a modular approach
- **Dependency Injection**: Built-in IoC container for managing dependencies
- **TypeScript Support**: First-class TypeScript support out of the box
- **Decorator-based**: Uses decorators for routing, validation, and more

## Installation

\`\`\`bash
npm install -g @nestjs/cli
nest new project-name
\`\`\`

## Creating Your First Controller

\`\`\`typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
\`\`\`

This is just the beginning of your NestJS journey!`,
        authorIndex: 0,
        tagNames: ['nestjs', 'nodejs', 'typescript', 'backend'],
      },
      {
        title: 'React Best Practices in 2025',
        slug: 'react-best-practices-2025',
        description:
          'Modern React development patterns and best practices for building maintainable applications',
        body: `# React Best Practices in 2025

React continues to evolve, and so do the best practices around it. Here are the most important patterns and practices you should follow in 2025.

## Component Design

### Use Functional Components
Always prefer functional components over class components. They're simpler and work better with hooks.

\`\`\`jsx
// Good
function UserProfile({ user }) {
  return <div>{user.name}</div>;
}

// Avoid
class UserProfile extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
\`\`\`

### Keep Components Small and Focused
Each component should have a single responsibility.

## State Management

- Use \`useState\` for local component state
- Consider \`useReducer\` for complex state logic
- Use context sparingly - don't make everything global

## Performance Optimization

- Use \`React.memo\` for expensive components
- Optimize re-renders with \`useMemo\` and \`useCallback\`
- Code splitting with \`React.lazy\` and \`Suspense\`

Following these practices will help you build better React applications!`,
        authorIndex: 1,
        tagNames: ['react', 'javascript', 'frontend', 'performance'],
      },
      {
        title: 'Database Design Principles for Modern Applications',
        slug: 'database-design-principles-modern-applications',
        description:
          'Essential database design principles every developer should know',
        body: `# Database Design Principles for Modern Applications

Good database design is the foundation of any successful application. Here are the key principles you should follow.

## Normalization

Normalize your data to eliminate redundancy and improve data integrity.

### First Normal Form (1NF)
- Each column contains atomic values
- No repeating groups

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes are fully functionally dependent on the primary key

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies

## Indexing Strategy

- Index frequently queried columns
- Avoid over-indexing (impacts write performance)
- Use composite indexes for multi-column queries

## Relationships

### One-to-Many
Most common relationship type. Use foreign keys properly.

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL
);
\`\`\`

### Many-to-Many
Use junction tables for many-to-many relationships.

## Performance Considerations

- Design for your query patterns
- Consider denormalization for read-heavy workloads
- Use appropriate data types
- Plan for scalability from the start

Remember: Good database design is an investment in your application's future!`,
        authorIndex: 2,
        tagNames: [
          'database',
          'postgresql',
          'mysql',
          'design-patterns',
          'performance',
        ],
      },
      {
        title: 'DevOps Best Practices: From Development to Production',
        slug: 'devops-best-practices-development-to-production',
        description:
          'Complete guide to DevOps practices for reliable software delivery',
        body: `# DevOps Best Practices: From Development to Production

DevOps is about breaking down silos between development and operations teams to deliver software faster and more reliably.

## Core Principles

### 1. Automation
Automate everything you can:
- Build processes
- Testing
- Deployment
- Infrastructure provisioning

### 2. Continuous Integration/Continuous Deployment (CI/CD)

\`\`\`yaml
# Example GitHub Actions workflow
name: CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: ./deploy.sh
\`\`\`

### 3. Infrastructure as Code (IaC)
Use tools like Terraform, CloudFormation, or Pulumi to manage infrastructure.

### 4. Monitoring and Observability
- Implement comprehensive logging
- Set up metrics and alerts
- Use distributed tracing for microservices

## Container Strategy

### Docker Best Practices
- Use multi-stage builds
- Minimize image size
- Run as non-root user
- Use specific tags, not 'latest'

### Kubernetes
- Use namespaces for environment separation
- Implement resource limits
- Use secrets for sensitive data
- Regular security updates

## Security
- Shift security left (start early in development)
- Regular vulnerability scanning
- Principle of least privilege
- Secure secrets management

The goal is to create a culture of shared responsibility and continuous improvement!`,
        authorIndex: 3,
        tagNames: ['devops', 'docker', 'kubernetes', 'cicd', 'aws', 'security'],
      },
      {
        title: 'Microservices Architecture: Lessons Learned',
        slug: 'microservices-architecture-lessons-learned',
        description:
          'Real-world experiences and lessons from implementing microservices at scale',
        body: `# Microservices Architecture: Lessons Learned

After years of working with microservices, here are the key lessons I've learned about what works and what doesn't.

## When to Use Microservices

### Good Candidates
- Large, complex applications
- Multiple teams working on different business domains
- Different scaling requirements for different parts
- Need for technology diversity

### When NOT to Use Microservices
- Small applications or teams
- When you don't have operational expertise
- Tightly coupled business logic
- Performance is critical (network overhead)

## Key Challenges

### 1. Distributed System Complexity
- Network latency and failures
- Data consistency across services
- Debugging and monitoring

### 2. Service Communication
Choose the right communication pattern:
- Synchronous: REST, GraphQL
- Asynchronous: Message queues, event streaming

### 3. Data Management
- Database per service pattern
- Eventual consistency
- Saga pattern for distributed transactions

## Best Practices

### Service Design
- Single responsibility principle
- Domain-driven design
- API-first approach

### Infrastructure
- Service discovery
- Load balancing
- Circuit breakers
- Centralized logging

### Monitoring
- Distributed tracing
- Health checks
- Business metrics

## Migration Strategy

Don't try to migrate everything at once:
1. Start with new features
2. Extract bounded contexts
3. Strangler fig pattern for legacy systems

## Example: Event-Driven Architecture

\`\`\`typescript
// Order service publishes event
await eventBus.publish(new OrderCreatedEvent({
  orderId: order.id,
  customerId: order.customerId,
  items: order.items
}));

// Inventory service handles event
@EventHandler(OrderCreatedEvent)
async handleOrderCreated(event: OrderCreatedEvent) {
  await this.reserveInventory(event.items);
}
\`\`\`

Remember: Microservices are not a silver bullet. They come with complexity that you need to be prepared to handle.`,
        authorIndex: 4,
        tagNames: [
          'microservices',
          'architecture',
          'nodejs',
          'design-patterns',
          'scalability',
        ],
      },
      {
        title: 'TypeScript Advanced Patterns and Techniques',
        slug: 'typescript-advanced-patterns-techniques',
        description:
          'Explore advanced TypeScript features for building robust applications',
        body: `# TypeScript Advanced Patterns and Techniques

TypeScript offers powerful features that go beyond basic type annotations. Let's explore some advanced patterns.

## Generic Constraints

\`\`\`typescript
interface Identifiable {
  id: string;
}

function updateEntity<T extends Identifiable>(
  entities: T[],
  id: string,
  updates: Partial<T>
): T[] {
  return entities.map(entity =>
    entity.id === id ? { ...entity, ...updates } : entity
  );
}
\`\`\`

## Conditional Types

\`\`\`typescript
type ApiResponse<T> = T extends string
  ? { message: T }
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type DataResponse = ApiResponse<User>; // { data: User }
\`\`\`

## Template Literal Types

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = \`/api/\${string}\`;
type ApiCall = \`\${HttpMethod} \${ApiEndpoint}\`;

// Usage
const apiCall: ApiCall = 'GET /api/users'; // ✅
const invalid: ApiCall = 'INVALID /api/users'; // ❌
\`\`\`

## Mapped Types

\`\`\`typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  id: string;
  name: string;
  email: string;
}

type PartialUser = Optional<User>;
type ImmutableUser = ReadOnly<User>;
\`\`\`

## Utility Types

### Pick and Omit
\`\`\`typescript
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutId = Omit<User, 'id'>;
\`\`\`

### Record
\`\`\`typescript
type UserRoles = Record<string, User[]>;
const roleAssignments: UserRoles = {
  admin: [user1, user2],
  user: [user3, user4]
};
\`\`\`

## Advanced Function Types

\`\`\`typescript
type EventHandler<T = any> = (event: T) => void;
type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

interface EventEmitter {
  on<T>(event: string, handler: EventHandler<T>): void;
  emit<T>(event: string, data: T): void;
}
\`\`\`

## Decorator Factory Pattern

\`\`\`typescript
function ApiEndpoint(path: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      apiPath = path;
    };
  };
}

@ApiEndpoint('/users')
class UserController {
  // controller logic
}
\`\`\`

These patterns will help you write more type-safe and maintainable TypeScript code!`,
        authorIndex: 0,
        tagNames: ['typescript', 'javascript', 'design-patterns', 'advanced'],
      },
    ];

    const articles: ArticleEntity[] = [];

    for (const articleData of articlesData) {
      const article = this.articleRepository.create({
        title: articleData.title,
        slug: articleData.slug,
        description: articleData.description,
        body: articleData.body,
        author: users[articleData.authorIndex],
      });

      // Save article first
      const savedArticle = await this.articleRepository.save(article);

      // Add tags
      const articleTags = tags.filter((tag) =>
        articleData.tagNames.includes(tag.name),
      );
      savedArticle.tags = articleTags;

      // Save with tags
      await this.articleRepository.save(savedArticle);
      articles.push(savedArticle);
    }

    // Add some favorite relationships (users favoriting articles)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // User 1 favorites articles 0, 2, 4
      await queryRunner.query(
        'INSERT INTO article_users (article_id, user_id) VALUES ($1, $2), ($3, $4), ($5, $6)',
        [
          articles[0].id,
          users[1].id,
          articles[2].id,
          users[1].id,
          articles[4].id,
          users[1].id,
        ],
      );

      // User 2 favorites articles 1, 3
      await queryRunner.query(
        'INSERT INTO article_users (article_id, user_id) VALUES ($1, $2), ($3, $4)',
        [articles[1].id, users[2].id, articles[3].id, users[2].id],
      );

      // User 3 favorites article 0, 1, 5
      await queryRunner.query(
        'INSERT INTO article_users (article_id, user_id) VALUES ($1, $2), ($3, $4), ($5, $6)',
        [
          articles[0].id,
          users[3].id,
          articles[1].id,
          users[3].id,
          articles[5].id,
          users[3].id,
        ],
      );
    } finally {
      await queryRunner.release();
    }

    return articles;
  }
}
