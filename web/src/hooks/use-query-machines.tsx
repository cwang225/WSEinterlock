import { fetchCurrentMachine, getAllMachines, getAllTrainingsOfUser, getMachine, getMachineTypes } from "@/data/api"
import { setCurrentMachine, setCurTrainings, setKiosk, setMachines, setMachinesTypes, appendMachineTypes,  $mix_active, $activeTab, setMetaData, setMachine, $machineTypeFilter } from "@/data/store";

import { Machine } from "@/data/types/machine";
import { MachineType } from "@/data/types/machineType";
import { useEffect, useState } from "react";
import { SortMachineType, SortType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { useToast } from "./use-toast";

function useQueryMachines(reload: boolean) {
  // Pagination state for machine types (used for infinite scroll)
  const [machineTypesCurrentPage, setMachineTypesCurrentPage] = useState(1);
  const [machineTypesHasMore, setMachineTypesHasMore] = useState(false);
  const [machineTypesIsLoading, setMachineTypesIsLoading] = useState(false);
  const { toast } = useToast();

  const mixActive = useStore($mix_active);
  const activeTab = useStore($activeTab);
  const machineTypeFilter = useStore($machineTypeFilter)
  
  const getSavedMachine = async (): Promise<Machine | "kiosk" | undefined | 0> => {
    try {
      const { data } = await fetchCurrentMachine();

      if (data === null) {
        return undefined;
      }

      if (data === -1) {
        setKiosk(true);
        return "kiosk";
      }

      try {
        const { data: machine } = await getMachine(data);
        setCurrentMachine(machine);
        return machine;
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast({
          variant: "destructive",
          title: "❌ Sorry! There was an error fetching the Machine 🙁",
          description: errorMessage
        });
        return 0;            
      }
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching the Machine 🙁",
        description: errorMessage
      });
      return 0;
    }    
  }

  const loadMachineTypes = async (
    sort: SortType = "asc",
    page: number = 1,
    limit: number = 10,
    search: string = "",
    append: boolean = false
  ) => {
    try {
      setMachineTypesIsLoading(true);
      const {
        data: fetchedMachineTypes,
        meta
      } = await getMachineTypes(sort, page, limit, search);
      
      if (append) {
        appendMachineTypes(fetchedMachineTypes);
      } else {
        setMachinesTypes(fetchedMachineTypes);
      }
      
      setMachineTypesHasMore(page * limit < meta.total);
      setMachineTypesCurrentPage(page);
      
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Machine Types 🙁",
        description: errorMessage
      });
    } finally {
      setMachineTypesIsLoading(false);
    }
  };

  const getTrainingsOfUser = async (userId: number): Promise<MachineType[] | undefined> => {
    try {
      const {
        data: types
      } = await getAllTrainingsOfUser(userId);
      setCurTrainings(types);
      
      return types;
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Machine Types 🙁",
        description: errorMessage
      });
    }
  }

  

  const loadMachines = async (
    sort: SortMachineType = "name_asc",
    page: number = 1,
    limit: number = 10,
    search: string = "",
    type: string = "") => {
    try {
      var activeParam = activeTab;
      if (mixActive) {
        activeParam = -1
      }
      const {
        data: fetchedMachines,
        meta: fetchedMetaData
      } = await getAllMachines(sort, page, limit, search, type, activeParam, machineTypeFilter ?? undefined);
      setMetaData(fetchedMetaData);
      setMachines(fetchedMachines);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Machines 🙁",
        description: errorMessage
      });
    }
  };
  
  //Load a single machine by id
  const loadMachine = async (id: number) => {
    try {
      const {
        data: fetchedMachine,
      } = await getMachine(id);
      setMachine(fetchedMachine);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching Machines 🙁",
        description: errorMessage
      });
    }
  };

  useEffect(() => {
    if (reload) {
      loadMachines();
      loadMachineTypes();
    }
  }, []);

  return { 
    getSavedMachine, 
    loadMachines, 
    loadMachineTypes, 
    getTrainingsOfUser,
    loadMachine,
    // Only expose machine types pagination for infinite scroll
    currentPage: machineTypesCurrentPage,
    hasMore: machineTypesHasMore,
    isLoading: machineTypesIsLoading
  };
}

export default useQueryMachines;