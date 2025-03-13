import { toast } from "sonner";

export const showToast = (message: string, type?: 'success' | 'danger' | 'normal') => {

    if (message.indexOf("Rate limit for the current endpoint has been exceeded. Please try again after some time.") !== -1) {
        message = "Problem with the server. Please try again later.";
    } else if (message.indexOf("Invalid document structure") !== -1) {
        message = "Problem saving form.";
    } else {
        // message = "Something went wrong. Please try again later.";
    }

    switch (type) {
        case 'success':
            toast.success(message, {
                duration: 2000,
                position: 'top-right',
                style: {
                    color: '#fff',
                    border: '0px solid #000',
                }
            });
            break;
        case 'danger':
            toast.error(message, {
                duration: 2000,
                position: 'top-right',
                style: {
                    backgroundColor: '#fb2c36',
                    border: '0px solid #000',
                    color: '#fff',
                }
            });
            break;
        default:
            toast.info(message, {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#fff',
                    color: '#000',
                    border: '0px solid #000',
                }
            });
            break;
    }
};