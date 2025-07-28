import React, { useEffect, useState } from 'react';

import { Box, InputLabel, Select, MenuItem, NativeSelect } from '@mui/material'
import { styled } from '@mui/material/styles';



const TokenNativeSelect = styled(NativeSelect)(({ theme }) => ({
  width: '100%',
  border: 'solid 1px #d1d4dc',
  borderRadius:'4px',
  fontSize: '14px',
  height: '34px',
  padding: '4px 6px',
  backgroundColor: '#transparent',

  '&:before': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled, .Mui-error):before': {
    borderBottom: 'none',
  },
  '&:after': {
    borderBottom: 'none',
  },

  '&.MuiNativeSelect-select option': {
    padding: '3px 10px'
  },
  '>.MuiSvgIcon-root': {
    display: 'none'
  },
  '&.Mui-disabled:before': {
    border: 'none'
  },
  '>.MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent'
  }
}));


const TokenSelect = styled(Select)(({ theme }) => ({
  // background: '#141414',
  width: '100%',
  borderRadius:'4px',
  fontSize: '14px',
  height: '36px',
  padding: '4px 8px',
  backgroundColor: 'transparent',

  '&:before': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled, .Mui-error):before': {
    borderBottom: 'none',
  },
  '&:after': {
    borderBottom: 'none',
  },
  '>.MuiSvgIcon-root': {
    display: 'none'
  },
  '&.Mui-disabled:before': {
    border: 'none'
  },
  '>.MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent'
  },
  '>.MuiSelect-select.MuiSelect-outlined': {
    padding: 0
  },
  '>.MuiList-root.MuiList-padding': {
    padding: 0
  }
}));


const MenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 224,
      width: 250,
      '>.MuiList-root': {
        padding: 0
      }
    }
  },
};



const TokenCombo = (props) => {
  const {label, options, defaultValue, symbol, onChange, loadingStatus, isDarkMode} = props;
  // const [value, setValue] = useState("")

  // useEffect(() => {
  //   console.log("default value:", defaultValue)
  //   setValue(defaultValue.value)
  // }, [defaultValue])

  // return (
  //   <Box sx={{ minWidth: 120 }}>
  //       <InputLabel variant="standard" htmlFor="uncontrolled-native" sx={{lineHeight: 1.5, fontSize: 14, paddingBottom: '4px'}}>
  //         {label}
  //       </InputLabel>
  //       <TokenSelect
  //         // value={value}
  //         onChange={e => onChange(e.target.value, symbol)}
  //         disabled={loadingStatus}
  //         sx={{borderColor: isDarkMode? '#50535e':'#d1d4dc'}}
  //         MenuProps={MenuProps}
  //       >
  //         {
  //           options.map(item => (<MenuItem sx={{fontSize: 14, color: isDarkMode?'rgba(255,255,255,0.65)': 'rgba(0,0,0,.85)', paddingLeft: '8px',backgroundColor: isDarkMode? '#141414': '', ':hover': isDarkMode? {}:{backgroundColor: '#e6f7ff'}}} key={item.name} value={item.value}>{item.name}</MenuItem>))
  //         }
  //       </TokenSelect>
  //   </Box>
  // )

  return (
    <Box sx={{ minWidth: 120 }}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native" sx={{lineHeight: 1.5, fontSize: 14, paddingBottom: '5px'}}>
          {label}
        </InputLabel>
        <TokenNativeSelect
          value={defaultValue.value}
          onChange={e => onChange(e.target.value, symbol)}
          disabled={loadingStatus}
          sx={{borderColor: isDarkMode? '#50535e':'#d1d4dc'}}
        >
          {
            options.map(item => (<option key={item.name} value={item.value}>{item.name}</option>))
          }
        </TokenNativeSelect>
    </Box>
  )
};

export default TokenCombo;