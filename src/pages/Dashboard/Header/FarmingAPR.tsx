import { bound } from "../../../components/Boundary"
import styles from "../DashboardHeader.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"
import { number } from "../../../libs/math"
import { commas, decimal, niceNumber } from "../../../libs/parse"
import { gt } from "ramda"


const FarmingAPR = ({amount}:{amount: number}) => {
  // const { max_apr, loading } = useAprRanges()


  return bound(amount && (
      <span className={styles.dflex}>
       <span className={styles.title}>up to </span>
        <span className={styles.aprRange}>{(
                gt(amount, 50000)
                ? "50,000+"
                : commas(
                    decimal(
                      isFinite(number(niceNumber(amount.toString())))
                        ? (
                          niceNumber(amount.toString())
                        )
                        : "0",
                      2
                    )
                  )
            
              )}%</span>
        {/* <span>%</span> */}
      </span>
    ),
    <LoadingPlaceholder size={"sm"} color={"black"} />
  )
}

export default FarmingAPR
