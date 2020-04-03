import React from 'react'
import dynamic from 'next/dynamic'

import Loader from '../components/Loader'

const MapView = dynamic(() => import('../containers/MapView'), {
  ssr: false,
  loading: () => <Loader />
})

export default MapView
