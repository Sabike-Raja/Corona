/**
 *
 * MapView
 *
 */

import React, { memo, useEffect, Fragment, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { Helmet } from "react-helmet";

import FullMap from '../../components/fullMap'
import Loader from '../../components/Loader'
import { updateBrowserIcon } from '../../utils'

import { States } from '../../components/quickView/IQuickView'

const MapView = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [states, setStates] = useState<States[]>([]);
    const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
    const [regionHighlighted] = useState(null);

    useEffect(() => {
        getStates()
        updateBrowserIcon()
    }, [])

    const getStates = async () => {
        try {
            const [response, stateDistrictWiseResponse] = await Promise.all([
                axios.get('https://api.covid19india.org/data.json'),
                axios.get('https://api.covid19india.org/state_district_wise.json'),
            ]);
            setStates(response.data.statewise);
            setStateDistrictWiseData(stateDistrictWiseResponse.data);
            setIsLoading(false)
        } catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    };

    const gotoDashBoard = () => {
        router.push("/")
    }

    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>COVID19 | Map view</title>
                <meta name="description" content="Map view page" />
            </Helmet>
            {
                !isLoading ?
                    <div className="m-60">
                        <span onClick={gotoDashBoard} className="btn-flip" data-back="Go Back" data-front="Click"> Go Back </span>
                        <FullMap
                            states={states}
                            stateDistrictWiseData={stateDistrictWiseData}
                            regionHighlighted={regionHighlighted}
                        />
                    </div>
                    : <Loader />
            }

        </Fragment>
    )
}

export default memo(MapView)
