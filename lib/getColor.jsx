export default function getColor(d) {
  d = Math.floor(Number(d));
  if (d === 0) {
    return 'grey';
  }
  else
  if (d >= 1 && d <= 2) {
    return '#d73027';
  }
  else
  if (d >= 2 && d <= 3) {
    return '#f46d43';
  }
  else
  if (d >= 3 && d <= 4) {
    return '#fdae61';
  }
  else
  if (d >= 4 && d <= 5) {
    return '#fee08b';
  }
  else
  if (d >= 5 && d <= 6) {
    return '#ffffbf';
  }
  else
  if (d >= 6 && d <= 7) {
    return '#d9ef8b';
  }
  else
  if (d >= 7 && d <= 8) {
    return '#a6d96a';
  }
  else
  if (d >= 8 && d <= 9) {
    return '#66bd63';
  }
  return '#ccc';
}
