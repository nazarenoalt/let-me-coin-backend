export function cleanObject(object) {
  if (object === undefined) return object;
  const cleanObj = Object.entries(object)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return cleanObj;
}
