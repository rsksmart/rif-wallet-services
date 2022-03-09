import EventEmitter from 'events'

export abstract class PollingProvider<T> extends EventEmitter {
  address: string
  interval: number = 60000
  timer!: NodeJS.Timer

  constructor (address) {
    super()
    this.address = address
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
