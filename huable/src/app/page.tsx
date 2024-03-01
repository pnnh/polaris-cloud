import React from 'react'
import styles from './page.module.scss' 
import { getIdentity } from '@/services/auth'  
import { selectApps } from '@/services/server/app'

export default async function Home () {
  // const session = await getIdentity()
  // console.log('auth:', session)

  const appList = selectApps()

  return <div className={styles.indexPage}>
    {/* <PublicNavbar account={session}></PublicNavbar> */}
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
