interface EditResponse {
  edit: {
    result: string;
    pageid: number;
    title: string;
    contentmodel: string;
    oldrevid: number;
    newrevid: number;
    newtimestamp: string;
  };
}

/**
 * Edits a MediaWiki page with the given parameters.
 * @async
 * @param {Object} editParams - The parameters for the edit.
 * @param {string} editParams.title - The title of the page to edit.
 * @param {string} editParams.text - The new text to replace the page content with.
 * @param {string} [editParams.summary] - The edit summary to use.
 * @param {string} [editParams.tags] - The tags to apply to the edit.
 * @param {boolean} [editParams.createonly] - True for creating the page only if it doesn't exist.
 * @returns {Promise<EditResponse>} A promise that resolves with the edit response.
 */
async function editPage(editParams: {
  title: string;
  text: string;
  summary?: string;
  tags?: string;
  createonly?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken("csrf", {
        action: "edit",
        createonly: editParams.createonly,
        tags: editParams.tags,
        title: editParams.title,
        text: editParams.text,
        summary: editParams.summary,
      })
      .done((data: EditResponse) => {
        $message.success("编辑成功");
        console.log(data);
        resolve(true);
      })
      .fail((data: string) => {
        $message.error(`编辑失败（${data}）`);
        console.log(data);
        resolve(false);
      });
  });
}

export default editPage;
