import { Text, View, Platform } from "react-native";
import { useColorScheme } from "nativewind";
import useOrientation from "@hooks/useOrientation";
import pkg from "@root/package.json";
import app from "@root/app.json";
import { getLabel } from "@utils";
import { Props } from "./types";
import { MaterialIcons } from "@expo/vector-icons";
import AppDrawerButton from "../AppDrawerButton";

// @todo verificar porque não esta trazendo style
// import Button from "@components/Button";
import Button from "../../Button";

export default function AppDrawerContent({
  state,
  descriptors,
  navigation,
}: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { landscape } = useOrientation();
  const appVersion = pkg.version;
  const versionCode =
    Platform.OS === "android" ? app.expo.android.versionCode : "";

  const onPress = (route: any, isFocused: boolean): void => {
    if (!isFocused) {
      navigation.navigate(route.name, route.params);
    } else {
      navigation.closeDrawer();
    }
  };

  return (
    <View
      testID="app-drawer-content"
      className="dark:bg-zinc-900 flex flex-row w-full h-full"
    >
      <View className="pt-12 w-full">
        {state?.routes.map((route: any, index: number) => {
          const { options }: { options: any } = descriptors[route.key];
          const labelButton: string =
            getLabel(options, route) == "Wallet Digitalz"
              ? "Ínicio"
              : getLabel(options, route);
          const isFocused: boolean = state.index === index;

          return (
            <AppDrawerButton
              key={index}
              onPress={() => onPress(route, isFocused)}
              drawerOptions={{
                route,
                index,
                isFocused,
                labelButton,
                options,
              }}
            />
          );
        })}

        <View className={`flex mt-auto ${landscape ? "pb-5 px-10" : "p-10"}`}>
          <Button
            onPress={toggleColorScheme}
            className="bg-transparent border-0 bg-gray-200 dark:bg-zinc-800 my-4 mx-auto rounded-full p-2 pr-4"
            text={colorScheme === "dark" ? "Dark" : "Light"}
            textColor="text-black dark:text-white"
            label="Toogle darkmode"
            icon={
              <MaterialIcons
                name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
                size={22}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          />
          <Text className="text-center dark:text-white">
            Versão {appVersion}
            {versionCode && ` - Build ${versionCode}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
