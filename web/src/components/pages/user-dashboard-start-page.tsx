import { Input } from "../ui/input";
import { useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { setActiveTab } from "@/data/store";
import { Button } from "../ui/button";

/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/


const UserStartPage = () => {
    var callPython:number = 0;

  const [cardNum, setCardNum] = useState("");

  const { validateUser } = useQueryUsers(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNum(e.target.value);
  }

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && cardNum) {
      e.preventDefault();

      const newCardNum = cardNum;
      
      e.currentTarget.value = "";
      validateUser(Number.parseInt(newCardNum), callPython).then(s => {
        if (s === "users") {
            setActiveTab(-1);
            redirectPage($router, "userDashboardMachinesStatus");   
        }
        else {
            redirectPage($router, s);
        }
      });
    }
  }

  return (
    <div className="items-center sign-in-container ">
      <div className="p-6 space-y-6 rounded-lg shadow-xl ">
        <h1 className="text-4xl font-bold text-center jhu-blue">
          Sign into User Dashboard
        </h1>
        <h2 className="text-lg text-center text-black">Please enter your card number below to sign in.</h2>

        <div className="flex flex-col space-y-4">
          <Input
            onChange={handleOnChange}
            placeholder="Enter your card number"
            onKeyDown={handleSubmitOnEnter}
            className="border-2"
            data-cy="cardnum-input"
          />
          
          <Button
            onClick={() => handleSubmitOnEnter({ key: "Enter" } as any)}
            className="text-lg jhu-blue-button"
            variant={"ghost"}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserStartPage;