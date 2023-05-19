// NOTE: do NOT ever put here any secure settings! (e.g. Secret Keys)
// We are using dotenv (.env) for consistency with other Platform projects
// This is Angular app and all settings will be loaded into the client browser!

import { cleanEnv, str, bool } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

export type Env = Readonly<{
	production: boolean;
	APP_URL: string;
	CLIENT_URL: string;
	IS_DEMO: boolean;
	IS_DOCKER: boolean;
}>;

export const env: Env = cleanEnv(process.env, {
	production: bool({ default: false }),
	APP_URL: str({ default: 'http://localhost:3000' }),
	CLIENT_URL: str({ default: 'http://localhost:4200' }),
	IS_DEMO: bool({ default: false }),
	IS_DOCKER: bool({ default: false })
});
