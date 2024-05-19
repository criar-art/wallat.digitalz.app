import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";

interface Totals {
  liquid: number;
  patrimony: number;
  entry: number;
  expenses: number;
  investiment: number;
}

export function useBalance() {
  const common = useAppSelector((state: RootState) => state.commonState);

  const getQuantity = (type: string) => {
    return common.registers.filter((item: any) => item.type == type).length;
  };

  const getTotal = (type: string): number =>
    common.registers
      .filter((item: any) => item.type === type)
      .reduce((acc: number, { value }: any) => acc + Number(value), 0);

  const [totals, setTotals] = useState<Totals>({
    liquid: getLiquid(),
    patrimony: getPatrimonyTotal(),
    entry: getTotal("entry"),
    expenses: getTotal("expense"),
    investiment: getTotal("investiment"),
  });

  useEffect(() => {
    setTotals({
      liquid: getLiquid(),
      patrimony: getPatrimonyTotal(),
      entry: getTotal("entry"),
      expenses: getTotal("expense"),
      investiment: getTotal("investiment"),
    });
  }, [common.registers]);

  function getLiquid(): number {
    return totals?.entry - totals?.expenses;
  }

  function getPatrimonyTotal(): number {
    const liquidTotal = totals?.entry - totals?.expenses;
    return totals?.investiment + liquidTotal;
  }

  return { totals, getTotal, getQuantity, getPatrimonyTotal, getLiquid };
}