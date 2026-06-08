import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { Menu, ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.neutral[200],
        },
        headerTintColor: Colors.neutral[900],
        headerTitleStyle: {
          ...Typography.h4,
          color: Colors.neutral[900],
        },
        drawerStyle: {
          backgroundColor: Colors.white,
          width: 300,
        },
        drawerActiveTintColor: Colors.primary[600],
        drawerInactiveTintColor: Colors.neutral[600],
        drawerLabelStyle: {
          ...Typography.body,
          marginLeft: -Spacing.sm,
        },
        headerLeft: () => {
          const isDetailScreen = route.name === 'word-detail';
          return (
            <TouchableOpacity
              onPress={() => {
                if (isDetailScreen) {
                  navigation.goBack();
                } else {
                  navigation.toggleDrawer();
                }
              }}
              style={{
                marginLeft: Spacing.md,
                padding: Spacing.xs,
              }}
              accessibilityLabel={isDetailScreen ? "Go back" : "Open search history drawer"}
              accessibilityRole="button"
            >
              {isDetailScreen ? (
                <ArrowLeft size={24} color={Colors.neutral[900]} strokeWidth={2} />
              ) : (
                <Menu size={24} color={Colors.neutral[900]} strokeWidth={2} />
              )}
            </TouchableOpacity>
          );
        },
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'LexiTech Dictionary',
          drawerLabel: 'Search',
          drawerIcon: ({ size, color }) => (
            <Menu size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="word-detail"
        options={{
          title: 'Word Details',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
