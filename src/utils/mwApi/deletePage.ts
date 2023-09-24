interface DeleteResponse {
  delete: {
    title: string;
    reason: string;
    logid: number;
  };
}

async function deletePage(editParams: {
  title: string;
  reason: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken("csrf", {
        action: "delete",
        ...editParams,
      })
      .done((data: DeleteResponse) => {
        $message.success("删除成功");
        console.log(data);
        resolve(true);
      })
      .fail((data: string) => {
        $message.error(`删除失败（${data}）`);
        console.log(data);
        resolve(false);
      });
  });
}

export default deletePage;
