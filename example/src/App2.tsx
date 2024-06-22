import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { measure } from 'react-native-measure-text';

const WIDTH = 300;
// const TEXT = 'HaHaHaHaHa!';
const TEXT =
  'There is always a 😊moment when I want to collapse. I imagine that when I was a teenager, I would have a big cry in advance or a hysterical roar, but I finally realized that the collapse was silent, trying to brew for half a day and finding that a tear could not be squeezed out. The adult world would be short of balance without efforts and tears.';

const style = {
  fontSize: 20,
  lineHeight: 30,
};

const props = {
  numberOfLines: 0,
};

export default () => {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, style]}
        {...props}
        onLayout={({ nativeEvent }) => {
          console.log(`LAYOUT: ${nativeEvent.layout.height}`);
          measure(TEXT, WIDTH, style, props).then((value) => {
            console.log(`MEASURE: ${value}`);
          });
        }}
      >
        {TEXT}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: WIDTH,
    backgroundColor: 'skyblue',
  },
});
