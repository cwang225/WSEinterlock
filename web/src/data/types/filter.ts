import { WritableAtom } from "nanostores";
import { $budgetCodeTypes, $budgetTypeFilter, $codes, $curbudgets, $curtrainings, $gradYearFilter, $machine_types, $machineTypeFilter, $userBudgetFilter,  $gradYears } from "../store";

import { budgetCodeType } from "./budgetCode";

export type UserFilters = "gradYear" |"budgetCodeId" | "machineTypeId";
export type BudgetFilters = "budgetTypeId";
export type MachineFilters = "machineTypeId";
export type ChartFilters = "userBudgetType" | "userMachineType";
//export type FinancialFilters =

export type FilterQueries = UserFilters | MachineFilters | BudgetFilters | ChartFilters

type FilterRenderConfig = {
    label: string;
    store: WritableAtom<number | null | number[]| string>;
    getOptions: () => { label: string; value: number |budgetCodeType }[];
    multi?: boolean;
  };
  

export const filterConfigMap: Record<FilterQueries, FilterRenderConfig> = {
  gradYear: {
    label: "Graduation Year",
    store: $gradYearFilter,
    getOptions: () => $gradYears.get().map((year) => ({
        label: String(year),
        value: year,
  
      })),
      multi: true,
  },
  budgetCodeId: {
    label: "Budget Code",
    store: $userBudgetFilter,
    getOptions: () => $codes.get().map((id) => ({
      label: `${id.name}`,
      value: id
    })),
    multi: true,
  },
  machineTypeId: {
    label: "Machine Type",
    store: $machineTypeFilter,
    
    getOptions: () => $machine_types.get().map((id) => ({
      label: `${id.name}`,
      value: id,

    })),
    multi: true,
  },
  budgetTypeId: {
    label: "Budget Type",
    store: $budgetTypeFilter,
    getOptions: () => $budgetCodeTypes.get().map((id) => ({
      label: `${id.name}`,
      value: id.id
    })),
    multi: true,
  },
  userMachineType: {
    label: "User Trainings",
    store: $machineTypeFilter,
    
    getOptions: () => $curtrainings.get().map((id) => ({
      label: `${id.name}`,
      value: id,
    })),
    multi: true,
  },
  userBudgetType: {
    label: "User Budget Codes",
    store: $userBudgetFilter,
    
    getOptions: () => $curbudgets.get().map((id) => ({
      label: `${id.name}`,
      value: id,
    })),
    multi: true,
  }
};

