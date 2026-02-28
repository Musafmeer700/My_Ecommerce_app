import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { useAuth } from '@clerk/clerk-expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur';

const TabsLayout = () => {

    const {isSignedIn, isLoaded} = useAuth();
    const insets = useSafeAreaInsets();

    if(!isLoaded) return null;
    if(!isSignedIn) return <Redirect href={"/(auth)"}/>

  return (
    <Tabs 
    screenOptions={{
      tabBarActiveTintColor: "#1DB954",
      tabBarInactiveTintColor: "#B3B3B3",
      tabBarStyle: {
        position: "absolute",
        backgroundColor: "white",
        borderTopWidth: 0,
        height: 30 + insets.bottom,
        paddingTop: 6,
        marginHorizontal: 100,
        marginBottom: insets.bottom,
        borderRadius: 30,
        overflow: 'hidden',
      },
      tabBarBackground: () => (
        <BlurView intensity={80} tint='dark' style={{position: "absolute", top: 0, right:0, left:0, bottom:0 }} />
      ),
      tabBarLabelStyle: {
        fontSize: 12
      }, 
      headerShown: false
    }}
    >
      <Tabs.Screen
        name='index'
        options={{
            title: "Shop",
            tabBarIcon: ({color, size}) => <Ionicons name='grid' size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
            title: "Cart",
            tabBarIcon: ({color, size}) => <Ionicons name='cart' size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
            title: "Profile",
            tabBarIcon: ({color, size}) => <Ionicons name='person' size={size} color={color}/>,
        }}
      />
    </Tabs>
  )
}

export default TabsLayout