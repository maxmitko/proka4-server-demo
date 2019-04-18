import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { OrdersBook } from "../entity/ordersBook";

interface ClientCardOptions {
    user?: number
    status?: number
}

@EntityRepository(OrdersBook)
export class OrdersBookRepository extends Repository<OrdersBook> {

    customFind(options?: ClientCardOptions) {

        const { user, status } = options

        const query = this.createQueryBuilder('orbook')

        query.leftJoinAndSelect("orbook.order", "ord")
        query.leftJoinAndSelect("orbook.product", "prod")
        query.leftJoinAndSelect("ord.user", "usr")
        query.leftJoinAndSelect("prod.properties", "props")

        typeof user !== "undefined" && query.andWhere("usr.id = :user", { user });
        typeof status !== "undefined" && query.andWhere("ord.status = :status", { status });

        query.addOrderBy("ord.timeAdd", "DESC")

        return query
            .getManyAndCount()
    }

}