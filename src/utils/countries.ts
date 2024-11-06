import { getData } from 'country-list';

export interface CountryOption {
  value: string;
  label: string;
}

export const countryOptions: CountryOption[] = getData().map((country) => ({
  value: country.code,
  label: country.name,
}));
