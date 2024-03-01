import { ConfigModule } from '@workflow/config';
import { DynamicModule, Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  imports: [ConfigModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {
  static forPlugins(): DynamicModule {
    return {
      module: SeedModule,
      providers: [],
      imports: [],
      exports: [],
    } as DynamicModule;
  }
}
