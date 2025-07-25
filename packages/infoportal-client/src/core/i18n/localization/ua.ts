import {dateFromNow, formatDate, formatDateTime, formatDuration, formatLargeNumber, formatTime} from './en'

export const ua = {
  formatDate,
  formatTime,
  formatDateTime,
  dateFromNow,
  formatDuration,
  formatLargeNumber,
  messages: {
    idps: 'Внутрішньо переміщені особи',
    nonDisplaced: 'Не переміщений',
    refugeesAndReturnees: 'Біженці та ті, що повернулись з-за кордону',
    area: 'Область',
    answers: 'Відповіді',
    noDataAtm: 'На даний момент немає даних',
    seeResults: 'Переглянути результати',
    select3Outcomes: 'Будь ласка, виберіть 3 результати',
    somethingWentWrong: 'Щось пішло не так',
    yes: 'Так',
    no: 'Ні',
    previous: 'Попередній',
    next: 'Наступний',
    yourAnswers: 'Ваші відповіді',
    confirm: 'Підтвердити',
    formSubmitted: 'Відповіді успішно відправлені',
    protHHSnapshot: {},
    includeNotSpecified: 'в т.ч. "Не зазначено"',
    damageCause: 'Причина руйнувань',
    avgHHSize: 'Середній розмір домогосподарства',
    households: 'Домогосподарств',
    formOutcome: {
      title: 'Які 3 результати ...',
      questions: {
        now: '... Ви вважаєте, що ми найбільше допомагаємо зараз?',
        oneYear: '... Ви вважаєте, що ми маємо найбільше допомогти через рік?',
        end: '... Ви вважаєте, що ми маємо найбільше допомогти до кінця поточної стратегії ДРК (2025 року)',
      },
      breakthrough: {
        breakthrough1: {
          title: 'Прорив 1',
          desc: 'Як і інші, люди, які постраждали від конфлікту та переміщення, повинні мати змогу шукати безпеку та заявляти про основні права',
          options: {
            bt1_outcomeArea1: {
              title: 'Область результату 1',
              desc: 'Більш безпечні спільноти мають здатність та системи для зменшення всіх форм насильства',
            },
            bt1_outcomeArea2: {title: 'Область результату 2', desc: 'Базові потреби людей задовольняються'},
            bt1_outcomeArea3: {
              title: 'Область результату 3',
              desc: 'Державні службовці діють з повагою, захищають та виконують права людей',
            },
            bt1_outcomeArea4: {
              title: 'Область результату 4',
              desc: 'Люди можуть вимагати повагу до захисту та виконання їх прав',
            },
            bt1_outcomeArea5: {
              title: 'Область результату 5',
              desc: 'Люди можуть ефективно використовувати системи для виконання своїх прав',
            },
          },
        },
        breakthrough2: {
          title: 'Прорив 2',
          desc: 'На рівних з іншими, люди, що постраждали від конфліктів та переміщень, повинні мати можливість розвивати самодостатність',
          options: {
            bt2_outcomeArea5: {
              title: 'Область результату 5',
              desc: 'Люди можуть ефективно використовувати системи для здійснення своїх прав',
            },
            bt2_outcomeArea6: {
              title: 'Область результату 6',
              desc: 'Люди мають більш гідне та стійке забезпечення життя',
            },
            bt2_outcomeArea7: {
              title: 'Область результату 7',
              desc: 'Підвищується соціальна сплоченість у спільнотах/суспільствах',
            },
            bt2_outcomeArea8: {
              title: 'Область результату 8',
              desc: 'Люди можуть ефективно брати участь у справедливому та рівному громадському житті',
            },
            bt2_outcomeArea9: {
              title: 'Область результату 9',
              desc: 'Зменшується ризик вразливості та небезпеки природних катастроф',
            },
          },
        },
      },
    },
    questionArea: 'У якій області ви працюєте?',
    areas: {
      north: 'Північ',
      east: 'Схід',
      south: 'Південь',
      west: 'Захід',
    },
    docsTitle: 'Документація',
    victimAssistanceTitle: 'допомога постраждалим',
    riskEducation: {
      sectionTitle: 'Навчання про ризики',
      sessionsNumber: 'Кількість сесій',
      individualsReached: 'Осіб охоплено',
    },
    _shelter: {
      damageCondition: 'What is the Condition of the Building / Apartment',
    },
    legal: {
      individualAid: 'Індивідуальна юридична допомога',
      aidType: {
        title: 'Тип допомоги',
        assistance: 'Вторинна допомога',
        councelling: 'Консультація',
      },
      docTypeCount: {
        hlp: 'Отримали документи на власність',
        civilDocs: 'Отримали цивільні документи',
      },
      registeredBy: 'Зареєстрував',
      aidStatus: 'Статус допомоги',
      aidDate: 'Дата допомоги',
      aidClosureDate: 'Дата закриття допомоги',
      map: {
        title: 'Бенефіціари по областях',
      },
    },
  },
}
