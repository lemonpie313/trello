import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Cards } from "src/cards/entities/cards.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const typeOrmModuleOptions = {
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
      namingStrategy: new SnakeNamingStrategy(),
      type: 'mysql',
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      database: configService.get('DB_NAME'),
      entities: [Cards],
      synchronize: configService.get('DB_SYNC'),
      logging: true,
    }),
    inject: [ConfigService],
  };