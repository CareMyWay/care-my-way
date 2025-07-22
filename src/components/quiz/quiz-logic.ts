// Quiz Logic Types and Functions

export interface QuizResults {
  recommendedProviders: Map<string, Set<string>>;
  recommendedServices: Set<string>;
  contextFlags: {
    hasMobilityIssue: boolean;
    hasCognitiveIssue: boolean;
    recentHospitalization: boolean;
    multipleMeds: boolean;
    plansAdvanceCare: boolean;
  };
}

export interface ProcessedResults {
  providers: Array<{
    name: string;
    reason: string;
  }>;
  services: string[];
}

// Provider names
export const PROVIDERS = {
  RN: "Registered Nurse (RN)",
  LPN: "Licensed Practical Nurse (LPN)", 
  HCA: "Health Care Aide / Personal Support Worker (HCA)",
  PT: "Physiotherapist (PT)",
  OT: "Occupational Therapist (OT)",
  DIETITIAN: "Dietitian"
} as const;

// Services list
export const SERVICES = {
  DIABETES_MANAGEMENT: "Diabetes Management",
  MEDICATION_MANAGEMENT: "Medication Management",
  BLOOD_PRESSURE_MONITORING: "Blood Pressure Monitoring",
  CHRONIC_DISEASE_MANAGEMENT: "Chronic Disease Management",
  PHYSICAL_THERAPY_ASSISTANCE: "Physical Therapy Assistance",
  FALL_PREVENTION: "Fall Prevention",
  PALLIATIVE_CARE: "Palliative Care",
  DEMENTIA_CARE: "Dementia & Alzheimer's Care",
  COMPANION_CARE: "Companion Care",
  POST_SURGERY_RECOVERY: "Post-Surgery Recovery",
  MOBILITY_ASSISTANCE: "Mobility Assistance",
  PERSONAL_CARE_ASSISTANCE: "Personal Care Assistance",
  LIGHT_HOUSEKEEPING: "Light Housekeeping",
  MEAL_PREPARATION: "Meal Preparation",
  MENTAL_HEALTH_SUPPORT: "Mental Health Support",
  EMERGENCY_RESPONSE: "Emergency Response",
  RESPITE_CARE: "Respite Care",
  OTHER: "Other Support Services"
} as const;

// Initialize quiz results
export function initializeQuizResults(): QuizResults {
  return {
    recommendedProviders: new Map(),
    recommendedServices: new Set(),
    contextFlags: {
      hasMobilityIssue: false,
      hasCognitiveIssue: false,
      recentHospitalization: false,
      multipleMeds: false,
      plansAdvanceCare: false
    }
  };
}

// Helper function to add provider with reason
function addProvider(results: QuizResults, provider: string, reason: string) {
  if (!results.recommendedProviders.has(provider)) {
    results.recommendedProviders.set(provider, new Set());
  }
  results.recommendedProviders.get(provider)!.add(reason);
}

// Helper function to add service
function addService(results: QuizResults, service: string) {
  results.recommendedServices.add(service);
}

// Main quiz processing function
export function processQuizAnswers(answers: (number | string)[]): QuizResults {
  const results = initializeQuizResults();

  console.log("Raw answers received:", answers);

  // Convert answers to proper format - the answers array is indexed by question number (1-20), not 0-based
  const processedAnswers = new Array(21); // Index 0 will be unused, 1-20 for questions
  
  for (let i = 1; i <= 20; i++) {
    let answer = answers[i];
    if (typeof answer === 'string') {
      answer = parseInt(answer) || 0;
    }
    processedAnswers[i] = answer || 0;
  }

  console.log("Processed answers:", processedAnswers);

  // Q1: Chronic conditions (multi-select - checkbox with bitmask)
  const q1Answer = processedAnswers[1] || 0;
  console.log("Q1 Answer (bitmask):", q1Answer);
  
  if (q1Answer & 1) { // Diabetes (2^0 = 1)
    console.log("Diabetes detected");
    addService(results, SERVICES.DIABETES_MANAGEMENT);
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
  }
  if (q1Answer & 2) { // Heart disease (2^1 = 2)
    console.log("Heart disease detected");
    addService(results, SERVICES.BLOOD_PRESSURE_MONITORING);
    addService(results, SERVICES.CHRONIC_DISEASE_MANAGEMENT);
  }
  if (q1Answer & 4) { // Stroke/TIA (2^2 = 4)
    console.log("Stroke/TIA detected");
    addService(results, SERVICES.PHYSICAL_THERAPY_ASSISTANCE);
    addService(results, SERVICES.FALL_PREVENTION);
    results.contextFlags.hasMobilityIssue = true;
  }
  if (q1Answer & 8) { // Cancer (2^3 = 8)
    console.log("Cancer detected");
    addService(results, SERVICES.PALLIATIVE_CARE);
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
  }
  if (q1Answer & 16) { // Chronic lung disease (2^4 = 16)
    console.log("Chronic lung disease detected");
    addService(results, SERVICES.CHRONIC_DISEASE_MANAGEMENT);
  }
  if (q1Answer & 32) { // Dementia/memory problems (2^5 = 32)
    console.log("Dementia/memory problems detected");
    addService(results, SERVICES.DEMENTIA_CARE);
    addService(results, SERVICES.COMPANION_CARE);
    results.contextFlags.hasCognitiveIssue = true;
  }

  // Q2: Hospital/ER past 6 months
  const q2Answer = processedAnswers[2];
  console.log("Q2 Answer:", q2Answer);
  if (q2Answer === 0) { // Yes (first option)
    console.log("Recent hospitalization detected");
    addProvider(results, PROVIDERS.RN, "recent acute event requires professional oversight");
    addProvider(results, PROVIDERS.LPN, "follow-up monitoring");
    addService(results, SERVICES.POST_SURGERY_RECOVERY);
    results.contextFlags.recentHospitalization = true;
  }

  // Q3: 5+ prescriptions
  const q3Answer = processedAnswers[3];
  console.log("Q3 Answer:", q3Answer);
  if (q3Answer === 0) { // Yes (first option)
    console.log("5+ medications detected");
    addProvider(results, PROVIDERS.LPN, "routine administration");
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
    results.contextFlags.multipleMeds = true;
  } else if (q3Answer === 2) { // Unsure (third option)
    console.log("Unsure about medications");
    addProvider(results, PROVIDERS.LPN, "help organizing medications");
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
  }

  // Q4: Pain limits activities
  const q4Answer = processedAnswers[4];
  console.log("Q4 Answer:", q4Answer);
  if (q4Answer === 1) { // Occasionally
    console.log("Occasional pain limiting activities detected");
    addProvider(results, PROVIDERS.HCA, "assistance during painful episodes");
    addService(results, SERVICES.PHYSICAL_THERAPY_ASSISTANCE);
  } else if (q4Answer === 2 || q4Answer === 3) { // Frequently or Always
    console.log("Frequent/Always pain limiting activities detected");
    addProvider(results, PROVIDERS.PT, "pain affecting function needs therapeutic exercise");
    addService(results, SERVICES.PHYSICAL_THERAPY_ASSISTANCE);
  }

  // Q5: Mobility aids
  const q5Answer = processedAnswers[5];
  console.log("Q5 Answer:", q5Answer);
  if (q5Answer > 0) { // Any except None
    console.log("Mobility aids detected");
    addProvider(results, PROVIDERS.PT, "mobility aid use—optimize strength/balance");
    addProvider(results, PROVIDERS.HCA, "hands‑on support with transfers");
    addService(results, SERVICES.MOBILITY_ASSISTANCE);
    results.contextFlags.hasMobilityIssue = true;
    
    if (q5Answer === 2) { // Wheelchair option (likely third option)
      addService(results, SERVICES.PERSONAL_CARE_ASSISTANCE);
    } else {
      // Only add fall prevention if NOT wheelchair
      addService(results, SERVICES.FALL_PREVENTION);
    }
  }

  // Q6: Transfer ability
  const q6Answer = processedAnswers[6];
  console.log("Q6 Answer:", q6Answer);
  if (q6Answer === 1) { // Some help
    console.log("Some help with transfers detected");
    addProvider(results, PROVIDERS.HCA, "assist with safe transfers");
    addService(results, SERVICES.MOBILITY_ASSISTANCE);
    addService(results, SERVICES.PERSONAL_CARE_ASSISTANCE);
  } else if (q6Answer === 2) { // Full assistance
    console.log("Full assistance with transfers detected");
    addProvider(results, PROVIDERS.HCA, "assist with safe transfers");
    addService(results, SERVICES.MOBILITY_ASSISTANCE);
    addService(results, SERVICES.PERSONAL_CARE_ASSISTANCE);
  }
  // Q6 option 0 (Yes, independently) should not add any providers or services

  // Q7: Bathing/Showering
  const q7Answer = processedAnswers[7];
  console.log("Q7 Answer:", q7Answer);
  if (q7Answer > 0) { // Needs help
    console.log("Bathing assistance needed");
    addProvider(results, PROVIDERS.HCA, "support with personal hygiene");
    addService(results, SERVICES.PERSONAL_CARE_ASSISTANCE);
    if (q7Answer === 2) { // Full assistance
      addService(results, SERVICES.LIGHT_HOUSEKEEPING);
    }
  }

  // Q8: Meal preparation
  const q8Answer = processedAnswers[8];
  console.log("Q8 Answer:", q8Answer);
  if (q8Answer === 1) { // Sometimes
    console.log("Sometimes needs meal help");
    addProvider(results, PROVIDERS.HCA, "support with meals");
    addService(results, SERVICES.MEAL_PREPARATION);
  } else if (q8Answer === 2) { // No
    console.log("Cannot prepare meals");
    addProvider(results, PROVIDERS.HCA, "support with meals");
    addService(results, SERVICES.MEAL_PREPARATION);
    addService(results, SERVICES.LIGHT_HOUSEKEEPING);
  }

  // Q9: Medication self-management
  const q9Answer = processedAnswers[9];
  console.log("Q9 Answer:", q9Answer);
  if (q9Answer === 1) { // With reminders
    console.log("Needs medication reminders");
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
  } else if (q9Answer === 2) { // Someone else manages
    console.log("Someone else manages medications");
    addProvider(results, PROVIDERS.LPN, "daily administration");
    addService(results, SERVICES.MEDICATION_MANAGEMENT);
  }

  // Q10: Memory difficulty
  const q10Answer = processedAnswers[10];
  console.log("Q10 Answer:", q10Answer);
  if (q10Answer === 0) { // Yes (first option)
    console.log("Memory difficulty detected");
    addProvider(results, PROVIDERS.RN, "evaluate cognitive decline");
    addProvider(results, PROVIDERS.HCA, "day‑to‑day supervision");
    addService(results, SERVICES.DEMENTIA_CARE);
    addService(results, SERVICES.COMPANION_CARE);
    results.contextFlags.hasCognitiveIssue = true;
  }

  // Q11: Confusion/disorientation
  const q11Answer = processedAnswers[11];
  console.log("Q11 Answer:", q11Answer);
  if (q11Answer === 1) { // Occasionally
    console.log("Occasional confusion detected");
    addProvider(results, PROVIDERS.RN, "monitor confusion episodes");
    addService(results, SERVICES.DEMENTIA_CARE);
    results.contextFlags.hasCognitiveIssue = true;
  } else if (q11Answer === 2) { // Often
    console.log("Frequent confusion detected");
    addProvider(results, PROVIDERS.RN, "monitor confusion episodes");
    addProvider(results, PROVIDERS.HCA, "close supervision");
    addService(results, SERVICES.DEMENTIA_CARE);
    results.contextFlags.hasCognitiveIssue = true;
  }

  // Q12: Feeling sad/down
  const q12Answer = processedAnswers[12];
  console.log("Q12 Answer:", q12Answer);
  if (q12Answer === 0) { // Yes (first option)
    console.log("Depression/sadness detected");
    addService(results, SERVICES.MENTAL_HEALTH_SUPPORT);
    addService(results, SERVICES.COMPANION_CARE);
  }

  // Q13: Others concerned about memory/behavior
  const q13Answer = processedAnswers[13];
  console.log("Q13 Answer:", q13Answer);
  if (q13Answer === 0 || q13Answer === 2) { // Yes or Not sure
    console.log("Others concerned about memory/behavior");
    addProvider(results, PROVIDERS.RN, "formal assessment");
    addProvider(results, PROVIDERS.HCA, "supportive supervision");
    addService(results, SERVICES.DEMENTIA_CARE);
    results.contextFlags.hasCognitiveIssue = true;
  }

  // Q14: Live alone
  const q14Answer = processedAnswers[14];
  console.log("Q14 Answer:", q14Answer);
  if (q14Answer === 0) { // Yes (first option)
    console.log("Lives alone detected");
    addService(results, SERVICES.COMPANION_CARE);
  }

  // Q15: Regular help available
  const q15Answer = processedAnswers[15];
  console.log("Q15 Answer:", q15Answer);
  if (q15Answer === 1) { // No (second option)
    console.log("No regular help available");
    addProvider(results, PROVIDERS.HCA, "primary daily support");
    addService(results, SERVICES.COMPANION_CARE);
  } else if (q15Answer === 2) { // Occasionally (third option)
    console.log("Occasional help available");
    addService(results, SERVICES.RESPITE_CARE);
  }

  // Q16: Feel safe
  const q16Answer = processedAnswers[16];
  console.log("Q16 Answer:", q16Answer);
  if (q16Answer === 1) { // No (second option)
    console.log("Safety concerns detected");
    addService(results, SERVICES.FALL_PREVENTION);
    addService(results, SERVICES.EMERGENCY_RESPONSE);
    if (results.contextFlags.hasMobilityIssue) {
      addProvider(results, PROVIDERS.PT, "reduce fall risk at home");
    }
  }

  // Q17: Loneliness
  const q17Answer = processedAnswers[17];
  console.log("Q17 Answer:", q17Answer);
  if (q17Answer === 1) { // Sometimes
    console.log("Sometimes lonely");
    addService(results, SERVICES.COMPANION_CARE);
  } else if (q17Answer === 2 || q17Answer === 3) { 
    console.log("Often/Always lonely");
    addService(results, SERVICES.COMPANION_CARE);
    addService(results, SERVICES.MENTAL_HEALTH_SUPPORT);
  }

  // Q18: Legal decision maker
  const q18Answer = processedAnswers[18];
  console.log("Q18 Answer:", q18Answer);

  // Q19: Advance care plan
  const q19Answer = processedAnswers[19];
  console.log("Q19 Answer:", q19Answer);
  if (q19Answer === 0 || q19Answer === 2) { // Yes / I plan to
    console.log("Has advance care plan or planning to");
    addProvider(results, PROVIDERS.RN, "advance care planning guidance");
  }
  

  // Q20: Ability to afford services
  const q20Answer = processedAnswers[20];
  console.log("Q20 Answer:", q20Answer);
  if (q20Answer === 1 || q20Answer === 2) { // No / Unsure
    console.log("Cannot afford services or unsure");
    addService(results, SERVICES.OTHER);
  }

  return results;
}

// Process final results with combined reasoning
export function processResultsForDisplay(results: QuizResults): ProcessedResults {
  const providers: Array<{ name: string; reason: string }> = [];
  
  // Combine reason fragments for each provider
  results.recommendedProviders.forEach((reasonFragments, providerName) => {
    const reasonsArray = Array.from(reasonFragments);
    let combinedReason = "";
    
  
    if (providerName === PROVIDERS.RN) {
      const hasHospital = reasonsArray.some(r => r.includes("recent acute event"));
      const hasMeds = reasonsArray.some(r => r.includes("medication"));
      const hasCognitive = reasonsArray.some(r => r.includes("cognitive") || r.includes("confusion"));
      
      if (hasHospital && hasMeds) {
        combinedReason = "Recent hospitalization and multiple medications require clinical monitoring and complex care oversight.";
      } else if (hasCognitive) {
        combinedReason = "Cognitive changes and safety concerns require professional assessment and monitoring.";
      } else {
        combinedReason = reasonsArray.join(", ") + ".";
      }
    } else if (providerName === PROVIDERS.LPN) {
      combinedReason = "Routine medication organization and regular vital sign monitoring.";
    } else if (providerName === PROVIDERS.HCA) {
      combinedReason = "Assistance needed with personal care, meals, and safe transfers.";
    } else if (providerName === PROVIDERS.PT) {
      combinedReason = "Mobility aids, pain, or fall risk indicate need for exercise therapy and balance improvement.";
    } else if (providerName === PROVIDERS.OT) {
      combinedReason = "Stroke or difficulty with daily tasks requires adaptive techniques and equipment training.";
    } else if (providerName === PROVIDERS.DIETITIAN) {
      combinedReason = "Diabetes or nutrition concerns need individualized meal planning.";
    } else {
      combinedReason = reasonsArray.join(", ") + ".";
    }
    
    providers.push({
      name: providerName,
      reason: combinedReason
    });
  });

  return {
    providers,
    services: Array.from(results.recommendedServices).sort()
  };
}
