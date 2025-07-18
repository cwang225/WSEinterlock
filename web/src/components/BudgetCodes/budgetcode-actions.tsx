import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button"; 
  import { useState } from "react";
  import DeleteBudgetCodeDialog from "./delete-budgetCode-dialogue";
import { BudgetCode } from "@/data/types/budgetCode";
import ActivateBudgetCodeDialog from "./activate-budgetcode";

  
  type BudgetCodeActionsProps = {
    budgetcode: BudgetCode;
  };
  
  export default function BudgetCodeActions({ budgetcode }: BudgetCodeActionsProps) {
    const [ShowDeleteBudgetCode, setShowDeleteBudgetCode] = useState(false);
    const [ShowActivateBudgetCode, setShowActivateBudgetCode] = useState(false);
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteBudgetCode(true);
    };

    const handleActivate = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowActivateBudgetCode(true);
    };
  
    const handleCloseDelete = () => {
      setShowDeleteBudgetCode(false);
    };
  
    return (
      <div data-cy={`budget-code-actions-${budgetcode.id}`}>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="absolute top-2 right-2 deck-actions" data-cy={`budget-code-trigger-${budgetcode.id}`} >
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {budgetcode.active === 1 && <DropdownMenuItem onClick={handleDelete} className="delete-text-red" data-cy={`budget-code-delete-${budgetcode.id}`} >
            Deactivate
          </DropdownMenuItem>}
          {budgetcode.active === 0 && <DropdownMenuItem onClick={handleActivate} className="" data-cy={`budget-code-activate-${budgetcode.id}`} >
            Activate
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
  
      {ShowDeleteBudgetCode && (
        <DeleteBudgetCodeDialog
          budgetcodeId={budgetcode.id}
          setShowDeleteBudgetCode={handleCloseDelete}
        />
      )}
      {ShowActivateBudgetCode && (
        <ActivateBudgetCodeDialog
          budgetcode={budgetcode}
          setShowActivateBudgetCode={setShowActivateBudgetCode}
        />
      )}
      </div>
    );
  }
  