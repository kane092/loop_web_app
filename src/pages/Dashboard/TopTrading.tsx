import Card from "../../components/Card"
import PairTVLList from "./PairTVLList"
import {bound} from "../../components/Boundary"
import { getICon2} from "../../routes"
import styles from "./TopTrading.module.scss"
import { useState } from "react"
import Tooltip from "../../components/Tooltip"
import TooltipContainer from "../../components/Static/TooltipContainer"
import classNames from "classnames"
import { useProtocol } from "../../data/contract/protocol"

const TopTrading = () => {
  const [selectedTokens, setSelectTokens] = useState<{ token: string, isSelected: boolean}[]>([
    {token: 'UST', isSelected: false},
    {token: 'AUST', isSelected: false},
    {token: 'LOOP', isSelected: false},
    {token: 'LUNA', isSelected: false},
    {token: 'IBC', isSelected: false},
  ]);
  const verifyIBC = selectedTokens.find(token => token.token === 'IBC')?.isSelected
  
  const onClick = (token: string) => {
    setSelectTokens([...selectedTokens.map(item => item.token == token ? { ...item, isSelected: !item.isSelected } : item)])
  }

  const filters = selectedTokens.map((item) => <Tooltip
  content={<TooltipContainer><h3>Filter by {item?.token?.toUpperCase() ?? 'token'}</h3></TooltipContainer>}>
  <div className={classNames(styles.token, item.isSelected ? styles.active: '')}>
  <img
  style={{ width: "30px", borderRadius: "25px", opacity: item.isSelected ? 1 : 0.4 }}
  src={getICon2(item.token ?? '')}

  onClick={() => onClick(item.token ?? '')}
  alt=" "
  />
  </div>
  </Tooltip>)

  const { ibcList } = useProtocol()

  const ibcTokens = verifyIBC ? Object.keys(ibcList).map((item)=> ibcList[item]?.name) : []
  const filterTokens = [...ibcTokens, ...selectedTokens?.filter((item) => item.isSelected).map((item) => item.token)]
  
  return (
    <div className={styles.tradingTable}>
      <Card title={<>Top Trading Assets <span className={styles.headerTokens}>{filters}</span></>} >
          { bound(<PairTVLList tokens={filterTokens} />)}
      </Card>
    </div>
  )
}

export default TopTrading