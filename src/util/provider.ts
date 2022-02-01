export interface Provider {

    subscribe(address: string) : void
    unsubscribe(address: string) : void
    
}