import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MicroComponent from './microcomponents';

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
                <Tab label="Item One" value="1" />
                <Tab label="Item Two" value="2" />
                <Tab label="Item Three" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1"> 
                <MicroComponent/>
                
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
        </div>
      );
    }
//     return (
//         <div className="flex items-center justify-center w-full mt-4">
//             <div className="flex w-8/12 h-11/12 bg-white shadow-sm rounded-lg p-4">

//                 <div class="flex space-x-2 p-4 justify-between w-full">
//                     <h2 className="font-bold">Ventas</h2>
//                    <div>
//                    <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-md">
//                         Día
//                     </button>
//                     <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 roun">
//                         Semana
//                     </button>
//                     <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                         Mes
//                     </button>
//                    </div>
//                 </div>
//             </div>

//         </div>
//     )
// }
