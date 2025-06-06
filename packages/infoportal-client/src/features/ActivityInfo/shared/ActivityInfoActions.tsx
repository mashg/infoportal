import React from 'react'
import {AnswerTable} from './AnswerTable'
import {Modal} from '@/shared'
import {useI18n} from '@/core/i18n'
import {IpIconBtn} from '@/shared/IconBtn'
import {AiTable} from '@/features/ActivityInfo/shared/AiTable'
import {IpBtnProps} from '@/shared/Btn'

export const ActivityInfoActions = ({data, activity, requestBody}: AiTable) => {
  return (
    <>
      <AiViewAnswers answers={data} />
      {activity && <AiPreviewActivity activity={activity} />}
      {requestBody && <AiPreviewRequest request={requestBody} />}
    </>
  )
}

export const AiViewAnswers = <T extends Record<string, any>>({answers, tooltip}: {tooltip?: string; answers: T[]}) => {
  const {m} = useI18n()
  return (
    <Modal
      maxWidth={'lg'}
      title={m.koboData}
      PaperProps={{}}
      cancelLabel={m.close}
      content={<AnswerTable answers={answers} koboKey="koboId" />}
    >
      <IpIconBtn size="small" tooltip={tooltip ?? 'View related Kobo data'} children="zoom_in" color="primary" />
    </Modal>
  )
}

export const AiPreviewActivity = ({activity}: {activity: any}) => {
  const {m} = useI18n()
  return <AIPreviewJSON request={activity} title={m.previewActivity} icon="preview" />
}

export const AiPreviewRequest = ({request}: {request: any}) => {
  const {m} = useI18n()
  return <AIPreviewJSON request={request} title={m.previewRequestBody} icon="data_object" />
}

const AIPreviewJSON = ({request, title, icon}: {title: string; icon: string; request: any}) => {
  return (
    <Modal title={title} content={<pre>{JSON.stringify(request, null, 2)}</pre>}>
      <IpIconBtn tooltip={title} size="small" color="primary" children={icon} />
    </Modal>
  )
}

export const AiSendBtn = (props: IpBtnProps) => {
  return (
    <IpIconBtn tooltip="Submit 🚀" size="small" sx={{mr: 0.5}} color="primary" {...props}>
      send
    </IpIconBtn>
  )
}
