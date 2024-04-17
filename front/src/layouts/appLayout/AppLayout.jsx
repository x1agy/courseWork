import React from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import { Layout } from "antd";

import styles from './appLayout.module.css';

const AppLayout = ({ children }) => {
    return(
        <Layout className={styles.layout}>
            <AppHeader />
            {children}
        </Layout>
    )
}

export default AppLayout;