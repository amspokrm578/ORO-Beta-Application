import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { supabase } from './lib/supabaseClient';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };

    const fetchVideos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('videos')
          .select('id, video_url')
          .eq('user_id', user.id);
        if (data) setVideos(data);
      }
    };

    fetchProfile();
    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: supabase.storage.from('videos').getPublicUrl(item.video_url).data.publicUrl }}
        style={styles.videoThumbnail}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {profile && <Text style={styles.username}>{profile.full_name}</Text>}
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  videoThumbnail: {
    flex: 1,
    backgroundColor: '#ccc',
  },
});
