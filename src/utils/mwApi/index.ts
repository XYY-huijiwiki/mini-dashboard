import renamePage from '@/utils/mwApi/renamePage'
import getPage from '@/utils/mwApi/getPage'
import editPage from '@/utils/mwApi/editPage'
import uploadFile from '@/utils/mwApi/uploadFile'
import deletePage from '@/utils/mwApi/deletePage'
import undeletePage from '@/utils/mwApi/undeletePage'
import type { ArvResponse, ProcessedArvData } from '@/utils/mwApi/types'

/**
 * wiki api base url.
 * use current site api in production
 * use `xyy.huijiwiki.com` api in development
 **/
const url = `${location.origin}/w/api.php`

export { url, editPage, getPage, renamePage, uploadFile, deletePage, undeletePage }
export type { ArvResponse, ProcessedArvData }
