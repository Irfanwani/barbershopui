import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View, TextInput } from "react-native";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  FAB,
  IconButton,
  Text,
  Badge,
  ActivityIndicator,
} from "react-native-paper";
import { barbers, tokenCheck } from "../redux/actions/actions";
import { getAppointments } from "../redux/actions/actions2";
import { FETCH_MORE, GET_ERRORS } from "../redux/actions/types";

import { notification_manager } from "../notifications";

import { Barber, HeaderComponent } from "../components/renderItem";

import { MultiSelect } from "../components/multiselect";

import { services as serviceList } from "./services";

import styles, {
  backgroundcolor,
  headertextcolor,
  darkbackgroundcolor,
} from "../styles";

const Index = ({ navigation, route }) => {
  const { barberList, fetching, id, token, darkmode } = useSelector(
    (state) => ({
      barberList: state.barbersReducer.barbers,
      fetching: state.errorReducer.fetching,
      id: state.authReducer.user ? state.authReducer.user.id : null,
      token: state.authReducer.token,
      darkmode: state.themeReducer.darkmode,
    })
  );

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [clearSelection, setClearSelection] = useState(false);
  const [removeFilters, setRemoveFilters] = useState(false);
  const [getMoreData, setGetMoreData] = useState(false);
  const [start, setStart] = useState(10);
  const [end, setEnd] = useState(20);
  const [filterType, setFilterType] = useState(null);
  const [selectedServiceFilters, setSelServiceFilters] = useState(null);

  const dispatch = useDispatch();
  const setSearch = () => {
    setSearching(true);
  };

  const setsearching = () => {
    setSearching(false);
    setQuery("");
  };

  const callback = (...rest) => {
    setFilterCount(rest[0] ? rest[0] : 0);
    setVisible(false);
  };

  const callback2 = (cl) => {
    setClearSelection(cl);
    setRemoveFilters(true);
    setFilterType(null);
  };

  const callback3 = (selectedServiceFilters) => {
    setSelServiceFilters(selectedServiceFilters);
  };

  const cbfun = (val) => {
    setRemoveFilters(val);
    setClearSelection(true);
  };

  const cbfun2 = (ft) => {
    setFilterType(ft == filterType ? null : ft);
  };

  const refresh = () => {
    dispatch(barbers());
    setRemoveFilters(true);
    setClearSelection(true);
    setFilterType(null);
    setSelServiceFilters(null);
  };

  const reachedEnd = () => {
    if (getMoreData) {
      setGetMoreData(false);
      setStart(end);
      setEnd((prev) => prev + 10);
      dispatch(
        barbers(filterType, selectedServiceFilters, end, end + 10, FETCH_MORE)
      );
    }
  };

  const startScroll = () => {
    setGetMoreData(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Barbershop",
      headerRight: () => (
        <View style={styles.vstyle2}>
          <IconButton
            icon="magnify"
            color={headertextcolor}
            onPress={setSearch}
          />
        </View>
      ),
    });

    dispatch(barbers());
    dispatch(getAppointments());

    notification_manager(id, token)
      .then(() => {})
      .catch((err) => {
        dispatch(tokenCheck(err, GET_ERRORS));
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: searching ? "" : "Barbershop",
      headerRight: () =>
        searching ? (
          <View style={styles.view1}>
            <IconButton
              color={headertextcolor}
              icon="arrow-left"
              onPress={setsearching}
              style={{
                backgroundColor: darkmode
                  ? darkbackgroundcolor
                  : backgroundcolor,
              }}
            />
            <TextInput
              placeholderTextColor="lightgrey"
              autoFocus={true}
              style={styles.testyle1}
              autoCapitalize="none"
              returnKeyType="search"
              placeholder="Search"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        ) : (
          <View style={styles.vstyle2}>
            <IconButton
              icon="magnify"
              color={headertextcolor}
              onPress={setSearch}
            />
          </View>
        ),
    });
  });

  const renderItem = ({ item }) => (
    <Barber item={item} navigation={navigation} />
  );

  const data = useMemo(() => {
    if (query) {
      const dt =
        barberList?.length > 0
          ? barberList.filter(
              (barber) =>
                barber.username.toLowerCase().includes(query.toLowerCase()) ||
                barber.location.toLowerCase().includes(query.toLowerCase())
            )
          : [];
      return dt;
    }
    return barberList;
  }, [query, barberList]);

  return (
    <View style={styles.vstyle6}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.vstyle6}
        refreshing={fetching}
        onRefresh={refresh}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.tstyle10}>No barber found!</Text>
        }
        ListHeaderComponent={
          <HeaderComponent
            removeFilters={removeFilters}
            callback={cbfun}
            callback2={cbfun2}
            filterType={filterType}
          />
        }
        ListFooterComponent={
          data?.length != 0 &&
          (!fetching ? (
            <Text style={styles.tstyle11}>End Reached!</Text>
          ) : (
            <ActivityIndicator color="orange" style={styles.tstyle11} />
          ))
        }
        onEndReached={reachedEnd}
        onEndReachedThreshold={0.1}
        onScrollBeginDrag={startScroll}
      />

      <View style={styles.fab2}>
        <FAB
          icon="filter-outline"
          color="white"
          style={styles.fab3}
          onPress={() => setVisible(true)}
        />
        <Badge style={styles.badge}>{filterCount}</Badge>
      </View>
      <MultiSelect
        title="Filter As per Services provided"
        data={serviceList}
        visible={visible}
        callback={callback}
        callback2={callback2}
        callback3={callback3}
        clearSelection={clearSelection}
        barbersFilter={true}
        buttonLabel="Apply Filter"
      />
    </View>
  );
};

export default Index;
