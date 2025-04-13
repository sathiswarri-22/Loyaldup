"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import InvoicePage from "./InvoicePage";

const Workvisit = () => {
  const [workvisit, setWorkvisit] = useState({
    name: "",
    companyName: "",
    clientName: "",
    Eid: "",
    Date: "",
    Location: "",
    MachineName: "",
    ProductDescription: "",
    Problems: [{ description: "" }],
    Assessment: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = localStorage.getItem("admintokens");
  const clientName = searchParams.get("clientName");
  const companyName = searchParams.get("companyName");
  const Eid = localStorage.getItem("idstore");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/getname?Eid=${Eid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const savename = response.data.name;

        const address = searchParams.get("Address") || "";
        const country = searchParams.get("Country") || "";
        const city = searchParams.get("City") || "";
        const postalCode = searchParams.get("PostalCode") || "";
        const state = searchParams.get("State") || "";

        const fullAddress = [address, city, state, postalCode, country]
          .filter(Boolean)
          .join(", ");

        if (savename) {
          setWorkvisit((prevState) => ({
            ...prevState,
            name: savename,
            clientName: clientName || prevState.clientName,
            companyName: companyName || prevState.companyName,
            Location: fullAddress || prevState.Location,
            Eid: Eid || prevState.Eid,
          }));
        }
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, [clientName, companyName, Eid, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("Problem-")) {
      const index = parseInt(name.split("-")[1]);
      const updatedProblems = [...workvisit.Problems];
      updatedProblems[index].description = value;

      setWorkvisit((prevState) => ({
        ...prevState,
        Problems: updatedProblems,
      }));
    } else {
      setWorkvisit((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addProblem = () => {
    setWorkvisit((prevState) => ({
      ...prevState,
      Problems: [...prevState.Problems, { description: "" }],
    }));
  };

  const removeProblem = (index) => {
    const updatedProblems = workvisit.Problems.filter((_, i) => i !== index);
    setWorkvisit((prevState) => ({
      ...prevState,
      Problems: updatedProblems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, Eid, companyName, clientName, Location, Problems } = workvisit;

    if (
      !Eid ||
      !name ||
      !companyName ||
      !clientName ||
      !Location ||
      Problems.some((p) => !p.description)
    ) {
      setErrorMessage("Please fill in all required fields, including all problems.");
      return;
    }

    if (!token) {
      alert("No token found. Please login as an admin.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5005/api/service-project",
        workvisit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      alert("Successfully submitted");

      
    } catch (err) {
      console.error("Submission Error:", err.response || err);
      alert(
        err.response?.data?.message || "Something went wrong, please try again later."
      );
    }
  };

  const handleNavigate = () => {
    router.push("/ServiceProject/Dasboard");
  };

  if (isSubmitted) {
    return <InvoicePage workvisit={workvisit} setWorkvisit={setWorkvisit} setIsSubmitted={setIsSubmitted} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-semibold text-teal-700 text-center">
          Work Visit Entry
        </h1>
        <button
          onClick={handleNavigate}
          className="p-3 bg-white text-black rounded-full shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        >
          <ChevronLeft size={24} />
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Your Name:</label>
              <input
                name="name"
                value={workvisit.name}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Employee ID:</label>
              <input
                name="Eid"
                value={workvisit.Eid}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Company Name:</label>
              <input
                name="companyName"
                value={workvisit.companyName}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Client Name:</label>
              <input
                name="clientName"
                value={workvisit.clientName}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Date:</label>
              <input
                type="date"
                name="Date"
                value={workvisit.Date}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Location:</label>
              <input
                name="Location"
                value={workvisit.Location}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Machine Name:</label>
              <input
                name="MachineName"
                value={workvisit.MachineName}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Product Description:</label>
              <input
                name="ProductDescription"
                value={workvisit.ProductDescription}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Problems:</label>
              {workvisit.Problems.map((problem, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <input
                    name={`Problem-${index}`}
                    value={problem.description}
                    onChange={handleChange}
                    placeholder={`Problem ${index + 1}`}
                    required
                    className="px-4 py-2 border rounded-lg flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeProblem(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProblem}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Problem
              </button>
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Assessment:</label>
              <textarea
                name="Assessment"
                value={workvisit.Assessment}
                onChange={handleChange}
                required
                className="px-4 py-3 mt-2 border rounded-lg"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition duration-300"
          >
            Submit
          </button>
          <button
            onClick={()=>setIsSubmitted(true)}
            className="w-full py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition duration-300"
          >
            PDF Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default Workvisit;
