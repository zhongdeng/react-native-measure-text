import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';
import MeasureText from 'react-native-measure-text';
import { FlashList } from '@shopify/flash-list';
import data from './data.json';
import type { MeasureTextStyle } from '../../src/types';

const PADDING = 16;
const INDEX_HEIGHT = 36;
const SEPARATOR_HEIGHT = 4;

const style: MeasureTextStyle = { fontWeight: 'bold', fontSize: 30 };

const props = {};

type DataType = { text: string };

const Divider = () => <View style={styles.separator} />;

export default () => {
  const [list, setList] = useState<number[]>([]);
  const flashListRef = useRef<any>(null);
  useEffect(() => {
    const texts: DataType[] = data;
    const width = Dimensions.get('window').width - PADDING * 2;
    MeasureText.measureMultipleText(
      texts.map((item) => item.text),
      width,
      style,
      props
    ).then((value) => {
      setList(value.map((item) => item.height));
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {list && (
        <FlashList
          data={data}
          ref={flashListRef}
          estimatedItemSize={
            140 + PADDING * 2 + INDEX_HEIGHT + SEPARATOR_HEIGHT
          }
          overrideItemLayout={(layout, _, index) => {
            layout.size =
              (list[index] || 0) +
              PADDING * 2 +
              INDEX_HEIGHT +
              SEPARATOR_HEIGHT;
          }}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.index}>{index}</Text>
              <Text style={[styles.text, style]}>{item.text}</Text>
            </View>
          )}
          ItemSeparatorComponent={Divider}
          onLoad={({ elapsedTimeInMs }) => {
            setTimeout(() => {
              flashListRef.current?.scrollToIndex({
                index: 333,
                animated: false,
              });
            }, elapsedTimeInMs);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    backgroundColor: 'lightgreen',
  },
  index: {
    fontSize: 30,
    fontWeight: 'bold',
    height: INDEX_HEIGHT,
    backgroundColor: 'skyblue',
  },
  item: {
    padding: PADDING,
    alignItems: 'center',
  },
  separator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: 'red',
  },
});
