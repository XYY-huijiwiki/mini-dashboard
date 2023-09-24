import renamePage from "@/utils/mwApi/renamePage";
import getPage from "@/utils/mwApi/getPage";
import editPage from "@/utils/mwApi/editPage";
import uploadFile from "@/utils/mwApi/uploadFile";
import deletePage from "@/utils/mwApi/deletePage";

const debug = import.meta.env.DEV;

/**
 * wiki api base url.
 * use current site api in production
 * use `xyy.huijiwiki.com` api in development
 **/
const url = debug
  ? "https://xyy.huijiwiki.com/w/api.php"
  : `${location.origin}/w/api.php`;

export { url, editPage, getPage, renamePage, uploadFile, deletePage };
