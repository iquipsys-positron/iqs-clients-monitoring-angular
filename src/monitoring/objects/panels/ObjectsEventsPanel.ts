interface IMonitoringObjectsEventsPanelBindings {
    [key: string]: any;
    object: any;
    count: any;
}

const MonitoringObjectsEventsPanelBindings: IMonitoringObjectsEventsPanelBindings = {
    object: '<iqsObject',
    count: '<?iqsCount'
}

class MonitoringObjectsEventsPanelChanges implements ng.IOnChangesObject, IMonitoringObjectsEventsPanelBindings {
    [key: string]: ng.IChangesObject<any>;
    object: ng.IChangesObject<iqs.shell.ControlObject>;
    count: ng.IChangesObject<number>;
}

class MonitoringObjectsEventsPanelController implements ng.IController {          public $onInit() {}
    public object: iqs.shell.ControlObject;
    public count: number;
    public events: iqs.shell.OperationalEvent[];
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private iqsOperationalEventsViewModel: iqs.shell.IOperationalEventsViewModel,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        if(this.iqsLoading.isDone) { this.readEvents(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, this.readEvents.bind(this)));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public readEvents() {
        this.iqsOperationalEventsViewModel.filter = {
            object_id: this.object.id
        };
        this.iqsOperationalEventsViewModel.read(false, (events: iqs.shell.OperationalEvent[]) => {
            this.events = events;
        });
    }

    public $onChanges(changes:  MonitoringObjectsEventsPanelChanges) {
        if (changes.object.currentValue) {
           // this.readEvents();
        }
    }


}

(() => {
    angular
        .module('iqsMonitoring.Objects.EventsPanel', [])
        .component('iqsMonitoringObjectsEventsPanel', {
            bindings: MonitoringObjectsEventsPanelBindings,
            templateUrl: 'monitoring/objects/panels/ObjectsEventsPanel.html',
            controller: MonitoringObjectsEventsPanelController,
            controllerAs: '$ctrl'
        })

})();
