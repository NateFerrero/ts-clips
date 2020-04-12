export type Clip<TClip extends Function> = TClip & {
  extend(contexts: ClipContext[]): Clip<TClip>
  swap<TSwap extends Function, TClipSwap extends Clip<TSwap>>(
    current: TClipSwap,
    replacement: TClipSwap | TSwap
  ): Clip<TClip>
}

export interface Seek {
  <TClip extends Function>(search: Clip<TClip>): Clip<TClip>
}

interface ClipContext {
  swaps: Map<Clip<any>, Clip<any>>
}

export const clip = <TClip extends Function>(
  body: TClip,
  clipContexts: ClipContext[] = []
): Clip<OmitThisParameter<TClip>> => {
  const memo = createCache()

  const seek = <TSeek extends Function>(search: Clip<TSeek>): Clip<TSeek> =>
    memo(search, () =>
      (
        findInArray<ClipContext, Clip<TSeek>>(clipContexts, (context) =>
          context.swaps.get(search)
        ) ?? search
      ).extend(clipContexts)
    )

  const newClip: any = (...args: any[]) => {
    return body.apply(seek, args)
  }

  newClip.extend = (newClipContexts: ClipContext[]) =>
    newClipContexts.length > 0
      ? clip(body, [...newClipContexts, ...clipContexts])
      : newClip

  newClip.swap = (searchClip: TClip, replaceClip: TClip) =>
    clip(body, [
      {
        swaps: extendMap(
          clipContexts.length > 0 ? clipContexts[0].swaps : new Map(),
          searchClip,
          'swap' in replaceClip ? replaceClip : clip(replaceClip)
        ),
      },
      ...clipContexts.slice(1),
    ])

  return newClip
}

function extendMap<T>(original: Map<T, T>, key: T, value: T) {
  const map = new Map(original)
  map.set(key, value)
  return map
}

function findInArray<T, U>(array: T[], search: (map: T) => U | undefined) {
  for (const element of array) {
    const value = search(element)
    if (value) {
      return value
    }
  }
}

function createCache() {
  const values = new WeakMap()

  return <T extends object, U>(search: T, generate: () => U) => {
    const result = values.get(search)
    if (result) {
      return result
    }
    const newResult = generate()
    values.set(search, newResult)
    return newResult
  }
}
