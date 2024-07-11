import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { isNotEmpty } from 'class-validator';
import { User } from '@workflow/data';
import { CompanyAwareCrudService } from '@workflow/core';
@Injectable()
export class UserService extends CompanyAwareCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }

  /**
   * Set Current Refresh Token
   *
   * @param refreshToken
   * @param userId
   */
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    try {
      if (refreshToken) {
        refreshToken = await bcrypt.hash(refreshToken, 10);
      }
      return await this.repository.update(userId, {
        // refreshToken: refreshToken
      });
    } catch (error) {
      console.log('Error while set current refresh token', error);
    }
  }

  /**
   * Get user if refresh token matches
   *
   * @param refreshToken
   * @param payload
   * @returns
   */
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    payload: JwtPayload
  ) {
    try {
      const { id, email, tenantId, role } = payload;
      const query = this.repository.createQueryBuilder('user');
      query.setFindOptions({
        join: {
          alias: 'user',
          leftJoin: {
            role: 'user.role',
          },
        },
      });
      query.where((query: SelectQueryBuilder<User>) => {
        query.andWhere(
          new Brackets((web: WhereExpressionBuilder) => {
            web.andWhere(`"${query.alias}"."id" = :id`, { id });
            web.andWhere(`"${query.alias}"."email" = :email`, {
              email,
            });
          })
        );
        query.andWhere(
          new Brackets((web: WhereExpressionBuilder) => {
            if (isNotEmpty(tenantId)) {
              web.andWhere(`"${query.alias}"."tenantId" = :tenantId`, {
                tenantId,
              });
            }
            if (isNotEmpty(role)) {
              web.andWhere(`"role"."name" = :role`), { role };
            }
          })
        );
        query.orderBy(`"${query.alias}"."createdAt"`, 'DESC');
      });
      const user = await query.getOneOrFail();
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        'token'
        // user.refreshToken
      );
      if (isRefreshTokenMatching) {
        return user;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async getIfExists(id: string): Promise<User> {
    return await this.repository.findOneBy({});
  }

  async getIfExistsThirdParty(thirdPartyId: string): Promise<User> {
    return await this.repository.findOneBy({
      // thirdPartyId
    });
  }
}
