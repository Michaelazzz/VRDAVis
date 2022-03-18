import React, { useEffect, useState, useRef } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

function Chart({ setRef, data }) {

  // let ref = useRef()

  const [chartData, setChartData] = useState([5,6,7])

  useEffect(() => {
    setChartData(data)
  }, [data])

  return (
    <Doughnut 
      ref={setRef} 
      options={options} 
      datasetIdKey='id'
      data={{
        datasets: [
          {
            id: 1,
            label: 'data 1',
            data: chartData,
            backgroundColor: ['red', 'green', 'blue']
          }
        ]
      }} 
    />
  )
}

export default Chart