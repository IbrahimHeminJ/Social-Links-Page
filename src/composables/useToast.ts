import { reactive } from "vue";

type ToastType = "success" | "error" | "info";

export const toastState = reactive({
  show: false,
  type: "info" as ToastType,
  title: "",
  message: "",
});

interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
}

export function useToast() {
  const showToast = ({ type = "info", title, message }: ShowToastOptions) => {
    toastState.type = type;
    toastState.title =
      title ||
      (type === "success"
        ? "Success"
        : type === "error"
        ? "Error"
        : "Info");
    toastState.message = message;
    toastState.show = true;
  };

  const closeToast = () => {
    toastState.show = false;
  };

  return {
    toastState,
    showToast,
    closeToast,
  };
}


