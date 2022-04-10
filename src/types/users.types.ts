export interface Users {
    id: number
    name: string
    surname: string
    role: string
    nick: string
    email: string
    password: string
    image?: string
    createdAt?: string
    updatedAt?: string
    rememberToken?: string
}

export type Login = {
    email: string
    password: string
}