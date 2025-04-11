import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EventCard = ({ event, onEdit, onDelete }) => {
  // Formatear la fecha para mostrarla en formato legible
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Formatear la hora para mostrarla en formato legible
  const formatTime = (timeString) => {
    return timeString;
  };

  // Determinar el color de fondo según el estado del evento
  const getCardStyle = () => {
    switch (event.status) {
      case "today":
        return [styles.card, styles.todayCard];
      case "past":
        return [styles.card, styles.pastCard];
      case "future":
        return [styles.card, styles.futureCard];
      default:
        return styles.card;
    }
  };

  // Obtener icono según la categoría del evento
  const getCategoryIcon = () => {
    switch (event.category) {
      case "reunion":
        return "people";
      case "estudio":
        return "book";
      case "personal":
        return "person";
      default:
        return "calendar";
    }
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.header}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={getCategoryIcon()} size={24} color="#fff" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.category}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(event.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{formatTime(event.time)}</Text>
        </View>

        {event.participants && (
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{event.participants}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,

    borderBottomColor: '#000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  todayCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50", // Verde para eventos de hoy
  },
  pastCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#F44336", // Rojo para eventos pasados
  },
  futureCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3", // Azul para eventos futuros
  },
  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  details: {
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default EventCard;
