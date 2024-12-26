export type SpeechTypes =
  | 'invocation'
  | 'introduction'
  | 'greeter'
  | 'speech_icebreaker'
  | 'speech_standard'
  | 'speech_longer'
  | 'table_topics'
  | 'evaluator_written'
  | 'evaluator_speech'
  | 'evaluator_general'
  | 'evaluator_TT'
  | 'grammarian'
  | 'toastmaster'
  | 'timer'
  | '--- Select Preset ---';

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
