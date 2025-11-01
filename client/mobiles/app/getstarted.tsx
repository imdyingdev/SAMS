import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { getStartedStyles } from './styles/getstarted.styles';
import { useFonts } from './hooks/useFonts';

const onboardingData = [
  {
    animation: require('../assets/animations/CalendarAnimation.json'),
    title: "Ready to view your students' attendance records instantly?\nLet's get started!",
    speed: 0.25,
    animationStyle: 'calendarAnimation',
  },
  {
    animation: require('../assets/animations/CheckList.json'),
    title: "Access detailed attendance reports and student data anytime, anywhere!",
    speed: 1,
    animationStyle: 'checklistAnimation',
  },
];

export default function GetStartedScreen() {
  const fontsLoaded = useFonts();
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentData = onboardingData[currentPage];

  return (
    <SafeAreaView style={getStartedStyles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      
      {/* Skip Button */}
      <View style={getStartedStyles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={getStartedStyles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <View style={getStartedStyles.content}>
        {/* Center Content with Animation */}
        <View style={getStartedStyles.centerContent}>
          <LottieView
            source={currentData.animation}
            style={currentData.animationStyle === 'calendarAnimation' 
              ? getStartedStyles.calendarAnimation 
              : getStartedStyles.checklistAnimation}
            autoPlay
            loop
            speed={currentData.speed}
          />
          <Text style={getStartedStyles.mainText}>
            {currentData.title}
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={getStartedStyles.bottomSection}>
          {/* Slider Dots */}
          <View style={getStartedStyles.dotsContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  getStartedStyles.dot,
                  index === currentPage
                    ? getStartedStyles.activeDot
                    : getStartedStyles.inactiveDot,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={getStartedStyles.getStartedButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={getStartedStyles.getStartedButtonText}>
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
