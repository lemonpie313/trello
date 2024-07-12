import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('workers')
export class Workers {
  @PrimaryGeneratedColumn()
  workerId: number;

  
}