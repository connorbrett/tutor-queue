import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, database, protocol }: dbConfig = config.get('dbConfig');
const { DB_USERNAME, DB_PASSWORD } = process.env;
export const dbConnection = {
  url: `${protocol || 'mongodb'}://${DB_USERNAME}:${DB_PASSWORD}@${host}${!protocol ? `:${port}` : ''}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
