import { $currentUser, resetSearch } from "@/data/store";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import { openPage } from "@nanostores/router";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import StatementDialog from "../financialStatements/statements-dialog";
import SignOutDialog from "../general/signout-dialog";


const Sidebar = () => {
    const user = useStore($currentUser);
    const router = useStore($router);

    const handleClickOnViewUsers = () => {
        resetSearch();
        openPage($router, "users");
    }

    const handleClickOnViewBudgetCodes = () => {
        resetSearch();
        openPage($router, "budgetCodes");
    }

    const handleClickOnViewMachines = () => {
        resetSearch();
        openPage($router, "machines");
    }

    const handleClickOnViewIssues = () => {
        resetSearch();
        openPage($router, "machineIssues");
    }

    

    // Set users as default route if no route is selected
    if (!router?.route) {
        openPage($router, "users");
    }

    return (
        <div className="sidebar">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">Welcome, <b className="text-2xl">{user.name}</b></h1>
            </div>
            
            <nav className="space-y-2">
                <Button 
                    variant="ghost" 
                      data-cy='view-users'
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        (!router?.route || router.route === "users") && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewUsers}
                >
                    Users
                </Button>
                
                <Button 
                    variant="ghost"
                    data-cy='view-budget-codes'
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        router?.route === "budgetCodes" && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewBudgetCodes}
                >
                    Budget Codes
                </Button>

                <Button 
                    variant="ghost"
                        data-cy='view-machines'
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        router?.route === "machines" && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewMachines}
                >
                    Machines
                </Button>

                <div className="pt-4 border-t border-gray-200">
                <Button 
                    variant="ghost"
                        data-cy='view-machine-issues'
                    className={cn(
                        "w-full justify-start transition-colors duration-200 text-lg",
                        router?.route === "machineIssues" && "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    )}
                    onClick={handleClickOnViewIssues}
                >
                    Machine Issues
                </Button>
                </div>
                

                <div className="pt-4 border-t border-gray-200">
                    <StatementDialog/>
                </div>

                <div className="pt-4 border-t border-gray-200">
                <SignOutDialog/>
                </div>

            </nav>
        </div>
    )
}

export default Sidebar;
