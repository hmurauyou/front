import { memo } from "react";
import empty from '../../images/background/empty_street.png'
import styles from './styles/Empty/Empty.module.scss'

export const Empty = memo(() => {
    return (
        <div className={styles.empty_component}>
            <p className={styles.empty_text}>No products available.</p>
            <img src={empty} alt="empty" className={styles.empty_img}/>
        </div>
    )
})