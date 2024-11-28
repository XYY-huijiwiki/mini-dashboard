/**
 * Parameters for the undelete operation.
 * see alse {@link https://www.mediawiki.org/wiki/API:Undelete}
 */
interface UndeleteParams {
  /** Title of the page to undelete. */
  title: string

  /** Reason for restoring. */
  reason?: string

  /** Change tags to apply to the entry in the deletion log. */
  tags?: string[]

  /** Timestamps of the revisions to undelete. */
  timestamps?: string[]

  /** IDs of the file revisions to restore. */
  fileids?: number[]

  /** Undelete all revisions of the associated talk page, if any. */
  undeletetalk?: boolean

  /** Unconditionally add or remove the page from the current user's watchlist. */
  watchlist?: 'nochange' | 'preferences' | 'unwatch' | 'watch'

  /** Watchlist expiry timestamp. */
  watchlistexpiry?: string
}

/**
 * Response from an successful undelete operation.
 */
interface UndeleteResponse {
  undelete: {
    fileversions: number
    reason: string
    revisions: number
    title: string
  }
}

const isDev = import.meta.env.DEV

async function undeletePage(
  undeleteParams: UndeleteParams,
): Promise<{ ok: true; body: UndeleteResponse } | { ok: false; body: string }> {
  return new Promise((resolve) => {
    isDev ? console.groupCollapsed('undeletePage') : null
    new mw.Api()
      .postWithToken('csrf', {
        action: 'undelete',
        ...undeleteParams,
      })
      .done((data: UndeleteResponse) => {
        isDev ? console.log(data) : null
        resolve({ ok: true, body: data })
      })
      .fail((data: string) => {
        isDev ? console.log(data) : null
        resolve({ ok: false, body: data })
      })
      .always(() => {
        isDev ? console.groupEnd() : null
      })
  })
}

export default undeletePage
