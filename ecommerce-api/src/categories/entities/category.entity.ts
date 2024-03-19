import { UserInterests } from 'src/users/entities/user_interests.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @Column('uuid', { primary: true }) // Use UUID for primary key
  id: string;

  @Column('varchar', { length: 25 })
  name: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('timestamp', { default: new Date() })
  created_date: Date = new Date();

  @Column('timestamp', { default: new Date() })
  updated_at: Date = new Date();

  @OneToMany(
    () => UserInterests,
    (userInterests) => userInterests.categories,
    { eager: true },
  )
  user_interests: UserInterests[];
}
