import { Test, TestingModule } from '@nestjs/testing';
import { UserCompanyService } from './user-company.service';

describe('UserCompanyService', () => {
  let service: UserCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCompanyService],
    }).compile();

    service = module.get<UserCompanyService>(UserCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
