import { User } from '@workflow/data';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {}
