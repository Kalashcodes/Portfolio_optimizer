"use client"
import { useState } from "react";
import { cryptocurrencies, commodities, stocks } from "./data/assets";

export default function Home() {
  const [risk, setRisk] = useState();
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [totalRisk, setTotalRisk] = useState();
  const [totalReturn, setTotalReturn] = useState();
  const [bestPerformanceStock, setBestPerformanceStock] = useState();


  function dpPortfolio(stocks, maxRisk) {
    const n = stocks.length;

    const dp = Array.from({ length: n + 1 }, () => Array(maxRisk + 1).fill(0));

    for (let i = 1; i <= n; ++i) {
      for (let j = 1; j <= maxRisk; ++j) {
        if (stocks[i - 1].risk <= j) {
          dp[i][j] = Math.max(
            dp[i - 1][j],
            dp[i - 1][j - stocks[i - 1].risk] + stocks[i - 1].expectedReturn
          );
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    }

    const totalReturn = dp[n][maxRisk];
    console.log(totalReturn);

    let totalRisk = 0;
    const selectedStocks = [];
    let j = maxRisk;

    for (let i = n; i > 0; --i) {
      if (dp[i][j] !== dp[i - 1][j]) {
        selectedStocks.push(stocks[i - 1]);
        totalRisk += stocks[i - 1].risk;
        j -= stocks[i - 1].risk;
      }
    }

    return { selectedStocks, totalReturn, totalRisk };
  }

  const submit = (assetType) => {

    if (!risk) {
      alert("please enter risk percentage");
    }

    let result;

    if (assetType == "stock") {
      result = dpPortfolio(stocks, parseInt(risk));
    } else if (assetType == "comodity") {
      result = dpPortfolio(commodities, parseInt(risk));
    } else if (assetType == "crypto") {
      result = dpPortfolio(cryptocurrencies, parseInt(risk));
    }

    setSelectedStocks(result.selectedStocks);
    setTotalRisk(result.totalRisk);
    setTotalReturn(result.totalReturn);

    let bestStock = result.selectedStocks[0];
    let bestRatio = result.selectedStocks[0].expectedReturn / result.selectedStocks[0].risk;

    for (let i = 1; i < result.selectedStocks.length; i++) {
      const asset = result.selectedStocks[i];
      const ratio = asset.expectedReturn / asset.risk;
      if (ratio > bestRatio) {
        bestStock = asset;
        bestRatio = ratio;
      }
    }

    setBestPerformanceStock(bestStock);

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Stock Portfolio Optimizer</h1>

        <div className="mb-6">
          <label className="block text-gray-700 text-lg mb-2">Enter Maximum Risk Percentage</label>
          <input
            type="number"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="w-full text-center p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter risk percentage"
          />
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => submit("stock")}
            className="bg-blue-600 hover:bg-blue-900 text-white mr-2 px-4 py-2 rounded-lg font-bold"
          >
            Stocks
          </button>
          <button
            onClick={() => submit("comodity")}
            className="bg-blue-600 hover:bg-blue-900 text-white mr-2 px-4 py-2 rounded-lg font-bold"
          >
            Comodity
          </button>
          <button
            onClick={() => submit("crypto")}
            className="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold"
          >
            Crypto
          </button>
        </div>

        {selectedStocks.length > 0 && (
          <div>
            <div className="my-6 text-lg rounded-lg bg-slate-200 py-3 text-gray-800 flex flex-row justify-around">
              <div>
                <p>Best Pick:</p>
                <p className="font-bold">{bestPerformanceStock?.name}</p>
              </div>
              <div>
                <p>Total Return:</p>
                <p className="font-bold">{totalReturn}%</p>
              </div>
              <div>
                <p>Total Risk:</p>
                <p className="font-bold">{totalRisk}%</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Selected Stocks</h2>
            <table className="min-w-full text-black bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Stock Name</th>
                  <th className="py-2 px-4 border-b">Expected annual Return(%)</th>
                  <th className="py-2 px-4 border-b">Risk(%)</th>
                </tr>
              </thead>
              <tbody>
                {selectedStocks.map((stock, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-center">{stock.name}</td>
                    <td className="py-2 px-4 border-b text-center">{stock.expectedReturn}</td>
                    <td className="py-2 px-4 border-b text-center">{stock.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
