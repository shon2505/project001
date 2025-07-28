// import Xapi from 'xoh-xapi';

import { restClient } from '@polygon.io/client-js';


const apiKey = "gSvqJyLY3lDPTL6QhjxOsk6JeozpT1K5";
const rest = restClient(apiKey);

let lastCandleTime = 0
const MATRIX = 90
const dayTime = 24 * 60 * 60 * 1000
const monthsName = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export const intervals = {
	'1': '1m',
	'5': '5m',
	'15': '15m',
	'30': '30m',
	'60': '1h',
	'240': '4h',
	'1440': '1d',
}

// top_symbol: 1 - only popular pairs
export const getSymbols = async () => {
	// const x = new Xapi({
	// 	accountId: "14867939",
	// 	password: "xoh55828",
	// 	type: "demo",
	// 	broker: "xtb",
	// });
	// const init = await x.init();
	// await x.streamer.init();
	// const datas = await x.getAllSymbols();
	// const symbols = datas.map(i => {
	// 	return { 
	// 			symbol: i.symbol,
	// 			description: i.description,
	// 			categoryName: i.categoryName,
	// 			groupName: i.groupName,
	// 	}
	// })

	// return symbols || [];

	/* -----------Test start ---------- */
	return [{
		symbol: 'O:AAPL240517C00185000',
		description: 'test data',
		groupName: 'test data',
		categoryName: 'test data',
	}]
	/* -----------Test End ---------- */

}



// [{ "id": 1, "name": "Euro US Dollar", "symbol": "EUR/USD", "decimal": 4 }]
export const getSymbol = async (symbol) => {
	const optionsTicker = symbol.substring(0,2) == "O:"? symbol.slice(2):symbol
	let optionsDesription = symbol

	let typeIndex = optionsTicker.lastIndexOf('C');
	if (typeIndex !== -1  && (/^\d+$/.test(optionsTicker.slice(typeIndex+1)))) {
		const strikePrice = parseInt(optionsTicker.slice(typeIndex+1))/1000
		const expireDateStr = optionsTicker.substring(typeIndex-6, typeIndex)
		const expireDate = `20${expireDateStr.substring(0,2)}-${expireDateStr.substring(2,4)}-${expireDateStr.substring(4,6)}`

		const dateValues = expireDate.split("-");
		const expireYear = dateValues[0]
		const expireMonth = monthsName[Number(dateValues[1]) - 1]
		const expireDay = dateValues[2]
		// const utcDate = new Date(expireDate)
		// const offset = -300; //Timezone offset for EST in minutes.
		// const estDate = new Date(utcDate.getTime() - offset*60*1000);
		// const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
		// const formattedDate = estDate.toLocaleDateString('en-US', dateOptions);
		const underlyingAsset = optionsTicker.substring(0, typeIndex-6)
		optionsDesription = `${underlyingAsset} ${expireMonth} ${expireDay}, ${expireYear} $${strikePrice} Call`
	} else {
		typeIndex = optionsTicker.lastIndexOf('P');
		if (typeIndex !== -1  && (/^\d+$/.test(optionsTicker.slice(typeIndex+1)))) {
			const strikePrice = parseInt(optionsTicker.slice(typeIndex+1))/1000
			const expireDateStr = optionsTicker.substring(typeIndex-6, typeIndex)
			const expireDate = `20${expireDateStr.substring(0,2)}-${expireDateStr.substring(2,4)}-${expireDateStr.substring(4,6)}`

			const dateValues = expireDate.split("-");
			const expireYear = dateValues[0]
			const expireMonth = monthsName[Number(dateValues[1]) - 1]
			const expireDay = dateValues[2]

			// const utcDate = new Date(expireDate)
			// const offset = -300; //Timezone offset for EST in minutes.
			// const estDate = new Date(utcDate.getTime() - offset*60*1000);
			// const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
			// const formattedDate = estDate.toLocaleDateString('en-US', dateOptions);
			const underlyingAsset = optionsTicker.substring(0, typeIndex-6)
			optionsDesription = `${underlyingAsset} ${expireMonth} ${expireDay}, ${expireYear} $${strikePrice} Put`
		}
	}

	/* -----------Test start ---------- */
	return({
		name: symbol,
		symbol: symbol,
		description: optionsDesription,
		categoryName: 'Stock Options',
		baseAssetName: symbol,
		quoteAssetName: 'test quote'
		// pricescale: parseFloat('1' + Array(parseFloat(responseSymbol.decimal)).fill(0).join(''))
	})
	/* -----------Test End ---------- */

}


// (symbol, interval, from, to)
export const getKlines = async ({ symbol, interval, periodParams }) => {
	let fromTimestamp = parseInt(1000 * periodParams.from)
	let toTimestamp = parseInt(1000 * periodParams.to)
	const countBack = periodParams.countBack
	const periodAvailable = (toTimestamp > fromTimestamp) && (toTimestamp> 0) && (fromTimestamp > 0);

	console.log("getKlines param:", symbol, periodParams, interval, fromTimestamp, toTimestamp, periodAvailable)

	if (!periodAvailable) {
		fromTimestamp = 0
		toTimestamp = new Date().getTime();		// current timestamp
		const polygonData = await rest.options.aggregates(symbol, interval, "minute", fromTimestamp, toTimestamp, {"limit": countBack, "sort": "desc"})
		polygonData["results"].sort((a, b) => a.t - b.t)
		const klines = polygonData["results"].map(data => formatingKline(data))
		console.log("klines:", klines, symbol, periodParams, interval)
		return klines || [];
	} else {
		const polygonData = await rest.options.aggregates(symbol, interval, "minute", fromTimestamp, toTimestamp)
		// const polygonData = await rest.options.aggregates("O:AAPL240524P00175000", 30, "minute", 1715205673000, 1715666147000)
		if (polygonData.resultsCount > 0) {
			const klines = polygonData["results"].map(data => formatingKline(data))
			console.log("klines:", klines, symbol, periodParams, interval)
			return klines || [];

		} else {
			const polygonData = await rest.options.aggregates(symbol, interval, "minute", 0, toTimestamp, {"limit": countBack, "sort": "desc"})
			if (polygonData.resultsCount == 0)
				return []
			polygonData["results"].sort((a, b) => a.t - b.t)
			const klines = polygonData["results"].map(data => formatingKline(data))
			console.log("klines:", klines, symbol, periodParams, interval)
			return klines || [];
		}
	}
}



// (symbol, interval)
export const getLastKline = async (symbol, interval) => {
		let cur_timestamp = new Date().getTime();
    let start_timestamp = cur_timestamp- 10*interval*60*1000;
		console.log("getLastKlines param:", symbol, interval, start_timestamp, cur_timestamp)
		const polygonData = await rest.options.aggregates(symbol, interval, "minute", start_timestamp, cur_timestamp, {"limit": 1, "sort": "desc"})
		console.log("getLastKlines polygon data:", polygonData)
		if (polygonData.resultsCount > 0) {
			const klines = polygonData["results"]
			const kline = formatingKline(klines[0])
			// return the last kline data
			return kline
		} else {
			// return empty array
			return null;
		}
}


export const checkInterval = (interval) => !!intervals[interval]


const formatingKline = (data) => {
	return {
		time: data.t,
		open: parseFloat(data.o),
		high: parseFloat(data.h),
		low: parseFloat(data.l),
		close: parseFloat(data.c),
		volume: parseFloat(data.v)
	}
}



export const getOptionsChain = async ({underlyingAsset, expirationDate}) => {
	const activeOptionsChain = await getActiveOptionsChain({underlyingAsset, expirationDate})
	const historicalOptionsChain = await getHistoricalOptionsChain({underlyingAsset, expirationDate})
	const allOptionsChain = {...historicalOptionsChain, ...activeOptionsChain}

	return allOptionsChain
}

export const getActiveOptionsChain = async ({underlyingAsset, expirationDate}) => {
	let next_url = "start"
	let allContracts = {};

	while(next_url) {
		let cursor = ""
		try {
			const url = new URL(next_url);
			const searchParams = new URLSearchParams(url.search);
			cursor = searchParams.get('cursor');
		} catch (err) {
			cursor = ""
		}
		const data = await rest.options.snapshotOptionChain(underlyingAsset, {expiration_date: expirationDate, limit: 200, cursor: cursor})
		const contracts_list = data.results
		// get ticker detail info
		for (let i=0; i<contracts_list.length; i++) {
			const optionContract = contracts_list[i]
			// const optionContratDetail = optionContract["details"]
			const ocExpiration = optionContract["details"].expiration_date
			const ocType = optionContract["details"].contract_type
			const ocStrikePrice = optionContract["details"].strike_price
			const ocTicker = optionContract["details"].ticker
			const ocVolume = optionContract["day"].hasOwnProperty("volume") ? optionContract["day"].volume : 0
			const ocOpenInterest = optionContract.hasOwnProperty("open_interest") ? optionContract.open_interest : 0
			const ocBid = optionContract["last_quote"].hasOwnProperty("bid") ? optionContract["last_quote"].bid : 0
			const ocBidSize = optionContract["last_quote"].hasOwnProperty("bid_size") ? optionContract["last_quote"].bid_size : 0
			const ocAsk = optionContract["last_quote"].hasOwnProperty("ask") ? optionContract["last_quote"].ask : 0
			const ocAskSize = optionContract["last_quote"].hasOwnProperty("ask_size") ? optionContract["last_quote"].ask_size : 0
			const ocMidpoint = optionContract["last_quote"].hasOwnProperty("midpoint") ? optionContract["last_quote"].midpoint : 0
			const ocLast = optionContract["last_trade"].hasOwnProperty("price") ? optionContract["last_trade"].price : 0
			const ocActive = true
			
			if(allContracts.hasOwnProperty(ocExpiration)) { 
				// add new contract info
				allContracts[ocExpiration].push({
					ocExpiration, ocType, ocStrikePrice, ocVolume, ocOpenInterest,
					ocBid, ocBidSize, ocAsk, ocAskSize, ocMidpoint, ocLast, ocTicker, ocActive
				})
			} else {
				allContracts[ocExpiration] = new Array({
					ocExpiration, ocType, ocStrikePrice, ocVolume, ocOpenInterest,
					ocBid, ocBidSize, ocAsk, ocAskSize, ocMidpoint, ocLast, ocTicker, ocActive
				})
			}
		}
		next_url = data.next_url;
	}

  return allContracts;
}


export const getHistoricalOptionsChain = async ({underlyingAsset, expirationDate}) => {
	let next_url = "start"
	let allContracts = {};

	while(next_url) {
		let cursor = ""
		try {
			const url = new URL(next_url);
			const searchParams = new URLSearchParams(url.search);
			cursor = searchParams.get('cursor');
		} catch (err) {
			cursor = ""
		}
		// const data = await rest.options.snapshotOptionChain(underlyingAsset, {expiration_date: expirationDate, limit: 200, cursor: cursor})
		let restParams = {	
			expired: true, 
			limit: 1000, 
			underlying_ticker:underlyingAsset, 
			cursor: cursor
		}
		if (expirationDate) {
			restParams["expiration_date"] = expirationDate
		} else {
			restParams["expiration_date.gt"] = "2023-01-01"
		}


		const data = await rest.reference.optionsContracts(restParams)
		const contracts_list = data.results
		// get ticker detail info
		for (let i=0; i<contracts_list.length; i++) {
			const optionContract = contracts_list[i]
			// const optionContratDetail = optionContract["details"]
			const ocExpiration = optionContract.expiration_date
			const ocType = optionContract.contract_type
			const ocStrikePrice = optionContract.strike_price
			const ocTicker = optionContract.ticker
			const ocVolume = 0
			const ocOpenInterest = 0
			const ocBid = 0
			const ocBidSize = 0
			const ocAsk = 0
			const ocAskSize = 0
			const ocMidpoint = 0
			const ocLast = 0
			const ocActive = false

			if(allContracts.hasOwnProperty(ocExpiration)) { 
				// add new contract info
				allContracts[ocExpiration].push({
					ocExpiration, ocType, ocStrikePrice, ocVolume, ocOpenInterest,
					ocBid, ocBidSize, ocAsk, ocAskSize, ocMidpoint, ocLast, ocTicker, ocActive
				})
			} else {
				allContracts[ocExpiration] = new Array({
					ocExpiration, ocType, ocStrikePrice, ocVolume, ocOpenInterest,
					ocBid, ocBidSize, ocAsk, ocAskSize, ocMidpoint, ocLast, ocTicker, ocActive
				})
			}
		}
		next_url = data.next_url;

	}

	return allContracts;
}



export const getTickers = async (keyword) => {
	let next_url = "start"
	let allTickers = []
	const data = await rest.reference.tickers({"search": keyword, "market": "stocks"})
	// console.log("return data:", data)
	const ticker_list = data.results
	const res = ticker_list.map(ticker => {
		return({
			symbol: ticker.ticker,
			name: ticker.name,
			market: ticker.market,
			location: ticker.locale,
			logo: ""
		})
	})

	return res
}
