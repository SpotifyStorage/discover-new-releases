import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { TrackModule } from './track/track.module';
import { ArtistEntity } from './entities/artist.entity';
import { AlbumEntity } from './entities/album.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [TrackEntity, ArtistEntity, AlbumEntity],
        synchronize: true,
        options: { 
          encrypt: configService.get('DATABASE_ENCRYPT') === "true" ? true : false,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env-spotify'],
      isGlobal: true,
    }),
    TrackModule,
  ],
})
export class AppModule {}
