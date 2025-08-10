import { DynamoClient } from "./dynamoConfig";

export interface Provider {
  lastName: string;
  firstName: string;
  title: string;
  location: string;
  experience: string;
  languages: string[];
  services: string[];
  hourlyRate: number;
  imageSrc: string;
}

export const fetchProviders = async (
  languageItems: string[],
  availabilityItems: string[],
  experience: { min: number; max: number }, // <-- CHANGED to object
  specialtyItems: string[],
  minPrice: number,
  maxPrice: number,
  searchNameKeys: string[]
): Promise<Provider[]> => {
  const providers: Provider[] = [];
  console.info("searchKey: ", searchNameKeys.join(","));

  try {
    const attrFilter = { filter: { and: [] } };

    // Experience filter as a range
    attrFilter.filter.and.push({
      yearExperienceFloat: { between: [experience.min, experience.max] },
    });

    // Price range filter
    attrFilter.filter.and.push({
      askingRate: { between: [minPrice, maxPrice] },
    });

    const nameCondAnd = { and: [] };
    const langCondOr = { or: [] };
    const availCondAnd = { and: [] };
    const specCondAnd = { and: [] };

    // Name search
    searchNameKeys.forEach((sk) => {
      nameCondAnd.and.push({
        or: [
          { firstNameLower: { contains: sk } },
          { lastNameLower: { contains: sk } },
        ],
      });
    });

    // Languages filter
    languageItems.forEach((lang) => {
      langCondOr.or.push({ languages: { contains: lang } });
    });

    // Availability filter
    availabilityItems.forEach((avail) => {
      availCondAnd.and.push({ availability: { contains: avail } });
    });

    // Specialty filter
    specialtyItems.forEach((spec) => {
      specCondAnd.and.push({ servicesOffered: { contains: spec } });
    });

    if (nameCondAnd.and.length > 0) attrFilter.filter.and.push(nameCondAnd);
    if (langCondOr.or.length > 0) attrFilter.filter.and.push(langCondOr);
    if (availCondAnd.and.length > 0) attrFilter.filter.and.push(availCondAnd);
    if (specCondAnd.and.length > 0) attrFilter.filter.and.push(specCondAnd);

    console.info("attrFilter: ", attrFilter);

    const response = await DynamoClient.models.ProviderProfile.list(attrFilter);

    if (response.data) {
      response.data.forEach((item) => {
        console.info("-=> item: ", item.id);
        providers.push({
          lastName: item.lastName,
          firstName: item.firstName,
          title: item.profileTitle,
          location: `${item.city}, ${item.province}`,
          experience: item.yearsExperience,
          languages: item.languages,
          services: item.servicesOffered,
          hourlyRate: item.askingRate,
          imageSrc: item.profilePhoto,
        });
      });
    }
  } catch (error) {
    console.error("error", error);
  }

  return providers;
};
