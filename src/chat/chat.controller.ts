import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @EventPattern('message') // Ensure this matches the event name in RabbitMQ
  async handleMessage(@Payload() message: any) {
    return this.chatService.handleMessage(message);
  }
}
