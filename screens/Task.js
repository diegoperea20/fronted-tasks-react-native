import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conection to backend flask
import { API_URL } from '@env';

function Task() {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const getData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
        navigation.replace('/');
      } else {
        // Si se encuentra el nombre de usuario, establecer el estado del usuario
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
      }
    };

    getData();
  }, []);

  const same = () => {
    navigation.navigate('Same');
  };

  const home = () => {
    navigation.navigate('Home');
  };

  //tasks
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editing, setEditing] = useState(false);
  const [id_task, setId_task] = useState('');

  const [tasks, setTasks] = useState([]);

  const handleSubmit = async () => {
    if (!editing) {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          title,
          description,
        }),
      });
      const data = await response.json();
      console.log(data);
      setTitle('');
      setDescription('');
    } else {
      const response = await fetch(`${API_URL}/tasks/${id_task}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          title,
          description,
        }),
      });
      const data = await response.json();
      console.log(data);
      setEditing(false);
      setId_task('');
      setTitle('');
      setDescription('');
    }

    await getTasks(user);
  };

  const getTasks = async (user) => {
    const response = await fetch(`${API_URL}/tasks/${user}`);
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks(user);
  }, );

  const deleteTask = async (id_task) => {
    const response = await fetch(`${API_URL}/tasks/${id_task}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log(data);
    await getTasks(user);
  };

  const editTask = async (id_task, user) => {
    const response = await fetch(`${API_URL}/tasks/${id_task}/${user}`);
    const data = await response.json();
    console.log(data);

    // Verifica que la respuesta contenga al menos un objeto
    if (data.length > 0) {
      const task = data[0];

      // Captura el id y title desde el objeto task
      const id = task.id || '';
      const title = task.title || '';

      setEditing(true);
      setId_task(id_task);
      setTitle(title);
      setDescription(task.description || ''); // Asegurar que el valor esté definido
    }
  };

  const canceledit = () => {
    setEditing(false);
    setTitle('');
    setDescription('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <View style={styles.tableRow}>
        <Text style={styles.tableHeader}>Title</Text>
        <Text style={styles.tableHeader}>Description</Text>
        <Text style={styles.tableHeader}>Operations</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableData}>{item.title}</Text>
        <Text style={styles.tableData}>{item.description}</Text>
        <View style={styles.taskButtons}>
          <Button title="Edit" onPress={() => editTask(item.id, item.user)} />
          <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteTask(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task</Text>
      <Button title="Same" onPress={same} />
      <Button title="Home" onPress={home} />
      <View style={styles.form}>
        <Text style={styles.subtitle}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTitle(text)}
          value={title}
          placeholder="Add a title"
          autoFocus
        />

        <Text style={styles.subtitle}>Description</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder="Add a description"
        />

        <Button title={editing ? 'Update' : 'Create'} onPress={handleSubmit} />

        {editing && <Button title="Cancel Edit" onPress={canceledit} />}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.taskList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  form: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  taskContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  tableData: {
    flex: 1,
    color: '#333',
  },
  taskButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonDelete: {
    backgroundColor: 'red',
    borderRadius: 5,
    marginLeft: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
  },
  taskList: {
    flex: 1,
  },
});

export default Task;
