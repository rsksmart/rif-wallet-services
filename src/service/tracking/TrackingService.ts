import { Pool } from 'pg'

export class TrackingService {
  private pool:Pool

  constructor() {
    console.log('Entering')
    this.pool = new Pool()
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  async trackClient(address: string, ) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const existsAddressQuery = 'SELECT 1 FROM tracking WHERE address = $1'
      const exists = await client.query(existsAddressQuery, [address])
      if (!exists.rows.length) {
        const query = 'INSERT INTO tracking(address) VALUES($1)'
        const res = await client.query(query, [address])
        await client.query('COMMIT')
      }
    } catch (e) {
      await client.query('ROLLBACK')
    } finally {
      client.release()
    }
    
  }
}