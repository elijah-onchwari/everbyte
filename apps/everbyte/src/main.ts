import { bootstrap } from '@everbyte/api';

bootstrap().catch((error) => {
	console.log(error);
	process.exit(1);
});