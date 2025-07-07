
// import { isAuthenticated } from "@/utils/amplify-server-utils";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dbConn } from "./dynamoConfig";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

/**
 *   "firstName": "Kenji",
 *   "lastName": "Yamamoto",
 *   "title": "Live-in Caregiver",
 *   "location": "Calgary, AB",
 *   "experience": 32,
 *   "testimonials": {}, <---- ??
 *   "languages": {}, <------- ??
 *   "hourlyRate": 36,
 *   "services": {}, <-------- ??
 *   "imageSrc": "/images/home/meet-providers/person-placeholder-2.png",
 * */

export interface Provider {
  lastName: string;
  firstName: string;
  title: string;
  location: string;
  experience: number;
  testimonials: number[];
  languages: string[];
  services: string[];
  hourlyRate: number;
  imageSrc: string;
}

/**
 *       `language:${  languagePreference  }\r\n` +
 *       `availability:${  availability  }\r\n` +
 *       `experience:${  experience  }\r\n` +
 *       `specialty:${  specialty  }\r\n` +
 *       `minPrice:${  minPrice  }\r\n` +
 *       `maxPrice:${  maxPrice}`);
 * */

export const fetchProviders = async (
  language: string[],
  availability: string[],
  experience: number,
  specialty: string[],
  minPrice: number,
  maxPrice: number,
  searchKey: string[]
): Promise<Provider[]> => {

  const providers: Provider[] = [];
  console.info("searchKey: ", searchKey.join(",") );

  try {
    const params = {
      ExpressionAttributeValues: {
        // ":searchKey1": {S: "Kenji"},
        // ":language1": {S: "English"}, // to-do: get dynamic languages conditions based on the input array.
        // ":availability1": {S: "2025:32:3:12"}, // to-do: get dynamic language conditions based on the input array. AND add attr (as string[]) to the item
        // ":specialty1": {S: "Personal Care"}, // to-do: get dynamic specialty conditions based on the input array.
        ":experience": {N: experience.toString()},
        ":minPrice": {N: minPrice.toString()},
        ":maxPrice": {N: maxPrice.toString()},
      },
      KeyConditionExpression: "",
      FilterExpression:
        // " contains (firstName, :searchKey1) " +
        // " AND ( contains (languages, :language1) OR contains (languages, :language1) )" +
        // " AND ( contains (availability, :availability1) OR contains (availability, :availability1) ) " +
        // " AND ( contains (services, :specialty1) OR contains (services, :specialty1) ) " +
        " experience >= :experience " +
        " AND (hourlyRate BETWEEN :minPrice and :maxPrice) " +
        "",
      TableName: "helloTableName",
    };

    const tmpCondition: string[] = [];
    searchKey.map((sk, i) => {
      params.ExpressionAttributeValues[`:searchKey${i}`] = {S: sk};
      tmpCondition.push(` contains (firstName, :searchKey${i}) OR contains (lastName, :searchKey${i}) `);
    });
    if (tmpCondition.length > 0) {params.FilterExpression += ` AND ( ${tmpCondition.join(" OR ")} ) `;}

    tmpCondition.length = 0;
    language.map((lang, i) => {
      params.ExpressionAttributeValues[`:language${i}`] = {S: lang};
      tmpCondition.push(` contains (languages, :language${i}) `);
    });
    if (tmpCondition.length > 0) {params.FilterExpression += ` AND ( ${tmpCondition.join(" OR ")} ) `;}

    tmpCondition.length = 0;
    availability.map((avail, i) => {
      params.ExpressionAttributeValues[`:availability${i}`] = {S: avail};
      tmpCondition.push(` contains (availability, :availability${i}) `);
    });
    if (tmpCondition.length > 0) {params.FilterExpression += ` AND ( ${tmpCondition.join(" OR ")} ) `;}

    tmpCondition.length = 0;
    specialty.map((spec, i) => {
      params.ExpressionAttributeValues[`:specialty${i}`] = {S: spec};
      tmpCondition.push(` contains (specialty, :specialty${i}) `);
    });
    if (tmpCondition.length > 0) {params.FilterExpression += ` AND ( ${tmpCondition.join(" OR ")} ) `;}

    // console.info("params: ", params);

    const response = await dbConn.send(new ScanCommand(params));

    if (response.Items) {
      response.Items.map((item) => {
        providers.push(<Provider>unmarshall(item));
      });
    }
  } catch (error) {
    console.error("error", error);
  }
  return providers;
};
