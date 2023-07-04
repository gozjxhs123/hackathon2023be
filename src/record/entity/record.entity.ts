import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class recordEntity {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    recordID: number;

    @Column({
        type: 'integer'
    })
    userID: number;

    @Column({
        type: 'date'
    })
    recordDate: string;

    @Column({
        type: 'time'
    })
    recordTime: string;
}