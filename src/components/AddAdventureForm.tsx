import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddAdventureFormProps {
  onAddAdventure: (
    title: string,
    icon: string,
    timestamp: Date,
  ) => Promise<void>;
  onCancel: () => void;
}

const ADVENTURE_ICONS = [
  '☕',
  '🏋️',
  '🚶',
  '🏃',
  '🚴',
  '📚',
  '🎵',
  '🎨',
  '📷',
  '🍕',
  '🌮',
  '🍦',
  '🎬',
  '🎮',
  '🛍️',
  '🏢',
  '🌳',
  '🏖️',
  '⛰️',
  '🎪',
  '🎭',
  '🎨',
  '🎪',
  '🏛️',
  '⛪',
  '💍',
  '💎',
  '🏠',
  '🎄',
  '🌸',
  '🌺',
  '🍀',
  '⭐',
];

export const AddAdventureForm: React.FC<AddAdventureFormProps> = ({
  onAddAdventure,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateOnly = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeOnly = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const setToCurrentDateTime = () => {
    setSelectedDate(new Date());
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your adventure');
      return;
    }

    if (!selectedIcon) {
      Alert.alert('Error', 'Please select an icon for your adventure');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddAdventure(title.trim(), selectedIcon, selectedDate);
      setTitle('');
      setSelectedIcon('');
      setSelectedDate(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to save adventure. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Adventure</Text>

      <TextInput
        style={styles.titleInput}
        placeholder="What did you do today?"
        value={title}
        onChangeText={setTitle}
        multiline
        maxLength={100}
      />

      <Text style={styles.sectionTitle}>Choose an Icon:</Text>
      <ScrollView
        horizontal
        style={styles.iconGrid}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          {ADVENTURE_ICONS.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.iconButton,
                selectedIcon === icon && styles.selectedIconButton,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={styles.iconText}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>When did this happen?</Text>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeDisplay}>
          {formatDateTime(selectedDate)}
        </Text>

        <View>
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={showDatePickerModal}
            >
              <Text style={styles.pickerButtonText}>📅 Date</Text>
              <Text style={styles.pickerButtonSubtext}>
                {formatDateOnly(selectedDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pickerButton}
              onPress={showTimePickerModal}
            >
              <Text style={styles.pickerButtonText}>🕐 Time</Text>
              <Text style={styles.pickerButtonSubtext}>
                {formatTimeOnly(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.currentTimeButton}
            onPress={setToCurrentDateTime}
          >
            <Text style={styles.currentTimeButtonText}>
              Set to Current Time
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimeChange}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Add Adventure'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  iconGrid: {
    maxHeight: 200,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedIconButton: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
  },
  iconText: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  dateTimeContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateTimeDisplay: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  timeAdjustButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  pickerButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  pickerButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  currentTimeButton: {
    padding: 10,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  currentTimeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
