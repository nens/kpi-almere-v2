// Color Table
// 1 - 1,49
// 1.5-2,49
// 2,5-3,49
// 3,5 - 4,49
// 4,5 - 5,49
// 5,5 - 6,49
// 6,5 - 7,49
// 7,5 - 8,49
// 8,5 - 9,49
// 9,5 - 10

export default function getColor(d) {
  // console.log('getColor(d)', d);
  // d = Math.floor(Number(d));
  if (d === 0) {
    return 'grey';
  }
  else
  if (d >= 1 && d <= 1.49) {
    return '#d73027';
  }
  else
  if (d >= 1.5 && d < 2.49) {
    return '#f46d43';
  }
  else
  if (d >= 2.5 && d < 3.49) {
    return '#fdae61';
  }
  else
  if (d >= 3.5 && d < 4.49) {
    return '#fee08b';
  }
  else
  if (d >= 4.5 && d < 5.49) {
    return '#ffffbf';
  }
  else
  if (d >= 5.6 && d < 6.49) {
    return '#d9ef8b';
  }
  else
  if (d >= 6.5 && d < 7.49) {
    return '#a6d96a';
  }
  else
  if (d >= 7.5 && d <= 8.49) {
    return '#66bd63';
  }
  else
  if (d >= 8.5 && d <= 9.49) {
    return '#249f4a';
  }
  else
  if (d >= 9.5 && d <= 10) {
    return '#0f9428';
  }
  return '#ccc';
}
