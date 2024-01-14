import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Token')
@Controller('token')
export class TokenController {
    constructor(
        private readonly tokenService: TokenService
    ) {}

    //--//  for debugging purpose only  //--//
    //--// should be deleted when final //--//

    @Get('api')
    getApiToken() {
        return this.tokenService.getValidApiToken()
    }

    @Get('partner')
    getParnerToken() {
        return this.tokenService.getValidPartnerToken()
    }
}
