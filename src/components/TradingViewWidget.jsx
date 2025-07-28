import { useState, useEffect, useRef } from 'react';
import OptionsModal from './optionsModal'
import { getOptionsChain, getTickers, getHistoricalOptionsChain } from './datafeed/rest'
import datafeed from './datafeed'

let tvWidget;

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


export default function TradingViewWidget() {
  const [open, setOpen] = useState(false);
	const handleClose = () => setOpen(false);
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [curTicker, setCurTicker] = useState("");
  const chartContainerRef = useRef();

	const defaultProps = {
		symbol: 'O:AAPL240517C00185000',
		interval: '30',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	};



  useEffect(() => {
    const widgetOptions = {
			symbol: defaultProps.symbol,
			datafeed,
			interval: defaultProps.interval,
			container: chartContainerRef.current,
			library_path: defaultProps.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: defaultProps.chartsStorageUrl,
			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
			client_id: defaultProps.clientId,
			user_id: defaultProps.userId,
			fullscreen: defaultProps.fullscreen,
			autosize: defaultProps.autosize,
			studies_overrides: defaultProps.studiesOverrides,
			theme: isDarkMode? 'dark' : 'light',
			priceFormat: {
				type: 'price',
				precision: 2,
				minMove: 0.01
			}
		};

		tvWidget = new window.TradingView.widget(widgetOptions);

    tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				// add Options search button
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to search options contract');
				button.addEventListener('click', () => setOpen(true))
				button.innerHTML = 'Options Search';
				// add dark/light mode switch
				tvWidget.createDropdown({
					title: 'Color Theme',
					tooltip: 'Choose between dark and light modes',
					items: [
						{
							title: 'Dark Mode',
							onSelect: () => {
								tvWidget.changeTheme('dark');
								setIsDarkMode(true)
							}
						},
						{
							title: 'Light Mode',
							onSelect: () => {
								tvWidget.changeTheme('light');
								setIsDarkMode(false)
							}
						},
					]
				})
				tvWidget.activeChart().setResolution(30);
			});
		});

		return () => {
			tvWidget.remove();
		};
  }, []);


  useEffect(() => {
		console.log("new ticker:", curTicker)
		if (tvWidget && curTicker) {
			tvWidget.setSymbol(curTicker, 30);
		}
	}, [curTicker])

  return (
    <div style={{position:'relative'}}>
      <div id="tv_chart_container" ref={chartContainerRef} style={{ height: '100vh', width: '100%' }} />
      <OptionsModal 
        show={open} 
        handleClose={handleClose} 
        setCurTicker={setCurTicker} 
        getOptionsChain={getOptionsChain} 
        getHistoricalOptionsChain={getHistoricalOptionsChain} 
        getTickers={getTickers} 
        isDarkMode={isDarkMode} />			
    </div>
  ) 
}
