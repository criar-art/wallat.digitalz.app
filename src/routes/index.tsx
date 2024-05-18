import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import useOrientation from "../hooks/useOrientation";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setEyeStatus, setModalInfo } from "../store/commonSlice";
import { RootState } from "../store";
import { RoutesTab } from "./RoutesTab";
import AppDrawerContent from "../components/AppDrawerContent";
import TotalCategory from "../components/TotalCategory";
import AboutScreen from "../views/AboutScreen";
import ContactScreen from "../views/ContactScreen";

const Drawer = createDrawerNavigator();

export const views = [
  {
    name: "Root",
    title: "Wallet Digitalz",
    drawerLabel: "Início",
    drawerIcon: (props: any) => (
      <MaterialIcons name="home" size={props.size} color={props.color} />
    ),
    component: RoutesTab,
  },
  {
    name: "About",
    title: "Sobre",
    drawerLabel: "Sobre",
    drawerIcon: (props: any) => (
      <Entypo name="info" size={props.size} color={props.color} />
    ),
    component: AboutScreen,
  },
  {
    name: "Contact",
    title: "Contato",
    drawerLabel: "Contato",
    drawerIcon: (props: any) => (
      <MaterialIcons name="call" size={props.size} color={props.color} />
    ),
    component: ContactScreen,
  },
];

export default function Routes(props: any) {
  const orientation = useOrientation();
  const dispatch = useAppDispatch();
  const common = useAppSelector((state: RootState) => state.commonState);
  const { colorScheme } = useColorScheme();
  const toggleEye = () => dispatch(setEyeStatus(!common.eyeStatus));

  const menuDrawer = (
    <TouchableOpacity
      className="p-3 ml-4 rounded-full"
      onPress={() => props.toggleDrawer()}
      accessibilityLabel="Abrir menu drawer de páginas"
    >
      <MaterialIcons
        name="menu"
        size={32}
        color={colorScheme === "dark" ? "white" : "black"}
      />
    </TouchableOpacity>
  );

  const nameOfRoute = props.name?.toLowerCase();
  const typeCategory = ["entry", "expense", "investiment"].includes(nameOfRoute)
    ? nameOfRoute
    : "patrimony";

  const eyeAction = (
    <>
      {(orientation === 4 || orientation === 3) && (
        <TotalCategory
          className="top-[20] absolute"
          orientation={orientation}
          onPress={() => dispatch(setModalInfo(typeCategory))}
          type={typeCategory}
        />
      )}
      <TouchableOpacity
        className="p-4 mr-4 rounded-full"
        onPress={() => toggleEye()}
        accessibilityLabel={
          common.eyeStatus ? "Ocultar valores" : "Mostrar valores"
        }
      >
        {common.eyeStatus ? (
          <Ionicons
            name="eye"
            size={25}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        ) : (
          <Ionicons
            name="eye-off"
            size={25}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        )}
      </TouchableOpacity>
    </>
  );

  const backAction = (
    <TouchableOpacity
      className="p-4 mr-4 rounded-full"
      onPress={() => props.navigation.goBack()}
      accessibilityLabel="Voltar página"
    >
      <MaterialIcons
        name="close"
        size={25}
        color={colorScheme === "dark" ? "white" : "black"}
      />
    </TouchableOpacity>
  );

  const headerAction = !props.dashboard ? eyeAction : backAction;

  return (
    <Drawer.Navigator
      initialRouteName="Root"
      drawerContent={(props: any) => <AppDrawerContent {...props} />}
    >
      {views.map(({ name, title, drawerIcon, drawerLabel, component }) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{
            title,
            drawerLabel,
            drawerIcon,
            drawerPosition: "left",
            overlayColor: "rgba(0,0,0,0.8)",
            headerTitleAlign:
              orientation === 4 || orientation === 3 ? "left" : "center",
            headerTitleStyle: {
              fontWeight: "bold",
              color: colorScheme === "dark" ? "white" : "black",
            },
            headerStyle: {
              height: 100,
              backgroundColor:
                colorScheme === "dark" ? "rgb(39 39 42)" : "white",
              elevation: 0,
              shadowOpacity: 0,
              borderWidth: 0,
            },
            headerLeft: () => menuDrawer,
            headerRight: () => headerAction,
          }}
          component={component}
        />
      ))}
    </Drawer.Navigator>
  );
}
