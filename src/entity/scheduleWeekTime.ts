import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Service } from './service'

@Entity('schedule_week_time')
export class ScheduleWeekTime {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    isActive: number;
}