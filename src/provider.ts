import chainMap from 'chainmap'
import { ChainInfo } from './types/provider.js'
import { FallbackProvider, JsonRpcProvider } from 'ethers'

export default class Provider {
  chainInfo: ChainInfo
  providers: JsonRpcProvider[]

  constructor(chainId) {
    this.chainInfo = chainMap[chainId]
    console.log(chainMap)

    this.providers = []
    for (const url of this.chainInfo.rpc) {
      this.providers.push(new JsonRpcProvider(url, this.chainInfo))
    }
  }

  #getBalance(address) {
    if (this.providers.length > 0) {
      try {
        const balance = this.providers[0].getBalance(address)
        return balance
      } catch {
        this.providers.shift()
        return this.#getBalance(address)
      }
    }
  }

  getBalance(address) {
    return this.#getBalance(address)
    // console.log(this.provider.)
  }
  #send(method, params) {
    if (this.providers.length > 0) {
      try {
        const balance = this.providers[0].send(method, params)
        return balance
      } catch {
        this.providers.shift()
        return this.#send(method, params)
      }
    }
  }

  send(method, params) {
    return this.#send(method, params)
  }
}
