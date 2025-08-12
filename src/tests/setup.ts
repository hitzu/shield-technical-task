require('custom-env').env('test');

process.env.PG_HOST = process.env.PG_HOST || 'localhost';
process.env.PG_PORT = process.env.PG_PORT || '5543';
process.env.POSTGRES_USER = process.env.POSTGRES_USER || 'test';
process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'test';
process.env.POSTGRES_DB = process.env.POSTGRES_DB || 'test_db';
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test_secret';
process.env.TOKEN_SECRET_KEY =
  process.env.TOKEN_SECRET_KEY || 'test_secret_key';
process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
process.env.NODE_ENV = 'test';
