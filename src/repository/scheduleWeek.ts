import { EntityRepository, Repository, FindManyOptions } from "typeorm";
import { ScheduleWeek } from "../entity/scheduleWeek";

interface ScheduleWeekOptions {
    scheduleList?: number
    scheduleType?: number
    activeSchedule?: boolean
    activeScheduleType?: boolean
    take?: number
    skip?: number
}

@EntityRepository(ScheduleWeek)
export class ScheduleWeekRepository extends Repository<ScheduleWeek> {

    customFind(options?: ScheduleWeekOptions) {

        const { take, skip, scheduleList, activeSchedule, activeScheduleType, scheduleType } = options

        const query = this.createQueryBuilder('schw')

        query.leftJoinAndSelect("schw.scheduleList", "sch")
        query.leftJoinAndSelect("schw.timeList", "tml")
        query.leftJoinAndSelect("sch.scheduleType", "schtype")

        typeof scheduleList !== "undefined"  && query.andWhere("sch.id = :scheduleList", { scheduleList })
        activeSchedule && query.andWhere("sch.isActive = 1")
        activeScheduleType && query.andWhere("(schtype.isActive = 1 OR schtype.isActive IS NULL)")
        typeof scheduleType !== "undefined"  && query.andWhere("schtype.id = :scheduleType", { scheduleType })

        query.addOrderBy("sch.startDate")
        query.addOrderBy("tml.title")

        return query
            .skip(skip)
            .take(take)
            .getManyAndCount()
    }

}