import { NewOperationalEvent } from './NewOperationalEvent';

export interface IOperationalEventSaveService {
    newOperationalEvent: NewOperationalEvent;
    eventId: string;
    currState: string;
    search: string;
    eventTemplate: iqs.shell.EventTemplate;
}
