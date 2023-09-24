interface MoveResponse {
  move: {
    from: string;
    to: string;
    reason: string;
    talkfrom: string;
    talkto: string;
  };
}

async function renamePage(from: string, to: string): Promise<boolean> {
  return new Promise((resolve) => {
    new mw.Api()
      .postWithToken("csrf", {
        action: "move",
        from,
        to,
        movetalk: true,
        noredirect: true,
      })
      .done((data: MoveResponse) => {
        $message.success("重命名成功");
        console.log(data);
        resolve(true);
      })
      .fail((data: string) => {
        $message.error(`重命名失败（${data}）`);
        console.log(data);
        resolve(false);
      });
  });
}

export default renamePage;
