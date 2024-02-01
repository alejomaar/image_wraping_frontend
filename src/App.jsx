import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const postData = async (src_points) => {
  const data = {
    url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fe%2Fe2%2FA_studio_image_of_a_hand_of_playing_cards._MOD_45148377.jpg&f=1&nofb=1&ipt=982488faf2b7b347563830f58c00e7503ef6c18b387d23ae5d7bad3ab658b215&ipo=images",
    src_points: src_points,
    width: 600,
    height: 800,
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
  const [coordinates, setCoordinates] = useState([
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
  ]);
  const [ready, setready] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const ref = useRef(null);

  const imageRequest = async () => {
    console.log(ref.current.offsetWidth, ref.current.offsetLeft);

    const normCoordinates = coordinates.map((coord) => [
      (coord.x - ref.current.offsetLeft) / ref.current.offsetWidth,
      (coord.y - ref.current.offsetTop) / ref.current.offsetHeight,
    ]);
    //console.log(normCoordinates);
    const urlBlob = await postData(normCoordinates);
    setImageUrl(urlBlob);
  };

  useEffect(() => {
    window.addEventListener(
      "load",
      function () {
        setCoordinates([
          {
            x: ref.current.offsetLeft,
            y: ref.current.offsetTop,
          },
          {
            x: ref.current.offsetLeft + ref.current.offsetWidth,
            y: ref.current.offsetTop,
          },
          {
            x: ref.current.offsetLeft,
            y: ref.current.offsetTop + ref.current.offsetHeight,
          },
          {
            x: ref.current.offsetLeft + ref.current.offsetWidth,
            y: ref.current.offsetTop + ref.current.offsetHeight,
          },
        ]);
        setready(true);
      },
      false
    );
  }, []);

  return (
    <div className="flex flex-col sm:w-full md:w-9/12 lg:min-w-md mx-auto ">
      <div className="bg-white rounded-lg p-4 shadow-lg sm:m-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-700">
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
          <div className="h-full w-[45%] rounded-lg border-gray-300 border-2 p-2">
            <div className=" inline-block">
              {/* Placeholder for image */}
              {/*               <span className="text-purple-500" style={{ zIndex: 1 }}>Image Preview</span>
               */}
              <img
                ref={ref}
                src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fe%2Fe2%2FA_studio_image_of_a_hand_of_playing_cards._MOD_45148377.jpg&f=1&nofb=1&ipt=982488faf2b7b347563830f58c00e7503ef6c18b387d23ae5d7bad3ab658b215&ipo=images"
                alt=""
                srcset=""
                className="w-96 select-none pointer-events-none"
              />

              {ready && (
                <>
                  <DraggablePoint
                    id="point1"
                    x={coordinates[0].x + "px"}
                    y={coordinates[0].y + "px"}
                    onMouseDown={(x, y) => {
                      const coordinatesCopy = [...coordinates];
                      coordinatesCopy[0].x = x;
                      coordinatesCopy[0].y = y;
                      setCoordinates(coordinatesCopy);
                    }}
                  />
                  <DraggablePoint
                    id="point2"
                    x={coordinates[1].x + "px"}
                    y={coordinates[1].y + "px"}
                    onMouseDown={(x, y) => {
                      const coordinatesCopy = [...coordinates];
                      coordinatesCopy[1].x = x;
                      coordinatesCopy[1].y = y;
                      setCoordinates(coordinatesCopy);
                    }}
                  />
                  <DraggablePoint
                    id="point3"
                    x={coordinates[2].x + "px"}
                    y={coordinates[2].y + "px"}
                    onMouseDown={(x, y) => {
                      const coordinatesCopy = [...coordinates];
                      coordinatesCopy[2].x = x;
                      coordinatesCopy[2].y = y;
                      setCoordinates(coordinatesCopy);
                    }}
                  />
                  <DraggablePoint
                    id="point4"
                    x={coordinates[3].x + "px"}
                    y={coordinates[3].y + "px"}
                    onMouseDown={(x, y) => {
                      const coordinatesCopy = [...coordinates];
                      coordinatesCopy[3].x = x;
                      coordinatesCopy[3].y = y;
                      setCoordinates(coordinatesCopy);
                    }}
                  />
                </>
              )}
            </div>
          </div>
          <div className="w-[45%] rounded-lg border-gray-300 border-2 p-2">
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

        {/* <div className="flex flex-col  justify-between rounded-lg w-32 pt-1 mx-auto">
          <div className="flex w-32 bg-purple-500">
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              x
            </div>
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              y
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[0].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[0].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-100 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[1].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[1].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[2].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[2].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[3].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[3].y}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default App;
