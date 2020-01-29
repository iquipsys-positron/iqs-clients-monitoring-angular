import { OperationalEventAddDialogParams } from './IOperationalEventAddDialogService';

export class OperationalEventAddDialogController extends OperationalEventAddDialogParams implements ng.IController {

    public $onInit() { }

    public theme;
    public state: string;
    public eventTemplate: iqs.shell.EventTemplate;
    public controlObjects: iqs.shell.ControlObject[] = [];
    public zones: iqs.shell.Zone[] = [];
    public objectGroups: iqs.shell.ObjectGroup[];

    constructor(
        private $mdDialog: angular.material.IDialogService,
        private $state: ng.ui.IStateService,
        private $timeout: ng.ITimeoutService,
        private $rootScope: ng.IRootScopeService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsOperationalEventTemplatesViewModel: iqs.shell.IOperationalEventTemplatesViewModel
    ) {
        "ngInject";

        super();
        this.theme = $rootScope[pip.themes.ThemeRootVar];
        this.iqsOperationalEventTemplatesViewModel.read();

        if (pipMedia('gt-xs')) {
            $timeout(() => {
                if (!this.event) return;

                var el = $('md-dialog');
                var body = $('body');
                let y = this.event.clientY - el[0].clientHeight;
                let x = this.event.clientX - el[0].clientWidth + 150;
                // if (!pipMedia('gt-md')) {
                //     x += 150;
                // } 
                el.css('position', 'fixed');
                el.css('top', y);
                el.css('left', x);
            });
        }
    }

    public get operationalEventsTemplatesCollection(): iqs.shell.EventTemplate[] {
        return this.iqsOperationalEventTemplatesViewModel.getCollection();
    }

    public setSelectedItem(item: iqs.shell.EventTemplate): void {
        this.$mdDialog.hide(item);
    }

    public onAddHandle() {
        this.eventTemplate = null;
        this.$mdDialog.hide(null);
    }

    public onAddTemplate() {
        this.$mdDialog.cancel();
        // this.$state.go('settings_system.events_themplates');
        window.location.href = window.location.origin + `/config_events/index.html#/events_templates`;
    }
}

angular
    .module('iqsOperationalEventAddDialog', [
        'ngMaterial',

        'iqsOperationalEventAddPanel',
        'iqsEventTemplates.ViewModel'
    ])
    .controller('iqsOperationalEventAddDialogController', OperationalEventAddDialogController);

import "./OperationalEventAddDialogService"