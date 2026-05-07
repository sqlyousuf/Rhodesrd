import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'expenses';

const initialExpenses = [
  { id: '1', work: 'Fence Metal', amount: 8600 },
  { id: '2', work: 'Fence Transport', amount: 250 },
  { id: '3', work: 'Fence Post Material Wood', amount: 5283 },
  { id: '4', work: 'Fence Screws', amount: 700 },
  { id: '5', work: 'Dumpsters', amount: 2400 },
  { id: '6', work: 'Material', amount: 270 },
  { id: '7', work: 'Roof Material', amount: 9360 },
  { id: '8', work: 'Roofer', amount: 5800 },
  { id: '9', work: 'Septic Cleaner/ Fixer', amount: 2500 },
  { id: '10', work: 'Survey', amount: 350 },
  { id: '11', work: 'Tree Cleanup', amount: 5900 },
  { id: '12', work: 'Waterwell', amount: 2865 },
  { id: '13', work: 'Gate Welder', amount: 400 },
  { id: '14', work: 'Labor Jesus', amount: 4000 },
  { id: '15', work: 'HVAC', amount: 10750 },
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
    const newExp = { id: Date.now().toString(), work: work.trim(), amount: parseFloat(amount) };
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
      <Text style={styles.title}>Rhodes Rd Expenses</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.work}>{item.work}</Text>
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
          value={work}
          onChangeText={setWork}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
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
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  total: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flex: 1,
  },
  work: {
    fontSize: 16,
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
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
  },
  form: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
