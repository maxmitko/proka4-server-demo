import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_property_type')
export class ProductPropertyType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "tinytext" })
    title: string;
}