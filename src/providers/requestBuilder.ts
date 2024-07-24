import { REQUEST_BUILDER_ERROR_INSUFFICIENT_DATA } from '@/src/types/errors'

export class RequestBuilder {
  public _url?: URL
  public _headers?: Headers

  public url(url: URL) {
    this._url = url as URL
    return this
  }

  header(key: string, value: string) {
    if (this._headers === undefined) {
      this._headers = new Headers()
    }
    this._headers.set(key, value)
    return this
  }

  build(): Promise<Response> {
    if (this._url === undefined) {
      throw new Error(REQUEST_BUILDER_ERROR_INSUFFICIENT_DATA('URL is undefined.').message)
    }
    let options = {}
    if (this._headers) {
      options = { ...options, headers: this._headers }
    }
    return fetch(this._url, options)
  }
}
