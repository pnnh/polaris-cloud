import React from 'react'
import styles from './layout.module.scss'
import {ConsoleSidebar} from './sidebar'
import {ConsoleNavbar} from './navbar'
import {getIdentity} from '@/services/auth'
import Link from 'next/link'
import {fullAuthUrl} from '@/services/common/const'
import {FluentProviders} from '@/components/client/providers'

export default async function ConsoleLayout({
                                                children
                                            }: {
    children: React.ReactNode
}) {
    const identity = await getIdentity()

    if (!identity) {
        const clientAuthUrl = fullAuthUrl('/console')

        return <div>
            <h1>您尚未登陆或已过期</h1>
            <Link
                href={clientAuthUrl} className={styles.loginLink}>前往登陆</Link>
        </div>
    }
    return (
            <FluentProviders>
                <div className={styles.childrenContainer}>
                    <div className={styles.navbar}>
                        <ConsoleNavbar account={identity}></ConsoleNavbar>
                    </div>
                    <div className={styles.mainContainer}>
                        <div className={styles.leftNav}><ConsoleSidebar></ConsoleSidebar></div>
                        <div className={styles.rightBody}>
                            {children}
                        </div>
                    </div>
                </div>
            </FluentProviders>
    )
}
