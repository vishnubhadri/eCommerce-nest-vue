import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('user_interests')
export class UserInterests {
  @Column('uuid', { primary: true }) // Use UUID for primary key
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  category_id: string;

  @Column('timestamp', { default: new Date() })
  created_date: Date = new Date();

  @Column('timestamp', { default: new Date() })
  updated_at: Date = new Date();

  @ManyToOne(() => User, (user) => user.users, { lazy: true })
  users: User;

  @ManyToOne(() => Category, (category) => category.user_interests, {
    lazy: true,
  })
  categories: Category;
}
