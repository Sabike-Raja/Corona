/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo, useCallback } from 'react';
import * as _ from 'lodash'

import MapComp from '../map';
import { MAP_TYPES, mapMeta } from './constants';
import { formatDate } from '../../utils';
import { formatDistance } from 'date-fns';
import { States, CurrentHoveredRegion, CurrentMapData } from '../quickView/IQuickView'

type AppProps = { states: States[], stateDistrictWiseData: any, regionHighlighted: any };

export default function FullMap({ states, stateDistrictWiseData, regionHighlighted }: AppProps) {
    const [selectedRegion] = useState({});
    const [currentHoveredRegion, setCurrentHoveredRegion] = useState<CurrentHoveredRegion>({
        name: 'India',
        lastupdatedtime: '',
        confirmed: null,
        active: null,
        recovered: null,
        deaths: null,
        Unknown: null,
    });
    const [currentMap, setCurrentMap] = useState<CurrentMapData>(mapMeta.India);

    // useEffect(() => {
    //     const region = getRegionFromState(states[1]);
    //     setCurrentHoveredRegion(region);
    // }, [states]);

    const [statistic, currentMapData] = useMemo(() => {
        const statistic = { total: 0, maxConfirmed: 0 };
        let currentMapData = {
            mapType: '',
            name: '',
            Unknown: 0,
        };
        if (currentMap.mapType === MAP_TYPES.COUNTRY) {
            currentMapData = states.reduce((acc: any, state) => {
                if (state.state === 'Total') {
                    return acc;
                }
                const confirmed = parseInt(state.confirmed);
                statistic.total += confirmed;
                if (confirmed > statistic.maxConfirmed) {
                    statistic.maxConfirmed = confirmed;
                }

                acc[state.state] = state.confirmed;
                return acc;
            }, {});
        } else if (currentMap.mapType === MAP_TYPES.STATE) {
            const districtWiseData = (
                stateDistrictWiseData[_.get(currentMap, 'name', '')] || { districtData: {} }
            ).districtData;
            currentMapData = Object.keys(districtWiseData).reduce((acc: any, district) => {
                const confirmed = parseInt(districtWiseData[district].confirmed);
                statistic.total += confirmed;
                if (confirmed > statistic.maxConfirmed) {
                    statistic.maxConfirmed = confirmed;
                }
                acc[district] = districtWiseData[district].confirmed;
                return acc;
            }, {});
        }
        return [statistic, currentMapData];
    }, [currentMap, states, stateDistrictWiseData]);

    const setHoveredRegion = useCallback(
        (name, currentMap) => {
            if (currentMap.mapType === MAP_TYPES.COUNTRY) {
                setCurrentHoveredRegion(
                    getRegionFromState(states.filter((state) => name === state.state)[0])
                );
            } else if (currentMap.mapType === MAP_TYPES.STATE) {
                const state = stateDistrictWiseData[_.get(currentMap, 'name', '')] || {
                    districtData: {},
                };
                let districtData = state.districtData[name];
                if (!districtData) {
                    districtData = {
                        confirmed: 0,
                        active: 0,
                        deaths: 0,
                        recovered: 0,
                    };
                }
                setCurrentHoveredRegion(getRegionFromDistrict(districtData, name));
            }
        },
        [stateDistrictWiseData, states]
    );

    // useEffect(() => {
    //     if (regionHighlighted === undefined) {
    //         return;
    //     } else if (regionHighlighted === null) {
    //         setSelectedRegion({});
    //         return;
    //     }
    //     const isState = !('district' in regionHighlighted);
    //     if (isState) {
    //         const newMap = mapMeta['India'];
    //         setCurrentMap(newMap);
    //         const region = getRegionFromState(regionHighlighted.state);
    //         setCurrentHoveredRegion(region);
    //         setSelectedRegion(_.get(region,'name'));
    //     } else {
    //         const newMap = mapMeta[regionHighlighted.state.state];
    //         if (!newMap) {
    //             return;
    //         }
    //         setCurrentMap(newMap);
    //         setHoveredRegion(regionHighlighted.district, newMap);
    //         setSelectedRegion(regionHighlighted.district);
    //     }
    // }, [regionHighlighted, currentMap.mapType, setHoveredRegion]);

    const getRegionFromDistrict = (districtData: any, name: any) => {
        if (!districtData) {
            return;
        }
        const region = { ...districtData };
        if (!_.get(region, 'name')) {
            region.name = name;
        }
        return region;
    };

    const getRegionFromState = (state: any) => {
        if (!state) {
            return;
        }
        const region = { ...state };
        if (!_.get(region, 'name')) {
            region.name = region.state;
        }
        return region;
    };

    const switchMapToState = useCallback(
        (name) => {
            const newMap = mapMeta[name];
            if (!newMap) {
                return;
            }
            setCurrentMap(newMap);
            if (newMap.mapType === MAP_TYPES.COUNTRY) {
                setHoveredRegion(states[1].state, newMap);
            } else if (newMap.mapType === MAP_TYPES.STATE) {
                const districtData = (stateDistrictWiseData[name] || { districtData: {} })
                    .districtData;
                const topDistrict = Object.keys(districtData)
                    .filter((name) => name !== 'Unknown')
                    .sort((a, b) => {
                        return districtData[b].confirmed - districtData[a].confirmed;
                    })[0];
                setHoveredRegion(topDistrict, newMap);
            }
        },
        [setHoveredRegion, stateDistrictWiseData, states]
    );

    const { name = '', lastupdatedtime } = currentHoveredRegion;

    if (!currentHoveredRegion) {
        return null;
    }

    return (
        <div className="MapExplorer fadeInUp" style={{ animationDelay: '1.2s' }}>
            <div className="header">
                <h1>{_.get(currentMap, 'name')} Map</h1>
                <h6>
                    {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over a{' '}
                    {currentMap.mapType === MAP_TYPES.COUNTRY ? 'state' : 'district'} for
                    more details
                </h6>
                {window.innerWidth <= 769 && (
                    <h6 style={{ marginTop: '1rem' }}>
                        <span
                            style={{
                                fontWeight: 900,
                                color: '#fff',
                                background: '#000',
                                padding: '0.25rem',
                                borderRadius: '2.5px',
                                marginRight: '0.25rem',
                            }}
                        >
                            Update!
            </span>{' '}
            Tap twice on states to view districts!
                    </h6>
                )}
            </div>

            <div className="map-stats">
                <div className="stats">
                    <h5>Confirmed</h5>
                    <div className="stats-bottom">
                        <h1>{currentHoveredRegion.confirmed}</h1>
                        <h6>{}</h6>
                    </div>
                </div>

                <div className="stats is-blue">
                    <h5>Active</h5>
                    <div className="stats-bottom">
                        <h1>{currentHoveredRegion.active || ''}</h1>
                        <h6>{}</h6>
                    </div>
                </div>

                <div className="stats is-green">
                    <h5>Recovered</h5>
                    <div className="stats-bottom">
                        <h1>{currentHoveredRegion.recovered || ''}</h1>
                        <h6>{}</h6>
                    </div>
                </div>

                <div className="stats is-gray">
                    <h5>Deceased</h5>
                    <div className="stats-bottom">
                        <h1>{currentHoveredRegion.deaths || ''}</h1>
                        <h6>{}</h6>
                    </div>
                </div>
            </div>

            <div className="meta">
                <h2>{name}</h2>
                {lastupdatedtime && (
                    <div
                        className={`last-update ${
                            currentMap.mapType === MAP_TYPES.STATE
                                ? 'district-last-update'
                                : 'state-last-update'
                            }`}
                    >
                        <h6>Last Updated</h6>
                        <h3>
                            {isNaN(Date.parse(formatDate(lastupdatedtime)))
                                ? ''
                                : formatDistance(
                                    new Date(formatDate(lastupdatedtime)),
                                    new Date()
                                ) + ' Ago'}
                        </h3>
                    </div>
                )}

                {currentMap.mapType === MAP_TYPES.STATE &&
                    currentMapData.Unknown > 0 ? (
                        <h4 className="unknown">
                            Districts unknown for {currentMapData.Unknown} people
                        </h4>
                    ) : null}

                {currentMap.mapType === MAP_TYPES.STATE ? (
                    <div
                        className="button back-button"
                    // onClick={() => switchMapToState('India')}
                    >
                        Back
                    </div>
                ) : null}
            </div>

            <MapComp
                statistic={statistic}
                mapMeta={currentMap}
                mapData={currentMapData}
                setHoveredRegion={setHoveredRegion}
                changeMap={switchMapToState}
                selectedRegion={selectedRegion}
            />
        </div>
    );
}
