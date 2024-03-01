import { Controller } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';

@Controller('email-template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

}
