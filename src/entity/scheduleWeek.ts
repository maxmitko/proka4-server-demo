import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ScheduleList } from './scheduleList'
import { ScheduleWeekTime } from './scheduleWeekTime'

@Entity('schedule_week')
export class ScheduleWeek {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ScheduleList, foreign => foreign.id)
    scheduleList: ScheduleList;

    @ManyToOne(type => ScheduleWeekTime, foreign => foreign.id)
    timeList: ScheduleWeekTime;

    @Column({ type: 'json' })
    weekDays: null | Object[];
}