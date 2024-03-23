import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('user_interests')
@Unique(['user_id', 'category_id'])
export class UserInterests {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  category_id: string;

  @Column('boolean')
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.userInterests)
  user: User; // Many-to-One relationship with User

  @ManyToOne(() => Category, (category) => category.userInterests)
  category: Category; // Many-to-One relationship with Category
}
