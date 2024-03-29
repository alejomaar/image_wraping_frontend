import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const postData = async (src_points) => {
  const data = {
    url: "https://st4.depositphotos.com/22295624/24375/i/600/depositphotos_243751562-stock-photo-3d-soccer-football-concept.jpg",
    src_points: src_points,
    width: 900,
    height: 600,
  };

  const url = "https://us-east1-nth-micron-411415.cloudfunctions.net/function";
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1ZTU1MTA3NDY2YjdlMjk4MzYxOTljNThjNzU4MWY1YjkyM2JlNDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0MTYwNzc3NjQ3MjUzNTg4MTM1IiwiZW1haWwiOiJkZW1vbm1hYXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJoRG9jMlJkNjFYYzZIWWN6VXJiOEJBIiwibmJmIjoxNzA2NDk4Mzk4LCJpYXQiOjE3MDY0OTg2OTgsImV4cCI6MTcwNjUwMjI5OCwianRpIjoiNzczNDdmMWUzMmU5ODVkM2VkYTA2MzM1YjZiMmU1YmI4NDdiNTQ1MSJ9.vyPbMvMAnPUNwlUpPoM1BORv9tpac5mfW_4mNFcSVrVrwcTSsM6APukKwqpYNuonWCQt3u9cPjK7beb6aFbiL9NvP-SgzjcxRFSEm9LRC0cnOvr4U9EsWYuu4dMjgUmh-Cjdg2VDMbvyJIrQMywaLLw9ckIjCuEJNwHmmv6lXjeBpSIiPWPpy3G_bkNyajEB813-ll2DugvfeXo49cQalmM9nvGkSRNkQBZT2GrFXSuOSOKRmjKUJJadMReCITwhomFHm4uE2RBsyQLnk8sGQw_ZDFDHQ3gb0a5Z1_8q6LbJVG8VtsVmXNYhUQ-TsjxyxqA8PKe4xq82ALPvoLAfEQ",
  };

  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: "blob", // Important to handle the response as a Blob
    });
    const urlBlob = URL.createObjectURL(new Blob([response.data]));
    return urlBlob;
    //document.getElementById("yourImageId").src = urlBlob; // Assuming you have an img tag with id='yourImageId'
  } catch (error) {
    console.log(error);
  }
};

const DraggablePoint = ({ id, x, y, onMouseDown }) => {
  const ref = useRef(null);

  const [coordinate, setCoordinate] = useState({ x: x, y: y });

  const handleMouseDown = useCallback((event) => {
    const point = ref.current;
    point.style.position = "absolute";
    point.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
      point.style.left = pageX - point.offsetWidth / 2 + "px";
      point.style.top = pageY - point.offsetHeight / 2 + "px";
      //console.log("i:", pageX, point.offsetWidth);

      setCoordinate(() => point.style.left, point.style.top);
      onMouseDown(pageX, pageY);
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    point.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      point.onmouseup = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="draggable-point"
      onMouseDown={handleMouseDown}
      style={{
        width: "20px",
        height: "20px",
        left: coordinate.x,
        top: coordinate.y,
        backgroundColor: "#f7a5a566",
        borderRadius: "50%",
        position: "absolute",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "3px",
          height: "3px",
          backgroundColor: "white",
          borderRadius: "50%",
          position: "absolute",
          cursor: "pointer",
        }}
      ></div>
    </div>
  );
};

function App() {
  const [coordinates, setCoordinates] = useState(Array(4).fill({ x: 0, y: 0 }));
  const [imageUrl, setImageUrl] = useState(null);
  const imgRef = useRef(null);
  const [reRender, setReRender] = useState(0);

  const imageRequest = async () => {
    const normCoordinates = coordinates.map((coord) => [
      (coord.x - imgRef.current.offsetLeft) / imgRef.current.offsetWidth,
      (coord.y - imgRef.current.offsetTop) / imgRef.current.offsetHeight,
    ]);
    //console.log(normCoordinates);
    const urlBlob = await postData(normCoordinates);
    setImageUrl(urlBlob);
  };

  useEffect(() => {
    const updateInitialCoordinates = () => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
        imgRef.current;
      setCoordinates([
        { x: offsetLeft, y: offsetTop },
        { x: offsetLeft + offsetWidth, y: offsetTop },
        { x: offsetLeft, y: offsetTop + offsetHeight },
        { x: offsetLeft + offsetWidth, y: offsetTop + offsetHeight },
      ]);
      setReRender((x) => x + 1);
    };

    // Ensure the image is loaded before setting coordinates
    imgRef.current.addEventListener("load", updateInitialCoordinates);
    return () =>
      imgRef.current.removeEventListener("load", updateInitialCoordinates);
  }, []);

  return (
    <div className="flex flex-col sm:w-full md:w-9/12 lg:min-w-md mx-auto ">
      <div className="bg-white rounded-lg p-4 shadow-lg sm:m-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-semibold text-gray-700 mb-5 mx-auto">
            Image Wrapping
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="width"
            type="text"
          />
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="height"
            type="text"
          />

          <button
            onClick={imageRequest}
            className="w-full sm:w-auto px-6 py-2 mx-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none"
          >
            Process
          </button>
        </div>
        <div className="flex flex-wrap justify-between ">
          <div
            style={{ backgroundColor: "#f9fafb" }}
            className="h-full w-[48%] rounded-lg border-gray-300 border-2 p-2"
          >
            <div className=" inline-block">
              <img
                ref={imgRef}
                src="https://st4.depositphotos.com/22295624/24375/i/600/depositphotos_243751562-stock-photo-3d-soccer-football-concept.jpg"
                srcset=""
                className="w-96 select-none pointer-events-none"
              />

              {coordinates.map((coord, index) => (
                <DraggablePoint
                  key={`point${index}${reRender}`}
                  id={`point${index}`}
                  {...coord}
                  onMouseDown={(x, y) => {
                    console.log(x, y);
                    const coordinatesCopy = [...coordinates];
                    coordinatesCopy[index].x = x;
                    coordinatesCopy[index].y = y;
                    setCoordinates(coordinatesCopy);
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{ backgroundColor: "#f9fafb" }}
            className="w-[48%] rounded-lg border-gray-300 border-2 p-2 "
          >
            <div className="w-full h-full inline-block relative">
              {imageUrl && (
                <img
                  src={imageUrl}
                  className=" absolute max-h-full max-w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  alt="Response Image"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex my-3">
          <h3 className="italic ">Points</h3>
        </div>
        <div className="flex flex-col justify-between rounded-lg  pt-1 mx-auto">
          <div className="rounded-tl-md rounded-tr-md flex max-w-lg flex  text-sm ">
            <div className="font-bold rounded-tl-md outline-1 outline outline-gray-300 flex-[1]  p-1 flex justify-center items-center"></div>
            <div className="font-bold outline-1 outline outline-gray-300 flex-[1]  p-1 flex justify-center items-center">
              top left
            </div>
            <div className="font-bold outline-1 outline outline-gray-300 flex-[1]  p-1 flex justify-center items-center">
              top right
            </div>
            <div className="font-bold outline-1 outline outline-gray-300 flex-[1]  p-1 flex justify-center items-center">
              bottom left
            </div>
            <div className="font-bold rounded-tr-md outline-1 outline outline-gray-300 flex-[1]  p-1 flex justify-center items-center">
              bottom right
            </div>
          </div>
          <div
            style={{ backgroundColor: "#f9fafb" }}
            className="flex max-w-lg flex"
          >
            <div className="font-bold outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              x
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              1
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              2
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              3
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              4
            </div>
          </div>
          <div
            style={{ backgroundColor: "#f9fafb" }}
            className="flex max-w-lg flex"
          >
            <div className="font-bold outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              y
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              1
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              2
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              3
            </div>
            <div className="outline-1 outline outline-gray-300 flex-[1] p-1 flex justify-center items-center">
              4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
