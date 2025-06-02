
"use client";

import React, { useEffect, useRef } from 'react';

export function TradingViewMarketOverview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptAppendedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && !scriptAppendedRef.current) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "colorTheme": "dark", // Keep dark theme for text, etc.
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": true, // Set to true
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "550",
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(42, 46, 57, 0)",
        "scaleFontColor": "rgba(219, 219, 219, 1)",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              { "s": "FOREXCOM:SPXUSD", "d": "S&P 500 Index" },
              { "s": "FOREXCOM:NSXUSD", "d": "US 100 Cash CFD" },
              { "s": "FOREXCOM:DJI", "d": "Dow Jones Industrial Average Index" },
              { "s": "INDEX:NKY", "d": "Japan 225" },
              { "s": "INDEX:DEU40", "d": "DAX Index" },
              { "s": "FOREXCOM:UKXGBP", "d": "FTSE 100 Index" },
              { "s": "TVC:GOLD", "d": "Gold"}
            ],
            "originalTitle": "Indices"
          },
          {
            "title": "Forex",
            "symbols": [
              { "s": "FX:EURUSD", "d": "EUR to USD" },
              { "s": "FX:GBPUSD", "d": "GBP to USD" },
              { "s": "FX:USDJPY", "d": "USD to JPY" },
              { "s": "FX:USDCHF", "d": "USD to CHF" },
              { "s": "FX:AUDUSD", "d": "AUD to USD" },
              { "s": "FX:USDCAD", "d": "USD to CAD" }
            ],
            "originalTitle": "Forex"
          },
          {
            "title": "Futures",
            "symbols": [
              { "s": "BMFBOVESPA:ISP1!", "d": "S&P 500 Index Futures"},
              { "s": "BMFBOVESPA:EUR1!", "d": "Euro Futures"},
              { "s": "PYTH:WTI3!", "d": "WTI CRUDE OIL"},
              { "s": "BMFBOVESPA:ETH1!", "d": "Hydrous ethanol"},
              { "s": "BMFBOVESPA:CCM1!", "d": "Corn"}
            ],
            "originalTitle": "Futures"
          },
          {
            "title": "Bonds",
            "symbols": [
              { "s": "EUREX:FGBL1!", "d": "Euro Bund" },
              { "s": "EUREX:FBTP1!", "d": "Euro BTP" },
              { "s": "EUREX:FGBM1!", "d": "Euro BOBL" }
            ],
            "originalTitle": "Bonds"
          }
        ]
      });
      
      containerRef.current.appendChild(script);
      scriptAppendedRef.current = true;
    }

    return () => {
        if (scriptAppendedRef.current && containerRef.current) {
            const scripts = containerRef.current.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].src.includes('tradingview.com/external-embedding/embed-widget-market-overview.js')) {
                    scripts[i].remove();
                }
            }
            const widgetInnerContainer = containerRef.current.querySelector('.tradingview-widget-container__widget');
            if (widgetInnerContainer) {
                widgetInnerContainer.innerHTML = '';
            }
            scriptAppendedRef.current = false;
        }
    };
  }, []);

  return (
    <div ref={containerRef} className="tradingview-widget-container mx-auto" style={{ height: '550px', width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      <div className="tradingview-widget-copyright text-center text-xs p-1">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" className="text-blue-500 hover:text-blue-400">
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
}
