import { Link } from "react-router-dom";

function Header({ cartItems }) {
  return (
    <nav style={{ padding: "10px", background: "#eee", position: "sticky", top: 0, zIndex: 1000 }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/cart" style={{ marginRight: "10px" }}>
        Cart ({cartItems.length})
      </Link>
      <Link to="/checkout">Checkout</Link>
    </nav>
  );
}

export default Header;
