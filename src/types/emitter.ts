import EventEmitter from 'events'

export abstract class Emitter extends EventEmitter {

    
    abstract subscribe() : void
    abstract unsubscribe() : void
}