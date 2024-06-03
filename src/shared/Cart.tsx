import styles from './styles/Cart/Cart.module.scss'

export default function Cart() {
    return (
        // <div className={styles.main}>
        //     <h2>Cart</h2>
        //     <div className={styles.list_cart}>
        //         <div className={styles.item}>
        //             <div>
        //                 <img alt='.' />
        //             </div>
        //             <div className={styles.content}>
        //                 <div className={styles.name}>Горбуша солено-мороженая, без консервантов</div>
        //                 <div className={styles.price}>35 BYN</div>
        //             </div>
        //             <div className={styles.quantity}>
        //                 <button>-</button>
        //                 <span className={styles.value}>3</span>
        //                 <button>+</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="offcanvas offcanvas-end custom-offcanvas" id="offcanvasCart" aria-labelledby="offcanvasCartLabel">
            <div className="offcanvas-header">
                <h2 className="offcanvas-title" id="offcanvasCartLabel">Cart</h2>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <p>Your cart is empty.</p>
            </div>
            <div className={styles.buttons}>
                <div className={styles.clear}>
                    Clear
                </div>
                <div className={styles.checkout}>
                    Checkout
                </div>
            </div>
        </div>
    )
}