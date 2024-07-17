/* eslint-disable prettier/prettier */
import { Injectable,  } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthService } from 'src/jwt/jwt.servic';
import { UserDto } from './auth.dto';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from "google-auth-library";
import { PasswordService } from 'src/password.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,     
        private jwtAuthService: JwtAuthService,
        private passwordService: PasswordService,

    ) {}

    async register(userData: UserDto):Promise<{ status: number; message: string;data?:any, token?: string }>  {
      console.log ('xxx userData ', userData)
      const existingUser = await this.prismaService.user.findFirst({
        where: {
           email: userData.email
        },
      });
      try {
        if (existingUser) {
          return { status: 400, message: 'User already exists' };
        }
    
        const password = await this.passwordService.hashPassword(userData.password)
        const newUser = await this.prismaService.user.create({
          data: {...userData, password:password },
        });
    
        const token = await this.jwtAuthService.createToken({ id: newUser.id, email: newUser.email, name: newUser.name });
        return { status: 201, message: 'User created successfully', data: newUser, token };
      } catch (error) {
        console.log ("xxx error ", error)
        return { status: 500, message: 'Error registering user' };
      }
    }
    

    async gg_login(code: string): Promise<{ status: number; message: string; token?: string; data?: Prisma.UserCreateInput }>{
        try {
            const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
            const REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;
            const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);

            console.log ("xxx GOOGLE_CLIENT_ID ", GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,REDIRECT_URL )
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            const userinfo = await oAuth2Client.request<{
              email: string,
              sub: string,
              given_name: string,
              family_name: string,
              picture: string,
              name: string
            }>({ url: "https://www.googleapis.com/oauth2/v3/userinfo" });

            const existingUser = await this.prismaService.user.findUnique({
                where: {
                  email: userinfo.data.email ,
                },
              });

              if (existingUser) {
                const token = await this.jwtAuthService.createToken(existingUser);

                return { status: 201, message: 'User existed and logged in', data: existingUser, token: token };
              } else {

              const newUser = await this.prismaService.user.create({
                data: {email: userinfo.data.email, name: userinfo.data.given_name, provider: 'GOOGLE'},
              });

              const token = await this.jwtAuthService.createToken(newUser);

              return { status: 201, message: 'User created successfully', data: newUser, token: token }
           }
        } catch (error) {
            console.log ("xxx login google error ", error)

            return { status: 500, message: 'Error creating user' }

        }
    }

    async login(userData: UserDto):Promise<{ status: number; message: string;data?:any, token?: string }>  {
      
      if (!userData.email) {
        return { status: 500, message: 'Error logging in' };
      }

      const existingUser = await this.prismaService.user.findFirst({
        where: {
           email: userData.email
        },
      });
      try {
        if (!existingUser) {
          return { status: 400, message: 'User does not exist' };
        }

        const token = await this.jwtAuthService.createToken({ id: existingUser.id, email: existingUser.email, name: existingUser.name });
        return { status: 200, message: 'Loggedin successfully', token };
      } catch (error) {
        return { status: 500, message: 'Error logging in' };
      }
    }
}
