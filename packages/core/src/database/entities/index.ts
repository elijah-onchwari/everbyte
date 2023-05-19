import { Company } from "@modules/company/entities/company.entity";
import { RolePermission } from "@modules/role-permission/entities/role-permission.entity";
import { Role } from "@modules/role/entities/role.entity";
import { UserCompany } from "@modules/user-company/entities/user-company.entity";
import { User } from "@modules/user/entities/user.entity";

export const coreEntities = [Company, UserCompany, User, Role, RolePermission];
