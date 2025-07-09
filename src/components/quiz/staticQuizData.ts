
export interface Question {
  "q-idx": number
  "q-str": string
  "a-tp": string
  checkboxes?: string[]
  radios?: string[]
}

export const staticQuizData: Question[] = [
  {
    "q-idx": 1,
    "q-str": "Do you have any past or current medical conditions?",
    "a-tp": "checkbox",
    "checkboxes": [
      "None",
      "Heart disease",
      "Diabetes",
      "Other (please specify):"
    ],
  },
  {
    "q-idx": 2,
    "q-str": "Have you had any previous surgeries or hospitalizations?",
    "a-tp": "radio",
    "radios": [
      "No",
      "Yes (Please provide details including dates and reasons):"
    ]
  },
  {
    "q-idx": 3,
    "q-str": "Do you have any allergies? (Check all that apply and specify the allergen)",
    "a-tp": "checkbox",
    "checkboxes": [
      "No known allergies",
      "Medication allergies:"
    ],
  },
  {"q-idx": 4,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 5,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 6,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 7,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 8,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 9,  "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 10, "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 11, "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]},
  {"q-idx": 12, "q-str": "DUMMY Question.", "a-tp": "checkbox", "checkboxes": ["DUMMY Answer 1", "DUMMY Answer 2"]}
];
