import {PrismaClient} from '@prisma/client'
import {Ecrec_vetEvaluation, KoboIndex, Shelter_ta, UUID} from 'infoportal-common'
import {Pool, PoolClient} from 'pg'
import {appConf} from '../appConf'
import {PromisePool} from '@supercharge/promise-pool'
import {duration, Obj, Progress, seq} from '@axanc/ts-utils'
import {koboSdkDrc, koboSdkHumanitarian} from '../index'
import {format} from 'date-fns'
import {Kobo} from 'kobo-sdk'
import Validation = Kobo.Submission.Validation

export namespace FixKoboMigration {
  export const getBackupDbClient = async () => {
    const pool = new Pool({
      connectionString: appConf.db.backgrupUrl,
      ssl: {rejectUnauthorized: false},
    })
    console.log('Connecting...')
    const client = await pool.connect()
    console.log('Connecting... Connected !')
    return client
  }

  const generateMappingTable = async ({
    formId,
    prisma,
    backupClient,
  }: {
    prisma: PrismaClient
    backupClient: PoolClient
    formId: Kobo.FormId
  }): Promise<Record<string, string>> => {
    const newData = await prisma.koboAnswers.findMany({
      select: {
        id: true,
        uuid: true,
      },
      where: {
        deletedAt: null,
        formId,
      },
    })
    const backupData = await backupClient.query(
      `
          SELECT id, uuid
          FROM "KoboAnswers"
          WHERE "formId" = $1
            AND "deletedAt" IS NULL;
      `,
      [formId],
    )
    return seq(newData).reduceObject((d) => {
      const oldId = backupData.rows.find((_) => d.uuid === _.uuid)?.id
      return [oldId, d.id]
    })
  }

  export namespace Tags {
    type BackupData = {
      // id: Kobo.FormId
      uuid: string
      tags: Record<string, any>
    }

    export const run = async () => {
      const forms = [
        {id: 'aJaGLvGEdpYWk5ift8k87y', done: true}, //	11911 meal_cfmExternal
        {id: 'aN3Y8JeH2fU3GthrWAs9FG', done: true}, //	4326 meal_cfmInternal
        {id: 'aTP5nwZjpyR7oy7bdMZktC', done: true}, //	4338 shelter_ta
        {id: 'aKgX4MNs6gCemDQKPeXxY8', done: true}, //	31504 bn_re
        {id: 'aL8oHMzJJ9soPepvK6YU9E', done: true}, //	4690 shelter_nta
        {id: 'a4bgAsLLag7HTjjY3pSLT7', done: true}, //	1
        {id: 'a4iDDoLpUJHbu6cwsn2fnG', done: true}, //	207
        {id: 'a4Sx3PrFMDAMZEGsyzgJJg', done: true}, //	8050
        {id: 'a52hN5iiCW73mxqqfmEAfp', done: true}, //	1
        {id: 'a5kgQdqZLLNTLSmC8DK7Eq', done: true}, //	46
        {id: 'a5Noq6Wf9a8aE2cmi74FyS', done: true}, //	2
        {id: 'a62ZpworuN4nFLznsUej8r', done: true}, //	229
        {id: 'a8JXohrBDqTdCc86Ysz26r', done: true}, //	118
        {id: 'a9CjhyhTKVojCdArKmw9yM', done: true}, //	95
        {id: 'aAJNkn7v9fRL2XqQCgEkXf', done: true}, //	3
        {id: 'aCPdwVnnsYeReynJ7YnLGH', done: true}, //	75
        {id: 'aDmHHT6QzBSwwy9WZcTRrM', done: true}, //	5014
        {id: 'adpuqZypnqHb8LNfX49iA5', done: true}, //	1953
        {id: 'aE5md7RfHiy4LJmddoFAQH', done: true}, //	10101
        {id: 'aEwY33SAtdayNTeHoiJfdg', done: true}, //	1722
        {id: 'affnm5MBjwADExT9SH6Eng', done: true}, //	3
        {id: 'ag34YtGDQiW5FstyAxzy5P', done: true}, //	117
        {id: 'ag6n7kQk7vps4MYjjVoja8', done: true}, //	1
        {id: 'aGGGapARnC2ek7sA6SuHmu', done: true}, //	1907
        {id: 'aHr7429Q2n2YvBBJunx7b9', done: true}, //	119
        {id: 'ajNzDaUuLkcEvjQhVsAmao', done: true}, //	664
        {id: 'aKvvsPDBHyrZt4tZPWBsQL', done: true}, //	4
        {id: 'aLEGqicGyzkZCeCYeWqEyG', done: true}, //	3959
        {id: 'aMJL9DG8qEcULqTZTKQbrq', done: true}, //	4793
        {id: 'aNRJbxkYEH2yogyeNowXzS', done: true}, //	56
        {id: 'aoJppKLX7QvSkMYokUfEjB', done: true}, //	248
        {id: 'aPaTzi4QaCUu9F4oci4iit', done: true}, //	4
        {id: 'apn6HTbCJgwzrrGAywJdp2', done: true}, //	1
        {id: 'aQCGR2fESUNFMYKVHMyAET', done: true}, //	9279
        {id: 'aQDZ2xhPUnNd43XzuQucVR', done: true}, //	3063
        {id: 'aQgRrYdwHuvWbj23LpywPF', done: true}, //	342
        {id: 'aQHBhYgevdzw8TR2Vq2ZdR', done: true}, //	960
        {id: 'aQkWZkWjVpJsqZ3tYtuwFZ', done: true}, //	957
        {id: 'aSK3rbp4gbRWmaGUL5eN5v', done: true}, //	531
        {id: 'aVKUygTUFUYktC89rAoy5Y', done: true}, //	2
        {id: 'awpFpKtZZYEDuaZbqPi944', done: true}, //	218
        {id: 'awYf9G3sZB4grG8S4w3Wt8', done: true}, //	1605
        {id: 'axkkzwvccFtUkkL3BzSSnW', done: true}, //	476
      ]

      const prisma = new PrismaClient()
      const backup = await getBackupDbClient()

      const run = async (formId: Kobo.FormId) => {
        console.log(`Run ${KoboIndex.searchById(formId)?.translation ?? formId}...`)
        let done = 0
        const rows: BackupData[] = await backup
          .query(
            `
                SELECT uuid, tags
                FROM "KoboAnswers"
                WHERE "formId" = $1
                  AND "tags" IS NOT NULL
            `,
            [formId],
          )
          .then((_) => _.rows)
        const progress = new Progress(rows.length)

        const interval = setInterval(
          () => {
            console.log('> ' + progress.snapshot(done))
          },
          duration(20, 'second'),
        )
        await PromisePool.withConcurrency(25)
          .for(rows)
          .process(async (_) => {
            await prisma.koboAnswers.updateMany({
              data: {
                tags: _.tags,
              },
              where: {
                uuid: _.uuid,
                formId,
              },
            })
            done++
          })
        interval.unref()
        console.log(`Run ${KoboIndex.searchById(formId)?.translation ?? formId}... COMPLETED`)
      }
      await PromisePool.withConcurrency(1)
        .for(forms.filter((_) => !_.done).map((_) => _.id))
        .process(run)
    }
  }

  export namespace MealVerification {
    export const run = async () => {
      const prisma = new PrismaClient()
      const backup = await getBackupDbClient()
      const mealVerifs = await prisma.mealVerificationAnswers.findMany({
        select: {
          id: true,
          koboAnswerId: true,
        },
        where: {
          koboAnswer: {
            form: {
              serverId: '6135de52-25b8-4207-8fb7-f16f82c275d5',
            },
          },
        },
      })

      const backupData = await backup
        .query(
          `SELECT "KoboAnswers".id, "KoboAnswers".uuid
           FROM "KoboAnswers",
                "KoboForm"
           WHERE "KoboAnswers".id = ANY ($1::text[])
             AND "KoboAnswers"."formId" = "KoboForm".id
             AND "KoboForm"."serverId" = '4820279f-6c3d-47ba-8afe-47f86b16ab5d'`,
          [mealVerifs.map((_) => _.koboAnswerId)],
        )
        .then((_) => _.rows as {id: Kobo.SubmissionId; uuid: UUID}[])

      let done = 0
      const progress = new Progress(mealVerifs.length)
      const getNewId = await (async () => {
        const newIds = await prisma.koboAnswers.findMany({
          select: {
            uuid: true,
            id: true,
          },
          where: {
            form: {
              serverId: '6135de52-25b8-4207-8fb7-f16f82c275d5',
            },
            // validationStatus: {not: KoboValidation.Rejected},
            deletedAt: null,
            uuid: {in: backupData.map((_) => _.uuid)},
          },
        })
        const indexOld = seq(backupData).groupByAndApply(
          (_) => _.id,
          (_) => {
            if (_.length === 0) throw new Error(JSON.stringify(_))
            if (_.distinct((_) => _).length > 1) {
              throw new Error(JSON.stringify(_))
            }
            return _[0]?.uuid
          },
        )
        const indexNew = seq(newIds).groupByAndApply(
          (_) => _.uuid,
          (_) => {
            if (_.length !== 1) throw new Error(JSON.stringify(_))
            return _[0]?.id
          },
        )
        return (id: Kobo.SubmissionId): Kobo.SubmissionId => {
          const uuid = indexOld[id]
          const res = indexNew[uuid]
          console.log(id, '->', uuid, '->', res)
          return res
        }
      })()

      setInterval(
        () => {
          console.log(progress.snapshot(done).toString())
        },
        duration(10, 'second'),
      )

      await PromisePool.withConcurrency(10)
        .for(mealVerifs)
        .process(async (mealVerif) => {
          const newId = getNewId(mealVerif.koboAnswerId)
          if (newId) {
            await prisma.mealVerificationAnswers.update({
              data: {
                koboAnswerId: newId,
              },
              where: {
                id: mealVerif.id,
              },
            })
          }
          done++
        })
    }
  }

  export namespace GenerateShelterRepairMapping {
    export const run = async () => {
      const prisma = new PrismaClient()
      const backupClient = await getBackupDbClient()
      const mappingTable = await generateMappingTable({
        prisma,
        backupClient,
        formId: KoboIndex.byName('shelter_nta').id,
      })
      Obj.entries(mappingTable).map(([prevId, newId]) => {
        console.log(prevId + ',' + newId)
      })
    }
  }

  export namespace EcrecVet {
    export const run = async () => {
      const prisma = new PrismaClient()
      const backupClient = await getBackupDbClient()
      const mappingTable = await generateMappingTable({
        prisma,
        backupClient,
        formId: KoboIndex.byName('ecrec_vetApplication').id,
      })
      const dataEvals = await prisma.koboAnswers.findMany({
        select: {
          id: true,
          uuid: true,
          answers: true,
        },
        where: {
          deletedAt: null,
          formId: KoboIndex.byName('ecrec_vetEvaluation').id,
        },
      })
      let done = 0
      const progress = new Progress(dataEvals.length)
      setInterval(
        () => {
          console.log(progress.snapshot(done).toString())
        },
        duration(5, 'second'),
      )
      await PromisePool.withConcurrency(10)
        .for(dataEvals)
        .process(async (d) => {
          const answers = Ecrec_vetEvaluation.map(d.answers as any)
          const newId = mappingTable[answers.id_form_vet!]
          await prisma.koboAnswers.update({
            where: {
              id: d.id,
            },
            data: {
              answers: {
                ...(d.answers as any),
                id_form_vet: newId,
              },
            },
          })
          done++
          console.log(answers.id_form_vet, '=>', newId)
        })
    }
  }

  export namespace MissingSubmissions {
    export const run = async () => {
      const firstMigrationDate = new Date(2025, 0, 12)
      const secondMigrationDate = new Date(2025, 0, 23)

      console.log('Started')
      const migrateForm = async (formId: Kobo.FormId) => {
        try {
          const [answers, form] = await Promise.all([
            koboSdkHumanitarian.v2.submission
              .get({formId, filters: {start: firstMigrationDate}})
              .then((_) => _.results), //.filter((_) => _._validation_status.uid !== Validation.validation_status_approved)),
            koboSdkHumanitarian.v2.form.get({formId}),
          ])
          if (answers && answers.length) {
            const afterClosure = answers.filter((_) => _._submission_time.getTime() > new Date(2025, 0, 19).getTime())
            const lastSubmission = format(
              answers.sort((_) => -_._submission_time.getTime())[0]._submission_time,
              'yyyy-MM-dd',
            )
            const users = seq(afterClosure)
              .map((_) => _._submitted_by)
              .distinct((_) => _)
              .join(' ')
            // const statuses = seq(afterClosure)
            //   .map((_) => _._validation_status.uid)
            //   .distinct((_) => _)
            //   .join(' ')
            console.log(
              `Migrate ${(KoboIndex.searchById(formId)?.name ?? formId).padEnd(32)} ${('' + answers.length).padStart(4)} ${lastSubmission}`,
            )
          } else {
            // console.log(`${(KoboIndex.searchById(formId)?.name ?? formId).padEnd(32)} 0`)
          }
          // const output = KoboSubmissionFormatter.format({
          //   questionIndex: KoboSubmissionFormatter.buildQuestionIndex(form),
          //   data: answers,
          //   output: 'toInsert',
          // })
          //   await PromisePool.withConcurrency(10)
          //     .for(output)
          //     .process((data) => koboSdkDrc.v1.submit({formId, data}))
          //   await chunkify({
          //     data: answers,
          //     size: 20,
          //     concurrency: 2,
          //     fn: (_) =>
          //       koboSdkHumanitarian.v2.updateValidation({
          //         formId,
          //         submissionIds: _.map((_) => _._id),
          //         status: Validation.validation_status_approved,
          //       }),
          //   })
        } catch (error) {
          console.error(error)
        }
      }

      await PromisePool.withConcurrency(1)
        .for(KoboIndex.names.map((n) => KoboIndex.byName(n).id))
        .process(migrateForm)
    }
  }

  export const resetWrongMigration = async () => {
    const forms = [
      // KoboIndex.byName('ecrec_msmeGrantReg').id,
      // KoboIndex.byName('ecrec_vet_bha388').id,
      KoboIndex.byName('bn_rapidResponse2').id,
      KoboIndex.byName('meal_shelterPdm').id,
      KoboIndex.byName('meal_nfiPdm').id,
      KoboIndex.byName('meal_cfmInternal').id,
      KoboIndex.byName('meal_cfmExternal').id,
      KoboIndex.byName('shelter_nta').id,
      KoboIndex.byName('protection_hhs3').id,
      KoboIndex.byName('protection_communityMonitoring').id,
      KoboIndex.byName('protection_groupSession').id,
      KoboIndex.byName('protection_pss').id,
      KoboIndex.byName('protection_referral').id,
      KoboIndex.byName('protection_counselling').id,
    ]

    const clean = async (formId: Kobo.FormId) => {
      const res = await koboSdkDrc.v2.submission
        .get({
          formId,
          filters: {
            start: new Date(2025, 0, 1),
          },
        })
        .then((_) =>
          _.results.filter((_) => _['_uuid'] && (_ as any)['uuid'] && _._submitted_by === 'meal_drc_ddg_ukr'),
        )
      console.log(KoboIndex.searchById(formId)!.name + ' DELETE ' + res.length)
      await koboSdkDrc.v2.submission.delete({formId, submissionIds: res.map((_) => _._id)})
    }
    await PromisePool.withConcurrency(2).for(forms).process(clean)
  }
}
