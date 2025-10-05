import React from 'react';
import { Alert, ImageBackground, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from './lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      Alert.alert(error.message);
    } else if (user) {
        const { error: insertError } = await supabase.from('profiles').insert({ id: user.id, full_name: fullName });
        if (insertError) {
            Alert.alert(insertError.message);
        }
    }
    setLoading(false);
  }

  return (
    <ImageBackground
      source={require('./assets/LoginScreen.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>ORO</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          autoCapitalize={'none'}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          placeholderTextColor="#aaa"
        />
        <View style={styles.verticallySpaced}>
          <Text>Full Name</Text>
          <TextInput
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            placeholder="Full Name"
            autoCapitalize={'words'}
            style={styles.input} />
        </View>
        <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFD700', // Gold color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
