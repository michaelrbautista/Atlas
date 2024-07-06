import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

interface ErrorProps {
    showError: boolean;
    children: string;
}

const ErrorToast = ({ showError, children }: ErrorProps) => {
    if (!showError) {
        return null
    } else {
        return (
            <Alert className="max-w-80 fixed z-50 top-10 right-10">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {children}
                </AlertDescription>
            </Alert>
        )
    }
}

export default ErrorToast;