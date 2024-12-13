export type SpeechTypes =
  | 'icebreaker'
  | 'standard_speech'
  | 'table_topics'
  | 'speech_evaluation'
  | 'general_evaluation'
  | 'gramarian'
  | '';

export type Colors =
  | 'green'
  | 'yellow'
  | 'red'
  | 'darkRed'
  | 'darkerRed'
  | 'rose';

export type ColorMappingType = { [key in Colors]?: string };
export type TimeLeftType = { [key: number]: Colors };
export type SpeechPresetsType = { [key in SpeechTypes]?: number };
