interface UploadResponse {
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

async function uploadFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken(
        "csrf",
        {
          action: "upload",
          file: file,
          filename: file.name,
          ignorewarnings: true,
        },
        {
          contentType: "multipart/form-data",
        },
      )
      .done((data: UploadResponse) => {
        $message.success("上传成功");
        console.log(data);
        resolve(true);
      })
      .fail((data: string) => {
        $message.error(`上传失败（${data}）`);
        console.log(data);
        resolve(false);
      });
  });
}

export default uploadFile;
