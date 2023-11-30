import React from 'react'
import {Table} from './partials/table'
import {getAccessToken} from '@/services/auth'
import {Toolbar} from './partials/toolbar'
import queryString from 'query-string'
import styles from './page.module.scss'
import {CodeOk, SelectResult} from '@/models/common_result'
import {ParameterServer} from '@/services/server/parameter'
import {ParameterModel} from '@/models/parameter'
import {SiteNav} from './partials/sitenav'

export default async function Page ({searchParams}: {
  searchParams: Record<string, string>
}) {
  const rawQuery = queryString.stringify(searchParams)
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return <div>未登录</div>
  }
  const result = await ParameterServer.selectModels(accessToken, rawQuery)
  if (!result || ('status' in result && result.status !== CodeOk)) {
    return <div>未知错误</div>
  }

  return <div>
    <div className={styles.breadcrumbNav}>
      <SiteNav/>
    </div>
    <div className={styles.toolbarContainer}>
      <Toolbar rawQuery={rawQuery}/>
    </div>
    <div className={styles.tableContainer}>
      <Table data={result as SelectResult<ParameterModel>} rawQuery={rawQuery}/>
    </div>
  </div>
}
