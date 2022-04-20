import { Session as ExpressSession } from 'express-session';

export type Users = {
    id: number
    name: string
    surname: string
    role: string
    nick: string
    email: string
    password: string
    confirm_password?: string
    image?: string
    createdAt?: string
    updatedAt?: string
    rememberToken?: string
};

export type Image = { 
    id: number
    imagePath: string 
    description: string 
    createdAt?: string 
    updatedAt?: string
    user?: Users,
    comments?: Comments[]
};

export type Comments = {
    id: number,
    content: string,
    createAt?: string,
    updateAt?: string
};

export type Login = {
    email: string
    password: string
};

export type SessionData = ExpressSession & Record<string, any>;