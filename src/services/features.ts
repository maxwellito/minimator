/**
 * Wrapper to trigger the ShareAPI
 * 
 * @param title Share title
 * @param url Share URL
 * @param svgContent SVG content to share as string
 */
export function share (title: string, url: string, svgContent: string) {
  const blob = new Blob([svgContent], {type: 'image/svg+xml'});
  const basicShare = {
    url,
    title
  };
  const fullShare = {
    ...basicShare,
    files: [
      new File([blob], `minimator_demo.svg`, {
        type: blob.type,
      })
    ],
  };
  if ((navigator as any).canShare(fullShare)) {
    navigator.share(fullShare);
  } else if ((navigator as any).canShare(basicShare)) {
    navigator.share(basicShare);
  }
}

// Build the downloader anchor
let downloadAnchor = document.createElement('a')
downloadAnchor.style.display = 'none'
document.body.appendChild(downloadAnchor)

/**
 * Utility to start a download
 * 
 * From http://jsfiddle.net/koldev/cw7w5/
 * >> +1 Good Job!
 * 
 * @param svgContent SVG content for download
 * @param fileName File name for download
 */
export function downloader (svgContent: BlobPart, fileName: string) {
  let blob = new Blob([svgContent], {type: 'octet/stream'}),
      url = window.URL.createObjectURL(blob)
  downloadAnchor.href = url
  downloadAnchor.download = fileName
  downloadAnchor.click()
  window.setTimeout(function () {
    window.URL.revokeObjectURL(url)
  }, 10)
};