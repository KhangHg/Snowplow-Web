import './ProductScreen.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Actions
import { getProductDetails } from '../redux/actions/productActions'
import { addToCart } from '../redux/actions/cartActions'
import { trackSelfDescribingEvent, newTracker, trackPageView } from '@snowplow/browser-tracker';


const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const productDetails = useSelector(state => state.getProductDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    if (product && match.params.id !== product._id) {
      dispatch(getProductDetails(match.params.id))

      newTracker('sp1', 'https://0cc9cd10-dd64-4c67-bbd4-fb8ad09e3a70.app.try-snowplow.com', {
        appId: 'test',
        plugins: [],
      });

      // trackSelfDescribingEvent({
      //   schema: 'iglu:com.my_company/viewed_product/jsonschema/1-0-0',
      //   data: {
      //     product_id: 'ASO01043',
      //     price: 49.95
      //   }
      // });

      console.log("test sefl");
      trackSelfDescribingEvent({
        schema: 'iglu:com.trysnowplow/product/jsonschema/1-0-0',
        data: {
          name: "giay",
          price: 50,
        }
      });

      // trackingProduct();
      // function trackingProduct() {
      //   console.log("test");
      //   snowplow('trackSelfDescribingEvent', {
      //     schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
      //     data: {
      //       productId: 'ASO01043',
      //       category: 'Dresses',
      //       brand: 'ACME',
      //       returning: true,
      //       price: 49.95,
      //       sizes: ['xs', 's', 'l', 'xl', 'xxl'],
      //       availableSince: new Date(2013, 3, 7)
      //     }
      //   });
      // }



      // trackingProduct();
    }
  }, [dispatch, match, product])

  const addToCartHandler = () => {
    if (user.userInfo.isLogin) {
      dispatch(addToCart(product._id, qty))
      history.push(`/cart`)
      return
    } else {
      alert('You need to first login.')
    }
  }

  return (
    <div className="productscreen">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          <div className="productscreen__left">
            <div className="left__image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="left__info">
              <p className="left__name">{product.name}</p>
              <p>Price: ${product.price}</p>
              <p>Description: {product.description}</p>
            </div>
          </div>
          <div className="productscreen__right">
            <div className="right__info">
              <p>
                Price:
                <span>${product.price}</span>
              </p>
              <p>
                Status:
                <span>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </p>
              <p>
                Qty
                <select value={qty} onChange={e => setQty(e.target.value)}>
                  {[...Array(product.countInStock).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <button type="button" onClick={addToCartHandler}>
                  Add To Cart
                </button>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductScreen
