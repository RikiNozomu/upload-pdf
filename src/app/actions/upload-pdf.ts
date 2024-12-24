"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";

export const uploadPDF = async ({
  file,
  password
}: {
  file: string;
  password?: string;
}) => {
  if (!file) return;

  return await fetch( process.env.UPLOAD_PDF_URL || '', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file, password : password || '' }),
  })
    .then(async (res) => {
      const data = await res.json();
      await prisma.files.create({ data: { s3_url: data.filename , created_date : new Date() } });

      revalidatePath("/");
      return data;
    })
    .catch((err) => ({ error : err.message }) );
  
};
