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

  async create(
    user: UserDto,
    groupData: GroupDto,
  ): Promise<{ status: number; message: string; data?: any; token?: string }> {
    try {
      const userData = await this.prismaService.user.findFirst({
        where: { id: user.id },
        include: { friendList: true },
      });
      let isAlreadyFriend: boolean;

      groupData?.members?.forEach((member: number) => {
        const existedMember = userData.friendList.find(
          (friend) => friend.id === member,
        );
        if (existedMember) {
          isAlreadyFriend = true;
          return;
        }
      });

      //If no friend already, add friend first
      if (!isAlreadyFriend) {
        const result = await this.userService.addFriend(
          user,
          groupData.members?.[0],
        );

        if (result.status === 500) {
          return { status: 500, message: 'Error creating group' };
        }
      }

      const groupResult = await this.checkGroup(user, groupData);

      return groupResult;
    } catch (error) {
      console.log('xxx error ', error);
      return { status: 500, message: 'Error creating group' };
    }
  }

  async checkGroup(user, groupData) {
    const existedGroup = await this.prismaService.group.findFirst({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
      include: { members: true },
    });

    if (!existedGroup) {
      const group = await this.prismaService.group.create({
        data: {
          name: groupData.name,
          createdAt: new Date(),
          members: {
            connect: [...groupData.members, user.id].map((id) => ({
              id,
            })),
          },
        },
      });
      return {
        status: 201,
        message: 'Group created successfully',
        data: group,
      };
    } else {
      return {
        status: 201,
        message: 'Group created successfully',
        data: existedGroup,
      };
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

  async findGroupById(userData: UserDto) {
    try {
      const groups = await this.prismaService.group.findMany({
        where: {
          members: {
            some: {
              id: userData.id,
            },
          },
        },
      });
      return {
        status: 200,
        data: groups,
      };
    } catch (error) {
      console.log('xxx error ', error);
      return { status: 500, message: 'Error fetching groups' };
    }
  }

  update(id: number) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
