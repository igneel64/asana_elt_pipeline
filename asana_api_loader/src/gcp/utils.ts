export function convertArrayJSONtoNDJson(arrayJson: Record<string, unknown>[]) {
  // @ts-expect-error JSON stringify misbehaving
  return arrayJson.map(JSON.stringify).join('\n');
}

export function getExternalTableExpiration(days = 3) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return String(date.valueOf());
}
