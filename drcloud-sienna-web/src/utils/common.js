import { CurrencyUnitEnum } from './constants';

export const reverseEnumObject = (obj) => {
  const option = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    option[obj[key]] = key;
  });
  return option;
};

export const handleShowPrice = (price, currencyUnit) => {
  switch (currencyUnit) {
    case CurrencyUnitEnum.VND:
      return `${price}k`;
    default:
      return price;
  }
};

export const enumToSelectOptions = (currentEnum) => {
  const keys = Object.keys(currentEnum);
  return keys.map((el) => ({
    label: el,
    value: currentEnum[el]
  }));
};

export default {};
