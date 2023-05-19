// NOTE: do NOT ever put here any secure settings! (e.g. Secret Keys)
// We are using dotenv (.env) for consistency with other Platform projects
// This is Angular app and all settings will be loaded into the client browser!

import { env } from './env';
import { writeFile, unlinkSync } from 'fs';
import yargs from 'yargs/yargs';
const argv = yargs(process.argv.slice(2))
	.options({
		environment: { type: 'string', default: 'dev' }
	})
	.parseSync();

const isProd = argv?.environment === 'prod';

let envFileContent: string;

envFileContent = `// NOTE: Auto-generated file
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses 'environment.ts', but if you do
// 'ng build --env=prod' then 'environment.prod.ts' will be used instead.
// The list of which env maps to which file can be found in '.angular-cli.json'.
declare const window:any;

// import { Environment } from './model';

`;

if (!env.IS_DOCKER) {
	envFileContent += `

	let APP_URL = '${env.APP_URL}';
	let CLIENT_URL = '${env.CLIENT_URL}';

	try {
		if (window._env && window._env.api) {
			APP_URL = window._env.api;
		}
	
		if (window._env && window._env.api) {
			CLIENT_URL = window.location.origin;
		}
	} catch(e) {}

	export const environment: Environment = 
	{
		production:  ${isProd},

		API_BASE_URL: APP_URL,
		CLIENT_BASE_URL: CLIENT_URL,


		GOOGLE_AUTH_LINK: API_BASE_URL + '/api/auth/google',
		FACEBOOK_AUTH_LINK: API_BASE_URL + '/api/auth/facebook',
		LINKEDIN_AUTH_LINK: API_BASE_URL + '/api/auth/linkedin',
		GITHUB_AUTH_LINK: API_BASE_URL + '/api/auth/github',
		TWITTER_AUTH_LINK: API_BASE_URL + '/api/auth/twitter',
		MICROSOFT_AUTH_LINK: API_BASE_URL + '/api/auth/microsoft',
	

		IS_DEMO: ${env.IS_DEMO},
	};	
	`;
} else {
	envFileContent += `

	let APP_URL = 'DOCKER_API_BASE_URL';
	let CLIENT_URL = 'DOCKER_CLIENT_BASE_URL';


	export const environment: Environment = 
	{
		production:  ${isProd},

		API_BASE_URL: APP_URL,
		CLIENT_BASE_URL: CLIENT_URL,

		API_BASE_URL: APP_URL,
		CLIENT_BASE_URL: CLIENT_URL,

		GOOGLE_AUTH_LINK: API_BASE_URL + '/api/auth/google',
		FACEBOOK_AUTH_LINK: API_BASE_URL + '/api/auth/facebook',
		LINKEDIN_AUTH_LINK: API_BASE_URL + '/api/auth/linkedin',
		GITHUB_AUTH_LINK: API_BASE_URL + '/api/auth/github',
		TWITTER_AUTH_LINK: API_BASE_URL + '/api/auth/twitter',
		MICROSOFT_AUTH_LINK: API_BASE_URL + '/api/auth/microsoft',

		IS_DEMO: ${env.IS_DEMO},
	};
`;
}

if (!isProd) {
	envFileContent += `

	// For easier debugging in development mode, you can import the following file
	// to ignore zone related error stack frames such as 'zone.run', 'zoneDelegate.invokeTask'.
	import 'zone.js';  // Included with Angular CLI.

	`;
}

// we always want first to remove old generated files (one of them is not needed for current build)
try {
	unlinkSync(`./apps/everbyte/src/environments/environment.ts`);
} catch {}
try {
	unlinkSync(`./apps/everbyte/src/environments/environment.prod.ts`);
} catch {}

const envFileDest: string = isProd ? 'environment.prod.ts' : 'environment.ts';
const envFileDestOther: string = !isProd
	? 'environment.prod.ts'
	: 'environment.ts';

writeFile(
	`./apps/everbyte/src/environments/${envFileDest}`,
	envFileContent,
	function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log(`Generated Angular environment file: ${envFileDest}`);
		}
	}
);

writeFile(
	`./apps/everbyte/src/environments/${envFileDestOther}`,
	'',
	function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log(
				`Generated Second Empty Angular environment file: ${envFileDestOther}`
			);
		}
	}
);
