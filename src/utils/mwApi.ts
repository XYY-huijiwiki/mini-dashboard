async function getWikiPage(title: string): Promise<{
  id: number;
  content: string;
  title: string;
  namespace: number;
} | null> {
  const response = await fetch(
    `https://xyy.huijiwiki.com/api.php?action=query&prop=revisions&rvprop=content&format=json&rvlimit=1&titles=${title}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const page = data.query.pages;
  const pageId = Object.keys(page)[0];
  // if pageId === -1, it means the page does not exist
  if (pageId === "-1") {
    return null;
  } else {
    return {
      id: parseInt(pageId),
      content: page[pageId].revisions[0]["*"],
      title: page[pageId].title,
      namespace: page[pageId].ns,
    };
  }
}

async function editWikiPage(editParams: {
  title: string;
  text: string;
  summary?: string;
  tags?: string;
  createonly?: boolean;
}) {
  return await new mw.Api().postWithToken("csrf", {
    action: "edit",
    createonly: editParams.createonly,
    tags: editParams.tags,
    title: editParams.title,
    text: editParams.text,
    summary: editParams.summary,
  });
}

async function uploadFile(uploadParams: {
  file: File;
  filename?: string;
  summary?: string;
  tags?: string;
  createonly?: boolean;
}) {
  return await new mw.Api().postWithToken("csrf", {
    action: "upload",
    format: "json",
    filename: uploadParams.file.name || uploadParams.filename,
    file: uploadParams.file,
    summary: uploadParams.summary,
    tags: uploadParams.tags,
    createonly: uploadParams.createonly,
  });
}

export { getWikiPage, editWikiPage, uploadFile };
