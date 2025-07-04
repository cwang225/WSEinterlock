import useMutationBudgetCodes from "@/hooks/use-budgetCodes-mutation-hook";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import useQueryBudgets from "@/hooks/use-query-budgetCodes";


//prop for handling state of the dialog
type DeleteBudgetCodeDialogProp = {
  budgetcodeId: number;
  setShowDeleteBudgetCode:  React.Dispatch<React.SetStateAction<boolean>>;
};

//function that handles state of the dialog
const DeleteBudgetCodeDialog = ({
  budgetcodeId,
  setShowDeleteBudgetCode,
}: DeleteBudgetCodeDialogProp) => {
  const { modifyBudgetCode } = useMutationBudgetCodes();


  const { loadBudgets } = useQueryBudgets(false);

  //async function that handles deletion logic
  const handleDeleteBudgetCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
     await modifyBudgetCode(budgetcodeId, 0);
    setShowDeleteBudgetCode(false); //make the dialog disappear
    loadBudgets();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteBudgetCode(false);
  };

  // Handle dialog close event
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDeleteBudgetCode(false);
    }
  };

  return (
    <div  data-cy="budget-code-delete-dialog">
    <AlertDialog open={true} onOpenChange={handleDialogClose} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the budgetcode from using the machines. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} data-cy="budget-code-delete-cancel">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteBudgetCode}  data-cy="budget-code-delete-confirm">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>

  );
};

export default DeleteBudgetCodeDialog;
