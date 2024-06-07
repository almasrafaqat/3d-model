import { Box, Button, Card, CardContent, CardMedia, Typography, styled } from "@mui/material";


export const ProductCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`;

export const ProductCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: 100%;
  }
`;

export const ProductImage = styled(CardMedia)`
  width: 100%;
  height: 0;
  padding-top: 100%;
`;

export const ProductInfo = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProductTitle = styled(Typography)`
  font-weight: bold;
`;

export const ProductPrice = styled(Typography)`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const ProductActions = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductAddToCart = styled(Button)`
  margin-right: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
`;




