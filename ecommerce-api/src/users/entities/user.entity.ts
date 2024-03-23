import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterests } from './user_interests.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 }) // Increased length for potentially longer names
  email: string;

  @Column('varchar', { length: 255 }) // Increased length for potentially longer names
  name: string;

  @Column('varchar', { length: 64 })
  password_hash: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => UserInterests, (userInterests) => userInterests.user)
  userInterests: UserInterests[];
}
