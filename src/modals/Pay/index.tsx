import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { setEditRegisterExpense } from "@store/expenseSlice";
import { setEditRegisterEntry } from "@store/entrySlice";
import { setEditRegisterInvestment } from "@store/investmentSlice";
import { setModalPay } from "@store/modalsSlice";
import { RootState } from "@store";
import Modal from "@components/common/Modal";
import { animationModalIcon, animationModalScale } from "@components/common/Modal/animation";
import { ModalHandle } from "@components/common/Modal/types";
import { useTranslation } from "react-i18next";

export default function ModalDelete(props: { testID?: string }) {
  const { t } = useTranslation();
  const modalRef = useRef<ModalHandle>(null);
  const { colorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
  const modals = useAppSelector((state: RootState) => state.modalsState);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const isOpenModal = (): boolean => Boolean(modals.modalPay);
  const shakeInterpolate = shakeAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  useEffect(() => {
    if (modals.modalPay) animationModalScale(scaleAnimation);

    return () => {
      scaleAnimation.setValue(0);
    };
  }, [modals.modalPay, scaleAnimation]);

  const registerFunctions: any = {
    expense: {
      setDeleteRegister: setEditRegisterExpense,
    },
    entry: {
      setDeleteRegister: setEditRegisterEntry,
    },
    investment: {
      setDeleteRegister: setEditRegisterInvestment,
    },
  };

  const confirmModal = () => {
    const { setDeleteRegister } = registerFunctions[modals.modalPay?.type];
    dispatch(setDeleteRegister({ ...modals.modalPay, pay: true }));
    animationModalIcon({ scaleAnimation, shakeAnimation, modalRef: modalRef });
  };

  return (
    <Modal
      ref={modalRef}
      type="window"
      isOpen={isOpenModal()}
      testID={props.testID ? props.testID : "teste-modal"}
      closeAction={() => dispatch(setModalPay(""))}
      confirmAction={confirmModal}
      confirmButton={{
        text: t("common.btn_confirm"),
        label: t("common.btn_confirm_label"),
        icon: <MaterialIcons name="check" size={28} color="white" />,
      }}
    >
      <Animated.View
        style={{
          transform: [{ rotate: shakeInterpolate }, { scale: scaleAnimation }],
        }}
      >
        <MaterialIcons
          name="paid"
          size={50}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </Animated.View>
      <Text className="text-black dark:text-white text-center text-xl my-4">
        {t("common.alert_paid")}
      </Text>
    </Modal>
  );
}
