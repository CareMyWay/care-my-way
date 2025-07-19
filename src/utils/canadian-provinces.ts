import countryRegionData from "country-region-data/dist/data-umd";

export const getCanadianProvinces = () => {
  const canada = countryRegionData.find(
    (country) => country.countryName === "Canada"
  );

  if (!canada || !Array.isArray(canada.regions)) return [];

  return canada.regions.map((region) => ({
    name: region.name,
    shortCode: region.shortCode,
  }));
};
