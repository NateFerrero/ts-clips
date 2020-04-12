import { clip, Seek } from '../src'

const main = clip(function (this: Seek) {
  this(log)(`Hello, ${this(audience)()}`)
})

const audience = clip(function (): string {
  return 'World'
})

const log = clip(function (message: string) {
  console.log(message)
})

const imperativeLog = clip(function (message: string) {
  console.log(`Hear me speak: "${message}"`)
})

const mainEarth = main.swap(audience, function () {
  return 'Earth'
})

const earthProclamation = mainEarth.swap(log, imperativeLog)

const worldProclamation = main.swap(log, imperativeLog)

main() // original greeting

mainEarth() // modified planet

earthProclamation() // we can chain modifications

worldProclamation() // we can use any combination

main() // the original is not affected

mainEarth() // still works
