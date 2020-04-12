import { clip, Seek } from '../src'

export const main = clip(function (this: Seek) {
  this(log)(this(add)('4', '5'))
})

const add = clip(function (one: string, two: string) {
  return one + two
})

const log = clip(function (message: string) {
  console.log(message)
})

const initialValue = clip(function (): number {
  return 0
})

const fixedAdd = clip(function (this: Seek, one: string, two: string) {
  const initial = this(initialValue)()
  return `${initial} + ${one} + ${two} = ${initial + parseInt(one) + parseInt(two)}`
})

const main0 = main.swap(add, fixedAdd)

const main100 = main.swap(
  add,
  fixedAdd.swap(initialValue, function () {
    return 100
  })
)

const main200 = main0.swap(initialValue, function () {
  return 200
})

const main300 = main100.swap(initialValue, function () {
  return 300 // this overrides the swap done in main100
})

main() // 45

main0() // 0 + 4 + 5 = 9

main100() // 100 + 4 + 5 = 109

main200() // 200 + 4 + 5 = 209

main300() // 300 + 4 + 5 = 309
