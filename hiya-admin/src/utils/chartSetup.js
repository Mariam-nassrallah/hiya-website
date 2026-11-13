// Chart.js only includes the parts we register, which keeps the bundle small.
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { BRAND } from './brand';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

// Same fonts and text colour as the rest of the dashboard
ChartJS.defaults.font.family = "'DM Sans', system-ui, sans-serif";
ChartJS.defaults.color = BRAND.espresso;
ChartJS.defaults.plugins.tooltip.backgroundColor = BRAND.espresso;
ChartJS.defaults.plugins.tooltip.titleColor = BRAND.cream;
ChartJS.defaults.plugins.tooltip.bodyColor = BRAND.cream;
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 10;
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
