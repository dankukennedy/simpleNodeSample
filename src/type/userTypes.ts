export interface IUserPayload {
    id: number;
    username: string;
}
export interface AuthRequest extends Request {
    user?: IUserPayload;
}

export interface IUser {
    id: number;
    username: string;
    password: string;
    email: string;
    role:'user'|'admin';
}

export interface IUserCredentials {
    username: string;
    password: string;
}