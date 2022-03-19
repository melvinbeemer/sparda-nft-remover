import BigNumber from "bignumber.js";
import { map, active } from "./currencies";

export const toBigNumber = (inputNumber: BigNumber | number | string = 0, opts: MoneyFormatterOptions = {}): BigNumber => {
  if (typeof inputNumber === "string") inputNumber = Number(inputNumber);
  if (typeof inputNumber === "number") {
    if (isNaN(inputNumber) || !isFinite(inputNumber))
      return new BigNumber(0)
  }
  let number = new BigNumber(inputNumber);
  if (isNaN(number.toNumber())) number = new BigNumber(0);
  let { currency, symbol, compression = 0, decPlaces, maxFractionDigits = 2, showCurrency = false } = opts;

  if (decPlaces === undefined)
    decPlaces = maxFractionDigits || 0;

  if (currency && !compression) {
    const defaultCurrency = active();
    const currencies = map();
    const currencyData = currencies[currency] || currencies[defaultCurrency];
    compression = currencyData.compression;
    symbol = currencyData.symbol;
  }
  number = number.shiftedBy(-compression);
  return number
}