import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';
import MeasureText from '@zhongdeng/react-native-measure-text';
import { FlashList } from '@shopify/flash-list';
import data from './data.json';
import type { MeasureTextStyle } from '../../src/types';

const PADDING = 16;
const INDEX_HEIGHT = 36;
const SEPARATOR_HEIGHT = 4;
const EXTRA_HEIGHT = PADDING * 2 + INDEX_HEIGHT + SEPARATOR_HEIGHT;

const style: MeasureTextStyle = { fontWeight: 'bold', fontSize: 30 };

const props = {};

type DataType = { text: string; height?: number };

const Divider = () => <View style={styles.separator} />;

export default () => {
  const flashListRef = useRef<any>(null);
  const averageHeightRef = useRef(0);
  const [list, setList] = useState<DataType[]>([]);
  useEffect(() => {
    const texts: DataType[] = data;
    const width = Dimensions.get('window').width - PADDING * 2;
    MeasureText.measureMultipleText(
      texts.map((item) => item.text),
      width,
      style,
      props
    ).then((value) => {
      setList(() => {
        let totalHeight = 0;
        const newState = texts.map((item, index) => {
          const height = value[index]?.height || 0;
          totalHeight += height + EXTRA_HEIGHT;
          return { ...item, height };
        });
        averageHeightRef.current = totalHeight / texts.length;
        return [...newState];
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {list.length > 0 && (
        <FlashList
          data={list}
          ref={flashListRef}
          initialScrollIndex={333}
          estimatedItemSize={averageHeightRef.current}
          overrideItemLayout={(layout, item) => {
            layout.size = item.height! + EXTRA_HEIGHT;
          }}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.index}>{index}</Text>
              <Text style={[styles.text, style]}>{item.text}</Text>
            </View>
          )}
          ItemSeparatorComponent={Divider}
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
