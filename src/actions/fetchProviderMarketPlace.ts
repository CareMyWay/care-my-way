import { DynamoClient } from "./dynamoConfig";
// import { DemoData } from "./DemoData";

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
  experience: number,
  specialtyItems: string[],
  minPrice: number,
  maxPrice: number,
  searchNameKeys: string[]
): Promise<Provider[]> => {
  const providers: Provider[] = [];
  console.info("searchKey: ", searchNameKeys.join(","));

  try {
    // const resultD0 = await DynamoClient.models.ProviderProfile.delete({id: "90add315-05ec-4b83-ab5f-b565934c35d1"}); console.info("-->: ", resultD0);
    // const resultD1 = await DynamoClient.models.ProviderProfile.delete({id: "d65c88d3-4017-416f-8305-c59436ef5ab4"}); console.info("-->: ", resultD1);
    // const resultD2 = await DynamoClient.models.ProviderProfile.delete({id: "71521873-0484-4e52-9d66-d1ed7ded8e10"}); console.info("-->: ", resultD2);
    // const resultD3 = await DynamoClient.models.ProviderProfile.delete({id: "179c9690-1981-4dfe-8191-27faccfc53ba"}); console.info("-->: ", resultD3);
    // const resultD4 = await DynamoClient.models.ProviderProfile.delete({id: "673666fb-1bd8-44a9-96d9-0128d6e5a7c2"}); console.info("-->: ", resultD4);
    // const result0 = await DynamoClient.models.ProviderProfile.create(DemoData[0]);    console.info("-->: ", result0);
    // const result1 = await DynamoClient.models.ProviderProfile.create(DemoData[1]);    console.info("-->: ", result1);
    // const result2 = await DynamoClient.models.ProviderProfile.create(DemoData[2]);    console.info("-->: ", result2);
    // const result3 = await DynamoClient.models.ProviderProfile.create(DemoData[3]);    console.info("-->: ", result3);
    // const result4 = await DynamoClient.models.ProviderProfile.create(DemoData[4]);    console.info("-->: ", result4);

    const attrFilter = { filter: { and: [] } };
    /*
      Filter Demo:
      {
        filter: {
          and: [
            { col_1: { eq: 1 } },
            { col_2: { gt: 2 } },
            { or: [ { col_1: { eq: 1 } }, { col_2: { gt: 2 } } ]} ]
        }
      }
    */

    attrFilter.filter.and.push({ yearExperienceFloat: { gt: experience } });
    attrFilter.filter.and.push({
      askingRate: { between: [minPrice, maxPrice] },
    });

    const nameCondAnd = { and: [] };
    const langCondOr = { or: [] };
    const availCondAnd = { and: [] };
    const specCondAnd = { and: [] };

    searchNameKeys.map((sk) => {
      nameCondAnd.and.push({
        or: [
          { firstNameLower: { contains: sk } },
          { lastNameLower: { contains: sk } },
        ],
      });
    });

    languageItems.map((lang) => {
      langCondOr.or.push({ languages: { contains: lang } });
    });

    availabilityItems.map((avail) => {
      availCondAnd.and.push({ availability: { contains: avail } });
    });

    specialtyItems.map((spec) => {
      specCondAnd.and.push({ servicesOffered: { contains: spec } });
    });

    if (nameCondAnd.and.length > 0) {
      attrFilter.filter.and.push(nameCondAnd);
    }
    if (langCondOr.or.length > 0) {
      attrFilter.filter.and.push(langCondOr);
    }
    if (availCondAnd.and.length > 0) {
      attrFilter.filter.and.push(availCondAnd);
    }
    if (specCondAnd.and.length > 0) {
      attrFilter.filter.and.push(specCondAnd);
    }

    console.info("attrFilter: ", attrFilter);

    const response = await DynamoClient.models.ProviderProfile.list(attrFilter);

    if (response.data) {
      response.data.map((item) => {
        console.info("-=> item: ", item.id);
        providers.push({
          lastName: item.lastName,
          firstName: item.firstName,
          title: item.profileTitle,
          location: item.city.concat(", ").concat(item.province),
          experience: item.yearsExperience,
          languages: item.languages,
          services: item.servicesOffered,
          hourlyRate: item.askingRate, // ?
          imageSrc: item.profilePhoto,
        });
      });
    }
  } catch (error) {
    console.error("error", error);
  }
  return providers;
};
