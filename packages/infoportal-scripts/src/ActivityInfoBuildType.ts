import {Obj} from '@axanc/ts-utils'
import {AiBuilder} from 'activityinfo-sdk'

import {appConf} from './appConf'

export class ActivityInfoBuildType {
  constructor(
    private builder = new AiBuilder({
      activityInfoToken: appConf.activityInfo.apiToken,
      outDir: appConf.rootProjectDir + '/output',
    }),
    private formIds = {
      generalProtection: 'c1viqabm4whwvwo3',
      mineAction: 'cxpfp3xm513b6r15nwo',
      childProtection: 'cvgj28ym513hkiph7y',
      snfi: 'cmasgbem5w7pgf02',
      fslc: 'cxx4z9am74csoag9',
      wash: 'czg50xvm6an62wz2',
      mpca: 'cmh1f87m6jumnb314it',
      gbv: 'co7iurtm513bt64h7u',
    },
  ) {}

  readonly definition = {
    wash: () =>
      this.builder.generateSchema({
        formId: this.formIds.wash,
        questionSettings: {
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Sites': {skipChoices: true},
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
        },
      }),

    fslc: () =>
      this.builder.generateSchema({
        formId: this.formIds.fslc,
        questionSettings: {
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Sites': {skipChoices: true},
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
        },
      }),

    snfi: () =>
      this.builder.generateSchema({
        formId: this.formIds.snfi,
        questionSettings: {
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Sites': {skipChoices: true},
          // 'Indicators - SNFI': {
          //   selectColumnByLabels: ['Activity_label', 'Indicator_label', 'Modality', 'Theme'],
          // },
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
        },
      }),

    generalProtection: () =>
      this.builder.generateSchema({
        formId: this.formIds.generalProtection,
        questionSettings: {
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {skipChoices: true},
          'Implementing Partner 2': {skipChoices: true},
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Site': {skipChoices: true},
        },
      }),

    childProtection: () =>
      this.builder.generateSchema({
        formId: this.formIds.childProtection,
        questionSettings: {
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {skipChoices: true},
          'Implementing Partner 2': {skipChoices: true},
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Site': {skipChoices: true},
        },
      }),

    gbv: () =>
      this.builder.generateSchema({
        formId: this.formIds.gbv,
        questionSettings: {
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {skipChoices: true},
          'Implementing Partner 2': {skipChoices: true},
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Site': {skipChoices: true},
        },
      }),

    mineAction: () =>
      this.builder.generateSchema({
        formId: this.formIds.mineAction,
        questionSettings: {
          'Reporting Organization': {
            filterChoices: (_) => _.includes('Danish Refugee Council'),
          },
          'Implementing Partner': {skipChoices: true},
          'Implementing Partner 2': {skipChoices: true},
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Site': {skipChoices: true},
        },
      }),

    mpca: () =>
      this.builder.generateSchema({
        formId: this.formIds.mpca,
        questionSettings: {
          'Implementing Partner': {filterChoices: (_) => _.includes('Danish Refugee Council')},
          'Reporting Organization': {filterChoices: (_) => _.includes('Danish Refugee Council')},
          Oblast: {skipChoices: true},
          Raion: {skipChoices: true},
          Hromada: {skipChoices: true},
          Settlement: {skipChoices: true},
          'Collective Site': {skipChoices: true},
        },
      }),
  }

  readonly buildAll = () => {
    return Promise.all(Obj.values(this.definition).map((_) => _()))
  }
}
