(() => {
    function configMonitoringtranslations(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            MONITORING: 'Monitoring',
            ZONE_INCLUDE_RULES_LABEL: 'Rules apply',
            ZONE_INCLUDE_RULES_EMPTY_LABEL: 'There are no rules to apply',
            ZONE_EXCLUDE_RULES_LABEL: 'Exclude from rules',
            ZONE_EXCLUDE_RULES_EMPTY_LABEL: 'The are no exclusions',
            'TYPE': 'Type',
            PARKING_TIME: 'Parking time',
            STOPING_TIME: 'Stoping time',
        });

        pipTranslateProvider.translations('ru', {
            MONITORING: 'Наблюдение',
            ZONE_INCLUDE_RULES_LABEL: 'Применяются правила',
            ZONE_INCLUDE_RULES_EMPTY_LABEL: 'Применяемые правила не заданы',
            ZONE_EXCLUDE_RULES_LABEL: 'Исключается из правил',
            ZONE_EXCLUDE_RULES_EMPTY_LABEL: 'Нет исключений',
            'TYPE': 'Тип',
            PARKING_TIME: 'Время стоянки',
            STOPING_TIME: 'Время отстановки',
        });
    }

    angular
        .module('iqsMonitoring')
        .config(configMonitoringtranslations);
})();