import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MedicationsScreen from './src/screens/MedicationsScreen';
import { T } from './src/theme/tokens';

// App de tela unica (UC14 / RF14): gerenciamento de medicamentos do pet.
// Consome a API NestJS em codigo/ (o backend nao e alterado).
export default function App() {
  return (
    <SafeAreaView style={s.safe}>
      <MedicationsScreen />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.turf },
});
