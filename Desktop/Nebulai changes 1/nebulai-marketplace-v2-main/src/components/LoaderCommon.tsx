import React from 'react'
import { BarLoader } from 'react-spinners'

const LoaderCommon = ({classCustom="loading-container"}:{classCustom?:string}) => {
  return (
    <div className={classCustom}>
        <span className="fw-bold">Please Wait...</span>
        <BarLoader  color={"#ab31ff"} loading={true}/>
    </div>
  )
}

export default LoaderCommon