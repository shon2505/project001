import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid, DialogTitle, DialogContent, IconButton, CircularProgress } from '@mui/material'
import TokenSelect from './tokenSelect';
import TokenTable from './tokenTable';
import TokenCombo from './tokenCombo';
import './index.css';


const monthsName = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

const defaultToken = {
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "logo": "https://api.polygon.io/v1/reference/company-branding/YXBwbGUuY29t/images/2024-04-01_icon.jpeg",
  "market": "stocks",
  "location": "us"
}



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  divider: '#434651',
  background: {
    default: '#1e222d',
    paper: '#1e222d'
  },
  text: {
    primary: '#d1d4dc',
    secondary: '#d1d4dc',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  divider: '#e0e3eb',
  background: {
    default: '#fff',
    paper: '#fff'
  },
  text: {
    primary: '#131722',
    secondary: '#131722',
  },
  input: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
});


const OptionsModal = ({ show, handleClose, setCurTicker, getOptionsChain, getHistoricalOptionsChain, getTickers, isDarkMode }) => {
  const [tokenSymbol, setTokenSymbol] = useState(defaultToken);
  const [expiration, setExpiration] = useState({});
  const [allExpiration, setAllExpiration] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = React.useState(defaultToken.symbol);
  const [tokenSymbolList, setTokenSymbolList] = React.useState([]);


  useEffect(() => {
    // update the Autocomplete options of the tokenSelect component 
    getTickers(inputValue).then(results => {
      let newOptions = [];
      if (results) {
        newOptions = [...newOptions, ...results];
      }
      setTokenSymbolList(newOptions)
      // setOptions(results)
    })
  }, [tokenSymbol, inputValue]);

  useEffect(() => {
    // Update the expiration list whenever the token symbol changes.
    const updateExpirationList = async () => {
      try {
        setIsLoading(true)
        const allOptionsChainData = await getOptionsChain({underlyingAsset: tokenSymbol.symbol})
        
        const entireExpirationData = formatExpirationData(tokenSymbol.symbol, allOptionsChainData)


        // const historicalOptionsChainData = await getHistoricalOptionsChain({underlyingAsset: tokenSymbol.symbol})
        // const entireChainData = {...historicalOptionsChainData, ...optionsChainData}
        // const entireChainData = {...optionsChainData, ...historicalOptionsChainData }
        // console.log("optionsChainData:", entireChainData)
        // const expirationsData = formatExpirationData(tokenSymbol.symbol, optionsChainData)
        // const activeExpirationsData = formatExpirationData(tokenSymbol.symbol, optionsChainData)
        // const historicalExpirationsData = formatExpirationData(tokenSymbol.symbol, historicalOptionsChainData)
        // const entireExpirationData = [...historicalExpirationsData, ...activeExpirationsData]

        setAllExpiration(entireExpirationData)
        if (entireExpirationData[0]) {
          // setExpiration({value: expirationsData[0].value, symbol: tokenSymbol.symbol})
          setExpiration({value: entireExpirationData[0].value, symbol: tokenSymbol.symbol})
        } else {
          setExpiration({})
        }
        setIsLoading(false)
      } catch (error) {
        console.error(error);
      }
    };
    updateExpirationList();
  }, [tokenSymbol]); // Or [] if effect doesn't need props or state



  const DialogFooter = styled(DialogActions)(({ theme }) => ({
    '&.MuiDialogActions-root': {
      padding: '9px 25px',
      backgroundColor: isDarkMode? '#2a2e39':'#f8f9fd',
      color: isDarkMode? '#787b86':'#6a6d78',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  }));

  const LoadingIcon = styled(CircularProgress)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '150'
  }));

  const iconButtonStyle = {              
    position: 'absolute',
    right: 8,
    top: 8,
  };
  

  const handleToken = (selTokenSymbol) => {
    setTokenSymbol({ ...tokenSymbol, ...selTokenSymbol });
  }

  const handleExpiration = (selExpiration, symbol) => {
    setExpiration({value: selExpiration, symbol: symbol})
  }

  const handleTableCell = (ocData) => {+
    console.log("contract data:", ocData)
    const ocTicker = ocData.hasOwnProperty("ocTicker")? ocData.ocTicker : ""
    if (ocTicker) {
      // set ocTicker as Chart symbol
      setCurTicker(ocTicker)
      handleClose()
    }
  }

  const formatExpirationData = (underlyingAsset, optionsChainData) => {

    const result = Object.keys(optionsChainData).map(expirationDate => {
      const contractsCount = optionsChainData[expirationDate].length
      const dateValues = expirationDate.split("-");
      const expireYear = dateValues[0]
      const expireMonth = monthsName[Number(dateValues[1]) - 1]
      const expireDay = dateValues[2]
      // const utcDate = new Date(expirationDate);
      // const offset = -300; //Timezone offset for EST in minutes.
      // var estDate = new Date(utcDate.getTime() - offset*60*1000);
      // const options = { year: 'numeric', month: 'short', day: 'numeric' };
      // const formattedDate = estDate.toLocaleDateString('en-US', options);
      const isExpired = optionsChainData[expirationDate][0].ocActive;
      return {
          name: `${expireMonth} ${expireDay}, ${expireYear} (${contractsCount}) ${underlyingAsset} ${isExpired?  "":" - Expired"}`,
          value: expirationDate
      }
    })
    return result;
  }

  return (
    <div style={{display: show? 'block': 'none'}} className={isDarkMode? 'dark':'light'}  >
      <div className="backdrop" />
      <div className="modal-wrapper">
        <div className='modal'>
          <ThemeProvider theme={isDarkMode? darkTheme:lightTheme}>
            {
              isLoading ? <LoadingIcon /> : null 
            }
            <DialogTitle sx={{fontSize:'20px', fontWeight:'700', lineHeight:'28px'}} id="customized-dialog-title">
              Options Contract Search
            </DialogTitle>
            <IconButton aria-label="close" onClick={handleClose} style={iconButtonStyle}>
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <Grid spacing={2} container sx={{marginBottom: '12px'}} >
                <Grid item xs={7}>
                  <TokenSelect label="Select options underlying" options={tokenSymbolList} defaultValue={tokenSymbol} handleToken={handleToken} loadingStatus={isLoading} 
                    setInputValue={setInputValue} getTickers={getTickers} isDarkMode={isDarkMode} />
                </Grid>
                <Grid item xs={5}>
                  <TokenCombo label="Expiration" options={allExpiration} defaultValue={expiration} symbol={tokenSymbol.symbol} onChange={handleExpiration} 
                    loadingStatus={isLoading} isDarkMode={isDarkMode} />
                </Grid>
              </Grid>
              <TokenTable tokenSymbol={tokenSymbol} expiration={expiration} getOptionsChain={getOptionsChain} onSelectCell={handleTableCell} 
                setIsLoading={setIsLoading} isDarkMode={isDarkMode} show={show} />
            </DialogContent>
            <DialogFooter>
              <span>Search for options contracts by underlying asset, expiration date, and strike price</span>
            </DialogFooter>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;