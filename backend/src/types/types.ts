export  interface ChatMessage {
    username: string;
    message: string;
}

export interface PrivateMessage {
    from: string;
    to: string;
    message: string;
}