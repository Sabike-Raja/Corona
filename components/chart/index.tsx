/**
 *
 * ChartView
 *
 */

import React, { memo, useEffect, Fragment } from 'react';
import Chart from 'chart.js';

const chartRef: any = React.createRef()

type AppProps = { chartLabel: string[], chartDataSets: any };

const ChartView = ({ chartLabel, chartDataSets }: AppProps) => {

    useEffect(() => {
        const myChartRef = chartRef.current.getContext('2d')
        new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: chartLabel,
                datasets: chartDataSets
            },
            options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 
            }
        });
    }, [chartLabel, chartDataSets])

    return (
        <Fragment>
            <div><canvas id="myChart" ref={chartRef} /></div>
        </Fragment>
    )
}

export default memo(ChartView)
