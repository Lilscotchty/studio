
"use client";

import React, { useEffect, useRef, memo } from 'react';

function TradingViewAdvancedChartWidget() {
  const container = useRef<HTMLDivElement | null>(null);
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (container.current && !scriptAdded.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      // The innerHTML should be a string representation of the JSON configuration
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "backgroundColor": "rgba(0, 0, 0, 1)", // Match app's dark background
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      });
      container.current.appendChild(script);
      scriptAdded.current = true;
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright" style={{textAlign: 'center', fontSize: '0.75rem', paddingTop: '8px'}}>
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span style={{color: '#2962FF'}}>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewAdvancedChartWidget);
