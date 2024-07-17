import { Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io"
import { rabbitMQClient } from 'rabbitmq.config';


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: any) {
    this.logger.log("Initialized")
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id : ${client.id} connected`)
    this.logger.debug(`Number of connected Clients : ${sockets.size}`)
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`)
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<string> {
    this.logger.log(`Message received from client id: ${client.id}`)
    this.logger.debug(`Payload`, payload)
    // Send message to RabbitMQ
    await rabbitMQClient.emit('message', payload).toPromise();
    return "Message received and queued";
  }

  // Broadcast a message to all clients
  broadcastMessage(message: string): void {
    this.logger.log(`broadcasting Message`)
    this.io.emit('message', message);
  }
}
