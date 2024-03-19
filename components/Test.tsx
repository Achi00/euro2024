"use client";
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import SpeechToText from "./SpeechToText";
import Image from "next/image";
import Logo from "../utils/Logo.png";
import camera from "../utils/camera.png";
import start from "../utils/start.png";

import DownloadButton from "./Download";
import LightBox from "./LightBox";

import axios from "axios";

import img1 from "../utils/football/img1.png";
import img2 from "../utils/football/img2.png";
// import { bg1 } from "../utils/pages/index";
import bg1 from "../utils/pages/bg1.jpg";
import bg2 from "../utils/pages/bg2.jpg";
import bg3 from "../utils/pages/bg3.webp";
import bg4 from "../utils/pages/bg4.webp";
import bg5 from "../utils/pages/bg5.webp";
import bg6 from "../utils/pages/bg6.webp";
import bg7 from "../utils/pages/bg7.webp";
import bg8 from "../utils/pages/bg8.webp";
// buttons
import btn1 from "../utils/buttons/ btn_next_p1p2.png";
import btnUpload from "../utils/buttons/btn_upload.png";
import btnUploadAgain from "../utils/buttons/btn_try_again.png";

const imageData = [
  {
    id: 1,
    src: img1,
    alt: "Description for Image 1",
    prompt: "superman",
  },
  {
    id: 2,
    src: img2,
    alt: "Description for Image 2",
    prompt: "superman",
  },
  {
    id: 3,
    src: img1,
    alt: "Description for Image 1",
    prompt: "superman",
  },
  {
    id: 4,
    src: img2,
    alt: "Description for Image 2",
    prompt: "superman",
  },
  {
    id: 5,
    src: img1,
    alt: "Description for Image 1",
    prompt: "superman",
  },
  {
    id: 6,
    src: img2,
    alt: "Description for Image 2",
    prompt: "superman",
  },
  {
    id: 7,
    src: img1,
    alt: "Description for Image 1",
    prompt: "superman",
  },
  {
    id: 8,
    src: img2,
    alt: "Description for Image 2",
    prompt: "superman",
  },
];

const Test = () => {
  const [image, setImage] = useState<File | null>(null);
  // for user image preview
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  // enter fields
  const [prompt, setPrompt] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // final image state
  const [resultImage, setResultImage] = useState<string | null>("");
  // easy authentication
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  // steps for show previous or next jsx element
  const [step, setStep] = useState(1);
  // input and microphone togle state
  const [isUsingSpeech, setIsUsingSpeech] = useState(false);
  // show audio text
  const [showAudio, setShoWAudio] = useState("");
  // loading
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const passcodeInputRef = useRef<HTMLInputElement>(null);
  // terms and conditions checking
  const [isChecked, setIsChecked] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [isInfoClosed, setisInfoClosed] = useState(false);
  // check lightbox
  const [isOpen, setIsOpen] = useState(false);

  // change prompt input stlye in case of inappropriate prompt
  const [promptInputClass, setPromptInputClass] =
    useState("normal-input-class");
  // <------------------- new states ------------------->
  //  image id
  const [selectedImageId, setSelectedImageId] = useState<
    number | undefined | null
  >(null);

  // toggle between input and microphone
  const handleToggle = () => {
    setIsUsingSpeech(!isUsingSpeech); // Toggle between input and speech-to-text
  };

  const verifyPasscode = async () => {
    try {
      if (!passcode) {
        toast.error("Please enter password");
      } else {
        const response = await fetch(
          "https://abovedigital-1696444393502.ew.r.appspot.com/verify-passcode",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passcode }),
          }
        );
        if (response.ok) {
          setIsAuthorized(true);
          setStep(2);
          if (passcodeInputRef.current) {
            passcodeInputRef.current.style.border = "initial"; // Reset to initial style
          }
          toast.success("Access granted");
        } else {
          toast.error("Access denied");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  // Handlers for step transitions
  const handleNext = () => {
    if (step < 8) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Function to handle the API response
  const handleResponse = async (response: any) => {
    if (response.ok) {
      const data = await response.json();
      if (data.imageUrl) {
        setResultImage(data.imageUrl);
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Image generation completed!");
      } else {
        console.error("URL not found in response");
        toast.error("URL not found in response");
      }
    } else {
      toast.dismiss(); // Dismiss the loading toast before displaying the error message
      const errorData = await response.json();
      // Check for nested error structure
      const errorMessage =
        errorData.error && errorData.error.error
          ? errorData.error.error
          : errorData.error;

      setErrorMessage(errorMessage);
      switch (errorMessage) {
        case "Each image should have exactly one face.":
          toast.error("Error: Each image should have exactly one face.");
          break;
        case "Multiple faces detected. Only single-face detection is supported.":
          toast.error(
            "Error: Multiple faces detected. Only single-face detection is supported."
          );
          break;
        case "No face detected":
          toast.error("Error: No face detected in the uploaded image.");
          break;
        case "Inappropriate content detected in the prompt.":
          // toast.error("Error: Inappropriate content detected in the prompt.");
          setPromptInputClass("border-2 border-red-700");
          setStep(2);
          break;
        default:
          console.error("Unexpected error:", errorData);
          toast.error("An unexpected error occurred. Please try again later.");
          break;
      }
    }
  };

  //   select image from grid
  const handleSelectImage = (id: number) => {
    setSelectedImageId(id);
    const selectedImage = imageData.find((image) => image.id === id);
    if (selectedImage) {
      setPrompt(selectedImage.prompt);
    }
    console.log(prompt);
  };
  // check name and email
  // const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setName(e.target.value);
  // };

  // const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // };

  // chack image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setResultImage(null);
      toast.success("Image selected");
    }
  };

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled
    // if (!name || !email || !image || !prompt) {
    //   toast.error("All fields are required");
    //   return;
    // }
    if (!image) {
      setErrorMessage("Image missing");
      return;
    }

    // Simple email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   toast.error("Invalid email address");
    //   return;
    // }

    // Only show the loading toast after passing the validation checks

    const formData = new FormData();
    formData.append("userImage", image);
    formData.append("prompt", prompt);
    formData.append("name", name);
    // formData.append("email", email);
    try {
      setLoading(true);
      setPromptInputClass("");
      setErrorMessage("");
      const response = await fetch(
        "https://abovedigital-1696444393502.ew.r.appspot.com/generate-and-swap-face",
        {
          method: "POST",
          body: formData,
        }
      );

      await handleResponse(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Request failed:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  const handleTranscription = (englishTranslation: string) => {
    setPrompt(englishTranslation);
    setShoWAudio(englishTranslation);
  };

  const handleOriginalTranscription = (greekTranscription: string) => {
    // Handle the Greek transcription here
    // console.log("Greek Transcription:", greekTranscription);
  };

  const authorizeError = () => {
    toast.error("Please authorize first");
    if (passcodeInputRef.current) {
      passcodeInputRef.current.style.border = "2px solid red";
      passcodeInputRef.current.focus();
    }
  };

  const handleEmail = async (e: any) => {
    e.preventDefault();

    try {
      setEmailLoading(true);
      const emailResponse = await axios.post(
        "https://abovedigital-1696444393502.ew.r.appspot.com/v1/mail",
        {
          toEmail: email,
          subject: "AI Imaginarium",
          message: "Your Generated Image",
          imageUrl: resultImage,
        }
      );

      console.log("Email sent successfully", emailResponse.data);
      toast.success("Email sent successfully");
      setEmail("");
      setEmailLoading(false);
    } catch (error) {
      console.error("Failed to send email", error);
      toast.error("Failed to send email");
      setEmailLoading(false);
    }
  };

  const startOver = () => {
    setStep(2); // Navigate to the prompt input step
    setResultImage(null);
    setPrompt("");
    setImage(null);
    setImageUrl(undefined);
    setIsChecked(false);
  };

  const CloseInfo = () => {
    setisInfoClosed(true);
  };

  const openLightbox = () => {
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full flex justify-center items-center flex-col gap-[7vmin]">
        <Toaster />

        {errorMessage && (
          <div
            className="flex items-center p-4 mb-4 text-md text-red-800 border border-red-300 rounded-lg fadeIn bg-red-50 "
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          </div>
        )}
        {loading && (
          <div className="fadeIn flex w-full justify-center items-center flex-col gap-5">
            <h2 className="font-bold text-center xl:w-1/4 lg:w-1/4 md:w-1/2 sm:w-1/2 xs:3/4">
              Our Artificial Intelligence System is Creating image by your
              imagination, Please be patient, it takes about 60 seconds
            </h2>
            <button
              disabled
              type="button"
              className="py-4 px-8 me-2 text-lg font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-8 h-8 me-3 text-gray-200 animate-spin "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
              Generating image
            </button>
          </div>
        )}
        {/* password */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <Image className="absolute inset-0" src={bg1} alt="bg1" fill />
            <button
              onClick={handleNext}
              className="absolute z-10 bottom-1/3 right-1/4"
            >
              <Image src={btn1} alt="next" width={250} />
            </button>
          </div>
        )}

        {/* upload field */}
        <div className="flex flex-col gap-5 items-center justify-center w-full">
          {/* enter prompt */}
          {step === 2 && (
            <div className="flex fadeIn justify-center flex-col items-center w-full gap-4 p-3">
              <Image className="absolute inset-0" src={bg2} alt="bg1" fill />
              <div className="relative z-10 top-40 flex flex-col items-center justify-center">
                <div className="grid grid-cols-4 gap-4">
                  {imageData.map((image, index) => (
                    <div
                      key={index}
                      className={`w-full relative border-4 ${
                        selectedImageId === image.id
                          ? "border-red-600"
                          : "border-transparent"
                      }`}
                      onClick={() => handleSelectImage(image.id)}
                    >
                      <Image
                        className="curson-pointer rounded-md"
                        src={image.src}
                        alt={image.alt}
                        width={200}
                        height={300}
                      />
                    </div>
                  ))}
                </div>
                <button
                  disabled={selectedImageId === null}
                  onClick={handleNext}
                  className="relative top-20"
                >
                  <Image src={btn1} alt="next" width={250} />
                </button>
              </div>
              <input
                type="text"
                className={`bg-gray-50 border fadeIn border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block xl:w-3/4 lg:w-full md:w-full sm:full xs:w-[150%] p-2.5 outline-violet-700 ${promptInputClass}`}
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Write your imagination"
              />

              <button
                onClick={handleToggle}
                className=" border border-violet-900 p-2 rounded-md text-black"
              >
                {isUsingSpeech ? "or write your imagination" : "Try Microphone"}
              </button>
            </div>
          )}
          {/* upload image & submit */}
          {step === 3 &&
            (resultImage ? null : imageUrl ? (
              <div className="flex flex-col  gap-10 justify-center items-center">
                <Image className="absolute inset-0" src={bg4} alt="bg4" fill />
                {!loading && (
                  <div className="flex flex-col gap-10 absolute top-1/3 mt-20 right-56">
                    {/* upload again button */}
                    <label className="cursor-pointer">
                      {/* <div className="flex flex-col items-center justify-center pt-5 pb-6"> */}
                      <Image
                        src={btnUploadAgain}
                        alt="camera"
                        width={250}
                        height={30}
                      />
                      {/* </div> */}

                      {/* <h1 className="font-bold text-white">Upload Again</h1> */}

                      {/* prompt input */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                    <button onClick={handleNext}>
                      <Image src={btn1} alt="next" width={250} />
                    </button>
                  </div>
                )}
                <div className="relative left-24 z-10 w-full flex items-center justify-center">
                  {!loading && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "450px" }}
                      className="pt-10"
                    />
                  )}
                </div>
              </div>
            ) : (
              // Render the image upload section when neither imageUrl nor resultImage is set
              <div className="flex flex-col xl:gap-[5vmin] lg:gap-[5vmin] md:gap-[8vmin] sm:gap-[5vmin] xs:gap-[10vmin]  fadeIn items-center justify-center w-[250px]">
                <Image className="absolute inset-0" src={bg3} alt="bg3" fill />
                <div className="relative top-10 left-24">
                  {/* <Image className="" src={btnUpload} alt="upload" width={80} /> */}
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image
                        src={btnUpload}
                        alt="camera"
                        width={80}
                        height={80}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!isChecked}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div
                    id="alert-1"
                    className={`items-center fadeOut p-4 mb-4 text-white font-bold rounded-lg bg-violet-500  ${
                      isInfoClosed ? "hidden" : "flex"
                    }`}
                    role="alert"
                  >
                    <svg
                      className="flex-shrink-0 w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ms-3 text-sm text-white">
                      Make sure nothing is covering your face.
                    </div>
                    <button
                      type="button"
                      className="ms-auto -mx-1.5 -my-1.5  text-white rounded-lg focus:ring-2 inline-flex items-center justify-center h-8 w-8"
                      data-dismiss-target="#alert-1"
                      aria-label="Close"
                      onClick={CloseInfo}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mr-2"
                    />
                    <p className="text-sm">
                      I Agree To{" "}
                      <a
                        href="https://abovedigital.io/privacy-policy/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="text-violet-700 hover:underline decoration-1 cursor-pointer">
                          Terms and Conditions
                        </span>
                      </a>
                    </p>
                  </div>
                  <h1 className="font-bold text-center text-lg">
                    Take Selfie Or Upload Image
                  </h1>
                </div>

                <label
                  className={`flex xl:w-[30vmin] lg:w-[30vmin] md:w-[40vmin] sm:w-full xs:w-full flex-col items-center justify-center  rounded-lg text-center ${
                    isChecked
                      ? "bg-violet-600 cursor-pointer "
                      : "bg-violet-300 cursor-not-allowed"
                  } `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Image src={camera} alt="camera" width={40} height={40} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!isChecked}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ))}

          {step === 3 && resultImage && (
            <div className="flex flex-col gap-5 ">
              <div className="flex gap-5 xl:flex-row md:flex-row sm:flex-col xs:flex-col">
                <button
                  className="flex gap-2 items-center bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 border border-violet-900 rounded-lg"
                  onClick={startOver}
                >
                  <Image src={start} alt="start" width={25} height={25} />
                  Start Over
                </button>
                <DownloadButton imageUrl={resultImage} />
              </div>
              <div className="flex flex-col gap-2">
                {/* <label htmlFor="email" className="font-bold">
                  Email:
                </label> */}
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-violet-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <button
                  className={`flex gap-2 items-center justify-center  text-white font-bold py-2 px-4 border border-violet-900 rounded-lg ${
                    !email
                      ? "bg-gray-500 hover:bg-gray-600 cursor-not-allowed"
                      : "bg-violet-500 hover:bg-violet-700"
                  }`}
                  type="button"
                  disabled={!email || emailLoading}
                  onClick={handleEmail}
                >
                  Send Image
                </button>
              </div>
            </div>
          )}

          {/* user image preview */}

          {resultImage && (
            <>
              <Image
                className="rounded-lg cursor-pointer border-3 border-violet-950"
                width={750}
                height={400}
                src={resultImage}
                alt="Result"
                onClick={() => openLightbox()}
              />
              {isOpen && (
                <LightBox isOpen={isOpen} onClose={closeLightbox}>
                  <Image
                    className="rounded-lg"
                    width={750}
                    height={400}
                    src={resultImage}
                    alt="Result"
                  />
                </LightBox>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex gap-5 pb-5 pt-2">
        {/* Navigation Buttons */}
        {step > 1 && (step !== 2 || !isAuthorized) && !resultImage && (
          <button
            className={`${
              loading
                ? "bg-violet-300 cursor-not-allowed"
                : "bg-violet-500 hover:bg-violet-700"
            } text-white font-bold py-2 px-4 border border-violet-900 rounded-lg w-[90px]`}
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </button>
        )}
        {step < 3 && !resultImage && (
          <button
            className={`py-2 px-4 border border-violet-900 rounded-lg w-[90px] font-bold ${
              (step === 1 && !isAuthorized) ||
              (step === 2 && prompt.trim() === "") ||
              (step === 3 && !imageUrl)
                ? "bg-violet-300 text-white cursor-not-allowed"
                : "bg-violet-500 hover:bg-violet-700 text-white"
            }`}
            onClick={handleNext}
            disabled={
              (step === 1 && !isAuthorized) ||
              (step === 2 && prompt.trim() === "") ||
              (step === 3 && !imageUrl)
            }
          >
            Next
          </button>
        )}
        {step === 3 && !resultImage && (
          <button
            className={`  text-white font-bold py-2 px-4 border border-violet-900 rounded-lg ${
              loading
                ? "cursor-not-allowed bg-violet-300"
                : "cursor-pointer bg-violet-500 hover:bg-violet-700"
            }`}
            onClick={isAuthorized ? handleSubmit : authorizeError}
            disabled={!isAuthorized || loading}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;
