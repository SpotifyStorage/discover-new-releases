import { ArtistDataEntity } from "src/entities/artist-data.entity"
import { Artist } from "src/interfaces/spotify-api/artist.interface"

export const artistToEntity = (artist: Artist) => {
    const entity = new ArtistDataEntity()
    entity.artistUri = artist.id
    entity.name = artist.name
    entity.albums = []
    return entity
}