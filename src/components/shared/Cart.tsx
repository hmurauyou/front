import { useCart } from '../providers/CartProvider';
import styles from './styles/Cart/Cart.module.scss'

export default function Cart() {
    const { cartItems } = useCart();
    
    return (
        <div className="offcanvas offcanvas-end custom-offcanvas" id="offcanvasCart" aria-labelledby="offcanvasCartLabel">
            <div className="offcanvas-header">
                <h2 className="offcanvas-title" id="offcanvasCartLabel">Cart</h2>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>{item.name}</li>
                        ))}
                    </ul>
                )}
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