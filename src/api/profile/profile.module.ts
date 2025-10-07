import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from '../follow/entities/follow.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
