import { IUser } from "@/types/types";
import userService from "@/utils/apiCalls/userService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import Image from "next/image";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AlertDialog from "./AlertDialog";
import RequestWeNetTick from "./RequestWeNetTick/RequestWeNetTick";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AccountType({ currUser }: { currUser: IUser }) {
  const [open, setOpen] = useState(false);
  const initialAccountType = currUser.accountType.isProfessional
    ? currUser.accountType.category
    : "personalAccount";
  const [accountType, setAccountType] = useState(initialAccountType);
  const [accountTypeValue, setAccountTypeValue] = useState(initialAccountType);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountTypeValue(event.target.value);
  };

  const handleChangeAccountType = async () => {
    try {
      if (!accountTypeValue) return;
      const response = await userService.changeAccountType(accountTypeValue);

      toast.success(`Success: ${response}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleClose();
      setAccountType(accountTypeValue);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const isProfessional =
    accountType === "celebrity" || accountType === "company";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-md">
        {/* Account Type Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Image
              src={`/icons/${
                isProfessional
                  ? accountType === "celebrity"
                    ? "celebrity.png"
                    : "company.png"
                  : "personalAccount.svg"
              }`}
              alt="Account Type"
              height={60}
              width={60}
              className="rounded-full border-4 border-white"
            />
            <h1 className="text-white font-semibold text-xl">
              {isProfessional
                ? accountType === "celebrity"
                  ? "Creator/Celebrity Account"
                  : "Company/Institution Account"
                : "Personal Account"}
            </h1>
          </div>

          <button
            onClick={handleClickOpen}
            className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 ease-in-out"
          >
            Change Account Type
          </button>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Professional Account Additional Section */}
        {isProfessional && (
          <div className="bg-gray-50 p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Request for Verified Tick
            </h2>
            <RequestWeNetTick />
          </div>
        )}

        {/* Dialog for Account Type Change */}
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          PaperProps={{
            className: "rounded-2xl",
          }}
        >
          <DialogTitle className="text-center font-bold text-xl text-gray-800 pt-6">
            Choose Account Type
          </DialogTitle>
          <DialogContent>
            <RadioGroup
              value={accountTypeValue}
              onChange={handleChange}
              className="space-y-3"
            >
              <FormControlLabel
                value="personalAccount"
                control={<Radio color="primary" />}
                label="Personal Account"
                className={`bg-gray-100 rounded-lg p-2 ${
                  accountTypeValue === "personalAccount" ? "bg-indigo-100" : ""
                }`}
              />

              <FormControlLabel
                value="celebrity"
                control={<Radio color="primary" />}
                label="Professional Account: Creator/Celebrity"
                className={`bg-gray-100 rounded-lg p-2 ${
                  accountTypeValue === "celebrity" ? "bg-indigo-100" : ""
                }`}
              />

              <FormControlLabel
                value="company"
                control={<Radio color="primary" />}
                label="Professional Account: Company/Institution"
                className={`bg-gray-100 rounded-lg p-2 ${
                  accountTypeValue === "company" ? "bg-indigo-100" : ""
                }`}
              />
            </RadioGroup>
          </DialogContent>
          <DialogActions className="p-6 flex justify-between">
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <AlertDialog
              onConfirm={handleChangeAccountType}
              alert={`Are you sure you want to change the account type?`}
            >
              <Button variant="contained" color="primary">
                Confirm Change
              </Button>
            </AlertDialog>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AccountType;
