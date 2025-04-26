export { isEgyptianOrigin, transliterate, fetchDictionaryEntry };

const dictionaryApiUrl = process.env.REACT_APP_DICTIONARY_API_URL;

interface CopticLetter {
    lowercase: string;
    uppercase: string | null; //can be null
    name: string;
    pronunciation_1: string | null; //can be null
    pronunciation_2: string | null; //can be null
    pronunciation_3: string | null; //can be null
    rule_1: string | null; //can be null
    rule_2: string | null; //can be null
    rule_3: string | null; //can be null
}

interface LetterRule {
  start: number; //the position in the final transliteration string
  length: number; //how many characters (e.g., 2 if we produce "sh")
  rule: string;
}

//Define the array of dictionaries of the coptic letters
const coptic_letters: CopticLetter[] = [
    { lowercase: 'ⲁ', uppercase: 'Ⲁ', name: 'Alfa', pronunciation_1: 'a', pronunciation_2: null, pronunciation_3: null, rule_1: '"a" as in "father"', rule_2: null, rule_3: null },
    { lowercase: 'ⲃ', uppercase: 'Ⲃ', name: 'Veeta', pronunciation_1: 'v', pronunciation_2: 'b', pronunciation_3: null, rule_1: '"v" as in "vital" if a vowel comes after', rule_2: '"b" as in "bottle" if a consonant comes after', rule_3: null },
    { lowercase: 'ⲅ', uppercase: 'Ⲅ', name: 'Ghamma', pronunciation_1: 'g', pronunciation_2: 'n', pronunciation_3: 'gh', rule_1: '"g" as in "game" if an "e"-sounding vowel comes after (ⲉ, ⲏ, ⲓ, ⲟ)', rule_2: '"n" as in "another" if (ⲅ, ⲕ, ⲝ, ⲍ) comes after', rule_3: '"gh" as in "Ghassan" by default' },
    { lowercase: 'ⲇ', uppercase: 'Ⲇ', name: 'Dhelta', pronunciation_1: 'd', pronunciation_2: 'th', pronunciation_3: null, rule_1: '"d" as in "David" if part of a name', rule_2: '"th" as in "the" by default', rule_3: null },
    { lowercase: 'ⲉ', uppercase: 'Ⲉ', name: 'Ei', pronunciation_1: 'ey', pronunciation_2: null, pronunciation_3: null, rule_1: '"ey" as in "hey"', rule_2: null, rule_3: null },
    { lowercase: 'ⲍ', uppercase: 'Ⲍ', name: 'Zeta', pronunciation_1: 'z', pronunciation_2: null, pronunciation_3: null, rule_1: '"z" as in "zebra"', rule_2: null, rule_3: null },
    { lowercase: 'ⲏ', uppercase: 'Ⲏ', name: 'Eta', pronunciation_1: 'ee', pronunciation_2: null, pronunciation_3: null, rule_1: '"ee" as in "sheep"', rule_2: null, rule_3: null },
    { lowercase: 'ⲑ', uppercase: 'Ⲑ', name: 'Theta', pronunciation_1: 't', pronunciation_2: 'th', pronunciation_3: null, rule_1: '"t" as in "Tapioca" if (ϣ, ⲥ) comes before it', rule_2: '"th" as in "think" by default', rule_3: null },
    { lowercase: 'ⲓ', uppercase: 'Ⲓ', name: 'Yota', pronunciation_1: 'y', pronunciation_2: null, pronunciation_3: null, rule_1: '"y" as in "synonym"', rule_2: null, rule_3: null },
    { lowercase: 'ⲕ', uppercase: 'Ⲕ', name: 'Kappa', pronunciation_1: 'k', pronunciation_2: null, pronunciation_3: null, rule_1: '"k" as in "Korean"', rule_2: null, rule_3: null },
    { lowercase: 'ⲗ', uppercase: 'Ⲗ', name: 'Lola', pronunciation_1: 'l', pronunciation_2: null, pronunciation_3: null, rule_1: '"l" as in "lamp"', rule_2: null, rule_3: null },
    { lowercase: 'ⲙ', uppercase: 'Ⲙ', name: 'Mei', pronunciation_1: 'm', pronunciation_2: null, pronunciation_3: null, rule_1: '"m" as in "mother"', rule_2: null, rule_3: null },
    { lowercase: 'ⲛ', uppercase: 'Ⲛ', name: 'Nei', pronunciation_1: 'n', pronunciation_2: null, pronunciation_3: null, rule_1: '"n" as in "no"', rule_2: null, rule_3: null },
    { lowercase: 'ⲝ', uppercase: 'Ⲝ', name: 'Eksi', pronunciation_1: 'x', pronunciation_2: null, pronunciation_3: null, rule_1: '"x" as in "axe"', rule_2: null, rule_3: null },
    { lowercase: 'ⲟ', uppercase: 'Ⲟ', name: 'Omicron', pronunciation_1: 'o', pronunciation_2: null, pronunciation_3: null, rule_1: '"o" as in "open"', rule_2: null, rule_3: null },
    { lowercase: 'ⲡ', uppercase: 'Ⲡ', name: 'Pi', pronunciation_1: 'p', pronunciation_2: null, pronunciation_3: null, rule_1: '"p" as in "person"', rule_2: null, rule_3: null },
    { lowercase: 'ⲣ', uppercase: 'Ⲣ', name: 'Ro', pronunciation_1: 'r', pronunciation_2: null, pronunciation_3: null, rule_1: '"r" as in "rule"', rule_2: null, rule_3: null },
    { lowercase: 'ⲥ', uppercase: 'Ⲥ', name: 'Sima', pronunciation_1: 'z', pronunciation_2: 's', pronunciation_3: null, rule_1: '"z" as in "zebra" if (ⲙ) comes after', rule_2: '"s" as in "small" by default', rule_3: null },
    { lowercase: 'ⲩ', uppercase: 'Ⲩ', name: 'Epsilon', pronunciation_1: 'v', pronunciation_2: 'oo', pronunciation_3: 'ee', rule_1: '"v" if (ⲁ, ⲉ) comes before it', rule_2: '"oo" as in "igloo" if (ⲟ) comes before it', rule_3: '"ee" as in "teen" by default' },
    { lowercase: 'ⲯ', uppercase: 'Ⲫ', name: 'Phi', pronunciation_1: 'ph', pronunciation_2: null, pronunciation_3: null, rule_1: '"ph" as in "fire"', rule_2: null, rule_3: null},
    { lowercase: 'ⲭ', uppercase: 'Ⲭ', name: 'Kei', pronunciation_1: 'sh', pronunciation_2: 'kh', pronunciation_3: 'k', rule_1: '"sh" as in sharing if an "e"-sounding vowel (ⲉ, ⲏ, ⲓ, ⲩ) comes after', rule_2: '"kh" as in "kher" by default', rule_3: '"k" as in "korean" if the word is Coptic'},
    { lowercase: 'ψ', uppercase: 'Ψ', name: 'Epsi', pronunciation_1: 'ps', pronunciation_2: null, pronunciation_3: null, rule_1: '"ps" as in "psalms"', rule_2: null, rule_3: null},
    { lowercase: 'ⲱ', uppercase: 'Ⲱ', name: 'Omega', pronunciation_1: 'ow', pronunciation_2: null, pronunciation_3: null, rule_1: '"ow" as in "boat"', rule_2: null, rule_3: null},
    { lowercase: 'ϣ', uppercase: 'Ϣ', name: 'Shai', pronunciation_1: 'sh', pronunciation_2: null, pronunciation_3: null, rule_1: '"sh" as in "share"', rule_2: null, rule_3: null},
    { lowercase: 'ϥ', uppercase: 'Ϥ', name: 'Fai', pronunciation_1: 'f', pronunciation_2: null, pronunciation_3: null, rule_1: '"f" as in "face"', rule_2: null, rule_3: null},
    { lowercase: 'ϧ', uppercase: 'Ϧ', name: 'Khai', pronunciation_1: 'kh', pronunciation_2: null, pronunciation_3: null, rule_1: '"kh" as in "kher"', rule_2: null, rule_3: null},
    { lowercase: 'ϩ', uppercase: 'Ϩ', name: 'Hori', pronunciation_1: 'h', pronunciation_2: null, pronunciation_3: null, rule_1: '"h" as in "horse"', rule_2: null, rule_3: null},
    { lowercase: 'ϫ', uppercase: 'Ϫ', name: 'Janja', pronunciation_1: 'j', pronunciation_2: 'g', pronunciation_3: null, rule_1: '"j" as in "June" if an "e"-sounding vowel (ⲉ, ⲏ, ⲓ) comes after', rule_2: '"g" as in "guy" by default', rule_3: null},
    { lowercase: 'ϭ', uppercase: 'Ϭ', name: 'Chima', pronunciation_1: 'tch', pronunciation_2: null, pronunciation_3: null, rule_1: '"ch" as in "child"', rule_2: null, rule_3: null},
    { lowercase: 'ϯ', uppercase: 'Ϯ', name: 'Tee', pronunciation_1: 't', pronunciation_2: null, pronunciation_3: null, rule_1: '"t" as in "tea"', rule_2: null, rule_3: null},
];

//Vowels
const a_vowels: string[] = ['ⲁ', 'Ⲁ'];

const o_vowels: string[] = ['ⲟ', 'Ⲟ', 'ⲱ', 'Ⲱ'];

const ee_vowels: string[] = ['ⲓ', 'Ⲓ', 'ⲩ', 'Ⲩ', 'ⲉ', 'Ⲉ', 'ⲏ', 'Ⲏ'];

//Special case
const special_cases: CopticLetter[] = [
    {'lowercase': 'ϩ', 'uppercase': 'Ϩ', 'name': 'Soo', 'pronunciation_1': 's', 'pronunciation_2': null, 'pronunciation_3': null, 'rule_1': 'Used as the number "6"', 'rule_2': null, 'rule_3': null},
    {'lowercase': '⳿', 'uppercase': null, 'name': 'Jinkim', 'pronunciation_1': 'eh', 'pronunciation_2': null, 'pronunciation_3': null, 'rule_1': 'Adds an "eh" sound before the letter it tops', 'rule_2': null, 'rule_3': null}
];

//Function to check if letter is lowercase (based on dict)
//function [function_name] (param: param_type): return_type {}
function isLowercase(letter: string): boolean {
    //.some loops through
    //=> checks the condition (item.lowercase)
    //confirms if the lowercase letter matches the one we input and returns true
    return coptic_letters.some(item => item.lowercase === letter);
}

//Define a type for the database row result
interface GoWordResponse {
  id: number;
  coptic_word: string;
  arabic_translation: string;
  english_translation: string;
  greek_script_coptic_word: string;
  grammatical_modification: string;
  word_category: string;
  word_gender: string;
  word_category_2: string;
  word_gender_2: string;
  greek_word: string;
  coptic_word_alt: string;
}

async function isEgyptianOrigin(copticWord: string): Promise<boolean> {
  if (!copticWord) return false;

  try {
    const response = await fetch(
      `${dictionaryApiUrl}/word?coptic=${encodeURIComponent(copticWord)}`
    );
    if (!response.ok) {
      //404 if the word is not found
      return false;
    }

    //Parse response as GoWordResponse
    const data: GoWordResponse = await response.json();

    //If data.coptic_word_alt === 'EGY.', considered Egyptian in origin
    return data.coptic_word_alt === 'EGY.';
  } catch (err) {
    console.error('Error checking Egyptian origin:', err);
    return false;
  }
}

//Function to transliterate
//function [function_name] (param: param_type): return_type {}
async function getLetterTransliteration(letter: string, next_letter: string | null, previous_letter: string | null, coptic_word: string | null): Promise<[string, string | null]> {
    //Stores any special pronunciation rule that applies
    let applied_rule: string | null = null;

    //Iterate through the Coptic letters dictionary to find the matching letter
    for (const entry of coptic_letters) {
        if (letter === entry.lowercase || letter === entry.uppercase) {
            //Default pronunciation
            let translit: string = entry.pronunciation_1 || letter;

            //Special rules for certain letters
            if (letter === 'ⲃ' || letter === 'Ⲃ') { //Veeta (B/V rule)
                if (next_letter && ee_vowels.includes(next_letter)) {
                    translit = entry.pronunciation_1!; //"v" as in "vital"
                    applied_rule = `${letter} is pronounced 'v' because a vowel comes after.`;
                } else {
                    translit = entry.pronunciation_2!; //"b" as in "bottle"
                    applied_rule = `${letter} is pronounced 'b' because a consonant comes after.`;
                }

            } else if (letter === 'ⲅ' || letter === 'Ⲅ') { //Ghamma (G/N/Gh rule)
                if (next_letter && ee_vowels.includes(next_letter)) {
                    translit = entry.pronunciation_1!; //"g" as in "game"
                    applied_rule = `${letter} is pronounced 'g' because an 'e'-sounding vowel comes after.`;
                } else if (next_letter && ['ⲅ', 'ⲕ', 'ⲝ', 'ⲍ'].includes(next_letter)) {
                    translit = entry.pronunciation_2!; //"n" as in "another"
                    applied_rule = `${letter} is pronounced 'n' because ${next_letter} comes after.`;
                } else {
                    translit = entry.pronunciation_3!; //"gh" as in "Ghassan"
                    applied_rule = `${letter} is pronounced 'gh' by default.`;
                }

            } else if (letter === 'ⲉ' || letter === 'Ⲉ') { //Epsilon (E/I rule)
                if (next_letter && a_vowels.includes(next_letter)) {
                    translit = 'e';
                    applied_rule = `${letter} is pronounced 'e' because ${next_letter} comes after.`;
                } else if (next_letter && o_vowels.includes(next_letter)) {
                    translit = 'i';
                    applied_rule = `${letter} is pronounced 'i' because ${next_letter} comes after.`;
                } else {
                    translit = 'e'; //Default "e"
                }

            } else if (letter === 'ⲑ' || letter === 'Ⲑ') { //Theta (T/Th rule)
                if (previous_letter && ['ϣ', 'ⲥ'].includes(previous_letter)) {
                    translit = entry.pronunciation_1!; //"t" as in "Tapioca"
                    applied_rule = `${letter} is pronounced 't' because ${previous_letter} comes before.`;
                } else {
                    translit = entry.pronunciation_2!; //Default "th"
                    applied_rule = `${letter} is pronounced 'th' by default.`;
                }

            } else if (letter === 'ⲩ' || letter === 'Ⲩ') { //Epsilon (V/OO/EE rule)
                if (previous_letter && a_vowels.includes(previous_letter)) {
                    translit = 'v';
                    applied_rule = `${letter} is pronounced 'v' because ${previous_letter} comes before.`;
                } else if (previous_letter && o_vowels.includes(previous_letter)) {
                    translit = 'oo';
                    applied_rule = `${letter} is pronounced 'oo' because ${previous_letter} comes before.`;
                } else {
                    translit = 'ee'; // Default "ee"
                    applied_rule = `${letter} is pronounced 'ee' by default.`;
                }

            } else if (letter === 'ⲭ' || letter === 'Ⲭ') { //Kei (Sh/Kh/K)
                if (next_letter && ee_vowels.includes(next_letter)) {
                    translit = entry.pronunciation_1!; //"sh"
                    applied_rule = `${letter} is pronounced 'sh' because an 'e'-sounding vowel follows.`;
                } else {
                    translit = entry.pronunciation_2!; //Default "kh"
                }

                //Check if the word is of Egyptian origin
                if (coptic_word && (await isEgyptianOrigin(coptic_word))) {
                    translit = entry.pronunciation_3!; // "k"
                    applied_rule = `${letter} is pronounced 'k' because the word is of Egyptian origin.`;
                }
            }

            return [translit, applied_rule];
        }
    }

    //If no match is found, return the letter unchanged
    return [letter, null];
}

async function fetchDictionaryEntry(copticWord: string): Promise<GoWordResponse | null> {
  if (!copticWord) return null;

  try {
    const response = await fetch(
      `${dictionaryApiUrl}/word?coptic=${encodeURIComponent(copticWord)}`
    );

    //If the server returns 404 or anything not "OK",
    //treat it as "word not found" or handle as you wish:
    if (!response.ok) {
      const data = await response.json();
      // If the server returns: { "error": "Word not found", "suggestion": "ⲱϫ" }
      // We'll build a "fake" dictionary entry so we can display the suggestion.
      if (data && data.error === 'Word not found' && data.suggestion) {
        return {
          id: 0,
          coptic_word: data.suggestion,
          arabic_translation: '',
          english_translation: '',
          greek_script_coptic_word: '',
          grammatical_modification: '',
          word_category: '',
          word_gender: '',
          word_category_2: '',
          word_gender_2: '',
          greek_word: '',
          // Mark this as a suggestion entry
          coptic_word_alt: 'SUGGESTION'
        };
      }
      return null;
    }

    //Parse as GoWordResponse
    const data: GoWordResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dictionary entry:', error);
    return null;
  }
}

//Function to transliterate Coptic text into Latin script
async function transliterate(copticText: string): Promise<[string, LetterRule[]]> {
  let transliteration = '';
  const letterRules: LetterRule[] = [];
  let finalIndex = 0;  // <--- track the current position in the final transliteration

  for (let i = 0; i < copticText.length; i++) {
    const letter = copticText[i];
    const nextLetter = i + 1 < copticText.length ? copticText[i + 1] : null;
    const previousLetter = i > 0 ? copticText[i - 1] : null;

    const [translitLetterRaw, rule] = await getLetterTransliteration(
      letter,
      nextLetter,
      previousLetter,
      copticText
    );

    // If uppercase in Coptic, uppercase the translit
    const translitLetter = isLowercase(letter)
      ? translitLetterRaw
      : translitLetterRaw.toUpperCase();

    // Append to final string
    transliteration += translitLetter;

    // If there's a rule, store the range in letterRules
    if (rule) {
      // e.g. if translitLetter === "sh", chunkLen = 2
      const chunkLen = translitLetter.length;
      letterRules.push({
        start: finalIndex,
        length: chunkLen,
        rule,
      });
    }

    // Advance finalIndex by however many ASCII letters we added
    finalIndex += translitLetter.length;
  }

  return [transliteration, letterRules];
}
