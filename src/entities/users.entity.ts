import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Comments, Images, Likes } from '.'

@Entity()
export class Users {
    // id autoicrement
    @PrimaryGeneratedColumn() 
    id: number;

    @Column("varchar", { length: 20 })
    role: string;

    @Column("varchar", { length: 100 })
    name: string;

    @Column("varchar", { length: 200 })
    surname: string;

    @Column("varchar", { length: 100 })
    nick: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("varchar", { length: 255 })
    password: string;

    @Column("varchar", { length: 255 })
    image: string;

    @Column("datetime")
    createdAt: string;

    @Column("datetime")
    updatedAt: string;

    @Column("varchar", { length: 255 })
    rememberToken: string;

    // relations
    // all likes asociated to User
    @OneToMany(
        () => Likes,
        ( like ) => like.user 
    )
    likes: Likes[]

    // all images asociated to User
    @OneToMany(
        () => Images,
        ( image ) => image.user
    )
    images: Images[]

    // all comments asociated to User
    @OneToMany(
        () => Comments,
        ( comment ) => comment.user
    )
    comments: Comments[]
}
