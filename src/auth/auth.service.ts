/* eslint-disable prettier/prettier */
import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthService } from 'src/jwt/jwt.servic';
import { UserDto } from './auth.dto';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,     
        private jwtAuthService: JwtAuthService,
    ) {}

    async list(
        // @Query('take') take?: number,
        // @Query('skip') skip?: number,
        // @Query('searchString') searchString?: string,
        // @Query('orderBy') orderBy?: 'asc' | 'desc',
       
      ): Promise<any[]> {
        try {
            // const or = searchString
        //   ? {
        //       OR: [
        //         { title: { contains: searchString } },
        //         { content: { contains: searchString } },
        //       ],
        //     }
        //   : {}
    
        const users =  this.prismaService.user.findMany({
            //   where: {
            //     published: true,
            //     ...or,
            //   },
            //   include: { author: true },
            //   take: Number(take) || undefined,
            //   skip: Number(skip) || undefined,
            //   orderBy: {
            //     updatedAt: orderBy,
            //   },
            })
            console.log ("xxx list out user ")
    
            return users;
        } catch (error) {
            console.log ("xxx error  ", error)
            
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

    login(): string {
        return 'Hello World!';
    }
}
