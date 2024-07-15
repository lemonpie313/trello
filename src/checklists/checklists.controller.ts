import { Body, Controller, HttpStatus, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChecklistsService } from './checklists.service';
import { CreateUpdateChecklistDto } from './dtos/create-update-checklist.dto';

@ApiTags('CHECKLISTS API')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'cardId', required: true })
  async createChecklist(
    @Body() createChecklistDto: CreateUpdateChecklistDto,
    @Query() cardId: number,
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

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'cardId', required: true })
  async readChecklist(@Query() cardId: number, @Request() req) {
    const userId = req.user.id;
    const checklists = await this.checklistsService.readChecklists(userId, cardId);
    return {
      status: HttpStatus.OK,
      message: '체크리스트 조회에 성공했습니다.',
      data: checklists,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'checklistId', required: true })
  async updateChecklist(
    @Query() checklistId: number,
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

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'checklistId', required: true })
  async deleteChecklist(@Query() checklistId: number, @Request() req) {
    const userId = req.user.id;
    await this.checklistsService.deleteChecklist(userId, checklistId);
    return {
      status: HttpStatus.OK,
      message: '체크리스트 삭제가 완료되었습니다.',
      data: checklistId,
    };
  }
}
