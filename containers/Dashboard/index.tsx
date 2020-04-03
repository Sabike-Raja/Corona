import React, { memo, Fragment, useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import axios from 'axios';
import Router from 'next/router';
import { Helmet } from "react-helmet";
import * as _ from 'lodash';
import moment from 'moment';

import { formatDate, formatDateAbsolute, updateBrowserIcon, findGrowthFactor, findNextDayValue, findNextDate } from '../../utils';
import QuickView from '../../components/quickView'
// import Minigraph from '../../components/miniGraph'
import { States, Deltas } from '../../components/quickView/IQuickView'
import { CaseTimeSeries } from '../../containers/ChartView/IChart'


function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState('');
  const [states, setStates] = useState<States[]>([]);
  // const [timeseries, setTimeseries] = useState([]);
  const [pageContent, setPageContent] = useState([])
  const [confirmedCase, setConfirmedcase] = useState<number[]>([])
  const [chartLabel, setChartLabel] = useState<string[]>([])
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
      const data = _.get(response, 'data.cases_time_series', []), totalConfirmed: number[] = [], dates: string[] = []
      data.map((mapData: CaseTimeSeries) => {
        totalConfirmed.push(parseInt(mapData.totalconfirmed))
        dates.push(mapData.date)
      })
      setChartLabel(dates)
      setConfirmedcase(totalConfirmed)
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

  const predictFeature = () => {
    const arrayLabelValue = _.cloneDeep(confirmedCase), arrayChartLabel = _.cloneDeep(chartLabel), value = [], label = [];
    let count = 0, growthFactor = 0
    for (let i = 1; i <= 10; i++) {
      if (count === 10) {
        break;
      }
      let arrayData: any = arrayChartLabel[arrayChartLabel.length-1]
      arrayData = moment(arrayData.trim()+" 2020")
      arrayData = moment(arrayData).format("DD MMM")
      arrayData = findNextDate(arrayData)
      arrayData = moment(arrayData).format("DD MMM")
      arrayChartLabel.push(arrayData)
      label.push(arrayData)
      growthFactor = findGrowthFactor(arrayLabelValue)
      value.push(findNextDayValue(arrayLabelValue[arrayLabelValue.length-1], growthFactor, 1))
      arrayLabelValue.push(findNextDayValue(arrayLabelValue[arrayLabelValue.length-1], growthFactor, 1))
      count++
    }
    console.log('sucess', value, label)
  }

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
            <p className="font-style-red">If this goes <span onClick={() => navigate("/predection-view")}> click here</span> for find how many people will affect in feature </p>
          </div>
          <div className="cen">
            <p className="font-style"> If you want to see more details </p>
            <p className="font-style"><span onClick={() => navigate("/table-view")}> click here </span> for table view</p>
            <p className="font-style"><span onClick={() => navigate("/map-view")}> click here </span>for map view</p>
            <p className="font-style"><span onClick={() => navigate("/chart-view")}> click here </span>for chart view</p>
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
