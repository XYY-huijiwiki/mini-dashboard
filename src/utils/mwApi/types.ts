/* ==================
    Arv (All Revisions) API
   ================== */
type ArvResponse = {
  batchcomplete: string
  continue?: {
    arvcontinue: string
    continue: string
  }
  query: {
    allrevisions: ArvData[]
  }
}
type ArvDataOuter = {
  ns: number
  pageid: number
  title: string
}
type ArvDataInner = {
  anon?: string
  comment: string
  parsedcomment?: string
  minor?: string
  contentmodel: string
  parentid: number
  revid: number
  roles: string[]
  sha1: string
  size: number
  tags: string[]
  timestamp: string
  user: string
  userid: number
}
type ArvData = ArvDataOuter & {
  revisions: ArvDataInner[]
}
type ProcessedArvData = ArvDataInner & ArvDataOuter

export type { ArvResponse, ProcessedArvData }
