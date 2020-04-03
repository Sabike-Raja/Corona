import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import * as topojson from 'topojson';
import axios from 'axios';

import { MAP_TYPES } from '../fullMap/constants';

const propertyFieldMap: any = {
  country: 'st_nm',
  state: 'district',
};

type AppProps = { statistic: any, mapData: any, setHoveredRegion: any, mapMeta: any, changeMap: any, selectedRegion: any };

function MapComp({
  statistic,
  mapData,
  setHoveredRegion,
  mapMeta,
  changeMap,
  selectedRegion,
}: AppProps) {
  const choroplethMap = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart > *').remove();
      const propertyField = propertyFieldMap[mapMeta.mapType];
      const maxInterpolation = 0.8;
      const svg = d3.select(choroplethMap.current);
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const handleMouseover = (name: any) => {
        try {
          setHoveredRegion(name, mapMeta);
        } catch (err) {
          console.log('err', err);
        }
      };

      const topology: any = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

      const projection = d3.geoMercator();

      if (mapMeta.mapType === MAP_TYPES.COUNTRY)
        projection.fitSize([width, height], topology);
      else
        projection.fitExtent(
          [
            [90, 20],
            [width, height],
          ],
          topology
        );

      const path: any = d3.geoPath(projection);

      let onceTouchedRegion: any = null;

      svg
        .append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .enter()
        .append('path')
        .attr('class', 'path-region')
        .attr('fill', function (d: any) {
          const n = parseInt(mapData[d.properties[propertyField]]) || 0;
          const color =
            n === 0
              ? '#ffffff'
              : d3.interpolateReds(
                (maxInterpolation * n) / (statistic.maxConfirmed || 0.001)
              );
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseover', (d: any) => {
          handleMouseover(d.properties[propertyField]);
          const target = d3.event.target;
          d3.select(target.parentNode.appendChild(target)).attr(
            'class',
            'map-hover'
          );
        })
        .on('mouseleave', (d) => {
          const target = d3.event.target;
          d3.select(target).attr('class', 'path-region map-default');
          if (onceTouchedRegion === d) onceTouchedRegion = null;
        })
        .on('touchstart', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
          else onceTouchedRegion = d;
        })
        // .on('click', (d: any) => {
        //   if (onceTouchedRegion) {
        //     return;
        //   }
        //   if (mapMeta.mapType === MAP_TYPES.STATE) {
        //     return;
        //   }
        //   changeMap(d.properties[propertyField], mapMeta.mapType);
        // })
        .style('cursor', 'pointer')
        .append('title')
        .text(function (d: any) {
          const value = mapData[d.properties[propertyField]] || 0;
          const simplefiedValue = (value / (statistic.total || 0.001)) * 100
          return (
            // parseFloat('12').toFixed(2) +
            parseFloat(simplefiedValue.toString()).toFixed(2) +
            '% from ' +
            toTitleCase(d.properties[propertyField])
          );
        });

      svg
        .append('path')
        .attr('stroke', '#ff073a20')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        );
    },
    [mapData, mapMeta, statistic.total, statistic.maxConfirmed, setHoveredRegion]
  );

  const toTitleCase = (str: any) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  const renderData = useCallback(() => {
    const svg = d3.select(choroplethMap.current);

    // Colorbar
    const maxInterpolation = 0.8;
    const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, statistic.maxConfirmed / maxInterpolation || 10]);

    let cells = null;
    let label = null;

    label = ({ i, genLength, generatedLabels }: { i: number, genLength: number, generatedLabels: any }) => {
      if (i === genLength - 1) {
        const n = Math.floor(generatedLabels[i]);
        return `${n}+`;
      } else {
        const n1 = 1 + Math.floor(generatedLabels[i]);
        const n2 = Math.floor(generatedLabels[i + 1]);
        return `${n1} - ${n2}`;
      }
    };

    const numCells = 6;
    const delta = Math.floor(
      (statistic.maxConfirmed < numCells ? numCells : statistic.maxConfirmed) /
      (numCells - 1)
    );

    cells = Array.from(Array(numCells).keys()).map((i) => i * delta);

    svg
      .append('g')
      .attr('class', 'legendLinear')
      .attr('transform', 'translate(1, 485)');

    const legendLinear = legendColor()
      .shapeWidth(36)
      .shapeHeight(10)
      .cells(cells)
      .titleWidth(3)
      .labels(label)
      .title('Confirmed Cases')
      .orient('vertical')
      .scale(color);

    svg
      .select('.legendLinear')
      .call(legendLinear)
      .selectAll('text')
      .style('font-size', '10px');
  }, [statistic.maxConfirmed]);

  useEffect(() => {
    (async () => {
      try {
        const [response] = await Promise.all([
          axios.get(`https://www.covid19india.org/maps/india.json`)
        ]);
        const data = response.data
        if (statistic && choroplethMap.current) {
          ready(data);
          renderData();
          setSvgRenderCount((prevCount) => prevCount + 1);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [mapMeta.geoDataFile, statistic, renderData, ready]);

  const highlightRegionInMap = (name: any, mapType: any) => {
    const propertyField = propertyFieldMap[mapType];
    const paths = d3.selectAll('.path-region');
    paths.classed('map-hover', (d: any, i, nodes: any) => {
      if (name === d.properties[propertyField]) {
        nodes[i].parentNode.appendChild(nodes[i]);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    highlightRegionInMap(selectedRegion, mapMeta.mapType);
  }, [mapMeta.mapType, svgRenderCount, selectedRegion]);

  return (
    <div className="svg-parent">
      <svg
        id="chart"
        width="630"
        height="680"
        viewBox="0 0 630 680"
        preserveAspectRatio="xMidYMid meet"
        ref={choroplethMap}
      ></svg>
    </div>
  );
}

export default MapComp;
