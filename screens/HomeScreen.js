import React from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

import Amplify, {
  API,
  Storage,
  Predictions,
  graphqlOperation
} from "aws-amplify";

import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import * as mutations from "../src/graphql/mutations";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

import { Ionicons } from "@expo/vector-icons";

export default class CameraScreen extends React.Component {
  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9",
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: "1280x720",
    pictureSizes: ["1280x720"],
    pictureSizeId: 0
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === "granted" });
  }

  toggleFocus = () =>
    this.setState({ autoFocus: this.state.autoFocus === "on" ? "off" : "on" });

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };

  uploadToStorage = async pathToImageFile => {
    try {
      const response = await fetch(pathToImageFile);

      const blob = await response.blob();

      const s3photo = await Storage.put("file-" + Date.now() + ".jpeg", blob, {
        contentType: "image/jpeg"
      });

      await Predictions.identify({
        text: {
          source: {
            key: s3photo.key,
            level: "public" //optional, default is the configured on Storage category
          },
          format: "PLAIN" // Available options "PLAIN", "FORM", "TABLE", "ALL"
        }
      })
        .then(async ({ text: { fullText } }) => {
          const input = {
            text: fullText
          };

          await API.graphql(graphqlOperation(mutations.match, { input: input }))
            .then(result => {
              const item = JSON.parse(result.data.match.items);

              if (typeof item.text === "undefined") {
                Alert.alert(`There was no match!`);
              } else {
                Alert.alert(
                  `Whoohoo! There was a match with ${item.text} the email has been send!`
                );
              }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

      //
    } catch (err) {
      console.log(err);
    }
  };

  handleMountError = ({ message }) => console.error(message);

  onPictureSaved = async photo => {
    this.uploadToStorage(photo.uri);
  };

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      <Text style={{ color: "white" }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
  );

  renderTopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
        <Text
          style={[
            styles.autoFocusLabel,
            { color: this.state.autoFocus === "on" ? "white" : "#6b6b6b" }
          ]}
        >
          FOCUS
        </Text>
      </TouchableOpacity>
    </View>
  );

  renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.takePicture}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        onCameraReady={this.collectPictureSizes}
        type={this.state.type}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
      >
        {this.renderTopBar()}
        {this.renderBottomBar()}
      </Camera>
    </View>
  );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    return <View style={styles.container}>{cameraScreenContent}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  camera: {
    flex: 1,
    justifyContent: "space-between"
  },
  topBar: {
    flex: 0.2,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Constants.statusBarHeight / 2
  },
  bottomBar: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    flex: 0.12,
    flexDirection: "row"
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },

  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
