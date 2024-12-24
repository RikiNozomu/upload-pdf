"use client";
import {
  Pagination as BasePagination,
  PaginationProps as BasePaginationProps,
} from "@nextui-org/pagination";
import { useRouter } from "next/navigation";

interface PaginationProps {
  url: string;
}

export default function Pagination({
  initialPage,
  total,
  url,
}: PaginationProps & BasePaginationProps) {

  const router = useRouter();

  return (
    <BasePagination
      initialPage={initialPage}
      total={total}
      onChange={(page) => router.push(url + page)}
    />
  );
}
