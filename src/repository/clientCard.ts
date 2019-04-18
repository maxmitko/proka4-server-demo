import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { ClientCard } from "../entity/clientCard";

interface ClientCardOptions {
    expiredDate: boolean
    service: number
    user: number
    take: number
    skip: number
}

@EntityRepository(ClientCard)
export class ClientCardRepository extends Repository<ClientCard> {

    customFind(options?: ClientCardOptions) {

        const { user, service, take, skip, expiredDate } = options

        const query = this.createQueryBuilder('clc')

        query.leftJoinAndSelect("clc.user", "user")
        query.leftJoinAndSelect("clc.service", "service")
        query.leftJoinAndSelect("clc.visits", "cltv")

        expiredDate && query.andWhere(`TO_DAYS(NOW()) - TO_DAYS(clc.purchaseTime) ${expiredDate ? '>=' : '<'} DAY(LAST_DAY(clc.purchaseTime))`)

        typeof service !== "undefined" && query.andWhere("service.id = :service", { service });
        typeof user !== "undefined" && query.andWhere("user.id = :user", { user });

        return query
            .skip(skip)
            .take(take)
            .getManyAndCount()
    }

}