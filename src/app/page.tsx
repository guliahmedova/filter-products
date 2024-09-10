"use client";
import EmptyState from "@/components/Products/EmptyState";
import Product from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  {
    name: "None",
    value: "",
  },
  {
    name: "Price: Low to High",
    value: "asc",
  },
  {
    name: "Price: High to Low",
    value: "desc",
  },
] as const;

const SUBCATE_CATEGORIES = [
  { name: "beauty", selected: true, label: "Beauty" },
  { name: "fragrances", selected: true, label: "Fragrances" },
  { name: "furniture", selected: true, label: "Furniture" },
  { name: "groceries", selected: true, label: "Groceries" },
  { name: "home-decoration", selected: true, label: "Home Decoration" },
  { name: "kitchen-accessories", selected: true, label: "Kitchen Accessories" },
  { name: "laptops", selected: true, label: "Laptops" },
  { name: "mens-shirts", selected: true, label: "Men's Shirts" },
  { name: "mens-shoes", selected: true, label: "Men's Shoes" },
  { name: "mens-watches", selected: true, label: "Men's Watches" },
  { name: "mobile-accessories", selected: true, label: "Mobile Accessories" },
  { name: "motorcycle", selected: true, label: "Motorcycle" },
  { name: "skin-care", selected: true, label: "Skin Care" },
  { name: "smartphones", selected: true, label: "Smartphones" },
  { name: "sports-accessories", selected: true, label: "Sports Accessories" },
  { name: "sunglasses", selected: true, label: "Sunglasses" },
  { name: "tablets", selected: true, label: "Tablets" },
  { name: "tops", selected: true, label: "Tops" },
  { name: "vehicle", selected: true, label: "Vehicle" },
  { name: "womens-bags", selected: true, label: "Women's Bags" },
  { name: "womens-dresses", selected: true, label: "Women's Dresses" },
  { name: "womens-jewellery", selected: true, label: "Women's Jewellery" },
  { name: "womens-shoes", selected: true, label: "Women's Shoes" },
  { name: "womens-watches", selected: true, label: "Women's Watches" },
];

// like color
const SORTBY_FILTERS = {
  id: "sorting",
  name: "sorting",
  options: [
    { value: "title", label: "Title" },
    { value: "discountPercentage", label: "Discount" },
    { value: "rating", label: "Rating" },
    { value: "brand", label: "Brand" },
    { value: "weight", label: "Weight" },
    { value: "minimumOrderQuantity", label: "Minimum Order Quantity" },
  ],
};

interface IResponse {
  products: Product[];
  limit: number;
  skip: number;
  total: number;
}

export default function Home() {
  const [filter, setFilter] = useState({
    sort: "",
    sortBy: "",
  });

  const [category, setCategory] = useState("");

  const { data: products } = useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      const params: any = {};

      setCategory("");

      if (filter.sortBy) {
        params.sortBy = filter.sortBy;
      }
      if (filter.sort) {
        params.sortBy = "price";
        params.order = filter.sort;
      }

      const { data } = await axios.get<IResponse>(
        "https://dummyjson.com/products",
        { params }
      );

      return data;
    },
  });

  const { data: productsByCategory } = useQuery({
    queryKey: ["productsByCategory", category],
    queryFn: async () => {
      if (!category) return { products: [], limit: 0, skip: 0, total: 0 };
      const { data } = await axios.get<IResponse>(
        `https://dummyjson.com/products/category/${category}`
      );
      return data;
    },
  });

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    setFilter((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  };

  const displayProducts = category
    ? productsByCategory?.products
    : products?.products;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-5 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Filter Products
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center items-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 size-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  key={option.name}
                  onClick={() =>
                    setFilter((prevState) => ({
                      ...prevState,
                      sort: option.value,
                    }))
                  }
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-400 sm:ml-6 lg:hidden">
            <Filter className="size-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUBCATE_CATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setCategory(category.name)}
                    disabled={!category.selected}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Sort By</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {SORTBY_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          onChange={() =>
                            applyArrayFilter({
                              category: "sortBy",
                              value: option.value,
                            })
                          }
                          name="sortBy"
                          checked={filter.sortBy === option.value}
                          type="radio"
                          id={`sort-${optionIdx}`}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:text-indigo-500"
                        />
                        <label
                          htmlFor={`sort-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayProducts && displayProducts.length === 0 ? (
              <EmptyState />
            ) : displayProducts ? (
              displayProducts?.map((product) => (
                <Product product={product} key={product.id} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, index) => <ProductSkeleton key={index} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
