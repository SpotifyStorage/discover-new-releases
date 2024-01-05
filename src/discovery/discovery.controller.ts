// import { Controller, Logger, Post } from '@nestjs/common';
// import { ApiOperation } from '@nestjs/swagger';
// import { DiscoveryService } from './discovery.service';

// @Controller('discovery')
// export class DiscoveryController {
    
//     private readonly logger = new Logger(DiscoveryController.name);

//     constructor(
//       private readonly discoveryService: DiscoveryService,
//     ) {}

//     @Post('populate')
//     @ApiOperation({summary: "Add all the artists from a playlist to the database"})
//     async appendArtistsFromPlaylist() {
//       return this.discoveryService.test()
      
      

//       // 1) is called by the Azure Fonction to populate the queue
//       // 2) get all album uri from the bd
//       // 3) for each of them call spotify AristOverview and add to BOTH queue
//     }
    
// }
