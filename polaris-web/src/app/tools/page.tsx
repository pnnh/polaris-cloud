import React from 'react'
import styles from './page.module.scss'
import {selectApps} from "@/services/server/tools";

export default async function Home() {
    const appList = selectApps()

    return <div className={styles.indexPage}>
        <div className={styles.appGrid}>
            {
                appList.map(app => {
                    return <div className={styles.appCard} key={app.id}>
                        <h1 className={styles.appTitle}>
                            <a href={app.url}>{app.name}</a>
                        </h1>
                        <p className={styles.appDescription}>{app.description}</p>
                    </div>
                })
            }
        </div>
    </div>
}