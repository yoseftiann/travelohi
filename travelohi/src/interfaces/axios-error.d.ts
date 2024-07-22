export interface IAxiosError {
    response : {
        data : {
            error: string;
        };
        status: number;
    }
}