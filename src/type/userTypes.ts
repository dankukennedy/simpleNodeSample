import type{ Request } from 'express';
export interface IUserPayload {
    id: number;
    username: string;
    role:'user'|'admin';
    email: string;
    password: string;
}
export interface AuthRequest extends Request {
    user?: IUserPayload;
}
