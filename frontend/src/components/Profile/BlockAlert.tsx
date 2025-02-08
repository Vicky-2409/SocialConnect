"use client";
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Fade,
  styled,
} from "@mui/material";

interface AlertDialogProps {
  children: React.ReactElement<{ onClick?: () => void }>;
  onConfirm: () => void;
  alert: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    minWidth: 320,
    maxWidth: "90vw",
    margin: theme.spacing(2),
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  fontSize: "1.5rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  color: theme.palette.text.secondary,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  gap: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  minWidth: 100,
}));

function ModernAlertDialog(props: AlertDialogProps): React.JSX.Element {
  const {
    children,
    onConfirm,
    alert,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <React.Fragment>
      {React.cloneElement(children, { onClick: handleClickOpen })}
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
      >
        <StyledDialogTitle id="alert-dialog-title">
          {alert}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "text.secondary",
            }}
          ></IconButton>
        </StyledDialogTitle>

        {description && (
          <StyledDialogContent>
            <DialogContentText id="alert-dialog-description">
              {description}
            </DialogContentText>
          </StyledDialogContent>
        )}

        <StyledDialogActions>
          <StyledButton
            onClick={handleClose}
            variant="outlined"
            color="inherit"
          >
            {cancelText}
          </StyledButton>
          <StyledButton
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            autoFocus
          >
            {confirmText}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}

export default ModernAlertDialog;
