export const crypto = {
  async getCrypto(name) {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${name}&tsyms=USD&api_key=${process.env.VUE_APP_KEY}`
      );
      if (!response.ok) {
        throw new Error("нет данных");
      }
      return await response.json();
    },
    async getAll() {
      const response = await fetch("https://min-api.cryptocompare.com/data/all/coinlist")
      if (!response.ok) {
        throw new Error("нет данных");
      }
      const result = await response.json()
      return result.Data;
    }

  }