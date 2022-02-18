import EventEmitter from 'events'

export abstract class PollingProvider extends EventEmitter {

    interval: number = 60000
    timer!: NodeJS.Timer
    abstract subscribe() : void
    abstract unsubscribe() : void

}
