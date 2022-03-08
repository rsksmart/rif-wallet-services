import EventEmitter from 'events'

export abstract class PollingProvider<T> extends EventEmitter {
  address!: string
  interval: number = 60000
  timer!: NodeJS.Timer

  emitWhatPoll = async () => this.poll().then((t: T[]) => t.forEach(e => this.emit(this.address, e)))

  abstract poll(): Promise<T[]>

  async subscribe () {
    await this.emitWhatPoll()
    this.timer = setInterval(() => this.emitWhatPoll(), this.interval)
  }

  unsubscribe () {
    clearInterval(this.timer)
  }
}
