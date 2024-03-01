import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpException,
	BadRequestException,
	Logger
} from '@nestjs/common';
import { Observable, of as observableOf, catchError, map, throwError } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { ApiErrorResponse } from './api-error.response';
import { RequestContext } from '../context';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger(TransformInterceptor.name);

	intercept(
		ctx: ExecutionContext,
		next: CallHandler
	): Observable<any> {
		return next
			.handle()
			.pipe(
				map((data) => instanceToPlain(data)),
				catchError((err: any) => {

					// Logging for debugging purposes
					if (err.status >= 400 && err.status < 500) {
						this.logger.debug(
							`[${RequestContext.currentRequestId()}] ${err.message}`,
						);

						const isClassValidatorError =
							Array.isArray(err?.response?.message) &&
							typeof err?.response?.error === 'string' &&
							err.status === 400;
						// Transforming class-validator errors to a different format
						if (isClassValidatorError) {
							err = new BadRequestException(
								new ApiErrorResponse({
									statusCode: err.status,
									message: 'Validation error',
									error: err?.response?.error,
									subErrors: err?.response?.message,
									correlationId: RequestContext.currentRequestId(),
								}),
							);
						}
					}

					// Adding request ID to error message
					if (!err.correlationId) {
						err.correlationId = RequestContext.currentRequestId();
					}

					if (err.response) {
						err.response.correlationId = err.correlationId;
					}

					return throwError(err);

					// if (error instanceof BadRequestException) {
					// 	return observableOf(
					// 		new BadRequestException(
					// 			error.getResponse()
					// 		)
					// 	);
					// }
					// return observableOf(
					// 	new HttpException(
					// 		error.message,
					// 		error.status
					// 	)
					// );
				})
			);
	}
}

