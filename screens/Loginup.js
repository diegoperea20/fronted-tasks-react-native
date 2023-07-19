import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Conection to backend flask
import { API_URL } from '@env';


const Loginup = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [same_password, setSame_password] = useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    if (password !== same_password) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (user === '' || email === '' || password === '') {
      alert('Todos los campos son obligatorios');
      return;
    }
    const response = await fetch(`${API_URL}/loginup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        password,
        email,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setUser('');
      setEmail('');
      setPassword('');
      setError('');
      setSame_password('');
      alert('Usuario creado');
      navigation.navigate('Login');
    } else {
      setError(data.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login UP</Text>
      <View style={styles.formContainer}>
        <Text style={styles.subtitles} >Username</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUser(text)}
          value={user}
          placeholder="Username"
          autoFocus
        />

        <Text style={styles.subtitles} >Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text);
          }}
          value={password}
          placeholder="Password"
          secureTextEntry
        />

        {error !== '' && <Text style={styles.errorMessage}>{error}</Text>}

        <Text style={styles.subtitles} >Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSame_password(text)}
          value={same_password}
          placeholder="Validation Password"
          secureTextEntry
        />

        <Text style={styles.subtitles} >Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Button
          title="Register"
          disabled={error.length > 0 && error !== 'User already exists'}
          onPress={handleSubmit}
        />
      </View>

      <Text style={styles.subtitles} onPress={() => navigation.navigate('Login')}>Login In</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'System',
  },
  formContainer: {
    paddingBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: 'System',
    backgroundColor: 'white',
  },
  errorMessage: {
    color: 'yellow',
    marginTop: 10,
    fontFamily: 'System',
  },
  subtitles: {
    color: 'white',
  }
});

export default Loginup;
//Varibale entorno  https://www.youtube.com/watch?v=qi8Op1ihD0E
//npm install react-native-dotenv