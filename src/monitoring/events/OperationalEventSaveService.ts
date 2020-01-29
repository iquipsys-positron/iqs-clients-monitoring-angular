import { IOperationalEventSaveService } from './IOperationalEventSaveService';
import { NewOperationalEvent } from './NewOperationalEvent';

class OperationalEventSaveService implements IOperationalEventSaveService {
    private _newOperationalEvent: NewOperationalEvent;
    private _eventId: string;
    private _currState: string;
    private _search: string;
    private _eventTemplate: iqs.shell.EventTemplate;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
    ) {
        "ngInject";

    }

    public set eventTemplate(eventTemplate: iqs.shell.EventTemplate) {
        this._eventTemplate = eventTemplate;
    }

    public get eventTemplate(): iqs.shell.EventTemplate {
        return this._eventTemplate;
    }

    public set eventId(eventId: string) {
        this._eventId = eventId;
    }

    public get eventId(): string {
        return this._eventId;
    }

    public set currState(currState: string) {
        this._currState = currState;
    }

    public get currState(): string {
        return this._currState;
    }
    
    public set search(search: string) {
        this._search = search;
    }

    public get search(): string {
        return this._search;
    }
    
    public set newOperationalEvent(event: NewOperationalEvent) {
        this._newOperationalEvent = event;
    }

    public get newOperationalEvent(): NewOperationalEvent {
        return this._newOperationalEvent;
    }
}

{
    angular.module('iqsMonitoring.EventSaveService', [])
        .service('iqsOperationalEventSaveService', OperationalEventSaveService);

}