import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'expenses';

const formatDate = (date = new Date()) => date.toLocaleDateString();

const initialExpenses = [
  { id: '1', work: 'Fence Metal', amount: 8600, date: formatDate() },
  { id: '2', work: 'Fence Transport', amount: 250, date: formatDate() },
  { id: '3', work: 'Fence Post Material Wood', amount: 5283, date: formatDate() },
  { id: '4', work: 'Fence Screws', amount: 700, date: formatDate() },
  { id: '5', work: 'Dumpsters', amount: 2400, date: formatDate() },
  { id: '6', work: 'Material', amount: 270, date: formatDate() },
  { id: '7', work: 'Roof Material', amount: 9360, date: formatDate() },
  { id: '8', work: 'Roofer', amount: 5800, date: formatDate() },
  { id: '9', work: 'Septic Cleaner/ Fixer', amount: 2500, date: formatDate() },
  { id: '10', work: 'Survey', amount: 350, date: formatDate() },
  { id: '11', work: 'Tree Cleanup', amount: 5900, date: formatDate() },
  { id: '12', work: 'Waterwell', amount: 2865, date: formatDate() },
  { id: '13', work: 'Gate Welder', amount: 400, date: formatDate() },
  { id: '14', work: 'Labor Jesus', amount: 4000, date: formatDate() },
  { id: '15', work: 'HVAC', amount: 10750, date: formatDate() },
];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [work, setWork] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    const sum = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0);
    setTotal(sum);
    saveExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExpenses(JSON.parse(stored));
      } else {
        setExpenses(initialExpenses);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  };

  const addExpense = () => {
    if (!work.trim() || !amount.trim()) return;
    const newExp = {
      id: Date.now().toString(),
      work: work.trim(),
      amount: parseFloat(amount),
      date: formatDate(),
    };
    setExpenses([...expenses, newExp]);
    setWork('');
    setAmount('');
  };

  const editExpense = (id) => {
    const exp = expenses.find(e => e.id === id);
    setWork(exp.work);
    setAmount(exp.amount.toString());
    setEditingId(id);
  };

  const updateExpense = () => {
    if (!work.trim() || !amount.trim()) return;
    setExpenses(expenses.map(e => e.id === editingId ? { ...e, work: work.trim(), amount: parseFloat(amount) } : e));
    setWork('');
    setAmount('');
    setEditingId(null);
  };

  const deleteExpense = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'OK', onPress: () => setExpenses(expenses.filter(e => e.id !== id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={[styles.stripe, styles.stripe1]} />
        <View style={[styles.stripe, styles.stripe2]} />
        <View style={[styles.stripe, styles.stripe3]} />
        <View style={[styles.stripe, styles.stripe4]} />
      </View>
      <View style={styles.cautionTape}>
        <Text style={styles.cautionText}>CONSTRUCTION MODE</Text>
      </View>
      <Text style={styles.title}>Rhodes Rd</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.work}>{item.work}</Text>
              <Text style={styles.date}>{item.date || formatDate()}</Text>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => editExpense(item.id)} style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.button}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
      />
      <View style={styles.form}>
        <TextInput
          placeholder="Work done"
          placeholderTextColor="#4d342d"
          value={work}
          onChangeText={setWork}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#4d342d"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title={editingId ? "Update" : "Add"} onPress={editingId ? updateExpense : addExpense} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0b72d',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
    color: '#2d1f0f',
  },
  total: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 22,
    color: '#2d1f0f',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  work: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#5b4630',
    marginBottom: 6,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2d1f0f',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#f1c40f',
    fontWeight: '700',
  },
  form: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4d342d',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0b72d',
  },
  stripe: {
    position: 'absolute',
    width: '180%',
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.08)',
    transform: [{ rotate: '-22deg' }],
  },
  stripe1: {
    top: -40,
    left: -110,
  },
  stripe2: {
    top: 70,
    left: -60,
  },
  stripe3: {
    top: 180,
    left: -150,
  },
  stripe4: {
    top: 290,
    left: -20,
  },
  cautionTape: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#333',
    borderBottomWidth: 3,
    borderBottomColor: '#f5d46b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cautionText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
