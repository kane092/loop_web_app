import {ReactNode} from "react"

import { LP, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { commas, decimal, formatAsset, formatAssetAmount, lookupSymbol } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import {getICon2} from "../../routes"
import styles from "../Dashboard/TopTrading.module.scss"

import { Type } from "../PoolDynamic"
import NoAssets from "../My/NoAssets"
import NftBondCard from "./components/nft/nftBond"
import FarmComp from "./components/farm/farmComp"
import ValueModule from "./components/value.module"
import { Di } from "../../components/Dl"
import { number } from "../../libs/math"
import Price from "../../components/Price"
import { bound } from "../../components/Boundary"
import Card from "../../components/Card"

interface Data extends ListedItem {
  balance: string
  withdrawable: { value: string; text: string }
  share: string | Element | ReactNode
}

interface Props {
  loading: boolean
  totalWithdrawableValue: string
  dataSource: Data[]
}

const MyPoolTable = ({ totalWithdrawableValue,dataSource }: Props) => {
  const dataExists = !!dataSource.length
  /*const description = dataExists && (
    <Di
      title="Total Withdrawable Value"
      content={
        <TooltipIcon content={Tooltip.My.TotalWithdrawableValue}>
          <p><span className={styles.value}>{formatAssetAmount(totalWithdrawableValue, formatAssetToken(UUSD))}</span> <span>{formatAssetToken(UUSD)}</span></p>
        </TooltipIcon>
      }
    />
  )*/

  return (
    <>
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool Name",
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  {symbol}
                </>
              ),
              bold: true,
            },
            {
              key: "balance",
              title: (
                <TooltipIcon content={Tooltip.My.LP}>LP Balance</TooltipIcon>
              ),
              render: (value) => formatAsset(value, LP),
            },
            {
              key: "share",
              title: (
                <TooltipIcon content={Tooltip.My.PoolShare}>
                  Pool share
                </TooltipIcon>
              )
            },
            {
              key: "actions",
              dataIndex: "pair",
              render: (pair, {lpToken}) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { pair, lpToken },
                }

                const farmRoute = `${getPath(MenuKey.FARMBETA)}`

                const list = [
                  {
                    to: { ...to, hash: Type.PROVIDE },
                    children: Type.PROVIDE,
                  },
                  {
                    to: { ...to, hash: Type.WITHDRAW },
                    children: Type.WITHDRAW,
                  },
                  {
                    to: farmRoute,
                    children: MenuKey.FARMBETA,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Pool}
            link={MenuKey.POOL}
          />

      )}
    </>
  )
}

export default MyPoolTable



export const MyPoolTableV2 = ({ totalWithdrawableValue,dataSource }: Props) => {
  const dataExists = !!dataSource.length
  const description = (dataExists && !isNaN(number(totalWithdrawableValue))) && (
    <Di
        title="Total Withdrawable Value"
        className={styles.withDrawableValue}
        content={
            <TooltipIcon content={Tooltip.My.TotalWithdrawableValue}>
                <Price price={commas(decimal(totalWithdrawableValue ?? "0",2))} symbol={lookupSymbol(UUSD)} />
            </TooltipIcon>
        }
    />
)


  return (
    <>
    <Card
            title="Liquidity Positions"
            className={styles.your_liquidity}
            description={bound(description)}
        >
      {dataExists ? (
        <Table
          columns={[
            {
              key: "symbol",
              title: "Pool",
              
              render: (symbol, { status }) => (
                <>
                  {status === "DELISTED" && <Delisted />}
                  <div className={styles.icontable}>
                    <div className={styles.icontableHub}>
                      <img
                        style={{ width: "30px", borderRadius: "25px" }}
                        src={getICon2(symbol.split("-")[0].trim().toUpperCase())}
                        alt=" "
                      />
                      <img
                        style={{ width: "30px", borderRadius: "25px" }}
                        src={getICon2(symbol.split("-")[1].trim().toUpperCase())}
                        alt=" "
                      />
                    </div>
                    <p style={{ display: "block" }}>{symbol}</p>
                  </div>
                </>
              ),
              bold: true,
            },
            {
              key: "balance",
              title: "LP Balance",
              render: (value) => formatAsset(value, LP),
            },
            {
              key: "withdrawable",
              title: "Value",
              render: (value,withdrawableValue) => ValueModule(value,withdrawableValue),
            },
            {
              key: "TxFee",
              title: "TX Fee Return",
              render: (value) => `${value}%`,
            },
            {
              key: "totalApr",
              title: "Total APR",
              render: (value) => <span className={styles.totalApr}>{value}%</span>,
            },
            {
              key: "isFarmed",
              title: "Farm",
              render: (value,APY) => <FarmComp isFarmed={value} APY={APY} />,
            },
            {
              key: "nft_bond",
              title: "NFT Bond",
              render: (value) => <NftBondCard />,
            },
            /*
            {
              key: "share",
              title: (
                <TooltipIcon content={Tooltip.My.PoolShare}>
                  Pool share
                </TooltipIcon>
              )
            },
            */
            {
              key: "actions",
              dataIndex: "pair",
              render: (pair, {lpToken}) => {
                const to = {
                  pathname: getPath(MenuKey.POOL),
                  state: { pair, lpToken },
                }

                const farmRoute = `${getPath(MenuKey.FARMBETA)}`

                const list = [
                  {
                    to: { ...to, hash: Type.PROVIDE },
                    children: Type.PROVIDE,
                  },
                  {
                    to: { ...to, hash: Type.WITHDRAW },
                    children: Type.WITHDRAW,
                  },
                  {
                    to: farmRoute,
                    children: MenuKey.FARMBETA,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Pool}
            link={MenuKey.POOL}
          />

      )}
      </Card>
    </>
  )
}