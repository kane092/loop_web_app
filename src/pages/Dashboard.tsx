import { Helmet } from "react-helmet"
import {useState} from "react"

import useDashboard, { StatsNetwork } from "../statistics/useDashboard"
import Page from "../components/Page"
import Grid from "../components/Grid"
import DashboardHeader from "./Dashboard/DashboardHeader"
import TopTrading from "./Dashboard/TopTrading"
import styles from "./Gov/GovHomeHeader.module.scss"
import Container from "../components/Container"
import { DashboardWrappper }  from './Dashboard/DashboardCharts'

const Dashboard = () => {
  
  const [collapseAble,setCollapseAble]=useState(false)

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Dashboard</title>
      </Helmet>
      <Page>
        <Container>
          <Grid>
            <div className={styles.sm}>
              <DashboardHeader collapseAble={collapseAble} />
            </div>

            <div className={styles.lg}>
              <DashboardWrappper collapseAble={collapseAble} setCollapseAble={setCollapseAble} />
            </div>
          </Grid>
          <Grid>
            <TopTrading />
          </Grid>
          <Grid>{/* <Article /> */}</Grid>
        </Container>
      </Page>
    </Grid>
  )
}

export default Dashboard
