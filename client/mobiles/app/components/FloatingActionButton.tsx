import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { Colors } from '../styles/colors';

interface FloatingActionButtonProps {
  onHomePress?: () => void;
  onListPress?: () => void;
  onSettingsPress?: () => void;
  selectedTab?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onHomePress,
  onListPress,
  onSettingsPress,
  selectedTab = 0,
}) => {
  const animatedLeft = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const borderRadiusAnim = useRef(new Animated.Value(50)).current;
  
  const containerWidth = 300;
  const buttonWidth = containerWidth / 3;

  const homeIcon = require('../../assets/icons/navigation/home.png');
  const listIcon = require('../../assets/icons/navigation/log.png');
  const settingsIcon = require('../../assets/icons/navigation/setting.png');

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '130deg'],
  });

  const handlePress = (index: number, callback?: () => void) => {
    // Use useNativeDriver: false for left position (layout property)
    Animated.timing(animatedLeft, {
      toValue: index * buttonWidth,
      duration: 300,
      useNativeDriver: false
    }).start();

    // Animate borderRadius
    Animated.timing(borderRadiusAnim, {
      toValue: index === 1 ? 0 : 50,
      duration: 300,
      useNativeDriver: false
    }).start();

    // Use useNativeDriver: true for scale (transform property)
    Animated.spring(scale, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true
    }).start();
    
    if (index === 2) { // Settings button
      // Use useNativeDriver: true for rotation (transform property)
      Animated.timing(rotation, { 
        toValue: 1, 
        duration: 500, 
        useNativeDriver: true 
      }).start(() => {
        rotation.setValue(0); // Reset
      });
    }
    callback?.();
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 22,
      left: (Dimensions.get('window').width - containerWidth) / 2,
      flexDirection: 'row',
      backgroundColor: Colors.text.white,
      borderRadius: 50,
      width: containerWidth,
      height: 60,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: Colors.shadow.default,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    }}>
      <Animated.View style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: buttonWidth,
        backgroundColor: Colors.primary.pink,
        zIndex: -1,
        left: animatedLeft,
        borderRadius: borderRadiusAnim,
      }} />

      

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handlePress(0, onHomePress)}
      >
        <Image source={homeIcon} style={{ width: selectedTab === 0 ? 25 : 28, height: selectedTab === 0 ? 25 : 28, tintColor: selectedTab === 0 ? 'white' : Colors.primary.pink }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handlePress(1, onListPress)}
      >
        <Image source={listIcon} style={{ width: selectedTab === 1 ? 25 : 28, height: selectedTab === 1 ? 25 : 28, tintColor: selectedTab === 1 ? 'white' : Colors.primary.pink }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handlePress(2, onSettingsPress)}
      >
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Image source={settingsIcon} style={{ width: selectedTab === 2 ? 25 : 28, height: selectedTab === 2 ? 25 : 28, tintColor: selectedTab === 2 ? 'white' : Colors.primary.pink }} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionButton;