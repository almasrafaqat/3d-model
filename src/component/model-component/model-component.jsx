import { Box } from "@mui/material"
import {
  ProductActions,
  ProductAddToCart,
  ProductCard,
  ProductCardContainer,
  ProductImage,
  ProductInfo,
  ProductTitle
} from "./model.style"
import { Link } from "react-router-dom"


const ModelComponent = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ProductCardContainer>
        <Link to="/model/polo-shirt">
          <ProductCard>
            <ProductImage
              image="/assets/images/polo-shirt.jpg"
            />
            <ProductInfo>
              <ProductTitle>
                Polo Shirt Customizer
              </ProductTitle>
            </ProductInfo>
            <ProductActions>
              <ProductAddToCart variant="contained">Add to Cart</ProductAddToCart>
            </ProductActions>
          </ProductCard>
        </Link>
      </ProductCardContainer>
    </Box>
  )
}

export default ModelComponent
