const emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g

const phoneRegexp = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/

export const loginFields = [
    {
        label: 'Почта',
        validateTrigger: "onBlur",
        name: 'login',
        rules: [
            {required: true, message: 'Введите логин'},
            {pattern: emailRegexp, message: 'Введите корректную почту'}
        ]
    },
    {
        label: 'Пароль',
        validateTrigger: 'onBlur',
        name: 'password',
        rules: [
            {required: true, message: 'Введите пароль'}
        ]
    }
];

export const recoveryFields = [
    {
        label: 'Почта',
        validateTrigger: "onBlur",
        name: 'login',
        rules: [
            {required: true, message: 'Введите логин'},
            {pattern: emailRegexp, message: 'Введите корректную почту'}
        ]
    },
    {
        label: 'Пароль',
        validateTrigger: 'onBlur',
        name: 'password',
        rules: [
            {required: true, message: 'Введите пароль'}
        ]
    }
]

export const registrationFields = [
    ...loginFields,
    {
        label: 'ФИО (формат: фамилия имя отчество если есть)',
        validateTrigger: 'onBlur',
        name: 'fullName',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[А-яёЁ]+\s[А-яёЁ]+\s?([А-яёЁ]+)?/, message: 'Введите ФИО'}
        ]
    },
    {
        label: 'Номер телефона',
        validateTrigger: 'onBlur',
        name: 'phoneNumber',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: phoneRegexp, message: 'Введите правильный номер телефона'}
        ]
    },
    {
        label: 'Часовой пояс',
        validateTrigger: 'onBlur',
        name: 'GMT',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[+-]\d?\d/g, message: 'Введите правильный часовой пояс'}
        ]
    },
    {
        label: 'Инструмент',
        validateTrigger: 'onBlur',
        name: 'tool',
        rules: [
            {required: true, message: 'Заполните поле'}
        ]
    },
    {
        label: 'Сколько лет обучаетесь?',
        validateTrigger: 'onBlur',
        name: 'spendTime',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /\d?\d/g, message: 'Введите числовое значение'}
        ]
    },
]

export const editUserFields = [
    ...loginFields,
    {
        label: 'ФИО (формат: фамилия имя отчество если есть)',
        validateTrigger: 'onBlur',
        name: 'fullName',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[А-яёЁ]+\s[А-яёЁ]+\s?([А-яёЁ]+)?/, message: 'Введите ФИО'}
        ]
    },
    {
        label: 'Номер телефона',
        validateTrigger: 'onBlur',
        name: 'phoneNumber',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: phoneRegexp, message: 'Введите правильный номер телефона'}
        ]
    },
    {
        label: 'Часовой пояс',
        validateTrigger: 'onBlur',
        name: 'GMT',
        rules: [
            {required: true, message: 'Заполните поле'},
            {pattern: /[+-]\d?\d/g, message: 'Введите правильный часовой пояс'}
        ]
    },
    {
        label: 'Инструмент',
        validateTrigger: 'onBlur',
        name: 'tool',
        rules: [
            {required: true, message: 'Заполните поле'}
        ]
    },
]

export const gmtFields = [
    {
        value: '-11',
        name: 'Американское Самоа, Ниуэ'
    },
    {
        value: '-10',
        name: 'США (Гавайи, Алеутские острова)'
    },
    {
        value: '-9',
        name: 'США (Аляска)'
    },
    {
        value: '-8',
        name: 'Канада, США, Мексика'
    },
    {
        value: '-7',
        name: 'Канада, США, Мексика'
    },
    {
        value: '-6',
        name: 'Гватемала, Белиз, Гондурас, Сальвадор, Никарагуа, Коста-Рика'
    },
    {
        value: '-5',
        name: 'Багамские Острова, Куба, Гаити, Ямайка, Перу, Бразилия'
    },
    {
        value: '-4',
        name: 'Пуэрто-Рико, Венесуэла, Гайана, Бразилия, Боливия, Парагвай, Чили'
    },
    {
        value: '-3',
        name: 'Дания (Гренландия), Бразилия, Аргентина, Уругвай, Чили'
    },
    {
        value: '-1',
        name: 'Португалия (Азорские острова), Кабо-Верде'
    },
    {
        value: '+0',
        name: 'Исландия, Великобритания, Ирландия'
    },
    {
        value: '+1',
        name: 'Австрия, Албания, Андорра, Бельгия'
    },
    {
        value: '+2',
        name: 'Калининград'
    },
    {
        value: '+3',
        name: 'Москва'
    },
    {
        value: '+4',
        name: 'Самара'
    },
    {
        value: '+5',
        name: 'Екатеринбург'
    },
    {
        value: '+6',
        name: 'Омск'
    },
    {
        value: '+7',
        name: 'Красноярск'
    },
    {
        value: '+8',
        name: 'Иркутск'
    },
    {
        value: '+9',
        name: 'Якутск'
    },
    {
        value: '+10',
        name: 'Владивосток'
    },
    {
        value: '+11',
        name: 'Магадан'
    },
    {
        value: '+12',
        name: 'Камчатка'
    },
]