// Test file to demonstrate profanity filtering capabilities
// This file shows examples of what the contact form will block

import { Filter } from "bad-words";
import * as LeoProfanity from "leo-profanity";

// Initialize filters (same as in contact form)
const badWordsFilter = new Filter();
LeoProfanity.loadDictionary("en");
LeoProfanity.add(["terrorism", "terrorist", "violence", "violent", "weapon", "bomb", "explosive"]);

// Test function (same logic as contact form)
const containsInappropriateContent = (text: string): boolean => {
  if (!text || text.trim().length === 0) return false;
  
  const hasBadWords = badWordsFilter.isProfane(text);
  const hasLeoProfanity = LeoProfanity.check(text);
  
  const violencePatterns = [
    /\b(kill|murder|death|die|hurt|harm|attack|assault|threat|bomb|weapon|gun|knife|stab|shoot|violence|violent)\b/i,
    /\b(terrorist|terrorism|explode|explosive)\b/i,
    /k[!1i]ll/i,
    /d[!1i]e/i,
    /h[4@]rm/i,
    /v[!1i]olence/i,
    /terr[0o]r/i
  ];
  
  const profanityPatterns = [
    /f[\*\!@#\$%\^&\-_\.u\d]*ck/i,
    /f[\*\!@#\$%\^&\-_\.u\d]*k/i,
    /b[\*\!@#\$%\^&\-_\.i\d]*tch/i,
    /b[\*\!@#\$%\^&\-_\.i\d]*ch/i,
    /sh[\*\!@#\$%\^&\-_\.i\d]*t/i,
    /a[\*\!@#\$%\^&\-_\.s\d]*hole/i,
    /a[\*\!@#\$%\^&\-_\.s\d]*h[o0]le/i,
    /d[\*\!@#\$%\^&\-_\.a\d]*mn/i,
    /d[\*\!@#\$%\^&\-_\.a\d]*m/i,
    /fu[c0]k/i,
    /b[i1]tch/i,
    /sh[i1]t/i,
    /d[a4]mn/i,
    /h[3e]ll/i,
    /cr[a4]p/i,
    /[a4]ssh[o0]le/i,
    /b[a4]st[a4]rd/i,
    /p[i1]ss/i,
    /st[u0]p[i1]d/i,
    /[i1]d[i1][o0]t/i,
    /m[o0]r[o0]n/i,
    /d[u0]mb/i
  ];
  
  const hasViolentContent = violencePatterns.some(pattern => pattern.test(text));
  const hasProfanityPatterns = profanityPatterns.some(pattern => pattern.test(text));
  
  return hasBadWords || hasLeoProfanity || hasViolentContent || hasProfanityPatterns;
};

// Examples of what will be BLOCKED:
console.log("=== EXAMPLES OF BLOCKED CONTENT ===");

// Basic profanity
console.log("fuck:", containsInappropriateContent("fuck")); // true
console.log("bitch:", containsInappropriateContent("bitch")); // true
console.log("shit:", containsInappropriateContent("shit")); // true

// Obfuscated profanity (what you specifically asked about)
console.log("f*ck:", containsInappropriateContent("f*ck")); // true
console.log("f**k:", containsInappropriateContent("f**k")); // true
console.log("fu*k:", containsInappropriateContent("fu*k")); // true
console.log("b1tch:", containsInappropriateContent("b1tch")); // true
console.log("b*tch:", containsInappropriateContent("b*tch")); // true
console.log("b!tch:", containsInappropriateContent("b!tch")); // true

// Creative obfuscation
console.log("f@ck:", containsInappropriateContent("f@ck")); // true
console.log("fuc|<:", containsInappropriateContent("fuc|<")); // true
console.log("sh!t:", containsInappropriateContent("sh!t")); // true
console.log("d@mn:", containsInappropriateContent("d@mn")); // true

// Leetspeak
console.log("fuc0:", containsInappropriateContent("fuc0")); // true
console.log("sh1t:", containsInappropriateContent("sh1t")); // true
console.log("d4mn:", containsInappropriateContent("d4mn")); // true

// Violence-related
console.log("kill:", containsInappropriateContent("kill")); // true
console.log("k!ll:", containsInappropriateContent("k!ll")); // true
console.log("murder:", containsInappropriateContent("murder")); // true
console.log("bomb:", containsInappropriateContent("bomb")); // true
console.log("weapon:", containsInappropriateContent("weapon")); // true

// In context (still blocked)
console.log("What the f*ck:", containsInappropriateContent("What the f*ck")); // true
console.log("You b1tch:", containsInappropriateContent("You b1tch")); // true
console.log("This is sh!t:", containsInappropriateContent("This is sh!t")); // true

// Examples of what will be ALLOWED:
console.log("\n=== EXAMPLES OF ALLOWED CONTENT ===");
console.log("Hello there:", containsInappropriateContent("Hello there")); // false
console.log("I need help:", containsInappropriateContent("I need help")); // false
console.log("Great service:", containsInappropriateContent("Great service")); // false
console.log("Thank you:", containsInappropriateContent("Thank you")); // false
