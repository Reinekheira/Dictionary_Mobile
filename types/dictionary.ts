export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
}

export interface DictionaryError {
  title: string;
  message: string;
  resolution: string;
}

export interface SearchHistoryItem {
  word: string;
  searchedAt: number;
}
