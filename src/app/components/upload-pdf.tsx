"use client";

import { useEffect, useState, useTransition } from "react";
import { Document, pdfjs, Thumbnail } from "react-pdf";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Link from "next/link";
import { uploadPDF } from "../actions/upload-pdf";
import { fileToBase64 } from "../helpers";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PDFUploader() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filename, setFilename] = useState("");

  const handleSubmit = (file?: File) => {
    startTransition(async () => {
      if (!file && !pdfFile) return;

      const decodeFile = await fileToBase64(file || pdfFile!);
      const result = await uploadPDF({
        file: decodeFile,
        password,
      });

      if (result.error) {
        setPdfFile(null);
        setError(result.error);
      } else {
        setFilename(result.filename);
      }

      return result;
    });
  };

  const checkIfEncrypted = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      await pdfjs.getDocument({
        data: arrayBuffer,
        password: "",
      }).promise;
      setPassword("")
      setPdfFile(file);
      handleSubmit(file);
    } catch (error: any) {
      if (error.name === "PasswordException") {
        setIsEncrypted(true);
        setPdfFile(file);
      } else {
        setError("Invalid PDF file");
      }
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    await checkIfEncrypted(file);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: false,
      minSize: 1,
      maxSize: 5242880,
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      setError(fileRejections.map((file) => file.errors[0].message).join(", "));
    }
  }, [fileRejections]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      await pdfjs.getDocument({
        data: arrayBuffer,
        password,
      }).promise;
      setIsEncrypted(false);
      handleSubmit();
    } catch (error) {
      setError("Incorrect password");
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 gap-4 flex flex-col items-center">
      {error && (
        <div className="text-white bg-red-500 text-center mt-2 flex flex-row justify-center relative w-full">
          <p className="">{error}</p>
          <button
            className="absolute right-2"
            onClick={() => {
              setError("");
            }}
          >
            X
          </button>
        </div>
      )}
      {!pdfFile && !isPending && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF here...</p>
          ) : (
            <p>Drag & drop a PDF here, or click to select one</p>
          )}
        </div>
      )}

      {isEncrypted && !isPending && (
        <div className="flex flex-col gap-4">
          <b className="w-full text-center">
            This file has encrypted, Please enter a password.
          </b>
          <form
            onSubmit={handlePasswordSubmit}
            className="mt-4 flex flex-row gap-4 justify-center"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF password"
              className="border p-2 rounded mr-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Password
            </button>
          </form>
        </div>
      )}

      {pdfFile && !isEncrypted && !error && !isPending && (
        <div className="m-4 flex flex-col gap-4">
          <Document
            file={pdfFile}
            error={<p>Failed to load PDF</p>}
            loading={<p>Loading PDF...</p>}
            onPassword={(callback) => callback(password)}
            className={`border border-gray-300 rounded-lg pointer-events-none`}
          >
            <Thumbnail pageNumber={1} />
          </Document>
          <Link href={filename} target="_blank">
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full truncate">
              {filename}
            </button>
          </Link>
        </div>
      )}

      {pdfFile && (
        <button
          onClick={() => {
            setPdfFile(null);
            setError("");
            setIsEncrypted(false);
            setPassword("");
          }}
          className="bg-orange-400 w-fit p-2 rounded disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "loading..." : "Reset"}
        </button>
      )}
    </div>
  );
}
