import axios from 'axios'

interface CoinPriceResponseType {
  [key: string]: {
    usd: number
  }
}

class CoinPriceService {
  async fetchUsdPrice(coingeckoId: string): Promise<CoinPriceResponseType> {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_DOPAMINT_UTILS_API}/price`, {
        params: {
          ids: coingeckoId,
          vs_currencies: 'usd',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return data
    } catch {
      return { [coingeckoId]: { usd: 0 } }
    }
  }
}

export const coinPriceService = new CoinPriceService()
