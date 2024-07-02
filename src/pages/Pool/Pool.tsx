import Connect from "../../layouts/Connect"
import MyPoolList from "./MyPoolList"
import useAddress from "../../hooks/useAddress"

const Pool = ({version}:{version?: string | number}) => {
  const address = useAddress()

  return (
    <>
      {!address ? <Connect /> : <MyPoolList version={version} />}
    </>
  )
}

export default Pool
