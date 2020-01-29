/// <reference path="../typings/tsd.d.ts" />
import './monitoring/Monitoring';

class PositronMonitoringAppController implements ng.IController {
    public $onInit() { }
    public isChrome: boolean;

    constructor(
        $rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        pipSystemInfo: pip.services.ISystemInfo,
    ) {
        "ngInject";

        this.isChrome = pipSystemInfo.browserName == 'chrome' && pipSystemInfo.os == 'windows';
    }
}

angular
    .module('iqsPositronMonitoringApp', [
        'iqsPositronMonitoring.Config',
        'iqsPositronMonitoring.Templates',
        'iqsOrganizations.Service',
        'iqsMonitoring'
    ])
    .controller('iqsPositronMonitoringAppController', PositronMonitoringAppController);


