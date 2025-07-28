import React, { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Typography, Grid  } from '@mui/material'
import { styled } from '@mui/material/styles';

const TokenTable = (props) => {
  const {tokenSymbol, expiration, onSelectCell, setIsLoading, getOptionsChain, isDarkMode, show} = props;
  const [chainTableData, setChainTableData] = useState([])

  useEffect(() => {
    if (chainTableData && show) {
      // update the options chain table every minute.
      const intervalId = setInterval(() => {
        getOptionsChain({underlyingAsset: tokenSymbol.symbol, expirationDate: expiration.value }).then(optionsChainData => {
          const initTableData = optionsChainData[expiration.value]
          setChainTableData(formatChainTableData(initTableData))
        })
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [chainTableData]);

  useEffect(() => { 
    // Update the option chain table whenever the token symbol and expiration date change.
    console.log("token symbol and expiration in Table:", tokenSymbol, expiration)
    const updateTokenTable = async () => {
      try {
        if (tokenSymbol && expiration && (expiration.symbol == tokenSymbol.symbol)) {
          setIsLoading(true)
          const optionsChainData = await getOptionsChain({underlyingAsset: tokenSymbol.symbol, expirationDate: expiration.value })
          const initTableData = optionsChainData[expiration.value]
          setChainTableData(formatChainTableData(initTableData))
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
    updateTokenTable();
  }, [tokenSymbol, expiration])

  const formatChainTableData = (optionsChainData) => {
    if (!optionsChainData)
      return []
    let chainTableDataObj = {}
    optionsChainData.sort((contractA, contractB) => contractA.ocStrikePrice - contractB.ocStrikePrice)
    optionsChainData.map((contractInfo) => {
      if (!chainTableDataObj.hasOwnProperty(contractInfo.ocStrikePrice)) 
        chainTableDataObj[contractInfo.ocStrikePrice] = {}
      if (contractInfo.ocType == "call") {
        chainTableDataObj[contractInfo.ocStrikePrice]["call"] = contractInfo
      } else if (contractInfo.ocType == "put") (
        chainTableDataObj[contractInfo.ocStrikePrice]["put"] = contractInfo
      )
      chainTableDataObj[contractInfo.ocStrikePrice]["strikePrice"] = contractInfo.ocStrikePrice
    })
    return Object.values(chainTableDataObj);
  }

  const TableHeaderRow = styled(TableRow)(({ theme }) => ({
    '>.MuiTableCell-root': {
      color: '#868993'
    }
  }));

  const TableBodyRow = styled(TableRow)(({ theme }) => ({
    '>.MuiTableCell-root': {
      cursor: 'pointer',
      fontWeight: '700'
    }
  }));


  return (
    <Box>
      <TableContainer sx={{ maxHeight: 360, scrollbarColor: '#9598A1', msScrollbarTrackColor: 'transparent', background: isDarkMode? '#000':'#fff', marginBottom:'1px' }}>
        <Table stickyHeader aria-label="sticky table" sx={{ scrollbarColor: '#9598A1', msScrollbarTrackColor: 'transparent' }}>
          <TableHead>
              <TableRow>
                <TableCell sx={{fontSize: '1rem'}} align='center' colSpan={8}>Call</TableCell>
                <TableCell colSpan={2}></TableCell>
                <TableCell sx={{fontSize: '1rem'}} align='center' colSpan={8}>Put</TableCell>
              </TableRow>
              <TableHeaderRow>
                <TableCell>Bid</TableCell>
                <TableCell>Bid Size</TableCell>
                <TableCell>Ask</TableCell>
                <TableCell>Ask Size</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Mark</TableCell>
                <TableCell>Volumn</TableCell>
                <TableCell>Open Interest</TableCell>
                {/* <TableCell sx={{color: '#868993', background: '#131722'}} align='center'>Strike</TableCell> */}
                <TableCell sx={{color: isDarkMode? '#868993':'#131712', background: isDarkMode? '#131722':'#f8f9fd'}} align='center'>Strike</TableCell>
                <TableCell>Bid</TableCell>
                <TableCell>Bid Size</TableCell>
                <TableCell>Ask</TableCell>
                <TableCell>Ask Size</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Mark</TableCell>
                <TableCell>Volumn</TableCell>
                <TableCell>Open Interest</TableCell>
              </TableHeaderRow>
          </TableHead>
          <TableBody>
            {chainTableData.map((row, index) => (
              <TableBodyRow key={index}>
                <TableCell sx={{color:'#5627d8'}} onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocBid : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocBidSize : "-"} </TableCell>
                <TableCell sx={{color:'#5627d8'}} onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocAsk : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocAskSize : "-"} </TableCell>
                <TableCell sx={{color:'#127b1e'}} onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocLast : "-"} </TableCell>
                <TableCell sx={{color:'#127b1e'}} onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocMidpoint : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocVolume : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.call)}> {row.call? row.call.ocOpenInterest : "-"}</TableCell>
                {/* <TableCell sx={{color: '#131712', background: '#f8f9fd'}}>{row.strikePrice? row.strikePrice : "-"} </TableCell> */}
                <TableCell sx={{color: isDarkMode? '#868993':'#131712', background: isDarkMode? '#131722':'#f8f9fd'}}>
                  {row.strikePrice? row.strikePrice : "-"} 
                </TableCell>
                <TableCell sx={{color:'#5627d8'}} onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocBid : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocBidSize : "-"} </TableCell>
                <TableCell sx={{color:'#5627d8'}} onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocAsk : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocAskSize : "-"} </TableCell>
                <TableCell sx={{color:'#cd0707'}} onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocLast : "-"} </TableCell>
                <TableCell sx={{color:'#cd0707'}} onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocMidpoint : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocVolume : "-"} </TableCell>
                <TableCell onClick={() => onSelectCell(row.put)}> {row.put? row.put.ocOpenInterest : "-"} </TableCell>
              </TableBodyRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TokenTable;

