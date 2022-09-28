import EventEmitter from 'events'

export abstract class PollingProvider<T> extends EventEmitter {
  address: string
  interval: number
  timer!: NodeJS.Timer

  constructor (address: string, interval?: number) {
    super()
    this.address = address
    this.interval = interval || 10000
  }

  emitWhatPoll = async (channel: string) => this.poll().then((t: T[]) => t.forEach(e => this.emit(channel, e)))

  abstract poll(): Promise<T[]>

  async subscribe (channel: string) {
    await this.emitWhatPoll(channel)
    this.timer = setInterval(() => this.emitWhatPoll(channel), this.interval)
  }

  unsubscribe () {
    clearInterval(this.timer)
  }
}
