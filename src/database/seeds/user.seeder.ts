import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@/api/user/entities/user.entity';

export class UserSeeder {
  private userRepository: Repository<UserEntity>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

  async seed(): Promise<UserEntity[]> {
    const userData = [
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: 'password123',
        bio: 'Full-stack developer passionate about clean code and modern web technologies.',
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
        demo: false,
      },
      {
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        bio: 'Frontend engineer specializing in React and TypeScript. Love creating beautiful UIs.',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        demo: false,
      },
      {
        username: 'alice_dev',
        email: 'alice.dev@example.com',
        password: 'password123',
        bio: 'Backend developer with expertise in Node.js, NestJS, and database design.',
        image: null,
        demo: false,
      },
      {
        username: 'bob_wilson',
        email: 'bob.wilson@example.com',
        password: 'password123',
        bio: 'DevOps engineer focused on cloud infrastructure and automation.',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        demo: false,
      },
      {
        username: 'carol_tech',
        email: 'carol.tech@example.com',
        password: 'password123',
        bio: 'Tech lead with 10+ years of experience in software architecture and team management.',
        image: null,
        demo: false,
      },
      {
        username: 'demo_user',
        email: 'demo@example.com',
        password: 'password123',
        bio: 'Demo user account for testing purposes.',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        demo: true,
      },
    ];

    const users: UserEntity[] = [];

    for (const data of userData) {
      const user = this.userRepository.create(data);
      const savedUser = await this.userRepository.save(user);
      users.push(savedUser);
    }

    return users;
  }
}
