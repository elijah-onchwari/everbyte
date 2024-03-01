import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	use(req: Request, res: Response, next: NextFunction) {
		const requestContext = new RequestContext({ req, res });
		const session = cls.getNamespace(RequestContext.name) || cls.createNamespace(RequestContext.name);

		// Note: this is "session" created by "cls-hooked" lib code,
		// not related to express "session" storage at all!
		// Also, session.run essentially creates unique context for each
		// request so all data is isolated without any potential conflicts
		// for concurrent requests
		session.run(async () => {
			session.set(RequestContext.name, requestContext);
			next();
		});
	}
}
