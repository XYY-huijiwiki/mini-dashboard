async function getPageContent(title: string): Promise<string> {
  const response = await fetch(
    `https://xyy.huijiwiki.com/api.php?action=query&prop=revisions&rvprop=content&format=json&rvlimit=1&titles=${title}`,
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const page = data.query.pages;
  const pageId = Object.keys(page)[0];
  return page[pageId].revisions[0]["*"];
}

export default getPageContent;
