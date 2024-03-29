import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Comments, Likes, Users } from ".";
import { getDateTime } from "src/helpers";

@Entity()
export class Images {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    imagePath: string;

    @Column("text")
    description: string;

    @CreateDateColumn()
    createdAt: string;

    @CreateDateColumn()
    updatedAt: string

    // relations
    // one user asociated to image
    
    @ManyToOne(
        () => Users,
        ( user ) => user.images,     
    )
    user: Users
    
    // all likes asosiated to image
    @OneToMany(
        () => Likes,
        ( like ) => like.image,
    )
    likes: Likes[]

    // all comments asosiated to image
    @OneToMany(
        () => Comments,
        ( comment ) => comment.image,
    )
    comments: Comments[]
}