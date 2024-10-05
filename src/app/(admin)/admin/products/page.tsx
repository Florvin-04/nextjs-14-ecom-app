import AddProductButton from "../../_components/AddProductButton";
import ProductsTable from "./ProductsTable";

export default async function ProductsPage() {
  // const data = await getData();

  return (
    <div className="">
      Products
      <AddProductButton />
      <div>
        <p className="truncate">asasdasdasdasdasdsadasda</p>
      </div>
      <ProductsTable />
      {/* <DataTable columns={columns} data={data?.data} /> */}
    </div>
  );
}
