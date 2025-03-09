async function getMTZFile(link: string, name: string): Promise<File> {
  let corsProxy = 'https://cors-proxy.24218079.xyz/'
  let res = await fetch(`${corsProxy}${link}`)
  let mtzBlob = await res.blob()
  let mtzFile = new File([mtzBlob], `${name}.mtz`)
  return mtzFile
}

function cleanURL(text: string): string {
  let link = text.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  )?.[0]
  if (!link) throw new Error('Invalid link')
  return link
}

type ThemeJson = {
  _hjschema: '小米主题'
  主题名称: string
  发布日期: string
  主题作者: string
  主题链接: string
  主题介绍: string
  主题预览: string[]
  你知道咩: string
}

type Result = {
  themeJson: ThemeJson
  files: {
    mtz: File
    dateImg: File | undefined
    squareImg: File
    previews: File[]
  }
}

export { getMTZFile, cleanURL }
export type { ThemeJson, Result }
