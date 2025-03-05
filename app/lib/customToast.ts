import { toast } from "sonner";

export const showToast = (message: string, type?: 'success' | 'danger' | 'normal') => {
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