/**
 * This is the interface for environment object.
 * An environment object holds information about the current state of the program, such as global variables and functions.
 */
export interface IEnvironment {
	production: boolean;
	demo: boolean;
	port: number;
	appUrl: string;
	clientUrl: string;
	saltRounds: number;
	email: IEmailConfig;
}

/**
 * Email config.
 */
export interface IEmailConfig {
	host: string;
	port: number;
	secure: boolean;
	auth?: {
		user: string;
		pass: string;
	};
	fromAddress?: string;
}
