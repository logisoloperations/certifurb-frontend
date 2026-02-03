"use client";

import { createContext, useContext } from "react";
import { useCurrency } from "./CurrencyContext";

const CountryContext = createContext();

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};

const codeToName = (code) => {
  switch ((code || "").toUpperCase()) {
    case "PK":
      return "Pakistan";
    case "US":
      return "United States";
    case "AE":
    case "UAE":
      return "United Arab Emirates";
    default:
      return "Pakistan";
  }
};

const nameToCode = (name) => {
  switch (name) {
    case "Pakistan":
      return "PK";
    case "United States":
      return "US";
    case "United Arab Emirates":
      return "UAE";
    default:
      return "PK";
  }
};

export const CountryProvider = ({ children }) => {
  // Bridge to the unified currency context (IP detection + live exchange rates)
  const {
    selectedCountry,
    setSelectedCountry,
    convertPrice,
    exchangeRates,
  } = useCurrency();

  const currencies = {
    PK: { code: "PKR", symbol: "₨", name: "Pakistan", flag: "/pakistan-20.png" },
    US: { code: "USD", symbol: "$", name: "USA", flag: "/usa-20.png" },
    UAE: { code: "AED", symbol: "د.إ", name: "United Arab Emirates", flag: "/uae-20.png" },
  };

  const country = nameToCode(selectedCountry);
  const changeCountry = (newCode) => setSelectedCountry(codeToName(newCode));
  const getCurrency = () => currencies[country];

  // convertPrice here expects PKR input (same as CurrencyContext)
  const value = {
    country,
    changeCountry,
    convertPrice,
    getCurrency,
    currencies,
    exchangeRates,
    isLoading: false,
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
};
