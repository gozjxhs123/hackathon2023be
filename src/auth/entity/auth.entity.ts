import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class authEntity {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    userID: number;

    @Column({
        type: 'varchar'
    })
    userStrID: string;

    @Column({
        type: 'varchar'
    })
    userPW: string;
}