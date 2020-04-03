import React from 'react'
import dynamic from 'next/dynamic'

import Loader from '../components/Loader'

const ChartView = dynamic(() => import('../containers/ChartView'), {
  ssr: false,
  loading: () => <Loader />
})

export default ChartView
