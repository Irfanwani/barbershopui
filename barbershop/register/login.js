import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  TextInput,
  Text,
  Button,
  Colors,
  Card,
  Avatar,
} from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/actions";

import styles, { backgroundcolor } from "../styles";

import * as Animatable from "react-native-animatable";

const Login = ({ navigation }) => {
  const { error } = useSelector((state) => ({
    error: state.errorReducer.error,
  }));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const dispatch = useDispatch();

  const changeUsername = (username) => {
    setUsername(username);
  };

  const changePassword = (password) => {
    setPassword(password);
  };

  const submit = () => {
    dispatch(login({ username, password }));
  };

  const gotoPasswordReset = () => {
    navigation.navigate("passwordreset");
  };

  const gotoRegister = () => {
    navigation.navigate("register");
  };

  const changeHide = () => {
    setHidePassword((prev) => !prev);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.sstyle}
      showsVerticalScrollIndicator={false}
    >
      {/* <Animatable.View
        useNativeDriver={true}
        animation="bounceIn"
        style={styles.astyle2}
      >
        <Avatar.Image
          style={styles.sstyle}
          source={require("../../assets/icon.png")}
          size={150}
        />
      </Animatable.View> */}

      <Animatable.View useNativeDriver={true} animation="fadeInUpBig">
        <Card elevation={0} style={styles.card}>
          <Card.Title
            title="Login"
            titleStyle={styles.title}
            left={() => (
              <Avatar.Icon icon="login" size={30} style={styles.heading} />
            )}
          />
          <View style={styles.vstyle1}>
            <Text style={styles.error}>
              {error
                ? error.non_field_errors
                  ? error.non_field_errors
                  : ""
                : ""}
            </Text>

            <TextInput
              mode="outlined"
              value={username}
              onChangeText={changeUsername}
              label="Username"
              left={<TextInput.Icon name="account" />}
              error={error ? (error.username ? true : false) : false}
            />
            <Text style={styles.error}>
              {error ? (error.username ? error.username : "") : ""}
            </Text>

            <TextInput
              mode="outlined"
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={changePassword}
              label="Password"
              left={<TextInput.Icon name="lock" />}
              right={
                <TextInput.Icon
                  name={hidePassword ? "eye-off" : "eye"}
                  onPress={changeHide}
                />
              }
              error={error ? (error.password ? true : false) : false}
              keyboardType={hidePassword ? undefined : "visible-password"}
            />

            <View style={styles.vstyle2}>
              <Text style={styles.error}>
                {error ? (error.password ? error.password : "") : ""}
              </Text>

              <TouchableOpacity
                onPress={gotoPasswordReset}
                style={styles.forgot}
              >
                <Text style={styles.tstyle4}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              onPress={submit}
              style={styles.button}
              mode="contained"
              icon="login"
              color={error ? Colors.red700 : backgroundcolor}
            >
              Login
            </Button>

            <Text style={styles.tstyle5}>Don't have an account? </Text>
            <Button
              style={styles.movebutton}
              onPress={gotoRegister}
              labelStyle={styles.bstyle1}
            >
              Register Here!
            </Button>
          </View>
        </Card>
      </Animatable.View>
    </ScrollView>
  );
};

export default Login;
