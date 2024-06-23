import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MeasureText from '@zhongdeng/react-native-measure-text';

const fontStyles = ['normal', 'italic'];
const fontVariants = [
  undefined,
  'small-caps',
  'oldstyle-nums',
  'lining-nums',
  'tabular-nums',
  'proportional-nums',
];
const fontWeights = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];
const textAlignments = ['auto', 'left', 'right', 'center', 'justify'];
const textTransformations = ['none', 'uppercase', 'lowercase', 'capitalize'];
const textAlignmentsVertical = ['auto', 'top', 'bottom', 'center'];

const ellipsizeModes = ['head', 'middle', 'tail', 'clip'];
const textBreakStrategys = ['simple', 'highQuality', 'balanced'];
const hyphenationFrequencys = ['normal', 'none', 'full'];

const TEXT =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. 112 Likes';
const WIDTH = 300;

const App = () => {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [measureHeight, setMeasureHeight] = useState(0);

  // style
  const [fontSize, setFontSize] = useState(10);
  const [fontStyleIdx, setFontStyleIdx] = useState(0);
  const [fontWeightIdx, setFontWeightIdx] = useState(0);
  const [lineHeight, setLineHeight] = useState(10);
  const [textAlignIdx, setTextAlignIdx] = useState(0);
  const [includeFontPadding, setIncludeFontPadding] = useState(false);
  const [textVerticalAlignIdx, setTextVerticalAlignIdx] = useState(0);
  const [fontVariantIdx, setFontVariantIdx] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textTransformIdx, setTextTransformIdx] = useState(0);

  // props
  const [numberOfLines, setNumberOfLines] = useState(0);
  const [ellipsizeModeIdx, setEllipsizeModeIdx] = useState(2);
  const [allowFontScaling, setAllowFontScaling] = useState(true);
  const [maxFontSizeMultiplier, setMaxFontSizeMultiplier] = useState(0);
  const [textBreakStrategyIdx, setTextBreakStrategyIdx] = useState(1);
  const [hyphenationFrequencyIdx, setHyphenationFrequency] = useState(1);

  const style: any = {
    width: WIDTH,
    fontSize,
    fontStyle: fontStyles[fontStyleIdx],
    fontWeight: fontWeights[fontWeightIdx],
    lineHeight,
    textAlign: textAlignments[textAlignIdx],
    textTransform: textTransformations[textTransformIdx],
    textAlignVertical: textAlignmentsVertical[textVerticalAlignIdx],
    fontVariant: fontVariants[fontVariantIdx]
      ? [fontVariants[fontVariantIdx]]
      : [],
    letterSpacing,
    includeFontPadding,
  };

  const props: any = {
    numberOfLines,
    ellipsizeMode: ellipsizeModes[ellipsizeModeIdx],
    allowFontScaling,
    maxFontSizeMultiplier,
    textBreakStrategy: textBreakStrategys[textBreakStrategyIdx],
    android_hyphenationFrequency:
      hyphenationFrequencys[hyphenationFrequencyIdx],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heightText}>{`LAYOUT: ${layoutHeight}`}</Text>
      <Text style={styles.heightText}>{`MEASURE: ${measureHeight}`}</Text>
      <Text
        style={[styles.paragraph, style]}
        onLayout={({ nativeEvent }) => {
          setLayoutHeight(nativeEvent.layout.height);
          MeasureText.measureSingleText(TEXT, WIDTH, style, props).then(
            ({ height }) => {
              setMeasureHeight(height);
            }
          );
        }}
        {...props}
      >
        {TEXT}
      </Text>
      <ScrollView style={styles.scroll}>
        <View>
          <Text>Common platform properties</Text>
          <CustomSlider
            label="Font Size"
            value={fontSize}
            maximumValue={40}
            handleValueChange={setFontSize}
          />
          <CustomPicker
            label="Font Style"
            data={fontStyles}
            currentIndex={fontStyleIdx}
            onSelected={setFontStyleIdx}
          />
          <CustomPicker
            label="Font Weight"
            data={fontWeights}
            currentIndex={fontWeightIdx}
            onSelected={setFontWeightIdx}
          />
          <CustomSlider
            label="Line Height"
            value={lineHeight}
            minimumValue={10}
            maximumValue={50}
            handleValueChange={setLineHeight}
          />
          <CustomPicker
            label="Text Align"
            data={textAlignments}
            currentIndex={textAlignIdx}
            onSelected={setTextAlignIdx}
          />
          <CustomSlider
            label="Letter Spacing"
            step={0.1}
            value={letterSpacing}
            handleValueChange={setLetterSpacing}
          />
          <CustomPicker
            label="Text Transform"
            data={textTransformations}
            currentIndex={textTransformIdx}
            onSelected={setTextTransformIdx}
          />
          <CustomSlider
            label="Number Of Lines"
            value={numberOfLines}
            maximumValue={20}
            handleValueChange={setNumberOfLines}
          />
          <CustomPicker
            label="Ellipsize Mode"
            data={ellipsizeModes}
            currentIndex={ellipsizeModeIdx}
            onSelected={setEllipsizeModeIdx}
          />
          <CustomPicker
            label="Allow Font Scaling"
            data={['False', 'True']}
            currentIndex={allowFontScaling ? 1 : 0}
            onSelected={(idx) => setAllowFontScaling(!!idx)}
          />
          <CustomSlider
            label="Max Font Size Multiplier"
            value={maxFontSizeMultiplier}
            minimumValue={0}
            maximumValue={10}
            handleValueChange={setMaxFontSizeMultiplier}
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.platformContainer}>
            <Text style={styles.platformContainerTitle}>
              Android only properties
            </Text>
            <CustomPicker
              label="Text Vertical Align"
              data={textAlignmentsVertical}
              currentIndex={textVerticalAlignIdx}
              onSelected={setTextVerticalAlignIdx}
            />
            <CustomSwitch
              label="Include Font Padding"
              handleValueChange={setIncludeFontPadding}
              value={includeFontPadding}
            />
            <CustomPicker
              label="Text Break Strategy"
              data={textBreakStrategys}
              currentIndex={textBreakStrategyIdx}
              onSelected={setTextBreakStrategyIdx}
            />
            <CustomPicker
              label="Hyphenation Frequencys"
              data={hyphenationFrequencys}
              currentIndex={hyphenationFrequencyIdx}
              onSelected={setHyphenationFrequency}
            />
          </View>
        )}
        {Platform.OS === 'ios' && (
          <View style={styles.platformContainer}>
            <Text style={styles.platformContainerTitle}>
              iOS only properties
            </Text>
            <CustomPicker
              label="Font Variant"
              data={fontVariants}
              currentIndex={fontVariantIdx}
              onSelected={setFontVariantIdx}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const CustomSwitch = ({
  label,
  handleValueChange,
  value,
}: {
  label: string;
  handleValueChange: (value: boolean) => void;
  value: boolean;
}) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: '#767577', true: '#DAA520' }}
          thumbColor={value ? '#DAA520' : '#f4f3f4'}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

const CustomSlider = ({
  label,
  handleValueChange,
  step = 1,
  minimumValue = 0,
  maximumValue = 10,
  value,
}: {
  label: string;
  handleValueChange: (value: number) => void;
  step?: number;
  minimumValue?: number;
  maximumValue?: number;
  value: number;
}) => {
  return (
    <>
      {label && (
        <Text style={styles.title}>{`${label} (${value.toFixed(2)})`}</Text>
      )}
      <View style={styles.wrapperHorizontal}>
        <Slider
          thumbTintColor="#DAA520"
          minimumTrackTintColor="#DAA520"
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

const CustomPicker = ({
  label,
  data,
  currentIndex,
  onSelected,
}: {
  label: string;
  data: (string | undefined)[];
  currentIndex: number;
  onSelected: (idx: number) => void;
}) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.wrapperHorizontal}>
        <FlatList
          bounces
          horizontal
          data={data}
          keyExtractor={(item) => String(item)}
          renderItem={({ item, index }) => {
            const selected = index === currentIndex;
            const color = selected ? 'black' : 'grey';
            const fontWeight = selected ? 'bold' : 'normal';
            return (
              <TouchableWithoutFeedback onPress={() => onSelected(index)}>
                <View
                  style={[
                    styles.itemStyleHorizontal,
                    selected && styles.itemSelectedStyleHorizontal,
                  ]}
                >
                  <Text style={[styles.pickerText, { color, fontWeight }]}>
                    {item + ''}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  paragraph: {
    color: 'black',
    textDecorationColor: 'yellow',
    textShadowColor: 'red',
    textShadowRadius: 1,
    backgroundColor: 'skyblue',
    margin: 24,
    // fontFamily: '.SFUI-Regular',
  },
  heightText: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green',
  },
  wrapperHorizontal: {
    height: 54,
    justifyContent: 'center',
    color: 'black',
    marginBottom: 12,
  },
  itemStyleHorizontal: {
    marginRight: 10,
    height: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 25,
    textAlign: 'center',
    justifyContent: 'center',
  },
  itemSelectedStyleHorizontal: {
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  platformContainer: {
    marginTop: 8,
    borderTopWidth: 1,
  },
  platformContainerTitle: {
    marginTop: 8,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  switchContainer: {
    alignItems: 'flex-start',
  },
  pickerText: {
    textAlign: 'center',
  },
});

export default App;
