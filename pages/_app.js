import "@/styles/globals.css";
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ToastContainer from '@/components/Toast';

const theme = createTheme({
  // Aquí puedes personalizar tu tema si lo deseas
});


export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}