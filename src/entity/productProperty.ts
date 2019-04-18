import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { ProductPropertyType } from './productPropertyType'

@Entity('product_property')
export class ProductProperty {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "text" })
    description?: string;

    @ManyToOne(type => ProductPropertyType, foreign => foreign.id)
    type?: ProductPropertyType;
}