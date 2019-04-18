import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate, BeforeInsert } from "typeorm";
import { IsEmail, IsMobilePhone, IsNumber, IsNotEmpty, MinLength, MaxLength, Validate, ValidateIf, IsEmpty } from "class-validator";
import { UsersRole } from './userRole'
import cryptPassword from '../utils/cryptPassword'
import { isUnique } from "../utils/customValidator";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id?: number;

    @Validate(isUnique, { groups: ["signup"] })
    @MinLength(3, { message: "Имя не меньше 3 символов", groups: ["signup"] })
    @Column()
    username?: string;


    @ValidateIf(p => !!p.password, { groups: ["profile"] })
    @MinLength(6, { message: "Пароль не меньше 6 символов", groups: ["signup", "profile"] })
    @MaxLength(20, { message: "Пароль не более 20 символов", groups: ["signup", "profile"] })
    @Column({ select: false })
    password?: string;

    @Column()
    fullname?: string;

    @Validate(isUnique, { groups: ["signup"] })
    @IsNotEmpty({ message: "EMAIL пустой", groups: ["signup"] })
    @IsEmail(undefined, { message: "неверный формат EMAIL", groups: ["signup"] })
    @Column()
    email?: string;

    // @IsMobilePhone('ru-RU', { message: "Неверное введен номер телефона", groups: ["profile"] })
    @Column()
    phone?: string;

    @IsNumber(null, { message: "Неверный формат поля money" })
    @Column()
    money?: number;

    @Column()
    isActive?: number;

    @ManyToOne(type => UsersRole, foreign => foreign.id)
    role?: UsersRole;

    @Column({ type: "datetime" })
    regDate?: string;

    @Column({ type: "datetime" })
    lastAct?: string;

    @BeforeUpdate()
    @BeforeInsert()
    cryptPassword?() {
        this.password = cryptPassword(this.password)
    }
}