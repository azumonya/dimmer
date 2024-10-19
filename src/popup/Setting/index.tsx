import { useState, useEffect } from 'react'
import cls from 'classnames'
import { IoMdSettings } from 'react-icons/io'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { BsBugFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'
import { FaAngleRight } from 'react-icons/fa'
import { FaAngellist } from 'react-icons/fa'

import styles from './index.module.scss'

import Button from '@/components/Button'
import Dropdown, { listItem } from '@/components/Dropdown'
import Switch from '@/components/Switch'
import { langList } from '@/constant'

interface Setting {
  onBack: () => void
}

const Setting = ({ onBack }: Setting) => {
  const [global, setGlobal] = useState<boolean>(false)
  useEffect(() => {
    const v = localStorage.getItem('lightoffGlobal')
    console.log('init', v)
    setGlobal(v === '1')
    // init()
    // checkCurrentPageCanInject()
  }, [])

  const backHandler = () => {
    console.log(123)
    onBack()
  }

  const dropdownOnChange = () => {
    console.log(1)
  }

  const switchOnChange = () => {
    const t = !global
    const v = t ? '1' : '0'
    console.log(v)
    setGlobal(t)
    localStorage.setItem('lightoffGlobal', v)
  }

  return (
    <div className={styles.settingPage}>
      <div className={styles.header}>
        <Button className={styles.settingButton} onClick={backHandler}>
          <IoMdArrowRoundBack size={20} />
        </Button>

        {/* <Button className={styles.settingButton} onClick={backHandler}>
          <IoMdArrowRoundBack size={20} />
        </Button> */}
      </div>
      <div className={styles.content}>
        <div className={styles.item}>
          <div className={styles.label}>
            <RiGlobalLine size={20} className={styles.icon} />
            <span>Global</span>
          </div>
          <Switch value={global} onChange={switchOnChange} className={styles.switch} />
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FaHeart size={20} className={styles.icon} />
            <span>Rate</span>
          </div>
          <span>
            <FaAngleRight size={20} className={styles.rightIcon} />
          </span>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <BsBugFill size={20} className={styles.icon} />
            <span>Feedback</span>
          </div>
          <span>
            <FaAngleRight size={20} className={styles.rightIcon} />
          </span>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>
            <FaAngellist size={20} className={styles.icon} />
            <span>Colora</span>
          </div>
          <span>
            <FaAngleRight size={20} className={styles.rightIcon} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default Setting
