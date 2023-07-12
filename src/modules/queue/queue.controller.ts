import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Queue } from './model/queue.model';
import { QueueService } from './queue.service';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @ApiResponse({ status: 201, type: Queue })
  @Get('')
  getQueue(): Promise<Queue[]> {
    return this.queueService.getAll();
  }

  @ApiResponse({ status: 201, type: Queue })
  @Get('g')
  checkActive() {
    return this.queueService.checkTimeActive();
  }
}
