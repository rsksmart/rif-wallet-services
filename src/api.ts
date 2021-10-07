
import axios from 'axios'
import { EventsServerResponse, TransactionsServerResponse, TokensServerResponse } from './types'
import { fromApiToTEvents, fromApiToTokens, fromApiToTokenWithBalance } from './utils'

export class Api {
    apiURL: string
    chainId: number
    
    constructor(apiURL: string, chainId: number){
        this.apiURL = apiURL
        this.chainId = chainId
    }

    async getEventsByAddress(address:string){
        const params = {
            module:'events',
            action:'getAllEventsByAddress',
            address
        }

        const response = await axios.get<EventsServerResponse>(this.apiURL, { params } )
        return response.data.data.map(ev => fromApiToTEvents(ev))
    }

    async getTokens(){
        const params = {
            module:'addresses',
            action:'getTokens'
        }

        const response = await axios.get<TokensServerResponse>(this.apiURL, { params } )
        return response.data.data
            .filter(t => t.name != null)
            .map( t => fromApiToTokens(t,this.chainId))
    }

    async getTokensByAddress(address:string){
        const params = {
            module:'tokens',
            action:'getTokensByAddress',
            address
        }

        const response = await axios.get<TokensServerResponse>(this.apiURL, { params } )
        return response.data.data
            .filter(t => t.name != null)
            .map( t => fromApiToTokenWithBalance(t,this.chainId))
    }

    async getTransactionsByAddress(address:string){
        const params = {
            module:'transactions',
            action:'getTransactionsByAddress',
            address
        }
        const response = await axios.get<TransactionsServerResponse>(this.apiURL, { params } )
        return response.data.data
    }
}
