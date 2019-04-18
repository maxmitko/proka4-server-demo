import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";

@Entity('user_role')
export class UsersRole {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;
}