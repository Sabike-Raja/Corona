/**
 *
 * TableView
 *
 */

import React, { memo, useEffect, Fragment, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { Helmet } from "react-helmet";

import { States } from '../../components/quickView/IQuickView'
import Table from '../../components/fullTable'
import Loader from '../../components/Loader'
import { updateBrowserIcon } from '../../utils'

const TableView = () => {
    const router = useRouter()
    const [states, setStates] = useState<States[]>([]);
    const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
    const [regionHighlighted, setRegionHighlighted] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState(true)

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
        }
    };

    const gotoDashBoard = () => {
        router.push("/")
    }

    const onHighlightState = (state: any, index: number) => {
        if (!state && !index) setRegionHighlighted(null);
        else setRegionHighlighted({ state, index });
    };

    const onHighlightDistrict = (district: any, state: any, index: number) => {
        if (!state && !index && !district) setRegionHighlighted(null);
        else setRegionHighlighted({ district, state, index });
    };

    return (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>COVID19 | Table view</title>
                <meta name="description" content="Table view page" />
            </Helmet>
            { isLoading && <Loader /> }
            <div className="m-60">
                <span onClick={gotoDashBoard} className="btn-flip" data-back="Go Back" data-front="Click"> Go Back </span>
                <Table
                    states={states}
                    summary={false}
                    stateDistrictWiseData={stateDistrictWiseData}
                    onHighlightState={onHighlightState}
                    onHighlightDistrict={onHighlightDistrict}
                />
            </div>
        </Fragment>
    )
}

export default memo(TableView)
