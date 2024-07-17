import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  /**
   * 테스트
   * @returns "example"
   */
  @Get('/health-check')
  getHello(): string {
    const port = this.configService.get<number>('PORT');
    return `Hello world!! ${port}`;
  }
}
