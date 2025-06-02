
"use client";

import React, { useEffect, useRef, memo } from 'react';

function TradingViewAdvancedChartWidget() {
  const container = useRef<HTMLDivElement | null>(null);
  const scriptAdded = useRef(false);

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    if (container.current && !scriptAdded.current) {
      scriptElement = document.createElement("script");
      scriptElement.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      scriptElement.type = "text/javascript";
      scriptElement.async = true;
      scriptElement.innerHTML = JSON.stringify({
        "width": "100%", // Changed from "980" to "100%"
        "height": "650",
        "symbol": "NASDAQ:AAPL",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "backgroundColor": "rgba(16, 19, 24, 1)", 
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      });
      container.current.appendChild(scriptElement);
      scriptAdded.current = true;
    }

    return () => {
      if (scriptAdded.current && container.current) {
        
        if (scriptElement && scriptElement.parentNode) {
          scriptElement.parentNode.removeChild(scriptElement);
        } else {
          
          const scripts = container.current.getElementsByTagName('script');
          for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.includes('embed-widget-advanced-chart.js')) {
              scripts[i].remove();
              break; 
            }
          }
        }
        
        
        const widgetInnerContainer = container.current.querySelector('.tradingview-widget-container__widget');
        if (widgetInnerContainer) {
          widgetInnerContainer.innerHTML = '';
        }
        
        while (container.current.firstChild && container.current.firstChild !== widgetInnerContainer) {
            if(container.current.firstChild.nodeName !== "SCRIPT"){ 
                 container.current.removeChild(container.current.firstChild);
            } else if (container.current.firstChild.nodeName === "SCRIPT" && !scriptElement) {
                
                 container.current.removeChild(container.current.firstChild);
            } else {
                break; 
            }
        }

        scriptAdded.current = false;
      }
    };
  }, []);

  return (
    <div 
      className="tradingview-widget-container w-full" // Ensured w-full, removed inline style for height
      ref={container} 
    > 
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright" style={{textAlign: 'center', fontSize: '0.75rem', paddingTop: '8px'}}>
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span style={{color: 'hsl(var(--primary))'}}>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewAdvancedChartWidget);

