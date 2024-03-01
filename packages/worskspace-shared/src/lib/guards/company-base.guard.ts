import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestMethodEnum } from '@everbyte/common';
import { isJSON } from 'class-validator';
import { Reflector } from '@nestjs/core';
import { RequestContext } from '@everbyte/core';

@Injectable()
export class CompanyBaseGuard implements CanActivate {
	constructor(protected readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const currentCompanyId = RequestContext.currentCompanyId();
		const request: any = context.switchToHttp().getRequest();
		const method: RequestMethodEnum = request.method;
		const { query, headers, rawHeaders } = request;

		let isAuthorized = false;
		if (!currentCompanyId) {
			return isAuthorized;
		}

		// Get company-id from request headers
		const headerCompanyId = headers['company-id'];
		if (
			headerCompanyId &&
			(rawHeaders.includes('company-id') ||
				rawHeaders.includes('Company-Id'))
		) {
			isAuthorized = currentCompanyId === headerCompanyId;
		} else {
			//If request to get/delete data using another companyId then reject request.
			const httpMethods = [
				RequestMethodEnum.GET,
				RequestMethodEnum.DELETE
			];
			if (httpMethods.includes(method)) {
				if ('companyId' in query) {
					const queryCompanyId = query['companyId'];
					isAuthorized = currentCompanyId === queryCompanyId;
				} else if (query.hasOwnProperty('data')) {
					const data: any = query.data;
					const isJson = isJSON(data);
					if (isJson) {
						try {
							const parse = JSON.parse(data);
							//Match provided companyId with logged in companyId
							if (
								'findInput' in parse &&
								'companyId' in parse['findInput']
							) {
								const queryCompanyId =
									parse['findInput']['companyId'];
								isAuthorized =
									currentCompanyId === queryCompanyId;
							} else {
								//If companyId not found in query params
								return false;
							}
						} catch (e) {
							console.log('Json Parser Error:', e);
							return isAuthorized;
						}
					}
				} else {
					//If companyId not found in query params
					isAuthorized = false;
				}
			}

			// If request to save/update data using another companyId then reject request.
			const payloadMethods = [
				RequestMethodEnum.POST,
				RequestMethodEnum.PUT,
				RequestMethodEnum.PATCH
			];
			if (payloadMethods.includes(method)) {
				const body: any = request.body;
				let bodyCompanyId: string;
				if ('companyId' in body) {
					bodyCompanyId = body['companyId'];
				} else if ('company' in body) {
					bodyCompanyId = body['company']['id'];
				}
				isAuthorized = currentCompanyId === bodyCompanyId;
			}
		}
		if (!isAuthorized) {
			console.log(
				'Unauthorized access blocked. CompanyId:',
				headerCompanyId
			);
		}
		return isAuthorized;
	}
}
