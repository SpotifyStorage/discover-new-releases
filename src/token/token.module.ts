import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import { TokenController } from './token.controller';

@Module({
  imports: [HttpModule],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [TokenController]
})
export class TokenModule {}
