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

    @Column("datetime", getDateTime())
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

function getDateTime() {
    
    const date = new Date();
    let dateTime = "" + date.getFullYear()
    dateTime += "-" + ( date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1) );
    dateTime += "-" + ( date.getDate() > 9 ? date.getDate() : '0' + date.getDate() );
    dateTime += " " + ( date.getHours() > 9 ? date.getHours() : '0' + date.getHours()); 
    dateTime += ":" + ( date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
    
    return { default: dateTime };
}
