import { FC, useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  TextField 
} from '@mui/material';
import SalesChart from '../components/SalesChart';
import MainLayout from '../layouts/Main'; // Assuming this is your layout
import { makeAllMenus } from '../lib/menu'; // Assuming you have this helper function
import { IMenuItem } from '../@types/components';

interface SalesData {
  date: string;
  sold: number;
  users: number;
}

interface SummaryData {
  totalSold: number;
  totalUsers: number;
  averageCheck: number;
}

interface DashboardProps {
  mainMenu: IMenuItem[];
  footerMenu: IMenuItem[];
}

const Dashboard: FC<DashboardProps> = ({ mainMenu, footerMenu }) => {
  const [chartData, setChartData] = useState({
    dates: [] as string[],
    soldData: [] as number[],
    usersData: [] as number[],
  });

  const [summary, setSummary] = useState<SummaryData>({
    totalSold: 0,
    totalUsers: 0,
    averageCheck: 0,
  });

  // Mock Data Fetching
  useEffect(() => {
    const mockData: SalesData[] = [
      { date: '2024-10-01', sold: 4, users: 3 },
      { date: '2024-10-02', sold: 6, users: 4 },
      { date: '2024-10-03', sold: 2, users: 1 },
      { date: '2024-10-04', sold: 7, users: 5 },
    ];

    const dates = mockData.map((item) => item.date);
    const soldData = mockData.map((item) => item.sold);
    const usersData = mockData.map((item) => item.users);

    const totalSold = soldData.reduce((acc, val) => acc + val, 0);
    const totalUsers = usersData.reduce((acc, val) => acc + val, 0);
    const averageCheck = totalSold / (soldData.length || 1);

    setChartData({ dates, soldData, usersData });
    setSummary({ totalSold, totalUsers, averageCheck });
  }, []);

  return (
    <MainLayout mainMenu={mainMenu} footerMenu={footerMenu}>
      <Container maxWidth="lg">
        {/* Title */}
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Sales Dashboard
          </Typography>
        </Box>

        {/* Date Range Selector */}
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item>
            <Typography variant="body1">Date range:</Typography>
          </Grid>
          <Grid item>
            <TextField
              type="date"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item>
            <Typography variant="body1">-</Typography>
          </Grid>
          <Grid item>
            <TextField
              type="date"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">
              Show
            </Button>
          </Grid>
        </Grid>

        {/* Sales Chart */}
        <Box mt={4}>
          <SalesChart chartData={chartData} />
        </Box>

        {/* Summary Table */}
        <Box mt={4}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Total Products Sold</TableCell>
                  <TableCell>Total Users</TableCell>
                  <TableCell>Average Check</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{summary.totalSold}</TableCell>
                  <TableCell>{summary.totalUsers}</TableCell>
                  <TableCell>${summary.averageCheck.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;

// Fetch menu data from your API (could be server-side or static)
export const getServerSideProps = async () => {
  const categoryTree: any[] = []; // Fetch your category tree data from your API
  const menus = makeAllMenus({ categoryTree });

  return {
    props: {
      mainMenu: menus.mainMenu,
      footerMenu: menus.footerMenu,
    },
  };
};
