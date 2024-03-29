import React, { useState, useRef, useEffect } from "react";

import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  IconButton,
} from "react-native-paper";

import { AirbnbRating } from "react-native-ratings";

import * as Animatable from "react-native-animatable";

import styles, { styles2 } from "../styles";

const Ratings = (props) => {
  const { visible, callback, callback2, id, barber } = props;

  const theme = useTheme();

  const tiref = useRef();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, []);

  const [ratings, setRatings] = useState(3);
  const [comments, setComments] = useState("");

  const close = () => {
    callback();
    loosefocus();
    setComments("");
  };

  const complete = () => {
    callback2(id, barber, ratings, comments);
    loosefocus();
    callback();
    setComments("");
  };

  const loosefocus = () => {
    tiref.current.blur();
  };

  if (isFirstRender.current) {
    return null;
  }

  if (!visible) return <></>;

  return (
    <Animatable.View
      useNativeDriver={true}
      duration={500}
      animation={"bounceInDown"}
      style={[styles2.Astyle, { backgroundColor: theme.colors.background }]}
    >
      <IconButton icon="close" onPress={close} style={styles2.ibstyle} />
      <AirbnbRating defaultRating={ratings} onFinishRating={setRatings} />

      <HelperText style={styles.bstyle6}>
        Please Describe your experience with this service provider
      </HelperText>
      <TextInput
        value={comments}
        onChangeText={setComments}
        ref={(ref) => (tiref.current = ref)}
        mode="outlined"
        multiline
        maxLength={1000}
        numberOfLines={5}
        placeholder="Comments Here..."
        style={styles.ratinginput}
      />

      <Button
        icon="check"
        style={styles.bstyle6}
        mode="contained"
        onPress={complete}
      >
        Done
      </Button>
    </Animatable.View>
  );
};

export default Ratings;
