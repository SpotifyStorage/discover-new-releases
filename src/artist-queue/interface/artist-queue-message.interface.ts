import { ServiceBusReceivedMessage } from "@azure/service-bus"
import { MinimalArtist } from "./artist-minimal.interface"

export interface ArtistQueueMessage extends ServiceBusReceivedMessage {
    body: MinimalArtist[]
}