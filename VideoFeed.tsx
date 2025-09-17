import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import VideoPlayer from './VideoPlayer';
import { supabase } from './lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';

export default function VideoFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.from('videos').select('*, profiles(full_name)');
      if (data) {
        const videoData = data.map((video) => ({
          ...video,
          videoUri: supabase.storage.from('videos').getPublicUrl(video.video_url).data.publicUrl,
        }));
        setVideos(videoData);
      }
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.videoContainer}>
      <VideoPlayer videoUri={item.videoUri} />
      <View style={styles.overlay}>
        <Text style={styles.username}>{item.profiles.full_name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      style={styles.container}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos yet. Be the first to upload one!</Text>
          <Button title="Upload Video" onPress={() => (navigation as any).navigate('Upload')} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
});
