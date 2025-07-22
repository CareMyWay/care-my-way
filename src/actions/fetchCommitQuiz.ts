import { DynamoClient } from "./dynamoConfig";

export const fetchQuizAnswer = async (_userId: string, _version: number): Promise<string[]> => {

  let answers2Sync: string[] = [];
  try {
    const attrFilter = {
      filter: {
        and: [
          { userId: { eq: _userId } },
          { version: { eq: _version } },
        ],
      },
    };
    const response = await DynamoClient.models.QuizAnswers.list( attrFilter );
    const fallbackResponse = response.data ? response.data[0] : undefined;
    answers2Sync = [fallbackResponse ? fallbackResponse.answers : "empty answers??~!!", fallbackResponse ? fallbackResponse.id : "empty ID??~!!"];
  } catch (error) {
    console.error("error", error);
  }
  return answers2Sync;
};

export const pushQuizAnswer = async (_userId: string, _version: number, _answers: string ) => {

  try {
    fetchQuizAnswer(_userId, _version).then((answers2Sync) => {
      if (answers2Sync[1] === "empty ID??~!!") {
        console.info("empty ID??~!! new record will be created");
        DynamoClient.models.QuizAnswers.create({userId: _userId, version: _version, answers: _answers});
      } else {
        DynamoClient.models.QuizAnswers.update({id: answers2Sync[1], answers: _answers});
      }
    });
  } catch (error) {
    console.error("error", error);
    return false;
  }
  return true;
};
