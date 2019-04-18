import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from './users'

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "datetime" })
    timeAdd?: string;

    @Column({ type: "datetime" })
    timeDone?: string;

    @Column({ type: "tinyint" })
    status?: Status;

    @ManyToOne(type => Users, foreign => foreign.id)
    user?: Users;

    @Column({ type: "tinytext" })
    customer?: string;

    @Column({ type: "tinytext" })
    phone?: string;
}

enum Status { done, inProcess, rejected }