import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	/**
	 * Indicates that this subscriber only listen to User events.
	 */
	listenTo() {
		return User;
	}

	/**
	 * Called after entity is loaded from the database.
	 *
	 * @param entity
	 * @param event
	 */
	afterLoad(entity: User, event?: LoadEvent<User>): void | Promise<any> {
		try {
			entity.fullName = [entity.firstName, entity.lastName]
				.filter(Boolean)
				.join(' ');
		} catch (error) {
			console.log(error);
		}
	}
}
