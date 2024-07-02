import { Link } from "react-router-dom"
import { getPath, MenuKey } from "../../../../routes"
import styles from "./farmComp.module.scss"

const FromComp = ({ isFarmed, APY }) => {

  return (
    <div className={styles.component}>
      {isFarmed ? (
        <>
          <span>{APY?.APY}%</span>
          <br />
          <span>Farming</span>
        </>
      ) : (
        <>
          <Link to={getPath(MenuKey.FARMBETA)}>
          <span>Add to Farm</span>
          </Link>
          <br />
          <span>{APY?.APY}%</span>
        </>
      )}
    </div>
  )
}

export default FromComp
