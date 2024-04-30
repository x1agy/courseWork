import { Flex } from "antd";
import React, { useContext, useEffect } from "react";
import Text from 'antd/es/typography/Text';

import styles from './home.module.css';
import { UserContext } from './../../App';
import { useNavigate } from "react-router-dom";

const Home = () => {

    const {userContext} = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        if(userContext?.login){
            navigate('/user-page');
        }
    }, [userContext, navigate])
    return(
        <Flex className={styles.home}>
            <h1 className={styles.title}>Информация</h1>
            <Text>Если вы давно мечтали заниматься музыкой, то самое время приступить к воплощению желания. Ведь время невозможно вернуть назад, и надо жить здесь и сейчас! Не упускайте возможность, начните музыкальное обучение онлайн сегодня. В этом вам поможет онлайн школа музыки «Живая Гармония». Несколько простых этапов и у вас получится воплотить свою давнюю мечту в жизнь.</Text>
            <h1 className={styles.subTitle}>Достоинства онлайн уроков:</h1>
            <Text>
                Обучение музыке онлайн:
                <li className={styles.listElement}>Помогает существенно сэкономить время и силы, которые вы раньше тратили по пути к месту обучения. В среднем у вас в запасе останется 2—3 часа, проведите их с пользой, занимаясь своими делами.</li>
                <li className={styles.listElement}>Вы сохраняете денежные средства, ранее уходившие на бензин или проезд в общественном транспорте.</li>
                <li className={styles.listElement}>Сами составляете удобное для вас расписание занятий.</li>
                <li className={styles.listElement}>Самостоятельно выбираете цели обучения. Можно выбрать уроки музыки онлайн в качестве увлечения, «для себя» либо освоить дисциплину на профессиональном уровне.</li>
                <li className={styles.listElement}>Занятия можно проводить из любого уголка любой страны. Нет необходимости прекращать обучение в рабочей поездке или отпуске. Этот вариант особенно удобен для проживающих в небольших населенных пунктах, где нет возможности найти профессионального преподавателя высокого класса.</li>
                <li className={styles.listElement}>Вы можете обучаться дома, в рабочем кабинете, в любой удобной обстановке.</li>
                <li className={styles.listElement}>Онлайн уроки позволяют в любое время узнать, как идут дела на занятиях у вашего ребёнка.</li>
            </Text>
        </Flex>
    )
}

export default Home;