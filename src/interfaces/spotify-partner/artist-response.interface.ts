export interface ArtistResponse {
    data: {
        artistUnion: {
            __typename: string;
            id: string;
            uri: string;
            saved: boolean;
            sharingInfo: SharingInfo;
            preRelease: any;
            profile: {
                name: string;
                verified: boolean;
                pinnedItem: {
                    comment: string;
                    type: string;
                    backgroundImage: {
                        sources: {
                            url: string;
                        }[];
                    };
                    itemV2: {
                        __typename: string;
                        uri: string;
                        name: string;
                        images: {
                            items: ImagesSources[];
                        }[];
                    };
                };
                biography: {
                    type: string;
                    text: string;
                };
                externalLinks: {
                    items: {
                        name: string;
                        url: string;
                    }[];
                };
                playlistsV2: {
                    totalCount: number;
                    items: {
                        data: {
                            __typename: string;
                            uri: string;
                            name: string;
                            description: string;
                            ownerV2: {
                                data: {
                                    __typename: string;
                                    name: string;
                                }
                            };
                            images: {
                                items: ImagesSources[];
                            }[];
                        }
                    }[];
                };
            };
            visuals: {
                gallery: {
                    items: ImagesSources[];
                }[];
                avatarImage: ImagesSources;
                headerImage: ImagesSources;
            };
            discography: {
                latest: any;
                popularReleasesAlbums: {
                    totalCount: number;
                    items: {
                        id: string;
                        uri: string;
                        name: string;
                        type: string;
                        copyright: {
                            items: {
                                type: string;
                                text: string;
                            }[];
                        };
                        date: SpotDate;
                        coverArt: ImagesSources;
                        tracks: {
                            totalCount: number;
                        };
                        label: string;
                        playability: {
                            playable: boolean;
                            reason: string;
                        };
                        sharingInfo: SharingInfo;
                    }[];
                };
            };
            stats: {
                followers: number;
                monthlyListeners: number;
                worldRank: number;
                topCities: {
                    items: {
                        numberOfListeners: number;
                        city: string;
                        country: string;
                        region: string;
                    }[];
                }
            };
            relatedContent: {
                appearsOn: {
                    totalCount: number;
                    items: {
                        releases: {
                            totalCount: number;
                            items: {
                                uri: string;
                                id: string;
                                name: string;
                                type: string;
                                artists: {
                                    items: {
                                        uri: string;
                                        profile: {
                                            name: string
                                        };
                                    }[];
                                };
                                coverArt: ImagesSources;
                                date: SpotDate;
                                sharingInfo: SharingInfo;
                            }[];
                        };
                    }[];
                };
                featuringV2: {
                    totalCount: number;
                    items: {
                        data: Playlist;
                    }[];
                };
                discoveredOnV2: {
                    totalCount: number;
                    items: {
                        data: Playlist;
                    }[];
                };
                relatedArtists: {
                    totalCount: number;
                    items: {
                        id: string;
                        uri: string;
                        profile: {
                            name: string;
                        };
                        visuals: {
                            avatarImage: ImagesSources;
                        };
                    }[];
                };
            };
            goods: {
                events: {
                    userLocation: {
                        name: string;
                    };
                    concerts: {
                        totalCount: number;
                        items: {
                            uri: string;
                            title: string;
                            category: string;
                            festival: boolean;
                            neaUser: boolean;
                            venue: {
                                name: string;
                                location: {
                                    name: string;
                                };
                                coordinates: {
                                    latitude: number;
                                    longitude: number;
                                };
                            };
                            partnerLinks: {
                                items: {
                                    partnerName: string;
                                    url: string;
                                }[];
                            };
                            date: SpotDate;
                        }[];
                        pagingInfo: {
                            limit: number;
                        };
                    };
                };
                merch: {
                    items: {
                        image: ImagesSources;
                        name: string;
                        description: string;
                        price: string;
                        uri: string;
                        url: string;
                    }[];
                };
            };
        };
    };
    extensions: any;
}

interface SpotDate {
    year: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    isoString?: string;
    precision?: string;
}

interface SharingInfo {
    shareURL: string;
    shareId: string;
}

interface ImagesSources {
    sources: {
        url: string;
        width: number | null;
        height: number | null;
    }[];
    extractedColors?: {
        colorRaw: {
            hex: string;
        };
    };
}

interface Playlist {
    __typename: string;
    uri: string;
    id: string;
    ownerV2: {
        data: {
            __typename: string;
            name: string;
        };
    };
    name: string;
    description: string;
    images: {
        totalCount: number;
        items: ImagesSources[];
    };
};