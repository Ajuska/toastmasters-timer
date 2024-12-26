export type SpeechTypes =
  | 'invocation'
  | 'introduction_of_someone'
  | 'greeter'
  | 'speech_icebreaker'
  | 'speech_standard'
  | 'speech_longer'
  | 'table_topics'
  | 'evaluator_written'
  | 'evaluator_speech'
  | 'evaluator_general'
  | 'evaluator_table_topics'
  | 'grammarian'
  | 'toastmaster'
  | 'timer'
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
