import './events/OperationalEventsPage';
import './events/dialogs/OperationalEventAddDialog';
import './map/MapPage';
import './objects/ObjectsPage';
import './objects/ObjectsPage';

export const MonitoringStateName: string = 'app';

class MonitoringController implements ng.IController {
    public $onInit() { }

    constructor(
        private $window: ng.IWindowService,
        $scope: ng.IScope,
        $state: ng.ui.IStateService,
        $mdMedia: angular.material.IMedia,
        $injector: angular.auto.IInjectorService,
        private pipNavService: pip.nav.INavService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private pipMedia: pip.layouts.IMediaService
    ) {
        "ngInject";
        this.appHeader();

    }

    private appHeader(): void {
        this.pipNavService.appbar.addShadow();
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.appbar.parts = { 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
    }

    public onRetry() {
        this.$window.history.back();
    }
}

function configureMonitoringRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(MonitoringStateName, {
            url: '/app',
            auth: true,
            abstract: true,
            views: {
                '@': {
                    controller: MonitoringController,
                    controllerAs: 'main',
                    templateUrl: 'monitoring/Monitoring.html'
                }
            }
        })
}

function configureMonitoringAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.user;
    let accessConfig: any = {}

    iqsAccessConfigProvider.registerStateAccess(MonitoringStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(MonitoringStateName, accessConfig);
}

(() => {
    angular
        .module('iqsMonitoring', [
            'pipNav',
            'iqsMonitoring.Objects',
            'iqsMonitoring.Events',
            'iqsMonitoring.Map'
        ])
        .config(configureMonitoringRoute)
        .config(configureMonitoringAccess);
})();

import './MonitoringStrings';
