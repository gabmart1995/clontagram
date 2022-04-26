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
        ( user ) => user.comments,
        // { onDelete: 'CASCADE', cascade: true }  
    )
    user: Users;

    // if delete the publication delete child relations on cascade
    @ManyToOne(
        () => Images,
        ( image ) => image.comments,
        { onDelete: 'CASCADE', cascade: true }
    )
    image: Images
}