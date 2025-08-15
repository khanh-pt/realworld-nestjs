import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  async getTags(): Promise<{ tags: string[] }> {
    return await this.tagService.getTags();
  }
}
