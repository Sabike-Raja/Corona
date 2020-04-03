import React, { memo, Fragment, useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import axios from 'axios';
import Router from 'next/router'
import { Helmet } from "react-helmet";
import * as _ from 'lodash'

import { formatDate, formatDateAbsolute, updateBrowserIcon } from '../../utils';
import QuickView from '../../components/quickView'
// import Minigraph from '../../components/miniGraph'
import { States, Deltas } from '../../components/quickView/IQuickView'


function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState('');
  const [states, setStates] = useState<States[]>([]);
  // const [timeseries, setTimeseries] = useState([]);
  const [pageContent, setPageContent] = useState([])
  const [deltas, setDeltas] = useState<Deltas>({
    confirmeddelta: '',
    counterforautotimeupdate: '',
    deceaseddelta: '',
    lastupdatedtime: '',
    recovereddelta: '',
    statesdelta: ''
  });

  useEffect(() => {
    getStates()
    updateBrowserIcon()
  }, [])

  const getStates = async () => {
    try {
      const [response, pageContent] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/website_data.json')
      ]);
      setStates(response.data.statewise);
      setPageContent(_.get(pageContent, 'data.factoids'))
      // setTimeseriesfactoids(response.data.cases_time_series);
      setLastUpdated(response.data.statewise[0].lastupdatedtime);
      setDeltas(response.data.key_values[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = (link: string) => {
    Router.push(link)
  }
  console.log('xucess')
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>COVID19 | Dashboard</title>
        <meta name="description" content="Dashboard page" />
      </Helmet>
      <div className="m-60">
        <div className="main-heading">
          <h1>India COVID-19 Live Update Here</h1>
          <div className="last-update">
            <h6>Last Updated</h6>
            <h6 style={{ color: '#28a745', fontWeight: 600 }}>
              {isNaN(Date.parse(formatDate(lastUpdated)))
                ? ''
                : formatDistance(
                  new Date(formatDate(lastUpdated)),
                  new Date()
                ) + ' Ago'}
            </h6>
            <h6 style={{ color: '#28a745', fontWeight: 600 }}>
              {isNaN(Date.parse(formatDate(lastUpdated)))
                ? ''
                : formatDateAbsolute(lastUpdated)}
            </h6>
          </div>
        </div>
        <div className="cen">
          <QuickView data={states} deltas={deltas} />
          {/* <Minigraph timeseries={timeseries} animate={true} /> */}
        </div>
        <div className="cen">
          <p className="font-style"> If you want to see more details </p>
          <p className="font-style"><span onClick={() => navigate("/table-view")}> clcik here </span> for table view</p>
          <p className="font-style"><span onClick={() => navigate("/map-view")}> clcik here </span>for map view</p>
          <p className="font-style"><span onClick={() => navigate("/chart-view")}> clcik here </span>for chart view</p>
        </div>
      </div>
      <div className="microsoft container">
        {
          pageContent.map((mapData: any, index: number) => <p key={mapData.banner} className="marquee">{mapData.banner}</p>)
        }
      </div>
    </Fragment>
  )
}

export default memo(Dashboard)
