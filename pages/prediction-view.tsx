import React from 'react'
import dynamic from 'next/dynamic'

import Loader from '../components/Loader'

const PredictionGraph = dynamic(() => import('../containers/PredictionGraph'), {
  ssr: false,
  loading: () => <Loader />
})

export default PredictionGraph
