import Link from 'next/link'
import styles from './navbar.module.scss'
import {fullAuthUrl} from '@/services/common/const'
import Image from 'next/image'
import {AccountModel} from '@/models/account'
import React from "react";
import {UserProfileSelector} from "@/app/partials/profile";
import {userRole} from "@/services/schema";

export function PublicNavbar(props: { account?: AccountModel }) {
    const entry = userRole()
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <div>
                <Link className={styles.brandLink} href={'/'}>
                    <Image src='/images/logo.png' alt='logo' fill={true} sizes={'48px,48px'}/>
                </Link>
            </div>
            <UserProfileSelector role={entry}/>
            <RoleNavbar role={entry}/>
        </div>
        <div className={styles.rightNav}>
            <UserAction account={props.account}/>
        </div>
    </div>
}

function RoleNavbar({role}: { role: string }) {
    if (role === 'portal') {
        return <div>Not Found</div>
    } else if (role === 'venus') {
        return <Link className={styles.navLink} href={'/venus/channels'}>频道</Link>
    }
    return <Link className={styles.navLink} href={'/polaris/channels'}>频道</Link>
}

function UserAction(props: { account?: AccountModel }) {
    if (!props.account) {
        const clientAuthUrl = fullAuthUrl('/')
        return <Link
            href={clientAuthUrl} rel='nofollow' className={styles.loginLink}>登录</Link>
    }
    return <div>
        <Link className={styles.loginLink} href={'/console'}>{props.account.nickname}</Link>
    </div>
}