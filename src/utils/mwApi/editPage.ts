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
