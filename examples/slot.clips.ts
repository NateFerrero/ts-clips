import { clip, Seek, slot } from '../src'

const log = slot(function (message: string) {
  console.log(message)
})

const main = clip(function (this: Seek) {
  log(`Hello, World!`)
})

const fancyLog = clip(function (message: string) {
  console.log(`A thunderclap was heard around the globe: "${message}"`)
})

main()

log.swap(fancyLog) // applies to anything using the log slot

main()

log.eject() // reverts to initial clip

main()
