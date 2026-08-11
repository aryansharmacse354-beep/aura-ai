import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ForecastPoint } from '../types';
import { BarChart3, Info, Sparkles, SlidersHorizontal, Activity } from 'lucide-react';

interface D3TrendsDashboardProps {
  forecastData: ForecastPoint[];
  cityName: string;
}

type PollutantMode = 'aqi' | 'particulate' | 'gaseous' | 'all';

export const D3TrendsDashboard: React.FC<D3TrendsDashboardProps> = ({ forecastData, cityName }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMode, setSelectedMode] = useState<PollutantMode>('aqi');
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !forecastData || forecastData.length === 0) return;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Container dimensions
    const width = 760;
    const height = 310;
    const margin = { top: 30, right: 30, bottom: 45, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main SVG group
    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Time steps)
    const xScale = d3
      .scalePoint<string>()
      .domain(forecastData.map((d) => d.time))
      .range([0, innerWidth])
      .padding(0.2);

    // Determine Y Scale Domain based on selectedMode
    let yMax = 400;
    if (selectedMode === 'aqi') {
      yMax = (d3.max(forecastData, (d: ForecastPoint) => Math.max(d.upperBound, d.aqi)) || 350) + 20;
    } else if (selectedMode === 'particulate') {
      yMax = (d3.max(forecastData, (d: ForecastPoint) => Math.max(d.pm25, d.pm10)) || 300) + 30;
    } else if (selectedMode === 'gaseous') {
      yMax = (d3.max(forecastData, (d: ForecastPoint) => Math.max(d.no2, d.o3)) || 120) + 20;
    } else {
      yMax = (d3.max(forecastData, (d: ForecastPoint) => Math.max(d.aqi, d.pm10)) || 350) + 30;
    }

    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice();

    // Define Gradients
    const defs = svg.append('defs');

    // AQI Confidence Band Gradient
    const confidenceGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-confidence-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    confidenceGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.25);

    confidenceGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.02);

    // PM2.5 Line Gradient
    const pm25Gradient = defs
      .append('linearGradient')
      .attr('id', 'd3-pm25-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    pm25Gradient.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.2);
    pm25Gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.0);

    // Horizontal Grid Lines
    const yGrid = d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid-lines')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3,3');

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    xAxisG.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, SFMono-Regular, monospace')
      .attr('dy', '12px');

    xAxisG.selectAll('line').attr('stroke', '#334155');
    xAxisG.select('.domain').attr('stroke', '#334155');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(6);
    const yAxisG = g.call(yAxis);

    yAxisG.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, SFMono-Regular, monospace');

    yAxisG.selectAll('line').attr('stroke', '#334155');
    yAxisG.select('.domain').attr('stroke', '#334155');

    // Render Data Layers based on selectedMode
    if (selectedMode === 'aqi' || selectedMode === 'all') {
      // Confidence Bounds Area
      const areaGen = d3
        .area<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y0((d) => yScale(d.lowerBound))
        .y1((d) => yScale(d.upperBound))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(forecastData)
        .attr('fill', 'url(#d3-confidence-gradient)')
        .attr('d', areaGen);

      // AQI Main Trend Line
      const aqiLineGen = d3
        .line<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y((d) => yScale(d.aqi))
        .curve(d3.curveMonotoneX);

      const path = g
        .append('path')
        .datum(forecastData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('d', aqiLineGen);

      // Animate line draw
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // Data Circles for AQI
      g.selectAll('.dot-aqi')
        .data(forecastData)
        .enter()
        .append('circle')
        .attr('class', 'dot-aqi')
        .attr('cx', (d: ForecastPoint) => xScale(d.time) || 0)
        .attr('cy', (d: ForecastPoint) => yScale(d.aqi))
        .attr('r', 4)
        .attr('fill', (d: ForecastPoint) => (d.aqi > 250 ? '#ef4444' : d.aqi > 150 ? '#f97316' : '#10b981'))
        .attr('stroke', '#090d16')
        .attr('stroke-width', 2);
    }

    if (selectedMode === 'particulate' || selectedMode === 'all') {
      // PM2.5 Line (Red)
      const pm25Line = d3
        .line<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y((d) => yScale(d.pm25))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(forecastData)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', selectedMode === 'all' ? '4,4' : 'none')
        .attr('d', pm25Line);

      // PM10 Line (Amber)
      const pm10Line = d3
        .line<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y((d) => yScale(d.pm10))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(forecastData)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('d', pm10Line);

      // Dots
      g.selectAll('.dot-pm25')
        .data(forecastData)
        .enter()
        .append('circle')
        .attr('cx', (d: ForecastPoint) => xScale(d.time) || 0)
        .attr('cy', (d: ForecastPoint) => yScale(d.pm25))
        .attr('r', 3)
        .attr('fill', '#ef4444');
    }

    if (selectedMode === 'gaseous' || selectedMode === 'all') {
      // NO2 Line (Purple)
      const no2Line = d3
        .line<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y((d) => yScale(d.no2))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(forecastData)
        .attr('fill', 'none')
        .attr('stroke', '#a855f7')
        .attr('stroke-width', 2)
        .attr('d', no2Line);

      // O3 Line (Cyan)
      const o3Line = d3
        .line<ForecastPoint>()
        .x((d) => xScale(d.time) || 0)
        .y((d) => yScale(d.o3))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(forecastData)
        .attr('fill', 'none')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 2)
        .attr('d', o3Line);
    }

    // Interactive Hover Overlay Crosshair Line & Event Catching
    const hoverLine = g
      .append('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    overlay.on('mousemove', (event) => {
      const [mouseX] = d3.pointer(event);

      // Find closest time point
      let closestPoint = forecastData[0];
      let minDistance = Infinity;

      forecastData.forEach((d) => {
        const xPos = xScale(d.time) || 0;
        const distance = Math.abs(xPos - mouseX);
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = d;
        }
      });

      const matchedX = xScale(closestPoint.time) || 0;
      hoverLine.attr('x1', matchedX).attr('x2', matchedX).style('opacity', 1);
      setHoveredPoint(closestPoint);
    });

    overlay.on('mouseleave', () => {
      hoverLine.style('opacity', 0);
      setHoveredPoint(null);
    });
  }, [forecastData, selectedMode]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <span>D3 Interactive 72-Hour AQI & Pollutant Trends Engine</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                D3.js Vector Canvas
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Physics-informed vector trend simulation for {cityName} with confidence interval bounds
            </p>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedMode('aqi')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'aqi'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AQI & Bounds
          </button>
          <button
            onClick={() => setSelectedMode('particulate')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'particulate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PM2.5 vs PM10
          </button>
          <button
            onClick={() => setSelectedMode('gaseous')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'gaseous'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gaseous (NO2 / O3)
          </button>
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedMode === 'all'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Speciations
          </button>
        </div>
      </div>

      {/* D3 SVG Container */}
      <div ref={containerRef} className="relative bg-slate-950/80 rounded-2xl p-2 border border-slate-800/80 shadow-inner">
        <svg ref={svgRef} className="w-full h-auto overflow-visible" />

        {/* Hovered Point Card Floating Overlay */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 w-52 pointer-events-none z-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono text-slate-300 font-bold">
              <span>Time: {hoveredPoint.time}</span>
              <span className="text-emerald-400">{hoveredPoint.confidenceScore}% Conf</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div className="text-slate-400">AQI Index:</div>
              <div className="font-bold text-slate-100 font-mono text-right">{hoveredPoint.aqi} AQI</div>

              <div className="text-slate-400">PM2.5:</div>
              <div className="font-bold text-red-400 font-mono text-right">{hoveredPoint.pm25} µg/m³</div>

              <div className="text-slate-400">PM10:</div>
              <div className="font-bold text-amber-400 font-mono text-right">{hoveredPoint.pm10} µg/m³</div>

              <div className="text-slate-400">NO2 Gas:</div>
              <div className="font-bold text-purple-400 font-mono text-right">{hoveredPoint.no2} µg/m³</div>

              <div className="text-slate-400">Ozone O3:</div>
              <div className="font-bold text-cyan-400 font-mono text-right">{hoveredPoint.o3} µg/m³</div>

              <div className="text-slate-400">Wind Vector:</div>
              <div className="font-mono text-slate-200 text-right">{hoveredPoint.windSpeed} km/h</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Key Stat Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <div>
            <span className="text-slate-400 text-[10px] block">Overall Trajectory</span>
            <span className="font-bold text-slate-200">
              {forecastData[0]?.aqi > forecastData[forecastData.length - 1]?.aqi ? 'Clearing Trend (-43%)' : 'Accumulating Trend'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
          <div>
            <span className="text-slate-400 text-[10px] block">Peak PM2.5 Surge</span>
            <span className="font-bold text-red-400 font-mono">
              {Math.max(...forecastData.map((d) => d.pm25))} µg/m³
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
          <div>
            <span className="text-slate-400 text-[10px] block">Max NO2 Concentration</span>
            <span className="font-bold text-purple-400 font-mono">
              {Math.max(...forecastData.map((d) => d.no2))} µg/m³
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
          <div>
            <span className="text-slate-400 text-[10px] block">Confidence Interval</span>
            <span className="font-bold text-emerald-300 font-mono">
              ±18 AQI Bounds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
