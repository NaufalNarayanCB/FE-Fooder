import { IMenu } from "@/app/types";
import { getCookies } from "@/lib/server-cookie";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge"; //untuk komunikasi dengan beckend cukup dengan satu baris saja
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import AddMenu from "./addMenu";
import EditMenu from "./editMenu";
import DeleteMenu from "./deleteMenu";

interface MenuResponse {
  status: boolean;
  data: {
    status: boolean;
    data: IMenu[];
    message: string;
  };
}

const getMenu = async (search: string): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const response = (await get(url, TOKEN)) as MenuResponse;

    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.error("Unexpected response structure:", response);
    return [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

const MenuPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // const MenuPage = async ({ searchParams }: { searchParams?: Record<string, string | string[] >  }) => {
  //   const search = searchParams?.search?.toString() ?? "";
  const search = searchParams.search ? searchParams.search.toString() : ``;
  const menu: IMenu[] = await getMenu(search);

  const category = (cat: string): React.ReactNode => {
    if (cat === "FOOD") {
      return (
        <span className="bg-blue-100 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          Food
        </span>
      );
    }
    if (cat === "SNACK") {
      return (
        <span className="bg-indigo-100 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
          Snack
        </span>
      );
    }
    return (
      <span className="bg-purple-100 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
        Drink
      </span>
    );
  };
  return (
    <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md">
      <div className="text-4xl pl-5 pt-5 font-bold mb-2 text-black">Menu Data</div>
      <p className="text-black text-sm text-secondary mb-4 pl-5 pt-2">
        This page displays menu data, allowing menus to view details, search,
        and manage menu items by adding, editing, or deleting them.
      </p>
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-md flex-grow pl-5 text-black">
          <Search url={`/manager/menu`} search={search} />
        </div>
        {/* Add Menu Button */}
        <div className="ml-4 pr-4">
          <AddMenu />
        </div>
      </div>
      {menu.length == 0 ? (
        <AlertInfo title="informasi">No data Available</AlertInfo>
      ) : (
        <>
          <div className="m-2">
            {menu.map((data, index) => (
              <div
                key={`keyPrestasi${index}`}
                className={`flex flex-wrap bg-sky-600 rounded-lg m-1`}
              >
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary">
                    Picture
                  </small>
                  <br />
                  <Image
                    width={40}
                    height={40}
                    src={`${BASE_IMAGE_MENU}/${data.picture}`}
                    className="rounded-sm overflow-hidden"
                    alt="preview"
                    unoptimized
                  />
                </div>
                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary">Name</small>{" "}
                  <br />
                  {data.name}
                </div>
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary">
                    Price
                  </small>{" "}
                  <br />
                  {data.price}
                </div>
                <div className="w-full md:w-5/12 p-2">
                  <small className="text-sm font-bold text-primary">
                    Description
                  </small>{" "}
                  <br />
                  {data.description}
                </div>
                <div className="w-full md:w-1/12 p-2">
                  <small className="text-sm font-bold text-primary">
                    Category
                  </small>{" "}
                  <br />
                  {category(data.category)}
                </div>
                <div className="w-full md:w-2/12 p-2">
                  <small className="text-sm font-bold text-primary">
                    Action
                  </small>
                  <div className="flex gap-1">
                    <EditMenu selectedMenu={data} />
                    <DeleteMenu selectedMenu={data} />
                  </div>
                  <br />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuPage;