import { Injectable } from '@nestjs/common';
import { GroupDto } from './group.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from 'src/auth/auth.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(user: UserDto, groupData: GroupDto) {
    try {
      const userData = await this.prismaService.user.findFirst({
        where: { id: user.id },
        include: { friendList: true },
      });
      const isAlreadyFriend = userData.friendList.some(
        (friend) => friend.id === groupData?.members,
      );

      console.log ('xxx isAlreadyFriend ', isAlreadyFriend, userData)

      //If no friend already, add friend first
      if (!isAlreadyFriend) {
        const result = await this.userService.addFriend(
          user,
          groupData.members?.[0],
        );

      console.log ('xxx add FriendResult ', result)

        //After add friend success, create group chat with
        if (result.status === 200) {
          const group = await this.prismaService.group.create({
            data: {
              name: groupData.name,
              createdAt: new Date(),
              members: {
                connect: [...groupData.members, user.id].map((id) => ({ id })),
              },
            },
          });
          return {
            status: 201,
            message: 'Group created successfully',
            data: group,
          };
        }
        return { status: 500, message: 'Error creating group' };
      }
    } catch (error) {
      console.log('xxx error ', error);
      return { status: 500, message: 'Error creating group' };
    }
  }

  async findAll() {
    try {
      const groups = await this.prismaService.group.findMany({});
      return {
        status: 200,
        data: groups,
      };
    } catch (error) {
      console.log('xxx error ', error);
      return { status: 500, message: 'Error fetching groups' };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
