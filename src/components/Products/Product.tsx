import type { Product } from "@/model/product";
import Image from "next/image";

const Product = ({ product }: { product: Product }) => {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-auto group-hover:opacity-75 lg:h-80">
        <Image
          width={300}
          height={300}
          quality={100}
          alt={product.title}
          src={product.images[0]}
          className="size-full object-contain object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.title}</h3>
          <p className="mt-1 text-sm text-gray-500"> {product.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
    </div>
  );
};

export default Product;
