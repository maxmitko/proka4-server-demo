import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_producer')
export class ProductProducer {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "tinytext" })
    name?: string;

    @Column({ type: "tinytext" })
    description?: string;

    @Column({ type: "tinytext" })
    logo?: string;

}