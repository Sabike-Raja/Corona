/**
 *
 * ChartView
 *
 */

import React, { memo, useEffect, Fragment } from 'react';
import Chart from 'chart.js';

const chartRef: any = React.createRef()

type AppProps = { chartLabel: string[], recoveredCase: number[], confirmedCase: number[], deceasedCase: number[] };

const ChartView = ({ chartLabel, deceasedCase, confirmedCase, recoveredCase }: AppProps) => {

    useEffect(() => {
        const myChartRef = chartRef.current.getContext('2d')
        new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: chartLabel,
                datasets: [
                    {
                        label: 'Confirmed', // Name the series
                        data: confirmedCase,
                        fill: false,
                        borderColor: '#f14d39', // Add custom color border (Line)
                        backgroundColor: '#f14d39', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width
                    },
                    {
                        label: 'Recovered', // Name the series
                        data: recoveredCase,
                        fill: false,
                        borderColor: '#79c68a', // Add custom color border (Line)
                        backgroundColor: '#79c68a', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width   
                    },
                    {
                        label: 'DECEASED', // Name the series
                        data: deceasedCase,
                        fill: false,
                        borderColor: '#b4b9be', // Add custom color border (Line)
                        backgroundColor: '#b4b9be', // Add custom color background (Points and Fill)
                        borderWidth: 1 // Specify bar border width   
                    }
                ]
            },
            options: {
                responsive: true, // Instruct chart js to respond nicely.
                maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height 
            }
        });
    }, [chartLabel, deceasedCase, confirmedCase, recoveredCase])

    return (
        <Fragment>
            <div><canvas id="myChart" ref={chartRef} /></div>
        </Fragment>
    )
}

export default memo(ChartView)
