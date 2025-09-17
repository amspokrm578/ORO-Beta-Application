import React, { useState } from 'react';
import { View, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './lib/supabaseClient';
import { decode } from 'base64-arraybuffer';

export default function UploadScreen() {
  const [video, setVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [description, setDescription] = useState('');

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      Alert.alert('Please select a video first.');
      return;
    }

    const { uri } = video;
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const fileName = `${Date.now()}.mp4`;
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, decode(Buffer.from(arrayBuffer).toString('base64')), {
        contentType: 'video/mp4',
      });

    if (error) {
      Alert.alert('Error uploading video: ', error.message);
    } else {
      Alert.alert('Video uploaded successfully!');
      // Now, insert the video metadata into the 'videos' table
      const { data: videoData, error: videoError } = await supabase.from('videos').insert({
        video_url: data.path,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        description: description,
      });

      if (videoError) {
        Alert.alert('Error saving video metadata: ', videoError.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a video from camera roll" onPress={pickVideo} />
      <TextInput
        style={styles.input}
        placeholder="Add a description..."
        value={description}
        onChangeText={setDescription}
      />
      {video && <Button title="Upload Video" onPress={uploadVideo} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
});
