import { bootstrap } from '@workflow/api';

bootstrap().catch((error) => {
  console.log(error);
  process.exit(1);
});
