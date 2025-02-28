function genRawFileUrl(file: FileInfo) {
  return `https://github.com/XYY-huijiwiki/files/releases/download/eOsizdoz/${file.file_name_base62}`
}
function genThumbUrl(file: FileInfo) {
  const rawFileUrl = genRawFileUrl(file)
  return file.content_type.startsWith('image')
    ? `https://karsten-zhou.gumlet.io/${rawFileUrl}`
    : file.content_type.startsWith('video')
      ? `https://ik.imagekit.io/eelwilzma/${rawFileUrl}/ik-video.mp4/ik-thumbnail.jpg`
      : ''
}

export { genRawFileUrl, genThumbUrl }
