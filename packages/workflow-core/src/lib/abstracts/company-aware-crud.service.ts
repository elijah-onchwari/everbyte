import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RequestContext } from '../context';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';
import { ITryRequest } from './try-request';
import { IPagination, IUser } from '@everbyte/contracts';
import { BaseEntity, User } from '@workflow/data';

/**
 * This abstract class adds companyId to all query filters if a user is available in the current RequestContext
 * If a user is not available in RequestContext, then it behaves exactly the same as CrudService
 */
export abstract class CompanyAwareCrudService<T extends BaseEntity>
  extends CrudService<T>
  implements ICrudService<T>
{
  constructor(repository: Repository<T>) {
    super(repository);
  }

  private findConditionsWithCompanyByUser(user: IUser): FindOptionsWhere<T> {
    return {
      ...(this.repository.metadata.hasColumnWithPropertyPath('companyId')
        ? {
            company: {
              id: user.companyId,
            },
            companyId: user.companyId,
          }
        : {}),
    } as FindOptionsWhere<T>;
  }

  private findConditionsWithCompany(
    user: User,
    where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>
  ): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
    if (where && Array.isArray(where)) {
      const wheres: FindOptionsWhere<T>[] = [];
      where.forEach((options: FindOptionsWhere<T>) => {
        wheres.push({
          ...options,
          ...this.findConditionsWithCompanyByUser(user),
        });
      });
      return wheres;
    }
    return (
      where
        ? {
            ...where,
            ...this.findConditionsWithCompanyByUser(user),
          }
        : {
            ...this.findConditionsWithCompanyByUser(user),
          }
    ) as FindOptionsWhere<T>;
  }

  private findOneWithCompany(filter?: FindOneOptions<T>): FindOneOptions<T> {
    const user = RequestContext.currentUser();
    if (!user || !user.companyId) {
      return filter;
    }
    if (!filter) {
      return {
        where: this.findConditionsWithCompanyByUser(user),
      };
    }
    if (!filter.where) {
      return {
        ...filter,
        where: this.findConditionsWithCompanyByUser(user),
      };
    }
    if (filter.where instanceof Object) {
      return {
        ...filter,
        where: this.findConditionsWithCompany(user, filter.where),
      };
    }
    return filter;
  }

  private findManyWithCompany(filter?: FindManyOptions<T>): FindManyOptions<T> {
    const user = RequestContext.currentUser();
    if (!user || !user.companyId) {
      return filter;
    }
    if (!filter) {
      return {
        where: this.findConditionsWithCompanyByUser(user),
      };
    }
    if (!filter.where) {
      return {
        ...filter,
        where: this.findConditionsWithCompanyByUser(user),
      };
    }
    if (filter.where instanceof Object) {
      return {
        ...filter,
        where: this.findConditionsWithCompany(user, filter.where),
      };
    }
    return filter;
  }

  /**
   * Counts entities that match given options.
   * Useful for pagination.
   *
   * @param options
   * @returns
   */
  public async count(options?: FindManyOptions<T>): Promise<number> {
    return await super.count(this.findManyWithCompany(options));
  }

  /**
   * Counts entities that match given options.
   * Useful for pagination.
   *
   * @param options
   * @returns
   */
  public async countBy(options?: FindOptionsWhere<T>): Promise<number> {
    const user = RequestContext.currentUser();
    return await super.countBy({
      ...options,
      ...this.findConditionsWithCompanyByUser(user),
    });
  }

  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   *
   * @param filter
   * @returns
   */
  public async findAll(filter?: FindManyOptions<T>): Promise<IPagination<T>> {
    return await super.findAll(this.findManyWithCompany(filter));
  }

  /**
   * Finds entities that match given find options.
   *
   * @param filter
   * @returns
   */
  public async find(filter?: FindManyOptions<T>): Promise<T[]> {
    return await super.find(this.findManyWithCompany(filter));
  }

  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * But includes pagination settings
   *
   * @param filter
   * @returns
   */
  public async paginate(filter?: FindManyOptions<T>): Promise<IPagination<T>> {
    return await super.paginate(this.findManyWithCompany(filter));
  }

  /*
	|--------------------------------------------------------------------------
	| @FindOneOrFail
	|--------------------------------------------------------------------------
	*/

  /**
   * Finds first entity by a given find options with current company.
   * If entity was not found in the database - rejects with error.
   *
   * @param id
   * @param options
   * @returns
   */
  public async findOneOrFailByIdString(
    id: T['id'],
    options?: FindOneOptions<T>
  ): Promise<ITryRequest<T>> {
    return await super.findOneOrFailByIdString(
      id,
      this.findOneWithCompany(options)
    );
  }

  /**
   * Finds first entity that matches given options with current company.
   * If entity was not found in the database - rejects with error.
   *
   * @param options
   * @returns
   */
  public async findOneOrFailByOptions(
    options?: FindOneOptions<T>
  ): Promise<ITryRequest<T>> {
    return await super.findOneOrFailByOptions(this.findOneWithCompany(options));
  }

  /**
   * Finds first entity that matches given where condition with current company.
   * If entity was not found in the database - rejects with error.
   *
   * @param options
   * @returns
   */
  public async findOneOrFailByWhereOptions(
    options: FindOptionsWhere<T>
  ): Promise<ITryRequest<T>> {
    const user = RequestContext.currentUser();
    return await super.findOneOrFailByWhereOptions({
      ...options,
      ...this.findConditionsWithCompanyByUser(user),
    });
  }

  /*
	|--------------------------------------------------------------------------
	| @FindOne
	|--------------------------------------------------------------------------
	*/
  /**
   * Finds first entity by a given find options with current company.
   * If entity was not found in the database - returns null.
   *
   * @param id
   * @param options
   * @returns
   */
  public async findOneByIdString(
    id: T['id'],
    options?: FindOneOptions<T>
  ): Promise<T> {
    return await super.findOneByIdString(id, this.findOneWithCompany(options));
  }

  /**
   * Finds first entity that matches given options with current company.
   * If entity was not found in the database - returns null.
   *
   * @param options
   * @returns
   */
  public async findOneByOptions(options: FindOneOptions<T>): Promise<T> {
    return await super.findOneByOptions(this.findOneWithCompany(options));
  }

  /**
   * Finds first entity that matches given where condition with current company.
   * If entity was not found in the database - returns null.
   *
   * @param options
   * @returns
   */
  public async findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T> {
    const user = RequestContext.currentUser();
    return await super.findOneByWhereOptions({
      ...options,
      ...this.findConditionsWithCompanyByUser(user),
    });
  }

  /**
   * Creates a new entity instance and copies all entity properties from this object into a new entity.
   * Note that it copies only properties that are present in entity schema.
   *
   * @param entity
   * @returns
   */
  public async create(entity: DeepPartial<T>): Promise<T> {
    const companyId = RequestContext.currentCompanyId();

    return super.create({
      ...entity,
      ...(this.repository.metadata.hasColumnWithPropertyPath('companyId')
        ? {
            company: {
              id: companyId,
            },
            companyId,
          }
        : {}),
    });
  }

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   *
   * @param entity
   * @returns
   */
  public async save(entity: DeepPartial<T>): Promise<T> {
    const companyId = RequestContext.currentCompanyId();
    return await super.save({
      ...entity,
      ...(this.repository.metadata.hasColumnWithPropertyPath('companyId')
        ? {
            company: {
              id: companyId,
            },
            companyId,
          }
        : {}),
    });
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   *
   * @param id
   * @param partialEntity
   * @returns
   */
  public async update(
    id: string | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<T | UpdateResult> {
    if (typeof id === 'string') {
      await this.findOneByIdString(id);
    } else if (typeof id === 'object') {
      await this.findOneByWhereOptions(id as FindOptionsWhere<T>);
    }
    return await super.update(id, partialEntity);
  }

  /**
   * DELETE source related to company
   *
   * @param criteria
   * @param options
   * @returns
   */
  public async delete(
    criteria: string | FindOptionsWhere<T>,
    options?: FindOneOptions<T>
  ): Promise<DeleteResult> {
    try {
      let record: T;
      if (typeof criteria === 'string') {
        record = await this.findOneByIdString(criteria, options);
      } else {
        record = await this.findOneByWhereOptions(
          criteria as FindOptionsWhere<T>
        );
      }
      if (!record) {
        throw new NotFoundException(`The requested record was not found`);
      }
      return await super.delete(criteria);
    } catch (err) {
      throw new NotFoundException(`The record was not found`, err);
    }
  }
}
