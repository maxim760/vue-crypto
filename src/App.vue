<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                @keydown="resetError"
                @keydown.enter="add()"
                ref="ticker"
                v-model="ticker"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10  border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
              <div v-if="ticker" class="flex justify-around">
                <button
                  v-for="name in getFirstMatches"
                  class="p-0.5 px-2 rounded-xl text-xs bg-gray-300 m-2"
                  @click="add(name)"
                  :key="name"
                  type="button"
                >
                  {{ name }}
                </button>
              </div>
            </div>
            <p class="text-red-400" v-if="error">{{ error }}</p>
          </div>
        </div>
        <button
          @click="add()"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>

      <template v-if="tickers.length">
        <hr />
        <div>
          <button
            v-if="page > 1"
            @click="prevPage"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Назад
          </button>
          <button
            v-if="isShowNext"
            @click="nextPage"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Вперед
          </button>
          <div class="mt-1">
            Фильтр:&nbsp;<input v-model="filter" class="p-2" />
          </div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Ticker
            v-for="t in filteredTickers"
            :price="t.price"
            :name="t.name"
            :key="t.name"
            @remove="remove"
            @select="select"
            :sel="sel"
          />
        </dl>
      </template>
      <template v-if="sel">
        <hr class="w-full border-t border-gray-600 my-4" />
        <section class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ sel?.name }}
          </h3>
          <div class="flex items-end border-gray-600 border-b border-l h-64">
            <div
              v-for="(bar, i) in normalizeGraph()"
              :key="i"
              class="bg-purple-800 border w-10"
              :style="{
                height: `${bar}%`,
              }"
            />
          </div>
          <button type="button" class="absolute top-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import Ticker from "./components/ticker";
import { crypto } from "./services/crypto";

export default {
  name: "App",
  data: () => ({
    countTickerPage: 6,
    ticker: "",
    tickers: [],
    sel: null,
    graph: [],
    allCryptos: null,
    error: null,
    page: 1,
    filter: "",
  }),
  components: {
    Ticker,
  },
  methods: {
    focusInput() {
      this.$refs.ticker.focus();
    },
    subscribeToUpdates(ticker) {
      setInterval(async () => {
        const newCrypto = await crypto.getCrypto(ticker.name);
        if (newCrypto?.USD !== undefined) {
          ticker.price =
            newCrypto.USD > 1
              ? newCrypto.USD.toFixed(2)
              : newCrypto.USD.toPrecision(2);
          if (this.sel?.name === ticker.name) {
            this.graph.push(newCrypto.USD);
          }
        } else {
          ticker.price = "Нет информации";
        }
      }, 3000);
    },
    add(name = undefined) {
      const temp = name || this.ticker;
      const crypt = temp.trim().toUpperCase();
      if (!crypt) {
        this.setError("Вы не выбрали тикер");
        return;
      }
      const isNotUniqName = this.tickers.some((t) => t.name === crypt);
      if (isNotUniqName) {
        this.setError(`Тикер ${crypt} уже добавлен`);
        return;
      }
      if (
        !this.getCryptosByQuery.some((item) => item.toUpperCase() === crypt)
      ) {
        this.setError(`Такого тикера не существует`);
        return;
      }
      this.tickers.push({ name: crypt, price: null });
      window.localStorage.setItem(
        "cryptonomicon-list",
        JSON.stringify(this.tickers)
      );
      this.resetError();
      const currentTicker = this.getLastTicker;
      this.ticker = "";
      if (!this.sel) {
        this.select(currentTicker);
      }
      this.filter = "";
      this.subscribeToUpdates(currentTicker);
      this.focusInput();
    },
    nextPage() {
      this.page++;
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    setError(message) {
      this.error = message;
    },
    resetError() {
      this.error = null;
    },
    async getAllCrypto() {
      const cryptos = await crypto.getAll();
      this.allCryptos = Object.keys(cryptos).map((key) => {
        return { name: key, fullName: cryptos[key].FullName };
      });
    },
    remove(name) {
      this.tickers = this.tickers.filter((t) => t.name !== name);
      if (name === this.sel?.name) {
        this.select(null);
      }
      if ((this.page - 1) * this.countTickerPage >= this.tickers.length) {
        this.prevPage();
      }
    },
    select(crypto) {
      if (!crypto) {
        this.sel = null;
      }
      if (this.sel?.name === crypto.name) {
        return;
      }
      this.sel = crypto;
      this.graph = [];
    },
    normalizeGraph() {
      const maxPrice = Math.max(...this.graph);
      const minPrice = Math.min(...this.graph);
      return this.graph.map((bar) => {
        return minPrice >= maxPrice
          ? 50
          : ((bar - minPrice) / (maxPrice - minPrice)) * 80 + 20;
      });
    },
    filterAllTickers() {
      if (this.isFilter) {
        if (this.tickersLength <= this.countTickerPage) {
          this.page = 1;
        } else if (
          (this.page - 1) * this.countTickerPage >=
          this.tickersLength
        ) {
          this.setMaxAvailablePage();
        }
        const regex = new RegExp(this.filter, "i");
        return this.tickers.filter((t) => regex.test(t.name));
      }
      return this.tickers;
    },
    setMaxAvailablePage() {
      this.page = Math.ceil(this.tickersLength / this.countTickerPage);
    },
  },
  computed: {
    isFilter() {
      return this.filter.length > 0;
    },
    tickersLength() {
      return this.filterAllTickers().length;
    },
    filteredTickers() {
      const start = () => (this.page - 1) * this.countTickerPage;
      const end = () => this.page * this.countTickerPage;
      // во время filter all tickers модкт поменятся страница и поэтому
      // данные в слайсе должные измениться динамиски
      return this.filterAllTickers().slice(start(), end());
    },
    isShowNext() {
      return this.tickersLength > this.page * this.countTickerPage;
    },
    getLastTicker() {
      return this.tickers[this.tickers.length - 1];
    },
    getCryptos() {
      return this.allCryptos;
    },
    getCryptosByQuery() {
      if (!this.getCryptos) {
        return [];
      }
      const regex = new RegExp(this.ticker, "i");
      return this.getCryptos.reduce((acc, value) => {
        if (
          !this.tickers.some((t) => {
            return t.name === value.name;
          }) &&
          (regex.test(value.name) || regex.test(value.fullName))
        ) {
          acc.push(value.name);
        }
        return acc;
      }, []);
    },
    getFirstMatches() {
      return this.getCryptosByQuery.slice(0, 4);
    },
  },
  created() {
    this.tickers =
      JSON.parse(window.localStorage.getItem("cryptonomicon-list")) || [];
    for (let i = 0; i < this.tickers.length; i++) {
      this.subscribeToUpdates(this.tickers[i]);
    }
    const {searchParams} = new URL(window.location)
    this.filter = searchParams.get("filter") || ""
    this.page = searchParams.get("page") || 1
  },
  mounted() {
    this.getAllCrypto();
  },
  watch: {
    filter(value) {
      const { pathname } = window.location;
      window.history.replaceState(
        null,
        document.title,
        `${pathname}?filter=${value}&page=${this.page}`
      );
    },
    page(value) {
      const { pathname } = window.location;
      window.history.replaceState(
        null,
        document.title,
        `${pathname}?filter=${this.filter}&page=${value}`
      );
    },
  },
};
</script>

<style src="./app.css"></style>
