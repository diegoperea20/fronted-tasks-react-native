import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conection to backend flask
import { API_URL } from '@env';

function Changepassword() {
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [password, setNewPassword] = useState('');
  const [email, setEmail] = useState('');

  const [same_password, setSame_password] = useState('');

  const [error, setError] = useState('');

  const navigation = useNavigation();

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const requirements = [
      /\d/,
      /[a-z]/,
      /[A-Z]/,
      /[!@#$%^&*]/,
      /.{8,}/,
      /\S/,
    ];
    const errorMessages = [
      'Debe incluir al menos un número.',
      'Debe incluir al menos una letra minúscula.',
      'Debe incluir al menos una letra mayúscula.',
      'Debe incluir al menos un carácter especial.',
      'La longitud de la contraseña debe ser igual o mayor a 8 caracteres.',
      'No debe contener espacios en blanco.',
    ];

    const errors = [];
    for (let i = 0; i < requirements.length; i++) {
      if (!requirements[i].test(value)) {
        errors.push(errorMessages[i]);
      }
    }

    if (errors.length > 0) {
      setError(errors.join(' '));
    } else {
      setError('');
    }
  };

  const getEmail = async (id) => {
    const response = await fetch(`${API_URL}/loginup/${id}`);

    if (response.ok) {
      const user = await response.json();
      setEmail(user.email);
    } else {
      console.log('Error al obtener el email');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedId = await AsyncStorage.getItem('id');
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedUser && !storedId) {
        navigation.replace('/');
      } else {
        setUser(storedUser);
        setId(storedId);
        setToken(storedToken);
        getEmail(storedId);
      }
    };

    fetchData();
  }, []);

  const Home = () => {
    navigation.replace('Home');
  };

  const handleSubmit = async () => {
    if (password !== same_password) {
      window.alert('Las contraseñas no coinciden');
      return;
    }

    const response = await fetch(`${API_URL}/loginup/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        email,
        password,
      }),
    });

    if (response.status === 200) {
      setNewPassword('');
      setSame_password('');
      console.log('Contraseña modificada correctamente');
      window.alert('Contraseña modificada correctamente');
    } else {
      console.log('Error al modificar la contraseña');
    }
  };

  return (
    <View style={styles.darkTheme}>
      <Text style={styles.title}>Changepassword, {user} , ID:{id}!</Text>
      <Button title="Home" onPress={Home} />
      <View style={styles.form}>
        <Text style={styles.subtitle}>New Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setNewPassword(text);
            validatePassword(text);
          }}
          value={password}
          placeholder="NewPassword"
          secureTextEntry
        />
        {error !== '' && <Text style={styles.errorMessage}>{error}</Text>}
        <Text style={styles.subtitle}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSame_password(text)}
          value={same_password}
          placeholder="Validation Password"
          secureTextEntry
        />
        <Text style={styles.subtitle}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder={email}
        />
        <Button title="Update" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  form: {
    width: '80%',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#fff', // Establecer el color de texto en blanco
  },
  errorMessage: {
    color: 'yellow',
    marginTop: 10,
  },
});

export default Changepassword;
