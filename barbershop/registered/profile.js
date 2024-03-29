import React, { useState, useRef } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import {
  Avatar,
  TextInput,
  Button,
  Colors,
  Card,
  FAB,
  IconButton,
  useTheme,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import styles, { darkbackgroundcolor } from "../styles";
import RBSheet from "react-native-raw-bottom-sheet";

import { updateDetails } from "../redux/actions/actions";

import * as Location from "expo-location";

import MapView, { Marker } from "react-native-maps";
import { cameraImageAsync, galleryImageAsync } from "../utils/getassets";
import { CustomImageViewer } from "../components/imageviewer";

const App = () => {
  const { loading, details, username, email } = useSelector((state) => ({
    loading: state.errorReducer.loading,
    details: state.detailReducer.details ? state.detailReducer.details : {},
    username: state.authReducer.user?.username,
    email: state.authReducer.user?.email,
  }));

  const dispatch = useDispatch();

  const { coords } = details;

  const coordinates = coords
    ? coords.slice(coords.indexOf("(") + 1, coords.indexOf(")")).split(" ")
    : [0, 0];

  const [lat, setLat] = useState(parseFloat(coordinates[1]));
  const [lng, setLng] = useState(parseFloat(coordinates[0]));

  const [image, setImage] = useState(details.image);
  const [address, setAddress] = useState(details.location);
  const [about, setAbout] = useState(details.about);
  const [contact, setContact] = useState(details.contact);

  const [fetching, setFetching] = useState(false);
  const [addrChanged, setAddrChanged] = useState(false);

  const [standard, setStandard] = useState(true);
  const [mapClicked, setMapClicked] = useState(false);

  const [visible, setVisible] = useState(false);

  const showImage = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const ImageRBSheet = useRef();

  const addressInput = useRef();

  const locationRBSheet = useRef();

  const MapRBSheet = useRef();

  // image handling
  const galleryAsync = async () => {
    let im = await galleryImageAsync();
    if (im) {
      ImageRBSheet.current.close();
      setImage(im);
    }
  };

  const cameraAsync = async () => {
    let im = await cameraImageAsync();
    if (im) {
      ImageRBSheet.current.close();
      setImage(im);
    }
  };

  const resetImage = () => {
    setImage(details.image);
    ImageRBSheet.current.close();
  };

  // location handling
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permissions denied!");
      return;
    }

    setFetching(true);
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.BestForNavigation,
    });

    const { latitude, longitude } = location.coords;

    setLat(latitude);
    setLng(longitude);
    reverseGeocode(latitude, longitude);
    locationRBSheet.current.close();
    setFetching(false);
  };

  const reverseGeocode = async (lat, lng) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permissions denied.");
      return;
    }

    let addr = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    let loc = Object.values(addr[0]).join(" ");

    let modifiedLoc = Array.from(new Set(loc.split(" "))).join(" ");
    setAddress(modifiedLoc);
  };

  const geoCode = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location Permissions denied");
      return;
    }

    let coords = await Location.geocodeAsync(address);

    if (coords[0]) {
      const { latitude, longitude } = coords[0];
      setLat(latitude);
      setLng(longitude);
    } else {
      alert("Please provide valid address details.");
    }
  };

  const changeAddress = (val) => {
    setAddrChanged(true);
    setAddress(val);
  };

  const getCoords = () => {
    if (addrChanged && address) {
      geoCode();
      setAddrChanged(false);
    }
  };

  const onCloseMapSheet = () => {
    if (mapClicked) {
      reverseGeocode(lat, lng);
      setMapClicked(false);
    }
  };

  const submit = () => {
    const newDetails = {
      lat,
      lng,
      location: address,
      about,
      contact,
    };
    dispatch(updateDetails(image !== details.image ? image : null, newDetails));
  };

  const mapclick = (e) => {
    setMapClicked(true);
    setLat(e.nativeEvent.coordinate.latitude);
    setLng(e.nativeEvent.coordinate.longitude);
  };

  const changeStandard = () => {
    setStandard(!standard);
  };

  const toggleLM = () => {
    MapRBSheet.current.open();
    locationRBSheet.current.close();
  };

  const toggleLA = () => {
    locationRBSheet.current.close();
    addressInput.current.focus();
  };

  const openIRBS = () => {
    ImageRBSheet.current.open();
  };

  const openLRBS = () => {
    locationRBSheet.current.open();
  };

  const closeMRBS = () => {
    MapRBSheet.current.close();
  };

  const theme = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <Card.Title title={username} subtitle={email} />
      <View style={styles.view7}>
        <Avatar.Image
          style={styles.avatar}
          source={{ uri: image }}
          size={150}
        />
        <FAB onPress={openIRBS} icon="camera" style={styles.fab} />
      </View>
      <RBSheet
        animationType="slide"
        ref={ImageRBSheet}
        height={Dimensions.get("window").height / 5}
        closeOnDragDown={true}
        customStyles={{
          container: styles.rbsheet,
        }}
      >
        <Card style={styles.rbsheet}>
          <Card.Title
            title="Change Profile photo"
            titleStyle={styles.ctstyle}
          />
          <IconButton
            size={30}
            onPress={showImage}
            style={styles.eye}
            icon="eye"
            color={darkbackgroundcolor}
          />

          <CustomImageViewer
            closeModal={closeModal}
            visible={visible}
            imageUrl={image}
          />

          <Card.Content style={styles.ccstyle}>
            <FAB onPress={galleryAsync} icon="image" style={styles.fstyle1} />
            <FAB onPress={cameraAsync} icon="camera" style={styles.fstyle2} />
            <FAB
              onPress={resetImage}
              icon="backup-restore"
              style={styles.fstyle3}
            />
          </Card.Content>
        </Card>
      </RBSheet>

      <TextInput
        ref={addressInput}
        label="Address details"
        mode="outlined"
        left={<TextInput.Icon name="map-marker" />}
        right={
          <TextInput.Icon
            name="pencil"
            color={theme.colors.primary}
            onPress={openLRBS}
            forceTextInputFocus={false}
          />
        }
        onBlur={getCoords}
        value={address}
        onChangeText={changeAddress}
      />

      <RBSheet
        animationType="slide"
        ref={locationRBSheet}
        height={Dimensions.get("window").height / 3}
        closeOnDragDown={true}
        customStyles={{
          container: styles.rbsheet,
        }}
      >
        <Card style={styles.rbsheet}>
          <Card.Title title="Change Location" titleStyle={styles.ctstyle} />
          <Card.Content>
            <Button
              onPress={getCurrentLocation}
              color={Colors.green600}
              icon="crosshairs-gps"
              loading={fetching}
            >
              Get Current Location
            </Button>
            <Button onPress={toggleLM} color={Colors.orange500} icon="map">
              Select Location on Map
            </Button>
            <Button onPress={toggleLA} color={Colors.pink400} icon="pencil">
              Manually edit Location
            </Button>
          </Card.Content>
        </Card>
      </RBSheet>

      <RBSheet
        animationType="slide"
        ref={MapRBSheet}
        height={Dimensions.get("window").height}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        customStyles={{
          container: styles.rbsheet,
        }}
        onClose={onCloseMapSheet}
      >
        <MapView
          onPress={mapclick}
          mapType={standard ? "standard" : "hybrid"}
          style={styles.map}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
          />
        </MapView>
        <FAB
          onPress={changeStandard}
          color={Colors.cyan100}
          icon={standard ? "map" : "earth"}
          style={styles.fstyle5}
        />

        <FAB
          onPress={closeMRBS}
          color="white"
          icon="check"
          style={styles.fstyle6}
        />
      </RBSheet>

      <TextInput
        multiline
        numberOfLines={4}
        maxLength={1000}
        label="About"
        mode="outlined"
        left={<TextInput.Icon name="information" />}
        right={<TextInput.Icon name="pencil" color={theme.colors.primary} />}
        value={about}
        onChangeText={setAbout}
      />
      <TextInput
        label="Contact"
        maxLength={40}
        mode="outlined"
        left={<TextInput.Icon name="card-account-phone" />}
        right={<TextInput.Icon name="pencil" color={theme.colors.primary} />}
        value={contact}
        onChangeText={setContact}
      />
      <Button
        style={styles.button}
        mode="contained"
        color={Colors.green600}
        icon="content-save-edit"
        loading={loading}
        onPress={submit}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

export default App;
