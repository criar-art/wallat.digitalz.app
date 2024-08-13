import { useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { RootState } from "@store";
import {
  setRegisterExpense,
  setEditRegisterExpense,
} from "@store/expenseSlice";
import { setRegisterEntry, setEditRegisterEntry } from "@store/entrySlice";
import {
  setRegisterInvestment,
  setEditRegisterInvestment,
} from "@store/investmentSlice";
import { setModalRegister } from "@store/modalsSlice";
import { initialForm, initialFormError } from "./formConstants";
import Modal from "@components/common/Modal";
import { ModalHandle } from "@components/common/Modal/types";
import InputSelect from "@components/common/Form/InputSelect";
import InputText from "@components/common/Form/InputText";
import InputMoney from "@components/common/Form/InputMoney";
import InputDate from "@components/common/Form/InputDate";

export default function ModalRegister(props: { testID?: string }) {
  const { t } = useTranslation();
  const indexTab = useNavigationState(
    (state) => state?.routes[0]?.state?.index
  );
  const modalRef = useRef<ModalHandle>(null);
  const dispatch = useAppDispatch();
  const common = useAppSelector((state: RootState) => state.commonState);
  const expenseRegisters = useAppSelector(
    (state: RootState) => state.expenseState.registers
  );
  const entryRegisters = useAppSelector(
    (state: RootState) => state.entryState.registers
  );
  const investmentRegisters = useAppSelector(
    (state: RootState) => state.investmentState.registers
  );
  const modals = useAppSelector((state: RootState) => state.modalsState);
  const [inputMoney, setInputMoney] = useState<string>("");
  const [formModal, setFormModal] = useState(initialForm);
  const [formError, setFormError] = useState(initialFormError);
  const isEditing = (): boolean => modals?.modalRegister === "edit";
  const isOpenModal = (): boolean =>
    ["register", "edit"].includes(modals?.modalRegister);

  const handleChange = (
    value: string | boolean | Date | null,
    name: string
  ) => {
    setFormModal((prevState) => ({ ...prevState, [name]: value }));
    if (name !== "pay")
      setFormError((prevState) => ({ ...prevState, [name]: !value }));
  };

  const closeModal = () => {
    Keyboard.dismiss();
    modalRef.current?.closeModal();
  };

  const saveStore = () => {
    const { name, value, type, date } = formModal;
    const errors = { name: !name, value: !value, type: !type, date: !date };
    setFormError(errors);

    const data: any = isEditing()
      ? {
          id: common.registerData.id,
          ...formModal,
        }
      : { id: uuid.v4(), ...formModal, name: formModal.name.trim() };

    const registerFunctions: any = {
      expense: {
        setRegister: setRegisterExpense,
        setEditRegister: setEditRegisterExpense,
      },
      entry: {
        setRegister: setRegisterEntry,
        setEditRegister: setEditRegisterEntry,
      },
      investment: {
        setRegister: setRegisterInvestment,
        setEditRegister: setEditRegisterInvestment,
      },
    };

    const registersMapping: any = {
      expense: expenseRegisters,
      entry: entryRegisters,
      investment: investmentRegisters,
    };

    if (!Object.values(errors).some((error) => error)) {
      const { setRegister, setEditRegister } = registerFunctions[data.type];
      dispatch(
        isEditing()
          ? setEditRegister(data)
          : setRegister([data, ...registersMapping[data.type]])
      );
      closeModal();
    } else {
      modalRef.current?.startShake();
    }
  };

  const dataType = [
    { label: t("common.expense"), value: "expense" },
    { label: t("common.entry"), value: "entry" },
    { label: t("common.investment"), value: "investment" },
  ];

  const dataPay = [
    { label: t("inputs.pending"), value: false },
    { label: t("inputs.paid_out"), value: true },
  ];

  useEffect(() => {
    if (isEditing()) {
      setFormModal({ ...common.registerData });
      setInputMoney(common.registerData.value);
    } else {
      if (indexTab) {
        setFormModal({ ...initialForm, type: dataType[indexTab - 1].value });
      } else {
        setFormModal(initialForm);
      }
      setFormError(initialFormError);
      setInputMoney("");
    }
  }, [modals?.modalRegister]);

  return (
    <Modal
      ref={modalRef}
      isOpen={isOpenModal()}
      testID={props.testID ? props.testID : "teste-modal"}
      cancelAction={() => closeModal()}
      closeAction={() => dispatch(setModalRegister(""))}
      confirmAction={() => saveStore()}
      alertModal={{
        show: Object.values(formError).includes(true),
        text: t("common.validation"),
        icon: <MaterialCommunityIcons name="alert" size={25} color="black" />,
      }}
      header={{
        title: isEditing()
          ? t("common.edit_register")
          : t("common.new_register"),
        icon: (
          <MaterialCommunityIcons
            name={
              modals?.modalRegister === "edit"
                ? "note-edit-outline"
                : "note-plus-outline"
            }
            size={30}
            color="#d4d4d8"
          />
        ),
      }}
      confirmButton={{
        text: isEditing() ? t("common.btn_save") : t("common.btn_create"),
        label: `${t("common.btn_confirm_label")} ${isEditing() ? t("common.btn_save") : t("common.btn_create")}`,
        icon: <MaterialIcons name="check" size={28} color="white" />,
      }}
    >
      <View className="flex flex-row mb-2 mt-2">
        {isEditing() && formModal.type === "expense" && (
          <InputSelect
            twClass="flex-1 mr-2"
            label={t("inputs.situation")}
            data={dataPay}
            maxHeight={300}
            placeholder={t("inputs.select") as string}
            value={formModal.pay}
            handleChangeObject="pay"
            onChange={handleChange}
          />
        )}
        {!isEditing() && (
          <InputSelect
            twClass="flex-1 mr-2"
            label={t("inputs.type")}
            data={dataType}
            maxHeight={300}
            placeholder={t("inputs.select") as string}
            value={formModal.type}
            handleChangeObject="type"
            onChange={handleChange}
            error={!!formError.type}
          />
        )}
        <InputText
          twClass={`flex-1 ${
            (!isEditing() || formModal.type === "expense") && "ml-2"
          }`}
          label={t("inputs.name")}
          accessibilityLabel={t("modalContent.register.inputsLabel.nameOfBudget")}
          onChangeText={(value: string) => handleChange(value, "name")}
          value={formModal.name}
          error={!!formError.name}
        />
      </View>
      <View className="flex flex-row mb-4">
        <InputDate
          twClass="flex-1 mr-2"
          label={t("inputs.date")}
          value={formModal.date}
          accessibilityLabel={t("modalContent.register.inputsLabel.dateEndOfBudget")}
          onChangeDate={(date: Date | null) => handleChange(date, "date")}
          error={!!formError.date}
        />
        <InputMoney
          twClass="flex-1 ml-2"
          label={t("inputs.value")}
          accessibilityLabel={t("modalContent.register.inputsLabel.valueOfBudget")}
          value={inputMoney}
          onValueChange={(values: any) => handleChange(values.value, "value")}
          onChangeText={(value: string) => setInputMoney(value)}
          error={!!formError.value}
        />
      </View>
    </Modal>
  );
}
