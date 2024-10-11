// components/SalesChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box } from '@mui/material';

// Register the components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  chartData: {
    dates: string[];
    soldData: number[];
    usersData: number[];
  };
}

const SalesChart = ({ chartData }: ChartData) => {
  const data = {
    labels: chartData.dates,
    datasets: [
      {
        label: 'Products Sold',
        data: chartData.soldData,
        borderColor: '#3b82f6', // Blue color
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Users',
        data: chartData.usersData,
        borderColor: '#f87171', // Red color
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Box>
      <Line data={data} options={options} />
    </Box>
  );
};

export default SalesChart;
