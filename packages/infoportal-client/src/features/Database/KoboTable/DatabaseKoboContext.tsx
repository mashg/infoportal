import {createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction} from 'react'
import {Obj, seq} from '@axanc/ts-utils'
import * as csvToJson from 'csvtojson'
import {Kobo} from 'kobo-sdk'

import {KoboSchemaHelper} from 'infoportal-common'

import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboForm, KoboMappedAnswer} from '@/core/sdk/server/kobo/KoboMapper'
import {DatabaseDisplay} from '@/features/Database/KoboTable/groupDisplay/DatabaseKoboDisplay'
import {databaseCustomMapping} from '@/features/Database/KoboTable/customization/customMapping'
import {UseDatabaseView, useDatabaseView} from '@/features/Database/KoboTable/view/useDatabaseView'
import {useAsync, UseAsyncSimple} from '@/shared/hook/useAsync'
import {useFetcher} from '@/shared/hook/useFetcher'
import {FetchParams} from '@/shared/hook/useFetchers'
import {useObjectState, UseObjectStateReturn} from '@/shared/hook/useObjectState'
import {AccessSum} from '@/core/sdk/server/access/Access'

export type ExternalFilesChoices = {list_name: string; name: string; label: string}
export type KoboExternalFilesIndex = Record<string, Record<string, ExternalFilesChoices>>

export interface DatabaseKoboContext {
  refetch: (p?: FetchParams) => Promise<void>
  schema: KoboSchemaHelper.Bundle
  canEdit?: AccessSum
  access: AccessSum
  form: KoboForm
  asyncRefresh: UseAsyncSimple<() => Promise<void>>
  asyncEdit: (answerId: Kobo.SubmissionId) => string
  data?: KoboMappedAnswer[]
  loading?: boolean
  setData: Dispatch<SetStateAction<KoboMappedAnswer[]>>
  externalFilesIndex?: KoboExternalFilesIndex
  view: UseDatabaseView
  groupDisplay: UseObjectStateReturn<DatabaseDisplay>
}

const Context = createContext({} as DatabaseKoboContext)

export const useDatabaseKoboTableContext = () => useContext<DatabaseKoboContext>(Context)

export const DatabaseKoboTableProvider = (props: {
  schema: KoboSchemaHelper.Bundle
  dataFilter?: (_: KoboMappedAnswer) => boolean
  children: ReactNode
  loading?: boolean
  refetch: (p?: FetchParams) => Promise<void>
  access: DatabaseKoboContext['access']
  form: DatabaseKoboContext['form']
  data?: KoboMappedAnswer[]
}) => {
  const {form, data, children, refetch} = props
  const {api} = useAppSettings()
  const [indexExternalFiles, setIndexExternalFiles] = useState<KoboExternalFilesIndex>()

  const fetcherExternalFiles = useFetcher<() => Promise<{file: string; csv: string}[]>>(async () => {
    return await Promise.all(
      props.schema.schema.files.map((file) =>
        api.koboApi
          .proxy({method: 'GET', url: file.content, formId: form.id})
          .then((csv: string) => ({file: file.metadata.filename, csv}))
          .catch(() => {
            console.error(`Cannot get Kobo external files ${file.metadata.filename} from ${file.content}`)
            return undefined
          }),
      ),
    ).then((_) => seq(_).compact())
  })

  useEffect(() => {
    fetcherExternalFiles.fetch().then(async (res) => {
      const jsons: ExternalFilesChoices[][] = await Promise.all(
        res.map((_) => csvToJson.default({delimiter: ';'}).fromString(_.csv)),
      )
      const indexed = jsons.map((_) => seq(_).groupByFirst((_) => _.name))
      const indexes = seq(res).map((_, i) => ({file: _.file, index: indexed[i]}))
      setIndexExternalFiles(
        Obj.mapValues(
          seq(indexes).groupByFirst((_) => _.file),
          (_) => _.index,
        ),
      )
    })
  }, [props.schema.schema])

  const mapData = (data: KoboMappedAnswer[]) => {
    const mapped = databaseCustomMapping[form.id]
      ? data?.map((_) => {
          return databaseCustomMapping[form.id](_)
        })
      : data

    return props.dataFilter ? mapped.filter(props.dataFilter) : mapped
  }

  const asyncRefresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(form.id)
    await refetch({force: true, clean: false})
  })

  const asyncEdit = (answerId: Kobo.SubmissionId) => api.koboApi.getEditUrl({formId: form.id, answerId})

  const [mappedData, setMappedData] = useState<KoboMappedAnswer[] | undefined>(undefined)

  useEffect(() => {
    if (data) setMappedData(mapData(data))
  }, [data, props.dataFilter]) // dataFilter triggers filtering from external filter set

  const view = useDatabaseView(form.id)
  const groupDisplay = useObjectState<DatabaseDisplay>({
    repeatAs: undefined,
    repeatGroupName: props.schema.helper.group.search({depth: 1})?.[0]?.name,
  })

  return (
    <Context.Provider
      value={{
        ...props,
        externalFilesIndex: indexExternalFiles,
        asyncRefresh,
        asyncEdit,
        view,
        groupDisplay,
        data: mappedData,
        setData: setMappedData as Dispatch<SetStateAction<KoboMappedAnswer[]>>,
      }}
    >
      {children}
    </Context.Provider>
  )
}
