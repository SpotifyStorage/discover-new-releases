import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
