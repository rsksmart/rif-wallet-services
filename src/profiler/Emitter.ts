import EventEmitter from 'events'

export abstract class Emitter extends EventEmitter {
    abstract subscribe(channel: string) : void
    abstract unsubscribe() : void
}
