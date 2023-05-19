import { Injectable } from "@nestjs/common";
import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from "class-validator";
import { ICompany } from "@everbyte/contracts";
import { isEmpty } from "underscore";
import { RequestContext } from "@core/context";


@ValidatorConstraint({ name: "IsTenantBelongsToUser", async: true })
@Injectable()
export class IsTenantBelongsToUserConstraint implements ValidatorConstraintInterface {

	/**
     * Method to be called to perform custom validation over given value.
     */
	async validate(
		value: ICompany['id'] | ICompany,
		args: ValidationArguments
	) {
		if (isEmpty(value)) return true;

		if (typeof value === 'object') {
			return value.id === RequestContext.currentCompanyId();
		} else if (typeof value === 'string') {
			return value === RequestContext.currentCompanyId();
		} else {
			return false;
		}
	}

	/**
     * Gets default message when validation for this constraint fail.
     */
	defaultMessage(validationArguments?: ValidationArguments): string {
		const { value } = validationArguments;
		return `This user is not belongs to this tenant ${JSON.stringify(value)}.`
	}
}