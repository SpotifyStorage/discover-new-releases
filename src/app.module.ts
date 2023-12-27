import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entities/track.entity';
import { TrackModule } from './track/track.module';
import { ArtistEntity } from './entities/artist.entity';
import { AlbumEntity } from './entities/album.entity';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'postgres',
      entities: [TrackEntity, ArtistEntity, AlbumEntity],
      synchronize: true,
    }),
    TrackModule,
  ],
})
export class AppModule {}
