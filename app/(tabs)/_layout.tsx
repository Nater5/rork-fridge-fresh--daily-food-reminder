import { Tabs } from "expo-router";
import React from "react";
import Colors from "@/constants/colors";
import { CalendarDays, ClipboardList, PlusCircle, BookOpen } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: true,
        tabBarStyle: { backgroundColor: "rgba(12,16,36,0.9)" },
        headerStyle: { backgroundColor: "rgba(12,16,36,0.6)" },
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <CalendarDays color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => <ClipboardList color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => <PlusCircle color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipe-book"
        options={{
          title: "Recipe Book",
          tabBarIcon: ({ color }) => <BookOpen color={color} />,
        }}
      />
    </Tabs>
  );
}