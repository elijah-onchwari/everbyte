import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import chalk from 'chalk';
import { ConfigService } from '@everbyte/config';

@Injectable()
export class SeedService {
    log = console.log;

    dataSource: DataSource;

    constructor(private readonly configService: ConfigService) {}

    /**
     * This config is applied only for `yarn seed:*` type calls because
     * that is when connection is created by this service itself.
     */
    overrideDbConfig = {
        logging: 'all',
        logger: 'file', //Removes console logging, instead logs all queries in a file ormlogs.log
        // dropSchema: !env.production //Drops the schema each time connection is being established in development mode.
    };

    /**
     * Seed Developmnet
     */
    public async runDevSeed() {
        try {
            console.log('Dev Seed Started');

            // Establish a connection to a database
            await this.createConnection();

            // Disconnect from a database
            await this.closeConnection();

            console.log('Dev Seed Completed');
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Seed Default
     */
    public async runDefaultSeed() {
        try {
            console.log('Default Seed Started');

            // Establish a connection to a database
            await this.createConnection();

            // Disconnect from a database
            await this.closeConnection();

            console.log('Default Seed Completed');
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Create connection from database
     */
    private async createConnection() {
        if (!this.dataSource) {
            this.log(
                'NOTE: DATABASE CONNECTION DOES NOT EXIST YET. NEW ONE WILL BE CREATED!'
            );
        }
        const { dataSourceOptions } = this.configService;
        if (!this.dataSource || !this.dataSource.isInitialized) {
            try {
                this.log(chalk.green(`CONNECTING TO DATABASE...`));
                const options = {
                    ...dataSourceOptions,
                    ...this.overrideDbConfig,
                };
                const dataSource = new DataSource({
                    ...options,
                } as DataSourceOptions);

                if (!dataSource.isInitialized) {
                    this.dataSource = await dataSource.initialize();
                    this.log(chalk.green(`✅ CONNECTED TO DATABASE!`));
                }
            } catch (error) {
                this.handleError(error, 'Unable to connect to database');
            }
        }
    }

    /**
     * Close connection from database
     */
    private async closeConnection() {
        try {
            if (this.dataSource && this.dataSource.isInitialized) {
                await this.dataSource.destroy();
                this.log(chalk.green(`✅ DISCONNECTED TO DATABASE!`));
            }
        } catch (error) {
            this.log(
                'NOTE: DATABASE CONNECTION DOES NOT EXIST YET. CANT CLOSE CONNECTION!'
            );
        }
    }

    /**
     * Use this wrapper function for all seed functions which are not essential.
     * Essentials seeds are ONLY those which are required to start the UI/login
     */
    public tryExecute<T>(
        name: string,
        p: Promise<T>
    ): Promise<T> | Promise<void> {
        const now = new Date();
        const dateString = now.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        this.log(chalk.green(`${dateString} SEEDING ${name}`));

        return (p as any).then(
            (x: T) => x,
            (error: Error) => {
                this.log(
                    chalk.bgRed(
                        `🛑 ERROR: ${error ? error.message : 'unknown'}`
                    )
                );
            }
        );
    }

    private handleError(error: Error, message?: string): void {
        this.log(
            chalk.bgRed(
                `🛑 ERROR: ${message ? message + '-> ' : ''} ${
                    error ? error.message : ''
                }`
            )
        );
        throw error;
    }
}
