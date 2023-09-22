import { url } from "@/utils/mwApi/index";

async function getPage(title: string): Promise<{
  id: number;
  content: string;
  title: string;
  namespace: number;
} | null> {
  const params = new URLSearchParams({
    action: "query",
    prop: "revisions",
    rvprop: "content",
    format: "json",
    rvlimit: "1",
    titles: title,
  });
  const response = await fetch(`${url}?${params.toString()}`);
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

export default getPage;
