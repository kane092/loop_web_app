import MyPoolTable, {MyPoolTableV2} from "./MyPoolTable"
import useMyPool, {useMyPoolV2} from "../My/useMyPool"

const MyPoolList = ({version}:{version?: number | string}) => {
    const poolV2 = useMyPoolV2()
    const pool = useMyPool()

    return (
        <>
            {version === 1 ? <MyPoolTable {...pool} /> : <MyPoolTableV2 {...poolV2} />  }
        </>
    )
}

export default MyPoolList
