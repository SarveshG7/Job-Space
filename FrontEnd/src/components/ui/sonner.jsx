import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border group-[.toaster]:border-gray-700 group-[.toaster]:shadow-lg", // Explicit background color
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-blue-500 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-gray-800",
        },
      }}
      {...props} />)
  );
}

export { Toaster }
