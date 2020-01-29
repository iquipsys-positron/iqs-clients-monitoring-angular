import { IOperationalEventSaveService } from './IOperationalEventSaveService';
import { IOperationalEventAddDialogService } from './dialogs/IOperationalEventAddDialogService';
import { NewOperationalEvent } from './NewOperationalEvent';

export const MonitoringEventsStateName: string = 'app.events';

class OperationalEventsMonitoringController implements ng.IController {
    public $onInit() { }
    private localFilter: iqs.shell.AssocietedObject = null;
    private mediaSizeGtSm: boolean;
    public details: boolean;
    public severityMedium: number = iqs.shell.Severity.Medium;
    public severityLow: number = iqs.shell.Severity.Low;;
    public severityHigh: number = iqs.shell.Severity.High;
    public searchCriteria: string = '';
    public newOperationalEvent: NewOperationalEvent;
    public eventTemplate: iqs.shell.EventTemplate;
    public currentState: string;
    public error: any;
    public accessConfig: any;
    public isSearch: boolean = false;
    public defaultCollection: string[];
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private $rootScope: ng.IRootScopeService,
        public $scope: ng.IScope,
        private $interval: ng.IIntervalService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private pipNavService: pip.nav.INavService,
        private pipDateConvert: pip.dates.IDateConvertService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private pipDateFormat: pip.dates.IDateFormatService,
        private iqsOperationalEventsViewModel: iqs.shell.IOperationalEventsViewModel,
        private iqsOperationalEventAddDialog: IOperationalEventAddDialogService,
        private iqsOperationalEventSaveService: IOperationalEventSaveService,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsLocationsViewModel: iqs.shell.ILocationsViewModel,
        private iqsZonesViewModel: iqs.shell.IZonesViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private pipScroll: pip.services.IScrollService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.defaultCollection = this.iqsOperationalEventsViewModel.getDefaultCollection();

        if (this.searchCriteria) {
            this.iqsOperationalEventsViewModel.isSort = true;
            this.iqsOperationalEventsViewModel.filter = null;
            this.iqsOperationalEventsViewModel.selectAllow = true;
            this.iqsOperationalEventsViewModel.search = this.searchCriteria;
            this.iqsOperationalEventsViewModel.reload(() => {
                this.defaultCollection = this.iqsOperationalEventsViewModel.getDefaultCollection();
                let collection = this.iqsOperationalEventsViewModel.getCollection();
            });
        } else {
            this.onReload();
        }


        this.cf.push($rootScope.$on('pipAutoPullChanges', () => {
            if (!this.transaction.busy()) {
                this.iqsOperationalEventsViewModel.isSort = true;
                this.iqsOperationalEventsViewModel.filter = null;
                this.iqsOperationalEventsViewModel.selectAllow = true;
                this.iqsOperationalEventsViewModel.search = this.searchCriteria;
                this.iqsOperationalEventsViewModel.read(false, () => {
                    this.defaultCollection = this.iqsOperationalEventsViewModel.getDefaultCollection();
                    let collection = this.iqsOperationalEventsViewModel.getCollection();
                });
            }
        }));

        
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = this.iqsAccessConfig.getStateConfigure().access;
            this.iqsObjectGroupsViewModel.read();
            this.iqsLocationsViewModel.read();
            this.iqsObjectsViewModel.read();
            this.iqsZonesViewModel.read();    
        };
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));

        if (!this.pipMedia('gt-sm')) {
            if (this.currentState === iqs.shell.States.Add) {
                this.details = true;
            } else {
                this.details = $location.search().details == 'details' ? true : false;
            }
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');
                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                } else {
                    if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                        this.details = true;
                    }
                }
                this.appHeader();
            }

        }));

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));

        $scope.$on('$destroy', () => {
            this.saveCurrentState();

            for (const f of this.cf) { f(); }
        });
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.onCancel();
    }

    private saveCurrentState() {
        this.iqsOperationalEventSaveService.newOperationalEvent = this.newOperationalEvent;
        this.iqsOperationalEventSaveService.eventId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsOperationalEventSaveService.currState = this.state;
        this.iqsOperationalEventSaveService.search = this.searchCriteria;
        this.iqsOperationalEventSaveService.eventTemplate = this.eventTemplate;
    }

    private restoreState() {
        this.searchCriteria = this.iqsOperationalEventSaveService.search ? this.iqsOperationalEventSaveService.search : this.$location.search()['search'] || '';
        if (this.iqsOperationalEventSaveService.eventId) {
            this.$location.search('event_id', this.iqsOperationalEventSaveService.eventId);
        }
        this.currentState = this.iqsOperationalEventSaveService.currState ? this.iqsOperationalEventSaveService.currState : null;
        this.currentState = this.currentState == iqs.shell.States.Add || this.currentState == iqs.shell.States.Edit ? null : this.currentState;
        this.newOperationalEvent = this.iqsOperationalEventSaveService.newOperationalEvent ? this.iqsOperationalEventSaveService.newOperationalEvent : null;
        this.eventTemplate = this.iqsOperationalEventSaveService.eventTemplate ? this.iqsOperationalEventSaveService.eventTemplate : null;
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';
        this.pipNavService.breadcrumb.items = [
            <pip.nav.BreadcrumbItem>{ title: "MONITORING", click: () => { this.$state.go('app.map'); } },
            <pip.nav.BreadcrumbItem>{ title: "MONITORING_EVENTS", click: () => { } }
        ];
        this.pipNavService.actions.secondaryLocalActions = [
            {
                name: 'OPERATIONAL_EVENT_ADD_TEMPLETE', title: 'OPERATIONAL_EVENT_ADD_TEMPLETE', icon: 'icons:plus', state: 'settings_system.events_themplates'
            }
        ];

        if (!this.pipMedia('gt-sm')) {
            if (this.details) {
                let detailsTitle: string;
                if (this.currentState != iqs.shell.States.Add) {
                    detailsTitle = "MONITORING_EVENTS_DETAILS";
                } else if (this.currentState == iqs.shell.States.Add) {
                    detailsTitle = "OPERATIONAL_EVENT_NEW";
                }

                this.pipNavService.breadcrumb.items = [
                    <pip.nav.BreadcrumbItem>{ title: "MONITORING", click: () => { this.$state.go('app.map'); } },
                    <pip.nav.BreadcrumbItem>{
                        title: "MONITORING_EVENTS", click: () => {
                            this.toMainFromDetails();
                        }, subActions: []
                    },
                    <pip.nav.BreadcrumbItem>{
                        title: detailsTitle, click: () => { }, subActions: []
                    }
                ];
                this.pipNavService.icon.showBack(() => {
                    this.toMainFromDetails();
                });
            } else {
                this.pipNavService.icon.showBack(() => {
                    this.$state.go('app.map');
                });
            }
        } else {
            this.pipNavService.icon.showMenu();
        }
    }

    private focusedNewButton() {
        this.pipScroll.scrollTo('.pip-list-container', '#new-item', 300);
    }

    private addPosition(event: iqs.shell.OperationalEvent) {
        if (event.loc_id || event.zone_id) {
            if (event.loc_id) {
                const location: iqs.shell.Location = this.iqsLocationsViewModel.getLocationById(event.loc_id);
                if (location) {
                    event.pos = _.cloneDeep(location.pos);
                }
            } else {
                let zone: iqs.shell.Zone = this.iqsLocationsViewModel.getLocationById(event.zone_id);
                if (zone) {
                    event.pos = _.cloneDeep(zone.center);
                }
            }
        }
    }

    private createOperationalEvent(event: iqs.shell.OperationalEvent) {
        this.addPosition(event);

        event.org_id = this.iqsOrganization.orgId;
        event.severity = event.severity === undefined || event.severity === null ? iqs.shell.Severity.Low : event.severity;
        event.type = iqs.shell.OperationalEventType.ManualRecord;

        this.iqsOperationalEventsViewModel.create(
            event,
            (data: iqs.shell.OperationalEvent) => {
                this.onCancel();
                if (this.state == iqs.shell.States.Empty) {
                    this.iqsOperationalEventsViewModel.getCollection();
                }
            },
            (error: any) => { }
        );
    }

    public onCancel() {
        this.details = this.currentState == iqs.shell.States.Add ? false : this.details;
        this.currentState = null;
        this.newOperationalEvent = null;
        this.eventTemplate = null;
        this.appHeader();
    }

    public get collection(): iqs.shell.OperationalEvent[] {
        let collection = this.iqsOperationalEventsViewModel.getCollection();
        return this.iqsOperationalEventsViewModel.getCollection();
    }

    public get state(): string {
        return this.currentState ? this.currentState : this.iqsOperationalEventsViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsOperationalEventsViewModel.getTransaction();
    }

    public get selectedItem(): iqs.shell.OperationalEvent {
        return this.iqsOperationalEventsViewModel.getSelectedItem();
    }

    public selectItem(index: number) {
        if (this.state == iqs.shell.States.Add) { return };

        this.iqsOperationalEventsViewModel.selectItem(index);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public get selectedIndex() {
        return this.iqsOperationalEventsViewModel.selectedIndex;
    }

    public set selectedIndex(value: number) {

    }

    public onHistory(): void {
        // this.$state.go('retrospective.events', { retro_date: this.pipDateConvert.addHours(new Date(), -24).toISOString(), search: this.searchCriteria });
        window.location.href = window.location.origin + `/retrospective/index.html#/app/events?retro_date=${this.pipDateConvert.addHours(new Date(), -24).toISOString()}&search=${this.searchCriteria}`;

    }

    public onRetry() {
        this.$window.history.back();
    }

    public onSave(event: iqs.shell.OperationalEvent) {
        this.createOperationalEvent(event);
    }

    public onReload() {
        this.iqsOperationalEventsViewModel.isSort = true;
        this.iqsOperationalEventsViewModel.filter = null;
        this.iqsOperationalEventsViewModel.selectAllow = true;
        this.iqsOperationalEventsViewModel.search = this.searchCriteria;
        this.iqsOperationalEventsViewModel.read(true, () => {
            this.defaultCollection = this.iqsOperationalEventsViewModel.getDefaultCollection();
            let collection = this.iqsOperationalEventsViewModel.getCollection();
            this.isSearch = false;
        });
    }

    private addNewOperationalEvent(template?: iqs.shell.EventTemplate) {
        this.newOperationalEvent = <NewOperationalEvent>{};
        this.eventTemplate = template;

        if (this.newOperationalEvent.severity === undefined || this.newOperationalEvent.severity === null) {
            this.newOperationalEvent.severity = iqs.shell.Severity.Low;
        }

        this.currentState = iqs.shell.States.Add;
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        } else {
            this.focusedNewButton();
        }
    }

    public onAddOperationalEvent($event): void {
        this.iqsOperationalEventAddDialog.show(
            $event,
            (item?: iqs.shell.EventTemplate) => {
                if (item) {
                    if (!item.set_object && !item.set_time && !item.set_pos) {
                        let operationalEvent: iqs.shell.OperationalEvent = new iqs.shell.OperationalEvent();
                        operationalEvent = {
                            type: iqs.shell.OperationalEventType.ManualRecord,
                            severity: item.severity,
                            time: new Date().toISOString(),
                            group_id: null,
                            object_id: null,
                            loc_id: null,
                            zone_id: null,
                            description: item.description
                        };
                        this.createOperationalEvent(operationalEvent);

                        return;
                    }

                    this.addNewOperationalEvent(item);
                } else {
                    this.addNewOperationalEvent(null);
                }
            },
            () => {
                // do nothing
            }
        );
    }

    public onDeleteOperationalEvent(item: iqs.shell.OperationalEvent) {
        if (item && item.id) {
            this.iqsOperationalEventsViewModel.deleteOperationalEventById(
                item.id,
                () => {

                },
                (error: any) => {
                    console.log('deleted error', error);
                });
        }
    }

    public onSearch() {
        this.isSearch = true;
        this.onReload();
    }

    public get searchedCollection(): string[] {
        return this.iqsOperationalEventsViewModel.getSearchedCollection();
    }

    public onSearchResult(query: string) {
        this.searchCriteria = query ? query.toLocaleLowerCase() : query;
        this.$location.search('search', this.searchCriteria);
        this.onSearch();
    }

    public onCanselSearch() {
        this.onSearchResult('');
    }
}

function configureEventsMonitoringRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService

) {
    "ngInject";

    $stateProvider
        .state(MonitoringEventsStateName, {
            url: '/events?search&event_id&details',
            auth: true,
            reloadOnSearch: false,
            views: {
                '@': {
                    controller: OperationalEventsMonitoringController,
                    controllerAs: '$ctrl',
                    templateUrl: "monitoring/events/OperationalEventsPage.html"
                }
            }
        })
}

function configureEventsMonitoringAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {
        addEvent: iqs.shell.AccessRole.manager,
        delEvent: iqs.shell.AccessRole.admin,
        showEventHistory: iqs.shell.AccessRole.user,
    }
    iqsAccessConfigProvider.registerStateAccess(MonitoringEventsStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(MonitoringEventsStateName, accessConfig);
}

(() => {

    angular
        .module('iqsMonitoring.Events', [
            'pipNav', 'iqsFormats.ObjectFilter',

            'iqsOperationalEventEmptyPanel',
            'iqsOperationalEventDetailsPanel',
            'iqsOperationalEventNewPanel',

            'iqsOperationalEvents.ViewModel',
            'iqsMonitoring.EventSaveService',
            'iqsOperationalEventAddDialog',

            'iqsObjectGroups.ViewModel',
            'iqsLocations.ViewModel',
            'iqsZones.ViewModel',
            'iqsObjects.ViewModel',
            'iqsAccessConfig.Service',
            'iqsOrganizations.Service'
        ])
        .config(configureEventsMonitoringRoute)
        .config(configureEventsMonitoringAccess);

})();
