export interface AccessToken {
    clientId: string,
    accessToken: string,
    accessTokenExpirationTimestampMs: number,
    isAnonymous: boolean
}