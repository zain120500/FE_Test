"use client";

import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import UnitStore from '@/stores/unit';

import RuasTable from "../component/ruasTable";
import Chart from 'chart.js/auto';

export default function Dashboard() {

    const { dataUnit, fetchUnit } = UnitStore();

    useEffect(() => {
        fetchUnit()

    }, []);

    // useEffect(() => {
    //     if (dataUnit.length != 0) {

    //         let cat: any = []
    //         let jumLuas: any = []
    //         for (let item of dataUnit.data) {
    //             cat.push(item.unit)
    //             jumLuas.push(item.ruas.length)
    //         }
    //         var options = {
    //             chart: {
    //                 type: 'bar'
    //             },
    //             series: [{
    //                 name: 'Jumlah Ruas',
    //                 data: jumLuas
    //             }],
    //             xaxis: {
    //                 categories: cat
    //             }
    //         };

    //         const chartElement = document.querySelector("#chart");
    //         let chart: any;
    //         if (chartElement) {
    //             chart = new ApexCharts(chartElement, options);
    //             chart.render();
    //         }

    //         var pieChart = {
    //             series: jumLuas,
    //             chart: {
    //                 width: 600,
    //                 type: 'pie',
    //             },
    //             labels: cat,
    //             options: {
    //                 // chart: {
    //                 //     width: 380,
    //                 //     type: 'pie',
    //                 // },
    //                 labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    //                 responsive: [{
    //                     breakpoint: 480,
    //                     options: {
    //                         chart: {
    //                             width: 200
    //                         },
    //                         legend: {
    //                             position: 'bottom'
    //                         }
    //                     }
    //                 }]
    //             },
    //         }

    //         const chartPieElement = document.querySelector("#chartPie");
    //         let pie: any;
    //         if (chartPieElement) {
    //             pie = new ApexCharts(chartPieElement, pieChart);
    //             pie.render();
    //         }

    //         return () => {
    //             if (chart) {
    //                 chart.destroy();
    //             }
    //             if (pie) {
    //                 pie.destroy();
    //             }
    //         };
    //     }
    // }, [dataUnit])

    const chartRef: any = useRef(null);
    const chartInstanceRef: any = useRef(null);
    const chartPieRef: any = useRef(null);
    const chartPieInstanceRef: any = useRef(null);


    useEffect(() => {
   
        if (dataUnit.length != 0) {

            let cat: any = []
            let jumLuas: any = []
            for (let item of dataUnit.data) {
                cat.push(item.unit)
                jumLuas.push(item.ruas.length)
            }

            const canvas = chartRef.current;

            if (canvas && canvas instanceof HTMLCanvasElement) {
                const ctx: any = canvas.getContext('2d');

                // If a chart instance already exists, destroy it before creating a new one
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: cat,
                        datasets: [{
                            label: 'Jumlah Ruas',
                            data: jumLuas,
                            borderWidth: 1,
                            backgroundColor: ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#4b7bec', '#a55eea', '#4b6584']
                        }],

                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false // Menyembunyikan legend
                            }
                        },
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }


            const canvasPie = chartPieRef.current;

            if (canvasPie && canvasPie instanceof HTMLCanvasElement) {
                const ctx: any = canvasPie.getContext('2d')

                // If a chart instance already exists, destroy it before creating a new one
                if (chartPieInstanceRef.current) {
                    chartPieInstanceRef.current.destroy();
                }

                chartPieInstanceRef.current = new Chart(ctx, {
                    type: 'pie',
                    
                    data: {
                        labels: cat,
                        datasets: [{
                            label: 'My First Dataset',
                            data: jumLuas,
                            hoverOffset: 4,
                            backgroundColor: ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#4b7bec', '#a55eea', '#4b6584'],
                        }],
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false // Menyembunyikan legend
                            }
                        },
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },

                    }
                });
            }
        }
    }, [dataUnit]);

    return (
        <>
       
            <div className='md:flex my-5 gap-2'>
                {/* <div className='flex-initial w-1/2' id="chart"></div>
                <div id="chartPie"> </div> */}
                <div className='md:w-2/3' >
                    <canvas id="myChart" ref={chartRef}></canvas>
                </div>
                <div className='flex-1'>
                    <canvas id="myChartPie" ref={chartPieRef}></canvas>
                </div>
            </div>
            <RuasTable />
        </>
    );
}