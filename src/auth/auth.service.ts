/* eslint-disable prettier/prettier */
import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthService } from 'src/jwt/jwt.servic';
import { UserDto } from './auth.dto';
import { Prisma } from '@prisma/client';

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
    async gg_login(userData: UserDto): Promise<{ status: number; message: string; token?: string; data?: Prisma.UserCreateInput }>{
        try {
            const {email} = userData

            console.log ("xxx gg login userData ", userData)
    
            const existingUser = await this.prismaService.user.findUnique({
                where: {
                     email ,
                },
              });
              console.log ("xxx existingUser ", existingUser)

              const token = await this.jwtAuthService.createToken(existingUser);

            console.log ("xxx token ", token)

            
              if (existingUser) {

                return { status: 200, message: 'User existed and logged in', token };
              } else {
              const newUser = await this.prismaService.user.create({
                data: userData,
              });
              return { status: 201, message: 'User created successfully', data: newUser, token }
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
