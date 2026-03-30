import * as React from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, { type DialogContentProps } from '@mui/material/DialogContent';
import DialogContentText, { type DialogContentTextProps } from '@mui/material/DialogContentText';
import DialogTitle, { type DialogTitleProps } from '@mui/material/DialogTitle';
import LoadingButton, { type LoadingButtonProps } from '@mui/lab/LoadingButton'

type DialogState = {
  DialogProps?: DialogProps;
  DialogTitleProps?: DialogTitleProps;
  DialogContentProps?: DialogContentProps;
  DialogContentTextProps?: DialogContentTextProps;
  DialogActions?: LoadingButtonProps[];
}

const DialogContext = React.createContext<{
  dialogState?: DialogState;
  setDialogState?: React.Dispatch<React.SetStateAction<DialogState>>;
}>({});

export function DialogProvider({
  children
}: React.PropsWithChildren) {
  const [dialogState, setDialogState] = React.useState<DialogState>({})

  return (
    <DialogContext.Provider value={{
      dialogState,
      setDialogState,
    }}>
      <DialogContainer />
      {children}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const {setDialogState} = useDialogContext();

  return (state: DialogState) => {
    setDialogState?.({
      ...state,
      DialogProps: {
        open: true,
        ...state.DialogProps,
      }
    })
  };
}

const useDialogContext = () => React.useContext(DialogContext);

function DialogContainer() {
  const {dialogState, setDialogState} = useDialogContext();

  return (
    <Dialog {...dialogState?.DialogProps} open={!!dialogState?.DialogProps?.open}>
      <DialogTitle {...dialogState?.DialogTitleProps} />
      <DialogContent {...dialogState?.DialogContentProps}>
        <DialogContentText {...dialogState?.DialogContentTextProps} />
      </DialogContent>
      <DialogActions>
        {dialogState?.DialogActions?.map((action) => (
          <ActionButton {...action} onClick={async (event) => {
            const result = await action.onClick?.(event)

            if(!result) {
              setDialogState?.({
                DialogProps: {
                  open: false
                }
              })
            }
          }} />
        ))}
      </DialogActions>
    </Dialog>
  );
}

function ActionButton(props: LoadingButtonProps) {
  const [loading, setLoading] = React.useState(false)
  return (
    <LoadingButton {...props} loading={props.loading || loading} onClick={async (event) => {
      try {
        setLoading(true)
        await props.onClick?.(event)
      }
      finally {
        setLoading(false)
      }
    }} />
  )
}