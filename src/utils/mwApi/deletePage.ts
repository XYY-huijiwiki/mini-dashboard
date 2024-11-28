interface DeleteResponse {
  delete: {
    title: string
    reason: string
    logid: number
  }
}

/**
 * Deletes a page with the given title and reason.
 * @async
 * @param {Object} editParams - The parameters for the delete action.
 * @param {string} editParams.title - The title of the page to delete.
 * @param {string} editParams.reason - The reason for deleting the page.
 * @returns {Promise<boolean>} A promise that resolves to true if the page was successfully deleted, false otherwise.
 */
async function deletePage(editParams: { title: string; reason: string }): Promise<boolean> {
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken('csrf', {
        action: 'delete',
        ...editParams,
      })
      .done((data: DeleteResponse) => {
        $message.success('删除成功')
        console.log(data)
        resolve(true)
      })
      .fail((data: string) => {
        $message.error(`删除失败（${data}）`)
        console.log(data)
        resolve(false)
      })
  })
}

export default deletePage
