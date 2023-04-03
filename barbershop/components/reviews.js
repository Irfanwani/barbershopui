import * as Animatable from "react-native-animatable";
import { FlatList, View } from "react-native";
import styles, { styles2 } from "../styles";
import {
  IconButton,
  Title,
  HelperText,
  Surface,
  useTheme,
  Colors,
  Text,
  Avatar,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { Rating } from "react-native-ratings";
import { delReview, getReviews } from "../redux/actions/actions2";

const Reviews = (props) => {
  const { reviews, username } = useSelector((state) => ({
    reviews: state.reviewReducer.reviews,
    username: state.authReducer.user?.username,
  }));

  const { visible, callback, id } = props;
  const theme = useTheme();

  const dispatch = useDispatch();

  const deleteReview = (id) => {
    dispatch(delReview(id, callback));
  };

  const renderItem = ({ item }) => <RenderItem item={item} />;

  const RenderItem = ({ item }) => {
    const dispatch = useDispatch();

    const deleteItem = () => {
      deleteReview(item.id);
      dispatch(getReviews(id));
    };
    return (
      <Surface style={styles.sustyle}>
        <View style={styles.vstyle2}>
          <View style={styles.vstyle2}>
            <Avatar.Image size={40} source={{ uri: item.dp }} />
            <Title style={styles.bstyle}>{item.user}</Title>
          </View>
          {item.user == username && (
            <IconButton
              icon="delete"
              color={Colors.red500}
              onPress={deleteItem}
            />
          )}
        </View>

        <View style={styles.vstyle2}>
          <Rating
            imageSize={15}
            style={styles2.rstyle}
            tintColor={theme.dark ? "rgb(39, 39, 39)" : theme.colors.surface}
            readonly={true}
            startingValue={item.ratings}
          />

          <HelperText type="info" padding="none">
            {item.date}
          </HelperText>
        </View>

        <HelperText numberOfLines={8} ellipsizeMode="tail">
          {item.comments ? item.comments : "No Comments!"}
        </HelperText>
      </Surface>
    );
  };

  if (!visible) return <></>;

  return (
    <Animatable.View
      useNativeDriver={true}
      duration={500}
      animation={"bounceInUp"}
      style={[styles2.Astyle, { backgroundColor: theme.colors.background }]}
    >
      <IconButton icon="close" style={styles2.ibstyle} onPress={callback} />

      <FlatList
        data={reviews?.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.tstyle10}>No Reviews!</Text>}
        showsVerticalScrollIndicator={false}
      />
    </Animatable.View>
  );
};

export default Reviews;
