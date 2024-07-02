import styles from "./Swap.lg.module.scss"
import {ReactNode, useState} from "react"
import { TxResult } from "@terra-money/wallet-provider"
import ClipLoader from "react-spinners/ClipLoader"
import {css} from "@emotion/react"
import useHash from "../../../libs/useHash"
import Card from "../../../components/Card"
import Container from "../../../components/Container"
import Pool from "../../../pages/Pool/Pool"
import Boundary, {bound} from "../../../components/Boundary"
import {div} from "../../../libs/math"
import Tooltip from "../../../lang/Tooltip.json"
import { LOOP } from "../../../constants"
import ExchangeForm from "./ExchangeForm"
import { Type } from "../../../pages/Exchange"
import {useTokenMethods} from "../../../data/contract/info"
import {useProtocol} from "../../../data/contract/protocol"
import { PostError } from "../../../forms/CustomMsgFormContainer"

interface Props {
  children: ReactNode
}

export interface EXCHANGE_TOKEN {
  token?: string
  symbol?: string
}

const SwapWidgetLarge = () => {
  const { hash: type } = useHash<Type>(Type.SWAP)
  const tab = {
    tabs: [Type.SWAP],
    tooltips: [Tooltip.Trade.General],
    current: type,
  }
  
  const { whitelist } = useProtocol()
  const { getToken } = useProtocol()
  const { check8decOper } = useTokenMethods()

  // LOOP ust pair
  const { pair } = whitelist[getToken(LOOP)] ?? {}
  
  const [token1, setToken1] = useState<EXCHANGE_TOKEN | undefined>({
    token: pair ?? "",
    symbol: "UST",
  })
  const [token2, setToken2] = useState<EXCHANGE_TOKEN | undefined>({
    token: getToken(LOOP) ?? "",
    symbol: LOOP,
  })

  const setTokens = (token1: EXCHANGE_TOKEN, token2?: EXCHANGE_TOKEN) => {
    token1.token
      ? setToken1(check8decOper(token1.token) ? token2 : token1)
      : setToken1({
        token: pair ?? "",
        symbol: "UST",
      })
    token2?.token
      ? setToken2(check8decOper(token1.token) ? token1 : token2)
      : setToken2({
        token: getToken(LOOP) ?? "",
        symbol: LOOP,
      })
  }

  const [simulatedPrice, setSimulatedPrice] = useState<string>("0")
  const [response, setResponse] = useState<TxResult | undefined>(undefined)
  const [error, setError] = useState<PostError>()

  const responseFun = (
    response: TxResult | undefined,
    errorResponse?: PostError
  ) => (response ? setResponse(response) : setError(errorResponse))
  const setSimulatedPriceFunc = (price?: string) =>
    setSimulatedPrice(price ?? "0")

  return (
      <div className={styles.block}>
        <ExchangeForm
            isNewDesign={true}
            smScreen
            type={type}
            tab={tab}
            key={type}
            setTokens={setTokens}
            responseFun={responseFun}
            setSimulatedPriceFunc={setSimulatedPriceFunc}
        />
    </div>
  )
}

export default SwapWidgetLarge
