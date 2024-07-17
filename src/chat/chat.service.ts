import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(private readonly chatGateway: ChatGateway) {}

  @EventPattern('message') // Ensure this matches the event name in RabbitMQ
  async handleMessage(@Payload() message: any) {
    console.log('Message received from RabbitMQ:', message);
    this.chatGateway.broadcastMessage(message);
  }
}
