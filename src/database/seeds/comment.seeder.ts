import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from '@/api/comment/entities/comment.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { ArticleEntity } from '@/api/article/entities/article.entity';

export class CommentSeeder {
  private commentRepository: Repository<CommentEntity>;

  constructor(private dataSource: DataSource) {
    this.commentRepository = this.dataSource.getRepository(CommentEntity);
  }

  async seed(
    users: UserEntity[],
    articles: ArticleEntity[],
  ): Promise<CommentEntity[]> {
    const commentsData = [
      // Comments on "Getting Started with NestJS"
      {
        body: 'Great article! This really helped me understand the basics of NestJS. The code examples are clear and easy to follow.',
        articleIndex: 0,
        authorIndex: 1,
      },
      {
        body: 'Thanks for the comprehensive guide. I was struggling with dependency injection in NestJS, and your explanation clarified everything.',
        articleIndex: 0,
        authorIndex: 2,
      },
      {
        body: 'One suggestion: it would be helpful to include information about testing NestJS applications. Overall, excellent tutorial!',
        articleIndex: 0,
        authorIndex: 3,
      },

      // Comments on "React Best Practices in 2025"
      {
        body: 'These practices are spot on! I especially appreciate the emphasis on keeping components small and focused. It makes such a difference in maintainability.',
        articleIndex: 1,
        authorIndex: 0,
      },
      {
        body: 'The performance optimization section is gold. useMemo and useCallback have saved my app from unnecessary re-renders.',
        articleIndex: 1,
        authorIndex: 2,
      },
      {
        body: 'What about error boundaries? I think they deserve a mention in modern React best practices.',
        articleIndex: 1,
        authorIndex: 4,
      },

      // Comments on "Database Design Principles"
      {
        body: 'As a backend developer, I can confirm these principles are essential. The indexing strategy section is particularly valuable.',
        articleIndex: 2,
        authorIndex: 1,
      },
      {
        body: 'Great explanation of normalization! I always struggled with understanding the difference between 2NF and 3NF.',
        articleIndex: 2,
        authorIndex: 3,
      },
      {
        body: 'Would love to see a follow-up article about NoSQL database design principles. This is excellent for relational databases though.',
        articleIndex: 2,
        authorIndex: 4,
      },
      {
        body: 'The SQL examples are helpful. It would be great to see how these principles apply to ORMs like TypeORM or Prisma.',
        articleIndex: 2,
        authorIndex: 0,
      },

      // Comments on "DevOps Best Practices"
      {
        body: 'This is exactly what I needed! Our team is transitioning to DevOps and this guide covers all the essential practices.',
        articleIndex: 3,
        authorIndex: 2,
      },
      {
        body: 'The GitHub Actions example is perfect. We just implemented CI/CD and this workflow structure is very similar to what we use.',
        articleIndex: 3,
        authorIndex: 4,
      },
      {
        body: 'Security section is crucial but could be expanded. Maybe a dedicated article on DevSecOps would be valuable?',
        articleIndex: 3,
        authorIndex: 0,
      },

      // Comments on "Microservices Architecture"
      {
        body: 'Learned this the hard way! The "when NOT to use microservices" section should be required reading for every architect.',
        articleIndex: 4,
        authorIndex: 1,
      },
      {
        body: 'The strangler fig pattern mention is great. We used this approach to migrate our monolith and it worked beautifully.',
        articleIndex: 4,
        authorIndex: 3,
      },
      {
        body: 'Event-driven architecture example is clear and practical. Would love to see more patterns for service communication.',
        articleIndex: 4,
        authorIndex: 0,
      },
      {
        body: 'Great point about operational expertise. Many companies jump into microservices without having the right infrastructure and monitoring in place.',
        articleIndex: 4,
        authorIndex: 2,
      },

      // Comments on "TypeScript Advanced Patterns"
      {
        body: 'Mind blown! 🤯 I had no idea TypeScript could do template literal types. This opens up so many possibilities.',
        articleIndex: 5,
        authorIndex: 1,
      },
      {
        body: "The conditional types section is excellent. I've been using them in my utility library and they're incredibly powerful.",
        articleIndex: 5,
        authorIndex: 3,
      },
      {
        body: 'Mapped types have revolutionized how I think about type transformations. Thanks for the clear examples!',
        articleIndex: 5,
        authorIndex: 4,
      },
      {
        body: 'Could you write a follow-up about TypeScript performance considerations? These advanced patterns are great but I wonder about compilation impact.',
        articleIndex: 5,
        authorIndex: 2,
      },
    ];

    const comments: CommentEntity[] = [];

    for (const commentData of commentsData) {
      const comment = this.commentRepository.create({
        body: commentData.body,
        article: articles[commentData.articleIndex],
        author: users[commentData.authorIndex],
      });

      const savedComment = await this.commentRepository.save(comment);
      comments.push(savedComment);
    }

    return comments;
  }
}
