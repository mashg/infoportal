import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {
  DrcOffice,
  DrcProject,
  KoboIndex,
  KoboSubmissionFlat,
  KoboXmlMapper,
  Meal_cashPdm,
  Meal_shelterPdm,
  OblastIndex,
  OblastName,
  Period,
  Meal_nfiPdm,
  Person,
  Protection_gbvPdm,
  Legal_pam,
  Meal_pssPdm,
  Meal_eorePdm,
  Ecrec_cashRegistration,
} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {match, map, seq, Seq} from '@axanc/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'

export enum PdmType {
  Cash = 'Cash',
  Shelter = 'Shelter',
  Nfi = 'Nfi',
  Gbv = 'Gbv',
  Legal = 'Legal',
  Pss = 'Pss',
  Eore = 'Eore',
  Ecrec = 'Ecrec',
}

export type PdmForm =
  | Meal_cashPdm.T
  | Meal_shelterPdm.T
  | Meal_nfiPdm.T
  | Protection_gbvPdm.T
  | Legal_pam.T
  | Meal_pssPdm.T
  | Meal_eorePdm.T
  | Ecrec_cashRegistration.T

export type PdmData<T extends PdmForm> = {
  type: PdmType
  oblast?: OblastName
  project: DrcProject | undefined
  office?: DrcOffice | undefined
  persons?: Person.Details[]
  answers: KoboSubmissionFlat<T>
}

export interface MealPdmDashboardContext {
  fetcherAnswers: UseFetcher<(filter: Partial<Period>) => Promise<Seq<PdmData<PdmForm>>>>
  fetcherPeriod: UseFetcher<() => Promise<Period>>
  periodFilter: Partial<Period>
  setPeriodFilter: Dispatch<SetStateAction<Partial<Period>>>
  answersIndex?: Record<Kobo.SubmissionId, PdmData<PdmForm>>
}

const Context = React.createContext({} as MealPdmDashboardContext)

export const useMealPdmContext = () => useContext<MealPdmDashboardContext>(Context)

export const MealPdmProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (): Promise<Seq<PdmData<PdmForm>>> => {
    return Promise.all([
      api.kobo.typedAnswers.search.meal_cashPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Cash,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          project: match(record.donor!)
            .cases({
              ukr000270_pofu: DrcProject['UKR-000270 Pooled Funds'],
              ukr000298_novo: DrcProject['UKR-000298 Novo-Nordisk'],
              ukr000360_novo: DrcProject['UKR-000360 Novo-Nordisk'],
              ukr000322_echo: DrcProject['UKR-000322 ECHO2'],
              ukr000314_uhf4: DrcProject['UKR-000314 UHF4'],
              ukr000348_bha_llh: DrcProject['UKR-000348 BHA3'],
              ukr000352_uhf7: DrcProject['UKR-000352 UHF7'],
              ukr000347_danida: DrcProject['UKR-000347 DANIDA'],
              ukr000330_sdc: DrcProject['UKR-000330 SDC2'],
              ukr000336_uhf6: DrcProject['UKR-000336 UHF6'],
              ukr000345_bha: DrcProject['UKR-000345 BHA2'],
              ukr000363_uhf8: DrcProject['UKR-000363 UHF8'],
              ukr000340_augustinus_fonden_mpca: DrcProject['UKR-000340 Augustinus Fonden'],
              ukr000341_hoffman_husmans_fond_mpca: DrcProject['UKR-000341 Hoffmans & Husmans'],
              ukr000342_private_funds: DrcProject['UKR-000342 Pooled Funds'],
              ukr000372_echo3: DrcProject['UKR-000372 ECHO3'],
              other: DrcProject['Other'],
            })
            .default(() => undefined),
          office: match(record.office!)
            .cases({
              dnipro: DrcOffice.Dnipro,
              kharkiv: DrcOffice.Kharkiv,
              chernihiv: DrcOffice.Chernihiv,
              sumy: DrcOffice.Sumy,
              mykolaiv: DrcOffice.Mykolaiv,
              lviv: DrcOffice.Lviv,
              zaporizhzhya: DrcOffice.Zaporizhzhya,
              slovyansk: DrcOffice.Sloviansk,
            })
            .default(() => undefined),
          persons: KoboXmlMapper.Persons.cash_pdm(record),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_shelterPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Shelter,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          project: match(record.Donor!)
            .cases({
              novo: DrcProject['UKR-000298 Novo-Nordisk'],
              unhcr: DrcProject['UKR-000308 UNHCR'],
              echo: DrcProject['UKR-000322 ECHO2'],
              uhf4: DrcProject['UKR-000314 UHF4'],
              uhf6: DrcProject['UKR-000336 UHF6'],
              ukr000345_bha2: DrcProject['UKR-000345 BHA2'],
              ukr000363_uhf8: DrcProject['UKR-000363 UHF8'],
              ukr000372_echo: DrcProject['UKR-000372 ECHO3'],
              ukr000390_uhf9: DrcProject['UKR-000390 UHF9'],
              ukr000399_sdc3: DrcProject['UKR-000399 SDC3'],
              other: DrcProject['Other'],
            })
            .default(() => undefined),
          office: KoboXmlMapper.office(record.office),
          persons: KoboXmlMapper.Persons.shelter_pdm(record),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_nfiPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Nfi,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          project: match(record.donor!)
            .cases({
              bha: DrcProject['UKR-000284 BHA'],
              '345_bha': DrcProject['UKR-000345 BHA2'],
              echo2: DrcProject['UKR-000322 ECHO2'],
              sdc: DrcProject['UKR-000330 SDC2'],
              okf: DrcProject['UKR-000309 OKF'],
              pofu: DrcProject['UKR-000270 Pooled Funds'],
              frem: DrcProject['UKR-000293 French MFA'],
              danida: DrcProject['UKR-000347 DANIDA'],
              uhf4: DrcProject['UKR-000314 UHF4'],
              nono: DrcProject['UKR-000298 Novo-Nordisk'],
              sdcs: DrcProject['UKR-000330 SDC2'],
              mofa: DrcProject['UKR-000301 DANISH MoFA'],
            })
            .default(() => undefined),
          office: KoboXmlMapper.office(record.office_responsible),
          persons: KoboXmlMapper.Persons.nfi_pdm(record),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.protection_gbvPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Gbv,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          project: match(record.donor!)
            .cases({
              '347_danida': DrcProject['UKR-000347 DANIDA'],
              '336_uhf6': DrcProject['UKR-000336 UHF6'],
            })
            .default(() => undefined),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.legal_pam().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Legal,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          office: KoboXmlMapper.office(record.office),
          persons: KoboXmlMapper.Persons.legal_pdm(record),
          project: match(record.project!)
            .cases({
              ukr000372_echo: DrcProject['UKR-000372 ECHO3'],
              ukr000363_uhf8: DrcProject['UKR-000363 UHF8'],
              ukr000355_dmfa: DrcProject['UKR-000355 Danish MFA'],
              ukr000304_pspu: DrcProject['UKR-000304 PSPU'],
              ukr000397_gffo: DrcProject['UKR-000397 GFFO'],
              ukr000388_bha: DrcProject['UKR-000388 BHA'],
              ukr000xxx_fcdo: DrcProject['UKR-000285 FCDO'],
            })
            .default(() => undefined),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_pssPdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Pss,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          office: match(record.gire!)
            .cases({
              od: DrcOffice.Dnipro,
              ok: DrcOffice.Kharkiv,
              oc: DrcOffice.Chernihiv,
              os: DrcOffice.Sumy,
              om: DrcOffice.Mykolaiv,
              ol: DrcOffice.Lviv,
              oy: DrcOffice.Kyiv,
            })
            .default(() => undefined),
          persons: KoboXmlMapper.Persons.pss_pdm(record),
          project: match(record.gido!)
            .cases({
              ukr000284_bha: DrcProject['UKR-000284 BHA'],
              ukr000270_pofu: DrcProject['UKR-000270 Pooled Funds'],
              ukr000298_novo: DrcProject['UKR-000298 Novo-Nordisk'],
              ukr000309_okf: DrcProject['UKR-000309 OKF'],
              ukr000314_uhf4: DrcProject['UKR-000314 UHF4'],
              ukr000322_echo2: DrcProject['UKR-000322 ECHO2'],
              ukr000329_sida: DrcProject['UKR-000329 SIDA H2R'],
              ukr000336_uhf6: DrcProject['UKR-000336 UHF6'],
              ukr000345_bha: DrcProject['UKR-000345 BHA2'],
              ukr000347_danida: DrcProject['UKR-000347 DANIDA'],
              ukr000355_dmfa: DrcProject['UKR-000355 Danish MFA'],
              ukr000363_uhf8: DrcProject['UKR-000363 UHF8'],
              ukr000372_echo3: DrcProject['UKR-000372 ECHO3'],
              ukr000423_echo4: DrcProject['UKR-000423 ECHO4'],
            })
            .default(() => undefined),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.meal_eorePdm().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Eore,
          oblast: OblastIndex.byKoboName(record.oblast!)!.name,
          office: KoboXmlMapper.office(record.office),
          persons: KoboXmlMapper.Persons.eore_pdm(record),
          project: match(record.project_id!)
            .cases({
              dutch1: DrcProject['UKR-000294 Dutch I'],
              dutch2: DrcProject['UKR-000306 Dutch II'],
              uhf5: DrcProject['UKR-000316 UHF5'],
              echo322: DrcProject['UKR-000322 ECHO2'],
              gffo331: DrcProject['UKR-000331 GFFO'],
              sida350: DrcProject['UKR-000350 SIDA'],
              uhf8_363: DrcProject['UKR-000363 UHF8'],
              ech372: DrcProject['UKR-000372 ECHO3'],
              novonordisk373: DrcProject['UKR-000373 Novo-Nordilsk'],
              danida380: DrcProject['UKR-000380 DANIDA'],
            })
            .default(() => undefined),
          answers: record,
        })),
      ),
      api.kobo.typedAnswers.search.ecrec_cashRegistration().then((_) =>
        seq(_.data).map((record) => ({
          type: PdmType.Ecrec,
          oblast: OblastIndex.byKoboName(record.ben_det_oblast!)!.name,
          project: match(record.back_donor!)
            .cases({
              '372_echo': DrcProject['UKR-000372 ECHO3'],
              '363_uhf8': DrcProject['UKR-000363 UHF8'],
              uhf7: DrcProject['UKR-000352 UHF7'],
              uhf6: DrcProject['UKR-000336 UHF6'],
            })
            .default(() => undefined),
          office: match(record.back_office!)
            .cases({
              dnk: DrcOffice.Dnipro,
              hrk: DrcOffice.Kharkiv,
              chj: DrcOffice.Chernihiv,
              umy: DrcOffice.Sumy,
              nlv: DrcOffice.Mykolaiv,
              lwo: DrcOffice.Lviv,
              zap: DrcOffice.Zaporizhzhya,
              khe: DrcOffice.Kherson,
            })
            .default(() => undefined),
          persons: KoboXmlMapper.Persons.ecrec_cashRegistration(record),
          answers: record,
        })),
      ),
    ]).then((results) => seq(results.flat()))
  }

  const fetcherPeriod = useFetcher(() => {
    return Promise.all([
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_cashPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_shelterPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_nfiPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('protection_gbvPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('legal_pam').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_pssPdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('meal_eorePdm').id),
      api.kobo.answer.getPeriod(KoboIndex.byName('ecrec_cashRegistration').id),
    ]).then(([cashPeriod, shelterPeriod, nfiPeriod, gbvPeriod, legalPeriod, pssPeriod, eorePeriod, ecrecPeriod]) => ({
      cashPeriod,
      shelterPeriod,
      nfiPeriod,
      gbvPeriod,
      legalPeriod,
      pssPeriod,
      eorePeriod,
      ecrecPeriod,
    }))
  })

  const fetcherAnswers = useFetcher(request)

  const answersIndex = useMemo(() => {
    return seq(fetcherAnswers.get).groupByFirst((_) => _.answers.id)
  }, [fetcherAnswers.get])

  useEffect(() => {
    fetcherPeriod.fetch()
  }, [])

  useEffect(() => {
    map(fetcherPeriod.get, setPeriodFilter)
  }, [fetcherPeriod.get])

  useEffect(() => {
    fetcherAnswers.fetch({force: true, clean: false})
  }, [periodFilter])

  return (
    <Context.Provider
      value={{
        fetcherAnswers,
        periodFilter,
        setPeriodFilter,
        fetcherPeriod,
        answersIndex,
      }}
    >
      {children}
    </Context.Provider>
  )
}
