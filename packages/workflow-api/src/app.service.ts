import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: HttpStatus.OK,
      message: 'Everbyte API'
    };
  }
}
