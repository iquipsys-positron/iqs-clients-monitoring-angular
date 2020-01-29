export const MonitoringMapStateName: string = 'app.map';

class MonitoringMapController implements ng.IController {
    public $onInit() { }
    private cleanUpFunc: Function;
    constructor(
        $rootScope: ng.IRootScopeService,
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        $state: ng.ui.IStateService,
        $injector: angular.auto.IInjectorService,
        private pipNavService: pip.nav.INavService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";

        this.appHeader();
        // $rootScope.$on(pip.services.IdentityChangedEvent, this.appHeader.bind(this));
        $scope.$on('$destroy', () => {
            if (angular.isFunction(this.cleanUpFunc)) {
                this.cleanUpFunc();
            }
        });
    }

    private appHeader(): void {

        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.appbar.addShadow();
        this.pipNavService.breadcrumb.text = 'MONITORING';

        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showMenu();
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureMonitoringMapRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider

        .state(MonitoringMapStateName, {
            url: '/map?search&device_id',
            auth: true,
            reloadOnSearch: false,
            views: {
                '@': {
                    controller: MonitoringMapController,
                    controllerAs: '$ctrl',
                    reloadOnSearch: false,
                    templateUrl: "monitoring/map/MapPage.html"
                }
            }

        })
}

function configureMonitoringMapAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {
        zonePopapConfigure: iqs.shell.AccessRole.manager, // 
        sendSignal: iqs.shell.AccessRole.manager
    }
    iqsAccessConfigProvider.registerStateAccess(MonitoringMapStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(MonitoringMapStateName, accessConfig);
}


(() => {

    angular
        .module('iqsMonitoring.Map', [
            'iqsMonitoring.Map.Panel',
            'iqsLastEventPanel',
            'iqsSearchResultsPanel',
            'iqsZoneEventRulesPanel',
            'iqsCurrentObjectStates',
            'iqsZoomButtonsPanel',
            'iqsCurrentStateObjectDetailsPanel'
        ])
        .config(configureMonitoringMapRoute)
        .config(configureMonitoringMapAccess);

})();