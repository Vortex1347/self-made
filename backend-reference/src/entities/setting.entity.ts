import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('setting')
export class SettingEntity {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text' })
  value: string;
}
