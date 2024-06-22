import { NativeModules, Platform } from 'react-native';
import type {
  MeasureTextMethod,
  MeasureTextProps,
  MeasureTextStyle,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-measure-text' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MeasureText: MeasureTextMethod = NativeModules.MeasureText
  ? NativeModules.MeasureText
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const PROPS_DEFAULT_VALUE: MeasureTextProps = {
  numberOfLines: 0,
  ellipsizeMode: 'tail',
  allowFontScaling: true,
  maxFontSizeMultiplier: undefined,
  textBreakStrategy: 'highQuality', // Android only
  android_hyphenationFrequency: 'none', // Android only
};

export const measure = (
  text: string,
  width: number,
  style: MeasureTextStyle = {},
  props: MeasureTextProps = PROPS_DEFAULT_VALUE
): Promise<number> => {
  return MeasureText.measure(text, width, style, props);
};
