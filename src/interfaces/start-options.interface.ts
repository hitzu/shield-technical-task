import { Request } from 'express';

export type TypeCase = 'camel' | 'snake' | false;

export interface RequestCustom extends Request {
  token: any;
}
