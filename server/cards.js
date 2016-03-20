cards ={};


cards.heroes = [
    //{
    //    "title": "Герой воин",
    //    "imageName": "shadow_walkerfemale",
    //    "type": "creature - hero",
    //    "text": "Первый удар, Блок щитом 1, Защитная стойка 1, Снижение лечения 1",
    //    "dmg": 1,
    //    "health": 5,
    //    "mana": 8
    //},
    {
        "title": "Герой Гор",
        "imageName": "u_gor",
        "type": "creature",
        "text": "Первый удар, Блок щитом 1, Защитная стойка 1, Снижение лечения 1",
        "dmg": 1,
        "health": 5,
        "mana": 8
    },
    //{
    //    "title": "Герой Лабиринта 1",
    //    "imageName": "u_mino",
    //    "type": "creature - hero",
    //    "text": "Первый удар, Блок щитом 1, Защитная стойка 1, Снижение лечения 1",
    //    "dmg": 1,
    //    "health": 5,
    //    "mana": 8
    //},
    //{
    //    "title": "Герой кентавр",
    //    "imageName": "u_kentavr",
    //    "type": "hero",
    //    "text": "Вызов 1, Первый удар, Блок щитом 1, Защитная стойка 1, Снижение лечения 1",
    //    "dmg": 1,
    //    "health": 5,
    //    "mana": 8
    //},
    //{
    //    "title": "Герой рейнджер",
    //    "imageName": "master_archer",
    //    "type": "hero",
    //    "text": "Дальнобойный 10, Скорость 6, Снижение лечения 1",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 8
    //},
    {
        "title": "Герой лучник",
        "imageName": "u_master_archer",
        "type": "creature",
        "text": "Дальнобойный 7, Скорость 6, Снижение лечения 1",
        "dmg": 1,
        "health": 4,
        "mana": 8
    },
    {
        "title": "Герой маг",
        "imageName": "u_mage",
        "type": "creature",
        "text": "Снижение лечения 1.\nТап, потожите 1 каунтер, не более 2.\nТап, за X манны, на расстоянии 6 нанесите дистанционную атаку на X повреждений.",
        "counter": 2,
        "dmg": 0,
        "health": 4,
        "mana": 8
    },
    //{
    //    "title": "Герой маг лох",
    //    "imageName": "witch",
    //    "type": "creature - hero",
    //    "text": "Вызов 5, Снижение лечения 1. Тап, потожите 1 каунтер, не более 2. Тап, за X манны, на расстоянии 6 нанесите X повреждений",
    //    "counter": 2,
    //    "dmg": 0,
    //    "health": 4,
    //    "mana": 8
    //},
    {
        "title": "Герой священник",
        "imageName": "rebel",
        "type": "creature",
        "text": "Вызов 3, Снижение лечения 1.\nТап, положите 1 каунтер, не более 3.\nТап, снемите X каунтеров, и восстановите X жизней у существа или существ вплотную",
        "counter": 3,
        "dmg": 1,
        "health": 5,
        "mana": 8
    }
];


cards.spells = [
    {
        "title": "Сторм болт",
        "type": "spell",
        "imageName": "",
        "text": "На расстоянии 6 производит дистанционную атаку на 2 урона.",
        "health": 1,
        "mana": 1
    },
    {
        "title": "Хил",
        "type": "spell",
        "imageName": "",
        "text": "На расстоянии 6 исцеляет 2 жизни целевому существу.",
        "health": 1,
        "mana": 1
    },
    {
        "title": "Телекинез",
        "type": "spell",
        "imageName": "",
        "text": "На расстоянии 4, передвиньте существо на 3 клетоки.",
        "health": 1,
        "mana": 1
    },
    {
        "title": "Огненный шар",
        "type": "spell",
        "imageName": "",
        "text": "На расстоянии 6 наносит 1 урон с большим АОЕ.",
        "health": 1,
        "mana": 2
    }
];


cards.areas = [
    {
        "title": "Лес",
        "type": "area",
        "imageName": "area_forest",
        "text": "Нельзя стрелять в лес и сквозь лес. Передвижение по клетке леса стоит 2 передвижения.",
        "health": 1,
        "mana": 2
    },
    {
        "title": "Огненная стена",
        "type": "area",
        "imageName": "area_firewall",
        "text": "При входе на стену огня существо получает 1 урон. В начале каждого хода все существа в стене огня получают один урон.",
        "health": 1,
        "mana": 2
    },
    {
        "title": "Стена ветра",
        "type": "area",
        "imageName": "area_windwall",
        "text": "Нельзя стрелять в, из и сквозь стену ветра.",
        "health": 1,
        "mana": 3
    },
    {
        "title": "Озеро",
        "type": "area",
        "imageName": "area_lake",
        "text": "По озеру нельзя ходить.",
        "health": 1,
        "mana": 3
    }
];


cards.creatures = [
    {
        "title": "Нищеброд",
        "imageName": "citizen",
        "type": "creature",
        "text": "Фланкирование 1",
        "dmg": 1,
        "health": 3,
        "mana": 2
    },
    //{
    //    "title": "Воин с эстоком",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Пенетрация 1",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 2
    //},
    {
        "title": "Боевой клирик",
        "imageName": "adopt",
        "type": "creature",
        "text": "Хил 1",
        "dmg": 1,
        "health": 2,
        "mana": 2
    },
    {
        "title": "Берсерк",
        "imageName": "pickpocket",
        "type": "creature",
        "text": "Буллраш",
        "dmg": 1,
        "health": 3,
        "mana": 2
    },
    //{
    //    "title": "Эльф воин",
    //    "imageName": "thieffemale",
    //    "type": "creature",
    //    "text": "Первый удар",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 2
    //},
    {
        "title": "Скаут",
        "imageName": "thieffemale",
        "type": "creature",
        "text": "Скорость 8, Удар на бегу",
        "dmg": 1,
        "health": 2,
        "mana": 2
    },
    {
        "title": "Лучник",
        "imageName": "hunter",
        "type": "creature",
        "text": "Дальнобойный 6",
        "dmg": 1,
        "health": 2,
        "mana": 2
    },
    //{
    //    "title": "Орчий метатель топоров",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Дальнобойный 4, нет штрафа в ближнем бою",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 2
    //},
    //{
    //    "title": "Гарпия (-)",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Летает",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 2
    //},
    //{
    //    "title": "Дварф ученик",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Не маневренный, Блокер",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 2
    //},
    //{
    //    "title": "Скаут",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Вызов существ 1, Скорость 6",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 2
    //},
    {
        "title": "Эльф с дубиной",
        "imageName": "burglar",
        "type": "creature",
        "text": "Если атакует, то тапает вражескую кричу.",
        "dmg": 1,
        "health": 3,
        "mana": 2
    },
    {
        "title": "Толстокожая",
        "imageName": "citizenfemale",
        "type": "creature",
        "text": "Снижение повреждений 1, Снижение лечения 1, Медленный.",
        "dmg": 1,
        "health": 2,
        "mana": 3
    },
    //{
    //    "title": "Тактик",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Фланкирование 2",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 3
    //},
    {
        "title": "Диакон",
        "imageName": "oraclemale",
        "type": "creature",
        "text": "Хил 2",
        "dmg": 0,
        "health": 2,
        "mana": 3
    },
    //{
    //    "title": "Паладин",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Блок щитом 1, Хил 1",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 3
    //},
    //{
    //    "title": "Мастер меча",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Фланкирование 1, Первый удар",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 3
    //},
    //{
    //    "title": "Дварф воин",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Защитная стойка 1, Блокер",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 3
    //},
    {
        "title": "Блинкер",
        "imageName": "rogue",
        "type": "creature",
        "text": "Летает, Скорость 8",
        "dmg": 1,
        "health": 4,
        "mana": 3
    },
    {
        "title": "Мастер телекинеза",
        "imageName": "blindfemale",
        "type": "creature",
        "text": "Тап, на расстоянии 4 передвиньте существо на 3 клетки. Разыграйте эту способность только в свой ход.",
        "dmg": 0,
        "health": 2,
        "mana": 5
    },
    {
        "title": "Мастер ветра",
        "imageName": "blindfemale",
        "type": "creature",
        "text": "Тап, на расстоянии 5 отмените 2 дистанционных повреждения.",
        "dmg": 0,
        "health": 2,
        "mana": 4
    },
    //{
    //    "title": "Дварф на кабане",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Пенетрация 1, Скорость 6",
    //    "dmg": 2,
    //    "health": 4,
    //    "mana": 4
    //},
    //{
    //    "title": "Гуль",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Лайфлинк",
    //    "dmg": 1,
    //    "health": 2,
    //    "mana": 4
    //},
    {
        "title": "Старый капитан",
        "imageName": "ninjafemale",
        "type": "creature",
        "text": "Тап, 2 крича в радиусе 6 получает Фланкирование 1 или Скорость 6 или Защитная стойка 1.",
        "dmg": 0,
        "health": 4,
        "mana": 3
    },
    //{
    //    "title": "Троль (?)",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Наскок 1, не маневренный, не отвечает, регенерация 2",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 4
    //},
    {
        "title": "Пивной воин",
        "imageName": "medium",
        "type": "creature",
        "text": "",
        "dmg": 2,
        "health": 6,
        "mana": 4
    },
    //{
    //    "title": "Минотавр",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Первый удар",
    //    "dmg": 2,
    //    "health": 4,
    //    "mana": 4
    //},
    {
        "title": "Копейщик",
        "imageName": "farmer",
        "type": "creature",
        "text": "При атаке может подвинуть атакуемое существо в зону, на дистанцию 0-3, в незанятую область.",
        "dmg": 2,
        "health": 4,
        "mana": 4
    },
    {
        "title": "Бывалый разведчик",
        "imageName": "warrior",
        "type": "creature",
        "text": "Скорость 8, Удар на бегу",
        "dmg": 2,
        "health": 4,
        "mana": 4
    },
    {
        "title": "Сержант лучник",
        "imageName": "hunterfemale",
        "type": "creature",
        "text": "Дальнобойный 6",
        "dmg": 2,
        "health": 4,
        "mana": 4
    },
    {
        "title": "Мастер кинжалов",
        "imageName": "pickpocketfemale",
        "type": "creature",
        "text": "Дальнобольный 3, нет штрафа в ближнем бою, нет штрафа при ходьбе.",
        "dmg": 2,
        "health": 4,
        "mana": 4
    },
    //{
    //    "title": "Гном с многозарядным арбалетом",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Дальнобойный 7 АОЕ 4",
    //    "dmg": 1,
    //    "health": 3,
    //    "mana": 4
    //},
    //{
    //    "title": "Охотник на чудишь",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Скорость 6, Тап, на расстоянии 4 тапает вражескую кричу ",
    //    "dmg": 1,
    //    "health": 4,
    //    "mana": 5
    //},
    //{
    //    "title": "Гаргулия",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Летает, Защитная стойка 1",
    //    "dmg": 2,
    //    "health": 4,
    //    "mana": 5
    //},
    {
        "title": "Мясной голем",
        "imageName": "blind",
        "type": "creature",
        "text": "Снижение повреждений 1, Снижение лечения 1, Регенерация 1, Медленный, Не отвечает",
        "dmg": 2,
        "health": 4,
        "mana": 5
    },
    //{
    //    "title": "Епископ (?)",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Тап, исключите из игры попавшее в гв существо, на расстоянии 5.Тап, положите на это существо каунтер.Когда на существе накапливается ? верните существо в игру рядом с епископом.",
    //    "dmg": 0,
    //    "health": 4,
    //    "mana": 5
    //},
    {
        "title": "Тысячерук",
        "imageName": "archer",
        "type": "creature",
        "text": "Дальнобойный 6, малое АОЕ",
        "dmg": 1,
        "health": 4,
        "mana": 5
    },
    {
        "title": "Священник",
        "imageName": "master_oracle",
        "type": "creature",
        "text": "Хил 3",
        "dmg": 0,
        "health": 3,
        "mana": 6
    },
    {
        "title": "Унижающий",
        "imageName": "bodyguard",
        "type": "creature",
        "text": "Буллраш, Снижение повреждений 1, Снижение лечения 1, Скорость 6",
        "dmg": 2,
        "health": 4,
        "mana": 6
    },
    {
        "title": "Вампир",
        "imageName": "ninja",
        "type": "creature",
        "text": "Лайфлинк, Летает, Скорость 6, Быстрый удар",
        "dmg": 1,
        "health": 5,
        "mana": 6
    },
    {
        "title": "Мастер скорости",
        "imageName": "warden",
        "type": "creature",
        "text": "Скорость 8, Удар на бегу",
        "dmg": 3,
        "health": 6,
        "mana": 6
    },
    {
        "title": "Мастер лука",
        "imageName": "archerfemale",
        "type": "creature",
        "text": "Дальнобойный 6",
        "dmg": 3,
        "health": 5,
        "mana": 7
    },
    {
        "title": "Демон",
        "imageName": "shadow_walker",
        "type": "creature",
        "text": "Регенерация 2, Скорость 8, Дальнобойный 6, нет штрафа в ближнем бою",
        "dmg": 2,
        "health": 5,
        "mana": 7
    },
    {
        "title": "Минотавр",
        "imageName": "u_mino",
        "type": "creature",
        "text": "Вирлвинд, Быстрый удар, Не отвечает",
        "dmg": 2,
        "health": 8,
        "mana": 8
    },
    {
        "title": "Кентавр тысячерук",
        "imageName": "u_kentavr",
        "type": "creature",
        "text": "Дальнобойный 6, большое АОЕ",
        "dmg": 1,
        "health": 6,
        "mana": 8
    }
    //{
    //    "title": "Красный дракон",
    //    "imageName": "",
    //    "type": "creature",
    //    "text": "Огромный, Летает, Не отвечает",
    //    "dmg": 4,
    //    "health": 8,
    //    "mana": 8
    //}
];
