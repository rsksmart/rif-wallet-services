import { Pool } from 'pg'
import { Logger } from 'winston'

export class TrackingService {
  private pool:Pool

  constructor (logger: Logger) {
    this.pool = new Pool()
    this.pool.on('error', (err) => {
      logger.error(err)
    })
  }

  async trackClient (address: string, traceId: string, chainId: string) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const query = 'INSERT INTO wallet_tracking(address, trace_id, created_at, chain_id) VALUES($1, $2, $3, $4)'
      await client.query(query, [address, traceId, new Date(), chainId])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
    } finally {
      client.release()
    }
  }
}
