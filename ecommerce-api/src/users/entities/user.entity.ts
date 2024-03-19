import { Column, Entity, OneToMany } from 'typeorm';
import { UserInterests } from './user_interests.entity';

@Entity('user')
export class User {
  @Column('uuid') // Use UUID for primary key
  id: string;

  @Column('varchar', { length: 25, primary: true  })
  email: string;

  @Column('varchar', { length: 25 })
  name: string;

  @Column('varchar', { length: 64 })
  password_hash: string;

  @Column('timestamp', { default: new Date() })
  created_date: Date = new Date();

  @Column('timestamp', { default: new Date() })
  updated_at: Date = new Date();

  @OneToMany(() => UserInterests, (userInterests) => userInterests.users, {
    eager: true,
  })
  users: UserInterests[];
}
