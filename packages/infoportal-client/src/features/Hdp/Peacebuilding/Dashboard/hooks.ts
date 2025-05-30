import {useEffect, useMemo, useState} from 'react'
import {map, seq} from '@axanc/ts-utils'

import {KoboIndex, Period, PeriodHelper, Conflict_trainings} from 'infoportal-common'

import {appConfig} from '@/conf/AppConfig'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useI18n} from '@/core/i18n'
import {InferTypedAnswer} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {DataFilter} from '@/shared/DataFilter/DataFilter'
import {useFetcher} from '@/shared/hook/useFetcher'
import {startOfDay} from 'date-fns'

export type UsePeacebuildingData = ReturnType<typeof usePeacebuildingData>

export const usePeacebuildingData = () => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const fetcherAnswer = useKoboAnswersContext().byName('conflict_trainings')
  const fetcherPeriod = useFetcher(() => api.kobo.answer.getPeriod(KoboIndex.byName('conflict_trainings').id))

  const filterShape = useMemo(
    () =>
      DataFilter.makeShape<InferTypedAnswer<'conflict_trainings'>>({
        office: {
          icon: appConfig.icons.office,
          getValue: (_) => _.office,
          getOptions: () => DataFilter.buildOptionsFromObject(Conflict_trainings.options.office),
          label: m.office,
        },
        team: {
          icon: 'handshake',
          getValue: (_) => _.sector_team,
          getOptions: () => DataFilter.buildOptionsFromObject(Conflict_trainings.options.sector_team),
          label: m.teamConducted,
        },
        first: {
          icon: 'schedule',
          getValue: (_) => _.first_training,
          getOptions: () => DataFilter.buildOptionsFromObject(Conflict_trainings.options.first_training),
          label: m.firstTraining,
        },
        format: {
          icon: 'share',
          getValue: (_) => _.training_format,
          getOptions: () => DataFilter.buildOptionsFromObject(Conflict_trainings.options.training_format),
          label: m.format,
        },
        project: {
          icon: appConfig.icons.project,
          getValue: (_) => _.project_code,
          getOptions: () => DataFilter.buildOptionsFromObject(Conflict_trainings.options.project_code),
          label: m.project,
        },
      }),
    [m],
  )
  const [optionFilter, setOptionFilters] = useState<DataFilter.InferShape<typeof filterShape>>({})
  const [period, setPeriod] = useState<Partial<Period>>({})

  const data = seq(fetcherAnswer.get?.data) ?? []

  const normalizeDate = (d?: Date) => (d ? startOfDay(d) : undefined)

  const dataFiltered = useMemo(() => {
    const normalizedStart = normalizeDate(period.start)
    const normalizedEnd = normalizeDate(period.end)

    const filtered = DataFilter.filterData(data, filterShape, optionFilter).filter((_) => {
      const entryDate = normalizeDate(_.start)
      const isInRange = PeriodHelper.isDateIn({start: normalizedStart, end: normalizedEnd}, entryDate)
      return isInRange
    })

    return filtered
  }, [data, filterShape, optionFilter, period])

  useEffect(() => {
    map(fetcherPeriod.get, setPeriod)
  }, [fetcherPeriod.get])

  const fetcherUsers = useFetcher(api.user.search)

  useEffect(() => {
    fetcherUsers.fetch({clean: false})
  }, [])

  const drcUsers = useMemo(() => {
    return seq(fetcherUsers.get)
      .filter((user) => user.drcJob || user.drcOffice) // adjust this filter if needed
      .get()
  }, [fetcherUsers.get])

  return {
    data,
    dataFiltered,
    filterShape,
    fetcherAnswer,
    drcUsers,
    fetcherPeriod,
    optionFilter,
    setOptionFilters,
    period,
    setPeriod,
  }
}
