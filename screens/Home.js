import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conection to backend flask
import { API_URL } from '@env';

function Home({ navigation }) {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const getData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
        navigation.replace('Login'); // Asegúrate de tener una pantalla llamada 'Login' en tu navegación
      } else {
        // Si se encuentra el nombre de usuario, establecer el estado del usuario
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
      }
    };

    getData();
  }, []);

  const handleLogout = async () => {
    // Eliminar el token y el nombre de usuario del almacenamiento local al cerrar sesión
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Redireccionar al inicio de sesión después de cerrar sesión
    navigation.replace('Login'); // Asegúrate de tener una pantalla llamada 'Login' en tu navegación
  };

  const changePassword = () => {
    // Redireccionar a la página de cambio de contraseña y pasar los datos necesarios como parámetros de navegación
    navigation.navigate('ChangePassword', {
      user,
      id,
      token,
    }); // Asegúrate de tener una pantalla llamada 'ChangePassword' en tu navegación
  };

  const deleteAccount = async () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Desea eliminar la cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/loginup/${id}`, {
                method: 'DELETE',
              });
  
              const deleteAll = await fetch(`${API_URL}/tasks/deleteall/${user}`, {
                method: 'DELETE',
              });
  
              if (response.status === 200 && deleteAll.status === 200) {
                // La cuenta se ha eliminado correctamente
                Alert.alert('Cuenta eliminada correctamente');
                // Realiza la navegación a la pantalla de inicio de sesión (asegúrate de tenerla en tu navegación)
                navigation.replace('Login');
              } else {
                // Ocurrió un error al eliminar la cuenta
                console.log('Error al eliminar la cuenta');
                Alert.alert('Error al eliminar la cuenta');
              }
            } catch (error) {
              console.log('Error:', error);
            }
          },
        },
      ]
    );
  };

  const task = () => {
    navigation.navigate('Task'); // Asegúrate de tener una pantalla llamada 'CreateTask' en tu navegación
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome: {user} ! , ID:{id}</Text>
      <View style={styles.button}>
      <Button title="Logout" onPress={handleLogout} />
      </View>
      <View style={styles.button}>
      <Button title="Change Password" onPress={changePassword} />
        </View>
      <View style={styles.button}>
      <Button title="Delete Account" onPress={deleteAccount} />
      </View>
      <View style={styles.button}>
      <Button title="Create Task" onPress={task} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    padding: 15,
    
  },
  
});

export default Home;
//npm install @react-native-async-storage/async-storage
