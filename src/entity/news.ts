import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class News {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "tinytext" })
    title: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "tinytext" })
    topic: number;

    @Column({ type: "datetime" })
    startDate: string;

    @Column({ type: "datetime" })
    endDate: string;

    @Column({ type: "tinytext" })
    linkHash: String;
}