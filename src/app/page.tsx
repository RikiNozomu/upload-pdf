import FilesList from "./components/list";
import { prisma } from "../../lib/prisma";
import Pagination from "../app/components/pagination";
import PDFUploader from "./components/upload-pdf";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home( props : {
  searchParams: SearchParams
}) {
  const pageSize = 10;
  const searchParams = await props.searchParams
  const page = parseInt(searchParams.page as string || '1');
  const total = await prisma.files.count();
  const files = await prisma.files.findMany({
    orderBy: {
      created_date: "desc",
    },
    skip: pageSize * (page - 1),
  });

  return (
    <main className="w-full h-full flex flex-col items-center relative overflow-auto">
      <div className="sticky py-4 left-0 top-0 w-full bg-white drop-shadow capitalize items-center justify-center flex text-xl font-bold">
        <h1>Upload a PDF</h1>
      </div>
      <div className="mt-6 w-full flex-1 flex flex-col items-center gap-4">
        <PDFUploader />
        <FilesList files={files || []} />
        <Pagination url="/?page=" total={Math.ceil(total/pageSize)} initialPage={page}/>
      </div>
    </main>
  );
}
