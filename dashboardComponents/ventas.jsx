import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Populares from './populares';
import IdPedidos from './idpedidos';
import MainStats from './mainStats';
export default function Ventas() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Populares" value="1" />
              <Tab label="Ventas" value="2" />
              {/* <Tab label="Productos" value="3" /> */}
            </TabList>
          </Box>
          <TabPanel value="1">

            <Populares />

          </TabPanel>
          <TabPanel value="2">
            <MainStats />
          </TabPanel>
          {/* <TabPanel value="3">

            <IdPedidos />

          </TabPanel> */}
        </TabContext>
      </Box>
    </div>
  );
}