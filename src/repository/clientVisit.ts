import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { ClientVisit } from "../entity/clientVisit";

interface ClientVisitOptions {
    date: string
    time: string
    service: string
    take: number
    skip: number
}

@EntityRepository(ClientVisit)
export class ClientVisitRepository extends Repository<ClientVisit> {

    customFind(options?: ClientVisitOptions) {

        const { take, skip, date, time, service } = options

        const query = this.createQueryBuilder('clv')

        query.leftJoinAndSelect("clv.clientCard", "card")
        query.leftJoinAndSelect("card.user", "user")
        query.leftJoinAndSelect("card.service", "service")

        date && query.andWhere("clv.regDate = DATE(:date)", { date })
        time && query.andWhere("clv.regTime = :time", { time })
        typeof service !== "undefined"  && query.andWhere("service.id = :service", { service })

        return query
            .skip(skip)
            .take(take)
            .getManyAndCount()
    }

}