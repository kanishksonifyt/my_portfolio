import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [response, setresponse] = useState("");
  const [loader, setloader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://about-me-update-1.onrender.com/send-email",
        formData
      );
      setresponse("Email sent successfully");
      if (response === "Email sent successfully") {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          message: "",
        });
        setloader(false);
      }
      // Optionally handle success response here
    } catch (error) {
      setresponse("Failed to send email");
      if (error) {
        setloader(false);
      }
      // Optionally handle error response here
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkvalue = () => {
    setloader(true);
    setTimeout(() => {
      setresponse("");
    }, 7000);
  };
  const settingresponsenull = () => {
    setresponse("");
    setloader(false);
  };

  return (
    <div className="w-full h-fit min-h-[70vh] flex relative  justify-center items-center">
      {response && (
        <div className="w-[250px] gap-5 animate-bounce text-xl  font-semibold  h-[100px] text-center bg-zinc-900 rounded-lg border-2 border-white  flex justify-center items-center    absolute top-0">
          {" "}
          <div>{response}</div>
          <button
            onClick={settingresponsenull}
            className="text-black bg-white px-2 py-1 font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
            </svg>
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-2/4 max-md:w-full gap-5 justify-center items-center"
      >
        <div className="formin w-full flex gap-3 flex-col">
          <fieldset className="border-2 border-white rounded-lg p-4">
            <legend className="text-xl">Enter your name</legend>
            <div className="text-xl">
              <input
                type="text"
                className="h-16 text-xl bg-transparent w-full rounded-lg border-2 border-white outline-none px-4"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <fieldset className="border-2 border-white rounded-lg p-4">
            <legend className="text-xl">Enter your email</legend>
            <input
              type="email"
              className="h-16 text-xl bg-transparent w-full rounded-lg border-2 border-white outline-none px-4"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="border-2 border-white rounded-lg p-4">
            <legend className="text-xl">Enter your mobile number</legend>
            <input
              type="number"
              className="h-16 text-xl bg-transparent w-full rounded-lg border-2 border-white outline-none px-4"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </fieldset>
          <p className="text-xl">Enter a message (if any)</p>
          <textarea
            className="h-[20vh] text-xl bg-transparent w-full  rounded-lg border-white outline-none border-2"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <input
          type="submit"
          onClick={checkvalue}
          className="h-fit w-full  cursor-pointer  text-xl bg-white rounded-full border-none px-8 text-black"
          value={loader ? "wait for submit " : "Contact"}
        />
      </form>
    </div>
  );
};

export default Contact;
