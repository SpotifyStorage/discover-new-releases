import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { stringify } from 'querystring';
import { lastValueFrom, map } from 'rxjs';
import { AccessToken } from 'src/interfaces/spotify-partner/access-token.interface';
import { PartnerTokenDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Token } from 'src/interfaces/spotify-api/token.interface';

@Injectable()
export class TokenService implements OnModuleInit {

    logger = new Logger(TokenService.name)
    
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}
    
    
    activePartnerToken = {
        clientId: '',
        accessToken: '',
        accessTokenExpirationTimestampMs: Date.now(),
        isAnonymous: true
    };

    activeApiToken = {
        access_token: '',
        token_type: 'Bearer',
        expires_in: Date.now()
      };

    async onModuleInit() {
        this.activePartnerToken = await this.getNewPartnerToken();
        this.activeApiToken = await this.getNewApiToken();
    }

    async getNewPartnerToken(): Promise<AccessToken> {
        this.logger.verbose('Getting new spotify token')
        const url = 'https://open.spotify.com/get_access_token?';
        const payload = {
            reason: "transpost",
            productType: 'web_player'
        };
        return lastValueFrom(
            this.httpService
                .get<AccessToken>(url + stringify(payload))
                .pipe(
                    map(
                        axiosRespone => axiosRespone.data
                    )
                )
        )
    }

    isPartnerTokenActive(): Boolean {
        if (Date.now() > this.activePartnerToken.accessTokenExpirationTimestampMs) {
            return false
        }
        return true
    }

    async getValidPartnerToken(): Promise<PartnerTokenDto> {
        if (!this.isPartnerTokenActive()) {
            this.activePartnerToken = await this.getNewPartnerToken()
            return this.activePartnerToken
        }
        return this.activePartnerToken
    }


////////////////////////

    async getNewApiToken(): Promise<Token> {
        const client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
        const client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET')

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            },
        }).then(x => x.json());

        const expirationTime = Date.now() + response.expires_in * 1000;

        response.expires_in = expirationTime;
        
        return response
    }

    isApiTokenActive(): Boolean {
        if (Date.now() > this.activeApiToken.expires_in) {
            return false
        }
        return true
    }

    async getValidApiToken() {
        if (!this.isApiTokenActive()) {
        return this.getNewApiToken()        // christophe est pas trop confiant ici mais avait finalement raison
        }
        return this.activeApiToken
    }
}
