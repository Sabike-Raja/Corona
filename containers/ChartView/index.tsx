import React, { memo, useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import { useRouter } from 'next/router';
import { Helmet } from "react-helmet";


import { ChartApiData, CaseTimeSeries } from './IChart'
import ChartView from '../../components/chart'
import Loader from '../../components/Loader'
import { updateBrowserIcon } from '../../utils'

function ChartViewContainer() {
    const router = useRouter()
    const [chartLabel, setChartLabel] = useState<string[]>([])
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [month, setMonth] = useState<string>("March")
    const [caseTimeSeries, setCaseTimeSeries] = useState<CaseTimeSeries[]>([])
    const [confirmedCase, setConfirmedcase] = useState<number[]>([])
    const [recoveredCase, setRecoveredCase] = useState<number[]>([])
    const [deceasedCase, setDeceasedCase] = useState<number[]>([])

    useEffect(() => {
        getStates((data: ChartApiData) => {
            changeChartLabel("March", data.cases_time_series)
            setCaseTimeSeries(data.cases_time_series)
        })
        updateBrowserIcon()
    }, [])

    useEffect(() => {
        changeChartLabel(month, caseTimeSeries)
    }, [isLoading])

    const changeChartLabel = (month: string, caseTimeSeriesData: CaseTimeSeries[]) => {
        const label: string[] = [], confirmed: number[] = [], recovered: number[] = [], deceased: number[] = []
        caseTimeSeriesData.map((mapData: CaseTimeSeries) => {
            const arrayData = mapData.date.split(" ")
            if (arrayData[1].toLowerCase() === month.toLowerCase()) {
                confirmed.push(parseInt(mapData.totalconfirmed))
                recovered.push(parseInt(mapData.totalrecovered))
                deceased.push(parseInt(mapData.totaldeceased))
                label.push(`${arrayData[0]} ${arrayData[1].slice(0, 3)}`)
            }
        })
        setConfirmedcase(confirmed)
        setRecoveredCase(recovered)
        setDeceasedCase(deceased)
        setChartLabel(label)
        setisLoading(true)
    }

    const getStates = async (callback: Function) => {
        try {
            const [response] = await Promise.all([
                axios.get('https://api.covid19india.org/data.json'),
            ]);
            callback(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    const changeMonth = (e: any) => {
        setMonth(e.value)
        setisLoading(false)
    }

    const gotoDashBoard = () => {
        router.push("/")
    }

    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>COVID19 | Chart view</title>
                <meta name="description" content="Chart view page" />
            </Helmet>
            <div className="m-60">
                <div style={{ display: 'flex' }}>
                    <span onClick={gotoDashBoard} className="btn-flip" data-back="Go Back" data-front="Click"> Go Back </span>
                    <div style={{ width: '10%' }}>
                        <Dropdown options={["January", "February", "March", "April"]} onChange={(e) => changeMonth(e)} value={month} placeholder="Select an month" />
                    </div>
                </div>
                {isLoading ? <ChartView chartLabel={chartLabel} confirmedCase={confirmedCase} recoveredCase={recoveredCase} deceasedCase={deceasedCase} /> : <Loader />}
            </div>
        </Fragment>
    )
}

export default memo(ChartViewContainer)
