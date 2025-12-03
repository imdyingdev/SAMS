import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What is SAMS?',
    answer: 'SAMS (Student Attendance Management System) is a mobile application designed to help administrators and teachers track student attendance efficiently using RFID technology.'
  },
  {
    question: 'How do I scan RFID cards?',
    answer: 'Navigate to the Calendar screen and tap on a date to view attendance logs. RFID cards are scanned automatically by the RFID reader connected to the system.'
  },
  {
    question: 'How can I view attendance logs?',
    answer: 'Go to the Calendar screen and select any date to view all attendance logs for that day. You can see time-in and time-out records for all students.'
  },
  {
    question: 'How do I update my profile?',
    answer: 'Tap on your avatar in the header or go to Settings > tap your avatar to access your Personal Details screen where you can update your information.'
  },
  {
    question: 'Can I change my password?',
    answer: 'Yes! Go to Settings > Privacy & Security > Change Password. You will need to verify your email address with a code before changing your password.'
  },
  {
    question: 'What if I forget my password?',
    answer: 'On the login screen, tap "Forgot Password". Enter your email address to receive a verification code, then you can set a new password.'
  },
  {
    question: 'How do I view my active sessions?',
    answer: 'Go to Settings > Privacy & Security > Active Sessions to see all devices where you are currently logged in, along with the date and time of each session.'
  },
  {
    question: 'Can I change my email address?',
    answer: 'Yes, you can change your email in your Personal Details screen. You will receive a verification code to your new email address for confirmation.'
  },
  {
    question: 'How do I log out?',
    answer: 'Go to Settings and tap the "Log Out" button at the bottom. You will be asked to confirm before logging out.'
  },
  {
    question: 'Who can I contact for technical support?',
    answer: 'For technical support or issues with the app, please contact your school administrator or the SAMS support team at your institution.'
  }
];

export default function FAQsScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={Colors.text.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                <FontAwesome
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={Colors.text.whiteMuted}
                />
              </TouchableOpacity>
              
              {expandedIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.whiteMuted,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqItem: {
    backgroundColor: Colors.glass.overlay2,
    borderWidth: 1,
    borderColor: Colors.glass.overlay1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  questionText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.text.white,
    marginRight: Spacing.sm,
  },
  answerContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.glass.overlay1,
  },
  answerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.whiteMuted,
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
});
