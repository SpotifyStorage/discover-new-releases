import { ArtistEntity } from "src/entities/artist.entity"
import { Artist } from "src/interfaces/spotify/artist.interface"

export const artistToEntity = (artist: Artist) => {
    const entity = new ArtistEntity()
    entity.artistUri = artist.id
    entity.name = artist.name
    entity.albums = []
    return entity
}