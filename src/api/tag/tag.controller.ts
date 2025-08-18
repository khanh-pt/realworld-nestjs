import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from 'src/decorators/public.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all tags',
    description: 'Retrieve a list of all article tags',
  })
  @ApiOkResponse({
    description: 'List of article tags',
    schema: {
      example: {
        tags: ['nestjs', 'typescript', 'javascript'],
      },
    },
  })
  async getTags(): Promise<{ tags: string[] }> {
    return await this.tagService.getTags();
  }
}
