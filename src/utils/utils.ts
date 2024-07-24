export function allPropertiesDefined<T extends object>(obj: T): boolean {
  return Object.keys(obj).every(key => obj[key as keyof T] !== undefined)
}
