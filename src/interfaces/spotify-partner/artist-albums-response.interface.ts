export interface ArtistAlbumsResponse {
    data: Data
    extensions: Extensions
  }
  
  export interface Data {
    artistUnion: ArtistUnion
  }
  
  export interface ArtistUnion {
    __typename: string
    discography: Discography
  }
  
  export interface Discography {
    all: All
  }
  
  export interface All {
    totalCount: number
    items: Item[]
  }
  
  export interface Item {
    releases: Releases
  }
  
  export interface Releases {
    items: Item2[]
  }
  
  export interface Item2 {
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
  
  export interface Extensions {}
  