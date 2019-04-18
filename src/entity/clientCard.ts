import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, BeforeInsert } from "typeorm";
import { Service } from './service'
import { Users } from './users'
import { ClientVisit } from './clientVisit'

@Entity('client_card')
export class ClientCard {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Service, foreign => foreign.id)
    service: Service;

    @ManyToOne(type => Users, foreign => foreign.id)
    user: Users;

    @OneToMany(type => ClientVisit, entity => entity.clientCard)
    visits: ClientVisit[];

    @Column()
    count: string;

    @Column()
    price: string;

    @Column()
    debt: number;

    // @ManyToOne(type => Discount, dsc => dsc.id)
    // @JoinColumn({ name: "discount_id" })
    // discount: Discount;

    @Column()
    isActive: number;

    @Column({ type: "datetime" })
    purchaseTime: string;
}