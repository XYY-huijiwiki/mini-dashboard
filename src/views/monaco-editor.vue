<template>
  <div>
    <n-space vertical>
      <div id="editor-container" style="width: 100%; height: 480px"></div>
      <n-input-group>
        <n-input v-model:value="summary" placeholder="summary" />
        <n-button @click="previewBtnClick()"> preview </n-button>
        <n-button @click="diffBtnClick()" disabled> diff </n-button>
        <n-button @click="editBtnClick()"> edit </n-button>
      </n-input-group>
      <!-- <div id="diff-container" style="width: 100%; height: 600px"></div> -->
      <div id="preview-container" style="width: 100%" v-html="html"></div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { editPage, getPage } from "@/utils/mwApi";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import * as monaco from "monaco-editor";
// import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";

// self.MonacoEnvironment = {
//   getWorker: () => new editorWorker(),
// };

const { t } = useI18n();
const route = useRoute();

let orgCode: string;
let newCode: Ref<string>;
let summary = ref();
let html = ref("");
let title: string =
  typeof route.params.title === "string" ? route.params.title : "";
let editor: monaco.editor.IStandaloneCodeEditor;

async function previewBtnClick() {
  let formData = new FormData();
  formData.append("wikitext", newCode.value);
  formData.append("body_only", "true");
  let response = await fetch(
    "https://xyy.huijiwiki.com/api/rest_v1/transform/wikitext/to/html",
    {
      method: "POST",
      body: formData,
    },
  );
  if (!response.ok) {
    $message.error("preview failed");
    console.log(response);
    return;
  }
  let res = await response.text();
  html.value = res;
}

function editBtnClick() {
  $dialog.warning({
    title: "确认提交？",
    content: "确认提交？",
    autoFocus: false,
    positiveText: t("general.btn-confirm"),
    negativeText: t("general.btn-cancel"),
    onPositiveClick: () => {
      editPage({
        title,
        text: newCode.value,
        summary: summary.value,
      });
    },
  });
}

function diffBtnClick() {
  const originalModel = monaco.editor.createModel(orgCode, "wikitext");
  const modifiedModel = monaco.editor.createModel(newCode.value, "wikitext");
  const diffEditor = monaco.editor.createDiffEditor(
    document.getElementById("diff-container") as HTMLDivElement,
    {
      readOnly: true,
      automaticLayout: true,
    },
  );
  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });
}

onMounted(async () => {
  let getPageResult = await getPage(title);
  if (!getPageResult) {
    $message.error("get page failed");
    return;
  }
  orgCode = getPageResult.content;
  newCode = ref(getPageResult.content);

  editor = monaco.editor.create(
    document.getElementById("editor-container") as HTMLDivElement,
    {
      value: newCode.value,
      language:
        getPageResult.contentModel === "BSON"
          ? "json"
          : getPageResult.contentModel,
      theme: "wikitext-light",
      automaticLayout: true,
      wordWrap: "on",
    },
  );
  editor.onDidChangeModelContent(() => {
    newCode.value = editor.getValue();
  });
});

monaco.languages.register({
  id: "wikitext",
});
monaco.languages.setMonarchTokensProvider("wikitext", {
  defaultToken: "invalid",
  tokenPostfix: ".wiki",
  ignoreCase: false,
  brackets: [
    { open: "[", close: "]", token: "external-link" },
    { open: "[[", close: "]]", token: "internal-link" },
    { open: "{{", close: "}}", token: "template" },
  ],
  // non matched elements
  //   empty: [
  //     "area",
  //     "base",
  //     "basefont",
  //     "br",
  //     "col",
  //     "frame",
  //     "hr",
  //     "img",
  //     "input",
  //     "isindex",
  //     "link",
  //     "meta",
  //     "param",
  //   ],
  tokenizer: {
    root: [
      // comment
      [/<!--/, "comment", "@comment"],
      // internal link (with |)
      // [/(\[\[)(.*?)(\|)(.*?)(\]\])/, ["link", "link", "link", "", "link"]],
      // internal link (without |)
      [/\[\[.*?\]\]/, "link"],
      // external link (with space)
      // [/(\[)(.*?)(\s)(.*?)(\])/, ["link", "link", "link", "", "link"]],
      // external link (without space)
      [/\[.*?\]/, "link"],
      // template
      [/\{\{.*?\}\}/, "template"],
      // bold and italic
      [/(''''')(.*?)(''''')/, ["keyword", "bold-italic", "keyword"]],
      // bold
      [/(''')(.*?)(''')/, ["keyword", "bold", "keyword"]],
      // italic
      [/('')(.*?)('')/, ["keyword", "italic", "keyword"]],
      // header
      [/(^={1,6})(.*?)(={1,6}$)/, ["keyword", "header", "keyword"]],
      // divider
      [/----+/, "keyword"],
      // list (starting with #, *, : or ;)
      [/^\s*([*;:#]+)/, "keyword"],
      // nowiki tag
      [/(<nowiki>)(.*?)(<\/nowiki>)/, ["tag", "", "tag"]],
      // html tag
      [/<\/?[a-z][^>]*>/, "tag"],
      // signature
      [/~{3,5}/, "keyword"],
    ],
    // Note: it is tempting to rather switch to the real HTML mode instead of building our own here
    // but currently there is a limitation in Monarch that prevents us from doing it: The opening
    // '<' would start the HTML mode, however there is no way to jump 1 character back to let the
    // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
    // we cannot correctly tokenize it in that mode yet.
    // html: [
    //   // html tags
    //   [/<(\w+)\/>/, "tag"],
    //   [
    //     /<(\w+)(-|\w)*/,
    //     {
    //       cases: {
    //         "@empty": { token: "tag", next: "@tag.$1" },
    //         "@default": { token: "tag", next: "@tag.$1" },
    //       },
    //     },
    //   ],
    //   [/<\/(\w+)(-|\w)*\s*>/, { token: "tag" }],

    //   [/<!--/, "comment", "@comment"],
    // ],
    comment: [
      [/[^<-]+/, "comment.content"],
      [/-->/, "comment", "@pop"],
      [/<!--/, "comment.content.invalid"],
      [/[<-]/, "comment.content"],
    ],
    // Almost full HTML tag matching, complete with embedded scripts & styles
    // tag: [
    //   [/[ \t\r\n]+/, "white"],
    //   [
    //     /(type)(\s*=\s*)(")([^"]+)(")/,
    //     [
    //       "attribute.name.html",
    //       "delimiter.html",
    //       "string.html",
    //       { token: "string.html", switchTo: "@tag.$S2.$4" },
    //       "string.html",
    //     ],
    //   ],
    //   [
    //     /(type)(\s*=\s*)(')([^']+)(')/,
    //     [
    //       "attribute.name.html",
    //       "delimiter.html",
    //       "string.html",
    //       { token: "string.html", switchTo: "@tag.$S2.$4" },
    //       "string.html",
    //     ],
    //   ],
    //   [
    //     /(\w+)(\s*=\s*)("[^"]*"|'[^']*')/,
    //     ["attribute.name.html", "delimiter.html", "string.html"],
    //   ],
    //   [/\w+/, "attribute.name.html"],
    //   [/\/>/, "tag", "@pop"],
    //   [
    //     />/,
    //     {
    //       cases: {
    //         "$S2==style": {
    //           token: "tag",
    //           switchTo: "embeddedStyle",
    //           nextEmbedded: "text/css",
    //         },
    //         "$S2==script": {
    //           cases: {
    //             $S3: {
    //               token: "tag",
    //               switchTo: "embeddedScript",
    //               nextEmbedded: "$S3",
    //             },
    //             "@default": {
    //               token: "tag",
    //               switchTo: "embeddedScript",
    //               nextEmbedded: "text/javascript",
    //             },
    //           },
    //         },
    //         "@default": { token: "tag", next: "@pop" },
    //       },
    //     },
    //   ],
    // ],

    // embeddedStyle: [
    //   [/[^<]+/, ""],
    //   [
    //     /<\/style\s*>/,
    //     { token: "@rematch", next: "@pop", nextEmbedded: "@pop" },
    //   ],
    //   [/</, ""],
    // ],

    // embeddedScript: [
    //   [/[^<]+/, ""],
    //   [
    //     /<\/script\s*>/,
    //     { token: "@rematch", next: "@pop", nextEmbedded: "@pop" },
    //   ],
    //   [/</, ""],
    // ],
  },
});
monaco.languages.setLanguageConfiguration("wikitext", {
  comments: {
    blockComment: ["<!--", "-->"],
  },

  brackets: [
    ["<!--", "-->"],
    ["<", ">"],
    ["{{", "}}"],
  ],

  colorizedBracketPairs: [],

  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
  ],

  surroundingPairs: [
    { open: "'", close: "'" },
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "<", close: ">" },
  ],
});
monaco.editor.defineTheme("wikitext-light", {
  base: "vs",
  inherit: false,
  rules: [
    { token: "keyword", foreground: "#0088ff" },
    { token: "table", foreground: "#ee00ee" },
    { token: "link", foreground: "#3366cc" },
    { token: "template", foreground: "#8800cc" },
    { token: "bold-italic", fontStyle: "bold italic" },
    { token: "italic", fontStyle: "italic" },
    { token: "bold", fontStyle: "bold" },
    { token: "header", fontStyle: "bold" },
    { token: "tag", foreground: "#229900" },
    { token: "comment", foreground: "#84a0a0" },
  ],
  colors: {
    "editor.foreground": "#000000",
  },
});
</script>

<style>
h2.tm-token {
  font-size: initial;
  color: initial;
  margin: initial;
  padding: initial !important;
}
</style>
