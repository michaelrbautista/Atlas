import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

interface ConfirmationProps {
    showConfirmation: boolean;
    children: string;
}

const SignUpConfirmation = ({ showConfirmation, children }: ConfirmationProps) => {
    if (!showConfirmation) {
        return null
    } else {
        return (
            <Alert className="w-full top-5">
                <AlertTitle></AlertTitle>
                <AlertDescription>
                    {children}
                </AlertDescription>
            </Alert>
        )
    }
}

export default SignUpConfirmation;