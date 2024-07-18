/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { WalletConnectModalConfig } from '@walletconnect/modal'
import { WalletConnectModal } from '@walletconnect/modal'
import SignClient from '@walletconnect/sign-client'
import { pubsub } from './preload.js'

// -- Types ----------------------------------------------------------------
export type WalletConnectModalSignSession = SignClient['session']['values'][number]

export interface WalletConnectModalSignOptions {
  projectId: string
  metadata: SignClient['metadata']
  relayUrl?: string
  modalOptions?: Omit<WalletConnectModalConfig, 'projectId' | 'walletConnectVersion'>
}

export type WalletConnectModalSignConnectArguments = Parameters<SignClient['connect']>[0]

export type WalletConnectModalSignRequestArguments = Parameters<SignClient['request']>[0]

export type WalletConnectModalSignDisconnectArguments = Parameters<SignClient['disconnect']>[0]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WalletConnectModalEventCallback = (data: any) => void

export interface WalletConnectOptions extends WalletConnectModalSignOptions {
  chainId: number
}
// -- Client ---------------------------------------------------------------
export class WalletConnectModalSign {
  #options: WalletConnectModalSignOptions

  #modal: WalletConnectModal

  #initSignClientPromise?: Promise<void> = undefined

  #signClient?: InstanceType<typeof SignClient> = undefined

  #chainId = 1

  provider

  get chainId() {
    return this.#chainId
  }

  public constructor(options: WalletConnectOptions) {
    this.#options = options
    pubsub.subscribe('chain-change', (value) => (this.#chainId = value))
    if (pubsub.hasSubscribers('chain-change')) {
      const value = pubsub.getValue('chain-change')
      this.#chainId = value ?? options.chainId
    } else {
      this.#chainId = options.chainId
    }

    this.#modal = this.#initModal()
    this.#initSignClient()
  }

  // -- public ------------------------------------------------------------
  public async connect(args: WalletConnectModalSignConnectArguments) {
    const { requiredNamespaces, optionalNamespaces } = args

    return new Promise<WalletConnectModalSignSession>(async (resolve, reject) => {
      await this.#initSignClient()

      const unsubscribeModal = this.#modal.subscribeModal((state) => {
        if (!state.open) {
          unsubscribeModal()
          reject(new Error('Modal closed'))
        }
      })

      const { uri, approval } = await this.#signClient!.connect(args)

      if (uri) {
        const namespaceChains = new Set<string>()
        if (requiredNamespaces) {
          Object.values(requiredNamespaces).forEach(({ chains }) => {
            if (chains) {
              chains.forEach((chain) => namespaceChains.add(chain))
            }
          })
        }
        if (optionalNamespaces) {
          Object.values(optionalNamespaces).forEach(({ chains }) => {
            if (chains) {
              chains.forEach((chain) => namespaceChains.add(chain))
            }
          })
        }
        await this.#modal.openModal({ uri, chains: Array.from(namespaceChains) })
      }

      try {
        const session = await approval()
        resolve(session)
      } catch (err) {
        reject(err)
      } finally {
        unsubscribeModal()
        this.#modal.closeModal()
      }
    })
  }

  public async disconnect(args: WalletConnectModalSignDisconnectArguments) {
    await this.#initSignClient()
    await this.#signClient!.disconnect(args)
  }

  sign(tx) {
    this.request
  }

  public async request<Result>(args: WalletConnectModalSignRequestArguments) {
    await this.#initSignClient()

    const session = await this.getSession()
    const result = await this.#signClient.request({
      request: args,
      chainId: `eip155:${this.#chainId}`,
      topic: session.topic
    })

    return result as Result
  }

  public async getSessions() {
    await this.#initSignClient()

    return this.#signClient!.session.getAll()
  }

  public async getSession() {
    await this.#initSignClient()

    return this.#signClient!.session.getAll().at(-1)
  }

  public async getAccounts() {
    const session = await this.getSession()

    const accounts = session.namespaces.eip155.accounts.reduce((accounts, account) => {
      if (account.includes(`eip155:${this.#chainId}`)) {
        accounts.push(account.replace(`eip155:${this.#chainId}:`, ''))
      }
      return accounts
    }, [])

    return accounts
  }

  public async onSessionEvent(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.on('session_event', callback)
  }

  public async offSessionEvent(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.off('session_event', callback)
  }

  public async onSessionUpdate(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.on('session_update', callback)
  }

  public async offSessionUpdate(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.off('session_update', callback)
  }

  public async onSessionDelete(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.on('session_delete', callback)
  }

  public async offSessionDelete(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.off('session_delete', callback)
  }

  public async onSessionExpire(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.on('session_expire', callback)
  }

  public async offSessionExpire(callback: WalletConnectModalEventCallback) {
    await this.#initSignClient()
    this.#signClient.off('session_expire', callback)
  }

  // -- private -----------------------------------------------------------
  #initModal() {
    const { modalOptions, projectId } = this.#options

    return new WalletConnectModal({
      ...modalOptions,
      projectId
    })
  }

  async #initSignClient() {
    if (this.#signClient) {
      return true
    }

    if (!this.#initSignClientPromise && typeof window !== 'undefined') {
      this.#initSignClientPromise = this.#createSignClient()
    }

    return this.#initSignClientPromise
  }

  async #createSignClient() {
    this.#signClient = await SignClient.init({
      metadata: this.#options.metadata,
      projectId: this.#options.projectId,
      relayUrl: this.#options.relayUrl
    })
    const clientId = await this.#signClient.core.crypto.getClientId()
    try {
      localStorage.setItem('WCM_WALLETCONNECT_CLIENT_ID', clientId)
    } catch {
      console.info('Unable to set client id')
    }
  }
}

globalThis.walletConnect = new WalletConnectModalSign({
  projectId: 'b2fb1912c871cdea6e6e819335cbcdff',
  modalOptions: { themeMode: 'dark' },
  metadata: {
    name: 'Foxswap',
    description: 'AppKit Example',
    url: 'https://babyfoxtoken.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  chainId: document.querySelector('app-shell').chain.chainId
})
