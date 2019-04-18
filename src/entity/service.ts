import fs from 'fs'
import path from 'path'

import { IsNumber } from "class-validator";
import shortid from 'shortid'
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { getRepository } from "typeorm";

import logger from '../utils/logger'

const BASE_IMG_PATH = path.join('public', 'images', 'service', '410x240');

@Entity()
export class Service {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    @Column()
    isActive?: number;

    @IsNumber(null, { message: 'Вы ввели некорректный порядковый номер.', groups: ["create"] })
    @Column({ type: "int" })
    myOrder?: number;

    @Column()
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
        const repo = getRepository(Service)
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