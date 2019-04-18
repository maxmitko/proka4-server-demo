import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate, BeforeRemove } from "typeorm";
import { ProductCategory } from './productCategory'
import { ProductProperty } from './productProperty'
import { ProductProducer } from './productProducer'
import shortid from 'shortid'
import fs from 'fs'
import path from 'path'
import logger from '../utils/logger'
import { getRepository } from "typeorm";

const BASE_IMG_PATH = path.join('public', 'images', 'catalog', 'product');

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: "tinytext" })
    title?: string;

    @Column({ type: "mediumtext" })
    description?: string;

    @ManyToMany(type => ProductCategory, foreign => foreign.id)
    @JoinTable()
    categories?: ProductCategory[];

    @ManyToMany(type => ProductProperty, foreign => foreign.id)
    @JoinTable()
    properties?: ProductProperty[];

    @ManyToOne(type => ProductProducer, foreign => foreign.id)
    producer?: ProductProducer;

    @Column({ type: "int" })
    price?: number;

    @Column({ type: "int" })
    inStock?: number;

    @Column({ type: "int" })
    count?: number;

    @Column({ type: "tinytext" })
    image?: string;

    @BeforeInsert()
    @BeforeUpdate()
    async saveImage() {
        if (this.image) {
            const [meta, base64_data] = this.image.split(',');
            const [format, fileType, ext, dataBase] = meta.split(/[:;\/]/g)

            const imageName = shortid.generate()
            const imagePath = path.join(BASE_IMG_PATH, `${imageName}.${ext}`)

            fs.writeFile(imagePath, base64_data, dataBase, err => { if (err) throw err })

            this.image = base64_data ? `${imageName}.${ext}` : "blank.png"
        }
    }

    @BeforeUpdate()
    function() {
        if (this.image) this.deleteOldImage()
    }

    @BeforeRemove()
    async deleteOldImage() {
        const repo = getRepository(Product)
        const oldSrc = await repo.findOne(this.id)
        if (oldSrc.image === "blank.png") return

        const oldFilePath = path.join(BASE_IMG_PATH, oldSrc.image)

        fs.unlink(oldFilePath, err => {
            if (err) {
                const msg = `Не найден путь к старому файлу: ${oldFilePath}`
                logger.error(new Error(msg))
            } else {
                oldFilePath + ' removed'
            }
        })

    }
}