import Image from "next/image";

import CategorySelector from "@/components/ui/common/category-selector";
import { Header } from "@/components/ui/common/header";
import ProductList from "@/components/ui/common/products-list";
import { db } from "@/db";

const Home = async () =>{
  const products = await db.query.productTable.findMany({
    with:{
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});
  
  return (
    <>
      <Header/>
      <div className="space-y-6">
        <div className="px-5">
         <Image src="/banner.png" alt="texto" width={0} height={0} sizes="100vw" className="w-full h-auto"/>
        </div>
        
        <ProductList products={products} title="Mais vendidos"/>

        <div className="px-5">
          <CategorySelector 
           categories={categories}
          />
        </div>

        <div className="px-5">
         <Image src="/banner2.png" alt="texto" width={0} height={0} sizes="100vw" className="w-full h-auto"/>
        </div>

      </div>

    </>
  );
}

export default Home;
