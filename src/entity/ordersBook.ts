import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Orders } from './orders'
import { Product } from './product'

@Entity('orders_book')
export class OrdersBook {

    @PrimaryGeneratedColumn()
    id?: number;
    
    @ManyToOne(type => Orders, foreign => foreign.id)
    order?: Orders;

    @ManyToOne(type => Product, foreign => foreign.id)
    product?: Product;

    @Column()
    count?: number;

}