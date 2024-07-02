import classNames from "classnames"
import styles from './TablePlaceholder.module.scss'

const cx = classNames.bind(styles)

const TablePlaceholder = () => {

  return <div className={styles.wrapper}>
  <table >
    <thead>
      <tr>
        <th className={classNames(styles.th)}>a</th>
        <th className={classNames(styles.th)}>b</th>
        <th className={classNames(styles.th)}>c</th>
      </tr>
    </thead>
    <tbody>
     
      
          <tr
            className={styles.tr}
          >
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        

    </tbody>
  </table>
  </div>
}

export default TablePlaceholder
