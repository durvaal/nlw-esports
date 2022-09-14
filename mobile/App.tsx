import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TitleProps {
  value: string;
  backgroundColor: string;
};

function Title(props: TitleProps) {
  return (
    <TouchableOpacity>
      <Text style={{ backgroundColor: props.backgroundColor }}>{props.value}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Title value="Hello" backgroundColor="green" />
      <Title value="World" backgroundColor="purple" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
