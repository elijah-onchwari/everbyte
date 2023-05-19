import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';

@Module({
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService]
})
export class EmailTemplateModule {}
