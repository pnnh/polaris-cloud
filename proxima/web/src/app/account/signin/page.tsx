'use client'

import React, {useState} from 'react'
import styles from './page.module.scss'
import {handleSignInSubmit} from '@/services/client/webauthn'
import Link from '~/next/link'
import validator from 'validator'
import {useRouter} from 'next/navigation'
import {signinByMailBegin, signinByPasswordBegin} from '@/services/client/account'

export default function Home () {
  const [username, setUsername] = useState('xspanni@gmail.com')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  return <div className={styles.loginContainer}>
        <div className={styles.mainBox}>
            <div className={styles.boxTitle}>
                登陆
            </div>
            <div className={styles.fieldRow}>
                <input className="input input-bordered w-full" type="text" placeholder="输入用户名"
                       value={username} onChange={(event) => {
                         setUsername(event.target.value)
                       }}/>
            </div>

            {errorMessage &&
                <div className={styles.messageRow}>
                    <span>{errorMessage}</span>
                </div>
            }
            <div className={styles.actionRow}>
                <button className="btn" onClick={() => {
                  handleSignInSubmit(username).then(() => {
                    console.log('登陆成功')
                  })
                }}>Webauthn登录
                </button>
                <button className="btn" onClick={async () => {
                  console.log('你点击了邮箱登陆', username)
                  if (validator.isEmail(username)) {
                    const result = await signinByMailBegin(username)
                    console.log('register result', result)
                    if (result && result.code === 200) {
                      router.replace('/account/signin/email/' + result.data.session)
                    }
                  } else {
                    setErrorMessage('请输入正确的邮箱地址')
                  }
                }}>邮箱验证码登陆
                </button>
                <button className="btn" onClick={async () => {

                  console.log('你点击了账号密码登陆')
                  const result = await signinByPasswordBegin(username)
                  console.log('register result', result)
                  if (result && result.code === 200) {
                    router.replace('/account/signin/password/' + result.data.session)
                  }
                }}>账号密码登陆
                </button>
            </div>
            <div className={styles.tipRow}>
                还没有Multiverse账号?
                <Link href={'/account/signup'}>立即注册</Link>
            </div>
        </div>
    </div>
}
