export function matchById(id: string) {
  return function match(item: Object) {
    return !id || item && item['id'] === id;
  }
}
