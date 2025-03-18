function genRawFileUrl(file: FileInfo) {
  const corsProxy = file.content_type.startsWith('model') ? 'https://cors-proxy.24218079.xyz/' : ''
  return `${corsProxy}https://github.com/XYY-huijiwiki/files/releases/download/eOsizdoz/${file.file_name_base62}`
}

function genThumbUrl(file: FileInfo): string {
  const hasThumb =
    file.content_type.startsWith('image') ||
    file.content_type.startsWith('video') ||
    file.content_type.startsWith('model')
  return hasThumb
    ? `https://karsten-zhou.gumlet.io/https://github.com/XYY-huijiwiki/files/releases/download/thumb/${file.file_name_base62}`
    : ''
}

export { genRawFileUrl, genThumbUrl }
