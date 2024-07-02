import styles from "./PoolWithPoolList.module.scss"
import {ReactNode} from "react"
import HeaderModal from "../components/Pool/HeaderModal"
import RecommendedPools from "../components/Pool/RecommendedPools"
import Container from "../components/Container"
import Card from "../components/Card"
import Boundary, { bound } from "../components/Boundary"
import { ClipLoader } from "react-spinners"
import {css} from "@emotion/react"
import Pool from "../pages/Pool/Pool"

interface Props {
  children: ReactNode
  version: number | string
}

const PoolWithPoolList = ({ children, version }: Props) => {

  const color = '#FFFFFF'
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
    `

  return (
    <div className={styles.flex}>
      {
        version === 2 ? <>
        <section className={styles.content}>
        <HeaderModal title={"HOW TO POOL?"} content={"We are giving users who add to the pool 0.3% of all trading fees"} hidden={false} noMobile={true} />
        {/*{ pageName == "/pool" && hashName == "#provide" && <Card className={styles.v2Container}>
          <LinkButton size={'sm'} to={getPath(MenuKey.POOL_V2)}>Go to V2</LinkButton>
        </Card> }
        { pageName == "/pool-v2" && hashName == "#provide" && <Card className={styles.v2Container}>
          <LinkButton size={'sm'} to={getPath(MenuKey.POOL)}>Go to V1</LinkButton>
        </Card> }*/}
        <div className={styles.childPool}>{children}</div>
      </section>
      <section className={styles.chart}>
        {bound(<RecommendedPools />)}
      </section>
        </>
      :
      <>
        <section className={styles.content}>
        <div className={styles.childPool}>{children}</div>
      </section>
      <section className={styles.chart}>
        <Container sm>
          <Card title="Your Liquidity" className={styles.your_liquidity}>
            <div className={styles.your_liquidity_content}>
              <Boundary
                  fallback={<div className="dashboardLoaderInline">
                    <ClipLoader
                        color={color}
                        loading={true}
                        css={override}
                        size={50}
                    />
                  </div>}
              >
                <Pool version={version} />
              </Boundary>
              <h6 className={styles.msg}>
                If you staked your LP tokens in a farm,
                <br /> unstake them to see them here.
              </h6>
            </div>
          </Card>
        </Container>
      </section>
      </>
}
    </div>
  )
}

export default PoolWithPoolList
