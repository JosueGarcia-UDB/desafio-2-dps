import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const CATEGORIES = [
  { id: "reunion", label: "Reunión", icon: "people" },
  { id: "estudio", label: "Estudio", icon: "book" },
  { id: "personal", label: "Personal", icon: "person" },
  { id: "otro", label: "Otro", icon: "calendar" },
];

const EventForm = ({ initialValues, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState(new Date());
  const [timeDate, setTimeDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setCategory(initialValues.category || "");
      setParticipants(initialValues.participants || "");
      setDate(initialValues.date ? new Date(initialValues.date) : new Date());

      if (initialValues.time) {
        setTime(initialValues.time);
        // Parse the time string to set the timeDate
        const [hours, minutes] = initialValues.time.split(":");
        const newTimeDate = new Date();
        if (hours && minutes) {
          newTimeDate.setHours(parseInt(hours));
          newTimeDate.setMinutes(parseInt(minutes));
          setTimeDate(newTimeDate);
        }
      }
    }
  }, [initialValues]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!category) {
      toast.error("La categoría es obligatoria");
      return;
    }

    if (!time) {
      toast.error("La hora es obligatoria");
      return;
    }

    onSave({
      title,
      category,
      participants,
      date: date.toISOString(),
      time,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setShowTimePicker(Platform.OS === "ios");
      setTimeDate(selectedTime);
      setTime(
        selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } else {
      setShowTimePicker(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCategoryItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => {
        setCategory(item.id);
        setCategoryModalVisible(false);
      }}
    >
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: category === item.id ? "#4A90E2" : "#ccc" },
        ]}
      >
        <Ionicons name={item.icon} size={20} color="#fff" />
      </View>
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {initialValues ? "Editar Evento" : "Nuevo Evento"}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formBody}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del evento"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setCategoryModalVisible(true)}
            >
              {category ? (
                <View style={styles.selectedCategory}>
                  {CATEGORIES.find((c) => c.id === category) && (
                    <Ionicons
                      name={CATEGORIES.find((c) => c.id === category).icon}
                      size={20}
                      color="#4A90E2"
                      style={styles.categoryIconSmall}
                    />
                  )}
                  <Text style={styles.selectedCategoryText}>
                    {CATEGORIES.find((c) => c.id === category)?.label ||
                      "Seleccionar categoría"}
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>
                  Seleccionar categoría
                </Text>
              )}
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
            </TouchableOpacity>
            {showDatePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  style={styles.picker}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.doneButtonText}>Listo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hora</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{time || "Seleccionar hora"}</Text>
              <Ionicons name="time-outline" size={20} color="#4A90E2" />
            </TouchableOpacity>
            {showTimePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={timeDate}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                  style={styles.picker}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.doneButtonText}>Listo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Participantes (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de los participantes o grupo"
              value={participants}
              onChangeText={setParticipants}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryList}>
              {CATEGORIES.map(renderCategoryItem)}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  formBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconSmall: {
    marginRight: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#4A90E2",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoryLabel: {
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
    overflow: "hidden",
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }
      : {
          elevation: 4,
        }),
  },
  picker: {
    width: "100%",
    ...(Platform.OS === "ios" ? { height: 200 } : {}),
  },
  doneButton: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
});

export default EventForm;
