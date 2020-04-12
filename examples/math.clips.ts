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

const main2 = main.swap(add, fixedAdd)

const main3 = main.swap(
  add,
  fixedAdd.swap(initialValue, function () {
    return 100
  })
)

const main4 = main2.swap(initialValue, function () {
  return 200
})

const main5 = main3.swap(initialValue, function () {
  return 300
})

main() // 45

main2() // 0 + 4 + 5 = 9

main3() // 100 + 4 + 5 = 109

main4()

main5()
main5()
main5()
main5()
main5()
