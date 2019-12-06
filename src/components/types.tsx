export type Products = Array<Category>;
export type Category = {
  categoryName: string;
  list: Array<Product>;
};
export type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
};
