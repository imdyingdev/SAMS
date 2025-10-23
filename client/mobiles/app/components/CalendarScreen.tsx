import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BorderRadius, Colors } from '../styles/colors';
import { supabase } from '../services/supabase';
import { getUserSession } from '../utils/auth';
import type { RealtimeChannel } from '@supabase/supabase-js';

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

interface RfidLog {
  id: string;
  rfid: string;
  tap_count: number;
  tap_type: string;
  timestamp: string;
  created_at: string;
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
  const [attendanceLogs, setAttendanceLogs] = useState<RfidLog[]>([]);
  const [userRfid, setUserRfid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const realtimeChannel = useRef<RealtimeChannel | null>(null);

  // Animation values
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Fetch user session and RFID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserSession();
        if (user && user.rfid) {
          setUserRfid(user.rfid);
        } else {
          console.warn('User RFID not found in session');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch attendance logs from rfid_logs table
  useEffect(() => {
    if (!userRfid) return;

    const fetchAttendanceLogs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('rfid_logs')
          .select('*')
          .eq('rfid', userRfid)
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error fetching attendance logs:', error);
          return;
        }

        setAttendanceLogs(data || []);
      } catch (error) {
        console.error('Error fetching attendance logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceLogs();
  }, [userRfid]);

  // Setup realtime subscription for attendance updates
  useEffect(() => {
    if (!userRfid) return;

    // Subscribe to realtime changes
    realtimeChannel.current = supabase
      .channel('rfid_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rfid_logs',
          filter: `rfid=eq.${userRfid}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAttendanceLogs((prev) => [payload.new as RfidLog, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAttendanceLogs((prev) =>
              prev.map((log) => (log.id === payload.new.id ? (payload.new as RfidLog) : log))
            );
          } else if (payload.eventType === 'DELETE') {
            setAttendanceLogs((prev) => prev.filter((log) => log.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      if (realtimeChannel.current) {
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, [userRfid]);

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

  // Helper function to format date as key
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Process attendance logs to get attendance dates
  const attendanceDates = React.useMemo(() => {
    const dates = new Set<string>();
    const logsWithTimes: { [key: string]: { timeIn?: string; timeOut?: string } } = {};

    attendanceLogs.forEach((log) => {
      const logDate = new Date(log.timestamp);
      const dateKey = formatDateKey(logDate);
      
      dates.add(dateKey);
      
      if (!logsWithTimes[dateKey]) {
        logsWithTimes[dateKey] = {};
      }
      
      const timeStr = logDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
      if (log.tap_type === 'time_in') {
        logsWithTimes[dateKey].timeIn = timeStr;
      } else if (log.tap_type === 'time_out') {
        logsWithTimes[dateKey].timeOut = timeStr;
      }
    });

    return { dates, logsWithTimes };
  }, [attendanceLogs]);

  // Check if a date has attendance
  const hasAttendance = (date: Date): boolean => {
    const dateKey = formatDateKey(date);
    return attendanceDates.dates.has(dateKey);
  };

  // Get attendance times for a date
  const getAttendanceTimes = (date: Date): { timeIn?: string; timeOut?: string } => {
    const dateKey = formatDateKey(date);
    return attendanceDates.logsWithTimes[dateKey] || {};
  };

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

  const getEventsForDate = (date: Date) => {
    // Not used anymore, but keeping for compatibility
    return [];
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

    // Show tooltip for past dates with attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today && hasAttendance(newDate)) {
      const times = getAttendanceTimes(newDate);
      const timeStrings = [];
      if (times.timeIn) timeStrings.push(`Time In: ${times.timeIn}`);
      if (times.timeOut) timeStrings.push(`Time Out: ${times.timeOut}`);
      
      if (timeStrings.length > 0) {
        // Calculate position
        const firstDay = getFirstDayOfMonth(currentDate);
        const index = firstDay + day - 1;
        const row = Math.floor(index / 7);
        const col = index % 7;
        const cellWidth = calendarWidth / 7;
        const cellHeight = cellWidth; // aspectRatio 1
        const x = col * cellWidth;
        const y = (row + 1) * cellHeight; // below the day
        setTooltip({ visible: true, text: timeStrings.join('\n'), x, y });
        setTimeout(() => setTooltip({ visible: false, text: '', x: 0, y: 0 }), 3000); // Hide after 3s
      }
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const isSelected = selected && formatDateKey(selected) === dateKey;
      const isToday = formatDateKey(today) === dateKey;
      const disabled = isDateDisabled(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Normalize date for comparison
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      
      const isPast = normalizedDate < today;
      const isFuture = normalizedDate > today;
      const hasAttendanceRecord = hasAttendance(date);

      // Determine text color based on rules:
      // - Current day: Pink text (with pink border)
      // - Past with attendance: Green text
      // - Past without attendance (weekday): Red text
      // - Future: Black text
      // - Weekend: White text on gray background
      let textColor = Colors.text.dark; // Default black for future days
      
      if (isWeekend) {
        textColor = Colors.text.white; // White for weekends
      } else if (isToday) {
        textColor = Colors.primary.pink; // Pink for today
      } else if (isPast) {
        textColor = hasAttendanceRecord ? '#4CAF50' : '#f44336'; // Green if present, red if absent
      }

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
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
            disabled && styles.disabledDay
          ]}>
            <Text style={[
              styles.dayText,
              { color: textColor },
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
              disabled && styles.disabledDayText
            ]}>
              {day}
            </Text>
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
