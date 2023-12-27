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
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Password1!',
      database: 'model',
      entities: [TrackEntity, ArtistEntity, AlbumEntity],
      synchronize: true,
      options: { encrypt: false },
    }),
    TrackModule,
  ],
})
export class AppModule {}
