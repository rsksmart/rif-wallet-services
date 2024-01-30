import EventEmitter from 'events'
import CircuitBreaker from 'opossum'

export abstract class PollingProvider<T> extends EventEmitter {
  address: string
  interval: number
  timer!: NodeJS.Timer

  constructor (address: string, interval?: number) {
    super()
    this.address = address
    this.interval = interval || 10000
  }

  abstract poll(): Promise<T[]>
  breaker = new CircuitBreaker(() => this.poll(),
    { timeout: 30000, errorThresholdPercentage: 50, resetTimeout: 300000 })

  emitWhatPoll = async (channel: string) => this.breaker.fire()
    .then((t: T[]) => t.forEach(e => this.emit(channel, e)))
    .catch((e) => console.error(e))

  async subscribe (channel: string) {
    await this.emitWhatPoll(channel)
    this.timer = setInterval(() => this.emitWhatPoll(channel), this.interval)
  }

  unsubscribe () {
    clearInterval(this.timer)
  }
}
