import { ReactNode, useState } from "react"
import styles from "./YourLiquidity.module.scss"
import Card from "./poolCard/Card"
import Tooltip from "../../lang/Tooltip.json"
import { TooltipIcon } from "../Tooltip"
import Button from "../Button"
import Table from "../../components/Table"
import HeaderModal from "../Pool/HeaderModal"
import SwapWidgetLarge from "../../components/swap/largeWidget/Swap.lg.widget"
import LUNA from "../../images/coins/luna.png"
import LOOP from "../../images/coins/loop.svg"
import UST from "../../images/coins/UST.png"
import change from "../../images/up.svg"
import { useRecoilValue } from "recoil"
import { tradingListStore } from "../../data/API/dashboard"
import { getICon2 } from "../../routes"
import { lookupSymbol } from "../../libs/parse"
import { lt } from "../../libs/math"
import { bound } from "../Boundary"

const useRecommendedPool = () => {
  const tradingData = useRecoilValue(tradingListStore)
  const sortedData = [...tradingData].sort((a, b) =>
    lt(a.APY, b.APY) ? 1 : -1
  )
  return sortedData
}
const RecommendedPools = () => {
  const [name, setName] = useState("Popular")

  const sortedData = useRecommendedPool()

  const ActiveTab = () => {
    return (
      <>
        <div className={styles.poolCard}>
          <span
            className={name == "Popular" ? styles.active : ""}
            onClick={() => {
              setName("Popular")
            }}
          >
            Popular Pairs
          </span>
        </div>
        <div className={styles.poolCard}>
          <span
            className={name == "Swap" ? styles.active : ""}
            onClick={() => {
              setName("Swap")
            }}
          >
            Swap
          </span>
        </div>
      </>
    )
  }

  const Rec = () => {
    return (
      <div className={styles.list}>
        {bound(
          sortedData.slice(0, 5).map((item, index) => {
            return (
              <div className={styles.content} key={index}>
                <span>
                  <span className={styles.token}>
                    <img
                      style={{ width: "30px", borderRadius: "25px" }}
                      src={getICon2(
                        item?.symbol?.split("_")[0].trim().toUpperCase()
                      )}
                      alt=" "
                    />{" "}
                    {lookupSymbol(item?.symbol?.split("_")[0].trim())}
                  </span>{" "}
                  -{" "}
                  <span className={styles.token}>
                    <img
                      style={{ width: "30px", borderRadius: "25px" }}
                      src={getICon2(
                        item?.symbol?.split("_")[1].trim().toUpperCase()
                      )}
                      alt=" "
                    />{" "}
                    {lookupSymbol(item?.symbol?.split("_")[1].trim())}
                  </span>
                </span>
                <span className={styles.percent}>
                  <i className={styles.up}>
                    <img src={change} alt=" " /> {item.APY}%
                  </i>{" "}
                  APY
                </span>
              </div>
            )
          })
        )}
        <div className={styles.info}>{Tooltip.Pool.PoolRec}</div>
      </div>
    )
  }

  return (
    <>
      <HeaderModal
        title={"FARMING WIZARD"}
        content={
          "This will help you Swap + Pool + Farm your tokens automagically"
        }
        hidden={name != "Popular"}
        noMobile={false}
      />

      <section
        className={
          name == "Popular" ? styles.recommended : styles.recommendedSwap
        }
      >
        <Card
          title={name == "Popular" ? "Recommended" : "Swap"}
          className={styles.Card}
          tabs={<ActiveTab />}
        >
          {name == "Popular" && <Rec />}
          {name == "Swap" && <SwapWidgetLarge />}
        </Card>
      </section>
    </>
  )
}

export default RecommendedPools
