import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BorderRadius, Colors } from '../styles/colors';

interface CalendarEvent {
  date: string; // Format: 'YYYY-MM-DD'
  title: string;
  color?: string;
}

interface ActivityItem {
  day: number;
  month: string;
  time: string;
  dayOfWeek: string;
  status: string;
}

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  events?: CalendarEvent[];
  activityData?: ActivityItem[];
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  events: externalEvents = [],
  activityData,
  selectedDate,
  minDate,
  maxDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(selectedDate || null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({ visible: false, text: '', x: 0, y: 0 });
  const [calendarWidth, setCalendarWidth] = useState(0);

  // Animation values
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Start animation when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset animation values to starting position
      translateY.setValue(12);
      opacity.setValue(0.5);

      // Start animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  // Sample activity data for calendar coloring
  const sampleActivityData = [
    { day: 1, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Wednesday', status: 'Time In' },
    { day: 1, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Wednesday', status: 'Time Out' },

    { day: 2, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Thursday', status: 'Time In' },
    { day: 2, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Thursday', status: 'Time Out' },

    { day: 3, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Friday', status: 'Time In' },
    { day: 3, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Friday', status: 'Time Out' },

    { day: 6, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Monday', status: 'Time In' },
    { day: 6, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Monday', status: 'Time Out' },

    { day: 7, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Tuesday', status: 'Time In' },
    { day: 7, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Tuesday', status: 'Time Out' },

    { day: 8, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Wednesday', status: 'Time In' },
    { day: 8, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Wednesday', status: 'Time Out' },

    { day: 9, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Thursday', status: 'Time In' },
    { day: 9, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Thursday', status: 'Time Out' },

    { day: 10, month: 'OCT', time: '7:00 AM', dayOfWeek: 'Friday', status: 'Time In' },
    { day: 10, month: 'OCT', time: '4:00 PM', dayOfWeek: 'Friday', status: 'Time Out' }
  ];

  // Generate events from activity data (use prop if provided, else sample)
  const dataToUse = activityData || sampleActivityData;
  const generatedEvents = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = 10; // October
    const currentDay = 12; // Assume current day is 12
    const presentDays = new Set(dataToUse.map(item => item.day));

    const events: CalendarEvent[] = [];
    for (let day = 1; day < currentDay; day++) {
      const date = new Date(currentYear, 9, day); // October is 9 (0-based)
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
      const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (presentDays.has(day)) {
        events.push({ date: dateStr, title: 'Present', color: '#4CAF50' }); // Green
      } else {
        events.push({ date: dateStr, title: 'Absent', color: '#f44336' }); // Red
      }
    }
    return [...events, ...externalEvents];
  }, [dataToUse, externalEvents]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return generatedEvents.filter(event => event.date === dateKey);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDatePress = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (isDateDisabled(newDate)) return;

    setSelected(newDate);
    onDateSelect?.(newDate);

    // Show tooltip for past present dates
    if (newDate < new Date() && dataToUse.some(item => item.day === day)) {
      const activities = dataToUse.filter(item => item.day === day);
      const times = activities.map(item => `${item.status}: ${item.time}`).join('\n');
      // Calculate position
      const firstDay = getFirstDayOfMonth(currentDate);
      const index = firstDay + day - 1;
      const row = Math.floor(index / 7);
      const col = index % 7;
      const cellWidth = calendarWidth / 7;
      const cellHeight = cellWidth; // aspectRatio 1
      const x = col * cellWidth;
      const y = (row + 1) * cellHeight; // below the day
      setTooltip({ visible: true, text: times, x, y });
      setTimeout(() => setTooltip({ visible: false, text: '', x: 0, y: 0 }), 3000); // Hide after 3s
    } else {
      setTooltip({ visible: false, text: '', x: 0, y: 0 });
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <View style={styles.emptyDay} />
        </View>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const isSelected = selected && formatDateKey(selected) === dateKey;
      const isToday = formatDateKey(new Date()) === dateKey;
      const dayEvents = getEventsForDate(date);
      const disabled = isDateDisabled(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isWeekend && { padding: 0 }]}
          onPress={() => handleDatePress(day)}
          disabled={disabled}
        >
          <View style={[
            styles.day,
            isWeekend && { backgroundColor: '#d1d1d1' },
            isSelected && (isWeekend || !(date < new Date() && dayEvents.length === 0)) && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
            disabled && styles.disabledDay
          ]}>
            <Text style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
              disabled && styles.disabledDayText,
              isWeekend && styles.weekendDayText,
              !isSelected && !isToday && date < new Date() && dayEvents.length > 0 && { color: dayEvents[0].color }
            ]}>
              {day}
            </Text>
            {dayEvents.length > 0 && date >= new Date() && (
              <View style={styles.eventDots}>
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.eventDot,
                      { backgroundColor: event.color || Colors.primary.pink }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.weekDays}>
        {dayNames.map(day => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendar} onLayout={(e) => setCalendarWidth(e.nativeEvent.layout.width)}>
        {renderCalendar()}
      </View>

      {/* Tooltip */}
      {tooltip.visible && (
        <View style={[styles.tooltip, { left: tooltip.x, top: tooltip.y }]}>
          <Text style={styles.tooltipText}>{tooltip.text}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: Colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    borderRadius: BorderRadius.sm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: Colors.primary.pink,
    fontWeight: '600',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.muted,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  day: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 8,
    position: 'relative',
  },
  emptyDay: {
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    color: Colors.text.dark,
  },
  selectedDay: {
    backgroundColor: Colors.primary.pink,
  },
  selectedDayText: {
    color: Colors.text.white,
    fontWeight: '600',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.primary.pink,
  },
  todayDayText: {
    color: Colors.primary.pink,
    fontWeight: '600',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: Colors.text.placeholder,
  },
  weekendDayText: {
    color: Colors.text.white,
  },
  eventDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
    gap: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: Colors.text.dark,
    padding: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  tooltipText: {
    color: Colors.text.white,
    fontSize: 12,
  },
});

export default Calendar;
