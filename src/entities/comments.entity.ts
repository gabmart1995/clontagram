import { getDateTime } from "src/helpers";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users, Images } from ".";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @Column("datetime")
    createdAt: string;

    @Column("datetime")
    updatedAt: string;

    // relations
    @ManyToOne(
        () => Users,
        ( user ) => user.comments  
    )
    user: Users;

    @ManyToOne(
        () => Images,
        ( image ) => image.comments
    )
    image: Images
}