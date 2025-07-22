

export interface QuestionFragment {
  "q-idx": number;
  "q-str": string;
  "a-tp": string;
  checkboxes?: string[];
  radios?: string[];
}

export interface QuestionCheckbox extends QuestionFragment{
  "q-idx": number;
  "q-str": string;
  "a-tp": string;
  checkboxes: string[];
}

export interface QuestionRadio extends QuestionFragment {
  "q-idx": number;
  "q-str": string;
  "a-tp": string;
  radios: string[];
}

export type Status = "abolished" | "in-use" | "draft";

export class QsWithVer {

  private verify = () => {
    const tmp: number[] = [];
    this.questionSet.forEach(q => {
      if (tmp.includes(q.version)) {
        console.error("Duplicate version found in questionSet");
        return false;
      }
      tmp.push(q.version);
    });
    if (this.questionSet.filter(q => q.status === "in-use").length != 1){
      console.error("There must be exactly one question set in-use");
      return false;
    }
    return true;
  };

  public getQuizCurrInUse = (): (QuestionCheckbox | QuestionRadio)[] => {
    if (!this.verify()) {
      return [];
    }
    return this.questionSet.filter(q => q.status === "in-use")[0].questions;
  };

  public getVerCurrInUse = (): number => {
    if (!this.verify()) {
      return -1;
    }
    return this.questionSet.filter(q => q.status === "in-use")[0].version;
  };

  public getQuizByVersion = (_ver: number): (QuestionCheckbox | QuestionRadio)[] => {
    if (!this.verify()) {
      return [];
    }
    return this.questionSet.filter(q => q.version === _ver)[0] ?
      this.questionSet.filter(q => q.version === _ver)[0].questions :
      [];
  };

  private questionSet: {
    version: number; // must be an Integer and cannot repeat
    status:Status;
    questions: (QuestionCheckbox | QuestionRadio)[];
  }[] = [
    {
      version: 1,
      status: "in-use",
      questions:[
        {
          "q-idx": 1,
          "q-str": "Have you been diagnosed with any of the following ongoing health conditions? (Select all that apply)",
          "a-tp": "checkbox",
          "checkboxes": ["Diabetes", "Heart disease", "Stroke or TIA", "Cancer", "Chronic lung disease (e.g., COPD, asthma)", "Dementia or memory problems", "None of the above"]
        },
        {"q-idx": 2, "q-str": "Have you visited the emergency room or been hospitalized in the past 6 months?", "a-tp": "radio", "radios": ["Yes", "No"]},
        {"q-idx": 3, "q-str": "Are you currently taking 5 or more prescription medications daily?", "a-tp": "radio", "radios": ["Yes", "No", "I’m not sure"]},
        {"q-idx": 4, "q-str": "How often do you experience pain that limits your daily activities?", "a-tp": "radio", "radios": ["Never", "Occasionally", "Frequently", "Always", "Shape"]},
        {"q-idx": 5, "q-str": "Do you use any mobility aids? (Select all that apply)", "a-tp": "checkbox", "checkboxes": ["Cane or walking stick", "Walker or rollator", "Wheelchair", "None"]},
        {"q-idx": 6, "q-str": "Can you safely move from bed to chair without assistance?", "a-tp": "radio", "radios": ["Yes, independently", "Yes, with some help", "No, I need full assistance"]},
        {"q-idx": 7, "q-str": "Which best describes your ability to bathe or shower?", "a-tp": "radio", "radios": ["I can do it independently", "I need some help", "I need full assistance"]},
        {"q-idx": 8, "q-str": "Do you prepare your own meals regularly?", "a-tp": "radio", "radios": ["Yes", "Sometimes", "No"]},
        {
          "q-idx": 9,
          "q-str": "Do you manage your medications on your own (e.g., remembering when and how much to take)?",
          "a-tp": "radio",
          "radios": ["Yes", "With reminders or a pill organizer", "Someone else manages it for me", "Shape"]
        },
        {"q-idx": 10, "q-str": "In the past week, have you had difficulty remembering things like appointments or names?", "a-tp": "radio", "radios": ["Yes", "No"]},
        {"q-idx": 11, "q-str": "Do you often feel confused or disoriented (e.g., not knowing where you are or what day it is)?", "a-tp": "radio", "radios": ["Never", "Occasionally", "Often"]},
        {"q-idx": 12, "q-str": "Have you been feeling sad, down, or hopeless most days in the last 2 weeks?", "a-tp": "radio", "radios": ["Yes", "No"]},
        {"q-idx": 13, "q-str": "Have others expressed concern about changes in your behavior or memory?", "a-tp": "radio", "radios": ["Yes", "No", "Not sure", "Shape"]},
        {"q-idx": 14, "q-str": "Do you live alone?", "a-tp": "radio", "radios": ["Yes", "No"]},
        {"q-idx": 15, "q-str": "Is there someone available to help you regularly if needed (e.g., family, friend, caregiver)?", "a-tp": "radio", "radios": ["Yes", "No", "Occasionally"]},
        {"q-idx": 16, "q-str": "Do you feel safe in your current living environment?", "a-tp": "radio", "radios": ["Yes", "No"]},
        {"q-idx": 17, "q-str": "How often do you feel lonely or isolated?", "a-tp": "radio", "radios": ["Never", "Sometimes", "Often", "Always", "Shape"]},
        {"q-idx": 18, "q-str": "Do you have someone legally appointed to make healthcare decisions on your behalf if needed (e.g., Power of Attorney)?", "a-tp": "radio", "radios": ["Yes", "No", "I’m not sure"]},
        {"q-idx": 19, "q-str": "Have you created an advance care plan or written down your care preferences (e.g., resuscitation, place of care)?", "a-tp": "radio", "radios": ["Yes", "No", "I plan to"]},
        {"q-idx": 20, "q-str": "Are you currently able to afford support services (e.g., home care, private caregiver) if required?", "a-tp": "radio", "radios": ["Yes", "No", "Unsure"]}
      ]
    },
    // add more of --> {version: 99, status: "draft", questions: []},
  ];
}
