import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Animated, Vibration } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';
import { supabase } from '../services/supabase';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications, scheduleActivityNotification } from '../utils/notifications';

interface RfidLog {
  id: string;
  rfid: string;
  tap_type: 'time_in' | 'time_out';
  timestamp: string;
  created_at: string;
  students: {
    first_name: string;
    middle_name?: string;
    last_name: string;
  };
}

interface ActivityItem {
  id: string;
  rfid: string;
  tap_type: 'time_in' | 'time_out';
  timestamp: string;
  created_at: string;
  student_name?: string;
  // Computed fields for display
  day: number;
  month: string;
  time: string;
  dayOfWeek: string;
  status: string;
}

interface ActivityListProps {
  refreshing: boolean;
  onRefresh: () => void;
  loading?: boolean;
  studentRfid?: string; // Optional filter by specific student RFID
  selectedDate?: Date | null; // Optional filter by specific date
  showAllRecords?: boolean; // If true, show all records (Activity Log mode)
  onActivityCountChange?: (count: number) => void; // Callback when activity count changes
}

const ActivityList: React.FC<ActivityListProps> = ({ refreshing, onRefresh, loading = false, studentRfid, selectedDate, showAllRecords = false, onActivityCountChange }) => {
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState<string | null>(null);
  const previousLogCountRef = useRef<number>(0);

  // Function to transform database data to display format
  const transformActivityData = (logs: (RfidLog & { student_name: string })[]): ActivityItem[] => {
    return logs.map(log => {
      const timestamp = new Date(log.timestamp);
      const day = timestamp.getDate();
      const month = timestamp.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const time = timestamp.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      const dayOfWeek = timestamp.toLocaleDateString('en-US', { weekday: 'long' });
      const status = log.tap_type === 'time_in' ? 'Time In' : 'Time Out';

      return {
        id: log.id,
        rfid: log.rfid,
        tap_type: log.tap_type,
        timestamp: log.timestamp,
        created_at: log.created_at,
        student_name: log.student_name,
        day,
        month,
        time,
        dayOfWeek,
        status
      };
    }).sort((a, b) => {
      // Sort by timestamp descending (most recent first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  };

  // Function to fetch activity data from database
  const fetchActivityData = React.useCallback(async () => {
    try {
      setError(null);
      
      console.log('Fetching activity data for studentRfid:', studentRfid);
      
      // First, get rfid_logs data
      let rfidLogsQuery = supabase
        .from('rfid_logs')
        .select('id, rfid, tap_type, timestamp, created_at')
        .order('timestamp', { ascending: false })
        .limit(showAllRecords ? 100 : 50); // More records for Activity Log

      // Filter by specific student RFID if provided
      if (studentRfid) {
        console.log('Applying RFID filter for:', studentRfid);
        rfidLogsQuery = rfidLogsQuery.eq('rfid', studentRfid);
      } else {
        console.log('WARNING: No studentRfid provided, will fetch ALL logs!');
      }

      const { data: rfidLogs, error: rfidLogsError } = await rfidLogsQuery;

      if (rfidLogsError) {
        throw rfidLogsError;
      }

      console.log('Fetched RFID logs:', rfidLogs?.map(log => ({ id: log.id, rfid: log.rfid, tap_type: log.tap_type })));

      if (!rfidLogs || rfidLogs.length === 0) {
        setActivityData([]);
        return;
      }

      // Get unique RFIDs from the logs
      const uniqueRfids = [...new Set(rfidLogs.map(log => log.rfid))];

      // Fetch students data for these RFIDs
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('rfid, first_name, middle_name, last_name')
        .in('rfid', uniqueRfids.map(rfid => parseInt(rfid))); // Convert string RFID to number for students table

      if (studentsError) {
        console.warn('Error fetching students data:', studentsError);
        // Continue without student names if students fetch fails
      }

      // Create a map of RFID to student info
      const studentMap = new Map();
      students?.forEach(student => {
        if (student.rfid) {
          studentMap.set(student.rfid.toString(), {
            first_name: student.first_name,
            middle_name: student.middle_name,
            last_name: student.last_name
          });
        }
      });

      // Transform data and add student names
      const transformedData = rfidLogs.map(log => {
        const studentInfo = studentMap.get(log.rfid);
        return {
          ...log,
          students: studentInfo || { first_name: 'Unknown', middle_name: null, last_name: 'Student' },
          student_name: studentInfo 
            ? `${studentInfo.first_name} ${studentInfo.middle_name ? studentInfo.middle_name + ' ' : ''}${studentInfo.last_name}`.trim()
            : 'Unknown Student'
        };
      });

      let formattedData = transformActivityData(transformedData);
      
      // Filter by selected date if provided (only in home/dashboard mode)
      if (selectedDate && !showAllRecords) {
        // Use local date comparison to avoid timezone issues
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth();
        const selectedDay = selectedDate.getDate();
        
        formattedData = formattedData.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate.getFullYear() === selectedYear &&
                 itemDate.getMonth() === selectedMonth &&
                 itemDate.getDate() === selectedDay;
        });
      }
      
      setActivityData(formattedData);

      // Notify parent component of activity count change
      onActivityCountChange?.(formattedData.length);
    } catch (err) {
      console.error('Error fetching activity data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity data');
      // Fallback to empty array on error
      setActivityData([]);
      // Notify parent of zero count on error
      onActivityCountChange?.(0);
    } finally {
      setIsLoading(false);
    }
  }, [studentRfid, selectedDate, showAllRecords]); // Add dependency array for useCallback

  // Request notification permissions on mount
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  // Load data on component mount and when studentRfid or selectedDate changes
  useEffect(() => {
    setIsLoading(true);
    fetchActivityData();
  }, [studentRfid, selectedDate, showAllRecords]);

  // Detect new logs and trigger notification
  useEffect(() => {
    if (activityData.length > 0 && previousLogCountRef.current > 0) {
      // Check if there are new logs (count increased)
      if (activityData.length > previousLogCountRef.current) {
        const newLog = activityData[0]; // Most recent log is first

        // Only trigger notification if we're in dashboard view (not activity log view)
        // This prevents notifications when user is already viewing the activity log
        if (!showAllRecords) {
          // Trigger vibration
          Vibration.vibrate([0, 250, 250, 250]); // Pattern: wait 0ms, vibrate 250ms, wait 250ms, vibrate 250ms

          // Schedule notification
          scheduleActivityNotification(
            newLog.student_name || 'Unknown Student',
            newLog.tap_type,
            newLog.time
          );
        }
      }
    }

    // Update the previous count
    previousLogCountRef.current = activityData.length;
  }, [activityData, showAllRecords]);

  // Set up real-time subscription for rfid_logs
  useEffect(() => {
    // Only set up real-time subscription if we have a specific student RFID
    // This prevents global listening to all RFID logs
    if (!studentRfid) {
      console.log('No studentRfid provided, skipping real-time subscription');
      return;
    }

    const channel = supabase
      .channel(`rfid_logs_${studentRfid}`) // Unique channel per student
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'rfid_logs',
          filter: `rfid=eq.${studentRfid}` // Only listen to this specific student's RFID
        },
        (payload) => {
          console.log(`Real-time RFID log change for ${studentRfid}:`, payload);
          
          // Additional check to ensure the change is for the correct RFID
          if (payload.new && (payload.new as any).rfid === studentRfid) {
            // Refresh data when changes occur for this specific student
            if (payload.eventType === 'INSERT') {
              console.log('New RFID log for current student, refreshing data');
              fetchActivityData();
            } else if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              console.log('RFID log updated/deleted for current student, refreshing data');
              fetchActivityData();
            }
          } else if (payload.old && (payload.old as any).rfid === studentRfid) {
            // Handle DELETE events where payload.new is null
            console.log('RFID log deleted for current student, refreshing data');
            fetchActivityData();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Real-time subscription status for ${studentRfid}:`, status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log(`Cleaning up real-time subscription for ${studentRfid}`);
      supabase.removeChannel(channel);
    };
  }, [studentRfid, fetchActivityData]); // Re-subscribe when studentRfid changes

  // Handle refresh
  const handleRefresh = async () => {
    await fetchActivityData();
    onRefresh(); // Call parent's onRefresh if needed
  };

  // Animation values for each activity item (except first)
  const [animations, setAnimations] = useState<Array<{ translateY: Animated.Value; opacity: Animated.Value }>>([]);

  // Update animations when activityData changes
  useEffect(() => {
    if (activityData.length > 1) {
      // Create animations only for items after the first one
      const newAnimations = activityData.slice(1).map(() => ({
        translateY: new Animated.Value(20),
        opacity: new Animated.Value(0)
      }));
      setAnimations(newAnimations);
    }
  }, [activityData.length]);

  // Function to start animations
  const startAnimations = React.useCallback(() => {
    if (animations.length === 0) return;
    
    // Reset animation values to starting position
    animations.forEach((anim) => {
      anim.translateY.setValue(20);
      anim.opacity.setValue(0);
    });

    // Start staggered animations
    const animationSequence = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 100, // Stagger by 100ms
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(50, animationSequence).start();
  }, [animations]);

  // Start animation when real data loads (not for skeleton)
  useEffect(() => {
    if (!isLoading && activityData.length > 1 && animations.length > 0) {
      startAnimations();
    }
  }, [isLoading, activityData.length, animations.length, startAnimations]);


 if (isLoading) {
   const placeholderCount = 1;
   return (
     <ScrollView
       style={styles.activityScroll}
       contentContainerStyle={styles.activityContent}
       showsVerticalScrollIndicator={false}
       refreshControl={
         <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
       }
     >
       <View style={styles.activityList}>
         {Array.from({ length: placeholderCount }).map((_, index) => (
           <View key={index} style={styles.placeholderItem}>
             <View style={styles.placeholderDate} />
             <View style={styles.placeholderDetails}>
               <View style={styles.placeholderTime} />
               <View style={styles.placeholderDay} />
             </View>
             <View style={styles.placeholderStatus} />
           </View>
         ))}
       </View>
     </ScrollView>
   );
 }

 return (
    <ScrollView
      style={styles.activityScroll}
      contentContainerStyle={styles.activityContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.activityList}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        {activityData.length === 0 && !error && !isLoading && (
          <View style={styles.emptyContainer}>
            {selectedDate && !showAllRecords ? (
              <>
                {/* Check if selected date is a weekend */}
                {(selectedDate.getDay() === 0 || selectedDate.getDay() === 6) ? (
                  <Text style={styles.emptyText}>
                    There is no class or event on this {selectedDate.getDay() === 0 ? 'Sunday' : 'Saturday'}.
                  </Text>
                ) : (
                  <>
                    {/* Check if selected date is in the future */}
                    {selectedDate > new Date() ? (
                      <Text style={styles.emptyText}>
                        Attendance records will be available after {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
                      </Text>
                    ) : (
                      <>
                        {/* Check if selected date is today */}
                        {selectedDate.toDateString() === new Date().toDateString() ? (
                          <Text style={styles.emptyText}>
                            Our records show that you were not present at school today{'\n'}
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
                          </Text>
                        ) : (
                          <Text style={styles.emptyText}>
                            Our records show that you were not present at school on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
                          </Text>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <Text style={styles.emptyText}>No activity records found</Text>
            )}
          </View>
        )}
        {activityData.map((item, index) => {
          if (index === 0) {
            // First item - no animation
            return (
              <TouchableOpacity key={item.id} style={styles.activityItem}>
                <View style={styles.activityDate}>
                  <Text style={styles.dateDay}>{item.day}</Text>
                  <Text style={styles.dateMonth}>{item.month}</Text>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTime}>{item.time}</Text>
                  <Text style={styles.activityDay}>{item.dayOfWeek}</Text>
                </View>
                <View style={[
                  styles.activityStatus,
                  item.status === 'Time In' ? styles.statusPresent : styles.statusLate
                ]}>
                  <Text style={[
                    styles.activityStatusText,
                    item.status === 'Time In' ? styles.statusPresentText : styles.statusLateText
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            // Other items - with slide-up and fade animation
            const animIndex = index - 1;
            return (
              <Animated.View
                key={item.id}
                style={{
                  opacity: animations[animIndex]?.opacity || new Animated.Value(0),
                  transform: [{ translateY: animations[animIndex]?.translateY || new Animated.Value(20) }]
                }}
              >
                <TouchableOpacity style={styles.activityItem}>
                <View style={styles.activityDate}>
                  <Text style={styles.dateDay}>{item.day}</Text>
                  <Text style={styles.dateMonth}>{item.month}</Text>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTime}>{item.time}</Text>
                  <Text style={styles.activityDay}>{item.dayOfWeek}</Text>
                </View>
                <View style={[
                  styles.activityStatus,
                  item.status === 'Time In' ? styles.statusPresent : styles.statusLate
                ]}>
                  <Text style={[
                    styles.activityStatusText,
                    item.status === 'Time In' ? styles.statusPresentText : styles.statusLateText
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
              </Animated.View>
            );
          }
        })}
      </View>
    </ScrollView>
  );
};

const styles = {
  activityScroll: {
    flex: 1,
  },
  activityContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  activityList: {
    gap: Spacing.sm + 2,
  },
  activityItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: Spacing.md,
    backgroundColor: Colors.glass.overlay2,
    borderWidth: 1,
    borderColor: Colors.glass.overlay1,
    borderRadius: BorderRadius.sm,
    minHeight: 92, // Increased by 4px for perfect matching
  },
  activityDate: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: Spacing.lg,
    minWidth: 50,
  },
  dateDay: {
    fontSize: 28,
    fontFamily: Typography.families.bodyBold,
    color: Colors.status.info,
    lineHeight: 28,
  },
  dateMonth: {
    fontSize: 11,
    color: Colors.text.whiteMuted,
    textTransform: 'uppercase' as const,
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  activityDetails: {
    flex: 1,
  },
  activityTime: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  activityDay: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.whiteMuted,
  },
  activityStatus: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 30,
  },
  activityStatusText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.bodySemiBold,
  },
  statusPresent: {
    backgroundColor: 'rgba(66, 165, 245, 0.2)',
    borderColor: '#42A5F5',
  },
  statusPresentText: {
    color: '#42A5F5',
  },
  statusLate: {
    backgroundColor: 'rgba(171, 71, 188, 0.2)',
    borderColor: '#AB47BC',
  },
  statusLateText: {
    color: '#AB47BC',
  },
  placeholderItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: Spacing.md,
    backgroundColor: Colors.glass.overlay2,
    borderWidth: 1,
    borderColor: Colors.glass.overlay1,
    borderRadius: BorderRadius.sm,
    minHeight: 92, // Same height as real items
  },
  placeholderDate: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: Spacing.lg,
    minWidth: 50,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  placeholderDetails: {
    flex: 1,
  },
  placeholderTime: {
    width: '60%' as const,
    height: Typography.sizes.base,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: Spacing.xs,
  },
  placeholderDay: {
    width: '40%' as const,
    height: Typography.sizes.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
  },
  placeholderStatus: {
    width: 65,
    height: 32,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorContainer: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    alignItems: 'center' as const,
  },
  errorText: {
    color: '#F44336',
    fontSize: Typography.sizes.sm,
    textAlign: 'center' as const,
    marginBottom: Spacing.sm,
  },
  retryButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  retryText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.bodySemiBold,
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center' as const,
  },
  emptyText: {
    color: Colors.text.whiteMuted,
    fontSize: Typography.sizes.base,
    textAlign: 'center' as const,
  },
};

export default ActivityList;