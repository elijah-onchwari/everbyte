// import { NestFactory } from '@nestjs/core';
// import { SeedService } from './seed.service';
// import { SeedModule } from './seed.module';
// import { updateConfigs } from '../migrations';

// /**
//  * WARNING: Running this file will DELETE all data in your database
//  */
// export const seed = async () => {
// 	await updateConfigs();

// 	NestFactory.createApplicationContext(SeedModule.forPlugins(), {
// 		logger: ['log', 'error', 'warn', 'debug', 'verbose']
// 	})
// 		.then((app) => {
// 			const seedService = app.get(SeedService);
// 			seedService
// 				.runDefaultSeed()
// 				.then(() => {})
// 				.catch((error) => {
// 					throw error;
// 				})
// 				.finally(() => app.close());
// 		})
// 		.catch((error) => {
// 			throw error;
// 		});
// };
