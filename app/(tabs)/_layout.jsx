import { Tabs } from "expo-router";
import React from "react";
import { Image, View, Text } from "react-native";
import { icons } from "../../constants";

const TabBarIcon = ({ icon, color, name, focused }) => {
 return(
  <View className="items-center justify-center gap-2">
    <Image
      source={icon}
      tintColor={color}
      resizeMode="contain"
      className="w-6 h-6"
    />
    <Text style={{color:color}} className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}>
      {name}
    </Text>
  </View>
 )
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle:{
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />

        {/* <Tabs.Screen
          name="bookmark"
          options={{
            title: "BookMark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.bookmark}
                color={color}
                name="BookMark"
                focused={focused}
              />
            ),
          }}
        /> */}

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
