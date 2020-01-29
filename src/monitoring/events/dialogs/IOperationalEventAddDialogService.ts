export class OperationalEventAddDialogParams {
    public event: any;
}


export interface IOperationalEventAddDialogService {
    show(event, successCallback?: (data?: any) => void, cancelCallback?: () => void): any;
}