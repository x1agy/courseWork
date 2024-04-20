import React from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import { Layout } from "antd";

import styles from './appLayout.module.css';
import AppFooter from "../../components/AppFooter/AppFooter";

const AppLayout = ({ children }) => {
    return(
        <Layout className={styles.layout}>
            <AppHeader/>
            <div className={styles.bodyStyles}>
                {children}
            </div>
            <AppFooter />
        </Layout>
    )
}

export default AppLayout;