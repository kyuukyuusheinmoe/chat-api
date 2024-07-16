/* eslint-disable prettier/prettier */
import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}

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
    register(): string {
        return 'Hello World!';
    }

    login(): string {
        return 'Hello World!';
    }
}
