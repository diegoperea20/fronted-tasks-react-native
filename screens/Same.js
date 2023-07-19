import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// Conection to backend flask
import { API_URL } from '@env';

function Same() {
  const task = () => {
    navigation.navigate('Task');
  };

  const [user, setUser] = useState('');
  const [sameCount, setSameCount] = useState([]);
  const [emailsc, setEmailsc] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        navigation.replace('/');
      } else {
        setUser(storedUser);
      }
    };

    fetchData();
  }, []);

  const getSameCount = async (user) => {
    const response = await fetch(`${API_URL}/tasks/countsames/${user}`);
    const data = await response.json();
    console.log(data);
    setSameCount(data);
    if (data && data.message === 'Ningún título coincide con otros usuarios.') {
      window.alert('Ningún título coincide con otros usuarios.');
    }
  };

  const getemails = async (user) => {
    const response = await fetch(`${API_URL}/tasks/countsame/${user}`);
    const data = await response.json();
    console.log(data);
    setEmailsc(data);
    if (data && data.message === 'Ningún título coincide con otros usuarios.') {
      window.alert('Ningún título coincide con otros usuarios.');
    }
  };

  return (
    <View style={styles.darkTheme}>
      <Text style={styles.title}>Same</Text>
      <TouchableOpacity style={styles.button} onPress={task}>
        <Text style={styles.buttonText}>Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => getSameCount(user)}>
        <Text style={styles.buttonText}>Count People Same title</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => getemails(user)}>
        <Text style={styles.buttonText}>People Emails same title</Text>
      </TouchableOpacity>
      <ScrollView style={styles.tableContainer}>
        {sameCount.length > 0 && (
          <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Number of titles</Text>
            <Text style={styles.tableCell}>Titles</Text>
          </View>
          {sameCount.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{item['Number of titles']}</Text>
              <Text style={styles.tableCell}>{item.title}</Text>
            </View>
          ))}
        </View>
        
        )}
        {emailsc.length > 0 && (
          <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Emails</Text>
            <Text style={styles.tableCell}>Title</Text>
          </View>
          {emailsc.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.emails[0]}</Text>
                <Text style={styles.tableCell}>{item.title}</Text>
              </View>
              {item.emails.slice(1).map((email, i) => (
                <View style={styles.tableRow} key={`${index}-${i}`}>
                  <Text style={styles.tableCell} />
                  <Text style={styles.tableCell}>{email}</Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>
        
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    width: '80%',
    marginBottom: 20,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
});

export default Same;
