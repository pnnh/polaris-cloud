'use client'

import {Breadcrumb} from '~/antd'
import React from 'react'

export function SiteNav () {
  return <Breadcrumb
    items={[
      {
        title: <a href="/console">控制台</a>,
      },
      {
        title: <a href="/console/pipeline">构建流水线</a>,
      },
      {
        title: <a href="/console/stage">构建阶段</a>,
      },
      {
        title: <a href="/console/job">构建作业</a>,
      },
      {
        title: '构建任务',
      },
    ]}
  />
}