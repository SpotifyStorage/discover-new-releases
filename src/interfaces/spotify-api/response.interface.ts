export interface SpotifyResponse<T> {
    href: string;
    limit: number;
    next: number;
    offset: number;
    previous: string;
    total: number;
    items: T[];
}