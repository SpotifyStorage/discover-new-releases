import { DefaultAzureCredential } from '@azure/identity';
import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver, ServiceBusSender } from '@azure/service-bus';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ArtistQueueMessage } from './interface/artist-queue-message.interface';
import { MinimalArtist } from './interface/artist-minimal.interface';
import { ArtistStatQueueMessageBody } from './interface/artist-stat-queue-message.interface';
import { ArtistStat } from './interface/artist-stat.interface';

@Injectable()
export class ArtistStatQueueService implements OnModuleInit {
    queue$ = new Subject<MinimalArtist>()
    fullyQualifiedNamespace = "spotifystorage.servicebus.windows.net";
    credential = new DefaultAzureCredential();
    queueName = "artist-stat"
    sbClient: ServiceBusClient;
    sender: ServiceBusSender;
    mainReceiver: ServiceBusReceiver;

    onModuleInit() {
        this.sbClient = new ServiceBusClient(this.fullyQualifiedNamespace, this.credential);
        this.sender = this.sbClient.createSender(this.queueName);
        this.mainReceiver = this.sbClient.createReceiver(this.queueName);
    }

    addReceiver(processMessageCallback: (message: ArtistStatQueueMessageBody) => Promise<void>) {
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

    async sendMessages(message: ArtistStat[]) {
        await this.sender.sendMessages({
            body: message
        })
    }
}
