// Quiz processing and results logic for healthcare assessment

// Define the interfaces for the new structure
export interface ServiceSubcategory {
    name: string;
    description: string;
    services: string[];
    reason: string;
}

export interface ServiceCategory {
    category: string;
    subcategories: ServiceSubcategory[];
}

export interface QuizResults {
    recommendedServices: ServiceCategory[];
    contextFlags: {
    hasMobilityIssue: boolean;
    hasCognitiveIssue: boolean;
    recentHospitalization: boolean;
    multipleMeds: boolean;
    hasChronicConditions: boolean;
    needsPersonalCare: boolean;
    livesAlone: boolean;
    };
}

export interface ProcessedResults {
    services: ServiceCategory[];
    contextFlags: {
    hasMobilityIssue: boolean;
    hasCognitiveIssue: boolean;
    recentHospitalization: boolean;
    multipleMeds: boolean;
    hasChronicConditions: boolean;
    needsPersonalCare: boolean;
    livesAlone: boolean;
    };
}

// Define comprehensive service categories based on your new structure
const SERVICE_CATEGORIES = {
    HOME_CARE: {
        name: "Home Care",
        subcategories: {
            PERSONAL_CARE: {
                name: "Personal Care & Daily Living",
                description: "Assistance with daily personal hygiene and daily living activities",
                services: [
                "Bathing and showering assistance",
                "Dressing and undressing help",
                "Toileting and incontinence care",
                "Eating assistance"
                ]
            },
            MOBILITY: {
                name: "Mobility & Transfers",
                description: "Support with safe movement and positioning",
                services: [
                    "Transfer assistance (bed to chair, toilet)",
                    "Walking support and fall prevention",
                    "Mobility equipment assistance",
                    "Positioning and repositioning"
                ]
            },
            HOMEMAKING: {
                name: "Homemaking",
                description: "Essential household tasks and meal preparation",
                services: [
                "Meal preparation and cooking",
                "Light housekeeping and cleaning",
                "Laundry and linens",
                "Grocery shopping and errands"
                ]
            },
            COMPANIONSHIP: {
                name: "Companionship",
                description: "Social interaction and emotional support",
                services: [
                    "Friendly conversation and social engagement",
                    "Recreational activities and hobbies",
                    "Emotional support and encouragement",
                    "Community outings with assistance"
                ]
            },
            MEDICATION_HEALTH: {
                name: "Medication & Health Checks",
                description: "Non-clinical health support and medication management",
                services: [
                "Medication reminders and organization",
                "Health monitoring (vitals, symptoms)",
                "Appointment coordination",
                "Communication with healthcare providers"
                ]
            },
            DEMENTIA_MEMORY: {
                name: "Dementia & Memory Support",
                description: "Specialized support for cognitive challenges",
                services: [
                "Cognitive stimulation activities",
                "Routine establishment and maintenance",
                "Safety supervision and monitoring",
                "Behavioral support and redirection"
                ]
            },
            RECOVERY: {
                name: "Recovery After Surgery",
                description: "Post-surgical and recovery assistance",
                services: [
                "Post-surgery recovery support",
                "Wound monitoring and care coordination",
                "Activity restriction compliance",
                "Recovery progress tracking"
                ]
            },
            QUICK_CHECKINS: {
                name: "Quick Check-Ins",
                description: "Brief visits for safety and wellbeing monitoring",
                services: [
                "Daily wellness check calls",
                "Brief safety visits",
                "Medication compliance checks",
                "Emergency response coordination"
                ]
            },
            NIGHT_SUPPORT: {
                name: "Night Support",
                description: "Nighttime care and supervision",
                services: [
                "Overnight supervision",
                "Nighttime toileting assistance",
                "Sleep positioning help",
                "Safety monitoring during sleep"
                ]
            },
            APPOINTMENTS: {
                name: "Appointments & Outings",
                description: "Transportation and appointment support",
                services: [
                "Transportation to appointments",
                "Appointment check-in assistance",
                "Medical appointment support",
                "Errands and outings"
                ]
            }
        }
    },
    HOME_NURSING: {
        name: "Home Nursing",
        subcategories: {
            CHEMOTHERAPY: {
                name: "Chemotherapy",
                description: "Specialized cancer treatment at home",
                services: [
                "Chemotherapy administration",
                "Side effect monitoring",
                "Treatment coordination with oncology",
                "Symptom management"
                ]
            },
            BLOOD_TRANSFUSIONS: {
                name: "Blood Transfusions",
                description: "Blood transfusion therapy at home",
                services: [
                "Blood product administration",
                "Transfusion reaction monitoring",
                "IV access management",
                "Post-transfusion care"
                ]
            },
            DIALYSIS: {
                name: "Dialysis",
                description: "Kidney dialysis support and monitoring",
                services: [
                "Dialysis equipment management",
                "Access site care",
                "Fluid balance monitoring",
                "Complication prevention"
                ]
            },
            RESPIRATORY_SUPPORT: {
                name: "Respiratory Support",
                description: "Breathing treatments and respiratory monitoring",
                services: [
                "Oxygen therapy monitoring",
                "Nebulizer treatments",
                "Ventilator management",
                "Airway clearance assistance"
                ]
            },
            WOUND_CARE: {
                name: "Wound & Skin Care",
                description: "Professional wound assessment and treatment",
                services: [
                "Complex wound assessment",
                "Sterile dressing changes",
                "Pressure injury prevention",
                "Healing progress monitoring"
                ]
            },
            CHRONIC_CONDITION: {
                name: "Chronic Condition Support",
                description: "Professional nursing care for ongoing health conditions",
                services: [
                "Disease monitoring and assessment",
                "Symptom management",
                "Care coordination with physicians",
                "Health education and training"
                ]
            },
            MEDICATION_ADMIN: {
                name: "Medication Administration",
                description: "Professional medication management",
                services: [
                "Complex medication administration",
                "Medication monitoring",
                "Side effect assessment",
                "Dosage adjustments coordination"
                ]
            },
            MEDICATION_INJECTION: {
                name: "Medication by injection such as insulin or biologics",
                description: "Injectable medication administration",
                services: [
                "Insulin injections",
                "Biologic medication administration",
                "Injection site monitoring",
                "Technique education"
                ]
            },
            PALLIATIVE_CARE: {
                name: "Palliative Care",
                description: "Comfort-focused care for serious illnesses",
                services: [
                "Pain and symptom management",
                "Comfort care planning",
                "Family support and guidance",
                "Quality of life optimization"
                ]
            },
            END_OF_LIFE: {
                name: "End-of-Life",
                description: "Compassionate end-of-life care",
                services: [
                    "Comfort and dignity maintenance",
                    "Symptom control",
                    "Family support and education",
                    "Spiritual care coordination"
                ]
            },
            SUCTIONING: {
                name: "Suctioning & Tracheostomy",
                description: "Airway management and tracheostomy care",
                services: [
                "Airway suctioning",
                "Tracheostomy care",
                "Equipment maintenance",
                "Emergency airway management"
                ]
            },
            FEEDING_TUBES: {
                name: "Feeding Tubes",
                description: "Enteral nutrition support",
                services: [
                "Tube feeding administration",
                "Feeding tube maintenance",
                "Nutritional monitoring",
                "Complication prevention"
                ]
            },
            OSTOMY_CARE: {
                name: "Ostomy & Stoma Care",
                description: "Specialized ostomy and stoma management",
                services: [
                "Ostomy appliance changes",
                "Stoma assessment",
                "Skin care around stoma",
                "Patient and family education"
                ]
            },
            CATHETER_CARE: {
                name: "Urinary Catheters & Bladder Care",
                description: "Urinary catheter management",
                services: [
                "Catheter maintenance",
                "Bladder irrigation",
                "Infection prevention",
                "Catheter changes"
                ]
            },
            IV_THERAPY: {
                name: "IV Therapy & Vascular Access",
                description: "Intravenous therapy and vascular access care",
                services: [
                "IV medication administration",
                "Central line care",
                "PICC line maintenance",
                "Vascular access monitoring"
                ]
            }
        }
    },
    HOME_THERAPY: {
        name: "Home Therapy",
        subcategories: {
            PHYSIOTHERAPY: {
                name: "Home Physiotherapy",
                description: "Physical rehabilitation and mobility improvement",
                services: [
                "Strength and conditioning exercises",
                "Balance and fall prevention training",
                "Pain management techniques",
                "Gait and mobility training"
                ]
            },
            OCCUPATIONAL_THERAPY: {
                name: "Home Occupational Therapy",
                description: "Daily living skills and home safety",
                services: [
                "Activities of daily living training",
                "Home safety assessments",
                "Adaptive equipment recommendations",
                "Cognitive rehabilitation"
                ]
            },
            SPEECH_THERAPY: {
                name: "Home Speech Therapy",
                description: "Communication and swallowing therapy",
                services: [
                "Speech and language therapy",
                "Swallowing assessment and therapy",
                "Communication device training",
                "Voice therapy"
                ]
            }
        }
    },
    WELLBEING_SUPPORT: {
        name: "Wellbeing and Community Support",
        subcategories: {
            SOCIAL_WORKER: {
                name: "Social Worker in Home",
                description: "Care coordination and resource navigation",
                services: [
                "Care planning and coordination",
                "Resource identification and referrals",
                "Insurance and benefit navigation",
                "Family support and education"
                ]
            },
            MENTAL_HEALTH: {
                name: "Mental Health Support",
                description: "Mental health support and monitoring",
                services: [
                "Mental health assessments",
                "Emotional support and counseling",
                "Crisis intervention",
                "Treatment plan coordination"
                ]
            },
            PSYCHOLOGICAL: {
                name: "Psychological Therapy",
                description: "Professional psychological therapy services",
                services: [
                "Individual therapy sessions",
                "Cognitive behavioral therapy",
                "Trauma and grief counseling",
                "Coping strategies development"
                ]
            },
            ALCOHOL_DRUG: {
                name: "Alcohol/Drug Treatment Program",
                description: "Substance use treatment and support",
                services: [
                "Addiction counseling",
                "Treatment program coordination",
                "Relapse prevention support",
                "Family education and support"
                ]
            }
        }
    }
};


// Helper function to add a service category with reason
function addServiceCategory(
    results: QuizResults,
    categoryKey: keyof typeof SERVICE_CATEGORIES,
    subcategoryKey: string,
    reason: string
) {
    const category = SERVICE_CATEGORIES[categoryKey];
    if (!category) return;

    const subcategory = category.subcategories[subcategoryKey];
    if (!subcategory) return;

    // Add to results
    let categoryResult = results.recommendedServices.find(cat => cat.category === category.name);
    if (!categoryResult) {
        categoryResult = {
            category: category.name,
            subcategories: []
        };
        results.recommendedServices.push(categoryResult);
    }

    // Check if subcategory already exists
    let subcategoryResult = categoryResult.subcategories.find(sub => sub.name === subcategory.name);
    if (!subcategoryResult) {
        subcategoryResult = {
            name: subcategory.name,
            description: subcategory.description,
            services: [...subcategory.services],
            reason: reason
        };
        categoryResult.subcategories.push(subcategoryResult);
    }
    else {
        // Add reason if it's different
        if (!subcategoryResult.reason.includes(reason)) {
            subcategoryResult.reason += `; ${reason}`;
        }
    }
}

function initializeQuizResults(): QuizResults {
    return {
        recommendedServices: [],
        contextFlags: {
            hasChronicConditions: false,
            hasMobilityIssue: false,
            needsPersonalCare: false,
            hasCognitiveIssue: false,
            livesAlone: false,
            recentHospitalization: false,
            multipleMeds: false
        }
    };
}

// Main quiz processing function - updated for new question structure
export function processQuizAnswers(answers: (number | string)[]): QuizResults {
    const results = initializeQuizResults();

    console.log("Raw answers received:", answers);

    // Convert answers to proper format
    const processedAnswers = new Array(21);

    for (let i = 1; i <= 20; i++) {
        let answer = answers[i];
        if (typeof answer === "string") {
            answer = parseInt(answer) || 0;
        }
        processedAnswers[i] = answer || 0;
    }

    console.log("Processed answers:", processedAnswers);

    // Q1: Medical & Health Conditions (multi-select - bitmask)
    const q1Answer = processedAnswers[1] || 0;
    console.log("Q1 Answer (Medical Conditions bitmask):", q1Answer);

    if (q1Answer & 1) { // Active cancer treatment
        addServiceCategory(results, "HOME_NURSING", "CHEMOTHERAPY", "Active cancer treatment requires specialized nursing care");
        results.contextFlags.hasChronicConditions = true;
    }
    if (q1Answer & 2) { // Regular blood transfusions
        addServiceCategory(results, "HOME_NURSING", "BLOOD_TRANSFUSIONS", "Regular blood transfusions require professional nursing");
    }
    if (q1Answer & 4) { // Kidney failure requiring dialysis
        addServiceCategory(results, "HOME_NURSING", "DIALYSIS", "Dialysis requires specialized nursing support");
        results.contextFlags.hasChronicConditions = true;
    }
    if (q1Answer & 8) { // Chronic breathing condition
        addServiceCategory(results, "HOME_NURSING", "RESPIRATORY_SUPPORT", "Breathing conditions need respiratory support");
        results.contextFlags.hasChronicConditions = true;
    }
    if (q1Answer & 16) { // Persistent swallowing difficulty
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Swallowing difficulties require speech therapy");
    }
    if (q1Answer & 32) { // Complex wounds
        addServiceCategory(results, "HOME_NURSING", "WOUND_CARE", "Complex wounds require professional wound care");
    }
    if (q1Answer & 64) { // Recent injury or surgery
        addServiceCategory(results, "HOME_CARE", "RECOVERY", "Recent surgery requires recovery support");
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Post-surgical rehabilitation needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Daily living skills may need retraining");
        results.contextFlags.recentHospitalization = true;
    }
    if (q1Answer & 128) { // Progressive memory changes
        addServiceCategory(results, "HOME_CARE", "DEMENTIA_MEMORY", "Memory changes require specialized support");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Cognitive rehabilitation needed");
        results.contextFlags.hasCognitiveIssue = true;
    }
    if (q1Answer & 256) { // Long-term condition monitoring
        addServiceCategory(results, "HOME_NURSING", "CHRONIC_CONDITION", "Chronic conditions need monitoring");
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Health monitoring and education needed");
        results.contextFlags.hasChronicConditions = true;
    }
    if (q1Answer & 512) { // Serious illness - comfort care
        addServiceCategory(results, "HOME_NURSING", "PALLIATIVE_CARE", "Focus on comfort and symptom management");
    }
    if (q1Answer & 1024) { // End-of-life care needs
        addServiceCategory(results, "HOME_NURSING", "END_OF_LIFE", "End-of-life care support needed");
    }

    // Q2: Medical Equipment & Devices (multi-select - bitmask)
    const q2Answer = processedAnswers[2] || 0;
    console.log("Q2 Answer (Medical Equipment bitmask):", q2Answer);

    if (q2Answer & 1) { // Oxygen equipment or nebulizer
        addServiceCategory(results, "HOME_NURSING", "RESPIRATORY_SUPPORT", "Oxygen equipment requires nursing oversight");
    }
    if (q2Answer & 2) { // Ventilator/respirator
        addServiceCategory(results, "HOME_NURSING", "RESPIRATORY_SUPPORT", "Ventilator care requires specialized nursing");
    }
    if (q2Answer & 4) { // Tracheostomy tube/suction
        addServiceCategory(results, "HOME_NURSING", "SUCTIONING", "Tracheostomy care requires nursing expertise");
    }
    if (q2Answer & 8) { // Feeding tube
        addServiceCategory(results, "HOME_NURSING", "FEEDING_TUBES", "Feeding tube management requires nursing care");
    }
    if (q2Answer & 16) { // Ostomy appliances
        addServiceCategory(results, "HOME_NURSING", "OSTOMY_CARE", "Ostomy care requires specialized nursing");
    }
    if (q2Answer & 32) { // Urinary catheter
        addServiceCategory(results, "HOME_NURSING", "CATHETER_CARE", "Catheter care requires nursing management");
    }
    if (q2Answer & 64) { // IV line
        addServiceCategory(results, "HOME_NURSING", "IV_THERAPY", "IV therapy requires nursing administration");
    }
    if (q2Answer & 128) { // Dialysis equipment
        addServiceCategory(results, "HOME_NURSING", "DIALYSIS", "Home dialysis requires nursing support");
    }
    if (q2Answer & 256) { // Wound-care dressings
        addServiceCategory(results, "HOME_NURSING", "WOUND_CARE", "Regular wound dressing changes needed");
    }
    if (q2Answer & 512) { // Mobility aids
        addServiceCategory(results, "HOME_CARE", "MOBILITY", "Mobility aid assistance needed");
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Mobility training and strengthening");
        results.contextFlags.hasMobilityIssue = true;
    }
    if (q2Answer & 1024) { // Transfer devices
        addServiceCategory(results, "HOME_CARE", "MOBILITY", "Transfer assistance needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Safe transfer techniques training");
        results.contextFlags.hasMobilityIssue = true;
    }
    if (q2Answer & 2048) { // Communication device
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Communication device training needed");
    }
    if (q2Answer & 4096) { // Home monitoring devices
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Health monitoring support needed");
    }

    // Q3: Medications
    const q3Answer = processedAnswers[3];
    console.log("Q3 Answer (Medications):", q3Answer);
    if (q3Answer === 1) { // Need reminders/organizing
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Medication reminders and organization needed");
    }
    else if (q3Answer === 2) { // Need nurse to set up medications
        addServiceCategory(results, "HOME_NURSING", "MEDICATION_ADMIN", "Nursing medication administration needed");
        results.contextFlags.multipleMeds = true;
    }
    else if (q3Answer === 3) { // Need nurse for injections
        addServiceCategory(results, "HOME_NURSING", "MEDICATION_INJECTION", "Injectable medication administration needed");
        results.contextFlags.multipleMeds = true;
    }
    else if (q3Answer === 4) { // Not sure - review needed
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Medication review and education needed");
    }

    // Q4: Therapy - Physiotherapy
    const q4Answer = processedAnswers[4];
    console.log("Q4 Answer (Physiotherapy needs):", q4Answer);
    if (q4Answer === 1) { // Pain/stiffness limits movement
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Pain and stiffness management needed");
    }
    else if (q4Answer === 2) { // Weak/deconditioned
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Strength and endurance training needed");
    }
    else if (q4Answer === 3) { // Dizzy/unsteady
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Balance and vestibular training needed");
    }
    else if (q4Answer === 4) { // Recovery from injury/surgery
        addServiceCategory(results, "HOME_THERAPY", "PHYSIOTHERAPY", "Rehabilitation guidance needed");
    }

    // Q5: Therapy - Occupational Therapy
    const q5Answer = processedAnswers[5];
    console.log("Q5 Answer (Occupational Therapy needs):", q5Answer);
    if (q5Answer === 1) { // Bath/transfers feel risky
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Safety techniques and equipment needed");
    }
    else if (q5Answer === 2) { // Fatigue makes tasks hard
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Energy conservation strategies needed");
    }
    else if (q5Answer === 3) { // Home safety review needed
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Home safety assessment and modifications");
    }
    else if (q5Answer === 4) { // Memory/planning support needed
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Memory and planning support needed");
    }

    // Q6: Therapy - Speech (Swallowing)
    const q6Answer = processedAnswers[6];
    console.log("Q6 Answer (Speech/Swallowing):", q6Answer);
    if (q6Answer === 1) { // Cough with certain textures
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Safe swallowing strategies needed");
    }
    else if (q6Answer === 2) { // Food feels stuck
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Swallowing assessment and planning needed");
    }
    else if (q6Answer === 3) { // Post-illness swallowing harder
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Post-illness swallowing support needed");
    }

    // Q7: Mobility & Daily Living - Mobility
    const q7Answer = processedAnswers[7];
    console.log("Q7 Answer (Mobility help):", q7Answer);
    if (q7Answer === 1) { // Use cane/walker or feel safer with someone
        addServiceCategory(results, "HOME_CARE", "MOBILITY", "Mobility assistance for safety");
        results.contextFlags.hasMobilityIssue = true;
    }
    else if (q7Answer === 2) { // Need hands-on help
        addServiceCategory(results, "HOME_CARE", "MOBILITY", "Hands-on transfer assistance needed");
        results.contextFlags.hasMobilityIssue = true;
    }
    else if (q7Answer === 3) { // Wheelchair or need two people
        addServiceCategory(results, "HOME_CARE", "MOBILITY", "Complex mobility assistance required");
        results.contextFlags.hasMobilityIssue = true;
    }

    // Q8: Appointments
    const q8Answer = processedAnswers[8];
    console.log("Q8 Answer (Appointments):", q8Answer);
    if (q8Answer === 1) { // Ride or check-in help
        addServiceCategory(results, "HOME_CARE", "APPOINTMENTS", "Transportation and check-in assistance");
    }
    else if (q8Answer === 2) { // Support during visit
        addServiceCategory(results, "HOME_CARE", "APPOINTMENTS", "Appointment support and advocacy");
    }
    else if (q8Answer === 3) { // Full escort needed
        addServiceCategory(results, "HOME_CARE", "APPOINTMENTS", "Full appointment escort service");
    }

    // Q9: Personal Care
    const q9Answer = processedAnswers[9];
    console.log("Q9 Answer (Personal Care):", q9Answer);
    if (q9Answer === 2) { // Hands-on help for some tasks
        addServiceCategory(results, "HOME_CARE", "PERSONAL_CARE", "Personal care assistance needed");
        results.contextFlags.needsPersonalCare = true;
    }
    else if (q9Answer === 3) { // Full assistance most days
        addServiceCategory(results, "HOME_CARE", "PERSONAL_CARE", "Comprehensive personal care needed");
        results.contextFlags.needsPersonalCare = true;
    }

    // Q10: Homemaking
    const q10Answer = processedAnswers[10];
    console.log("Q10 Answer (Homemaking):", q10Answer);
    if (q10Answer === 1) { // Some help - occasional support
        addServiceCategory(results, "HOME_CARE", "HOMEMAKING", "Occasional household task assistance");
    }
    else if (q10Answer === 2) { // Frequent help
        addServiceCategory(results, "HOME_CARE", "HOMEMAKING", "Regular household assistance needed");
    }
    else if (q10Answer === 3) { // Regular scheduled help
        addServiceCategory(results, "HOME_CARE", "HOMEMAKING", "Consistent weekly household support");
    }

    // Q11: Night Support
    const q11Answer = processedAnswers[11];
    console.log("Q11 Answer (Night Support):", q11Answer);
    if (q11Answer === 1) { // Sometimes need bathroom help
        addServiceCategory(results, "HOME_CARE", "NIGHT_SUPPORT", "Occasional nighttime assistance needed");
    }
    else if (q11Answer === 2) { // Often need overnight supervision
        addServiceCategory(results, "HOME_CARE", "NIGHT_SUPPORT", "Regular overnight supervision needed");
    }

    // Q12: Memory
    const q12Answer = processedAnswers[12];
    console.log("Q12 Answer (Memory difficulty):", q12Answer);
    if (q12Answer === 0) { // Yes - memory difficulty
        addServiceCategory(results, "HOME_CARE", "DEMENTIA_MEMORY", "Memory support needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Cognitive strategies needed");
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Medication monitoring important");
        results.contextFlags.hasCognitiveIssue = true;
    }

    // Q13: Disorientation
    const q13Answer = processedAnswers[13];
    console.log("Q13 Answer (Disorientation):", q13Answer);
    if (q13Answer === 1) { // Occasionally confused
        addServiceCategory(results, "HOME_CARE", "DEMENTIA_MEMORY", "Confusion monitoring needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Cognitive support strategies");
        addServiceCategory(results, "HOME_CARE", "QUICK_CHECKINS", "Regular check-ins for safety");
        results.contextFlags.hasCognitiveIssue = true;
    } else if (q13Answer === 2) { // Often confused
        addServiceCategory(results, "HOME_CARE", "DEMENTIA_MEMORY", "Comprehensive confusion support");
        addServiceCategory(results, "HOME_CARE", "NIGHT_SUPPORT", "Nighttime supervision needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Cognitive rehabilitation needed");
        results.contextFlags.hasCognitiveIssue = true;
    }

    // Q14: Others concerned about memory/behavior
    const q14Answer = processedAnswers[14];
    console.log("Q14 Answer (Others concerned):", q14Answer);
    if (q14Answer === 0) { // Yes
        addServiceCategory(results, "HOME_CARE", "DEMENTIA_MEMORY", "Behavioral assessment needed");
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Cognitive evaluation needed");
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Health monitoring important");
        results.contextFlags.hasCognitiveIssue = true;
    }
    else if (q14Answer === 2) { // Not sure
        addServiceCategory(results, "HOME_CARE", "QUICK_CHECKINS", "Wellness checks recommended");
        addServiceCategory(results, "HOME_CARE", "MEDICATION_HEALTH", "Health monitoring recommended");
    }

    // Q15: Communication/thinking
    const q15Answer = processedAnswers[15];
    console.log("Q15 Answer (Communication):", q15Answer);
    if (q15Answer === 1) { // Speech unclear or voice tired
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Speech and voice therapy needed");
    }
    else if (q15Answer === 2) { // Lose words or struggle with conversations
        addServiceCategory(results, "HOME_THERAPY", "SPEECH_THERAPY", "Communication strategies needed");
    }
    else if (q15Answer === 3) { // Forget daily task steps
        addServiceCategory(results, "HOME_THERAPY", "OCCUPATIONAL_THERAPY", "Memory and planning support needed");
    }

    // Q16: Mental Health - Presence (skip if answered in Q17)
    const q16Answer = processedAnswers[16];
    console.log("Q16 Answer (Mental Health Presence):", q16Answer);
    // This sets up Q17, no direct services added here

    // Q17: Mental Health - Severity/Impact
    const q17Answer = processedAnswers[17];
    console.log("Q17 Answer (Mental Health Impact):", q17Answer);
    if (q17Answer === 1) { // A little disruption
        addServiceCategory(results, "WELLBEING_SUPPORT", "MENTAL_HEALTH", "Mental health support recommended");
    }
    else if (q17Answer === 2) { // Quite a bit disruption
        addServiceCategory(results, "WELLBEING_SUPPORT", "PSYCHOLOGICAL", "Professional therapy needed");
    } 
    else if (q17Answer === 3) { // Hard to manage most days
        addServiceCategory(results, "WELLBEING_SUPPORT", "PSYCHOLOGICAL", "Intensive therapy support needed");
    }

    // Q18: Social Support
    const q18Answer = processedAnswers[18];
    console.log("Q18 Answer (Social Support):", q18Answer);
    if (q18Answer === 1) { // Friendly conversation/check-ins
        addServiceCategory(results, "HOME_CARE", "COMPANIONSHIP", "Social visits and conversation needed");
    }
    else if (q18Answer === 2) { // Walks, hobbies
        addServiceCategory(results, "HOME_CARE", "COMPANIONSHIP", "Active social engagement needed");
    }
    else if (q18Answer === 3) { // Brief wellness visit
        addServiceCategory(results, "HOME_CARE", "QUICK_CHECKINS", "Brief wellness checks needed");
    }

    // Q19: Alcohol Support
    const q19Answer = processedAnswers[19];
    console.log("Q19 Answer (Alcohol Support):", q19Answer);
    if (q19Answer === 1) { // Maybe - information/plan
        addServiceCategory(results, "WELLBEING_SUPPORT", "ALCOHOL_DRUG", "Alcohol treatment information needed");
    }
    else if (q19Answer === 2) { // Yes - want help getting started
        addServiceCategory(results, "WELLBEING_SUPPORT", "ALCOHOL_DRUG", "Alcohol treatment program needed");
        addServiceCategory(results, "WELLBEING_SUPPORT", "SOCIAL_WORKER", "Coordinated substance use support");
    }

    // Q20: Financial & Care Planning
    const q20Answer = processedAnswers[20];
    console.log("Q20 Answer (Social Worker):", q20Answer);
    if (q20Answer === 1) { // Help with paperwork/resources
        addServiceCategory(results, "WELLBEING_SUPPORT", "SOCIAL_WORKER", "Paperwork and resource assistance");
    }
    else if (q20Answer === 2) { // Help coordinating care
        addServiceCategory(results, "WELLBEING_SUPPORT", "SOCIAL_WORKER", "Care coordination assistance");
    }

    return results;
}

// Process results for display with organized categories
export function processResultsForDisplay(results: QuizResults): ProcessedResults {
    return {
        services: results.recommendedServices,
        contextFlags: results.contextFlags
    };
}
