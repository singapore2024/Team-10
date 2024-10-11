import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Material UI Cart Icon

export default function HeaderCart() {
  return (
    <Link href={'/cart'}>
      <a className="cart-header">
        <div className="cart-header__icon-container">
          <ShoppingCartIcon style={{ fontSize: 32 }} /> {/* Simple Cart Icon */}
        </div>
      </a>
    </Link>
  );
}
