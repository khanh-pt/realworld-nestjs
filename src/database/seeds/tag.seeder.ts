import { DataSource, Repository } from 'typeorm';
import { TagEntity } from '@/api/tag/entities/tag.entity';

export class TagSeeder {
  private tagRepository: Repository<TagEntity>;

  constructor(private dataSource: DataSource) {
    this.tagRepository = this.dataSource.getRepository(TagEntity);
  }

  async seed(): Promise<TagEntity[]> {
    const tagNames = [
      'javascript',
      'typescript',
      'react',
      'nodejs',
      'nestjs',
      'angular',
      'vue',
      'python',
      'java',
      'csharp',
      'php',
      'ruby',
      'go',
      'rust',
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'gcp',
      'mongodb',
      'postgresql',
      'mysql',
      'redis',
      'graphql',
      'rest-api',
      'microservices',
      'devops',
      'cicd',
      'testing',
      'tdd',
      'frontend',
      'backend',
      'fullstack',
      'mobile',
      'ios',
      'android',
      'react-native',
      'flutter',
      'machine-learning',
      'ai',
      'data-science',
      'blockchain',
      'web3',
      'security',
      'performance',
      'database',
      'architecture',
      'design-patterns',
      'agile',
      'scrum',
    ];

    const tags: TagEntity[] = [];

    for (const name of tagNames) {
      const tag = this.tagRepository.create({ name });
      const savedTag = await this.tagRepository.save(tag);
      tags.push(savedTag);
    }

    return tags;
  }
}
