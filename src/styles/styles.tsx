import { StyleSheet } from "react-native";
import Colors from "./colors";

const Styles = StyleSheet.create({
  container: {
    marginBottom: 42,
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16
  },
  subTitle: {
    fontWeight: 'bold'
  },
  inputText: {
    borderColor: Colors.INPUT_BORDER_COLOR,
    borderWidth: 1,
    margin: 24,
    paddingVertical: 8,
    paddingHorizontal: 16
  }
});

export default Styles;