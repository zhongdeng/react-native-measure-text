import type { FontVariant } from 'react-native';

export type EllipsizeMode = 'head' | 'middle' | 'tail' | 'clip';
export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'ultralight'
  | 'thin'
  | 'light'
  | 'medium'
  | 'regular'
  | 'semibold'
  | 'condensedBold'
  | 'condensed'
  | 'heavy'
  | 'black';

export type MeasureTextStyle = {
  fontFamily?: string | undefined;
  fontSize?: number | undefined;
  fontStyle?: 'normal' | 'italic' | undefined;
  fontWeight?: FontWeight | undefined;
  letterSpacing?: number | undefined;
  lineHeight?: number | undefined;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined;
  fontVariant?: FontVariant[] | undefined; // iOS only
  includeFontPadding?: boolean | undefined; // Android only
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined; // Only available on Android
};

export type MeasureTextProps = {
  numberOfLines?: number;
  ellipsizeMode?: EllipsizeMode;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number | null | undefined;
  textBreakStrategy?: 'simple' | 'highQuality' | 'balanced' | undefined; // Android only
  android_hyphenationFrequency?: 'normal' | 'none' | 'full' | undefined; // Android only
};

export type MeasureTextMethod = {
  measure: (
    text: string,
    width: number,
    style: MeasureTextStyle,
    props: MeasureTextProps
  ) => Promise<number>;
};
