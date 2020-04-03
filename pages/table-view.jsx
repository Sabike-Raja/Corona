import React from 'react'
import dynamic from 'next/dynamic'

import Loader from '../components/Loader'

const TableView = dynamic(() => import('../containers/TableView'), {
  ssr: false,
  loading: () => <Loader />
})

export default TableView
