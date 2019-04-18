import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ClientCard } from './clientCard'

@Entity('client_visit')
export class ClientVisit {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ClientCard, foreign => foreign.id)
    clientCard: ClientCard;

    @Column({ type: "tinyint" })
    visitStatus: VisitStatus;

    @Column({ type: "datetime" })
    regDate: string;

    @Column({ type: "time" })
    regTime: string;
}

enum VisitStatus { beAway, bePresent, Ignore }