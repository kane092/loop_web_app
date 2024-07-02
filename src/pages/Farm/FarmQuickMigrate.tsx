import {useEffect, useState} from "react"
import {FarmContractTYpe, useFindDevTokensByLpFarm2, useFindStakedByUserFarmQueryFarm2} from "../../data/farming/FarmV2"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { div, gt, minus, multiple, plus } from "../../libs/math"
import { MIN_FEE, SMALLEST, UST, UUSD } from "../../constants"
import { toBase64 } from "../../libs/formHelpers"
import { FactoryType, useContractsList, useFarms, useFindBalance } from "../../data/contract/normalize"
import { CONTRACT } from "../../hooks/useTradeAssets"
import { useProtocol } from "../../data/contract/protocol"
import Card from "../../components/Card"
import Page from "../../components/Page"
import usePoolDynamic from "../../forms/Pool/usePoolDynamic"
import { useTokenMethods } from "../../data/contract/info"
import { usePoolPairPool, usePoolPairPoolList } from "../../data/contract/migrate"
import { useContractsV2List } from "../../data/contract/factoryV2"
import { insertIf } from "../../libs/utils"
import { decimal, isNative, lookupAmount, lookupSymbol } from "../../libs/parse"
import useFee from "../../graphql/useFee"
import useTax from "../../graphql/useTax"
import { useFindTokenDetails } from "../../data/form/select"

const queryString = require('query-string')

const useUnformStep1 = ({lpToken, farmType}:{farmType: FarmContractTYpe, lpToken: string}) => {

    const findStakedByUserFarmFn = useFindStakedByUserFarmQueryFarm2(farmType)
    const findStaked  = findStakedByUserFarmFn(lpToken) ?? "0"
    const user_staked = findStaked

    const { contracts } = useProtocol()
    const newContractMsg = useNewContractMsg()
    const contract:any = contracts[farmType] ?? ""

    const FindDevTokensByLpFarm2 = useFindDevTokensByLpFarm2(farmType)
    const devTokenFarm2 = FindDevTokensByLpFarm2?.(lpToken ?? "")

    return {
        msgs: [
            newContractMsg(devTokenFarm2 ?? '', {
              send: {
                contract: contract,
                amount: user_staked,
                msg: "eyJ1bnN0YWtlX2FuZF9jbGFpbSI6e319", //{unstake_and_claim:{}}
              },
            })
          ],
        value: user_staked
    }
}

const useWithdrawStep2 = ({lpToken, farmType}:{farmType: FarmContractTYpe, lpToken: string}) => {

    const { value, msgs } = useUnformStep1({farmType, lpToken})
    console.log("step 1", msgs.length, msgs)
    const { contents: findPair } = useContractsList()
    const pair = findPair?.find((list: CONTRACT) => list.lp === lpToken)?.pair ?? ''
    const token1 = lpToken
    const findBalanceFn = useFindBalance()
    const maxLiquidity = plus(findBalanceFn?.(token1) ?? "0", value ?? "0") // @todo plus previous value here 
    const amount = maxLiquidity
    
    const { check8decOper } = useTokenMethods()
    const getPool = usePoolDynamic(123)
    const { contents: poolResult} = usePoolPairPool(pair ?? "")

    const pool = token1
      ? getPool({
        amount: check8decOper(lpToken) ? multiple(amount, 100) : amount,
        token: lpToken,
        token2: UST,
        pairPoolResult: poolResult,
        type: 'withdraw',
      })
      : undefined

    const newContractMsg = useNewContractMsg()
    
    const data = (lpToken && pair) ? [
          newContractMsg(lpToken, {
            send: {
              amount: amount,
              contract: pair ?? "",
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ] : []
      
    return {
        msgs: [...msgs, ...data],
        value: pool?.fromLP
    }
}

const useProvideStep3 = ({lpToken: lp, ticker, farmType}:{farmType: FarmContractTYpe, ticker: string, lpToken: string}) => {

    const { value, msgs } = useWithdrawStep2({farmType, lpToken: lp})
    console.log("step 2", msgs.length, msgs)
    const factoryPairs = useFarms(FactoryType.fac2)
    const { check8decOper } = useTokenMethods()
    const{ contents: findLpTokens } = useContractsV2List()
    const [tokens, setTokens] = useState<string[]|undefined>(undefined)
    const [pair, setPair] = useState<string>('')
    const [lpToken, setLpToken] = useState<string>('')

    useEffect(()=>{
        const tokenList = findLpTokens?.filter((item) => item.lp === lpToken) ?? []
        lpToken && setTokens(tokenList.map((item)=> item.contract_addr))
    },[lpToken,findLpTokens])

    useEffect(()=>{
        if(ticker){
            const row = factoryPairs?.find((item) => {
                const symbol = item.symbol.toLowerCase().replace(/\s/g, '').split('-')
                const tick = ticker.toLowerCase().replace(/\s/g, '')
                const found = tick.includes(symbol?.[0] ?? '') && tick.includes(symbol?.[1] ?? '')
                return found ?? false
            })
            if(row){
                setLpToken(row.lpToken)
                setPair(row.contract_addr)
            }
        }
    },[ticker, factoryPairs])

    const findTokenDetailFn = useFindTokenDetails()

    const token1 = tokens ?  tokens[0] : ''
    const token2 = tokens ?  tokens[1] : ''

    const token1Detail = findTokenDetailFn(tokens?.[0] ?? token1)
    const token2Detail = findTokenDetailFn(tokens?.[1] ?? token2)
    const symbol1 = token1Detail ? lookupSymbol(token1Detail.tokenSymbol) : ""
    const [amount, setAmount] = useState<string>('0')
    const findBalanceFn = useFindBalance()
    const [totalTax, setTotalTax] = useState("0")
    const oldData = value
    
  const [addVal1, setAddVal1] = useState<string>('0')
  const [addVal2, setAddVal2] = useState<string>('0')
    
  useEffect(()=>{
    if(oldData){
    setAddVal1(oldData.asset.token === token1 ? oldData.asset.amount :  (oldData.uusd.token === token1 ? oldData.uusd.amount : "0"))
    setAddVal2(oldData.asset.token === token2 ? oldData.asset.amount :  (oldData.uusd.token === token2 ? oldData.uusd.amount : "0"))
    }
  },[value])
  
    useEffect(()=>{
        const deductTax = [UST,'UUSD'].includes(symbol1.toUpperCase())
        const num = minus(
          findBalanceFn(token1),
            deductTax ? totalTax : "0"
        )
        const maxInput = gt(num, 0)
            ? isNative(token1)
                ? decimal(num, 5)
                : num
            : "0"
        const maxValue = deductTax
            ? gt(maxInput, "100")
                ? minus(maxInput, 10)
                : minus(maxInput, 0.5)
            : maxInput
        
        setAmount(multiple(plus(maxValue, addVal1), SMALLEST))
      },[token1, token2, value?.value])

    const { contents: poolPairPoolList} = usePoolPairPoolList()
    const poolResult: any = poolPairPoolList?.[pair ?? ""]
    const getPool = usePoolDynamic(value?.value)

    const perTokenPoolValue = token1
      ? getPool({
        amount: SMALLEST.toString(),
        token:  token1,
        token2: token2 ?? UST,
        pairPoolResult: poolResult,
        type: 'provide',
      })
      : undefined

    const pool = token1
      ? getPool({
        amount: check8decOper(token1) ? multiple(amount, 100) : amount,
        token:token1,
        token2: token2 ?? UST,
        pairPoolResult: poolResult,
        type: 'provide',
      })
      : undefined

  const toLP = pool?.toLP
  
  const estimated = div(pool?.toLP.estimated, SMALLEST)
  
  const firstTokenMaxValue = isNative(token1)
        ? lookupAmount(findBalanceFn(token1), 0)
        : lookupAmount(findBalanceFn(token1), token1Detail?.decimals)

  useEffect(() => {
    const secondTokenMax = token2
    ? isNative(token2)
        ? lookupAmount(plus(findBalanceFn(token2), addVal2), 0)
        : lookupAmount(plus(findBalanceFn(token2), addVal2), token2Detail?.decimals)
    : "0"

    if (gt(div(toLP?.estimated ?? "0", SMALLEST), secondTokenMax)) {
      
      const adjustedValue = minus(
          div(secondTokenMax, div(perTokenPoolValue?.toLP.estimated, SMALLEST)),
          MIN_FEE
      )
      
      const calculatedVal = decimal(
          gt(adjustedValue, 0) ? adjustedValue : "0",
          4
      )
      
      const valid =
          !gt(adjustedValue, firstTokenMaxValue) && token2

      valid &&
      setAmount(multiple(isNative(token1) ? decimal(calculatedVal, 3) : calculatedVal, SMALLEST))
    }
  }, [toLP?.estimated, token1, token2])

    const tokenNative = isNative(token1)
    ? { native_token: { denom: token1 } }
    : { token: { contract_addr: token1 } }

    const token2Native = isNative(token2)
        ? { native_token: { denom: token2 } }
        : { token: { contract_addr: token2 } }

    const provide_liquidityForContract = {
    assets: [
        { amount: check8decOper(token1) ? multiple(amount, 100) : amount, info: { ...tokenNative } },
        {
        amount: multiple(check8decOper(token2) ? div(estimated, 100) : estimated ?? "", SMALLEST),
        info: { ...token2Native },
        },
    ],
    }
    const insertToken1Coins: any = isNative(token1) && {
        amount: amount,
        denom: token1 ?? UUSD,
      }
    
      const insertToken2Coins: any = isNative(token2) && {
        amount: multiple(estimated ?? "0", SMALLEST),
        denom: token2 ?? UUSD,
      }

      const { contracts } = useProtocol()
    const newContractMsg = useNewContractMsg()

    const data = [
        ...insertIf(
            !isNative(token1),
            newContractMsg(token1, {
              increase_allowance: { amount: check8decOper(token1) ? multiple(amount, 100) : amount, spender: pair },
            })
        ),
        ...insertIf(
            !isNative(token2) && estimated,
            newContractMsg(token2, {
              increase_allowance: {
                amount: multiple(check8decOper(token2) ? div(estimated, 100) : estimated ?? "0", SMALLEST),
                spender: pair,
              },
            })
        ),
        newContractMsg(
            pair,
            {
              provide_liquidity: provide_liquidityForContract,
            },
            isNative(token1) && insertToken1Coins,
            isNative(token2) && insertToken2Coins
        ),
        newContractMsg(lpToken, {
          increase_allowance: {
            amount:  decimal(toLP?.value, 0),
            spender: contracts["loop_farm_staking_v4"] ?? "",
          },
        }),
        newContractMsg(lpToken, {
          send: {
            contract: contracts["loop_farm_staking_v4"] ?? "",
            amount:  decimal(toLP?.value, 0),
            msg: "eyJzdGFrZSI6e319", //{stake:{}}
          }
        })
      ]

      const uusd = pool?.toLP.estimated ?? "0"

      const fee = useFee(data?.length)
      const { calcTax } = useTax()
      const tax = { pretax: uusd, deduct: false }
      const calculateTax = tax.pretax ? calcTax(tax.pretax) : "0"
    
      useEffect(() => {
        setTotalTax(plus(div(calculateTax, SMALLEST), div(fee.amount, SMALLEST)))
      }, [calculateTax])

    
    return {
        msgs: [...msgs, ...data],
        value: pool?.fromLP
    }
}


export function FarmQuickMigrate() {
    const [farmType, setFarmType]  = useState<FarmContractTYpe>(FarmContractTYpe.Farm2)
    const [lpToken, setLp]  = useState('')
    const [ticker, setTicker]  = useState('')

    useEffect(()=>{
        const  query= queryString.parse(window.location.search);

        if (query.lp) {
            setLp(query.lp)
        }
        if (query.ticker) {
            setTicker(query.ticker)
        }
        if (query.ticker) {
            setFarmType(query.type)
        }
    },[window.location.search, queryString])

    const step = useProvideStep3({farmType, ticker, lpToken})

    return (
    <Page>
        {
          step.msgs.map((item)=> <div style={{marginTop: 10}}><Card><p style={{overflow: 'auto',overflowWrap: 'anywhere',  padding: 10}}>{JSON.stringify(item, null, 2)}</p></Card></div>
          )
            // JSON.stringify([...step.msgs], null, 2)
            
        }
    
    </Page>
  )
}