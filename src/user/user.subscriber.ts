import { compare } from 'bcrypt';
import { AuthProvider } from 'src/common/providers/auth.provider';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { User } from './entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  // The listenTo method specifies the entity to which this subscriber listens
  listenTo() {
    return User;
  }

  // This method is called before inserting a new user into the database
  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    if (entity.password) {
      // Generate a hashed password using the AuthenticationProvider
      entity.password = await AuthProvider.generateHash(entity.password);
    }
  }

  // This method is called before updating a user in the database
  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password) {
      // Generate a hashed password using the AuthenticationProvider
      const isPasswordCorrect = await compare(
        entity.password,
        databaseEntity?.password,
      );

      // Compare the new password with the existing password in the database
      // Only update the password if it has changed
      if (isPasswordCorrect) {
        entity.password = await AuthProvider.generateHash(entity.password);
      }
    }
  }
}
