import { bootstrap } from './app.entry';

bootstrap().catch((error) => {
	console.log(error);
	process.exit(1);
});