import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Auth } from "aws-amplify";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/Login";

const Stack = createStackNavigator();

export default class Navigator extends React.Component {
  //export default async function AppNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  state = {
    user: "not authenticated"
  };

  async componentDidMount() {
    await Auth.currentAuthenticatedUser({
      bypassCache: true // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(async user => {
        this.setState({ user: user });
      })
      .catch(err => {
        // Is NOT logged in
        console.log(err);
      });
  }

  render() {
    const user = this.state.user;
    return (
      <Stack.Navigator>
        {user === "not authenticated" ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{
              title: "Sign in"
              // When logging out, a pop animation feels intuitive
            }}
          />
        ) : (
          // User is signed in
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    );
  }
}
