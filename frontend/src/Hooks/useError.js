import { useSnackbar } from "notistack";

//Is primarily used to display notifications
const useErrorHook = () => {
  const { enqueueSnackbar } = useSnackbar();
  const notify = (message, variant, action, autoHideDuration = 6000) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, {
      variant,
      action,
      autoHideDuration,
    });
  };
  return [notify];
};

export default useErrorHook;
