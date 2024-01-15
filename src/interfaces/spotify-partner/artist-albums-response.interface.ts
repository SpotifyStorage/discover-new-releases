export interface ArtistAlbumsResponse {
    data: {
        artistUnion: {
            __typename: string
            discography: {
                all: {
                    totalCount: number
                    items: {
                        releases: {
                            items: Album[]
                        }
                    }[]
                }
            }
        };
    };
    extensions: any
}


interface Album {
    id: string
    uri: string
    name: string
    type: string
    date: Date
    coverArt: CoverArt
    playability: Playability
    sharingInfo: SharingInfo
    tracks: Tracks
}

export interface Date {
    year: number
    isoString: string
    precision: string
}

export interface CoverArt {
    sources: Source[]
}

export interface Source {
    url: string
    width: number
    height: number
}

export interface Playability {
    playable: boolean
    reason: string
}

export interface SharingInfo {
    shareId: string
    shareUrl: string
}

export interface Tracks {
    totalCount: number
}