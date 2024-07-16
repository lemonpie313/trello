import { SetMetadata } from '@nestjs/common';
import { BOARD_ROLE } from 'src/boards/types/board-roles.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: BOARD_ROLE[]) => SetMetadata(ROLES_KEY, roles);
