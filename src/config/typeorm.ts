import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'mssql',
    host: `${process.env.DATABASE_HOST}`,
    port: +`${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: true,
    options: {
        encrypt: `${process.env.DATABASE_ENCRYPT}` === "true" ? true : false,
    },
}
console.log(`DATABASE_NAME: ${process.env.DATABASE_NAME}`)
export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);