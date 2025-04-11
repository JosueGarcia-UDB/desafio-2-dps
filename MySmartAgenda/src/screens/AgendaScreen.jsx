import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "sonner-native";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";

const AgendaScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      // Obtener ID del usuario actual
      const currentUserId = await AsyncStorage.getItem("@user_id");
      setUserId(currentUserId);

      if (!currentUserId) return;

      // Cargar eventos del usuario
      const eventsJSON = await AsyncStorage.getItem(`@events_${currentUserId}`);
      const userEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

      setEvents(userEvents);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      toast.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      let updatedEvents;

      if (editingEvent) {
        // Actualizar evento existente
        updatedEvents = events.map((event) =>
          event.id === editingEvent.id ? { ...eventData, id: event.id } : event
        );
        toast.success("Evento actualizado");
      } else {
        // Crear nuevo evento
        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        updatedEvents = [...events, newEvent];
        toast.success("Evento creado");
      }

      // Guardar en AsyncStorage
      await AsyncStorage.setItem(
        `@events_${userId}`,
        JSON.stringify(updatedEvents)
      );

      // Actualizar estado
      setEvents(updatedEvents);
      setModalVisible(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error al guardar evento:", error);
      toast.error("Error al guardar el evento");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const updatedEvents = events.filter((event) => event.id !== eventId);
      await AsyncStorage.setItem(
        `@events_${userId}`,
        JSON.stringify(updatedEvents)
      );
      setEvents(updatedEvents);
      toast.success("Evento eliminado");
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error("Error al eliminar evento");
    }
  };

  const getEventsByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastEvents = [];
    const todayEvents = [];
    const futureEvents = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        pastEvents.push({ ...event, status: "past" });
      } else if (eventDate.getTime() === today.getTime()) {
        todayEvents.push({ ...event, status: "today" });
      } else {
        futureEvents.push({ ...event, status: "future" });
      }
    });

    return [...todayEvents, ...futureEvents, ...pastEvents];
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No hay eventos programados</Text>
      <Text style={styles.emptySubtext}>
        ¡Presiona el botón + para crear uno!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const sortedEvents = getEventsByDate();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Agenda</Text>
      </View>

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onEdit={() => handleEditEvent(item)}
            onDelete={() => handleDeleteEvent(item.id)}
          />
        )}
        contentContainerStyle={
          events.length === 0 ? styles.listEmpty : styles.list
        }
        ListEmptyComponent={renderEmptyState}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingEvent(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingEvent(null);
        }}
      >
        <EventForm
          initialValues={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setModalVisible(false);
            setEditingEvent(null);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    padding: 15,
  },
  listEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    right: 20,
    bottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AgendaScreen;
