import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChecklistsService } from './checklists.service';
import { CreateUpdateChecklistDto } from './dtos/create-update-checklist.dto';
import { ActivateChecklistDto } from './dtos/activate-checklist.dto';

@ApiTags('CHECKLISTS API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  /**
   * 체크리스트 생성
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'cardId', description: '카드 ID', required: true })
  @Post('/')
  async createChecklist(
    @Body() createChecklistDto: CreateUpdateChecklistDto,
    @Query('cardId') cardId: number,
    @Request() req
  ) {
    const userId = req.user.id;
    const checklist = await this.checklistsService.createChecklist(
      userId,
      cardId,
      createChecklistDto
    );
    return {
      status: HttpStatus.CREATED,
      message: '체크리스트 생성이 완료되었습니다.',
      data: checklist,
    };
  }

  /**
   * 체크리스트 조회
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'cardId', description: '카드 ID', required: true })
  @Get('/')
  async readChecklist(@Query('cardId') cardId: number, @Request() req) {
    const userId = req.user.id;
    const checklists = await this.checklistsService.readChecklists(userId, cardId);
    return {
      status: HttpStatus.OK,
      message: '체크리스트 조회에 성공했습니다.',
      data: checklists,
    };
  }

  /**
   * 체크리스트 수정
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'checklistId', description: '체크리스트 ID', required: true })
  @Patch('/:checklistId')
  async updateChecklist(
    @Param('checklistId') checklistId: number,
    @Body() updateChecklistDto: CreateUpdateChecklistDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const checklist = await this.checklistsService.updateChecklist(
      userId,
      checklistId,
      updateChecklistDto
    );
    return {
      status: HttpStatus.OK,
      message: '체크리스트 수정이 완료되었습니다.',
      data: checklist,
    };
  }

  /**
   * 체크리스트 체크여부 수정
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'checklistId', description: '체크리스트 ID', required: true })
  @Patch('/:checklistId/check')
  async updateChecklistCheck(
    @Param('checklistId') checklistId: number,
    @Body() activateChecklistDto: ActivateChecklistDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const checklist = await this.checklistsService.activateChecklist(
      userId,
      checklistId,
      activateChecklistDto
    );
    return {
      status: HttpStatus.OK,
      message: '체크리스트 체크 수정이 완료되었습니다.',
      data: checklist,
    };
  }

  /**
   * 체크리스트 삭제
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'checklistId', description: '체크리스트 ID', required: true })
  @Delete('/:checklistId')
  async deleteChecklist(@Param('checklistId') checklistId: number, @Request() req) {
    const userId = req.user.id;
    await this.checklistsService.deleteChecklist(userId, checklistId);
    return {
      status: HttpStatus.OK,
      message: '체크리스트 삭제가 완료되었습니다.',
      data: checklistId,
    };
  }
}
