import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ScheduleType } from './scheduleType'

@Entity()
export class ScheduleList {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    color: string;

    @Column({ type: "datetime" })
    startDate: string;

    @Column({ type: "datetime" })
    endDate: string;

    @ManyToOne(type => ScheduleType, foreign => foreign.id)
    scheduleType: ScheduleType;

    @Column()
    isActive: number;

    @Column()
    comments: string;

}