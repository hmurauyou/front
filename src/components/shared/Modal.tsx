import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './styles/Modal/Modal.module.scss'
import './styles/Modal/Modal.scss'

interface CartItem {
    id: string;
    name: string;
    category: string;
    product: string;
    quantity: number;
    price_byn: number;
    net_weight: string;
}

interface ModalProps {
    id: string;
    title: string;
    cartItems: CartItem[];
    quantities: number[];
    t: (key: string) => string;
  }

  const SharedModal: React.FC<ModalProps> = ({ id, title, cartItems, quantities, t }) => {
    return (
        <div className="modal fade" id={id} data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal_custom`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`${id}Label`}>{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                <div className={`modal-body ${styles.modal_body}`}>
                    <div className={styles.section_one}>
                        <div className={styles.contact_heading}>
                            <h3>In Total<span>.</span></h3>
                        </div>
                            <div className={styles.list_items}>
                                <table className={styles.content_table}>
                                    <thead>
                                        <th>Category</th>
                                        <th>Product</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                    </thead>
                                    <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.category}</td>
                                            <td>{item.product}</td>
                                            <td>{item.name}</td>
                                            <td>{quantities[index]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.total_cost}>
                                <p><strong>Total:</strong></p>
                                <p>{cartItems.reduce((total, item, index) => total + (item.price_byn * quantities[index]), 0).toFixed(2)} BYN</p>
                            </div>
                        <div className={`${styles.condition} ${styles.text}`}>
                            <p>Warning: Not paid orders will be automatically deleted in 2 weeks.</p>
                        </div>
                    </div> 
                    <div className={styles.separator}></div>
                    <div className={styles.section_two}>
                        <h1>What is Lorem Ipsum?</h1>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting, 
                            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
                            sheets containing Lorem Ipsum passages, and more recently with desktop publishing software 
                            like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default SharedModal;