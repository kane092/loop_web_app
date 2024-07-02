import styles from "./farm/farmComp.module.scss";
import { UST } from "../../../constants"
import { formatAsset } from "../../../libs/parse"

const valueModule = (value:any,withdrawableValue:any) => {


  const firstAsset=value.text.split('+')[0].trim();
  const secondAsset=value.text.split('+')[1].trim();

  return (
    <div className={styles.value}>
       <div className={styles.header}>{withdrawableValue?.withdrawableValue} {UST}</div>
       <div className={styles.sub}>
            <span>{firstAsset}</span>
            <span>{secondAsset}</span>
       </div>
    </div>
  )
}

export default valueModule
