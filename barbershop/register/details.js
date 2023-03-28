import React from "react";
import { Dimensions, ScrollView, View } from "react-native";

import {
  Text,
  TextInput,
  Button,
  Avatar,
  Card,
  FAB,
  Colors,
} from "react-native-paper";

import { connect } from "react-redux";
import { details } from "../redux/actions/actions";

import RBSheet from "react-native-raw-bottom-sheet";

import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";

import * as Animatable from "react-native-animatable";

import styles, { backgroundcolor } from "../styles";
import { cameraImageAsync, galleryImageAsync } from "../utils/getassets";

class Details extends React.Component {
  state = {
    image: "",
    lat: "",
    lng: "",
    location: "",
    about: "",
    contact: "",
    animating: false,
    addressChanged: false,
    standard: true,
    mapClicked: false,
  };

  changeLocation = (location) => {
    this.setState({ location, addressChanged: true });
  };

  changeAbout = (about) => {
    this.setState({ about });
  };

  changeContact = (contact) => {
    this.setState({ contact });
  };

  galleryAsync = async () => {
    let image = await galleryImageAsync();
    if (image) {
      this.setState({ image });
      this.ImageRBSheet.close();
    }
  };

  cameraAsync = async () => {
    let image = await cameraImageAsync();
    if (image) {
      this.setState({ image });
      this.ImageRBSheet.close();
    }
  };

  removeImage = () => {
    this.setState({ image: "" });
    this.ImageRBSheet.close();
  };

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permissions denied");
      return;
    }

    this.setState({ animating: true });
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const { latitude, longitude } = location.coords;
    this.setState({ lat: latitude, lng: longitude }, this.reverseGeoCodeAsync);
    this.setState({ animating: false });
  };

  reverseGeoCodeAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permissions denied");
      return;
    }

    let location = await Location.reverseGeocodeAsync({
      latitude: this.state.lat,
      longitude: this.state.lng,
    });

    let loc = Object.values(location[0]).join(" ");

    let modifiedLoc = Array.from(new Set(loc.split(" "))).join(" ");
    this.setState({ location: modifiedLoc });
  };

  geoCodeAsync = async () => {
    if (this.state.addressChanged && this.state.location.length > 0) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permissions denied");
        return;
      }
      this.setState({ animating: true });
      let coords = await Location.geocodeAsync(this.state.location);

      if (coords.length > 0) {
        const { latitude, longitude } = coords[0];
        this.setState({
          lat: latitude,
          lng: longitude,
        });
      } else {
        alert("Please provide a valid address.");
      }
      this.setState({ animating: false, addressChanged: false });
    }
  };

  onCloseMapSheet = () => {
    if (this.state.mapClicked) {
      this.reverseGeoCodeAsync();
      this.setState({ mapClicked: false });
    }
  };

  submit = () => {
    const { image, lat, lng, location, about, contact } = this.state;

    const profile = {
      lat,
      lng,
      location,
      about,
      contact,
    };

    this.props.details(image, profile);
  };

  render() {
    const { image, lat, lng, location, about, contact, animating, standard } =
      this.state;

    const { error } = this.props;
    return (
      <ScrollView
        style={styles.sstyle}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View
          useNativeDriver={true}
          animation="bounceIn"
          style={styles.astyle}
        >
          <Text style={styles.tstyle1}>Last step and you are DONE!</Text>
        </Animatable.View>
        <Animatable.View useNativeDriver={true} animation="fadeInUpBig">
          <Card style={styles.cstyle1} elevation={0}>
            <View style={styles.vstyle1}>
              <Card.Title
                title="Profile"
                titleStyle={styles.title}
                left={() => (
                  <Avatar.Icon
                    icon="card-account-details"
                    size={30}
                    style={styles.heading}
                  />
                )}
              />

              <View style={styles.view7}>
                {(image && (
                  <Avatar.Image
                    source={{ uri: image }}
                    size={150}
                    style={styles.avatar}
                  />
                )) || (
                  <Avatar.Icon
                    size={150}
                    icon="account"
                    style={styles.avatar}
                  />
                )}

                <FAB
                  onPress={() => this.ImageRBSheet.open()}
                  icon="camera"
                  style={styles.fab}
                />
              </View>
              <RBSheet
                animationType="slide"
                ref={(ref) => {
                  this.ImageRBSheet = ref;
                }}
                height={Dimensions.get("window").height / 5}
                closeOnDragDown={true}
                customStyles={{
                  container: styles.rbsheet,
                }}
              >
                <Card style={styles.rbsheet}>
                  <Card.Title
                    title="Add Profile photo"
                    titleStyle={{ color: "cyan" }}
                  />
                  <Card.Content style={styles.ccstyle}>
                    <FAB
                      onPress={this.galleryAsync}
                      icon="image"
                      style={styles.fstyle1}
                    />
                    <FAB
                      onPress={this.cameraAsync}
                      icon="camera"
                      style={styles.fstyle2}
                    />
                    <FAB
                      onPress={this.removeImage}
                      icon="delete"
                      style={styles.fstyle3}
                    />
                  </Card.Content>
                </Card>
              </RBSheet>

              <Text style={styles.tstyle2}>
                {error ? (error.image ? error.image : "") : ""}
              </Text>

              <View>
                <View
                  style={{
                    alignSelf: "flex-end",
                  }}
                ></View>
                <TextInput
                  mode="outlined"
                  value={location}
                  onChangeText={this.changeLocation}
                  label="Address details"
                  left={<TextInput.Icon name="map-marker" />}
                  right={
                    <TextInput.Icon
                      color={animating ? "grey" : backgroundcolor}
                      name={animating ? "dots-horizontal" : "crosshairs-gps"}
                      onPress={!animating ? this.getLocationAsync : null}
                    />
                  }
                  onBlur={this.geoCodeAsync}
                  error={error ? (error.location ? true : false) : false}
                />
              </View>
              <View style={styles.vstyle2}>
                <Text style={styles.error}>
                  {error ? (error.location ? error.location : "") : ""}
                </Text>
                <FAB
                  onPress={() => this.MapRBSheet.open()}
                  color="white"
                  icon="map-search"
                  label="Show Map"
                  style={styles.fstyle4}
                />
              </View>

              <RBSheet
                animationType="slide"
                ref={(ref) => {
                  this.MapRBSheet = ref;
                }}
                height={Dimensions.get("window").height}
                closeOnDragDown={true}
                dragFromTopOnly={true}
                customStyles={{
                  container: styles.rbsheet,
                }}
                onClose={this.onCloseMapSheet}
              >
                <MapView
                  onPress={(e) => {
                    this.setState({
                      mapClicked: true,
                      lat: e.nativeEvent.coordinate.latitude,
                      lng: e.nativeEvent.coordinate.longitude,
                    });
                  }}
                  mapType={standard ? "standard" : "hybrid"}
                  style={styles.map}
                >
                  <Marker
                    coordinate={{
                      latitude: lat ? lat : 0,
                      longitude: lng ? lng : 0,
                    }}
                  />
                </MapView>

                <FAB
                  onPress={() =>
                    this.setState((prevState) => ({
                      standard: !prevState.standard,
                    }))
                  }
                  color={Colors.cyan100}
                  icon={standard ? "map" : "earth"}
                  style={styles.fstyle5}
                />

                <FAB
                  onPress={() => this.MapRBSheet.close()}
                  color="white"
                  icon="check"
                  style={styles.fstyle6}
                />
              </RBSheet>

              <TextInput
                maxLength={1000}
                mode="outlined"
                value={about}
                onChangeText={this.changeAbout}
                label="About"
                left={<TextInput.Icon name="information-variant" />}
                right={<TextInput.Affix text={`${1000 - about.length}/1000`} />}
                multiline
                numberOfLines={5}
                error={error ? (error.about ? true : false) : false}
              />
              <Text style={styles.error}>
                {error ? (error.about ? error.about : "") : ""}
              </Text>

              <TextInput
                mode="outlined"
                value={contact}
                onChangeText={this.changeContact}
                label="Contact"
                maxLength={40}
                left={<TextInput.Icon name="card-account-phone" />}
                error={error ? (error.contact ? true : false) : false}
              />
              <Text style={styles.error}>
                {error ? (error.contact ? error.contact : "") : ""}
              </Text>

              <Text style={styles.error}>
                {error ? (error.message ? error.message : "") : ""}
              </Text>
              <Button
                onPress={() => this.submit()}
                mode="contained"
                icon="login"
                style={styles.button}
                color={error ? Colors.red700 : backgroundcolor}
              >
                Complete Registration
              </Button>
            </View>
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.errorReducer.error,
});

export default connect(mapStateToProps, { details })(Details);
