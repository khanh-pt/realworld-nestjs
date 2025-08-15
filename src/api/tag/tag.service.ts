import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getTags(): Promise<{ tags: string[] }> {
    const tags = await this.tagRepository.find({ order: { id: 'DESC' } });
    return { tags: tags.map((tag) => tag.name) };
  }
}
