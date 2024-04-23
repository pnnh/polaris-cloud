'use client'

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './captcha.css' 
import Image from 'next/image'
import { Button } from '@mui/material'

export interface GoCaptchaProps {
  value: boolean
  width: string
  height: string
  calcPosType: 'dom' | 'screen'
  maxDot: number
  imageBase64: string
  thumbBase64: string
  close: () => void
  refresh: () => void
  confirm: (dots: {x:number, y:number}[]) => void
}

export interface GoCaptchaState {
  imageBase64Code: string
  thumbBase64Code: string
  dots: {x:number, y:number, index:number}[]
}

export default class GoCaptcha extends Component<GoCaptchaProps, GoCaptchaState> {
  static defaultProps = {
    value: PropTypes.bool.isRequired,
    width: '300px',
    height: '240px',
    calcPosType: PropTypes.oneOf(['dom', 'screen']),
    maxDot: 5,
    imageBase64: PropTypes.string,
    thumbBase64: PropTypes.string
  }

  constructor (props: GoCaptchaProps) {
    super(props)
    this.state = {
      imageBase64Code: '',
      thumbBase64Code: '',
      dots: []
    }
  }

  render () {
    const {
      width = '',
      height = '',
      imageBase64 = '',
      thumbBase64 = ''
    } = this.props

    const RenderDotItem = () => {
      const {dots = []} = this.state
      return dots.map((dot) =>
                <div key={dot.index} className="wg-cap-wrap__dot" style={{top: `${dot.y}px`, left: `${dot.x}px`}}>
                    <span>{dot.index}</span>
                </div>)
    }

    return <div className="wg-cap-wrap">
                <div className="wg-cap-wrap__header">
                    <span>请在下图<em>依次</em>点击：</span>
                    {
                        thumbBase64 && <Image className="wg-cap-wrap__thumb" src={thumbBase64} alt=" "
                        width={150} height={150}/>
                    }
                </div>
                <div className="wg-cap-wrap__body" style={{
                  width,
                  height
                }}>
                    {
                        imageBase64 && <Image className="wg-cap-wrap__picture"
                             src={imageBase64} alt=" "
                             fill={true}
                             onClick={this.handleClickPos}/>
                    }
                    <Image className="wg-cap-wrap__loading"
                         src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiByZ2JhKDI0MSwgMjQyLCAyNDMsIDApOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM2LjgxMDEiIHI9IjEzIiBmaWxsPSIjM2U3Y2ZmIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN5IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgY2FsY01vZGU9InNwbGluZSIga2V5U3BsaW5lcz0iMC40NSAwIDAuOSAwLjU1OzAgMC40NSAwLjU1IDAuOSIga2V5VGltZXM9IjA7MC41OzEiIHZhbHVlcz0iMjM7Nzc7MjMiPjwvYW5pbWF0ZT4KICA8L2NpcmNsZT4KPC9zdmc+"
                         alt="正在加载中..."
                         width={68} height={68}/>
                        <RenderDotItem/>
                </div>
                <div className="wg-cap-wrap__footer">
                    <div className="wg-cap-wrap__ico">
                        <Image onClick={this.handleCloseEvent}
                             src="data:image/svg+xml;base64,PHN2ZyB0PSIxNjI2NjE0NDM5NDIzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg2NzUiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEyIDIzLjI3MjcyN2MyNjkuOTE3MDkxIDAgNDg4LjcyNzI3MyAyMTguODEwMTgyIDQ4OC43MjcyNzMgNDg4LjcyNzI3M2E0ODYuNjMyNzI3IDQ4Ni42MzI3MjcgMCAwIDEtODQuOTQ1NDU1IDI3NS40MDk0NTUgNDYuNTQ1NDU1IDQ2LjU0NTQ1NSAwIDAgMS03Ni44NDY1NDUtNTIuNTI2NTQ2QTM5My41NDE4MTggMzkzLjU0MTgxOCAwIDAgMCA5MDcuNjM2MzY0IDUxMmMwLTIxOC41MDc2MzYtMTc3LjEyODcyNy0zOTUuNjM2MzY0LTM5NS42MzYzNjQtMzk1LjYzNjM2NFMxMTYuMzYzNjM2IDI5My40OTIzNjQgMTE2LjM2MzYzNiA1MTJzMTc3LjEyODcyNyAzOTUuNjM2MzY0IDM5NS42MzYzNjQgMzk1LjYzNjM2NGEzOTUuMTcwOTA5IDM5NS4xNzA5MDkgMCAwIDAgMTI1LjQ0LTIwLjI5MzgxOSA0Ni41NDU0NTUgNDYuNTQ1NDU1IDAgMCAxIDI5LjQ4NjU0NSA4OC4yOTY3MjhBNDg4LjI2MTgxOCA0ODguMjYxODE4IDAgMCAxIDUxMiAxMDAwLjcyNzI3M0MyNDIuMDgyOTA5IDEwMDAuNzI3MjczIDIzLjI3MjcyNyA3ODEuOTE3MDkxIDIzLjI3MjcyNyA1MTJTMjQyLjA4MjkwOSAyMy4yNzI3MjcgNTEyIDIzLjI3MjcyN3ogbS0xMTUuMiAzMDcuNzEyTDUxMiA0NDYuMTM4MTgybDExNS4yLTExNS4yYTQ2LjU0NTQ1NSA0Ni41NDU0NTUgMCAxIDEgNjUuODE1MjczIDY1Ljg2MTgxOEw1NzcuODYxODE4IDUxMmwxMTUuMiAxMTUuMmE0Ni41NDU0NTUgNDYuNTQ1NDU1IDAgMSAxLTY1Ljg2MTgxOCA2NS44MTUyNzNMNTEyIDU3Ny44NjE4MThsLTExNS4yIDExNS4yYTQ2LjU0NTQ1NSA0Ni41NDU0NTUgMCAxIDEtNjUuODE1MjczLTY1Ljg2MTgxOEw0NDYuMTM4MTgyIDUxMmwtMTE1LjItMTE1LjJhNDYuNTQ1NDU1IDQ2LjU0NTQ1NSAwIDEgMSA2NS44NjE4MTgtNjUuODE1MjczeiIgcC1pZD0iODY3NiIgZmlsbD0iIzcwNzA3MCI+PC9wYXRoPjwvc3ZnPg=="
                             alt="关闭"
                             height={32} width={32}/>
                        <Image onClick={this.handleRefreshEvent}
                             src="data:image/svg+xml;base64,PHN2ZyB0PSIxNjI2NjE0NDk5NjM4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzNjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMTg3LjQ1NiA0MjUuMDI0YTMzNiAzMzYgMCAwIDAgMzY4LjM4NCA0MjAuMjI0IDQ4IDQ4IDAgMCAxIDEyLjU0NCA5NS4xNjggNDMyIDQzMiAwIDAgMS00NzMuNjY0LTU0MC4xNmwtNTcuMjgtMTUuMzZhMTIuOCAxMi44IDAgMCAxLTYuMjcyLTIwLjkyOGwxNTkuMTY4LTE3OS40NTZhMTIuOCAxMi44IDAgMCAxIDIyLjE0NCA1Ljg4OGw0OC4wNjQgMjM1LjA3MmExMi44IDEyLjggMCAwIDEtMTUuODA4IDE0LjkxMmwtNTcuMjgtMTUuMzZ6TTgzNi40OCA1OTkuMDRhMzM2IDMzNiAwIDAgMC0zNjguMzg0LTQyMC4yMjQgNDggNDggMCAxIDEtMTIuNTQ0LTk1LjE2OCA0MzIgNDMyIDAgMCAxIDQ3My42NjQgNTQwLjE2bDU3LjI4IDE1LjM2YTEyLjggMTIuOCAwIDAgMSA2LjI3MiAyMC45MjhsLTE1OS4xNjggMTc5LjQ1NmExMi44IDEyLjggMCAwIDEtMjIuMTQ0LTUuODg4bC00OC4wNjQtMjM1LjA3MmExMi44IDEyLjggMCAwIDEgMTUuODA4LTE0LjkxMmw1Ny4yOCAxNS4zNnoiIGZpbGw9IiM3MDcwNzAiIHAtaWQ9IjEzNjEiPjwvcGF0aD48L3N2Zz4="
                             alt="刷新"
                             height={32} width={32}/>
                    </div>
                    <div>
                      <Button onClick={this.handleConfirmEvent}>登录</Button>
                    </div>
                </div>
            </div>
  }

  static getDerivedStateFromProps (nextProps: GoCaptchaProps, prevState: GoCaptchaState) {
    const res = {} as GoCaptchaState
    let count = 0
    if (!nextProps.value) {
      res.dots = []
      res.imageBase64Code = ''
      res.thumbBase64Code = ''
      count++
    }

    if (prevState.imageBase64Code !== nextProps.imageBase64) {
      res.dots = []
      res.imageBase64Code = nextProps.imageBase64
      count++
    }
    if (prevState.thumbBase64Code !== nextProps.thumbBase64) {
      res.dots = []
      res.thumbBase64Code = nextProps.thumbBase64
      count++
    }

    return (count ? res : null)
  }

  handleCloseEvent = () => {
    this.props.close && this.props.close()
    this.setState({
      dots: [],
      imageBase64Code: '',
      thumbBase64Code: ''
    })
  }

  handleRefreshEvent = () => {
    this.setState({
      dots: []
    })

    this.props.refresh && this.props.refresh()
  }

  handleConfirmEvent = () => {
    this.props.confirm && this.props.confirm(this.state.dots || [])
  }

  handleClickPos = (ev: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const {dots = []} = this.state
    const {maxDot} = this.props

    if (dots.length >= maxDot) {
      return
    }
    const e = ev 
    e.preventDefault()
    const dom = e.currentTarget

    const {domX, domY} = this.getDomXY(dom)

    let mouseX = e.pageX
    let mouseY = e.pageY
    if (this.props.calcPosType === 'screen') {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // 计算点击的相对位置
    const xPos = mouseX - domX
    const yPos = mouseY - domY

    // 转整形
    const xp = parseInt(xPos.toString())
    const yp = parseInt(yPos.toString())

    // 减去点的一半
    const newDots = [...dots, {
      x: xp - 11,
      y: yp - 11,
      index: dots.length + 1
    }]

    this.setState({
      dots: newDots
    })

    return false
  }

  getDomXY = (dom: EventTarget & HTMLImageElement) => {
    let x = 0
    let y = 0
    if (dom.getBoundingClientRect) {
      const box = dom.getBoundingClientRect()
      const D = document.documentElement
      x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft
      y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop
    } else {
      let domIter:HTMLElement | null = dom
      while (domIter !== document.body && domIter !== null) {
        x += domIter.offsetLeft
        y += domIter.offsetTop
        domIter = domIter.offsetParent as HTMLElement
      }
    }
    return {
      domX: x,
      domY: y
    }
  }

}