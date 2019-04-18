import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('product_category')
export class ProductCategory {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "tinytext" })
    title?: string;

    @Column({ type: "text" })
    description?: string;
}