export function timeago(value: number) {
  let gap = (+new Date() - value) / 1000;
  if (gap < 2) {
    return 'just now';
  } else if (gap < 60) {
    return Math.floor(gap) + 's ago';
  } else if (gap < 3600) {
    return Math.floor(gap / 60) + 'min ago';
  } else if (gap < 3600 * 24) {
    return Math.floor(gap / 3600) + 'h ago';
  } else if (gap < 3600 * 24 * 30) {
    return Math.floor(gap / (3600 * 24)) + ' day(s) ago';
  } else if (gap < 3600 * 24 * 365) {
    return Math.floor(gap / (3600 * 24 * 30)) + ' month(s) ago';
  } else {
    return Math.floor(gap / (3600 * 24 * 365)) + ' year(s) ago';
  }
}
