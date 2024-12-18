"use client";

import CataxComp from "@/components/CataxComp";
import DonutChartCrypto from "@/components/DonutChartCrypto";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "giottus", label: "Giottus" },
  { value: "koinbx", label: "Koinbx" },
  { value: "bitbns", label: "Bitbns" },
  { value: "buyucoin", label: "Buyucoin" },
  { value: "coinswitch", label: "Coinswitch" },
  { value: "coinswitch_pro", label: "Coinswitch Pro" },
  { value: "kraken", label: "Kraken" },
  { value: "unocoin", label: "Unocoin" },
  { value: "zebpay", label: "Zebpay" },
];

const accountsData = {
  giottus: [
    {
      label: "SC",
      value: 0.43859639999999445,
    },
    {
      label: "BTC",
      value: 13.972045761120057,
    },
    {
      label: "MATIC",
      value: 792.3299999999999,
    },
    {
      label: "ENJ",
      value: 2.489939999999997,
    },
    {
      label: "USDT",
      value: 8.309999999999945,
    },
    {
      label: "CELO",
      value: 32.018,
    },
    {
      label: "ADA",
      value: 16.33194679999997,
    },
  ],
  koinbx: [
    {
      label: "SC",
      value: 0.21596980000000333,
    },
    {
      label: "BTC",
      value: 10.872945719210051,
    },
    {
      label: "MATIC",
      value: 650.5499999999999,
    },
    {
      label: "ENJ",
      value: 5.392100000000003,
    },
    {
      label: "USDT",
      value: 4.119999999999891,
    },
    {
      label: "CELO",
      value: 28.016,
    },
    {
      label: "ADA",
      value: 11.97203459999998,
    },
  ],
  bitbns: [
    {
      label: "SC",
      value: 1.4395969999999945,
    },
    {
      label: "BTC",
      value: 9.47015761120057,
    },
    {
      label: "MATIC",
      value: 900.12,
    },
    {
      label: "ENJ",
      value: 7.239,
    },
    {
      label: "USDT",
      value: 12.509999999999945,
    },
    {
      label: "CELO",
      value: 50.018,
    },
    {
      label: "ADA",
      value: 20.78946779999997,
    },
  ],
  wazirx: [
    {
      label: "SC",
      value: 0.6395968999999944,
    },
    {
      label: "BTC",
      value: 8.00204571110057,
    },
    {
      label: "MATIC",
      value: 456.32,
    },
    {
      label: "ENJ",
      value: 3.58993999999997,
    },
    {
      label: "USDT",
      value: 6.209999999999894,
    },
    {
      label: "CELO",
      value: 22.018,
    },
    {
      label: "ADA",
      value: 18.33194679999997,
    },
  ],
  coinDCX: [
    {
      label: "SC",
      value: 0.5485962999999944,
    },
    {
      label: "BTC",
      value: 12.345040761210056,
    },
    {
      label: "MATIC",
      value: 620.98,
    },
    {
      label: "ENJ",
      value: 4.989939999999987,
    },
    {
      label: "USDT",
      value: 9.719999999999954,
    },
    {
      label: "CELO",
      value: 35.018,
    },
    {
      label: "ADA",
      value: 14.43194679999996,
    },
  ],
};

export default function Home() {
  const [files, setFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userId, setUserId] = useState("");
  const [dataFields, setDataFields] = useState([]);
  const [uploadedFilesData, setUploadedFilesData] = useState([]);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeAccount, setActiveAccount] = useState("giottus");
  const [accountsData, setAccountsData] = useState([]);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    console.log(files);
  }, [files]);

  const getGraphData = async () => {
    const url = `http://127.0.0.1:8000/get-graph-data?user_id=${userId}`;

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      console.log("Response data:", response.data);
      setAccountsData(response.data);
      activeAccount(response.data[0]);
      setUserId("");
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  const initializeFilesState = (data) => {
    const initialState = data.reduce((acc, exchange) => {
      acc[exchange.exchange_name] = new Array(
        exchange.files_detail.length
      ).fill("");
      return acc;
    }, {});
    setFiles(initialState);
  };

  const handleFileChange = (e, exchange, index) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prevFiles) => {
        const newFiles = { ...prevFiles };
        newFiles[exchange][index] = e.target.files[0];
        return newFiles;
      });
    }
  };

  const handleFileDelete = (exchange, index) => {
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      newFiles[exchange][index] = null;
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_id", userId);

    Object.keys(files).forEach((exchange) => {
      files[exchange].forEach((file, idx) => {
        if (file) formData.append(`files[${exchange}][${idx}]`, file);
      });
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadfiles",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const postData = async () => {
    if (!selectedOptions.length) {
      alert("Please select at least one exchange");
      return;
    }

    const selectedValues = selectedOptions.map((option) => option.value);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/exchanges",
        selectedValues,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      const transformedData = response.data.flatMap((exchange) =>
        exchange.files_detail.map((file) => ({
          exchange: exchange.exchange_name,
          file_type: file.file_type,
          txn_type: file.txn_type,
        }))
      );

      console.log("Transformed Data:", transformedData);
      setUploadedFilesData(transformedData);
      setDataFields(response.data);
      initializeFilesState(response.data);
      setShowModal(true);
      setShowInput(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const uploadFiles = async () => {
    console.log("api called upload files");
    const formData = new FormData();

    // Append the form fields
    formData.append("user_id", userId);
    formData.append("upload_file_data", JSON.stringify(uploadedFilesData));

    // Append the files
    Object.keys(files).forEach((exchange) => {
      files[exchange].forEach((file) => {
        if (file) {
          formData.append("files", file, file.name);
        }
      });
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadfiles",
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log("Response:", response.data);
      setShowModal(false);
      // setUserId("")
      initializeFilesState([]);
      setFiles({});
      setDataFields([]);
      setSelectedOptions([]);
      setUploadedFilesData([]);
      setShowDownloadButton(true);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const downloadPLS = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/download_pls/${userId}`,
        {},
        {
          headers: {
            accept: "application/json",
          },
          responseType: "blob",
        }
      );
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "downloaded_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowDownloadButton(false);
      setShowInput(false);
      getGraphData();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleAccountClick = (account) => {
    setActiveAccount(account);
  };

  const customColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#ffffff"];

  return (
    <>
      <div className="w-full h-20 bg-gray-300 p-4 flex items-center justify-between ">
        <div className="flex items-center  space-x-4  ">
          <Select
            value={selectedOptions}
            onChange={setSelectedOptions}
            options={options}
            isMulti
            className="min-w-52"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold"
            onClick={postData}
          >
            Submit
          </button>
        </div>
        {showInput && (
          <input
            value={userId}
            type="text"
            className="p-2 w-52"
            placeholder="Enter your id"
            onChange={(e) => setUserId(e.target.value)}
          />
        )}
        <div className="">
          {showDownloadButton && (
            <button
              onClick={downloadPLS}
              className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <CataxComp
          handleFileChange={handleFileChange}
          dataFields={dataFields}
          files={files}
          handleSubmit={handleSubmit}
          handleFileDelete={handleFileDelete}
          uploadFiles={uploadFiles}
          uploadProgress={uploadProgress}
        />
      )}

      <div className=""></div>
      <div className="flex gap-10 m-5 ml-[25rem]">
        {Object.keys(accountsData).map((account) => (
          <button
            key={account}
            className={`border border-black p-1 rounded-xl ${
              activeAccount === account ? "bg-blue-200" : ""
            }`}
            onClick={() => handleAccountClick(account)}
          >
            {account}
          </button>
        ))}
      </div>
      <DonutChartCrypto
        data={accountsData[activeAccount]}
        colors={customColors}
        id="total-crypto-chart"
      />
    </>
  );
}
