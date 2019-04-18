import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Service } from './service'

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    count: number;
      
    @Column()
    title: string;
    
    @Column()
    price: number;

    @ManyToOne(type => Service, foreign => foreign.id)
    service: Service;
}