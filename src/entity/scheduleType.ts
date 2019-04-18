import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";

@Entity('schedule_type')
export class ScheduleType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    isActive: number;
}