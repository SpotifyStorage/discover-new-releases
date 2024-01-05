// import { ServiceBusClient } from '@azure/service-bus';
// import { Injectable, Logger } from '@nestjs/common';

// @Injectable()
// export class DiscoveryService {
//     private readonly logger = new Logger(DiscoveryService.name);

//     constructor(
//         private readonly serviceBusClient: ServiceBusClient
//     ) {}

//     async test() {
//         const sender = this.serviceBusClient.createSender("artist")
//         await sender.sendMessages({ body: "Hello world" })
//         await sender.close()
//         await this.serviceBusClient.close()
//     }


// }
