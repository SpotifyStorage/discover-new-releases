export class ArtistSimplified {
    name: string;
    uri: string;
    type: string;
    href: string;
    external_urls: {
        spotify: string;
    };
    get id(): string {
        return this.uri.split(":")[2];
    }
}