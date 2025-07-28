import React, { useEffect, useState } from 'react';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';



const Root = styled('div')(
  ({ theme }) => `
  color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
  };
  font-size: 14px;
  position: relative;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 100%;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#50535e' : '#d1d4dc'};
  background-color: ${theme.palette.mode === 'dark' ? 'transparent' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? 'transparent' : '#fff'};
    color: ${
      theme.palette.mode === 'dark' ? '#fff':'#000'
    };
    height: 32px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  margin: 2px 0 0;
  position: absolute;
  width: 100%;
  padding: 0;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px rgba(255, 255, 255, 0.3);
  z-index: 100;

  & li {
    padding: 5px 12px;
    display: flex;
    align-items: center;

    & svg {
      color: transparent;
    }

    & img {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

const whiteShadowCSS = '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)';
const darkShadowCSS = '0px 2px 4px 1px rgba(255,255,255,0.3)'


const TokenSelect = (props) => {
  const {label, defaultValue, handleToken, loadingStatus, setInputValue, options, isDarkMode} = props;
  const [tokenSelectValue, setTokenSelectValue] = useState(defaultValue)
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: `Select_${label}`,
    value: tokenSelectValue,
    multiple: false,
    options: options,
    getOptionLabel: (option) => option.symbol,
    onChange: (event, newValue) => {
      setTokenSelectValue(newValue)
      handleToken(newValue)  
    },
    disabled: loadingStatus,
    filterOptions: (x) => x,
    onInputChange: (event, newInputValue) => {
      setInputValue(newInputValue);
    },
    isOptionEqualToValue: (option, value) => {
      // return option.symbol === value.symbol;
      return (option.symbol+"_"+option.name) === (value.symbol+"_"+value.name);
    }
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>{label}</Label>
        <InputWrapper>
          <input {...getInputProps()}/>
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()} sx={{boxShadow: isDarkMode? darkShadowCSS : whiteShadowCSS}}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })} key={option.symbol+"_"+option.name}>
              {/* <img crossOrigin="" decoding="async" src={option.logo + "?apiKey=gSvqJyLY3lDPTL6QhjxOsk6JeozpT1K5"} alt={option.symbol} /> */}
              <span style={option.symbol?{width: '25%', marginLeft: 8}:{}}>{option.symbol}</span>
              <span>{option.name?option.name:''}</span>
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  )
}

export default TokenSelect;