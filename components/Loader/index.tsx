import React, { Fragment } from 'react'
import { ClipLoader } from 'react-spinners'

const Loader = () => {
  return (
    <Fragment>
      <div className='app-loader'>
        <div className='loader'>
          <ClipLoader size={70} color={'#ff2870'} />
        </div>
      </div>
    </Fragment>
  )
}

export default Loader
