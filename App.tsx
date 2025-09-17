import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { supabase } from './lib/supabaseClient';
import Auth from './Auth';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {session && session.user ? <MainTabs /> : <Auth />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
