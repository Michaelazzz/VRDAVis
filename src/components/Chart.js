import React, { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};



function Chart({data}) {

  // const ref = useRef()

  // useEffect(() => {
    
  // }, [])

  return (
    <Scatter options={options} data={data} />
  )
}

export default Chart