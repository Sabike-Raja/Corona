import React, { memo, Fragment, useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import axios from 'axios';
import Router from 'next/router';
import { Helmet } from "react-helmet";
import * as _ from 'lodash';
import moment from 'moment';

import { updateBrowserIcon, findGrowthFactor, findNextDayValue, findNextDate } from '../../utils';
import { CaseTimeSeries } from '../../containers/ChartView/IChart'
import ChartView from '../../components/chart'
import Loader from '../../components/Loader'

function Prediction() {
  const [chartLabel, setChartLabel] = useState<string[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [chartDataSets, setChartDataSets] = useState<any>([])

  useEffect(() => {
    getStates()
    updateBrowserIcon()
  }, [])

  const getStates = async () => {
    try {
      const [response] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
      ]);
      const data = _.get(response, 'data.cases_time_series', []), totalConfirmed: number[] = [], dates: string[] = []
      data.map((mapData: CaseTimeSeries) => {
        totalConfirmed.push(parseInt(mapData.totalconfirmed))
        dates.push(mapData.date)
      })
      predictFeature(totalConfirmed, dates)
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = (link: string) => {
    Router.push(link)
  }

  const predictFeature = (confirmedCase: number[], chartLabelData: string[]) => {
    const arrayLabelValue = _.cloneDeep(confirmedCase), arrayChartLabel = _.cloneDeep(chartLabelData), value = [], label = [];
    let count = 0, growthFactor = 0
    for (let i = 1; i <= 10; i++) {
      if (count === 10) {
        break;
      }
      let arrayData: any = arrayChartLabel[arrayChartLabel.length - 1]
      arrayData = moment(arrayData.trim() + " 2020")
      arrayData = moment(arrayData).format("DD MMM")
      arrayData = findNextDate(arrayData)
      arrayData = moment(arrayData).format("DD MMM")
      arrayChartLabel.push(arrayData)
      label.push(arrayData)
      growthFactor = findGrowthFactor(arrayLabelValue)
      value.push(findNextDayValue(arrayLabelValue[arrayLabelValue.length - 1], growthFactor, 1))
      arrayLabelValue.push(findNextDayValue(arrayLabelValue[arrayLabelValue.length - 1], growthFactor, 1))
      count++
    }
    const dataSets = [
      {
        label: 'Confirmed', // Name the series
        data: value,
        fill: false,
        borderColor: '#f14d39', // Add custom color border (Line)
        backgroundColor: '#f14d39', // Add custom color background (Points and Fill)
        borderWidth: 1 // Specify bar border width
      },
    ]
    setChartLabel(label)
    setisLoading(false)
    setChartDataSets(dataSets)
  }

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>COVID19 | Prediction</title>
        <meta name="description" content="Dashboard page" />
      </Helmet>
      <div className="m-60">
        <span onClick={() => navigate("/")} className="btn-flip" data-back="Go Back" data-front="Back"> Go Back </span>
        {!isLoading ? <ChartView chartLabel={chartLabel} chartDataSets={chartDataSets} /> : <Loader />}
      </div>
    </Fragment>
  )
}

export default memo(Prediction)
