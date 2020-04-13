import * as http from 'http'

import { clip, Seek } from '../src'

const main = clip(function (this: Seek) {
  createServer(this(requestHandler))
    .on('error', this(onError))
    .listen(this(port)(), this(afterListen))
})

const port = clip(function (): number {
  return 3030
})

const onError = clip(function (error: Error) {
  console.error(error)
})

const createServer = clip(function (requestListener: http.RequestListener) {
  return http.createServer(requestListener)
})

const afterListen = clip(function (this: Seek) {
  console.log(`[ok] server is listening on http://localhost:${this(port)()}`)
})

const requestHandler = clip(function (
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  this(requestLogger)(request)
  this(responseWriter)(response, this(requestRouter)(request))
})

const requestLogger = clip(function (request: http.IncomingMessage) {
  console.log(`${request.method} ${request.url}`)
})

const allRoutes = clip(function () {
  return {
    lower: this(lowerRoute),
    upper: this(upperRoute),
  }
})

const mapObjectKeys = clip(function (
  object: object,
  processor: (key: string) => any
): object {
  const results = {}

  Object.keys(object).forEach((key) => {
    results[key] = processor(key)
  })

  return results
})

const defaultResponse = clip(function (): any {
  return 'Not found'
})

const formatResponse = clip(function (this: Seek) {
  return JSON.stringify(this(defaultResponse)())
})

const requestRouter = clip(function (
  this: Seek,
  request: http.IncomingMessage
): string {
  const routes = this(allRoutes)()

  const [command, query] = this(parseUrl)(request.url)

  if (command in routes) {
    return this(formatResponse).swap(defaultResponse, function (this: Seek) {
      return routes[command](query)
    })()
  }

  if (command === '*') {
    return this(formatResponse).swap(defaultResponse, function (this: Seek) {
      return this(mapObjectKeys)(routes, (key) => routes[key](query))
    })()
  }

  return this(notFoundRoute)()
})

const parseUrl = clip(function (url: string): [string, string] {
  const [command = '', query = ''] = url
    .substr(1)
    .split('?')
    .map(decodeURIComponent)

  return [command, query]
})

const lowerRoute = clip(function (input: string): string {
  return input.toLowerCase()
})

const upperRoute = clip(function (input: string): string {
  return input.toUpperCase()
})

const notFoundRoute = clip(function () {
  return 'Not found'
})

const responseWriter = clip(function (
  response: http.ServerResponse,
  body: string
) {
  response.end(body)
})

main()
