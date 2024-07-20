import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { from, map } from 'rxjs';
import { JwtAuthService } from 'src/jwt/jwt.servic';
import { MessageService } from 'src/message/message.service';
import { UserDto } from 'src/auth/auth.dto';
import { MessageDto } from 'src/message/message.dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtAuthService: JwtAuthService,
    private messageService: MessageService,
  ) {}
  private readonly logger = new Logger();
  private users = new Map<string, Socket>();

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  async handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;
    const user = await this.getUserDataFromClient(client); // You need to implement this method to get userId
    if (user) {
      client.join(user.id);
      this.users.set(`${user.id}`, client);
      // for (const key of this.users.keys()) {
      //   this.logger.log(
      //     `xxx user ${key} user Size . ${this.users.size} Socket Client Size . ${sockets.size}`,
      //   );
      // }
    }
    this.logger.log(`Client id : ${client.id} connected, UserId : ${user?.id}`);
    this.logger.debug(`Number of connected Clients : ${sockets.size} `);
    this.logger.log(
      `xxx user Size . ${this.users.size} Socket Client Size . ${sockets.size} User Value ${this.users.get(`${user?.id}`)}`,
    );
  }

  async handleDisconnect(client: any) {
    const user = await this.getUserDataFromClient(client); // You need to implement this method to get userId
    if (user?.id) {
      client.leave(user.id);
      this.users.delete(`${user.id}`);
      console.log(`User ${user.id} disconnected, Socket ID: ${client.id}`);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('xxx handleMessage data ', data, typeof data);
    // client.join(data.groupId);
    // this.io.to(data.groupId).emit('message', 'a new challenger approaches');

    const { groupId, content, receiverIds } = data;

    const user = await this.getUserDataFromClient(client);
    this.saveMessage(user, {
      content,
      groupId: +groupId,
    });

    for (let i = 0; i < receiverIds.length; i++) {
      console.log('xxx receiver Id', receiverIds[i]);
      this.sendMessageToUser(
        receiverIds[i],
        'my_message',
        groupId,
        content,
        user,
      );
    }
  }

  sendMessageToUser(
    receiverId: string,
    event: string,
    groupId: number,
    message: string,
    sender: UserDto,
  ) {
    console.log('xxx sendMessageToUser ', receiverId, typeof receiverId, event);

    const client = this.users.get(`${receiverId}`);

    if (client) {
      //receiverId need to be joined to client to emit the event to the specific user
      client.join(`${receiverId}`);
      this.io.to(`${receiverId}`).emit(event, {
        ...sender,
        groupId,
        content: message,
        self: +receiverId === sender.id,
      });
    } else {
      console.log(`User ${receiverId} not connected`);
    }
  }

  async saveMessage(user: UserDto, data: Omit<MessageDto, 'id' | 'senderId'>) {
    this.messageService.create(user, data);
  }

  private async getUserDataFromClient(client: Socket): Promise<UserDto> {
    const userToken = client.handshake.query.user as string;
    try {
      const userData = await this.jwtAuthService.verifyToken(userToken);
      return userData;
    } catch (error) {
      return null;
    }
  }

  // Broadcast a message to all clients
  broadcastMessage(message: string): void {
    this.logger.log(`broadcasting Message`);
    this.io.emit('message', message);
  }

  @SubscribeMessage('group_joined')
  joinUserToMeeting(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('xxx joinUserToMeeting ', data);
    client.join(data.groupId);
    this.io.to(data.groupId).emit('message', 'a new challenger approaches');
    // : Observable<WsResponse<any>>
    // return from(data.meetingId).pipe(
    //   map((res: any) => {
    //     return {
    //       event: 'group_joined',
    //       data: data.meetingId,
    //     };
    //   }),
    // );
  }
}
