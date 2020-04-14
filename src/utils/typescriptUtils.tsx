/** Type workaround for https://github.com/Microsoft/TypeScript/issues/7294#issuecomment-465794460 */
type ArrayElem<A> = A extends Array<infer Elem> ? Elem : never

export function elemT<T>(array: T): Array<ArrayElem<T>> {
  return array as any
}
