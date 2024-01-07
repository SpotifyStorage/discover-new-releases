import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver, ServiceBusSender } from '@azure/service-bus';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ArtistQueueMessage } from './interface/artist-queue-message.interface';
import { MinimalArtist } from './interface/artist-minimal.interface';

@Injectable()
export class ArtistQueueService implements OnModuleInit {
    queue$ = new Subject<MinimalArtist>()
    fullyQualifiedNamespace = "spotifystorage.servicebus.windows.net";
    credential = new DefaultAzureCredential();
    queueName = "artist"
    sbClient: ServiceBusClient;
    sender: ServiceBusSender;
    mainReceiver: ServiceBusReceiver;
    
    onModuleInit() {
        this.sbClient = new ServiceBusClient(this.fullyQualifiedNamespace, this.credential);
        this.sender = this.sbClient.createSender(this.queueName);
        this.mainReceiver = this.sbClient.createReceiver(this.queueName);
    }

    addReceiver(processMessageCallback: (message: ArtistQueueMessage) => Promise<void>) {
        const receiver = this.sbClient.createReceiver(this.queueName);
        receiver.subscribe({
            processMessage: processMessageCallback,
            processError: async (err) => {
                console.log("Error", err);
            }
        });
        return receiver;
    }

    async getSingleMessage() {
        const messages = await this.mainReceiver.receiveMessages(1);
        const message = messages[0];
        if (!message) {
            return null;
        }
        await this.mainReceiver.completeMessage(message);
        return JSON.parse(message.body)
    }

    closeReceiver(receiver: ServiceBusReceiver) {
        return receiver.close();
    }

    async sendMessages(message: MinimalArtist[]) {
        console.log('ok')
        await this.sender.sendMessages({
            body: message
        })
    }
}
