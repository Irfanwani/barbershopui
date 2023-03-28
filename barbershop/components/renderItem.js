import React, { memo, useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";

import {
  Text,
  Card,
  Avatar,
  Divider,
  HelperText,
  Title,
  Button,
  useTheme,
} from "react-native-paper";

import { useDispatch } from "react-redux";

import { barbers } from "../redux/actions/actions";

import styles, { styles2 } from "../styles";
import { CustomImageViewer } from "./imageviewer";

// Individual barber card
export const Barber = memo((props) => {
  const [visible, setVisible] = useState(false);

  const gotoInfo = () => {
    props.navigation.navigate("Info", { props: props.item });
  };

  const changeVisible = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const theme = useTheme();

  return (
    <Card>
      <View style={styles.view2}>
        {props.item.image ? (
          <TouchableOpacity onPress={changeVisible}>
            <Avatar.Image
              source={{ uri: props.item.image }}
              size={70}
              style={styles.dp}
            />
          </TouchableOpacity>
        ) : (
          <Avatar.Icon
            icon="account"
            size={70}
            style={styles.dp}
            color="lightgrey"
          />
        )}

        <CustomImageViewer
          closeModal={closeModal}
          visible={visible}
          imageUrl={props.item.image}
        />

        <TouchableOpacity onPress={gotoInfo} style={styles.tostyle}>
          <Title style={{ color: theme.colors.primary }}>
            {props.item.username}
          </Title>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Address:- {props.item.location}
          </Text>
          <HelperText>Distance:- {props.item.Distance} km</HelperText>
        </TouchableOpacity>
      </View>
      <Divider inset />
    </Card>
  );
});

// filtering component
export const HeaderComponent = memo((props) => {
  const { removeFilters, callback, callback2, filterType } = props;

  const dispatch = useDispatch();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!removeFilters) {
      dispatch(barbers(filterType));
    }
  }, [filterType]);

  const select = (type) => {
    callback(false);
    callback2(type);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Button
        icon="content-cut"
        mode={filterType == "barbershop" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("barbershop")}
      >
        Barbershops
      </Button>
      <Button
        icon="hair-dryer-outline"
        mode={filterType == "hair_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("hair_salon")}
      >
        Hair Salons
      </Button>
      <Button
        icon="chair-rolling"
        mode={filterType == "beauty_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("beauty_salon")}
      >
        Beauty Salons
      </Button>
      <Button
        icon="store"
        mode={filterType == "full_service_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("full_service_salon")}
      >
        Full-Service Salons
      </Button>
      <Button
        icon="magnify"
        mode={filterType == "other" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("other")}
      >
        Others
      </Button>
    </ScrollView>
  );
});
