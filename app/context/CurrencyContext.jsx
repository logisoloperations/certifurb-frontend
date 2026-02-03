'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [exchangeRates, setExchangeRates] = useState({
    'Pakistan': { currency: 'PKR', rate: 1, symbol: 'PKR' },
    'United States': { currency: 'USD', rate: 0.0035, symbol: '$' },
    'United Arab Emirates': { currency: 'AED', rate: 0.0129, symbol: 'AED' }
  });

  // Get current currency info
  const getCurrentCurrency = () => {
    return exchangeRates[selectedCountry] || exchangeRates['Pakistan'];
  };

  // Convert price from PKR to selected currency
  const convertPrice = (priceInPKR) => {
    if (!priceInPKR || isNaN(priceInPKR)) return '0';
    
    const currentCurrency = getCurrentCurrency();
    const convertedPrice = priceInPKR * currentCurrency.rate;
    
    // Format based on currency
    switch (currentCurrency.currency) {
      case 'USD':
        return `$${convertedPrice.toFixed(2)}`;
      case 'AED':
        return `AED ${convertedPrice.toFixed(2)}`;
      case 'PKR':
      default:
        return `PKR ${convertedPrice.toLocaleString()}`;
    }
  };

  // Convert price string (e.g., "PKR 1,000") to selected currency
  const convertPriceString = (priceString) => {
    if (!priceString) return '0';
    
    // Extract numeric value from price string
    const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) return '0';
    
    return convertPrice(numericValue);
  };

  // Track initialization to avoid saving default before IP detection runs
  const hasInitializedRef = useRef(false);

  // Helper: Map ISO country code to app country names
  const mapCodeToCountryName = (code) => {
    switch ((code || '').toUpperCase()) {
      case 'PK':
        return 'Pakistan';
      case 'US':
        return 'United States';
      case 'AE':
      case 'UAE':
        return 'United Arab Emirates';
      default:
        return 'Pakistan';
    }
  };

  // Load selected country from localStorage on mount, else detect via IP
  useEffect(() => {
    const initCountry = async () => {
      try {
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry && exchangeRates[savedCountry]) {
          setSelectedCountry(savedCountry);
        }
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detected = mapCodeToCountryName(data && data.country_code);
        if (detected && exchangeRates[detected]) {
          setSelectedCountry(detected);
          localStorage.setItem('selectedCountry', detected);
        }
      } catch (_e) {
        // Silent fallback to default 'Pakistan'
      } finally {
        hasInitializedRef.current = true;
      }
    };
    initCountry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save selected country to localStorage after initialization
  useEffect(() => {
    if (!hasInitializedRef.current) return;
    localStorage.setItem('selectedCountry', selectedCountry);
  }, [selectedCountry]);

  // Fetch real-time exchange rates and compute PKR->USD/AED multipliers
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE;
    const fetchRates = async () => {
      try {
        if (!apiKey) throw new Error('Missing exchange rate API key');
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await res.json();
        if (data && data.conversion_rates) {
          const usdToPkr = data.conversion_rates.PKR;
          const usdToAed = data.conversion_rates.AED;
          const pkrToUsd = usdToPkr ? (1 / usdToPkr) : 0.0035;
          const pkrToAed = (usdToAed && usdToPkr) ? (usdToAed / usdToPkr) : 0.0129;
          setExchangeRates({
            'Pakistan': { currency: 'PKR', rate: 1, symbol: 'PKR' },
            'United States': { currency: 'USD', rate: pkrToUsd, symbol: '$' },
            'United Arab Emirates': { currency: 'AED', rate: pkrToAed, symbol: 'AED' }
          });
        }
      } catch (_e) {
        // Keep fallback rates on failure
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    selectedCountry,
    setSelectedCountry,
    getCurrentCurrency,
    convertPrice,
    convertPriceString,
    exchangeRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 