
import {  selector } from "recoil"
import { apiURLQuery } from "../network"
import { fetchAPI } from "../../libs/fetchApi"
import { priceKeyIndexState } from "../app"

export const unitPricesStore = selector({
    key: "unitPricesStore",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'getUnitPrices'})
    },
})

export const tradingListStore = selector({
    key: "tradingListStore",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'tradingData'})
    },
})

export const factory2Pairs = selector({
    key: "factory2Pairs",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'factory2Pairs'})
    },
})


export const cardsStore = selector({
    key: "cardsStore",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'dashboardCard'})
    },
})

export const stakingStore = selector({
    key: "stakingStore",
    get: async ({ get }) => {
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'stakingData'})
    },
})

/* native */
export const fetchAPIQuery = selector({
    key: "fetchAPIQuery",
    get: ({ get }) => {
        const url = get(apiURLQuery)
        return async({ name }: { name: string}) => await fetchAPI(`${url}/v1/contracts/` + name)
    },
})

export const statsStore = selector({
    key: "statsStore",
    get: async ({ get }) => {
        get(priceKeyIndexState)
        const fetchAPIQ = get(fetchAPIQuery)
        return fetchAPIQ({name: 'statsData'})
    },
})
