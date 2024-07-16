/* eslint-disable prettier/prettier */
export enum OAuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
  }

export class UserDto {
    password?: string;
    email: string;
    provider: OAuthProvider
  }