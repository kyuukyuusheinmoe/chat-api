/* eslint-disable prettier/prettier */
export enum OAuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
  }

export class UserDto {
    id?:number;
    name: string;
    password?: string;
    email: string;
    provider: OAuthProvider
  }