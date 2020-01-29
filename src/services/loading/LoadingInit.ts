function initPopulating(
    iqsCurrentObjectStatesViewModel: iqs.shell.ICurrentObjectStatesViewModel,
    iqsStatesViewModel: iqs.shell.IStatesViewModel,
    iqsOperationalEventTemplatesViewModel: iqs.shell.IOperationalEventTemplatesViewModel,
    iqsOperationalEventsViewModel: iqs.shell.IOperationalEventsViewModel,
    iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
    iqsObjectRoutesViewModel: iqs.shell.IObjectRoutesViewModel,
    iqsAccountsViewModel: iqs.shell.IAccountsViewModel,
    iqsDataProfilesViewModel: iqs.shell.IDataProfilesViewModel,
    iqsIncidentsViewModel: iqs.shell.IIncidentsViewModel,
    iqsIncidentsConfig: iqs.shell.IIncidentsConfigService,
    iqsMapViewModel: iqs.shell.IMapViewModel,
    iqsMapConfig: iqs.shell.IMapService,
    pipIdentity: pip.services.IIdentityService,
    iqsLoading: iqs.shell.ILoadingService,
    iqsOrganization: iqs.shell.IOrganizationService
) {
    iqsLoading.push('data', [
        iqsCurrentObjectStatesViewModel.clean.bind(iqsCurrentObjectStatesViewModel),
        iqsStatesViewModel.clean.bind(iqsStatesViewModel),
        iqsOperationalEventTemplatesViewModel.clean.bind(iqsOperationalEventTemplatesViewModel),
        iqsOperationalEventsViewModel.clean.bind(iqsOperationalEventsViewModel),
        iqsEventRulesViewModel.clean.bind(iqsEventRulesViewModel),
        iqsObjectRoutesViewModel.cleanUp.bind(iqsObjectRoutesViewModel),
        iqsAccountsViewModel.clean.bind(iqsAccountsViewModel),
        iqsDataProfilesViewModel.clean.bind(iqsDataProfilesViewModel),
        iqsMapConfig.clean.bind(iqsMapConfig)
    ], async.parallel, [
            (callback) => {
                iqsOperationalEventTemplatesViewModel.filter = null;
                iqsOperationalEventTemplatesViewModel.isSort = true;
                iqsOperationalEventTemplatesViewModel.reload(
                    (data: any) => {
                        callback()
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsStatesViewModel.cleanUpAllStates();
                iqsStatesViewModel.initStates(new Date().toISOString(), 'all',
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsOperationalEventsViewModel.filter = null;
                iqsOperationalEventsViewModel.isSort = true;
                iqsOperationalEventsViewModel.selectAllow = false;
                iqsOperationalEventsViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsEventRulesViewModel.filter = null;
                iqsEventRulesViewModel.isSort = true;
                iqsEventRulesViewModel.reload(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsAccountsViewModel.initAccounts(
                    'all',
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsDataProfilesViewModel.initDataProfiles(
                    (data: any) => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    }
                )
            },
            (callback) => {
                iqsMapConfig.clean();
                iqsMapConfig.orgId = iqsOrganization.orgId;
                iqsMapViewModel.initMap(
                    () => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    });
            },
            (callback) => {
                iqsIncidentsConfig.updateType = iqs.shell.IncidentsUpdateType.Full;
                iqsIncidentsViewModel.filter = null;
                iqsIncidentsViewModel.isSort = true;
                iqsIncidentsViewModel.reload(
                    () => {
                        callback();
                    },
                    (error: any) => {
                        callback(error);
                    }
                );
            }
        ]);
    if (pipIdentity.identity && pipIdentity.identity.id) {
        iqsLoading.start();
    }
}


let m: any;
const requires = [
    'iqsCurrentObjectStates.ViewModel',
    'iqsStates.ViewModel',
    'iqsEventTemplates.ViewModel',
    'iqsOperationalEvents.ViewModel',
    'iqsEventRules.ViewModel',
    'iqsObjectRoutes.ViewModel',
    'iqsAccounts.ViewModel',
    'iqsDataProfiles.ViewModel',
    'iqsIncidents.ViewModel',
    'iqsMap.ViewModel',
    'iqsMapConfig',
    'iqsOrganizations.Service',
];

try {
    m = angular.module('iqsLoading');
    m.requires.push(...requires);
    m.run(initPopulating);
} catch (err) { }