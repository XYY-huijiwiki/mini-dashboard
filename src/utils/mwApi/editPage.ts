import { i18n } from '@/main'

let { t } = i18n.global

interface EditResponse {
  edit: {
    result: string
    pageid: number
    title: string
    contentmodel: string
    oldrevid: number
    newrevid: number
    newtimestamp: string
  }
}

/**
 * Edits a MediaWiki page with the given parameters.
 * @async
 * @param {Object} editParams - The parameters for the edit.
 * @param {string} editParams.title - Title of the page to edit. Cannot be used together with `pageid`.
 * @param {number} [editParams.pageid] - Page ID of the page to edit. Cannot be used together with `title`.
 * @param {number|string} [editParams.section] - Section identifier. `0` for the top section, `new` for a new section. Often a positive integer, but can also be non-numeric.
 * @param {string} [editParams.sectiontitle] - The title for a new section when using section=new.
 * @param {string} editParams.text - Page content.
 * @param {string} [editParams.summary] - Edit summary. When this parameter is not provided or empty, an edit summary may be generated automatically. When using section=new and sectiontitle is not provided, the value of this parameter is used for the section title instead, and an edit summary is generated automatically.
 * @param {string} [editParams.tags] - Change tags to apply to the revision. Values (separate with | or alternative): convenient-discussions, possible vandalism, repeating characters
 * @param {boolean} [editParams.minor] - Mark this edit as a minor edit.
 * @param {boolean} [editParams.notminor] - Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
 * @param {boolean} [editParams.bot] - Mark this edit as a bot edit. Default value depends on if the user groups include bot.
 * @param {boolean} [editParams.createonly] - True for creating the page only if it doesn't exist.
 * @returns {Promise<EditResponse>} A promise that resolves with the edit response.
 */
async function editPage(editParams: {
  title: string
  pageid?: number
  section?: number | 'new'
  sectiontitle?: string
  text: string
  summary?: string
  tags?: string
  minor?: boolean
  notminor?: boolean
  bot?: boolean
  createonly?: boolean
}): Promise<boolean> {
  // check if the user is bot when bot is not specified
  if (editParams.bot === undefined && mw.config.get('wgUserGroups').includes('bot')) {
    editParams.bot = true
  }
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken('csrf', {
        action: 'edit',
        ...editParams,
      })
      .done((data: EditResponse) => {
        $message.success(t('general.msg-page-edited', [data.edit.title]))
        console.log(data)
        resolve(true)
      })
      .fail((data: string) => {
        $notification.error({
          title: t('general.error'),
          content: t('general.msg-page-edit-failed', [data]),
          meta: new Date().toLocaleString(),
        })
        console.log(data)
        resolve(false)
      })
  })
}

export default editPage
