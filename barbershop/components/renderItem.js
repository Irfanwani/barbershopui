import React, { memo, useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";

import {
  Text,
  Card,
  Avatar,
  Divider,
  Modal,
  Portal,
  HelperText,
  Title,
  Button,
  Colors,
} from "react-native-paper";

import { useDispatch } from "react-redux";

import { barbers } from "../redux/actions/actions";

import styles, { styles2 } from "../styles";

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

        <Portal>
          <Modal visible={visible} onDismiss={closeModal}>
            <Image
              resizeMode="contain"
              source={{ uri: props.item.image }}
              style={styles.istyle2}
            />
          </Modal>
        </Portal>

        <TouchableOpacity onPress={gotoInfo} style={styles.tostyle}>
          <Title style={styles.text1}>{props.item.username}</Title>
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
  const { removeFilters, callback, callback2 } = props;

  const [selected, setSelected] = useState(null);

  const dispatch = useDispatch();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (removeFilters) {
      setSelected(null);
      return;
    }
  }, [removeFilters]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!removeFilters) {
      dispatch(barbers(selected));
    }
  }, [selected]);

  const select = (type) => {
    callback(false);
    callback2(type);
    if (selected !== type) {
      setSelected(type);
    } else {
      setSelected(null);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Button
        icon="content-cut"
        color={Colors.teal500}
        mode={selected == "barbershop" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("barbershop")}
      >
        Barbershops
      </Button>
      <Button
        icon="hair-dryer-outline"
        color={Colors.teal500}
        mode={selected == "hair_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("hair_salon")}
      >
        Hair Salons
      </Button>
      <Button
        icon="chair-rolling"
        color={Colors.teal500}
        mode={selected == "beauty_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("beauty_salon")}
      >
        Beauty Salons
      </Button>
      <Button
        icon="store"
        color={Colors.teal500}
        mode={selected == "full_service_salon" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("full_service_salon")}
      >
        Full-Service Salons
      </Button>
      <Button
        icon="magnify"
        color={Colors.teal500}
        mode={selected == "other" ? "contained" : "outlined"}
        style={styles2.filterstyles}
        onPress={() => select("other")}
      >
        Others
      </Button>
    </ScrollView>
  );
});
