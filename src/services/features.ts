/**
 * Wrapper to trigger the ShareAPI
 *
 * @param title Share title
 * @param url Share URL
 * @param svgContent SVG content to share as string
 */
export function share(title: string, url: string, file: File) {
  const basicShare = {
    url,
    title,
  };
  const fullShare = {
    ...basicShare,
    files: [file],
  };
  if ((navigator as any).canShare(fullShare)) {
    navigator.share(fullShare);
  } else if ((navigator as any).canShare(basicShare)) {
    navigator.share(basicShare);
  } else {
    window.alert(`The sharing feature isn't available in your browser`);
  }
}

/**
 * Build a PNG from a SVG
 * This function uses canvas to fill the content
 * then will extract it to a PNG.
 * Sadly, this won't work on Firefox until the user
 * enable the canvas extraction permission.
 * 
 * @param svg SVG Element to transform to PNG
 * @returns Promise<File>
 */
export function buildPNG(svg: SVGElement): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = parseInt(svg.getAttribute('width') || '0', 10);
  canvas.height = parseInt(svg.getAttribute('height') || '0', 10);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const url = window.URL.createObjectURL(blob);

  return new Promise((res, rej) => {
    const baseimage = new Image();
    baseimage.style.background = '#fff';
    baseimage.onload = function() {
      ctx.drawImage(baseimage,1,1, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob as Blob], 'minimator.png', { type: 'image/png' });
        res(file);
      });
    }
    baseimage.onerror = rej;
    baseimage.src = url;
  });
}

// Build the downloader anchor
let downloadAnchor = document.createElement('a');
downloadAnchor.style.display = 'none';
document.body.appendChild(downloadAnchor);

/**
 * Utility to start a download
 *
 * From http://jsfiddle.net/koldev/cw7w5/
 * >> +1 Good Job!
 *
 * @param svgContent SVG content for download
 * @param fileName File name for download
 */
export function downloader(svgContent: BlobPart, fileName: string) {
  let blob = new Blob([svgContent], { type: 'octet/stream' }),
    url = window.URL.createObjectURL(blob);
  downloadAnchor.href = url;
  downloadAnchor.download = fileName;
  downloadAnchor.click();
  window.setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 10);
}

/**
 * Security check
 * No need to go further, the cheap DRM is here.
 */
export function securityCheck() {
  // 1st step: Embedding
  // I hate when my creations are embedded on another website
  // without my permission and with 20 adverts around.
  // But instead of blocking it, lets have fun.
  if (window.top !== window.self) {
    setInterval(() => {
      if (window.top?.document?.body) {
        const rotate = Math.cos(Date.now() / 1000) * 45;
        window.top.document.body.style.transform = `rotate(${rotate}deg)`;
        window.document.body.style.transform = `rotate(${-rotate}deg)`;
      }
    }, 50);
    window.document.body.innerHTML = `<iframe
      src="https://giphy.com/embed/Ju7l5y9osyymQ" 
      width="100%" 
      height="100%" 
      frameBorder="0"
      style="position:fixed;z-index:9999;"
      allowFullScreen
    ></iframe>`;
  }
}
