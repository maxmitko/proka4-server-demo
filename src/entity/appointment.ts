import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { IsInt, IsPhoneNumber} from "class-validator";

@Entity()
export class Appointment {

    @IsInt()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @IsPhoneNumber('Ru-ru')
    @Column()
    phone: string;
    
    @Column()
    comment: string;

    @IsInt()
    @Column()
    status: Status;
}

enum Status { done, inProcess }