import { createFinancialStatements, turnOffMachine, updateFinancialStatements } from "@/data/api";
import { $currentBudget, $currentMachine, $currentUser, $curStatementId, setCurStatement } from "@/data/store";
import { useStore } from "@nanostores/react";
import { useToast } from "./use-toast";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";

const useMutationStatements = () => {
    const curBudget = useStore($currentBudget);
    const currentUser = useStore($currentUser);
    const currentMachine = useStore($currentMachine);
    const currentStatementId = useStore($curStatementId);
    const { toast } = useToast();

    const createStatement = async (timeSpent: number) => {
        try {
            const {data} = await createFinancialStatements(currentUser.id, currentMachine.id, curBudget.id, timeSpent);
            setCurStatement(data.id);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Financial statement created successfully!"
            });
        } catch (e) {
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive", 
                title: "❌ Sorry! There was an error creating the financial statement 🙁",
                description: errorMessage
            });
        }
    }

    const updateStatement = async (timeSpent: number) => {
        try {
            await updateFinancialStatements(currentStatementId, timeSpent);
            toast({
                variant: "default",
                title: "✅ Success 😊!",
                description: "Financial statement updated successfully!"
            });
        } catch (e) { // IF we lose connection, start sending an off request to the server.
            const errorMessage = (e as Error).message;
            toast({
                variant: "destructive", 
                title: "❌ Sorry! There was an error updating the financial statement 🙁",
                description: errorMessage
            });

            turnOffMachine();
            redirectPage($router, "lostConnectionPage");
        }
    }

    return { curBudget, createStatement, updateStatement};
}

export default useMutationStatements;