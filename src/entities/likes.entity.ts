import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Images, Users } from '.';

@Entity()
export class Likes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("datetime")
    createdAt: string;

    @Column("datetime")
    updatedAt: string;

    // user asociated to like
    @ManyToOne(
        () => Users,
        ( user ) => user.likes,
    )
    user: Users;
    
    // image asociated to like
    // if delete the publication delete child relations on cascade
    @ManyToOne(
        () => Images,
        ( image ) => image.likes,
        { onDelete: 'CASCADE', cascade: true } 
    )
    image: Images;
}
